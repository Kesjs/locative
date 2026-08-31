import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export interface EquipeMember {
  id: string;
  nom: string;
  role: string;
  statut: string;
  created_at?: string;
}

const DEMO_EQUIPE: EquipeMember[] = [
  { id: "1", nom: "Alexandre K.", role: "Administrateur", statut: "Actif" },
  { id: "2", nom: "Marie C.", role: "Comptable", statut: "Actif" },
];

export function useEquipe() {
  return useQuery({
    queryKey: ["equipe"],
    queryFn: async (): Promise<EquipeMember[]> => {
      if (!isSupabaseConfigured()) {
        return DEMO_EQUIPE;
      }
      const supabase = createClient();
      const { data, error } = await supabase.from("equipe").select("*").order("created_at", { ascending: false });
      if (error) {
        console.warn("Supabase fetch error, fallback to demo:", error);
        return DEMO_EQUIPE;
      }
      return (data as EquipeMember[]) || DEMO_EQUIPE;
    },
  });
}

export function useAddEquipeMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newMember: Omit<EquipeMember, "id">) => {
      if (!isSupabaseConfigured()) {
        return { ...newMember, id: Date.now().toString() };
      }
      const supabase = createClient();
      const { data, error } = await supabase.from("equipe").insert([newMember]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipe"] });
    },
  });
}
