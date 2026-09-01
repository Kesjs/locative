"use client";

import React from "react";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";

export default function ComptePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-[20px] font-extrabold text-[var(--text-primary)]">Mon Compte</h1>

      <div className="bg-white border border-[#E8E5E0] rounded-[12px] p-6 shadow-xs">
        <h2 className="text-[16px] font-bold text-[#0F172A] mb-4">Informations Personnelles</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-[12px] font-bold text-[#64635F] mb-1">Nom complet</label>
            <input type="text" defaultValue="Koudjo Dossou" className="w-full border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none" />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[#64635F] mb-1">Téléphone</label>
            <input type="tel" defaultValue="+229 97 00 11 22" className="w-full border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none" />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[#64635F] mb-1">Email</label>
            <input type="email" defaultValue="koudjo@example.com" className="w-full border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none" />
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#E8E5E0] rounded-[12px] p-6 shadow-xs">
        <h2 className="text-[16px] font-bold text-[#0F172A] mb-4">Pièce d'identité (CIP / Passeport)</h2>
        <label className="w-full h-32 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#E8E5E0] rounded-[8px] bg-[#FAF9F6] text-[#64635F] cursor-pointer hover:bg-gray-50 transition-colors">
          <ArrowUpTrayIcon className="w-6 h-6 text-[#0F172A]" />
          <span className="text-[12px] font-bold text-[#0F172A]">Téléverser un document</span>
          <span className="text-[10px]">Format JPEG ou PDF, max 5Mo</span>
          <input type="file" accept="image/*,.pdf" className="hidden" />
        </label>
      </div>

      <div className="bg-white border border-[#E8E5E0] rounded-[12px] p-6 shadow-xs">
        <h2 className="text-[16px] font-bold text-[#0F172A] mb-4">Contact d'urgence</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-[12px] font-bold text-[#64635F] mb-1">Nom du contact</label>
            <input type="text" placeholder="Ex: Maman" className="w-full border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none" />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[#64635F] mb-1">Téléphone du contact</label>
            <input type="tel" placeholder="+229 90 00 00 00" className="w-full border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none" />
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#E8E5E0] rounded-[12px] p-6 shadow-xs">
        <h2 className="text-[16px] font-bold text-[#0F172A] mb-4">Sécurité</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-[12px] font-bold text-[#64635F] mb-1">Nouveau mot de passe</label>
            <input type="password" placeholder="••••••••" className="w-full border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none" />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[#64635F] mb-1">Confirmer mot de passe</label>
            <input type="password" placeholder="••••••••" className="w-full border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none" />
          </div>
          <button className="min-h-[44px] px-6 py-2 bg-[#0F172A] text-white rounded-[6px] text-[13px] font-bold mt-2">
            Mettre à jour
          </button>
        </div>
      </div>
    </div>
  );
}
