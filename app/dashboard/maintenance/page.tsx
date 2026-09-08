"use client";

import React, { useMemo, useState } from "react";
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
  XMarkIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { Wrench, Phone, MessageSquare, AlertCircle, CheckCircle2, UserCheck, HardHat, Building2 } from "lucide-react";
import { DataTable } from "@/components/dashboard/shared/DataTable";
import { EmptyState } from "@/components/dashboard/shared/EmptyState";
import { KpiCard } from "@/components/dashboard/shared/KpiCard";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useTickets, useArtisans, useUpdateTicketStatut, type Ticket, type Artisan } from "@/lib/hooks/useMaintenance";
import { usePatrimoineFilter, useActiveGroupBienIds, useActiveGroupBienNames } from "@/lib/patrimoineFilterContext";
import { AddTicketModal } from "./_components/AddTicketModal";
import { AddArtisanModal } from "./_components/AddArtisanModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export default function MaintenancePage() {
  const { role } = useUserProfile();
  const [activeTab, setActiveTab] = useState<"tickets" | "artisans">("tickets");

  const { data: allTickets = [], isLoading: isLoadingTickets } = useTickets();
  const { data: artisans = [], isLoading: isLoadingArtisans } = useArtisans();
  const { mutateAsync: updateTicketStatut, isPending: isUpdatingStatut } = useUpdateTicketStatut();
  const { activeGroup, setActiveGroup } = usePatrimoineFilter();
  const activeGroupBienIds = useActiveGroupBienIds();
  const activeGroupBienNames = useActiveGroupBienNames();

  // Filtre résidence : match par bien_id quand disponible, sinon repli sur le nom du bien
  // (tickets historiques créés avant que bien_id soit renseigné côté client).
  const tickets = useMemo(() => {
    if (!activeGroupBienIds || !activeGroupBienNames) return allTickets;
    return allTickets.filter((t) =>
      t.bien_id ? activeGroupBienIds.includes(t.bien_id) : activeGroupBienNames.includes(t.bien)
    );
  }, [allTickets, activeGroupBienIds, activeGroupBienNames]);

  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isArtisanModalOpen, setIsArtisanModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Statistics
  const ticketsEnCours = tickets.filter((t) => t.statut === "En cours" || t.statut === "Nouveau").length;
  const ticketsResolus = tickets.filter((t) => t.statut === "Résolu").length;

  // Recherche : adaptée à l'onglet actif (tickets ou artisans)
  const filteredTickets = useMemo(() => {
    if (!search.trim()) return tickets;
    const q = search.trim().toLowerCase();
    return tickets.filter(
      (t) =>
        t.titre?.toLowerCase().includes(q) ||
        t.bien?.toLowerCase().includes(q) ||
        t.statut?.toLowerCase().includes(q) ||
        t.urgence?.toLowerCase().includes(q)
    );
  }, [tickets, search]);

  const filteredArtisans = useMemo(() => {
    if (!search.trim()) return artisans;
    const q = search.trim().toLowerCase();
    return artisans.filter(
      (a) =>
        a.nom?.toLowerCase().includes(q) ||
        a.specialite?.toLowerCase().includes(q) ||
        a.zone?.toLowerCase().includes(q) ||
        a.telephone?.toLowerCase().includes(q)
    );
  }, [artisans, search]);

  const handleCallArtisan = (artisan: Artisan) => {
    const cleanPhone = artisan.telephone.replace(/[^0-9+]/g, "");
    window.location.href = `tel:${cleanPhone}`;
  };

  const handleChangeStatut = async (ticket: Ticket, statut: Ticket["statut"]) => {
    if (ticket.statut === statut) return;
    try {
      await updateTicketStatut({ id: ticket.id, statut });
      toast.success(`Ticket « ${ticket.titre} » marqué « ${statut} »`);
    } catch (err: any) {
      toast.error(err?.message || "Impossible de mettre à jour le statut du ticket.");
    }
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                disabled={isUpdatingStatut}
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase border cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${badgeClass}`}
              >
                {row.statut}
                <ChevronDown className="w-3 h-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[9rem]">
              {(["Nouveau", "En cours", "Résolu"] as Ticket["statut"][]).map((statut) => (
                <DropdownMenuItem
                  key={statut}
                  onClick={() => handleChangeStatut(row, statut)}
                  className={`text-[12.5px] font-medium cursor-pointer ${
                    row.statut === statut ? "text-primary font-bold" : "text-foreground"
                  }`}
                >
                  {statut}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
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

      {activeGroup && (
        <div className="flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl border border-[var(--primary)]/25 bg-[var(--primary-subtle)] text-[12.5px] font-semibold text-[var(--primary)]">
          <span className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4" />
            Filtré sur le groupe « {activeGroup} »
          </span>
          <button
            type="button"
            onClick={() => setActiveGroup(null)}
            className="flex items-center gap-1 text-[11.5px] font-bold px-2 py-1 rounded-lg hover:bg-white/60 cursor-pointer"
          >
            <XMarkIcon className="w-3.5 h-3.5" />
            Retirer le filtre
          </button>
        </div>
      )}

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
          onClick={() => {
            setActiveTab("tickets");
            setSearch("");
          }}
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
          onClick={() => {
            setActiveTab("artisans");
            setSearch("");
          }}
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
        {((activeTab === "tickets" && tickets.length > 0) || (activeTab === "artisans" && artisans.length > 0)) && (
          <div className="relative max-w-md mb-4">
            <MagnifyingGlassIcon className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                activeTab === "tickets"
                  ? "Rechercher un incident, un logement, un statut..."
                  : "Rechercher un artisan, une spécialité, une zone..."
              }
              className="w-full pl-9 pr-3 py-2.5 border border-border rounded-lg text-[13px] bg-card text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        )}

        {activeTab === "tickets" ? (
          tickets.length === 0 ? (
            <EmptyState
              icon={WrenchIcon}
              title="Aucun incident technique en cours"
              description="Vos logements sont actuellement en parfait état de fonctionnement. Les signalements de vos locataires apparaîtront ici."
              actionLabel="Créer un ticket"
              onAction={() => setIsTicketModalOpen(true)}
            />
          ) : filteredTickets.length === 0 ? (
            <div className="text-center py-12 text-[13px] text-muted-foreground border border-dashed border-border rounded-xl">
              Aucun ticket ne correspond à cette recherche.
            </div>
          ) : (
            <DataTable data={filteredTickets} columns={ticketColumns} keyExtractor={(r) => r.id} />
          )
        ) : artisans.length === 0 ? (
          <EmptyState
            icon={UserGroupIcon}
            title="Aucun artisan enregistré"
            description="Constituez votre répertoire de prestataires locaux (plombiers, électriciens SBEE, frigoristes) pour intervenir rapidement."
            actionLabel="Ajouter un artisan"
            onAction={() => setIsArtisanModalOpen(true)}
          />
        ) : filteredArtisans.length === 0 ? (
          <div className="text-center py-12 text-[13px] text-muted-foreground border border-dashed border-border rounded-xl">
            Aucun artisan ne correspond à cette recherche.
          </div>
        ) : (
          <DataTable data={filteredArtisans} columns={artisanColumns} keyExtractor={(r) => r.id} />
        )}
      </div>

      {/* Modales connectées */}
      <AddTicketModal isOpen={isTicketModalOpen} onClose={() => setIsTicketModalOpen(false)} />
      <AddArtisanModal isOpen={isArtisanModalOpen} onClose={() => setIsArtisanModalOpen(false)} />
    </div>
  );
}
