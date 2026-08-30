import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export interface Bien {
  id: string;
  nom: string;
  adresse: string;
  ville: string;
  type: string;
  loyer_mensuel: number;
  charges?: number;
  statut: "loué" | "vacant" | "travaux";
  locataire_nom?: string;
  created_at?: string;
}

// Fallback demo data if Supabase is not configured yet
const DEMO_BIENS: Bien[] = [
  {
    id: "1",
    nom: "Villa Fidjrossè Plage",
    adresse: "Rue 440, Fidjrossè",
    ville: "Cotonou",
    type: "Villa 5P",
    loyer_mensuel: 350000,
    charges: 25000,
    statut: "loué",
    locataire_nom: "Koudjo Dossou",
  },
  {
    id: "2",
    nom: "Studio Meublé Haie Vive",
    adresse: "Avenue Jean-Paul II",
    ville: "Cotonou",
    type: "Studio",
    loyer_mensuel: 120000,
    charges: 10000,
    statut: "loué",
    locataire_nom: "Bérénice Agossou",
  },
  {
    id: "3",
    nom: "Appartement 3P Ganhi",
    adresse: "Boulevard de la Marina",
    ville: "Cotonou",
    type: "Appartement 3P",
    loyer_mensuel: 220000,
    charges: 15000,
    statut: "loué",
    locataire_nom: "Gérard Bio",
  },
  {
    id: "4",
    nom: "Duplex 4P Cadjehoun",
    adresse: "Carrefour des Trois Banques",
    ville: "Cotonou",
    type: "Duplex",
    loyer_mensuel: 450000,
    charges: 30000,
    statut: "vacant",
  },
];

export function useBiens() {
  return useQuery({
    queryKey: ["biens"],
    queryFn: async (): Promise<Bien[]> => {
      if (!isSupabaseConfigured()) {
        return DEMO_BIENS;
      }
      const supabase = createClient();
      const { data, error } = await supabase.from("biens").select("*").order("created_at", { ascending: false });
      if (error) {
        console.warn("Supabase fetch error, fallback to demo:", error);
        return DEMO_BIENS;
      }
      return (data as Bien[]) || DEMO_BIENS;
    },
  });
}

export function useAddBien() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newBien: Omit<Bien, "id">) => {
      if (!isSupabaseConfigured()) {
        return { ...newBien, id: Date.now().toString() };
      }
      const supabase = createClient();
      const { data, error } = await supabase.from("biens").insert([newBien]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["biens"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard_stats"] });
    },
  });
}
