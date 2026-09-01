import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export interface Bien {
  id: string;
  nom: string;
  adresse: string;
  ville: string;
  quartier?: string;
  repere?: string;
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
  compteur_sbee?: string;
  compteur_soneb?: string;
  archive?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const CATEGORIES_BIEN = [
  {
    categorie: "Habitation",
    types: [
      "Studio",
      "Appartement 2P (1 chambre)",
      "Appartement 3P (2 chambres)",
      "Appartement 4P+",
      "Villa individuelle",
      "Duplex / Triplex",
      "Chambre sanitaire",
    ],
  },
  {
    categorie: "Locaux Commerciaux & Professionnels",
    types: [
      "Boutique / Magasin commercial",
      "Bureau / Plateau d'affaires",
      "Entrepôt / Hangar de stockage",
      "Immeuble multi-lots",
      "Autre local",
    ],
  },
];

export const VILLES_BENIN = [
  "Cotonou",
  "Abomey-Calavi",
  "Porto-Novo",
  "Parakou",
  "Ouidah",
  "Bohicon",
  "Sèmè-Kpodji",
  "Allada",
  "Natitingou",
  "Djougou",
];

// Tags d'équipements prédéfinis proposés à l'étape 4 du formulaire d'ajout
export const EQUIPEMENTS_PREDEFINIS = [
  "Climatisation",
  "Forage / Surpresseur",
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

// Plafond légal de caution au Bénin (Loi 2022-30) = 3x le loyer mensuel max
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
    },
  });
}

export function useUpdateBien() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...patch }: Partial<Bien> & { id: string }) => {
      if (!isSupabaseConfigured()) {
        return { id, ...patch } as Bien;
      }
      const supabase = createClient();
      const { data, error } = await supabase.from("biens").update(patch).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["biens"] });
    },
  });
}

export function useDeleteBien() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!isSupabaseConfigured()) {
        return true;
      }
      const supabase = createClient();
      // Soft-delete pour préserver l'intégrité de l'historique des loyers
      const { error } = await supabase.from("biens").update({ archive: true }).eq("id", id);
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["biens"] });
    },
  });
}

export async function uploadBienPhoto(file: File): Promise<string> {
  if (!isSupabaseConfigured()) {
    return URL.createObjectURL(file);
  }
  const supabase = createClient();
  const ext = file.name.split(".").pop();
  const path = `biens/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
  const { error: uploadError } = await supabase.storage.from("photos").upload(path, file);
  if (uploadError) throw uploadError;
  const { data } = supabase.storage.from("photos").getPublicUrl(path);
  return data.publicUrl;
}
