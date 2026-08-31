"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/dashboard/shared/DataTable";

export default function AdminDomainesPage() {
  const { data: domaines = [], isLoading } = useQuery({
    queryKey: ["admin-domaines"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 400));
      return [
        { id: 1, agence: "Immo Bénin SARL", domaine: "immo-benin.bj", dns: "Actif", ssl: "Valide (320j)" },
        { id: 2, agence: "Agence Le Phare", domaine: "lephare-immo.com", dns: "Actif", ssl: "Expire bientôt (12j)" },
      ];
    },
  });

  const columns = [
    { key: "agence", header: "Agence", renderCell: (row: any) => <span className="font-bold">{row.agence}</span> },
    { key: "domaine", header: "Domaine", renderCell: (row: any) => row.domaine },
    { key: "dns", header: "DNS", renderCell: (row: any) => (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#F0FDF4] text-[#16A34A]">
        {row.dns}
      </span>
    )},
    { key: "ssl", header: "SSL", renderCell: (row: any) => {
      const isExpiring = row.ssl.includes("bientôt");
      return (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
          isExpiring ? "bg-[#FEF2F2] text-[#DC2626]" : "bg-[#F0FDF4] text-[#16A34A]"
        }`}>
          {row.ssl}
        </span>
      );
    }},
    { key: "actions", header: "Actions", renderCell: () => (
      <button className="text-[#1C1C1C] font-semibold text-[12px] underline">Gérer</button>
    )},
  ];

  if (isLoading) {
    return <div className="animate-pulse h-64 bg-white rounded-[12px]"></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-[24px] font-extrabold text-[var(--text-primary)]">Infrastructure & Domaines</h1>
      <DataTable data={domaines} columns={columns} keyExtractor={(r) => r.id} />
    </div>
  );
}
