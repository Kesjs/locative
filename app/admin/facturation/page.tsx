"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/dashboard/shared/DataTable";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function AdminFacturationPage() {
  const { data: factures = [], isLoading } = useQuery({
    queryKey: ["admin-facturation"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 400));
      return [
        { id: 1, compte: "Patrimoine Lokka", montant: 5000, date: "01 Sept 2026", statut: "Payé" },
        { id: 2, compte: "Immo Bénin SARL", montant: 25000, date: "31 Août 2026", statut: "Échec" },
      ];
    },
  });

  const columns = [
    { key: "compte", header: "Compte", renderCell: (row: any) => <span className="font-bold">{row.compte}</span> },
    { key: "montant", header: "Montant", renderCell: (row: any) => `${row.montant.toLocaleString()} FCFA` },
    { key: "date", header: "Date", renderCell: (row: any) => row.date },
    { key: "statut", header: "Statut", renderCell: (row: any) => (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
        row.statut === "Payé" ? "bg-[#F0FDF4] text-[#16A34A]" : "bg-[#FEF2F2] text-[#DC2626]"
      }`}>
        {row.statut}
      </span>
    )},
  ];

  const hasFailures = factures.some(f => f.statut === "Échec");

  if (isLoading) {
    return <div className="animate-pulse h-64 bg-white rounded-[12px]"></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-[24px] font-extrabold text-[var(--text-primary)]">Abonnements & Factures</h1>
      
      {hasFailures && (
        <div className="flex items-center gap-3 p-4 bg-[#FEF2F2] border border-[#FCA5A5] rounded-[8px] text-[#DC2626]">
          <ExclamationTriangleIcon className="w-5 h-5 shrink-0" />
          <span className="text-[13px] font-bold">Attention, certains paiements récurrents ont échoué récemment.</span>
        </div>
      )}

      <DataTable data={factures} columns={columns} keyExtractor={(r) => r.id} />
    </div>
  );
}
