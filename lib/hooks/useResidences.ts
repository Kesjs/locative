import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export interface Residence {
  id: string;
  nom: string;
  type?: "Personnel" | "SCI" | "Copropriété" | "Autre" | null;
  created_at?: string;
  updated_at?: string;
}

const LOCAL_STORAGE_KEY = "lokka_residences_cache";

function getLocalResidences(): Residence[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveLocalResidences(residences: Residence[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(residences));
  } catch {
    // ignore quota errors
  }
}

export function useResidences() {
  return useQuery({
    queryKey: ["residences"],
    queryFn: async (): Promise<Residence[]> => {
      const local = getLocalResidences();

      if (!isSupabaseConfigured()) {
        return local;
      }
      const supabase = createClient();
      try {
        const { data, error } = await supabase
          .from("residences")
          .select("*")
          .order("nom", { ascending: true });

        if (error) {
          console.warn("Supabase fetch error (residences):", error.message);
          return local;
        }

        return (data as Residence[]) || [];
      } catch (err) {
        console.warn("Supabase error (residences):", err);
        return local;
      }
    },
  });
}

/**
 * Crée une résidence, puis (optionnel) rattache immédiatement une liste de biens existants
 * en mettant à jour leur `groupe_patrimoine` avec le nom de la résidence — c'est ce champ qui
 * reste la source de vérité pour le filtre actif (lib/patrimoineFilterContext.tsx), donc les biens
 * rattachés apparaissent aussitôt dans le sélecteur et les pages déjà filtrées.
 */
export function useCreateResidence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      nom,
      type,
      bienIdsToAttach = [],
    }: {
      nom: string;
      type?: Residence["type"];
      bienIdsToAttach?: string[];
    }) => {
      const trimmedNom = nom.trim();
      if (!trimmedNom) throw new Error("Le nom de la résidence est obligatoire.");

      if (!isSupabaseConfigured()) {
        const localId = "residence_" + Date.now().toString(36) + "_" + Math.random().toString(36).substring(2, 6);
        const created: Residence = { id: localId, nom: trimmedNom, type: type || null, created_at: new Date().toISOString() };
        saveLocalResidences([created, ...getLocalResidences()]);
        return created;
      }

      const supabase = createClient();
      try {
        const { data, error } = await supabase
          .from("residences")
          .insert([{ nom: trimmedNom, type: type || null }])
          .select()
          .single();

        if (error) {
          throw new Error(`Erreur lors de la création de la résidence: ${error.message}`);
        }

        if (bienIdsToAttach.length > 0) {
          const { error: attachError } = await supabase
            .from("biens")
            .update({ groupe_patrimoine: trimmedNom })
            .in("id", bienIdsToAttach);
          if (attachError) {
            console.warn("Résidence créée mais rattachement des biens échoué:", attachError.message);
          }
        }

        saveLocalResidences([data as Residence, ...getLocalResidences()]);
        return data as Residence;
      } catch (err: any) {
        throw new Error(err?.message || "Impossible de créer la résidence.");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["residences"] });
      queryClient.invalidateQueries({ queryKey: ["biens"] });
    },
  });
}

/**
 * Renomme une résidence via le RPC transactionnel `rename_residence` (migration 018) : le nouveau
 * nom est propagé en une seule transaction à `residences.nom` ET à tous les `biens.groupe_patrimoine`
 * qui portaient l'ancien nom — évite la désync décrite dans la migration 017 (le matching du filtre
 * actif se fait par nom exact). Le RPC refuse aussi les collisions de nom au sein d'une même organisation.
 * Retourne { ancienNom, residence } pour permettre à l'appelant de resynchroniser un filtre actif
 * (ex: usePatrimoineFilter().activeGroup) qui pointait sur l'ancien nom.
 */
export function useRenameResidence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      nouveauNom,
      ancienNom,
    }: {
      id: string;
      nouveauNom: string;
      ancienNom: string;
    }) => {
      const trimmed = nouveauNom.trim();
      if (!trimmed) throw new Error("Le nom de la résidence est obligatoire.");

      if (!isSupabaseConfigured()) {
        const locals = getLocalResidences();
        const idx = locals.findIndex((r) => r.id === id);
        if (idx === -1) throw new Error("Résidence introuvable.");
        if (locals.some((r) => r.id !== id && r.nom.trim().toLowerCase() === trimmed.toLowerCase())) {
          throw new Error("Une résidence porte déjà ce nom.");
        }
        locals[idx] = { ...locals[idx], nom: trimmed };
        saveLocalResidences(locals);
        return { ancienNom, residence: locals[idx] };
      }

      const supabase = createClient();
      const { data, error } = await supabase
        .rpc("rename_residence", { p_residence_id: id, p_nouveau_nom: trimmed })
        .single();

      if (error) {
        throw new Error(error.message || "Impossible de renommer la résidence.");
      }

      return { ancienNom, residence: data as Residence };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["residences"] });
      queryClient.invalidateQueries({ queryKey: ["biens"] });
    },
  });
}
