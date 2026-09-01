"use client";

import React, { useState } from "react";
import { CameraIcon, PlusIcon } from "@heroicons/react/24/outline";

export default function AssistancePage() {
  const [signalements] = useState([
    { id: 1, type: "Plomberie", date: "12 Août 2026", statut: "Résolu" },
    { id: 2, type: "Électricité", date: "30 Août 2026", statut: "En cours" },
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-[20px] font-extrabold text-[var(--text-primary)]">Assistance</h1>

      <form className="bg-white border border-[#E8E5E0] rounded-[12px] p-4 sm:p-6 shadow-xs space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-[12px] font-bold text-[#64635F] mb-1">Type de panne</label>
          <select className="w-full border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none bg-white">
            <option>Plomberie (Fuite, canalisation bouchée...)</option>
            <option>Électricité (Coupure, prise défectueuse...)</option>
            <option>Serrurerie (Clé cassée, porte bloquée...)</option>
            <option>Autre problème</option>
          </select>
        </div>

        <div>
          <label className="block text-[12px] font-bold text-[#64635F] mb-1">Description</label>
          <textarea rows={3} placeholder="Expliquez brièvement le problème..." className="w-full border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none"></textarea>
        </div>

        <div>
          <label className="block text-[12px] font-bold text-[#64635F] mb-1">Photo (optionnel)</label>
          <label className="w-full min-h-[44px] flex items-center justify-center gap-2 border border-[#E8E5E0] rounded-[6px] bg-[#FAF9F6] text-[13px] font-bold text-[#0F172A] cursor-pointer hover:bg-gray-100 transition-colors">
            <CameraIcon className="w-5 h-5" />
            <span>Prendre une photo</span>
            {/* Native camera capture for mobile */}
            <input type="file" accept="image/*" capture="environment" className="hidden" />
          </label>
        </div>

        <button type="submit" className="w-full min-h-[44px] flex items-center justify-center gap-2 bg-[#0F172A] text-white rounded-[6px] text-[14px] font-bold mt-2 shadow-sm">
          <PlusIcon className="w-4 h-4" />
          Envoyer le signalement
        </button>
      </form>

      <div className="space-y-4">
        <h2 className="text-[16px] font-bold text-[#0F172A]">Mes signalements</h2>
        <div className="space-y-3">
          {signalements.map((s) => (
            <div key={s.id} className="bg-white border border-[#E8E5E0] rounded-[12px] p-4 flex items-center justify-between shadow-xs">
              <div>
                <div className="text-[14px] font-bold text-[#0F172A]">{s.type}</div>
                <div className="text-[12px] font-medium text-[#64635F] mt-0.5">{s.date}</div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                s.statut === "Résolu" ? "bg-[#F0FDF4] text-[#16A34A]" : "bg-[#FFF7ED] text-[#EA580C]"
              }`}>
                {s.statut}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
