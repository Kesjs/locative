"use client";

import React from "react";
import { GlobeIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export default function VitrinePage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-[20px] font-extrabold text-[var(--text-primary)]">Vitrine & Acquisition</h1>

      <div className="bg-white border border-[#E8E5E0] rounded-[12px] p-6 shadow-xs">
        <h2 className="text-[16px] font-bold text-[#1C1C1C] mb-4 flex items-center gap-2">
          <GlobeIcon className="w-5 h-5 text-[#64635F]" />
          Domaine & SEO
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-[12px] font-bold text-[#64635F] mb-1">Nom de domaine</label>
            <input type="text" defaultValue="agence-lokka.bj" className="w-full border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none" />
          </div>
          <div className="flex items-end pb-1">
            <span className="flex items-center gap-1 text-[12px] font-bold text-[#16A34A] bg-[#F0FDF4] px-2 py-1 rounded-full">
              <CheckCircleIcon className="w-4 h-4" /> DNS Actif
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#E8E5E0] rounded-[12px] p-6 shadow-xs">
        <h2 className="text-[16px] font-bold text-[#1C1C1C] mb-4">Personnalisation</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-[12px] font-bold text-[#64635F] mb-1">Logo de l'agence</label>
            <div className="border-2 border-dashed border-[#E8E5E0] rounded-[8px] p-8 text-center text-[12px] text-[#64635F] cursor-pointer hover:bg-gray-50 transition-colors">
              Glissez-déposez votre logo ici (PNG transparent recommandé)
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[#64635F] mb-2">Palette de couleurs</label>
            <div className="flex gap-4">
              <button className="w-8 h-8 rounded-full bg-[#1C1C1C] border-2 border-transparent ring-2 ring-offset-1 ring-[#1C1C1C]"></button>
              <button className="w-8 h-8 rounded-full bg-[#2563EB] border-2 border-transparent"></button>
              <button className="w-8 h-8 rounded-full bg-[#16A34A] border-2 border-transparent"></button>
              <button className="w-8 h-8 rounded-full bg-[#DC2626] border-2 border-transparent"></button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white border border-[#E8E5E0] rounded-[12px] p-6 shadow-xs">
        <h2 className="text-[16px] font-bold text-[#1C1C1C] mb-4">Blog & Actualités</h2>
        <button className="px-4 py-2 bg-[#1C1C1C] text-white rounded-[6px] text-[13px] font-bold">
          Créer un article
        </button>
      </div>
    </div>
  );
}
