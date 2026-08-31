"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/dashboard/shared/DataTable";

export default function AdminMarketplacePage() {
  const [filter, setFilter] = useState("En attente");

  const { data: annonces = [], isLoading } = useQuery({
    queryKey: ["admin-marketplace", filter],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 400));
      return [
        { id: 1, titre: "Villa Les Cocotiers", auteur: "Patrimoine Lokka", date: "31 Août 2026", statut: "En attente" },
      ].filter(a => filter === "Tous" || a.statut === filter);
    },
  });

  const columns = [
    { key: "titre", header: "Annonce", renderCell: (row: any) => <span className="font-bold">{row.titre}</span> },
    { key: "auteur", header: "Auteur", renderCell: (row: any) => row.auteur },
    { key: "date", header: "Date de soumission", renderCell: (row: any) => row.date },
    { key: "statut", header: "Statut", renderCell: (row: any) => (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#FFF7ED] text-[#EA580C]">
        {row.statut}
      </span>
    )},
    { key: "actions", header: "Modération", renderCell: (row: any) => (
      <div className="flex items-center gap-2">
        <button className="px-2 py-1 bg-[#16A34A] text-white rounded-[4px] text-[11px] font-bold">Valider</button>
        <button className="px-2 py-1 bg-[#DC2626] text-white rounded-[4px] text-[11px] font-bold">Rejeter</button>
      </div>
    )},
  ];

  if (isLoading) {
    return <div className="animate-pulse h-64 bg-white rounded-[12px]"></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-[24px] font-extrabold text-[var(--text-primary)]">Modération Marketplace</h1>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] bg-white outline-none"
        >
          <option value="Tous">Tous les statuts</option>
          <option value="En attente">En attente</option>
          <option value="Validé">Validé</option>
          <option value="Rejeté">Rejeté</option>
        </select>
      </div>
      
      <DataTable data={annonces} columns={columns} keyExtractor={(r) => r.id} />
    </div>
  );
}
