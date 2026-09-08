"use client";

import React, { useMemo, useState } from "react";
import { DataTable } from "@/components/dashboard/shared/DataTable";
import { EmptyState } from "@/components/dashboard/shared/EmptyState";
import { PlusIcon, DocumentTextIcon, CheckCircleIcon, XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Building2 } from "lucide-react";
import { useLeases, type LeaseWithDetails } from "@/lib/hooks/useLocataires";
import { usePatrimoineFilter, useActiveGroupBienIds } from "@/lib/patrimoineFilterContext";
import { AddLocataireModal } from "../locataires/_components/AddLocataireModal";

export default function BauxPage() {
  const { data: allBaux = [], isLoading } = useLeases();
  const { activeGroup, setActiveGroup } = usePatrimoineFilter();
  const activeGroupBienIds = useActiveGroupBienIds();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const baux = useMemo(() => {
    if (!activeGroupBienIds) return allBaux;
    return allBaux.filter((b) => activeGroupBienIds.includes(b.bien_id));
  }, [allBaux, activeGroupBienIds]);

  const filteredBaux = useMemo(() => {
    if (!search.trim()) return baux;
    const q = search.trim().toLowerCase();
    return baux.filter(
      (b) =>
        b.tenant?.full_name?.toLowerCase().includes(q) ||
        b.tenant?.phone_number?.toLowerCase().includes(q) ||
        b.bien?.nom?.toLowerCase().includes(q)
    );
  }, [baux, search]);

  const columns = [
    {
      key: "tenant",
      header: "Locataire",
      renderCell: (row: LeaseWithDetails) => (
        <div>
          <span className="font-bold text-card-foreground block">{row.tenant?.full_name || "Locataire"}</span>
          <span className="text-[11.5px] text-muted-foreground">{row.tenant?.phone_number || ""}</span>
        </div>
      ),
    },
    {
      key: "bien",
      header: "Logement",
      renderCell: (row: LeaseWithDetails) => (
        <span className="text-[13px] font-medium text-card-foreground">{row.bien?.nom || "—"}</span>
      ),
    },
    {
      key: "loyer",
      header: "Loyer mensuel",
      renderCell: (row: LeaseWithDetails) => (
        <span className="font-semibold text-card-foreground">
          {Number(row.rent_amount).toLocaleString("fr-FR")} FCFA
        </span>
      ),
    },
    {
      key: "caution",
      header: "Caution légale",
      renderCell: (row: LeaseWithDetails) => (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
          {Number(row.deposit_amount).toLocaleString("fr-FR")} FCFA ({row.deposit_months || 3} mois)
        </span>
      ),
    },
    {
      key: "statut",
      header: "Statut",
      renderCell: (row: LeaseWithDetails) => (
        <span
          className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
            row.is_active
              ? "bg-emerald-500/10 text-emerald-600"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {row.is_active ? "Bail actif" : "Résilié"}
        </span>
      ),
    },
  ];

  if (isLoading) {
    return <div className="animate-pulse h-64 bg-muted/60 rounded-2xl" />;
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-card border border-border rounded-xl shadow-xs">
        <div>
          <h1 className="text-[20px] font-extrabold text-card-foreground tracking-tight">
            Baux &amp; Contrats de Location
          </h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            Gestion des baux certifiés, cautions séquestrées et échéances (Loi n° 2022-30 du Bénin).
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-[13px] font-bold transition-all shadow-xs cursor-pointer"
        >
          <PlusIcon className="w-4 h-4" /> Nouveau Bail
        </button>
      </div>

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

      {allBaux.length === 0 ? (
        <EmptyState
          icon={DocumentTextIcon}
          title="Aucun contrat de bail enregistré"
          description="Vous n'avez pas encore enregistré de bail actif. Ajoutez votre premier locataire pour générer un contrat conforme à la législation béninoise."
          actionLabel="Créer un bail"
          onAction={() => setIsModalOpen(true)}
        />
      ) : baux.length === 0 ? (
        <div className="text-center py-12 text-[13px] text-muted-foreground border border-dashed border-border rounded-xl">
          Aucun bail dans cette résidence.
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl p-5 shadow-xs">
          <div className="relative max-w-md mb-4">
            <MagnifyingGlassIcon className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un locataire, un téléphone, un logement..."
              className="w-full pl-9 pr-3 py-2.5 border border-border rounded-lg text-[13px] bg-card text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          {filteredBaux.length === 0 ? (
            <div className="text-center py-12 text-[13px] text-muted-foreground border border-dashed border-border rounded-xl">
              Aucun bail ne correspond à cette recherche.
            </div>
          ) : (
            <DataTable data={filteredBaux} columns={columns} keyExtractor={(r) => r.id} />
          )}
        </div>
      )}

      <AddLocataireModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
