import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { uploadPaymentProof } from "@/lib/upload-payment-proof";

export interface LoyerTransaction {
  id: string;
  locataire_nom: string;
  bien_nom: string;
  bien_id?: string | null;
  montant: number;
  methode: "MTN MoMo" | "Moov Money" | "Espèces" | "Virement";
  statut: "payé" | "en_attente" | "retard";
  quittance_url?: string;
  date_reglement?: string;
  echeance: string;
  reference_paiement?: string | null;
  preuve_url?: string | null;
}

const LOCAL_LOYERS_KEY = "lokka_loyers_cache";

function getLocalLoyers(): LoyerTransaction[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_LOYERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

function saveLocalLoyers(loyers: LoyerTransaction[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_LOYERS_KEY, JSON.stringify(loyers));
  } catch (_) {}
}

export function useLoyers() {
  return useQuery({
    queryKey: ["loyers"],
    queryFn: async (): Promise<LoyerTransaction[]> => {
      const local = getLocalLoyers();

      if (!isSupabaseConfigured()) {
        return local;
      }
      const supabase = createClient();
      try {
        const { data, error } = await supabase
          .from("loyers_transactions")
          .select("*")
          .order("echeance", { ascending: false });

        if (error) {
          // Fallback silencieux sur le cache local
          return local;
        }
        return (data as LoyerTransaction[]) || local;
      } catch {
        return local;
      }
    },
  });
}

export function useEncaisserLoyer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      id: string;
      methode: LoyerTransaction["methode"];
      reference_paiement?: string;
      preuveFile?: File | null;
    }) => {
      // Mettre à jour en local
      const local = getLocalLoyers();
      const updatedLocal = local.map((l) =>
        l.id === payload.id
          ? {
              ...l,
              statut: "payé" as const,
              methode: payload.methode,
              date_reglement: new Date().toISOString(),
              reference_paiement: payload.reference_paiement || l.reference_paiement,
            }
          : l
      );
      saveLocalLoyers(updatedLocal);

      if (!isSupabaseConfigured()) {
        return { success: true };
      }

      const supabase = createClient();
      try {
        let preuve_url: string | undefined;
        if (payload.preuveFile) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            preuve_url = await uploadPaymentProof(payload.preuveFile, user.id);
          }
        }

        const updatePayload: Record<string, any> = {
          statut: "payé",
          methode: payload.methode,
          date_reglement: new Date().toISOString(),
        };
        if (payload.reference_paiement) updatePayload.reference_paiement = payload.reference_paiement;
        if (preuve_url) updatePayload.preuve_url = preuve_url;

        const { data, error } = await supabase
          .from("loyers_transactions")
          .update(updatePayload)
          .eq("id", payload.id)
          .select()
          .single();

        if (error) {
          throw new Error(`Erreur lors de l'encaissement: ${error.message}`);
        }
        // Mise à jour du cache local de confort seulement après succès réel Supabase
        const local = getLocalLoyers();
        const updatedLocal = local.map((l) =>
          l.id === payload.id ? { ...l, ...(data as LoyerTransaction) } : l
        );
        saveLocalLoyers(updatedLocal);
        return data;
      } catch (err: any) {
        throw new Error(err?.message || "Impossible de valider l'encaissement.");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyers"] });
    },
  });
}

export function useUpdatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      id: string;
      locataire_nom: string;
      bien_nom: string;
      montant: number;
      methode: LoyerTransaction["methode"];
      date_reglement?: string;
      reference_paiement?: string | null;
    }) => {
      if (!isSupabaseConfigured()) {
        const local = getLocalLoyers();
        const updatedLocal = local.map((l) => (l.id === payload.id ? { ...l, ...payload } : l));
        saveLocalLoyers(updatedLocal);
        return { ...payload };
      }

      const supabase = createClient();

      // Garde-fou : un paiement pour lequel une quittance certifiée a déjà
      // été délivrée ne doit pas être modifié silencieusement — l'obligation
      // légale (Loi 2022-30) est que la quittance reflète fidèlement le
      // règlement effectif. On bloque la correction dans ce cas.
      const { data: existing, error: fetchError } = await supabase
        .from("loyers_transactions")
        .select("quittance_url")
        .eq("id", payload.id)
        .single();

      if (fetchError) {
        throw new Error(`Erreur lors de la vérification du paiement: ${fetchError.message}`);
      }
      if (existing?.quittance_url) {
        throw new Error(
          "Une quittance certifiée a déjà été émise pour ce paiement : il ne peut plus être modifié."
        );
      }

      const { data, error } = await supabase
        .from("loyers_transactions")
        .update({
          locataire_nom: payload.locataire_nom,
          bien_nom: payload.bien_nom,
          montant: payload.montant,
          methode: payload.methode,
          date_reglement: payload.date_reglement,
          reference_paiement: payload.reference_paiement || null,
        })
        .eq("id", payload.id)
        .select()
        .single();

      if (error) {
        throw new Error(`Erreur lors de la correction du paiement: ${error.message}`);
      }

      const local = getLocalLoyers();
      saveLocalLoyers(local.map((l) => (l.id === payload.id ? { ...l, ...(data as LoyerTransaction) } : l)));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyers"] });
    },
  });
}

