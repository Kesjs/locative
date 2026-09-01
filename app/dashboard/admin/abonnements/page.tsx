"use client";

import React from "react";
import Header from "@/components/dashboard/Header";
import { DataTable } from "@/components/dashboard/shared/DataTable";
import { useAdminAbonnements } from "@/lib/hooks/useAdmin";
import { Skeleton } from "@/components/ui/skeleton";
import { CreditCardIcon } from "@heroicons/react/24/outline";

export default function AdminAbonnementsPage() {
  const { data: abonnements, isLoading } = useAdminAbonnements();

  if (isLoading) {
    return (
      <div className="space-y-6 pb-12">
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  const columns = [
    {
      header: "Agence / Bailleur",
      accessorKey: "agence",
      cell: (row: any) => <span className="font-bold text-card-foreground">{row.agence}</span>,
    },
    {
      header: "Formule / Plan",
      accessorKey: "plan",
      cell: (row: any) => (
        <span className="font-semibold text-primary">{row.plan}</span>
      ),
    },
    {
      header: "Statut",
      accessorKey: "statut",
      cell: (row: any) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
          row.statut === "Actif" ? "bg-success/10 text-success border-success/20" :
          row.statut === "Impayé" ? "bg-destructive/10 text-destructive border-destructive/20" :
          "bg-warning/10 text-warning border-warning/20"
        }`}>
          {row.statut}
        </span>
      ),
    },
    {
      header: "Date d'expiration",
      accessorKey: "dateFin",
      cell: (row: any) => <span className="text-muted-foreground">{row.dateFin || "—"}</span>,
    },
    {
      header: "Montant (Mensuel)",
      accessorKey: "montant",
      cell: (row: any) => (
        <span className="tabular-nums font-bold text-card-foreground">
          {Number(row.montant).toLocaleString("fr-FR")} FCFA
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-card border border-border rounded-xl shadow-xs">
        <div>
          <h1 className="text-[20px] font-extrabold text-card-foreground tracking-tight">
            Gestion des Abonnements &amp; Facturation
          </h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            Suivi des formules souscrites par les agences et bailleurs (Starter, Pro, Agence).
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 shadow-xs">
        <DataTable data={abonnements || []} columns={columns} searchKey="agence" />
      </div>
    </div>
  );
}

