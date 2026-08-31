"use client";

import React from "react";
import Header from "@/components/dashboard/Header";
import { DataTable } from "@/components/dashboard/DataTable";
import { useQuittances } from "@/lib/hooks/useLocataire";
import { Skeleton } from "@/components/ui/skeleton";
import { DocumentArrowDownIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";

export default function LocataireLoyersPage() {
  const { data: quittances, isLoading } = useQuittances();

  if (isLoading) {
    return (
      <div className="p-6">
        <Header breadcrumbs={["Tableau de bord", "Loyers & Paiements"]} />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  const columns = [
    {
      header: "Mois",
      accessorKey: "mois",
      cell: (row: any) => <span className="font-bold">{row.mois}</span>,
    },
    {
      header: "Montant",
      accessorKey: "montant",
      cell: (row: any) => `${row.montant.toLocaleString("fr-FR")} FCFA`,
    },
    {
      header: "Date de paiement",
      accessorKey: "datePaiement",
      cell: (row: any) => row.datePaiement || "-",
    },
    {
      header: "Statut",
      accessorKey: "statut",
      cell: (row: any) => (
        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700">
          {row.statut}
        </span>
      ),
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: () => (
        <button className="text-[#059669] hover:text-[#047857] flex items-center gap-1 font-semibold text-[12px]">
          <DocumentArrowDownIcon className="h-4 w-4" />
          Télécharger
        </button>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-4">
      <Header breadcrumbs={["Tableau de bord", "Loyers & Paiements"]} />

      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-extrabold text-[var(--text-primary)] tracking-tight">
            Loyers & Quittances
          </h1>
          <p className="text-[14px] text-[var(--text-secondary)] mt-1">
            Gérez vos paiements et téléchargez vos justificatifs.
          </p>
        </div>
        <button className="bg-[#FFCC00] text-black hover:bg-[#E6B800] px-5 py-2.5 rounded-[8px] font-bold text-[13px] shadow-sm transition-all flex items-center gap-2">
          <CurrencyDollarIcon className="h-4 w-4" />
          Nouveau Paiement MoMo
        </button>
      </div>

      <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[12px] p-5 shadow-2xs">
        <DataTable data={quittances || []} columns={columns} searchKey="mois" />
      </div>
    </div>
  );
}
