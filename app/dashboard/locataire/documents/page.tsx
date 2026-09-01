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
      <div className="space-y-6 pb-12">
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
          <DocumentIcon className="h-4 w-4 text-primary" />
          <span className="font-semibold text-card-foreground">{row.nom}</span>
        </div>
      ),
    },
    {
      header: "Type",
      accessorKey: "type",
      cell: (row: any) => (
        <span className="text-[11.5px] bg-accent px-2.5 py-0.5 rounded-full text-foreground border border-border font-semibold">
          {row.type}
        </span>
      ),
    },
    {
      header: "Date d'ajout",
      accessorKey: "dateAjout",
      cell: (row: any) => <span className="text-muted-foreground">{row.dateAjout || "—"}</span>,
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: () => (
        <button className="text-primary hover:text-primary/80 flex items-center gap-1.5 font-bold text-[12px] cursor-pointer">
          <ArrowDownTrayIcon className="h-4 w-4" />
          Télécharger
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="p-5 bg-card border border-border rounded-xl shadow-xs">
        <h1 className="text-[20px] font-extrabold text-card-foreground tracking-tight">
          Mes Documents &amp; Contrats
        </h1>
        <p className="text-[13px] text-muted-foreground mt-1">
          Retrouvez votre bail de location, vos états des lieux et vos attestations légales certifiées.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 shadow-xs">
        <DataTable data={documents || []} columns={columns} searchKey="nom" />
      </div>
    </div>
  );
}

