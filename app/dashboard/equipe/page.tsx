"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/dashboard/shared/DataTable";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function EquipePage() {
  const { data: equipe = [], isLoading } = useQuery({
    queryKey: ["equipe"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 400));
      return [
        { id: 1, nom: "Alexandre K.", role: "Administrateur", statut: "Actif" },
        { id: 2, nom: "Marie C.", role: "Comptable", statut: "Actif" },
      ];
    },
  });

  const columns = [
    { key: "nom", header: "Collaborateur", renderCell: (row: any) => <span className="font-bold">{row.nom}</span> },
    { key: "role", header: "Rôle", renderCell: (row: any) => row.role },
    { key: "statut", header: "Statut", renderCell: (row: any) => (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#F0FDF4] text-[#16A34A]">
        {row.statut}
      </span>
    )},
    { key: "actions", header: "Actions", renderCell: () => (
      <button className="text-[#1C1C1C] font-semibold text-[12px] underline">Gérer</button>
    )},
  ];

  if (isLoading) {
    return <div className="animate-pulse h-64 bg-[var(--bg-surface)] rounded-[12px]"></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-[20px] font-extrabold text-[var(--text-primary)]">Équipe & Accès</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#1C1C1C] text-white rounded-[6px] text-[13px] font-bold">
          <PlusIcon className="w-4 h-4" /> Inviter un collaborateur
        </button>
      </div>

      <DataTable data={equipe} columns={columns} keyExtractor={(r) => r.id} />
    </div>
  );
}
