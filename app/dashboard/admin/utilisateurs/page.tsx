"use client";

import React from "react";
import Header from "@/components/dashboard/Header";
import { DataTable } from "@/components/dashboard/shared/DataTable";
import { useAdminUtilisateurs } from "@/lib/hooks/useAdmin";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldExclamationIcon, CheckCircleIcon, NoSymbolIcon } from "@heroicons/react/24/outline";

export default function AdminUtilisateursPage() {
  const { data: utilisateurs, isLoading } = useAdminUtilisateurs();

  if (isLoading) {
    return (
      <div className="space-y-6 pb-12">
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  const columns = [
    {
      header: "Nom & Prénom",
      accessorKey: "nom",
      cell: (row: any) => <span className="font-bold text-card-foreground">{row.nom}</span>,
    },
    {
      header: "Email",
      accessorKey: "email",
      cell: (row: any) => <span className="text-muted-foreground">{row.email}</span>,
    },
    {
      header: "Rôle",
      accessorKey: "role",
      cell: (row: any) => (
        <span className="text-[11.5px] bg-accent px-2.5 py-0.5 rounded-full text-foreground border border-border font-semibold">
          {row.role}
        </span>
      ),
    },
    {
      header: "Statut",
      accessorKey: "statut",
      cell: (row: any) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
          row.statut === "Actif" ? "bg-success/10 text-success border-success/20" :
          row.statut === "Bloqué" ? "bg-destructive/10 text-destructive border-destructive/20" :
          "bg-warning/10 text-warning border-warning/20"
        }`}>
          {row.statut}
        </span>
      ),
    },
    {
      header: "Inscrit le",
      accessorKey: "dateInscription",
      cell: (row: any) => <span className="text-muted-foreground">{row.dateInscription || "—"}</span>,
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (row: any) => (
        <div className="flex gap-2">
          {row.statut === "Actif" ? (
            <button className="text-destructive hover:text-destructive/80 font-bold text-[12px] flex items-center gap-1 cursor-pointer">
              <NoSymbolIcon className="h-4 w-4" /> Bloquer
            </button>
          ) : (
            <button className="text-success hover:text-success/80 font-bold text-[12px] flex items-center gap-1 cursor-pointer">
              <CheckCircleIcon className="h-4 w-4" /> Réactiver
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-card border border-border rounded-xl shadow-xs">
        <div>
          <h1 className="text-[20px] font-extrabold text-card-foreground tracking-tight">
            Comptes &amp; Utilisateurs Plateforme
          </h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            Visualisez et gérez les comptes propriétaires, gestionnaires et locataires inscrits.
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 shadow-xs">
        <DataTable data={utilisateurs || []} columns={columns} searchKey="nom" />
      </div>
    </div>
  );
}
