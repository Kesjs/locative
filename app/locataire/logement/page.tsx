"use client";

import React from "react";
import { PhoneIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";

export default function LogementPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-[20px] font-extrabold text-[var(--text-primary)]">Mon Logement</h1>

      <div className="bg-white border border-[#E8E5E0] rounded-[12px] overflow-hidden shadow-xs">
        <div className="aspect-video bg-gray-200">
          <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80" alt="Logement" className="w-full h-full object-cover" />
        </div>
        <div className="p-6">
          <h2 className="text-[18px] font-bold text-[#1C1C1C] mb-1">Villa Les Cocotiers, Apt 2B</h2>
          <p className="text-[13px] text-[#64635F] mb-6">Quartier Haie Vive, Cotonou</p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-[#FAF9F6] p-3 rounded-[8px] border border-[#E8E5E0]">
              <span className="block text-[11px] font-bold text-[#9C9A95] uppercase">Loyer</span>
              <span className="text-[14px] font-bold text-[#1C1C1C]">150 000 FCFA</span>
            </div>
            <div className="bg-[#FAF9F6] p-3 rounded-[8px] border border-[#E8E5E0]">
              <span className="block text-[11px] font-bold text-[#9C9A95] uppercase">Échéance</span>
              <span className="text-[14px] font-bold text-[#1C1C1C]">Le 05 du mois</span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-[14px] font-bold text-[#1C1C1C]">Documents</h3>
            <button className="w-full flex items-center justify-between p-3 border border-[#E8E5E0] rounded-[8px] hover:bg-gray-50 transition-colors">
              <span className="text-[13px] font-medium text-[#1C1C1C]">Contrat de bail</span>
              <DocumentArrowDownIcon className="w-5 h-5 text-[#64635F]" />
            </button>
            <button className="w-full flex items-center justify-between p-3 border border-[#E8E5E0] rounded-[8px] hover:bg-gray-50 transition-colors">
              <span className="text-[13px] font-medium text-[#1C1C1C]">État des lieux d'entrée</span>
              <DocumentArrowDownIcon className="w-5 h-5 text-[#64635F]" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#E8E5E0] rounded-[12px] p-6 shadow-xs">
        <h3 className="text-[14px] font-bold text-[#1C1C1C] mb-4">Contacts d'urgence</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#FAF9F6] rounded-[8px] border border-[#E8E5E0]">
            <div>
              <div className="text-[13px] font-bold text-[#1C1C1C]">Patrimoine Lokka</div>
              <div className="text-[11px] text-[#64635F]">Propriétaire Bailleur</div>
            </div>
            <a href="tel:+22997000000" className="w-10 h-10 rounded-full bg-[#1C1C1C] text-white flex items-center justify-center">
              <PhoneIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
