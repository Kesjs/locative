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

const LOCAL_STORAGE_KEY = "lokka_biens_cache";

function getLocalBiens(): Bien[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

function saveLocalBiens(biens: Bien[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(biens));
  } catch (_) {}
}

export function useBiens() {
  return useQuery({
    queryKey: ["biens"],
    queryFn: async (): Promise<Bien[]> => {
      const local = getLocalBiens().filter((b) => !b.archive);

      if (!isSupabaseConfigured()) {
        return local;
      }
      const supabase = createClient();
      try {
        const { data, error } = await supabase
          .from("biens")
          .select("*")
          .eq("archive", false)
          .order("created_at", { ascending: false });

        if (error) {
          console.warn("Supabase fetch (falling back to local cache):", error.message);
          return local;
        }

        const supaBiens = (data as Bien[]) || [];
        // Combiner Supabase + Biens locaux de test s'il y en a
        const combined = [...supaBiens];
        for (const loc of local) {
          if (!combined.some((b) => b.id === loc.id)) {
            combined.push(loc);
          }
        }
        return combined;
      } catch (err) {
        console.warn("Supabase error (using local):", err);
        return local;
      }
    },
  });
}

export function useAddBien() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newBien: Omit<Bien, "id">) => {
      const localId = "bien_" + Date.now().toString(36) + "_" + Math.random().toString(36).substring(2, 6);
      const createdBien: Bien = {
        ...newBien,
        id: localId,
        archive: false,
        created_at: new Date().toISOString(),
      };

      if (!isSupabaseConfigured()) {
        const local = getLocalBiens();
        saveLocalBiens([createdBien, ...local]);
        return createdBien;
      }

      const supabase = createClient();

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        // Si l'utilisateur n'est pas authentifié avec Supabase (accès direct /dashboard), stocker localement
        if (!user) {
          const local = getLocalBiens();
          saveLocalBiens([createdBien, ...local]);
          return createdBien;
        }

        let organizationId: string | null = null;
        const { data: profile } = await supabase
          .from("profiles")
          .select("organization_id")
          .eq("id", user.id)
          .maybeSingle();

        if (profile?.organization_id) {
          organizationId = profile.organization_id;
        } else {
          const { data: org } = await supabase.from("organizations").select("id").limit(1).maybeSingle();
          if (org?.id) organizationId = org.id;
        }

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

        if (organizationId) payload.organization_id = organizationId;

        const { data, error } = await supabase.from("biens").insert([payload]).select().single();

        if (error) {
          console.warn("Supabase insert error, saving locally:", error.message);
          const local = getLocalBiens();
          saveLocalBiens([createdBien, ...local]);
          return createdBien;
        }

        return data;
      } catch (err) {
        console.warn("Save catch, fallback local:", err);
        const local = getLocalBiens();
        saveLocalBiens([createdBien, ...local]);
        return createdBien;
      }
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
      // Mettre à jour localement d'abord
      const local = getLocalBiens();
      const updatedLocal = local.map((b) => (b.id === id ? { ...b, ...patch } : b));
      saveLocalBiens(updatedLocal);

      if (!isSupabaseConfigured()) {
        return { id, ...patch } as Bien;
      }

      const supabase = createClient();
      try {
        const { data, error } = await supabase.from("biens").update(patch).eq("id", id).select().single();
        if (error) {
          console.warn("Supabase update error:", error.message);
          return { id, ...patch } as Bien;
        }
        return data;
      } catch (err) {
        return { id, ...patch } as Bien;
      }
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
      const local = getLocalBiens();
      const updatedLocal = local.map((b) => (b.id === id ? { ...b, statut } : b));
      saveLocalBiens(updatedLocal);

      if (!isSupabaseConfigured()) {
        return { id, statut };
      }
      const supabase = createClient();
      try {
        const { data, error } = await supabase.from("biens").update({ statut }).eq("id", id).select().single();
        if (error) return { id, statut };
        return data;
      } catch {
        return { id, statut };
      }
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
      const local = getLocalBiens();
      const updatedLocal = local.map((b) => (b.id === id ? { ...b, archive: true } : b));
      saveLocalBiens(updatedLocal);

      if (!isSupabaseConfigured()) {
        return true;
      }
      const supabase = createClient();
      try {
        await supabase.from("biens").update({ archive: true }).eq("id", id);
        return true;
      } catch {
        return true;
      }
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
      const local = getLocalBiens();
      const updatedLocal = local.filter((b) => b.id !== id);
      saveLocalBiens(updatedLocal);

      if (!isSupabaseConfigured()) {
        return true;
      }
      const supabase = createClient();
      try {
        await supabase.from("biens").update({ archive: true }).eq("id", id);
        return true;
      } catch {
        return true;
      }
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
  try {
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `biens/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("biens-photos").upload(path, file);
    if (uploadError) {
      // Fallback local URL
      return URL.createObjectURL(file);
    }
    const { data } = supabase.storage.from("biens-photos").getPublicUrl(path);
    return data.publicUrl;
  } catch {
    return URL.createObjectURL(file);
  }
}
