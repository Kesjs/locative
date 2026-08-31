"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/dashboard/shared/DataTable";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function MandatsPage() {
  const { data: mandats = [], isLoading } = useQuery({
    queryKey: ["mandats"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 400));
      return [
        { id: 1, proprietaire: "Jean Dupont", biens: 3, commission: "8%", solde: 1250000 },
        { id: 2, proprietaire: "SCI Les Cocotiers", biens: 12, commission: "7%", solde: 4500000 },
      ];
    },
  });

  const columns = [
    { key: "proprietaire", header: "Propriétaire", renderCell: (row: any) => <span className="font-bold">{row.proprietaire}</span> },
    { key: "biens", header: "Biens Confiés", renderCell: (row: any) => row.biens },
    { key: "commission", header: "Commission", renderCell: (row: any) => row.commission },
    { key: "solde", header: "Solde Net", renderCell: (row: any) => `${row.solde.toLocaleString()} FCFA` },
    { key: "actions", header: "Actions", renderCell: () => (
      <button className="text-[#1C1C1C] font-semibold text-[12px] underline">Voir mandat</button>
    )},
  ];

  if (isLoading) {
    return <div className="animate-pulse h-64 bg-[var(--bg-surface)] rounded-[12px]"></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-[20px] font-extrabold text-[var(--text-primary)]">Mandats & Propriétaires</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#1C1C1C] text-white rounded-[6px] text-[13px] font-bold">
          <PlusIcon className="w-4 h-4" /> Nouveau Mandat
        </button>
      </div>
      <DataTable data={mandats} columns={columns} keyExtractor={(r) => r.id} />
    </div>
  );
}
