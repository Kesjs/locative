"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/dashboard/shared/DataTable";
import { EmptyState } from "@/components/dashboard/shared/EmptyState";
import { WrenchIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useUserProfile } from "@/hooks/useUserProfile";

export default function MaintenancePage() {
  const { profileType } = useUserProfile();
  const [activeTab, setActiveTab] = useState<"tickets" | "artisans">("tickets");

  const { data: tickets = [], isLoading: isLoadingTickets } = useQuery({
    queryKey: ["maintenance-tickets"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 400));
      return [
        { id: 1, titre: "Fuite d'eau robinet cuisine", bien: "Villa Cocotiers Apt 2B", urgence: "Haute", statut: "En cours" },
        { id: 2, titre: "Prise électrique défectueuse", bien: "Résidence Le Manguier", urgence: "Basse", statut: "Nouveau" },
      ];
    },
  });

  const { data: artisans = [], isLoading: isLoadingArtisans } = useQuery({
    queryKey: ["maintenance-artisans"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 400));
      return [
        { id: 1, nom: "Plomberie Express", specialite: "Plombier", telephone: "+229 97 00 11 22", note: "4.8/5" },
      ];
    },
    enabled: profileType === "agence" && activeTab === "artisans",
  });

  const ticketColumns = [
    { key: "titre", header: "Titre", renderCell: (row: any) => <span className="font-bold">{row.titre}</span> },
    { key: "bien", header: "Bien", renderCell: (row: any) => row.bien },
    { key: "urgence", header: "Urgence", renderCell: (row: any) => (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
        row.urgence === "Haute" ? "bg-[#FEF2F2] text-[#DC2626]" : "bg-[#F3F4F6] text-[#6B7280]"
      }`}>
        {row.urgence}
      </span>
    )},
    { key: "statut", header: "Statut", renderCell: (row: any) => (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
        row.statut === "En cours" ? "bg-[#FFF7ED] text-[#EA580C]" : "bg-[#F3F4F6] text-[#6B7280]"
      }`}>
        {row.statut}
      </span>
    )},
    { key: "actions", header: "Actions", renderCell: () => (
      <button className="text-[#1C1C1C] font-semibold text-[12px] underline">Détails</button>
    )},
  ];

  const artisanColumns = [
    { key: "nom", header: "Artisan", renderCell: (row: any) => <span className="font-bold">{row.nom}</span> },
    { key: "specialite", header: "Spécialité", renderCell: (row: any) => row.specialite },
    { key: "telephone", header: "Téléphone", renderCell: (row: any) => row.telephone },
    { key: "note", header: "Note", renderCell: (row: any) => row.note },
  ];

  if (isLoadingTickets) {
    return <div className="animate-pulse h-64 bg-[var(--bg-surface)] rounded-[12px]"></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-[20px] font-extrabold text-[var(--text-primary)]">Maintenance & Interventions</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#1C1C1C] text-white rounded-[6px] text-[13px] font-bold">
          <PlusIcon className="w-4 h-4" /> {activeTab === "tickets" ? "Nouveau ticket" : "Ajouter un artisan"}
        </button>
      </div>

      {profileType === "agence" && (
        <div className="flex items-center gap-4 border-b border-[#E8E5E0]">
          <button 
            className={`pb-2 text-[14px] font-bold ${activeTab === "tickets" ? "text-[#1C1C1C] border-b-2 border-[#1C1C1C]" : "text-[#9C9A95]"}`}
            onClick={() => setActiveTab("tickets")}
          >
            Tickets
          </button>
          <button 
            className={`pb-2 text-[14px] font-bold ${activeTab === "artisans" ? "text-[#1C1C1C] border-b-2 border-[#1C1C1C]" : "text-[#9C9A95]"}`}
            onClick={() => setActiveTab("artisans")}
          >
            Carnet d'Artisans
          </button>
        </div>
      )}

      {activeTab === "tickets" ? (
        tickets.length === 0 ? (
          <EmptyState
            icon={WrenchIcon}
            title="Aucun ticket de maintenance"
            description="Les demandes d'intervention de vos locataires s'afficheront ici."
            actionLabel="Créer un ticket manuel"
            onAction={() => {}}
          />
        ) : (
          <DataTable data={tickets} columns={ticketColumns} keyExtractor={(r) => r.id} />
        )
      ) : (
        isLoadingArtisans ? (
          <div className="animate-pulse h-64 bg-[var(--bg-surface)] rounded-[12px]"></div>
        ) : (
          <DataTable data={artisans} columns={artisanColumns} keyExtractor={(r) => r.id} />
        )
      )}
    </div>
  );
}
