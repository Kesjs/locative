import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export interface Annonce {
  id: string;
  bien: string;
  vues: number;
  demandes: number;
  statut: "Active" | "Suspendue" | "Brouillon";
  lien_public?: string;
  created_at?: string;
}

const DEMO_ANNONCES: Annonce[] = [
  { id: "1", bien: "Villa Les Cocotiers", vues: 45, demandes: 3, statut: "Active", lien_public: "lokka.bj/p/villa-cocotiers" },
  { id: "2", bien: "Résidence Le Manguier (Apt 3)", vues: 12, demandes: 0, statut: "Suspendue" },
];

export function useAnnonces() {
  return useQuery({
    queryKey: ["annonces"],
    queryFn: async (): Promise<Annonce[]> => {
      if (!isSupabaseConfigured()) {
        return DEMO_ANNONCES;
      }
      const supabase = createClient();
      const { data, error } = await supabase.from("annonces").select("*").order("created_at", { ascending: false });
      if (error) {
        console.warn("Supabase fetch error, fallback to demo:", error);
        return DEMO_ANNONCES;
      }
      return (data as Annonce[]) || DEMO_ANNONCES;
    },
  });
}

export function useAddAnnonce() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newAnnonce: Omit<Annonce, "id" | "vues" | "demandes">) => {
      if (!isSupabaseConfigured()) {
        return { ...newAnnonce, id: Date.now().toString(), vues: 0, demandes: 0 };
      }
      const supabase = createClient();
      const payload = { ...newAnnonce, vues: 0, demandes: 0 };
      const { data, error } = await supabase.from("annonces").insert([payload]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["annonces"] });
    },
  });
}
