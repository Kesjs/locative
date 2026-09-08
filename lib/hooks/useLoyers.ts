import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

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
    mutationFn: async (payload: { id: string; methode: LoyerTransaction["methode"] }) => {
      // Mettre à jour en local
      const local = getLocalLoyers();
      const updatedLocal = local.map((l) =>
        l.id === payload.id
          ? { ...l, statut: "payé" as const, methode: payload.methode, date_reglement: new Date().toISOString() }
          : l
      );
      saveLocalLoyers(updatedLocal);

      if (!isSupabaseConfigured()) {
        return { success: true };
      }

      const supabase = createClient();
      try {
        const { data, error } = await supabase
          .from("loyers_transactions")
          .update({ statut: "payé", methode: payload.methode, date_reglement: new Date().toISOString() })
          .eq("id", payload.id)
          .select()
          .single();

        if (error) {
          throw new Error(`Erreur lors de l'encaissement: ${error.message}`);
        }
        // Mise à jour du cache local de confort seulement après succès réel Supabase
        const local = getLocalLoyers();
        const updatedLocal = local.map((l) =>
          l.id === payload.id
            ? { ...l, statut: "payé" as const, methode: payload.methode, date_reglement: new Date().toISOString() }
            : l
        );
        saveLocalLoyers(updatedLocal);
        return data;
      } catch (err: any) {
        throw new Error(err?.message || "Impossible de valider l'encaissement.");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyers"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard_stats"] });
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
      queryClient.invalidateQueries({ queryKey: ["dashboard_stats"] });
    },
  });
}
