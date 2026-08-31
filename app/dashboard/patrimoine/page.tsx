"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useUserProfile } from "@/hooks/useUserProfile";
import { PlusIcon, BuildingOffice2Icon } from "@heroicons/react/24/outline";
import { EmptyState } from "@/components/dashboard/shared/EmptyState";

export default function PatrimoinePage() {
  const { profileType } = useUserProfile();

  const { data: biens = [], isLoading } = useQuery({
    queryKey: ["patrimoine", profileType],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 400));
      return [
        { id: 1, nom: "Villa Les Cocotiers", loyer: 450000, statut: "Occupé" },
        { id: 2, nom: "Résidence Le Manguier", loyer: 180000, statut: "Vacant" },
      ];
    },
  });

  if (isLoading) {
    return <div className="animate-pulse h-64 bg-[var(--bg-surface)] rounded-[12px]"></div>;
  }

  if (biens.length === 0) {
    return (
      <EmptyState
        icon={BuildingOffice2Icon}
        title="Aucun bien dans votre patrimoine"
        description="Commencez par ajouter votre premier bien immobilier pour le gérer."
        actionLabel="Ajouter un bien"
        onAction={() => {}}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[20px] font-extrabold text-[var(--text-primary)]">
          {profileType === "agence" ? "Portefeuille Biens" : "Mon Patrimoine"}
        </h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#1C1C1C] text-white rounded-[6px] text-[13px] font-bold">
          <PlusIcon className="w-4 h-4" /> Ajouter
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {biens.map((bien) => (
          <div key={bien.id} className="bg-white border border-[#E8E5E0] rounded-[8px] overflow-hidden shadow-xs cursor-pointer hover:border-[#1C1C1C] transition-colors">
            <div className="aspect-[4/3] bg-gray-200">
              <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80" alt={bien.nom} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-[14px] text-[#1C1C1C]">{bien.nom}</h3>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  bien.statut === "Occupé" ? "bg-[#F0FDF4] text-[#16A34A]" : "bg-[#FFF7ED] text-[#EA580C]"
                }`}>
                  {bien.statut}
                </span>
              </div>
              <p className="text-[13px] text-[#64635F]">{bien.loyer.toLocaleString()} FCFA / mois</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
