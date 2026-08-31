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

const DEMO_TICKETS: Ticket[] = [
  { id: "1", titre: "Fuite d'eau robinet cuisine", bien: "Villa Cocotiers Apt 2B", urgence: "Haute", statut: "En cours" },
  { id: "2", titre: "Prise électrique défectueuse", bien: "Résidence Le Manguier", urgence: "Basse", statut: "Nouveau" },
];

const DEMO_ARTISANS: Artisan[] = [
  { id: "1", nom: "Plomberie Express", specialite: "Plombier", telephone: "+229 97 00 11 22", note: "4.8/5" },
];

export function useTickets() {
  return useQuery({
    queryKey: ["maintenance-tickets"],
    queryFn: async (): Promise<Ticket[]> => {
      if (!isSupabaseConfigured()) {
        return DEMO_TICKETS;
      }
      const supabase = createClient();
      const { data, error } = await supabase.from("maintenance_tickets").select("*").order("created_at", { ascending: false });
      if (error) {
        console.warn("Supabase fetch error, fallback to demo:", error);
        return DEMO_TICKETS;
      }
      return (data as Ticket[]) || DEMO_TICKETS;
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
      const { data, error } = await supabase.from("maintenance_tickets").insert([newTicket]).select().single();
      if (error) throw error;
      return data;
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
        return DEMO_ARTISANS;
      }
      const supabase = createClient();
      const { data, error } = await supabase.from("maintenance_artisans").select("*").order("nom");
      if (error) {
        console.warn("Supabase fetch error, fallback to demo:", error);
        return DEMO_ARTISANS;
      }
      return (data as Artisan[]) || DEMO_ARTISANS;
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
      const { data, error } = await supabase.from("maintenance_artisans").insert([newArtisan]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance-artisans"] });
    },
  });
}
