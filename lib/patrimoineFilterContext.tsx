"use client";

import * as React from "react";
import { useBiens } from "@/lib/hooks/useBiens";

interface PatrimoineFilterContextValue {
  activeGroup: string | null;
  setActiveGroup: (group: string | null) => void;
}

const PatrimoineFilterContext = React.createContext<PatrimoineFilterContextValue | undefined>(
  undefined
);

export function PatrimoineFilterProvider({ children }: { children: React.ReactNode }) {
  const [activeGroup, setActiveGroup] = React.useState<string | null>(null);

  const value = React.useMemo(() => ({ activeGroup, setActiveGroup }), [activeGroup]);

  return (
    <PatrimoineFilterContext.Provider value={value}>{children}</PatrimoineFilterContext.Provider>
  );
}

export function usePatrimoineFilter() {
  const ctx = React.useContext(PatrimoineFilterContext);
  if (!ctx) {
    // Rendu hors provider (ex: pages admin/locataire) : filtre neutre, jamais d'erreur bloquante.
    return { activeGroup: null, setActiveGroup: () => {} } as PatrimoineFilterContextValue;
  }
  return ctx;
}

/**
 * Dérive la liste des id de biens appartenant à la résidence (groupe de patrimoine) active.
 * Point central unique : toute page qui doit respecter le filtre résidence passe par ici
 * plutôt que de recalculer sa propre comparaison sur `groupe_patrimoine`.
 *
 * Retourne `null` quand aucune résidence n'est active (= pas de filtre, tout est visible).
 * Retourne un tableau d'id (potentiellement vide) quand une résidence est active.
 */
export function useActiveGroupBienIds(): string[] | null {
  const { activeGroup } = usePatrimoineFilter();
  const { data: biens = [] } = useBiens();

  return React.useMemo(() => {
    if (!activeGroup) return null;
    return biens
      .filter((b) => (b.groupe_patrimoine || "").trim() === activeGroup)
      .map((b) => b.id);
  }, [biens, activeGroup]);
}

/**
 * Variante par nom de bien, pour les données historiques qui ne portent pas encore
 * de `bien_id` (ex: anciennes lignes de loyers_transactions / maintenance_tickets
 * enregistrées avant que ces tables soient reliées à `biens`). À utiliser en
 * complément de useActiveGroupBienIds quand l'entité filtrée n'a pas de bien_id fiable.
 *
 * Retourne `null` quand aucune résidence n'est active.
 */
export function useActiveGroupBienNames(): string[] | null {
  const { activeGroup } = usePatrimoineFilter();
  const { data: biens = [] } = useBiens();

  return React.useMemo(() => {
    if (!activeGroup) return null;
    return biens
      .filter((b) => (b.groupe_patrimoine || "").trim() === activeGroup)
      .map((b) => b.nom);
  }, [biens, activeGroup]);
}
