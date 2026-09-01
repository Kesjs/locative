"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

export default function MonLoyerPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["locataire-loyer"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 400));
      return {
        solde: 150000,
        dateLimite: "05/10/2026",
        statut: "À payer", // "À payer" | "À jour"
      };
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="w-32 h-10 bg-gray-200 animate-pulse rounded-[8px]" />
        <div className="w-48 h-4 bg-gray-200 animate-pulse rounded-[4px]" />
      </div>
    );
  }

  if (!data) return null;

  const isUpToDate = data.statut === "À jour";

  return (
    <div className="flex flex-col min-h-[calc(100vh-100px)] pt-12">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <h1 className="text-[14px] font-bold text-[#64635F] uppercase tracking-wider mb-2">
          Loyer de Septembre
        </h1>
        <div className="text-[48px] sm:text-[56px] font-extrabold text-[#0F172A] tracking-tight leading-none mb-4">
          {isUpToDate ? "À jour" : `${data.solde.toLocaleString()} FCFA`}
        </div>
        
        {isUpToDate ? (
          <div className="flex items-center gap-2 text-[#16A34A] bg-[#F0FDF4] px-4 py-2 rounded-full font-bold text-[14px]">
            <CheckCircleIcon className="w-5 h-5" />
            Aucun paiement en attente
          </div>
        ) : (
          <div className="text-[14px] font-medium text-[#C92A2A]">
            À régler avant le <span className="font-bold">{data.dateLimite}</span>
          </div>
        )}
      </div>

      {!isUpToDate && (
        <div className="sticky bottom-20 md:static mt-12 w-full max-w-sm mx-auto p-4 bg-white md:bg-transparent rounded-t-[20px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] md:shadow-none">
          <button className="w-full h-14 bg-[#0F172A] text-white rounded-[12px] text-[16px] font-extrabold hover:bg-black transition-colors shadow-lg flex items-center justify-center">
            Payer via Mobile Money
          </button>
          <div className="text-center text-[11px] text-[#9C9A95] mt-3 font-medium">
            Paiement sécurisé · MTN, Moov, Celtiis
          </div>
        </div>
      )}
    </div>
  );
}