export function useDeletePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!isSupabaseConfigured()) {
        const local = getLocalLoyers();
        saveLocalLoyers(local.filter((l) => l.id !== id));
        return true;
      }

      const supabase = createClient();

      const { data: existing, error: fetchError } = await supabase
        .from("loyers_transactions")
        .select("quittance_url")
        .eq("id", id)
        .single();

      if (fetchError) {
        throw new Error(`Erreur lors de la vérification du paiement: ${fetchError.message}`);
      }
      if (existing?.quittance_url) {
        throw new Error(
          "Une quittance certifiée a déjà été émise pour ce paiement : il ne peut plus être supprimé."
        );
      }

      const { error } = await supabase.from("loyers_transactions").delete().eq("id", id);
      if (error) {
        throw new Error(`Erreur lors de la suppression du paiement: ${error.message}`);
      }

      const local = getLocalLoyers();
      saveLocalLoyers(local.filter((l) => l.id !== id));
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyers"] });
    },
  });
}

export function useAddPaymentDirect() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      bien_nom: string;
      bien_id?: string | null;
      locataire_nom: string;
      montant: number;
      methode: LoyerTransaction["methode"];
      echeance?: string;
      reference_paiement?: string;
      preuveFile?: File | null;
    }) => {
      if (!isSupabaseConfigured()) {
        const local = getLocalLoyers();
        const newTx: LoyerTransaction = {
          id: "tx_" + Date.now().toString(36),
          bien_nom: payload.bien_nom,
          bien_id: payload.bien_id || null,
          locataire_nom: payload.locataire_nom,
          montant: payload.montant,
          methode: payload.methode,
          statut: "payé",
          date_reglement: new Date().toISOString(),
          echeance: payload.echeance || new Date().toISOString().split("T")[0],
          reference_paiement: payload.reference_paiement || null,
        };
        saveLocalLoyers([newTx, ...local]);
        return newTx;
      }

      const supabase = createClient();
      try {
        const { data: { user } } = await supabase.auth.getUser();
        let orgId: string | null = null;
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("organization_id")
            .eq("id", user.id)
            .maybeSingle();
          orgId = profile?.organization_id || null;
        }

        let preuve_url: string | undefined;
        if (payload.preuveFile && user) {
          preuve_url = await uploadPaymentProof(payload.preuveFile, user.id);
        }

        const insertPayload: Record<string, any> = {
          bien_nom: payload.bien_nom,
          bien_id: payload.bien_id || null,
          locataire_nom: payload.locataire_nom,
          montant: payload.montant,
          methode: payload.methode,
          statut: "payé",
          date_reglement: new Date().toISOString(),
          echeance: payload.echeance || new Date().toISOString().split("T")[0],
        };
        if (orgId) insertPayload.organization_id = orgId;
        if (payload.reference_paiement) insertPayload.reference_paiement = payload.reference_paiement;
        if (preuve_url) insertPayload.preuve_url = preuve_url;

        const { data, error } = await supabase
          .from("loyers_transactions")
          .insert([insertPayload])
          .select()
          .single();

        if (error) {
          throw new Error(`Erreur lors de l'enregistrement du paiement: ${error.message}`);
        }
        
        const local = getLocalLoyers();
        saveLocalLoyers([data as LoyerTransaction, ...local]);
        return data;
      } catch (err: any) {
        throw new Error(err?.message || "Échec de l'enregistrement du paiement.");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyers"] });
    },
  });
}
