"use client";

import React from "react";
import {
  BanknotesIcon,
  DocumentTextIcon,
  WrenchScrewdriverIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { useContratLocataire, useQuittances, useTicketsMaintenance } from "@/lib/hooks/useLocataire";
import { KpiCard } from "@/components/dashboard/shared/KpiCard";
import { DataTable } from "@/components/dashboard/shared/DataTable";
import Header from "@/components/dashboard/Header";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function LocataireOverviewPage() {
  const { data: contrat, isLoading: loadingContrat } = useContratLocataire();
  const { data: quittances, isLoading: loadingQuittances } = useQuittances();
  const { data: tickets, isLoading: loadingTickets } = useTicketsMaintenance();

  const isDark =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  // Render Loading State
  if (loadingContrat || loadingQuittances || loadingTickets) {
    return (
      <div className="p-6">
        <Header breadcrumbs={["Tableau de bord", "Mon Résumé"]} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[120px] rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[300px] rounded-xl" />
      </div>
    );
  }

  const dernierPaiement = quittances?.[0];
  const ticketEnCours = tickets?.filter((t) => t.statut === "En cours").length || 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-4">
      <Header
        breadcrumbs={["Tableau de bord", "Mon Résumé"]}
      />

      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-extrabold text-[var(--text-primary)] tracking-tight">
            Bonjour ! 👋
          </h1>
          <p className="text-[14px] text-[var(--text-secondary)] mt-1">
            Bienvenue dans votre espace locataire Lokka.
          </p>
        </div>
        <button
          className="bg-[#059669] hover:bg-[#047857] text-white px-5 py-2.5 rounded-[8px] font-bold text-[13px] shadow-sm transition-all"
        >
          Payer le loyer (MoMo)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <KpiCard
          title="Loyer actuel & Charges"
          value={`${((contrat?.loyerMensuel || 0) + (contrat?.chargesMensuelles || 0)).toLocaleString("fr-FR")} FCFA`}
          subtitle={`Prochain paiement : ${contrat?.prochainPaiement}`}
          icon={BanknotesIcon}
          trend={dernierPaiement?.statut === "Payé" ? "+ À jour" : "- En attente"}
          trendUp={dernierPaiement?.statut === "Payé"}
        />
        <KpiCard
          title="Statut du Bail"
          value="Actif"
          subtitle={`Depuis le ${contrat?.dateDebut}`}
          icon={ShieldCheckIcon}
          trend="+ Conforme"
          trendUp={true}
        />
        <KpiCard
          title="Maintenance"
          value={`${ticketEnCours} en cours`}
          subtitle={ticketEnCours > 0 ? "Intervention planifiée" : "Aucun incident signalé"}
          icon={WrenchScrewdriverIcon}
          trend={ticketEnCours > 0 ? "- Action requise" : "+ Tout va bien"}
          trendUp={ticketEnCours === 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Card Derniers Paiements */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[12px] p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-bold text-[var(--text-primary)]">Historique récent</h3>
            </div>
            <DataTable
              data={quittances?.slice(0, 3) || []}
              columns={[
                { header: "Mois", accessorKey: "mois" },
                {
                  header: "Montant",
                  accessorKey: "montant",
                  cell: (row) => `${row.montant.toLocaleString("fr-FR")} FCFA`,
                },
                {
                  header: "Statut",
                  accessorKey: "statut",
                  cell: (row) => (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700">
                      {row.statut}
                    </span>
                  ),
                },
              ]}
              searchKey="mois"
            />
          </div>
        </div>

        <div className="space-y-6">
          {/* Info Bien */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[12px] p-5 shadow-2xs">
            <h3 className="text-[15px] font-bold text-[var(--text-primary)] mb-4">Mon Logement</h3>
            <div className="space-y-3 text-[13px]">
              <div className="flex flex-col">
                <span className="text-[var(--text-muted)]">Logement</span>
                <span className="font-semibold text-[var(--text-primary)]">{contrat?.bienNom}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[var(--text-muted)]">Adresse</span>
                <span className="font-medium text-[var(--text-secondary)]">{contrat?.adresse}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[var(--text-muted)]">Propriétaire / Agence</span>
                <span className="font-medium text-[var(--text-secondary)]">{contrat?.proprietaireNom}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

