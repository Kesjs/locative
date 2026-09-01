import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export interface LoyerTransaction {
  id: string;
  locataire_nom: string;
  bien_nom: string;
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

        if (error) return { success: true };
        return data;
      } catch {
        return { success: true };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyers"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard_stats"] });
    },
  });
}
