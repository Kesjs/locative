"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/dashboard/shared/DataTable";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function BauxPage() {
  const { data: baux = [], isLoading } = useQuery({
    queryKey: ["baux"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 400));
      return [
        { id: 1, locataire: "Koudjo Dossou", mandat: "Jean Dupont", bien: "Villa Cocotiers", loyer: 150000, caution: "Séquestrée" },
        { id: 2, locataire: "Rachidi Saka", mandat: "SCI Les Cocotiers", bien: "Résidence Le Manguier", loyer: 180000, caution: "Séquestrée" },
      ];
    },
  });

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
  ];

  if (isLoading) {
    return <div className="animate-pulse h-64 bg-[var(--bg-surface)] rounded-[12px]"></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-[20px] font-extrabold text-[var(--text-primary)]">Baux & Locataires</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#1C1C1C] text-white rounded-[6px] text-[13px] font-bold">
          <PlusIcon className="w-4 h-4" /> Nouveau Bail
        </button>
      </div>
      <DataTable data={baux} columns={columns} keyExtractor={(r) => r.id} />
    </div>
  );
}
