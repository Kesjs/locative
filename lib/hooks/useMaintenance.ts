import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export interface Ticket {
  id: string;
  titre: string;
  bien: string;
  urgence: "Haute" | "Moyenne" | "Basse";
  statut: "Nouveau" | "En cours" | "Résolu";
  created_at?: string;
}

export interface Artisan {
  id: string;
  nom: string;
  specialite: string;
  telephone: string;
  note: string;
  zone?: string;
  created_at?: string;
}

export function useTickets() {
  return useQuery({
    queryKey: ["maintenance-tickets"],
    queryFn: async (): Promise<Ticket[]> => {
      if (!isSupabaseConfigured()) {
        return [];
      }
      const supabase = createClient();
      try {
        const { data, error } = await supabase
          .from("maintenance_tickets")
          .select("*")
          .order("created_at", { ascending: false });
        if (error || !data) {
          return [];
        }
        return data.map((t: any) => ({
          id: t.id,
          titre: t.title || t.titre || "Incident",
          bien: t.description || t.bien || "Bien concerné",
          urgence: t.urgency === "high" ? "Haute" : t.urgency === "low" ? "Basse" : "Moyenne",
          statut: t.status === "resolved" ? "Résolu" : t.status === "in_progress" ? "En cours" : "Nouveau",
          created_at: t.created_at,
        }));
      } catch {
        return [];
      }
    },
  });
}

export function useAddTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newTicket: Omit<Ticket, "id">) => {
      if (!isSupabaseConfigured()) {
        return { ...newTicket, id: Date.now().toString() };
      }
      const supabase = createClient();
      try {
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

        const urgencyMap: Record<string, string> = {
          Haute: "high",
          Moyenne: "medium",
          Basse: "low",
        };
        const statusMap: Record<string, string> = {
          Nouveau: "open",
          "En cours": "in_progress",
          Résolu: "resolved",
        };

        const payload: Record<string, any> = {
          title: newTicket.titre,
          description: newTicket.bien,
          urgency: urgencyMap[newTicket.urgence] || "medium",
          status: statusMap[newTicket.statut] || "open",
        };
        if (orgId) payload.organization_id = orgId;

        const { data, error } = await supabase
          .from("maintenance_tickets")
          .insert([payload])
          .select()
          .single();

        if (error) {
          console.warn("Ticket insert notice:", error.message);
          return { ...newTicket, id: Date.now().toString() };
        }
        return {
          id: data.id,
          titre: data.title,
          bien: data.description,
          urgence: newTicket.urgence,
          statut: newTicket.statut,
          created_at: data.created_at,
        };
      } catch (err) {
        console.warn("Ticket error:", err);
        return { ...newTicket, id: Date.now().toString() };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance-tickets"] });
    },
  });
}

export function useArtisans() {
  return useQuery({
    queryKey: ["maintenance-artisans"],
    queryFn: async (): Promise<Artisan[]> => {
      if (!isSupabaseConfigured()) {
        return [];
      }
      const supabase = createClient();
      try {
        const { data, error } = await supabase
          .from("maintenance_artisans")
          .select("*")
          .order("nom");
        if (error) {
          return [];
        }
        return (data as Artisan[]) || [];
      } catch {
        return [];
      }
    },
  });
}

export function useAddArtisan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newArtisan: Omit<Artisan, "id">) => {
      if (!isSupabaseConfigured()) {
        return { ...newArtisan, id: Date.now().toString() };
      }
      const supabase = createClient();
      try {
        const { data, error } = await supabase.from("maintenance_artisans").insert([newArtisan]).select().single();
        if (error) return { ...newArtisan, id: Date.now().toString() };
        return data;
      } catch {
        return { ...newArtisan, id: Date.now().toString() };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance-artisans"] });
    },
  });
}
