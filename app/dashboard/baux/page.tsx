"use client";

import React, { useState } from "react";
import { DataTable } from "@/components/dashboard/shared/DataTable";
import { EmptyState } from "@/components/dashboard/shared/EmptyState";
import { PlusIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { useBaux } from "@/lib/hooks/useBaux";
import { AddBailModal } from "./_components/AddBailModal";

export default function BauxPage() {
  const { data: baux = [], isLoading } = useBaux();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { key: "locataire", header: "Locataire", renderCell: (row: any) => <span className="font-bold">{row.locataire}</span> },
    { key: "mandat", header: "Mandat", renderCell: (row: any) => <span className="text-[12px] text-[#64635F]">{row.mandat}</span> },
    { key: "bien", header: "Bien", renderCell: (row: any) => row.bien },
    { key: "loyer", header: "Loyer", renderCell: (row: any) => `${row.loyer.toLocaleString()} FCFA` },
    { key: "caution", header: "Caution", renderCell: (row: any) => (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#F3F4F6] text-[#6B7280]">
        {row.caution}
      </span>
    )},
    { key: "actions", header: "Actions", renderCell: () => (
      <button className="text-[#0F172A] font-semibold text-[12px] underline hover:text-[#C5A880]">Détails</button>
    )},
  ];

  if (isLoading) {
    return <div className="animate-pulse h-64 bg-[var(--bg-surface)] rounded-[12px]"></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-[20px] font-extrabold text-[var(--text-primary)]">Baux & Locataires</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#0F172A] text-white rounded-[6px] text-[13px] font-bold hover:bg-black transition-colors"
        >
          <PlusIcon className="w-4 h-4" /> Nouveau Bail
        </button>
      </div>
      
      {baux.length === 0 ? (
        <EmptyState
          icon={DocumentTextIcon}
          title="Aucun bail"
          description="Vous n'avez pas encore enregistré de bail. Ajoutez-en un pour suivre vos cautions et locataires."
          actionLabel="Créer un bail"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <DataTable data={baux} columns={columns} keyExtractor={(r) => r.id} />
      )}

      <AddBailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
