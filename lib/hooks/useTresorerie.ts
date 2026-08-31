import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export interface Reversement {
  id: string;
  proprietaire: string;
  encaisses: number;
  taux: number;
  statut: "À reverser" | "Reversé";
  created_at?: string;
}

const DEMO_REVERSEMENTS: Reversement[] = [
  { id: "1", proprietaire: "Jean Dupont", encaisses: 600000, taux: 8, statut: "À reverser" },
  { id: "2", proprietaire: "SCI Les Cocotiers", encaisses: 1800000, taux: 7, statut: "À reverser" },
];

export function useTresorerie() {
  return useQuery({
    queryKey: ["tresorerie"],
    queryFn: async (): Promise<Reversement[]> => {
      if (!isSupabaseConfigured()) {
        return DEMO_REVERSEMENTS;
      }
      const supabase = createClient();
      const { data, error } = await supabase.from("tresorerie").select("*").order("created_at", { ascending: false });
      if (error) {
        console.warn("Supabase fetch error, fallback to demo:", error);
        return DEMO_REVERSEMENTS;
      }
      return (data as Reversement[]) || DEMO_REVERSEMENTS;
    },
  });
}

export function useMarkAsReversed() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      if (!isSupabaseConfigured()) {
        return ids;
      }
      const supabase = createClient();
      const { data, error } = await supabase.from("tresorerie").update({ statut: "Reversé" }).in("id", ids).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tresorerie"] });
    },
  });
}
