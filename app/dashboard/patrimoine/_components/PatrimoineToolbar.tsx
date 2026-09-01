"use client";

import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  Squares2X2Icon,
  Bars3Icon,
  PlusIcon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export type StatutFiltre = "loué" | "vacant" | "travaux";
export type TriOption = "recent" | "loyer_asc" | "loyer_desc" | "statut";
export type VueMode = "grille" | "liste";

export interface PatrimoineFilters {
  search: string;
  statuts: StatutFiltre[];
  villes: string[];
  loyerMin?: number;
  loyerMax?: number;
  tri: TriOption;
}

interface PatrimoineToolbarProps {
  filters: PatrimoineFilters;
  onFiltersChange: (filters: PatrimoineFilters) => void;
  vueMode: VueMode;
  onVueModeChange: (mode: VueMode) => void;
  villesDisponibles: string[];
  onAdd: () => void;
}

const STATUTS: { value: StatutFiltre; label: string }[] = [
  { value: "loué", label: "Loué" },
  { value: "vacant", label: "Vacant" },
  { value: "travaux", label: "Travaux" },
];

const TRI_OPTIONS: { value: TriOption; label: string }[] = [
  { value: "recent", label: "Plus récents" },
  { value: "loyer_desc", label: "Loyer décroissant" },
  { value: "loyer_asc", label: "Loyer croissant" },
  { value: "statut", label: "Statut" },
];

export function PatrimoineToolbar({
  filters,
  onFiltersChange,
  vueMode,
  onVueModeChange,
  villesDisponibles,
  onAdd,
}: PatrimoineToolbarProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [triOpen, setTriOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const triRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false);
      if (triRef.current && !triRef.current.contains(e.target as Node)) setTriOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleStatut = (s: StatutFiltre) => {
    const next = filters.statuts.includes(s) ? filters.statuts.filter((x) => x !== s) : [...filters.statuts, s];
    onFiltersChange({ ...filters, statuts: next });
  };

  const toggleVille = (v: string) => {
    const next = filters.villes.includes(v) ? filters.villes.filter((x) => x !== v) : [...filters.villes, v];
    onFiltersChange({ ...filters, villes: next });
  };

  const activeFilterCount = filters.statuts.length + filters.villes.length + (filters.loyerMin ? 1 : 0) + (filters.loyerMax ? 1 : 0);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      {/* Recherche */}
      <div className="relative flex-1 min-w-0">
        <MagnifyingGlassIcon className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          placeholder="Rechercher un bien, une adresse, un locataire..."
          className="w-full pl-9 pr-9 py-2.5 border border-border rounded-lg text-[13px] bg-card outline-none focus-visible:ring-2 focus-visible:ring-ring transition-shadow"
        />
        {filters.search && (
          <button
            type="button"
            onClick={() => onFiltersChange({ ...filters, search: "" })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Filtres */}
        <div className="relative" ref={filterRef}>
          <button
            type="button"
            onClick={() => setFilterOpen((o) => !o)}
            className={`flex items-center gap-1.5 px-3 py-2.5 border rounded-lg text-[13px] font-semibold transition-colors ${
              activeFilterCount > 0 ? "border-primary/40 bg-primary/5 text-primary" : "border-border text-foreground hover:bg-muted/50"
            }`}
          >
            <FunnelIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Filtres</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
          <AnimatePresence>
            {filterOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute right-0 sm:left-0 mt-2 w-72 bg-popover border border-border rounded-xl shadow-modal p-4 z-30"
              >
                <div className="mb-3">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase mb-2">Statut</p>
                  <div className="flex flex-wrap gap-1.5">
                    {STATUTS.map((s) => (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => toggleStatut(s.value)}
                        className={`px-2.5 py-1 rounded-full text-[12px] font-semibold border transition-colors ${
                          filters.statuts.includes(s.value)
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-border text-muted-foreground hover:bg-muted/50"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {villesDisponibles.length > 0 && (
                  <div className="mb-3">
                    <p className="text-[11px] font-bold text-muted-foreground uppercase mb-2">Ville</p>
                    <div className="flex flex-wrap gap-1.5">
                      {villesDisponibles.map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => toggleVille(v)}
                          className={`px-2.5 py-1 rounded-full text-[12px] font-semibold border transition-colors ${
                            filters.villes.includes(v)
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-border text-muted-foreground hover:bg-muted/50"
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-1">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase mb-2">Loyer (FCFA)</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.loyerMin ?? ""}
                      onChange={(e) => onFiltersChange({ ...filters, loyerMin: e.target.value ? Number(e.target.value) : undefined })}
                      className="w-full border border-border rounded-md px-2 py-1.5 text-[12px] outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <span className="text-muted-foreground text-[12px]">–</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.loyerMax ?? ""}
                      onChange={(e) => onFiltersChange({ ...filters, loyerMax: e.target.value ? Number(e.target.value) : undefined })}
                      className="w-full border border-border rounded-md px-2 py-1.5 text-[12px] outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                </div>

                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={() => onFiltersChange({ ...filters, statuts: [], villes: [], loyerMin: undefined, loyerMax: undefined })}
                    className="mt-3 w-full text-center text-[12px] font-semibold text-muted-foreground hover:text-foreground py-1.5"
                  >
                    Réinitialiser les filtres
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tri */}
        <div className="relative" ref={triRef}>
          <button
            type="button"
            onClick={() => setTriOpen((o) => !o)}
            className="flex items-center gap-1.5 px-3 py-2.5 border border-border rounded-lg text-[13px] font-semibold text-foreground hover:bg-muted/50 transition-colors"
          >
            <span className="hidden sm:inline">{TRI_OPTIONS.find((t) => t.value === filters.tri)?.label}</span>
            <ChevronDownIcon className="w-3.5 h-3.5" />
          </button>
          <AnimatePresence>
            {triOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-xl shadow-modal p-1.5 z-30"
              >
                {TRI_OPTIONS.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => {
                      onFiltersChange({ ...filters, tri: t.value });
                      setTriOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                      filters.tri === t.value ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Toggle vue */}
        <div className="flex items-center border border-border rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => onVueModeChange("grille")}
            aria-label="Vue grille"
            className={`p-2 rounded-md transition-colors ${vueMode === "grille" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted/50"}`}
          >
            <Squares2X2Icon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onVueModeChange("liste")}
            aria-label="Vue liste"
            className={`p-2 rounded-md transition-colors ${vueMode === "liste" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted/50"}`}
          >
            <Bars3Icon className="w-4 h-4" />
          </button>
        </div>

        {/* Ajouter (desktop) */}
        <button
          type="button"
          onClick={onAdd}
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-[13px] font-bold hover:bg-primary/90 transition-colors shadow-xs"
        >
          <PlusIcon className="w-4 h-4" /> Ajouter un bien
        </button>
      </div>

      {/* Ajouter (mobile, sticky) */}
      <button
        type="button"
        onClick={onAdd}
        className="sm:hidden fixed bottom-20 right-4 z-30 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center active:scale-95 transition-transform"
        aria-label="Ajouter un bien"
      >
        <PlusIcon className="w-6 h-6" />
      </button>
    </div>
  );
}
