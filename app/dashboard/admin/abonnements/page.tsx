"use client";

import React from "react";
import Header from "@/components/dashboard/Header";
import { DataTable } from "@/components/dashboard/DataTable";
import { useAdminAbonnements } from "@/lib/hooks/useAdmin";
import { Skeleton } from "@/components/ui/skeleton";
import { CreditCardIcon } from "@heroicons/react/24/outline";

export default function AdminAbonnementsPage() {
  const { data: abonnements, isLoading } = useAdminAbonnements();

  if (isLoading) {
    return (
      <div className="p-6">
        <Header breadcrumbs={["Tableau de bord Admin", "Abonnements"]} />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  const columns = [
    {
      header: "Agence / Bailleur",
      accessorKey: "agence",
      cell: (row: any) => <span className="font-semibold text-[var(--text-primary)]">{row.agence}</span>,
    },
    {
      header: "Plan",
      accessorKey: "plan",
    },
    {
      header: "Statut",
      accessorKey: "statut",
      cell: (row: any) => (
        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
          row.statut === "Actif" ? "bg-emerald-100 text-emerald-700" :
          row.statut === "Impayé" ? "bg-red-100 text-red-700" :
          "bg-amber-100 text-amber-700"
        }`}>
          {row.statut}
        </span>
      ),
    },
    {
      header: "Date d'expiration",
      accessorKey: "dateFin",
    },
    {
      header: "Montant (Mensuel)",
      accessorKey: "montant",
      cell: (row: any) => `${row.montant.toLocaleString("fr-FR")} FCFA`,
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: () => (
        <button className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 py-1 rounded text-[12px] font-semibold transition-colors">
          Gérer
        </button>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-4">
      <Header breadcrumbs={["Tableau de bord Admin", "Abonnements"]} />

      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-extrabold text-[var(--text-primary)] tracking-tight">
            Abonnements SaaS
          </h1>
          <p className="text-[14px] text-[var(--text-secondary)] mt-1">
            Suivi des souscriptions Lokka Pro et Entreprise.
          </p>
        </div>
        <button className="bg-[var(--color-brand-primary)] text-[var(--color-brand-text)] hover:opacity-90 px-5 py-2.5 rounded-[8px] font-bold text-[13px] shadow-sm transition-all flex items-center gap-2">
          <CreditCardIcon className="h-4 w-4" />
          Nouveau Plan
        </button>
      </div>

      <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[12px] p-5 shadow-2xs">
        <DataTable data={abonnements || []} columns={columns} searchKey="agence" />
      </div>
    </div>
  );
}
