"use client";

import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";

export default function AdminParametresPage() {
  const [showMtn, setShowMtn] = useState(false);
  const [showWhatsapp, setShowWhatsapp] = useState(false);

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-[24px] font-extrabold text-[var(--text-primary)]">Paramètres Système</h1>

      <div className="bg-white border border-[#E8E5E0] rounded-[12px] p-6 shadow-xs">
        <h2 className="text-[16px] font-bold text-[#1C1C1C] mb-4">Clés API & Intégrations</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-[12px] font-bold text-[#64635F] mb-1">Passerelle MTN MoMo (Production)</label>
            <div className="flex items-center gap-2">
              <input 
                type={showMtn ? "text" : "password"} 
                defaultValue="mtn_prod_sk_89x12..." 
                className="flex-1 border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none" 
              />
              <button onClick={() => setShowMtn(!showMtn)} className="p-2 border border-[#E8E5E0] rounded-[6px] hover:bg-gray-50">
                {showMtn ? <EyeSlashIcon className="w-4 h-4 text-[#1C1C1C]" /> : <EyeIcon className="w-4 h-4 text-[#1C1C1C]" />}
              </button>
              <button className="p-2 border border-[#E8E5E0] rounded-[6px] hover:bg-gray-50">
                <DocumentDuplicateIcon className="w-4 h-4 text-[#1C1C1C]" />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[#64635F] mb-1">API WhatsApp Business</label>
            <div className="flex items-center gap-2">
              <input 
                type={showWhatsapp ? "text" : "password"} 
                defaultValue="wa_prod_tk_abc123..." 
                className="flex-1 border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none" 
              />
              <button onClick={() => setShowWhatsapp(!showWhatsapp)} className="p-2 border border-[#E8E5E0] rounded-[6px] hover:bg-gray-50">
                {showWhatsapp ? <EyeSlashIcon className="w-4 h-4 text-[#1C1C1C]" /> : <EyeIcon className="w-4 h-4 text-[#1C1C1C]" />}
              </button>
              <button className="p-2 border border-[#E8E5E0] rounded-[6px] hover:bg-gray-50">
                <DocumentDuplicateIcon className="w-4 h-4 text-[#1C1C1C]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#E8E5E0] rounded-[12px] p-6 shadow-xs">
        <h2 className="text-[16px] font-bold text-[#1C1C1C] mb-4">Tarification (Sans redéploiement)</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-[#64635F] mb-1">Plan Pro Bailleur (FCFA)</label>
              <input type="number" defaultValue={5000} className="w-full border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none" />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#64635F] mb-1">Plan Agence (FCFA)</label>
              <input type="number" defaultValue={25000} className="w-full border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none" />
            </div>
          </div>
          <button className="min-h-[44px] px-6 py-2 bg-[#1C1C1C] text-white rounded-[6px] text-[13px] font-bold mt-2">
            Sauvegarder les règles
          </button>
        </div>
      </div>
    </div>
  );
}
