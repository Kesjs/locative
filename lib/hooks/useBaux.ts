import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export interface Bail {
  id: string;
  locataire: string;
  mandat: string;
  bien: string;
  loyer: number;
  caution: string;
  created_at?: string;
}

const DEMO_BAUX: Bail[] = [
  { id: "1", locataire: "Koudjo Dossou", mandat: "Jean Dupont", bien: "Villa Cocotiers", loyer: 150000, caution: "Séquestrée" },
  { id: "2", locataire: "Rachidi Saka", mandat: "SCI Les Cocotiers", bien: "Résidence Le Manguier", loyer: 180000, caution: "Séquestrée" },
];

export function useBaux() {
  return useQuery({
    queryKey: ["baux"],
    queryFn: async (): Promise<Bail[]> => {
      if (!isSupabaseConfigured()) {
        return DEMO_BAUX;
      }
      const supabase = createClient();
      const { data, error } = await supabase.from("baux").select("*").order("created_at", { ascending: false });
      if (error) {
        console.warn("Supabase fetch error, fallback to demo:", error);
        return DEMO_BAUX;
      }
      return (data as Bail[]) || DEMO_BAUX;
    },
  });
}

export function useAddBail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newBail: Omit<Bail, "id">) => {
      if (!isSupabaseConfigured()) {
        return { ...newBail, id: Date.now().toString() };
      }
      const supabase = createClient();
      const { data, error } = await supabase.from("baux").insert([newBail]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["baux"] });
    },
  });
}
