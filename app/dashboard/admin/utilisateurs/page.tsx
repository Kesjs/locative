"use client";

import React from "react";
import Header from "@/components/dashboard/Header";
import { DataTable } from "@/components/dashboard/DataTable";
import { useAdminUtilisateurs } from "@/lib/hooks/useAdmin";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldExclamationIcon, CheckCircleIcon, NoSymbolIcon } from "@heroicons/react/24/outline";

export default function AdminUtilisateursPage() {
  const { data: utilisateurs, isLoading } = useAdminUtilisateurs();

  if (isLoading) {
    return (
      <div className="p-6">
        <Header breadcrumbs={["Tableau de bord Admin", "Utilisateurs"]} />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  const columns = [
    {
      header: "Nom",
      accessorKey: "nom",
      cell: (row: any) => <span className="font-semibold text-[var(--text-primary)]">{row.nom}</span>,
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Rôle",
      accessorKey: "role",
      cell: (row: any) => (
        <span className="text-[12px] bg-[var(--bg-subtle)] px-2 py-1 rounded text-[var(--text-secondary)] border border-[var(--border-default)]">
          {row.role}
        </span>
      ),
    },
    {
      header: "Statut",
      accessorKey: "statut",
      cell: (row: any) => (
        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
          row.statut === "Actif" ? "bg-emerald-100 text-emerald-700" :
          row.statut === "Bloqué" ? "bg-red-100 text-red-700" :
          "bg-amber-100 text-amber-700"
        }`}>
          {row.statut}
        </span>
      ),
    },
    {
      header: "Inscrit le",
      accessorKey: "dateInscription",
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (row: any) => (
        <div className="flex gap-2">
          {row.statut !== "Bloqué" ? (
            <button className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-md transition-colors" title="Bloquer">
              <NoSymbolIcon className="h-4 w-4" />
            </button>
          ) : (
            <button className="text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 p-1.5 rounded-md transition-colors" title="Débloquer">
              <CheckCircleIcon className="h-4 w-4" />
            </button>
          )}
          <button className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-1.5 rounded-md transition-colors" title="Forcer mot de passe">
            <ShieldExclamationIcon className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-4">
      <Header breadcrumbs={["Tableau de bord Admin", "Utilisateurs"]} />

      <div className="mb-6">
        <h1 className="text-[24px] font-extrabold text-[var(--text-primary)] tracking-tight">
          Gestion des Utilisateurs
        </h1>
        <p className="text-[14px] text-[var(--text-secondary)] mt-1">
          Gérez l'ensemble des Agences, Bailleurs et Locataires.
        </p>
      </div>

      <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[12px] p-5 shadow-2xs">
        <DataTable data={utilisateurs || []} columns={columns} searchKey="nom" />
      </div>
    </div>
  );
}
