"use client";

import React, { useState } from "react";
import { DataTable } from "@/components/dashboard/shared/DataTable";
import { EmptyState } from "@/components/dashboard/shared/EmptyState";
import { UsersIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useLocataires } from "@/lib/hooks/useLocataires";
import { AddLocataireModal } from "./_components/AddLocataireModal";

export default function LocatairesPage() {
  const { data: locataires = [], isLoading } = useLocataires();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { key: "nom_complet", header: "Nom", renderCell: (row: any) => <span className="font-bold">{row.nom_complet}</span> },
    { key: "bien_nom", header: "Bien", renderCell: (row: any) => row.bien_nom },
    { key: "loyer_mensuel", header: "Loyer", renderCell: (row: any) => `${row.loyer_mensuel.toLocaleString()} FCFA` },
    { key: "date_entree", header: "Entrée", renderCell: (row: any) => row.date_entree },
    { key: "statut_paiement", header: "Statut", renderCell: (row: any) => (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
        row.statut_paiement === "à jour" ? "bg-[#F0FDF4] text-[#16A34A]" : 
        row.statut_paiement === "retard" ? "bg-[#FFF7ED] text-[#EA580C]" : "bg-[#FEF2F2] text-[#DC2626]"
      }`}>
        {row.statut_paiement}
      </span>
    )},
    { key: "actions", header: "Actions", renderCell: () => (
      <button className="text-[#1C1C1C] font-semibold text-[12px] underline hover:text-[#C5A880]">Voir</button>
    )},
  ];

  if (isLoading) {
    return <div className="animate-pulse h-64 bg-[var(--bg-surface)] rounded-[12px]"></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[20px] font-extrabold text-[var(--text-primary)]">Locataires & Baux</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1C1C1C] text-white rounded-[6px] text-[13px] font-bold hover:bg-black transition-colors"
        >
          <PlusIcon className="w-4 h-4" /> Nouveau bail
        </button>
      </div>

      {locataires.length === 0 ? (
        <EmptyState
          icon={UsersIcon}
          title="Aucun locataire"
          description="Ajoutez votre premier locataire pour commencer à suivre les baux et loyers."
          actionLabel="Ajouter un locataire"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <DataTable data={locataires} columns={columns} keyExtractor={(r) => r.id} />
      )}

      <AddLocataireModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
