"use client";

import React, { useState } from "react";
import { DataTable } from "@/components/dashboard/shared/DataTable";
import { EmptyState } from "@/components/dashboard/shared/EmptyState";
import { PlusIcon, UsersIcon } from "@heroicons/react/24/outline";
import { useEquipe } from "@/lib/hooks/useEquipe";
import { AddMemberModal } from "./_components/AddMemberModal";

export default function EquipePage() {
  const { data: equipe = [], isLoading } = useEquipe();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { key: "nom", header: "Collaborateur", renderCell: (row: any) => <span className="font-bold">{row.nom}</span> },
    { key: "role", header: "Rôle", renderCell: (row: any) => row.role },
    { key: "statut", header: "Statut", renderCell: (row: any) => (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
        row.statut === "Actif" ? "bg-[#E6F5EF] text-[#087F5B]" : "bg-[#F3F4F6] text-[#6B7280]"
      }`}>
        {row.statut}
      </span>
    )},
    { key: "actions", header: "Actions", renderCell: () => (
      <button className="text-[#1C1C1C] font-semibold text-[12px] underline hover:text-[#087F5B]">Gérer</button>
    )},
  ];

  if (isLoading) {
    return <div className="animate-pulse h-64 bg-[var(--bg-surface)] rounded-[12px]"></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-[20px] font-extrabold text-[var(--text-primary)]">Équipe & Accès</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1C1C1C] text-white rounded-[6px] text-[13px] font-bold hover:bg-black transition-colors"
        >
          <PlusIcon className="w-4 h-4" /> Inviter un collaborateur
        </button>
      </div>

      {equipe.length === 0 ? (
        <EmptyState
          icon={UsersIcon}
          title="Aucun collaborateur"
          description="Vous êtes le seul membre de votre agence. Invitez des gestionnaires ou comptables."
          actionLabel="Inviter un membre"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <DataTable data={equipe} columns={columns} keyExtractor={(r) => r.id} />
      )}

      <AddMemberModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
