"use client";

import React, { useState } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

export default function ParametresPage() {
  const { role } = useUserProfile();
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaved(false);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-[20px] font-extrabold text-[var(--text-primary)]">Paramètres</h1>

      <div className="bg-white border border-[#E8E5E0] rounded-[12px] p-6 shadow-xs">
        <h2 className="text-[16px] font-bold text-[#1C1C1C] mb-4">Profil Utilisateur</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-[12px] font-bold text-[#64635F] mb-1">Nom complet</label>
            <input required type="text" defaultValue="Alexandre K." className="w-full border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none focus:border-[#1C1C1C]" />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[#64635F] mb-1">Email</label>
            <input required type="email" defaultValue="alexandre@lokka.bj" className="w-full border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none focus:border-[#1C1C1C]" />
          </div>
          <div className="flex items-center gap-4 mt-6">
            <button 
              type="submit" 
              disabled={isSaving}
              className="px-6 py-2 bg-[#1C1C1C] text-white text-[13px] font-bold rounded-[6px] disabled:opacity-50 hover:bg-black transition-colors"
            >
              {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
            </button>
            {saved && (
              <span className="flex items-center gap-1 text-[13px] font-bold text-[#16A34A]">
                <CheckCircleIcon className="w-4 h-4" /> Sauvegardé
              </span>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white border border-[#E8E5E0] rounded-[12px] p-6 shadow-xs">
        <h2 className="text-[16px] font-bold text-[#1C1C1C] mb-4">Abonnement & Facturation</h2>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#FAF9F6] border border-[#E8E5E0] rounded-[8px]">
          <div>
            <div className="font-bold text-[14px] text-[#1C1C1C]">
              {role === "Agence" ? "Plan Agence" : "Plan Pro Bailleur"}
            </div>
            <div className="text-[12px] text-[#64635F]">
              {role === "Agence" ? "25 000 FCFA / mois" : "5 000 FCFA / mois"}
            </div>
          </div>
          <button 
            disabled 
            className="px-4 py-2 bg-[#E8E5E0] text-[#9C9A95] rounded-[6px] text-[13px] font-bold cursor-not-allowed"
            title="Bientôt disponible"
          >
            Gérer mon abonnement
          </button>
        </div>
      </div>
    </div>
  );
}
