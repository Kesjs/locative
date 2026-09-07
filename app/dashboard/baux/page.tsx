"use client";

import React, { useState } from "react";
import { DataTable } from "@/components/dashboard/shared/DataTable";
import { EmptyState } from "@/components/dashboard/shared/EmptyState";
import { PlusIcon, DocumentTextIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { useLeases, type LeaseWithDetails } from "@/lib/hooks/useLocataires";
import { AddLocataireModal } from "../locataires/_components/AddLocataireModal";

export default function BauxPage() {
  const { data: baux = [], isLoading } = useLeases();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    {
      key: "tenant",
      header: "Locataire",
      renderCell: (row: LeaseWithDetails) => (
        <div>
          <span className="font-bold text-card-foreground block">{row.tenant?.full_name || "Locataire"}</span>
          <span className="text-[11.5px] text-muted-foreground">{row.tenant?.phone_number || ""}</span>
        </div>
      ),
    },
    {
      key: "bien",
      header: "Logement",
      renderCell: (row: LeaseWithDetails) => (
        <span className="text-[13px] font-medium text-card-foreground">{row.bien?.nom || "—"}</span>
      ),
    },
    {
      key: "loyer",
      header: "Loyer mensuel",
      renderCell: (row: LeaseWithDetails) => (
        <span className="font-semibold text-card-foreground">
          {Number(row.rent_amount).toLocaleString("fr-FR")} FCFA
        </span>
      ),
    },
    {
      key: "caution",
      header: "Caution légale",
      renderCell: (row: LeaseWithDetails) => (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
          {Number(row.deposit_amount).toLocaleString("fr-FR")} FCFA ({row.deposit_months || 3} mois)
        </span>
      ),
    },
    {
      key: "statut",
      header: "Statut",
      renderCell: (row: LeaseWithDetails) => (
        <span
          className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
            row.is_active
              ? "bg-emerald-500/10 text-emerald-600"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {row.is_active ? "Bail actif" : "Résilié"}
        </span>
      ),
    },
  ];

  if (isLoading) {
    return <div className="animate-pulse h-64 bg-muted/60 rounded-2xl" />;
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-card border border-border rounded-xl shadow-xs">
        <div>
          <h1 className="text-[20px] font-extrabold text-card-foreground tracking-tight">
            Baux &amp; Contrats de Location
          </h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            Gestion des baux certifiés, cautions séquestrées et échéances (Loi n° 2022-30 du Bénin).
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-[13px] font-bold transition-all shadow-xs cursor-pointer"
        >
          <PlusIcon className="w-4 h-4" /> Nouveau Bail
        </button>
      </div>

      {baux.length === 0 ? (
        <EmptyState
          icon={DocumentTextIcon}
          title="Aucun contrat de bail enregistré"
          description="Vous n'avez pas encore enregistré de bail actif. Ajoutez votre premier locataire pour générer un contrat conforme à la législation béninoise."
          actionLabel="Créer un bail"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="bg-card border border-border rounded-xl p-5 shadow-xs">
          <DataTable data={baux} columns={columns} keyExtractor={(r) => r.id} />
        </div>
      )}

      <AddLocataireModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
