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

const DEMO_TRANSACTIONS: LoyerTransaction[] = [
  {
    id: "tx-1",
    locataire_nom: "Koudjo Dossou",
    bien_nom: "Villa Fidjrossè Plage",
    montant: 350000,
    methode: "MTN MoMo",
    statut: "payé",
    quittance_url: "/quittances/lok-2026-01.pdf",
    date_reglement: "05/03/2026",
    echeance: "05/03/2026",
  },
  {
    id: "tx-2",
    locataire_nom: "Bérénice Agossou",
    bien_nom: "Studio Meublé Haie Vive",
    montant: 120000,
    methode: "Moov Money",
    statut: "payé",
    quittance_url: "/quittances/lok-2026-02.pdf",
    date_reglement: "03/03/2026",
    echeance: "05/03/2026",
  },
  {
    id: "tx-3",
    locataire_nom: "Gérard Bio",
    bien_nom: "Appartement 3P Ganhi",
    montant: 220000,
    methode: "MTN MoMo",
    statut: "retard",
    echeance: "01/03/2026",
  },
];

export function useLoyers() {
  return useQuery({
    queryKey: ["loyers"],
    queryFn: async (): Promise<LoyerTransaction[]> => {
      if (!isSupabaseConfigured()) {
        return DEMO_TRANSACTIONS;
      }
      const supabase = createClient();
      const { data, error } = await supabase.from("loyers_transactions").select("*").order("echeance", { ascending: false });
      if (error) {
        console.warn("Supabase fetch error, fallback to demo:", error);
        return DEMO_TRANSACTIONS;
      }
      return (data as LoyerTransaction[]) || DEMO_TRANSACTIONS;
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
