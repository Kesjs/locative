"use client";

import React from "react";
import Header from "@/components/dashboard/Header";
import { DataTable } from "@/components/dashboard/shared/DataTable";
import { useQuittances } from "@/lib/hooks/useLocataire";
import { Skeleton } from "@/components/ui/skeleton";
import { DocumentArrowDownIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";

export default function LocataireLoyersPage() {
  const { data: quittances, isLoading } = useQuittances();

  if (isLoading) {
    return (
      <div className="space-y-6 pb-12">
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  const columns = [
    {
      header: "Mois",
      accessorKey: "mois",
      cell: (row: any) => <span className="font-bold text-card-foreground">{row.mois}</span>,
    },
    {
      header: "Montant",
      accessorKey: "montant",
      cell: (row: any) => (
        <span className="tabular-nums font-semibold text-card-foreground">
          {Number(row.montant).toLocaleString("fr-FR")} FCFA
        </span>
      ),
    },
    {
      header: "Date de paiement",
      accessorKey: "datePaiement",
      cell: (row: any) => <span className="text-muted-foreground">{row.datePaiement || "—"}</span>,
    },
    {
      header: "Statut",
      accessorKey: "statut",
      cell: (row: any) => (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-success/10 text-success border border-success/20">
          {row.statut}
        </span>
      ),
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: () => (
        <button className="text-primary hover:text-primary/80 flex items-center gap-1.5 font-bold text-[12px] cursor-pointer">
          <DocumentArrowDownIcon className="h-4 w-4" />
          Télécharger Quittance PDF
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-card border border-border rounded-xl shadow-xs">
        <div>
          <h1 className="text-[20px] font-extrabold text-card-foreground tracking-tight">
            Loyers & Quittances
          </h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            Consultez l&apos;historique de vos paiements et téléchargez vos quittances officielles.
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#9D6B3C] hover:bg-[#85572E] text-white rounded-lg text-[13px] font-bold transition-all shadow-xs cursor-pointer">
          <CurrencyDollarIcon className="h-4 w-4" />
          Payer par MTN / Moov MoMo
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 shadow-xs">
        <DataTable data={quittances || []} columns={columns} searchKey="mois" />
      </div>
    </div>
  );
}

