"use client";

import React from "react";
import { useUserProfile } from "@/hooks/useUserProfile";

export default function ParametresPage() {
  const { profileType } = useUserProfile();

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-[20px] font-extrabold text-[var(--text-primary)]">Paramètres</h1>

      <div className="bg-white border border-[#E8E5E0] rounded-[12px] p-6 shadow-xs">
        <h2 className="text-[16px] font-bold text-[#1C1C1C] mb-4">Profil Utilisateur</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-[12px] font-bold text-[#64635F] mb-1">Nom complet</label>
            <input type="text" defaultValue="Alexandre K." className="w-full border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none" />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[#64635F] mb-1">Email</label>
            <input type="email" defaultValue="alexandre@lokka.bj" className="w-full border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none" />
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#E8E5E0] rounded-[12px] p-6 shadow-xs">
        <h2 className="text-[16px] font-bold text-[#1C1C1C] mb-4">Abonnement & Facturation</h2>
        <div className="flex items-center justify-between p-4 bg-[#FAF9F6] border border-[#E8E5E0] rounded-[8px]">
          <div>
            <div className="font-bold text-[14px] text-[#1C1C1C]">
              {profileType === "agence" ? "Plan Agence" : "Plan Pro Bailleur"}
            </div>
            <div className="text-[12px] text-[#64635F]">
              {profileType === "agence" ? "25 000 FCFA / mois" : "5 000 FCFA / mois"}
            </div>
          </div>
          <button className="px-4 py-2 bg-[#1C1C1C] text-white rounded-[6px] text-[13px] font-bold">
            Gérer mon abonnement
          </button>
        </div>
      </div>
    </div>
  );
}
