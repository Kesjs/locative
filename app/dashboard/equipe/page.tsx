"use client";

import React, { useMemo, useState } from "react";
import { DataTable } from "@/components/dashboard/shared/DataTable";
import { EmptyState } from "@/components/dashboard/shared/EmptyState";
import { KpiCard } from "@/components/dashboard/shared/KpiCard";
import { PlusIcon, UsersIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Users2, ShieldCheck, UserCheck, Briefcase } from "lucide-react";
import { useEquipe, type EquipeMember } from "@/lib/hooks/useEquipe";
import { AddMemberModal } from "./_components/AddMemberModal";

export default function EquipePage() {
  const { data: equipe = [], isLoading } = useEquipe();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredEquipe = useMemo(() => {
    if (!search.trim()) return equipe;
    const q = search.trim().toLowerCase();
    return equipe.filter(
      (m) =>
        m.nom?.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q) ||
        m.role?.toLowerCase().includes(q)
    );
  }, [equipe, search]);

  const columns = [
    {
      key: "nom",
      header: "Collaborateur",
      renderCell: (row: EquipeMember) => (
        <div>
          <span className="font-bold text-card-foreground block">{row.nom}</span>
          <span className="text-[11.5px] text-muted-foreground">{row.email || "Compte collaborateur"}</span>
        </div>
      ),
    },
    {
      key: "role",
      header: "Rôle au sein du Cabinet",
      renderCell: (row: EquipeMember) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
          {row.role}
        </span>
      ),
    },
    {
      key: "statut",
      header: "Statut",
      renderCell: (row: EquipeMember) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider ${
          row.statut === "Actif"
            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
            : "bg-muted text-muted-foreground border border-border"
        }`}>
          {row.statut}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      renderCell: () => (
        <button
          type="button"
          className="text-blue-600 hover:text-blue-800 font-bold text-[12px] underline cursor-pointer"
        >
          Gérer les accès
        </button>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6 pb-12">
        <div className="h-20 bg-muted/60 animate-pulse rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-28 bg-muted/60 animate-pulse rounded-xl" />
          <div className="h-28 bg-muted/60 animate-pulse rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header Éditorial Cabinet */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 bg-card border border-border rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
              Gouvernance du Cabinet
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">Équipe &amp; Collaborateurs</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-foreground tracking-tight">
            Équipe de Gestion &amp; Droits d'Accès
          </h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            Administrez les gestionnaires de biens, comptables mandataires et agents de recouvrement de votre cabinet.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[13px] font-bold transition-all shadow-xs cursor-pointer"
        >
          <PlusIcon className="w-4 h-4" /> Inviter un collaborateur
        </button>
      </div>

      {/* KPIs Équipe */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <KpiCard
          title="Collaborateurs Actifs"
          value={equipe.length}
          subtitle="Membres ayant accès au portefeuille"
          icon={Users2}
          iconColor="blue"
        />
        <KpiCard
          title="Rôles Spécialisés"
          value={new Set(equipe.map((m) => m.role)).size || 1}
          subtitle="Gestionnaires, comptables & agents terrain"
          icon={Briefcase}
          iconColor="emerald"
        />
      </div>

      {/* Table des Collaborateurs */}
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[15px] font-bold text-card-foreground">Répertoire des Collaborateurs</h3>
            <p className="text-[12px] text-muted-foreground">Liste des membres du cabinet et niveau d'autorisation</p>
          </div>
          <span className="text-[12px] font-bold text-muted-foreground">
            {filteredEquipe.length} membre{filteredEquipe.length > 1 ? "s" : ""}
          </span>
        </div>

        {equipe.length === 0 ? (
          <EmptyState
            icon={UsersIcon}
            title="Aucun collaborateur invité"
            description="Vous êtes actuellement le seul administrateur de votre cabinet. Invitez des gestionnaires ou comptables pour déléguer la gestion des lots."
            actionLabel="Inviter un collaborateur"
            onAction={() => setIsModalOpen(true)}
          />
        ) : (
          <>
            <div className="relative max-w-md mb-4">
              <MagnifyingGlassIcon className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un collaborateur, un rôle, un email..."
                className="w-full pl-9 pr-3 py-2.5 border border-border rounded-lg text-[13px] bg-card text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            {filteredEquipe.length === 0 ? (
              <div className="text-center py-12 text-[13px] text-muted-foreground border border-dashed border-border rounded-xl">
                Aucun collaborateur ne correspond à cette recherche.
              </div>
            ) : (
              <DataTable data={filteredEquipe} columns={columns} keyExtractor={(r) => r.id} />
            )}
          </>
        )}
      </div>

      <AddMemberModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
