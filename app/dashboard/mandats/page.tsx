"use client";

import React, { useState } from "react";
import { DataTable } from "@/components/dashboard/shared/DataTable";
import { EmptyState } from "@/components/dashboard/shared/EmptyState";
import { KpiCard } from "@/components/dashboard/shared/KpiCard";
import { PlusIcon, BriefcaseIcon } from "@heroicons/react/24/outline";
import { FileSignature, Building2, HandCoins, Landmark } from "lucide-react";
import { useMandats } from "@/lib/hooks/useMandats";
import { AddMandatModal } from "./_components/AddMandatModal";

export default function MandatsPage() {
  const { data: mandats = [], isLoading } = useMandats();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalLots = mandats.reduce((sum, m) => sum + (m.biens || 0), 0);
  const totalSolde = mandats.reduce((sum, m) => sum + (m.solde || 0), 0);

  const columns = [
    {
      key: "proprietaire",
      header: "Propriétaire Mandant",
      renderCell: (row: any) => (
        <div>
          <span className="font-bold text-card-foreground block">{row.proprietaire}</span>
          <span className="text-[11.5px] text-muted-foreground">Mandat actif · Loi 2022-30</span>
        </div>
      ),
    },
    {
      key: "biens",
      header: "Lots Confiés",
      renderCell: (row: any) => (
        <span className="font-semibold text-card-foreground">
          {row.biens} lot{row.biens > 1 ? "s" : ""}
        </span>
      ),
    },
    {
      key: "commission",
      header: "Taux Honoraires",
      renderCell: (row: any) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
          {row.commission || "10%"}
        </span>
      ),
    },
    {
      key: "solde",
      header: "Solde Net Mandant",
      renderCell: (row: any) => (
        <span className="font-mono font-bold text-emerald-600">
          {Number(row.solde).toLocaleString("fr-FR")} FCFA
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      renderCell: () => (
        <button
          type="button"
          onClick={() => {}}
          className="text-blue-600 hover:text-blue-800 font-bold text-[12px] underline cursor-pointer"
        >
          Voir la convention
        </button>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-20 bg-muted/60 animate-pulse rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="h-28 bg-muted/60 animate-pulse rounded-xl" />
          <div className="h-28 bg-muted/60 animate-pulse rounded-xl" />
          <div className="h-28 bg-muted/60 animate-pulse rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header Éditorial */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 bg-card border border-border rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
              Gestion Mandataire
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">Bénin &amp; UEMOA</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-foreground tracking-tight">
            Conventions de Mandats de Gérance
          </h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            Administration des contrats de gestion liant l'agence aux propriétaires mandants (taux légal plafonné à 10%).
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[13px] font-bold transition-all shadow-xs cursor-pointer"
        >
          <PlusIcon className="w-4 h-4" /> Nouveau Mandat
        </button>
      </div>

      {/* KPIs Mandats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          title="Mandats Actifs"
          value={mandats.length}
          subtitle="Conventions signées en cours"
          icon={FileSignature}
          iconColor="blue"
        />
        <KpiCard
          title="Lots sous Mandat"
          value={totalLots}
          subtitle="Appartements, villas et locaux"
          icon={Building2}
          iconColor="emerald"
        />
        <KpiCard
          title="Soldes Net Mandants"
          value={totalSolde}
          currency="FCFA"
          subtitle="Montants à reverser aux propriétaires"
          icon={Landmark}
          iconColor="amber"
        />
      </div>

      {/* Table des Mandats */}
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[15px] font-bold text-card-foreground">Répertoire des Mandats de Gérance</h3>
            <p className="text-[12px] text-muted-foreground">Liste des propriétaires et conditions de rémunération de l'agence</p>
          </div>
          <span className="text-[12px] font-bold text-muted-foreground">
            {mandats.length} contrat{mandats.length > 1 ? "s" : ""}
          </span>
        </div>

        {mandats.length === 0 ? (
          <EmptyState
            icon={BriefcaseIcon}
            title="Aucun mandat enregistré"
            description="Vous n'avez pas encore enregistré de convention de gestion. Créez votre premier mandat pour lier un propriétaire à ses biens."
            actionLabel="Créer un mandat"
            onAction={() => setIsModalOpen(true)}
          />
        ) : (
          <DataTable data={mandats} columns={columns} keyExtractor={(r) => r.id} />
        )}
      </div>

      <AddMandatModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
