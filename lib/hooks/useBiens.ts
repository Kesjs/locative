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

      // 1. Récupérer l'utilisateur connecté
      const {
        data: { user },
      } = await supabase.auth.getUser();

      let organizationId: string | null = null;

      if (user) {
        // Trouver son organisation rattachée
        const { data: profile } = await supabase
          .from("profiles")
          .select("organization_id")
          .eq("id", user.id)
          .maybeSingle();

        if (profile?.organization_id) {
          organizationId = profile.organization_id;
        } else {
          // Sinon chercher la première organisation active
          const { data: org } = await supabase
            .from("organizations")
            .select("id")
            .limit(1)
            .maybeSingle();
          if (org?.id) organizationId = org.id;
        }
      }

      // Préparation du payload
      const payload: Record<string, any> = {
        nom: newBien.nom,
        adresse: newBien.adresse,
        ville: newBien.ville,
        type: newBien.type,
        loyer_mensuel: newBien.loyer_mensuel,
        charges: newBien.charges || 0,
        statut: newBien.statut || "vacant",
        photos: newBien.photos || [],
        photo_principale: newBien.photo_principale || null,
        equipements: newBien.equipements || [],
        caution_montant: newBien.caution_montant || null,
        surface_m2: newBien.surface_m2 || null,
        nb_pieces: newBien.nb_pieces || null,
        quartier: newBien.quartier || null,
        repere: newBien.repere || null,
        compteur_sbee: newBien.compteur_sbee || null,
        compteur_soneb: newBien.compteur_soneb || null,
      };

      if (organizationId) {
        payload.organization_id = organizationId;
      }

      // Tentative d'insertion complète
      let { data, error } = await supabase.from("biens").insert([payload]).select().single();

      // En cas d'erreur de colonnes inexistantes avant migration 011, fallback gracieux
      if (error && (error.code === "PGRST204" || error.message.includes("column"))) {
        console.warn("Retrying insert without extended fields...");
        const fallbackPayload: Record<string, any> = {
          nom: newBien.nom,
          adresse: newBien.adresse,
          ville: newBien.ville,
          type: newBien.type,
          loyer_mensuel: newBien.loyer_mensuel,
          charges: newBien.charges || 0,
          statut: newBien.statut || "vacant",
          photos: newBien.photos || [],
          photo_principale: newBien.photo_principale || null,
          equipements: newBien.equipements || [],
          caution_montant: newBien.caution_montant || null,
          surface_m2: newBien.surface_m2 || null,
          nb_pieces: newBien.nb_pieces || null,
        };
        if (organizationId) fallbackPayload.organization_id = organizationId;

        const retry = await supabase.from("biens").insert([fallbackPayload]).select().single();
        if (retry.error) throw retry.error;
        return retry.data;
      }

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
      let { data, error } = await supabase.from("biens").update(patch).eq("id", id).select().single();

      // Fallback gracieux si une colonne n'existe pas encore
      if (error && (error.code === "PGRST204" || error.message.includes("column"))) {
        const safePatch: Record<string, any> = { ...patch };
        delete safePatch.quartier;
        delete safePatch.repere;
        delete safePatch.compteur_sbee;
        delete safePatch.compteur_soneb;

        const retry = await supabase.from("biens").update(safePatch).eq("id", id).select().single();
        if (retry.error) throw retry.error;
        return retry.data;
      }

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["biens"] });
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
    },
  });
}

export function useArchiveBien() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!isSupabaseConfigured()) {
        return true;
      }
      const supabase = createClient();
      const { error } = await supabase.from("biens").update({ archive: true }).eq("id", id);
      if (error) throw error;
      return true;
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
