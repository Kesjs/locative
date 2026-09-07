import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export interface Mandat {
  id: string;
  proprietaire: string;
  email?: string | null;
  telephone?: string | null;
  biens: number;
  commission: string;
  commission_pct?: number | null;
  solde: number;
  organization_id?: string | null;
  created_at?: string;
}

const DEMO_MANDATS: Mandat[] = [
  { id: "1", proprietaire: "Jean Dupont", biens: 3, commission: "8%", solde: 1250000 },
  { id: "2", proprietaire: "SCI Les Cocotiers", biens: 12, commission: "7%", solde: 4500000 },
];

export function useMandats() {
  return useQuery({
    queryKey: ["mandats"],
    queryFn: async (): Promise<Mandat[]> => {
      if (!isSupabaseConfigured()) {
        return DEMO_MANDATS;
      }
      const supabase = createClient();
      const { data, error } = await supabase.from("mandats").select("*").order("created_at", { ascending: false });
      if (error) {
        console.warn("Supabase fetch mandats error:", error);
        return [];
      }
      return (data as Mandat[]) || [];
    },
  });
}

export function useAddMandat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newMandat: Omit<Mandat, "id">) => {
      if (!isSupabaseConfigured()) {
        return { ...newMandat, id: Date.now().toString() };
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
        ...newMandat,
        organization_id: orgId,
        created_by: user?.id || null,
      };

      const { data, error } = await supabase.from("mandats").insert([payload]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mandats"] });
    },
  });
}
