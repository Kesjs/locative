"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/dashboard/shared/DataTable";
import { CheckIcon } from "@heroicons/react/24/outline";

export default function TresoreriePage() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { data: reversements = [], isLoading } = useQuery({
    queryKey: ["tresorerie"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 400));
      return [
        { id: 1, proprietaire: "Jean Dupont", encaisses: 600000, taux: 8, statut: "À reverser" },
        { id: 2, proprietaire: "SCI Les Cocotiers", encaisses: 1800000, taux: 7, statut: "À reverser" },
      ];
    },
  });

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const columns = [
    { key: "select", header: "", renderCell: (row: any) => (
      <input type="checkbox" checked={selectedIds.includes(row.id)} onChange={() => toggleSelect(row.id)} />
    )},
    { key: "proprietaire", header: "Propriétaire", renderCell: (row: any) => <span className="font-bold">{row.proprietaire}</span> },
    { key: "encaisses", header: "Loyers Encaissés", renderCell: (row: any) => `${row.encaisses.toLocaleString()} FCFA` },
    { key: "commission", header: "Commission Agence", renderCell: (row: any) => {
      const comm = (row.encaisses * row.taux) / 100;
      return <span className="text-[#C92A2A] font-semibold">-{comm.toLocaleString()} FCFA</span>;
    }},
    { key: "net", header: "Net à reverser", renderCell: (row: any) => {
      const net = row.encaisses - ((row.encaisses * row.taux) / 100);
      return <span className="text-[#16A34A] font-bold">{net.toLocaleString()} FCFA</span>;
    }},
  ];

  if (isLoading) {
    return <div className="animate-pulse h-64 bg-[var(--bg-surface)] rounded-[12px]"></div>;
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-[20px] font-extrabold text-[var(--text-primary)]">Trésorerie & Reversements</h1>
        {selectedIds.length > 0 && (
          <button className="flex items-center gap-2 px-4 py-2 bg-[#16A34A] text-white rounded-[6px] text-[13px] font-bold shadow-md">
            <CheckIcon className="w-4 h-4" /> Marquer comme reversé ({selectedIds.length})
          </button>
        )}
      </div>

      <DataTable data={reversements} columns={columns} keyExtractor={(r) => r.id} />

      {/* Sticky footer for total */}
      <div className="fixed bottom-0 left-0 right-0 md:left-[250px] bg-white border-t border-[#E8E5E0] p-4 flex justify-between items-center shadow-lg z-20">
        <span className="text-[14px] font-bold text-[#64635F]">Total Net à reverser</span>
        <span className="text-[20px] font-extrabold text-[#1C1C1C]">2 232 000 FCFA</span>
      </div>
    </div>
  );
}
