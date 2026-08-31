"use client";

import React from "react";
import Header from "@/components/dashboard/Header";
import { DataTable } from "@/components/dashboard/shared/DataTable";
import { useDocumentsLocataire } from "@/lib/hooks/useLocataire";
import { Skeleton } from "@/components/ui/skeleton";
import { DocumentIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";

export default function LocataireDocumentsPage() {
  const { data: documents, isLoading } = useDocumentsLocataire();

  if (isLoading) {
    return (
      <div className="p-6">
        <Header breadcrumbs={["Tableau de bord", "Mes Documents"]} />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  const columns = [
    {
      header: "Nom du document",
      accessorKey: "nom",
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <DocumentIcon className="h-4 w-4 text-[var(--text-muted)]" />
          <span className="font-semibold text-[var(--text-primary)]">{row.nom}</span>
        </div>
      ),
    },
    {
      header: "Type",
      accessorKey: "type",
      cell: (row: any) => (
        <span className="text-[12px] bg-[var(--bg-subtle)] px-2 py-1 rounded text-[var(--text-secondary)] border border-[var(--border-default)]">
          {row.type}
        </span>
      ),
    },
    {
      header: "Date d'ajout",
      accessorKey: "dateAjout",
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: () => (
        <button className="text-[var(--text-primary)] hover:bg-[var(--hover-bg)] p-2 rounded-md transition-colors">
          <ArrowDownTrayIcon className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-4">
      <Header breadcrumbs={["Tableau de bord", "Mes Documents"]} />

      <div className="mb-6">
        <h1 className="text-[24px] font-extrabold text-[var(--text-primary)] tracking-tight">
          Documents
        </h1>
        <p className="text-[14px] text-[var(--text-secondary)] mt-1">
          Votre bail, état des lieux et autres attestations.
        </p>
      </div>

      <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[12px] p-5 shadow-2xs">
        <DataTable data={documents || []} columns={columns} searchKey="nom" />
      </div>
    </div>
  );
}

