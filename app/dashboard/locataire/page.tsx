"use client";

import React from "react";
import { useContratLocataire, useQuittances, useTicketsMaintenance } from "@/lib/hooks/useLocataire";
import { Wallet, CalendarClock, Wrench } from "lucide-react";
import { KpiCard } from "@/components/dashboard/shared/KpiCard";
import { DataTable } from "@/components/dashboard/shared/DataTable";
import Header from "@/components/dashboard/Header";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function LocataireOverviewPage() {
  const { data: contrat, isLoading: loadingContrat } = useContratLocataire();
  const { data: quittances, isLoading: loadingQuittances } = useQuittances();
  const { data: tickets, isLoading: loadingTickets } = useTicketsMaintenance();

  // Render Loading State
  if (loadingContrat || loadingQuittances || loadingTickets) {
    return (
      <div className="space-y-6 pb-12">
        <div className="h-20 bg-muted/60 animate-pulse rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-card border border-border rounded-xl shadow-xs">
        <div>
          <h1 className="text-[20px] font-extrabold text-card-foreground tracking-tight">Bonjour ! 👋</h1>
          <p className="text-[13px] text-muted-foreground mt-1">Bienvenue dans votre espace locataire Lokka.</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-[13px] font-bold transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          Payer mon loyer ({new Date().toLocaleString('fr-FR', { month: 'long' }).replace(/^\w/, c => c.toUpperCase())})
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <KpiCard
          title="Loyer actuel & Charges"
          value={((contrat?.loyerMensuel || 0) + (contrat?.chargesMensuelles || 0))}
          currency="FCFA"
          subtitle={`Prochain paiement : ${contrat?.prochainPaiement || "En attente"}`}
          icon={Wallet}
          iconColor="blue"
          trend={dernierPaiement?.statut === "Payé" ? "+ À jour" : "- En attente"}
          trendUp={dernierPaiement?.statut === "Payé"}
        />
        <KpiCard
          title="Statut du Bail"
          value="Actif"
          subtitle={`Depuis le ${contrat?.dateDebut || "Date d'entrée"}`}
          icon={CalendarClock}
          iconColor="emerald"
          trend="+ Conforme"
          trendUp={true}
        />
        <KpiCard
          title="Maintenance"
          value={`${ticketEnCours} en cours`}
          subtitle={ticketEnCours > 0 ? "Intervention planifiée" : "Aucun incident signalé"}
          icon={Wrench}
          iconColor="amber"
          trend={ticketEnCours > 0 ? "- Action requise" : "+ Tout va bien"}
          trendUp={ticketEnCours === 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Card Derniers Paiements */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-bold text-card-foreground">Historique récent</h3>
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
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                      row.statut === "Payé"
                        ? "bg-success/10 text-success border-success/20"
                        : "bg-warning/10 text-warning border-warning/20"
                    }`}>
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
          <div className="bg-card border border-border rounded-xl p-5 shadow-xs">
            <h3 className="text-[15px] font-bold text-card-foreground mb-4">Mon Logement</h3>
            <div className="space-y-3 text-[13px]">
              <div className="flex flex-col">
                <span className="text-muted-foreground text-[11.5px] uppercase tracking-wider font-semibold">Logement</span>
                <span className="font-semibold text-card-foreground mt-0.5">{contrat?.bienNom || "Appartement Standard"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-[11.5px] uppercase tracking-wider font-semibold">Adresse</span>
                <span className="font-medium text-muted-foreground mt-0.5">{contrat?.adresse || "Non renseignée"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-[11.5px] uppercase tracking-wider font-semibold">Propriétaire / Agence</span>
                <span className="font-medium text-muted-foreground mt-0.5">{contrat?.proprietaireNom || "Gestionnaire Lokka"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

