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

export function useLoyers() {
  return useQuery({
    queryKey: ["loyers"],
    queryFn: async (): Promise<LoyerTransaction[]> => {
      if (!isSupabaseConfigured()) {
        return [];
      }
      const supabase = createClient();
      const { data, error } = await supabase
        .from("loyers_transactions")
        .select("*")
        .order("echeance", { ascending: false });
      if (error) {
        console.error("Supabase fetch error (loyers):", error.message);
        return [];
      }
      return (data as LoyerTransaction[]) || [];
    },
  });
}

export function useEncaisserLoyer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string; methode: LoyerTransaction["methode"] }) => {
      if (!isSupabaseConfigured()) {
        return { success: true };
      }
      const supabase = createClient();
      const { data, error } = await supabase
        .from("loyers_transactions")
        .update({ statut: "payé", methode: payload.methode, date_reglement: new Date().toISOString() })
        .eq("id", payload.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyers"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard_stats"] });
    },
  });
}
