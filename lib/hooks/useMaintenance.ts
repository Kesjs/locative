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
      const { data, error } = await supabase
        .from("maintenance_tickets")
        .select("*")
        .order("created_at", { ascending: false });
        if (error) {
          return [];
        }
        return (data as Ticket[]) || [];
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
        const { data, error } = await supabase.from("maintenance_tickets").insert([newTicket]).select().single();
        if (error) return { ...newTicket, id: Date.now().toString() };
        return data;
      } catch {
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
}

export function useAddArtisan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newArtisan: Omit<Artisan, "id">) => {
      if (!isSupabaseConfigured()) {
        return { ...newArtisan, id: Date.now().toString() };
      }
      const supabase = createClient();
      const { data, error } = await supabase.from("maintenance_artisans").insert([newArtisan]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance-artisans"] });
    },
  });
}
