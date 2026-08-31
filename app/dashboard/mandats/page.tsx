"use client";

import React, { useState } from "react";
import { DataTable } from "@/components/dashboard/shared/DataTable";
import { EmptyState } from "@/components/dashboard/shared/EmptyState";
import { PlusIcon, BriefcaseIcon } from "@heroicons/react/24/outline";
import { useMandats } from "@/lib/hooks/useMandats";
import { AddMandatModal } from "./_components/AddMandatModal";

export default function MandatsPage() {
  const { data: mandats = [], isLoading } = useMandats();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { key: "proprietaire", header: "Propriétaire", renderCell: (row: any) => <span className="font-bold">{row.proprietaire}</span> },
    { key: "biens", header: "Biens Confiés", renderCell: (row: any) => row.biens },
    { key: "commission", header: "Commission", renderCell: (row: any) => row.commission },
    { key: "solde", header: "Solde Net", renderCell: (row: any) => `${row.solde.toLocaleString()} FCFA` },
    { key: "actions", header: "Actions", renderCell: () => (
      <button className="text-[#1C1C1C] font-semibold text-[12px] underline hover:text-[#087F5B]">Voir mandat</button>
    )},
  ];

  if (isLoading) {
    return <div className="animate-pulse h-64 bg-[var(--bg-surface)] rounded-[12px]"></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-[20px] font-extrabold text-[var(--text-primary)]">Mandats & Propriétaires</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1C1C1C] text-white rounded-[6px] text-[13px] font-bold hover:bg-black transition-colors"
        >
          <PlusIcon className="w-4 h-4" /> Nouveau Mandat
        </button>
      </div>

      {mandats.length === 0 ? (
        <EmptyState
          icon={BriefcaseIcon}
          title="Aucun mandat actif"
          description="Vous n'avez pas encore enregistré de mandat de gestion. Ajoutez un propriétaire pour commencer."
          actionLabel="Créer un mandat"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <DataTable data={mandats} columns={columns} keyExtractor={(r) => r.id} />
      )}

      <AddMandatModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
