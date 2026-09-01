import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export interface Bien {
  id: string;
  nom: string;
  adresse: string;
  ville: string;
  type: string;
  loyer_mensuel: number;
  charges?: number;
  statut: "loué" | "vacant" | "travaux";
  locataire_nom?: string;
  photos: string[];
  photo_principale?: string | null;
  equipements: string[];
  caution_montant?: number | null;
  surface_m2?: number | null;
  nb_pieces?: number | null;
  archive?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Tags d'équipements prédéfinis proposés à l'étape 4 du formulaire d'ajout
export const EQUIPEMENTS_PREDEFINIS = [
  "Climatisation",
  "Forage / surpresseur",
  "Compteur SBEE personnel",
  "Compteur SONEB personnel",
  "Groupe électrogène",
  "Parking privé",
  "Cour clôturée",
  "Meublé",
  "Cuisine équipée",
  "Internet fibre",
  "Vidéosurveillance",
  "Gardiennage",
];

// Plafond légal de caution = 3x le loyer mensuel
export function plafondCaution(loyerMensuel: number) {
  return (loyerMensuel || 0) * 3;
}

export function useBiens() {
  return useQuery({
    queryKey: ["biens"],
    queryFn: async (): Promise<Bien[]> => {
      if (!isSupabaseConfigured()) {
        return [];
      }
      const supabase = createClient();
      const { data, error } = await supabase
        .from("biens")
        .select("*")
        .eq("archive", false)
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Supabase fetch error (biens):", error.message);
        return [];
      }
      return (data as Bien[]) || [];
    },
  });
}

export function useAddBien() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newBien: Omit<Bien, "id">) => {
      if (!isSupabaseConfigured()) {
        return { ...newBien, id: Date.now().toString() };
      }
      const supabase = createClient();
      const { data, error } = await supabase.from("biens").insert([newBien]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["biens"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard_stats"] });
    },
  });
}

export function useUpdateBien() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Bien> & { id: string }) => {
      if (!isSupabaseConfigured()) {
        return { id, ...updates };
      }
      const supabase = createClient();
      const { data, error } = await supabase.from("biens").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["biens"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard_stats"] });
    },
  });
}

export function useUpdateBienStatut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, statut }: { id: string; statut: Bien["statut"] }) => {
      if (!isSupabaseConfigured()) {
        return { id, statut };
      }
      const supabase = createClient();
      const { data, error } = await supabase.from("biens").update({ statut }).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["biens"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard_stats"] });
    },
  });
}

export function useArchiveBien() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!isSupabaseConfigured()) {
        return { id, archive: true };
      }
      const supabase = createClient();
      const { data, error } = await supabase
        .from("biens")
        .update({ archive: true, archived_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["biens"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard_stats"] });
    },
  });
}

// Upload de photos vers le bucket Supabase Storage "biens-photos"
export async function uploadBienPhoto(file: File): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split(".").pop();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from("biens-photos").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from("biens-photos").getPublicUrl(path);
  return data.publicUrl;
}
