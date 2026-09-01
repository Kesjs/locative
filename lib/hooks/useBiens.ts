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

// Fallback demo data if Supabase is not configured yet
const DEMO_BIENS: Bien[] = [
  {
    id: "1",
    nom: "Villa Fidjrossè Plage",
    adresse: "Rue 440, Fidjrossè",
    ville: "Cotonou",
    type: "Villa 5P",
    loyer_mensuel: 350000,
    charges: 25000,
    statut: "loué",
    locataire_nom: "Koudjo Dossou",
    photos: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    ],
    photo_principale: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    equipements: ["Climatisation", "Forage / surpresseur", "Cour clôturée", "Parking privé"],
    caution_montant: 1050000,
    surface_m2: 180,
    nb_pieces: 5,
    archive: false,
    created_at: "2025-11-02T10:00:00Z",
  },
  {
    id: "2",
    nom: "Studio Meublé Haie Vive",
    adresse: "Avenue Jean-Paul II",
    ville: "Cotonou",
    type: "Studio",
    loyer_mensuel: 120000,
    charges: 10000,
    statut: "loué",
    locataire_nom: "Bérénice Agossou",
    photos: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"],
    photo_principale: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    equipements: ["Meublé", "Climatisation", "Internet fibre"],
    caution_montant: 240000,
    surface_m2: 28,
    nb_pieces: 1,
    archive: false,
    created_at: "2025-12-14T10:00:00Z",
  },
  {
    id: "3",
    nom: "Appartement 3P Ganhi",
    adresse: "Boulevard de la Marina",
    ville: "Cotonou",
    type: "Appartement 3P",
    loyer_mensuel: 220000,
    charges: 15000,
    statut: "loué",
    locataire_nom: "Gérard Bio",
    photos: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80"],
    photo_principale: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    equipements: ["Compteur SBEE personnel", "Vidéosurveillance"],
    caution_montant: 900000,
    surface_m2: 85,
    nb_pieces: 3,
    archive: false,
    created_at: "2026-01-20T10:00:00Z",
  },
  {
    id: "4",
    nom: "Duplex 4P Cadjehoun",
    adresse: "Carrefour des Trois Banques",
    ville: "Cotonou",
    type: "Duplex",
    loyer_mensuel: 450000,
    charges: 30000,
    statut: "vacant",
    photos: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"],
    photo_principale: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    equipements: ["Groupe électrogène", "Parking privé", "Gardiennage"],
    caution_montant: 1350000,
    surface_m2: 210,
    nb_pieces: 4,
    archive: false,
    created_at: "2026-02-05T10:00:00Z",
  },
];

export function useBiens() {
  return useQuery({
    queryKey: ["biens"],
    queryFn: async (): Promise<Bien[]> => {
      if (!isSupabaseConfigured()) {
        return DEMO_BIENS;
      }
      const supabase = createClient();
      const { data, error } = await supabase
        .from("biens")
        .select("*")
        .eq("archive", false)
        .order("created_at", { ascending: false });
      if (error) {
        console.warn("Supabase fetch error, fallback to demo:", error);
        return DEMO_BIENS;
      }
      return (data as Bien[]) || DEMO_BIENS;
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
