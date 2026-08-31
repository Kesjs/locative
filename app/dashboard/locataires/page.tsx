"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/dashboard/shared/DataTable";
import { EmptyState } from "@/components/dashboard/shared/EmptyState";
import { UsersIcon, PlusIcon } from "@heroicons/react/24/outline";

export default function LocatairesPage() {
  const { data: locataires = [], isLoading } = useQuery({
    queryKey: ["locataires"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 400));
      return [
        { id: 1, nom: "Koudjo Dossou", bien: "Villa Cocotiers Apt 2B", loyer: 150000, echeance: "05/10/2026", statut: "À jour" },
        { id: 2, nom: "Rachidi Saka", bien: "Résidence Le Manguier", loyer: 180000, echeance: "01/10/2026", statut: "Retard" },
      ];
    },
  });

  const columns = [
    { key: "nom", header: "Nom", renderCell: (row: any) => <span className="font-bold">{row.nom}</span> },
    { key: "bien", header: "Bien", renderCell: (row: any) => row.bien },
    { key: "loyer", header: "Loyer", renderCell: (row: any) => `${row.loyer.toLocaleString()} FCFA` },
    { key: "echeance", header: "Échéance", renderCell: (row: any) => row.echeance },
    { key: "statut", header: "Statut", renderCell: (row: any) => (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
        row.statut === "À jour" ? "bg-[#F0FDF4] text-[#16A34A]" : "bg-[#FEF2F2] text-[#DC2626]"
      }`}>
        {row.statut}
      </span>
    )},
    { key: "actions", header: "Actions", renderCell: () => (
      <button className="text-[#1C1C1C] font-semibold text-[12px] underline">Voir</button>
    )},
  ];

  if (isLoading) {
    return <div className="animate-pulse h-64 bg-[var(--bg-surface)] rounded-[12px]"></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[20px] font-extrabold text-[var(--text-primary)]">Locataires & Baux</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#1C1C1C] text-white rounded-[6px] text-[13px] font-bold">
          <PlusIcon className="w-4 h-4" /> Nouveau bail
        </button>
      </div>

      {locataires.length === 0 ? (
        <EmptyState
          icon={UsersIcon}
          title="Aucun locataire"
          description="Ajoutez votre premier locataire pour commencer à suivre les baux et loyers."
          actionLabel="Ajouter un locataire"
          onAction={() => {}}
        />
      ) : (
        <DataTable data={locataires} columns={columns} keyExtractor={(r) => r.id} />
      )}
    </div>
  );
}
