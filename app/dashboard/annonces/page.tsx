"use client";

import React, { useState } from "react";
import { DataTable } from "@/components/dashboard/shared/DataTable";
import { MegaphoneIcon, PlusIcon, ShareIcon } from "@heroicons/react/24/outline";
import { useAnnonces } from "@/lib/hooks/useAnnonces";
import { AddAnnonceModal } from "./_components/AddAnnonceModal";

export default function AnnoncesPage() {
  const { data: annonces = [], isLoading } = useAnnonces();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { key: "bien", header: "Bien", renderCell: (row: any) => <span className="font-bold">{row.bien}</span> },
    { key: "vues", header: "Vues", renderCell: (row: any) => row.vues },
    { key: "demandes", header: "Demandes Visite", renderCell: (row: any) => row.demandes },
    { key: "statut", header: "Statut", renderCell: (row: any) => {
      let colorClass = "bg-[#F0FDF4] text-[#16A34A]"; // Active
      if (row.statut === "Suspendue") colorClass = "bg-[#F3F4F6] text-[#6B7280]";
      if (row.statut === "Brouillon") colorClass = "bg-[#FFF7ED] text-[#EA580C]";
      return (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${colorClass}`}>
          {row.statut}
        </span>
      );
    }},
    { key: "actions", header: "Actions", renderCell: () => (
      <button className="text-[#1C1C1C] font-semibold text-[12px] underline hover:text-[#C5A880]">Gérer</button>
    )},
  ];

  if (isLoading) {
    return <div className="animate-pulse h-64 bg-[var(--bg-surface)] rounded-[12px]"></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-[20px] font-extrabold text-[var(--text-primary)]">Annonces & Visites</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1C1C1C] text-white rounded-[6px] text-[13px] font-bold hover:bg-black transition-colors"
        >
          <PlusIcon className="w-4 h-4" /> Créer une annonce
        </button>
      </div>

      {/* Bloc Lien Public */}
      <div className="bg-[#FAF9F6] border border-[#E8E5E0] rounded-[8px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-[14px] font-bold text-[#1C1C1C]">Lien public de vos annonces</h3>
          <p className="text-[12px] text-[#64635F]">Partagez ce lien sur WhatsApp ou Facebook pour recevoir des demandes.</p>
        </div>
        <div className="flex items-center gap-2">
          <code className="px-3 py-2 bg-white border border-[#E8E5E0] rounded-[6px] text-[12px] text-[#1C1C1C] font-mono select-all">
            lokka.bj/p/patrimoine-lokka
          </code>
          <button className="p-2 bg-white border border-[#E8E5E0] rounded-[6px] hover:bg-gray-50 transition-colors">
            <ShareIcon className="w-4 h-4 text-[#1C1C1C]" />
          </button>
        </div>
      </div>

      {annonces.length === 0 ? (
        <div className="text-center py-10 border border-[#E8E5E0] rounded-[12px] bg-white">
          <MegaphoneIcon className="w-10 h-10 mx-auto text-[#64635F] mb-3" />
          <h3 className="text-[14px] font-bold text-[#1C1C1C] mb-1">Aucune annonce</h3>
          <p className="text-[13px] text-[#64635F] mb-4">Créez votre première annonce pour trouver des locataires.</p>
          <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-[#1C1C1C] text-white rounded-[6px] text-[13px] font-bold">Créer une annonce</button>
        </div>
      ) : (
        <DataTable data={annonces} columns={columns} keyExtractor={(r) => r.id} />
      )}

      <AddAnnonceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
