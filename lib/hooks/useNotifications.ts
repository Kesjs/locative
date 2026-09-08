import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export interface AppNotification {
  id: string;
  type: string;
  title: string;
  body: string;
  reference_id?: string | null;
  reference_url?: string | null;
  read_at?: string | null;
  created_at: string;
}

/**
 * Notifications réelles (table `notifications`, migration 019) — remplace le contenu codé en dur
 * qui s'affichait auparavant dans la cloche du header. Alimentée côté base par un trigger sur
 * loyers_transactions : une notification "Loyer reçu" est générée à chaque encaissement (espèces,
 * MoMo, Moov, virement) qui passe au statut 'payé'.
 */
export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async (): Promise<AppNotification[]> => {
      if (!isSupabaseConfigured()) return [];
      const supabase = createClient();
      try {
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(20);

        if (error) {
          console.warn("Supabase fetch error (notifications):", error.message);
          return [];
        }
        return (data as AppNotification[]) || [];
      } catch (err) {
        console.warn("Supabase error (notifications):", err);
        return [];
      }
    },
    refetchInterval: 60_000, // repolling léger : pas de websocket temps réel pour l'instant
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!isSupabaseConfigured()) return;
      const supabase = createClient();
      const { error } = await supabase
        .from("notifications")
        .update({ read_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      if (!isSupabaseConfigured() || ids.length === 0) return;
      const supabase = createClient();
      const { error } = await supabase
        .from("notifications")
        .update({ read_at: new Date().toISOString() })
        .in("id", ids);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
