"use client";

import React, { useState } from "react";
import { DataTable } from "@/components/dashboard/shared/DataTable";
import { CreditCardIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useLoyers } from "@/lib/hooks/useLoyers";
import { AddPaiementModal } from "./_components/AddPaiementModal";

export default function LoyersPage() {
  const [filterMonth, setFilterMonth] = useState("09");
  const [filterYear, setFilterYear] = useState("2026");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: loyers = [], isLoading } = useLoyers();

  // On client side filtering, you could use filterMonth/filterYear, 
  // but for now we'll just display all returned from the hook as it's a demo.

  const columns = [
    { key: "locataire_nom", header: "Locataire", renderCell: (row: any) => <span className="font-bold">{row.locataire_nom}</span> },
    { key: "montant", header: "Montant", renderCell: (row: any) => `${row.montant.toLocaleString()} FCFA` },
    { key: "date", header: "Date", renderCell: (row: any) => row.date_reglement || "-" },
    { key: "statut", header: "Statut", renderCell: (row: any) => {
      let colorClass = "bg-[#F0FDF4] text-[#16A34A]";
      if (row.statut === "en_attente") colorClass = "bg-[#FFF7ED] text-[#EA580C]";
      if (row.statut === "retard") colorClass = "bg-[#FEF2F2] text-[#DC2626]";
      return (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${colorClass}`}>
          {row.statut === "payé" && row.methode ? `Payé (${row.methode})` : row.statut.replace("_", " ")}
        </span>
      );
    }},
    { key: "quittance", header: "Quittance", renderCell: (row: any) => (
      row.statut === "payé" ? <button className="text-[#1C1C1C] font-semibold text-[12px] underline hover:text-[#C5A880]">PDF</button> : <span className="text-[#9C9A95] text-[12px]">-</span>
    )},
  ];

  if (isLoading) {
    return <div className="animate-pulse h-64 bg-[var(--bg-surface)] rounded-[12px]"></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-[20px] font-extrabold text-[var(--text-primary)]">Loyers & Quittances</h1>
        <div className="flex items-center gap-2">
          <select 
            value={filterMonth} 
            onChange={(e) => setFilterMonth(e.target.value)}
            className="border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] bg-white outline-none"
          >
            <option value="08">Août</option>
            <option value="09">Septembre</option>
            <option value="10">Octobre</option>
          </select>
          <select 
            value={filterYear} 
            onChange={(e) => setFilterYear(e.target.value)}
            className="border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] bg-white outline-none"
          >
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </select>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#1C1C1C] text-white rounded-[6px] text-[13px] font-bold hover:bg-black transition-colors"
          >
            <PlusIcon className="w-4 h-4" /> Paiement manuel
          </button>
        </div>
      </div>

      <DataTable data={loyers} columns={columns} keyExtractor={(r) => r.id} />

      <AddPaiementModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} transactions={loyers} />
    </div>
  );
}
