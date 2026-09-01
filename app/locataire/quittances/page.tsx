"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";

export default function QuittancesPage() {
  const { data: quittances = [], isLoading } = useQuery({
    queryKey: ["locataire-quittances"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 400));
      return [
        { id: 1, mois: "Août 2026", montant: 150000 },
        { id: 2, mois: "Juillet 2026", montant: 150000 },
        { id: 3, mois: "Juin 2026", montant: 150000 },
      ];
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4 pt-4">
        <div className="h-16 bg-gray-200 animate-pulse rounded-[8px]" />
        <div className="h-16 bg-gray-200 animate-pulse rounded-[8px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-[20px] font-extrabold text-[var(--text-primary)]">Mes Quittances</h1>

      <div className="space-y-3">
        {quittances.map((q) => (
          <div key={q.id} className="bg-white border border-[#E8E5E0] rounded-[12px] p-4 flex items-center justify-between shadow-xs">
            <div>
              <div className="text-[14px] font-bold text-[#0F172A]">{q.mois}</div>
              <div className="text-[12px] font-medium text-[#64635F] mt-0.5">{q.montant.toLocaleString()} FCFA</div>
            </div>
            <button className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-[#FAF9F6] border border-[#E8E5E0] rounded-[8px] hover:bg-gray-100 transition-colors">
              <DocumentArrowDownIcon className="w-5 h-5 text-[#0F172A]" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
