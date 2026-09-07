import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export interface EquipeMember {
  id: string;
  nom: string;
  email?: string | null;
  role: string;
  statut: string;
  organization_id?: string | null;
  created_at?: string;
}

const DEMO_EQUIPE: EquipeMember[] = [
  { id: "1", nom: "Alexandre K.", email: "alexandre@lokka.bj", role: "Administrateur", statut: "Actif" },
  { id: "2", nom: "Marie C.", email: "marie@lokka.bj", role: "Comptable", statut: "Actif" },
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
        console.warn("Supabase fetch equipe error:", error);
        return [];
      }
      return (data as EquipeMember[]) || [];
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

      const payload = {
        ...newMember,
        organization_id: orgId,
      };

      const { data, error } = await supabase.from("equipe").insert([payload]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipe"] });
    },
  });
}
