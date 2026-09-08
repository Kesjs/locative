"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { PlusIcon, BuildingOffice2Icon } from "@heroicons/react/24/outline";
import { useUserProfile } from "@/hooks/useUserProfile";
import { EmptyState } from "@/components/dashboard/shared/EmptyState";
import { useBiens, type Bien } from "@/lib/hooks/useBiens";
import { usePatrimoineFilter } from "@/lib/patrimoineFilterContext";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useLoyers } from "@/lib/hooks/useLoyers";
import { AddBienModal } from "./_components/AddBienModal";
import { PatrimoineKpis } from "./_components/PatrimoineKpis";
import { PatrimoineToolbar, type PatrimoineFilters, type VueMode } from "./_components/PatrimoineToolbar";
import { BienCard } from "./_components/BienCard";
import { BienListView } from "./_components/BienListView";
import { BienDetailDrawer } from "./_components/BienDetailDrawer";
import { PatrimoineGridSkeleton } from "./_components/BienCardSkeleton";

import { AddPatrimoineModal } from "./_components/AddPatrimoineModal";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_FILTERS: PatrimoineFilters = {
  search: "",
  statuts: [],
  villes: [],
  tri: "recent",
};

export default function PatrimoinePage() {
  const { role } = useUserProfile();
  const { data: biens = [], isLoading } = useBiens();
  const { data: loyers = [] } = useLoyers();
  const { activeGroup, setActiveGroup } = usePatrimoineFilter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddPatrimoineOpen, setIsAddPatrimoineOpen] = useState(false);
  const [selectedPatrimoine, setSelectedPatrimoine] = useState<string | null>(null);
  const [editBien, setEditBien] = useState<Bien | null>(null);
  const [selectedBien, setSelectedBien] = useState<Bien | null>(null);
  const [vueMode, setVueMode] = useState<VueMode>("grille");
  const [filters, setFilters] = useState<PatrimoineFilters>(DEFAULT_FILTERS);

  const villesDisponibles = useMemo(() => Array.from(new Set(biens.map((b) => b.ville).filter(Boolean))).sort(), [biens]);

  const patrimoinesList = useMemo(() => {
    const set = new Set<string>();
    biens.forEach((b) => {
      const p = b.nom.includes(" - ")
        ? b.nom.split(" - ")[0].trim()
        : b.nom.includes(" (")
        ? b.nom.split(" (")[0].trim()
        : b.nom;
      if (p) set.add(p);
    });
    return Array.from(set).sort();
  }, [biens]);

  const filteredBiens = useMemo(() => {
    let result = [...biens];

    if (activeGroup) {
      result = result.filter((b) => (b.groupe_patrimoine || "").trim() === activeGroup);
    }

    if (selectedPatrimoine) {
      result = result.filter((b) => b.nom.startsWith(selectedPatrimoine));
    }

    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      result = result.filter(
        (b) =>
          b.nom.toLowerCase().includes(q) ||
          b.adresse?.toLowerCase().includes(q) ||
          b.locataire_nom?.toLowerCase().includes(q)
      );
    }
    if (filters.statuts.length > 0) {
      result = result.filter((b) => filters.statuts.includes(b.statut));
    }
    if (filters.villes.length > 0) {
      result = result.filter((b) => filters.villes.includes(b.ville));
    }
    if (filters.loyerMin !== undefined) {
      result = result.filter((b) => b.loyer_mensuel >= filters.loyerMin!);
    }
    if (filters.loyerMax !== undefined) {
      result = result.filter((b) => b.loyer_mensuel <= filters.loyerMax!);
    }

    switch (filters.tri) {
      case "loyer_asc":
        result.sort((a, b) => a.loyer_mensuel - b.loyer_mensuel);
        break;
      case "loyer_desc":
        result.sort((a, b) => b.loyer_mensuel - a.loyer_mensuel);
        break;
      case "statut":
        result.sort((a, b) => a.statut.localeCompare(b.statut));
        break;
      default:
        result.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    }

    return result;
  }, [biens, filters, selectedPatrimoine, activeGroup]);

  const handleFilterVacants30j = () => {
    const now = Date.now();
    const idsVacants30j = biens
      .filter((b) => b.statut === "vacant" && b.created_at && (now - new Date(b.created_at).getTime()) / 86400000 > 30)
      .map((b) => b.id);
    setFilters({ ...DEFAULT_FILTERS, statuts: ["vacant"] });
    void idsVacants30j;
  };

  const openAddModal = () => {
    setEditBien(null);
    setIsModalOpen(true);
  };

  const openEditModal = (bien: Bien) => {
    setEditBien(bien);
    setSelectedBien(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-24 sm:pb-6">
      {/* En-tête avec les 2 actions : Nouveau Patrimoine & Nouveau Lot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[20px] font-extrabold text-foreground">
            {role === "Agence" ? "Portefeuille Biens" : "Patrimoine & Logements"}
          </h1>
          <p className="text-[12.5px] text-muted-foreground mt-0.5">
            Gérez vos ensembles immobiliers et leurs lots (chambres, appartements, boutiques).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAddPatrimoineOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-600/30 bg-emerald-50 text-emerald-700 hover:bg-emerald-100/70 font-bold text-[12.5px] transition-colors cursor-pointer shadow-2xs"
          >
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>+ Nouveau Patrimoine</span>
          </button>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[12.5px] transition-colors cursor-pointer shadow-xs"
          >
            <PlusIcon className="w-4 h-4 text-white" />
            <span>+ Ajouter un Lot</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <PatrimoineGridSkeleton />
      ) : biens.length === 0 ? (
        <EmptyState
          icon={BuildingOffice2Icon}
          title="Aucun logement ou local enregistré"
          description="Créez votre première résidence ou concession pour commencer à piloter vos loyers."
          actionLabel="+ Créer mon premier patrimoine"
          onAction={() => setIsAddPatrimoineOpen(true)}
        />
      ) : (
        <>
          <PatrimoineKpis biens={biens} loyers={loyers} onFilterVacants30j={handleFilterVacants30j} />

          {/* Bandeau filtre actif (groupe de patrimoine choisi dans la sidebar) */}
          {activeGroup && (
            <div className="flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl border border-[var(--primary)]/25 bg-[var(--primary-subtle)] text-[12.5px] font-semibold text-[var(--primary)]">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />
                Filtré sur le groupe « {activeGroup} »
              </span>
              <button
                type="button"
                onClick={() => setActiveGroup(null)}
                className="flex items-center gap-1 text-[11.5px] font-bold px-2 py-1 rounded-lg hover:bg-white/60 cursor-pointer"
              >
                <XMarkIcon className="w-3.5 h-3.5" />
                Retirer le filtre
              </button>
            </div>
          )}

          {/* Onglets Filtres par Patrimoine Parent */}
          {patrimoinesList.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedPatrimoine(null)}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-[12.5px] font-bold border transition-all shrink-0 cursor-pointer",
                  selectedPatrimoine === null
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                )}
              >
                Tous les patrimoines ({biens.length} {biens.length > 1 ? "lots" : "lot"})
              </button>
              {patrimoinesList.map((p) => {
                const count = biens.filter((b) => b.nom.startsWith(p)).length;
                const isSel = selectedPatrimoine === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setSelectedPatrimoine(isSel ? null : p)}
                    className={cn(
                      "px-3.5 py-1.5 rounded-xl text-[12.5px] font-bold border transition-all shrink-0 cursor-pointer flex items-center gap-1.5",
                      isSel
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    )}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{p}</span>
                    <span
                      className={cn(
                        "text-[10.5px] font-bold px-1.5 py-0.2 rounded-full",
                        isSel ? "bg-white/25 text-white" : "bg-slate-100 text-slate-600"
                      )}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <PatrimoineToolbar
            filters={filters}
            onFiltersChange={setFilters}
            vueMode={vueMode}
            onVueModeChange={setVueMode}
            villesDisponibles={villesDisponibles}
            onAdd={openAddModal}
          />

          {filteredBiens.length === 0 ? (
            <div className="text-center py-12 text-[13px] text-muted-foreground border border-dashed border-border rounded-xl">
              Aucun lot ne correspond à ces critères.
            </div>
          ) : vueMode === "grille" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredBiens.map((bien) => (
                  <BienCard key={bien.id} bien={bien} onClick={() => setSelectedBien(bien)} />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <BienListView biens={filteredBiens} onSelect={setSelectedBien} />
          )}
        </>
      )}

      {/* Modale d'ajout d'un lot individuel */}
      <AddBienModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditBien(null);
        }}
        editBien={editBien}
      />

      {/* Modale d'ajout d'un Patrimoine Multi-lots complet */}
      <AddPatrimoineModal
        isOpen={isAddPatrimoineOpen}
        onClose={() => setIsAddPatrimoineOpen(false)}
      />

      <BienDetailDrawer bien={selectedBien} onClose={() => setSelectedBien(null)} onEdit={openEditModal} />
    </div>
  );
}
