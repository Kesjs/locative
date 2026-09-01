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
      `Bonjour ${artisan.nom},\nJe vous contacte au sujet d'une intervention de maintenance pour un logement Lokka à Cotonou.\nÊtes-vous disponible prochainement pour un devis/diagnostic ?\nMerci !`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank");
    toast.success(`Discussion WhatsApp ouverte avec ${artisan.nom}`);
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
        let badgeClass = "bg-muted text-muted-foreground";
        if (row.urgence === "Haute") badgeClass = "bg-destructive/10 text-destructive border-destructive/20";
        if (row.urgence === "Moyenne") badgeClass = "bg-warning/10 text-warning border-warning/20";
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
        let badgeClass = "bg-muted text-muted-foreground";
        if (row.statut === "En cours") badgeClass = "bg-warning/10 text-warning border-warning/20";
        if (row.statut === "Résolu") badgeClass = "bg-success/10 text-success border-success/20";
        if (row.statut === "Nouveau") badgeClass = "bg-primary/10 text-primary border-primary/20";

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
          className="text-primary font-bold text-[12px] underline hover:text-primary/80"
        >
          Consulter
        </button>
      ),
    },
  ];

  const artisanColumns = [
    {
      key: "nom",
      header: "Artisan / Prestataire",
      renderCell: (row: Artisan) => (
        <div>
          <span className="font-bold text-card-foreground block">{row.nom}</span>
          <span className="text-[11.5px] text-muted-foreground">{row.specialite}</span>
        </div>
      ),
    },
    {
      key: "telephone",
      header: "Contact",
      renderCell: (row: Artisan) => (
        <span className="font-mono text-[12.5px] text-card-foreground">{row.telephone}</span>
      ),
    },
    {
      key: "note",
      header: "Évaluation",
      renderCell: (row: Artisan) => (
        <span className="inline-flex items-center gap-1 text-[12px] font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded">
          ⭐ {row.note}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Contacter",
      renderCell: (row: Artisan) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleWhatsAppArtisan(row)}
            className="p-1.5 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 transition"
            title="Contacter sur WhatsApp"
          >
            <ChatBubbleLeftRightIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleCallArtisan(row)}
            className="p-1.5 rounded-md bg-primary/10 hover:bg-primary/20 text-primary transition"
            title="Appeler"
          >
            <PhoneIcon className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-extrabold text-foreground">Maintenance &amp; Artisans</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            Suivez les signalements de pannes de vos locataires et mobilisez vos artisans de confiance.
          </p>
        </div>
        <button
          type="button"
          onClick={() => (activeTab === "tickets" ? setIsTicketModalOpen(true) : setIsArtisanModalOpen(true))}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-[13px] font-bold hover:bg-primary/90 transition shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <PlusIcon className="w-4 h-4" /> {activeTab === "tickets" ? "Nouveau ticket" : "Ajouter un artisan"}
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          title="Tickets en cours"
          value={ticketsEnCours}
          subtitle="Interventions actives à traiter"
          icon={ClockIcon}
          iconColor="amber"
        />
        <KpiCard
          title="Incidents résolus"
          value={ticketsResolus}
          subtitle="Clôturés avec succès"
          icon={CheckCircleIcon}
          iconColor="emerald"
        />
        <KpiCard
          title="Artisans référencés"
          value={artisans.length}
          subtitle="Plombiers, électriciens, clim"
          icon={UserGroupIcon}
          iconColor="blue"
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border">
        <button
          type="button"
          onClick={() => setActiveTab("tickets")}
          className={`pb-3 px-3 text-[13.5px] font-bold border-b-2 transition cursor-pointer ${
            activeTab === "tickets"
              ? "text-primary border-primary"
              : "text-muted-foreground border-transparent hover:text-foreground"
          }`}
        >
          Tickets &amp; Interventions ({tickets.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("artisans")}
          className={`pb-3 px-3 text-[13.5px] font-bold border-b-2 transition cursor-pointer ${
            activeTab === "artisans"
              ? "text-primary border-primary"
              : "text-muted-foreground border-transparent hover:text-foreground"
          }`}
        >
          Carnet d&apos;Artisans Bénin ({artisans.length})
        </button>
      </div>

      {/* Main Table Content */}
      <div className="bg-card border border-border rounded-xl shadow-xs overflow-hidden">
        {activeTab === "tickets" ? (
          isLoadingTickets ? (
            <div className="animate-pulse h-64 bg-card" />
          ) : tickets.length === 0 ? (
            <EmptyState
              icon={WrenchIcon}
              title="Aucun ticket de maintenance"
              description="Les demandes d'intervention de vos locataires s'afficheront ici."
              actionLabel="Créer un ticket manuel"
              onAction={() => setIsTicketModalOpen(true)}
            />
          ) : (
            <DataTable data={tickets} columns={ticketColumns} keyExtractor={(r) => r.id} />
          )
        ) : isLoadingArtisans ? (
          <div className="animate-pulse h-64 bg-card" />
        ) : artisans.length === 0 ? (
          <EmptyState
            icon={WrenchIcon}
            title="Aucun artisan enregistré"
            description="Ajoutez vos plombiers, électriciens SBEE et frigoristes pour les contacter en 1 clic."
            actionLabel="Ajouter un artisan"
            onAction={() => setIsArtisanModalOpen(true)}
          />
        ) : (
          <DataTable data={artisans} columns={artisanColumns} keyExtractor={(r) => r.id} />
        )}
      </div>

      {/* Modals */}
      <AddTicketModal isOpen={isTicketModalOpen} onClose={() => setIsTicketModalOpen(false)} />
      <AddArtisanModal isOpen={isArtisanModalOpen} onClose={() => setIsArtisanModalOpen(false)} />
    </div>
  );
}
