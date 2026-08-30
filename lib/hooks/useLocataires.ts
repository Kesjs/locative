import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export interface Locataire {
  id: string;
  nom_complet: string;
  telephone: string;
  email: string;
  bien_nom: string;
  loyer_mensuel: number;
  date_entree: string;
  statut_paiement: "à jour" | "retard" | "impayé";
  dernier_paiement?: string;
}

const DEMO_LOCATAIRES: Locataire[] = [
  {
    id: "1",
    nom_complet: "Koudjo Dossou",
    telephone: "+229 97 00 11 22",
    email: "koudjo.dossou@gmail.com",
    bien_nom: "Villa Fidjrossè Plage",
    loyer_mensuel: 350000,
    date_entree: "2024-01-15",
    statut_paiement: "à jour",
    dernier_paiement: "05/03/2026",
  },
  {
    id: "2",
    nom_complet: "Bérénice Agossou",
    telephone: "+229 95 33 44 55",
    email: "berenice.agossou@yahoo.fr",
    bien_nom: "Studio Meublé Haie Vive",
    loyer_mensuel: 120000,
    date_entree: "2024-06-01",
    statut_paiement: "à jour",
    dernier_paiement: "03/03/2026",
  },
  {
    id: "3",
    nom_complet: "Gérard Bio",
    telephone: "+229 66 77 88 99",
    email: "gerard.bio@gmail.com",
    bien_nom: "Appartement 3P Ganhi",
    loyer_mensuel: 220000,
    date_entree: "2023-11-01",
    statut_paiement: "retard",
    dernier_paiement: "28/01/2026",
  },
];

export function useLocataires() {
  return useQuery({
    queryKey: ["locataires"],
    queryFn: async (): Promise<Locataire[]> => {
      if (!isSupabaseConfigured()) {
        return DEMO_LOCATAIRES;
      }
      const supabase = createClient();
      const { data, error } = await supabase.from("locataires").select("*").order("nom_complet");
      if (error) {
        console.warn("Supabase fetch error, fallback to demo:", error);
        return DEMO_LOCATAIRES;
      }
      return (data as Locataire[]) || DEMO_LOCATAIRES;
    },
  });
}

export function useAddLocataire() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newLocataire: Omit<Locataire, "id">) => {
      if (!isSupabaseConfigured()) {
        return { ...newLocataire, id: Date.now().toString() };
      }
      const supabase = createClient();
      const { data, error } = await supabase.from("locataires").insert([newLocataire]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locataires"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard_stats"] });
    },
  });
}
