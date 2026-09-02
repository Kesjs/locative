"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import {
  WrenchIcon,
  PlusIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Wrench, Phone, MessageSquare, AlertCircle, CheckCircle2, UserCheck, HardHat } from "lucide-react";
import { DataTable } from "@/components/dashboard/shared/DataTable";
import { EmptyState } from "@/components/dashboard/shared/EmptyState";
import { KpiCard } from "@/components/dashboard/shared/KpiCard";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useTickets, useArtisans, type Ticket, type Artisan } from "@/lib/hooks/useMaintenance";
import { AddTicketModal } from "./_components/AddTicketModal";
import { AddArtisanModal } from "./_components/AddArtisanModal";

export default function MaintenancePage() {
  const { role } = useUserProfile();
  const [activeTab, setActiveTab] = useState<"tickets" | "artisans">("tickets");

  const { data: tickets = [], isLoading: isLoadingTickets } = useTickets();
  const { data: artisans = [], isLoading: isLoadingArtisans } = useArtisans();

  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isArtisanModalOpen, setIsArtisanModalOpen] = useState(false);

  // Statistics
  const ticketsEnCours = tickets.filter((t) => t.statut === "En cours" || t.statut === "Nouveau").length;
  const ticketsResolus = tickets.filter((t) => t.statut === "Résolu").length;

  const handleCallArtisan = (artisan: Artisan) => {
    const cleanPhone = artisan.telephone.replace(/[^0-9+]/g, "");
    window.location.href = `tel:${cleanPhone}`;
  };

  const handleWhatsAppArtisan = (artisan: Artisan) => {
    const cleanPhone = artisan.telephone.replace(/[^0-9]/g, "");
    const msg = encodeURIComponent(
      `Bonjour ${artisan.nom},\nJe vous contacte au sujet d'une intervention de maintenance pour un logement géré sur Lokka à Cotonou.\nÊtes-vous disponible prochainement pour un diagnostic ?\nMerci !`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank");
    toast.success(`Discussion WhatsApp préparée avec ${artisan.nom}`);
  };

  const ticketColumns = [
    {
      key: "titre",
      header: "Panne / Intervention",
      renderCell: (row: Ticket) => (
        <div>
          <span className="font-bold text-card-foreground block">{row.titre}</span>
          <span className="text-[11.5px] text-muted-foreground">{row.bien}</span>
        </div>
      ),
    },
    {
      key: "urgence",
      header: "Urgence",
      renderCell: (row: Ticket) => {
        let badgeClass = "bg-muted text-muted-foreground border-border";
        if (row.urgence === "Haute") badgeClass = "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20";
        if (row.urgence === "Moyenne") badgeClass = "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20";
        return (
          <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase border ${badgeClass}`}>
            {row.urgence}
          </span>
        );
      },
    },
    {
      key: "statut",
      header: "Statut",
      renderCell: (row: Ticket) => {
        let badgeClass = "bg-muted text-muted-foreground border-border";
        if (row.statut === "En cours") badgeClass = "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20";
        if (row.statut === "Résolu") badgeClass = "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20";
        if (row.statut === "Nouveau") badgeClass = "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";

        return (
          <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase border ${badgeClass}`}>
            {row.statut}
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "Action",
      renderCell: (row: Ticket) => (
        <button
          type="button"
          onClick={() => toast.info(`Détails du ticket : ${row.titre}`)}
          className="text-emerald-700 dark:text-emerald-400 hover:underline font-bold text-[12px] cursor-pointer"
        >
          Consulter le dossier
        </button>
      ),
    },
  ];

  const artisanColumns = [
    {
      key: "nom",
      header: "Artisan & Spécialité",
      renderCell: (row: Artisan) => (
        <div>
          <span className="font-bold text-card-foreground block">{row.nom}</span>
          <span className="text-[11.5px] text-muted-foreground">{row.specialite}</span>
        </div>
      ),
    },
    {
      key: "telephone",
      header: "Coordonnées",
      renderCell: (row: Artisan) => (
        <span className="font-mono text-[12.5px] text-card-foreground">{row.telephone}</span>
      ),
    },
    {
      key: "zone",
      header: "Zone d'Intervention",
      renderCell: (row: Artisan) => (
        <span className="text-[12.5px] text-muted-foreground">{row.zone || "Cotonou / Calavi"}</span>
      ),
    },
    {
      key: "actions",
      header: "Contacter",
      renderCell: (row: Artisan) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleCallArtisan(row)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-muted hover:bg-muted/80 text-foreground font-bold text-[11.5px] transition cursor-pointer border border-border"
          >
            <Phone className="w-3.5 h-3.5 text-blue-600" />
            <span>Appel</span>
          </button>
          <button
            type="button"
            onClick={() => handleWhatsAppArtisan(row)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold text-[11.5px] transition cursor-pointer border border-emerald-500/20"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>
        </div>
      ),
    },
  ];

  const isLoading = isLoadingTickets || isLoadingArtisans;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-20 bg-muted/60 animate-pulse rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="h-28 bg-muted/60 animate-pulse rounded-xl" />
          <div className="h-28 bg-muted/60 animate-pulse rounded-xl" />
          <div className="h-28 bg-muted/60 animate-pulse rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header Éditorial */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 bg-card border border-border rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
              Gestion Technique &amp; Travaux
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">Interventions 24/7</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-foreground tracking-tight">
            Maintenance, Pannes &amp; Artisans
          </h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            Traitement des signalements locataires (SBEE, SONEB, climatisations) et coordination avec les artisans.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsArtisanModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-card hover:bg-muted text-card-foreground border border-border rounded-xl text-[13px] font-bold transition-all shadow-2xs cursor-pointer"
          >
            <HardHat className="w-4 h-4 text-amber-600" />
            Ajouter un artisan
          </button>
          <button
            type="button"
            onClick={() => setIsTicketModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[13px] font-bold transition-all shadow-xs cursor-pointer"
          >
            <Wrench className="w-4 h-4" />
            Déclarer un incident
          </button>
        </div>
      </div>

      {/* KPIs Maintenance */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          title="Tickets en Cours"
          value={ticketsEnCours}
          subtitle="Pannes et signalements à traiter"
          icon={AlertCircle}
          iconColor="rose"
        />
        <KpiCard
          title="Interventions Clôturées"
          value={ticketsResolus}
          subtitle="Travaux et réparations terminées"
          icon={CheckCircle2}
          iconColor="emerald"
        />
        <KpiCard
          title="Artisans Référencés"
          value={artisans.length}
          subtitle="Plombiers, électriciens SBEE, peintres"
          icon={HardHat}
          iconColor="amber"
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border overflow-x-auto pb-px">
        <button
          type="button"
          onClick={() => setActiveTab("tickets")}
          className={`flex items-center gap-2 px-4 py-2.5 text-[13px] font-bold border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeTab === "tickets"
              ? "text-primary border-primary bg-card"
              : "text-muted-foreground border-transparent hover:text-foreground"
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Tickets &amp; Pannes ({tickets.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("artisans")}
          className={`flex items-center gap-2 px-4 py-2.5 text-[13px] font-bold border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeTab === "artisans"
              ? "text-primary border-primary bg-card"
              : "text-muted-foreground border-transparent hover:text-foreground"
          }`}
        >
          <HardHat className="w-4 h-4" />
          <span>Annuaire Artisans ({artisans.length})</span>
        </button>
      </div>

      {/* Contenu de l'onglet actif */}
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-xs">
        {activeTab === "tickets" ? (
          tickets.length === 0 ? (
            <EmptyState
              icon={WrenchIcon}
              title="Aucun incident technique en cours"
              description="Vos logements sont actuellement en parfait état de fonctionnement. Les signalements de vos locataires apparaîtront ici."
              actionLabel="Créer un ticket"
              onAction={() => setIsTicketModalOpen(true)}
            />
          ) : (
            <DataTable data={tickets} columns={ticketColumns} keyExtractor={(r) => r.id} />
          )
        ) : artisans.length === 0 ? (
          <EmptyState
            icon={UserGroupIcon}
            title="Aucun artisan enregistré"
            description="Constituez votre répertoire de prestataires locaux (plombiers, électriciens SBEE, frigoristes) pour intervenir rapidement."
            actionLabel="Ajouter un artisan"
            onAction={() => setIsArtisanModalOpen(true)}
          />
        ) : (
          <DataTable data={artisans} columns={artisanColumns} keyExtractor={(r) => r.id} />
        )}
      </div>

      {/* Modales connectées */}
      <AddTicketModal isOpen={isTicketModalOpen} onClose={() => setIsTicketModalOpen(false)} />
      <AddArtisanModal isOpen={isArtisanModalOpen} onClose={() => setIsArtisanModalOpen(false)} />
    </div>
  );
}
