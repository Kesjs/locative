"use client";

import React, { useState } from "react";
import { DataTable } from "@/components/dashboard/shared/DataTable";
import { EmptyState } from "@/components/dashboard/shared/EmptyState";
import { CheckIcon, WalletIcon } from "@heroicons/react/24/outline";
import { useTresorerie, useMarkAsReversed } from "@/lib/hooks/useTresorerie";

export default function TresoreriePage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { data: reversements = [], isLoading } = useTresorerie();
  const { mutateAsync: markAsReversed, isPending } = useMarkAsReversed();

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleMarkAsReversed = async () => {
    if (selectedIds.length === 0) return;
    try {
      await markAsReversed(selectedIds);
      setSelectedIds([]); // Clear selection after success
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    { key: "select", header: "", renderCell: (row: any) => (
      <input 
        type="checkbox" 
        checked={selectedIds.includes(row.id)} 
        onChange={() => toggleSelect(row.id)}
        disabled={row.statut === "Reversé"}
        className="w-4 h-4 rounded border-[#E8E5E0] text-[#16A34A] focus:ring-[#16A34A] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      />
    )},
    { key: "proprietaire", header: "Propriétaire", renderCell: (row: any) => <span className="font-bold">{row.proprietaire}</span> },
    { key: "encaisses", header: "Loyers Encaissés", renderCell: (row: any) => `${row.encaisses.toLocaleString()} FCFA` },
    { key: "commission", header: "Commission Agence", renderCell: (row: any) => {
      const comm = (row.encaisses * row.taux) / 100;
      return <span className="text-[#DC2626] font-semibold">-{comm.toLocaleString()} FCFA</span>;
    }},
    { key: "net", header: "Net à reverser", renderCell: (row: any) => {
      const net = row.encaisses - ((row.encaisses * row.taux) / 100);
      return <span className="text-[#16A34A] font-bold">{net.toLocaleString()} FCFA</span>;
    }},
    { key: "statut", header: "Statut", renderCell: (row: any) => (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
        row.statut === "Reversé" ? "bg-[#E6F5EF] text-[#D97706]" : "bg-[#FEF3C7] text-[#D97706]"
      }`}>
        {row.statut}
      </span>
    )},
  ];

  if (isLoading) {
    return <div className="animate-pulse h-64 bg-[var(--bg-surface)] rounded-[12px]"></div>;
  }

  const totalNet = reversements
    .filter(r => r.statut === "À reverser")
    .reduce((acc, row) => acc + (row.encaisses - ((row.encaisses * row.taux) / 100)), 0);

  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-[20px] font-extrabold text-[var(--text-primary)]">Trésorerie & Reversements</h1>
        {selectedIds.length > 0 && (
          <button 
            onClick={handleMarkAsReversed}
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 bg-[#16A34A] hover:bg-[#15803d] text-white rounded-[6px] text-[13px] font-bold shadow-md transition-colors disabled:opacity-50"
          >
            <CheckIcon className="w-4 h-4" /> 
            {isPending ? "Traitement..." : `Marquer comme reversé (${selectedIds.length})`}
          </button>
        )}
      </div>

      {reversements.length === 0 ? (
        <EmptyState
          icon={WalletIcon}
          title="Aucun encaissement"
          description="Aucun loyer n'a été encaissé. Les reversements apparaîtront ici."
        />
      ) : (
        <DataTable data={reversements} columns={columns} keyExtractor={(r) => r.id} />
      )}

      {/* Sticky footer for total */}
      <div className="fixed bottom-0 left-0 right-0 md:left-[250px] bg-white border-t border-[#E8E5E0] p-4 flex justify-between items-center shadow-lg z-20">
        <span className="text-[14px] font-bold text-[#64635F]">Total Net Restant à Reverser</span>
        <span className="text-[20px] font-extrabold text-[#0F172A]">{totalNet.toLocaleString()} FCFA</span>
      </div>
    </div>
  );
}
