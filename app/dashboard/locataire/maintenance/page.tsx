"use client";

import React from "react";
import Header from "@/components/dashboard/Header";
import { DataTable } from "@/components/dashboard/shared/DataTable";
import { useTicketsMaintenance } from "@/lib/hooks/useLocataire";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function LocataireMaintenancePage() {
  const { data: tickets, isLoading } = useTicketsMaintenance();

  if (isLoading) {
    return (
      <div className="space-y-6 pb-12">
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  const columns = [
    {
      header: "Incident / Panne",
      accessorKey: "titre",
      cell: (row: any) => <span className="font-bold text-card-foreground">{row.titre}</span>,
    },
    {
      header: "Catégorie",
      accessorKey: "categorie",
      cell: (row: any) => <span className="text-muted-foreground">{row.categorie || "Général"}</span>,
    },
    {
      header: "Date de signalement",
      accessorKey: "dateCreation",
      cell: (row: any) => <span className="text-muted-foreground">{row.dateCreation || "—"}</span>,
    },
    {
      header: "Statut",
      accessorKey: "statut",
      cell: (row: any) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
          row.statut === "Résolu" ? "bg-success/10 text-success border-success/20" :
          row.statut === "En cours" ? "bg-warning/10 text-warning border-warning/20" :
          "bg-primary/10 text-primary border-primary/20"
        }`}>
          {row.statut}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-card border border-border rounded-xl shadow-xs">
        <div>
          <h1 className="text-[20px] font-extrabold text-card-foreground tracking-tight">
            Demandes d&apos;Intervention &amp; Pannes
          </h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            Signalez un incident technique (plomberie, climatisation, serrurerie) à votre bailleur.
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-[13px] font-bold transition-all shadow-xs cursor-pointer">
          <PlusIcon className="h-4 w-4" />
          Déclarer un incident
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 shadow-xs">
        <DataTable data={tickets || []} columns={columns} searchKey="titre" />
      </div>
    </div>
  );
}

