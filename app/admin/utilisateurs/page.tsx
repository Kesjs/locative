"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/dashboard/shared/DataTable";
import { NoSymbolIcon } from "@heroicons/react/24/outline";

export default function AdminUtilisateursPage() {
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);

  const { data: utilisateurs = [], isLoading } = useQuery({
    queryKey: ["admin-utilisateurs"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 400));
      return [
        { id: 1, nom: "Patrimoine Lokka", type: "Bailleur", plafond: "12/15", derniereActivite: "Aujourd'hui" },
        { id: 2, nom: "Immo Bénin SARL", type: "Agence", plafond: "85/100", derniereActivite: "Hier" },
      ];
    },
  });

  const columns = [
    { key: "nom", header: "Nom / Raison Sociale", renderCell: (row: any) => <span className="font-bold">{row.nom}</span> },
    { key: "type", header: "Type", renderCell: (row: any) => (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#F3F4F6] text-[#6B7280]">
        {row.type}
      </span>
    )},
    { key: "plafond", header: "Biens", renderCell: (row: any) => row.plafond },
    { key: "derniereActivite", header: "Dernière Activité", renderCell: (row: any) => row.derniereActivite },
    { key: "actions", header: "Actions", renderCell: (row: any) => (
      <button 
        onClick={() => setSuspendModalOpen(true)}
        className="flex items-center gap-1 text-[#DC2626] hover:bg-red-50 px-2 py-1 rounded-[4px] font-semibold text-[12px] transition-colors"
      >
        <NoSymbolIcon className="w-3.5 h-3.5" /> Suspendre
      </button>
    )},
  ];

  if (isLoading) {
    return <div className="animate-pulse h-64 bg-white rounded-[12px]"></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-[24px] font-extrabold text-[var(--text-primary)]">Gestion des Comptes</h1>
      
      <DataTable data={utilisateurs} columns={columns} keyExtractor={(r) => r.id} />

      {suspendModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[12px] p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-[18px] font-bold text-[#0F172A] mb-2">Suspendre ce compte ?</h3>
            <p className="text-[13px] text-[#64635F] mb-6">
              L'utilisateur ne pourra plus accéder à son espace. Cette action est réversible.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setSuspendModalOpen(false)} className="px-4 py-2 text-[13px] font-bold text-[#64635F] hover:bg-gray-100 rounded-[6px]">
                Annuler
              </button>
              <button onClick={() => setSuspendModalOpen(false)} className="px-4 py-2 bg-[#DC2626] text-white text-[13px] font-bold rounded-[6px] hover:bg-red-700">
                Confirmer la suspension
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
