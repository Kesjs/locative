"use client";

import React from "react";
import Header from "@/components/dashboard/Header";
import { DataTable } from "@/components/dashboard/DataTable";
import { useTicketsMaintenance } from "@/lib/hooks/useLocataire";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function LocataireMaintenancePage() {
  const { data: tickets, isLoading } = useTicketsMaintenance();

  if (isLoading) {
    return (
      <div className="p-6">
        <Header breadcrumbs={["Tableau de bord", "Maintenance"]} />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  const columns = [
    {
      header: "Incident",
      accessorKey: "titre",
      cell: (row: any) => <span className="font-semibold text-[var(--text-primary)]">{row.titre}</span>,
    },
    {
      header: "Catégorie",
      accessorKey: "categorie",
    },
    {
      header: "Date",
      accessorKey: "dateCreation",
    },
    {
      header: "Statut",
      accessorKey: "statut",
      cell: (row: any) => (
        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
          row.statut === "Résolu" ? "bg-emerald-100 text-emerald-700" :
          row.statut === "En cours" ? "bg-amber-100 text-amber-700" :
          "bg-blue-100 text-blue-700"
        }`}>
          {row.statut}
        </span>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-4">
      <Header breadcrumbs={["Tableau de bord", "Maintenance"]} />

      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-extrabold text-[var(--text-primary)] tracking-tight">
            Maintenance
          </h1>
          <p className="text-[14px] text-[var(--text-secondary)] mt-1">
            Déclarez un incident technique dans votre logement.
          </p>
        </div>
        <button className="bg-[#1C1C1C] dark:bg-white text-white dark:text-black hover:opacity-90 px-5 py-2.5 rounded-[8px] font-bold text-[13px] shadow-sm transition-all flex items-center gap-2">
          <PlusIcon className="h-4 w-4" />
          Déclarer un incident
        </button>
      </div>

      <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[12px] p-5 shadow-2xs">
        <DataTable data={tickets || []} columns={columns} searchKey="titre" />
      </div>
    </div>
  );
}
