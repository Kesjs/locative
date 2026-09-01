"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { PlusIcon, BuildingOffice2Icon } from "@heroicons/react/24/outline";
import { useUserProfile } from "@/hooks/useUserProfile";
import { EmptyState } from "@/components/dashboard/shared/EmptyState";
import { useBiens, type Bien } from "@/lib/hooks/useBiens";
import { useLoyers } from "@/lib/hooks/useLoyers";
import { AddBienModal } from "./_components/AddBienModal";
import { PatrimoineKpis } from "./_components/PatrimoineKpis";
import { PatrimoineToolbar, type PatrimoineFilters, type VueMode } from "./_components/PatrimoineToolbar";
import { BienCard } from "./_components/BienCard";
import { BienListView } from "./_components/BienListView";
import { BienDetailDrawer } from "./_components/BienDetailDrawer";
import { PatrimoineGridSkeleton } from "./_components/BienCardSkeleton";

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editBien, setEditBien] = useState<Bien | null>(null);
  const [selectedBien, setSelectedBien] = useState<Bien | null>(null);
  const [vueMode, setVueMode] = useState<VueMode>("grille");
  const [filters, setFilters] = useState<PatrimoineFilters>(DEFAULT_FILTERS);

  const villesDisponibles = useMemo(() => Array.from(new Set(biens.map((b) => b.ville).filter(Boolean))).sort(), [biens]);

  const filteredBiens = useMemo(() => {
    let result = [...biens];

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
  }, [biens, filters]);

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
      <div className="flex items-center justify-between">
        <h1 className="text-[20px] font-extrabold text-foreground">
          {role === "Agence" ? "Portefeuille Biens" : "Logements & Locaux"}
        </h1>
      </div>

      {isLoading ? (
        <PatrimoineGridSkeleton />
      ) : biens.length === 0 ? (
        <EmptyState
          icon={BuildingOffice2Icon}
          title="Aucun logement ou local enregistré"
          description="Ajoutez vos appartements, villas, boutiques ou bureaux pour activer le suivi en direct."
          actionLabel="Ajouter un logement / local"
          onAction={openAddModal}
        />
      ) : (
        <>
          <PatrimoineKpis biens={biens} loyers={loyers} onFilterVacants30j={handleFilterVacants30j} />

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
              Aucun bien ne correspond à ces critères.
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

      <AddBienModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditBien(null);
        }}
        editBien={editBien}
      />

      <BienDetailDrawer bien={selectedBien} onClose={() => setSelectedBien(null)} onEdit={openEditModal} />
    </div>
  );
}
