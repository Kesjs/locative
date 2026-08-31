"use client";

import React, { useState } from "react";
import { GlobeAltIcon, CheckCircleIcon, ArrowTopRightOnSquareIcon, PaintBrushIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

export default function VitrinePage() {
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-[20px] font-extrabold text-[var(--text-primary)]">Vitrine & Acquisition</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8E5E0] text-[#1C1C1C] rounded-[6px] text-[13px] font-bold shadow-xs hover:bg-gray-50 transition-colors">
          Voir ma vitrine <ArrowTopRightOnSquareIcon className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-white border border-[#E8E5E0] rounded-[12px] p-6 shadow-xs relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-[#E6F5EF] blur-3xl pointer-events-none" />
        
        <h2 className="text-[16px] font-bold text-[#1C1C1C] mb-5 flex items-center gap-2">
          <GlobeAltIcon className="w-5 h-5 text-[#087F5B]" />
          Domaine & Référencement (SEO)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
          <div>
            <label className="block text-[12px] font-bold text-[#64635F] mb-1.5">Nom de domaine personnalisé</label>
            <div className="flex items-center border border-[#E8E5E0] rounded-[6px] overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#087F5B]">
              <span className="px-3 py-2 bg-[#FAF9F6] text-[#64635F] text-[13px] border-r border-[#E8E5E0] font-mono">https://</span>
              <input type="text" defaultValue="agence-lokka.bj" className="flex-1 px-3 py-2 text-[13px] outline-none font-medium" />
            </div>
          </div>
          <div className="flex items-end pb-1">
            <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#087F5B] bg-[#E6F5EF] border border-[#087F5B]/20 px-3 py-2 rounded-full">
              <CheckCircleIcon className="w-4 h-4" /> DNS correctement configuré
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#E8E5E0] rounded-[12px] p-6 shadow-xs">
        <h2 className="text-[16px] font-bold text-[#1C1C1C] mb-5 flex items-center gap-2">
          <PaintBrushIcon className="w-5 h-5 text-[#64635F]" />
          Personnalisation de la Vitrine
        </h2>
        <div className="space-y-6">
          <div>
            <label className="block text-[12px] font-bold text-[#64635F] mb-2">Logo de l'agence</label>
            <div className="border-2 border-dashed border-[#E8E5E0] bg-[#FAF9F6] rounded-[8px] p-8 text-center text-[12px] text-[#64635F] cursor-pointer hover:bg-white transition-colors">
              <div className="font-semibold text-[#1C1C1C] mb-1">Cliquez ou glissez-déposez votre logo ici</div>
              <div>Format PNG transparent recommandé (Max 2MB)</div>
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[#64635F] mb-2">Palette de couleurs principale</label>
            <div className="flex gap-4">
              <button className="w-8 h-8 rounded-full bg-[#1C1C1C] border-2 border-transparent ring-2 ring-offset-2 ring-[#1C1C1C]"></button>
              <button className="w-8 h-8 rounded-full bg-[#087F5B] border-2 border-transparent"></button>
              <button className="w-8 h-8 rounded-full bg-[#2563EB] border-2 border-transparent"></button>
              <button className="w-8 h-8 rounded-full bg-[#DC2626] border-2 border-transparent"></button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white border border-[#E8E5E0] rounded-[12px] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[16px] font-bold text-[#1C1C1C] flex items-center gap-2">
            <DocumentTextIcon className="w-5 h-5 text-[#64635F]" />
            Blog & Actualités
          </h2>
          <p className="text-[12px] text-[#64635F] mt-1">Publiez des articles pour améliorer votre SEO sur Google Bénin.</p>
        </div>
        <button className="px-4 py-2 bg-white border border-[#E8E5E0] text-[#1C1C1C] hover:bg-gray-50 rounded-[6px] text-[13px] font-bold transition-colors">
          Gérer les articles
        </button>
      </div>

      <div className="flex justify-end pt-4 border-t border-[#E8E5E0]">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2 bg-[#1C1C1C] text-white rounded-[6px] text-[13px] font-bold shadow-md hover:bg-black transition-colors disabled:opacity-50"
        >
          {isSaving ? "Enregistrement..." : saved ? <><CheckCircleIcon className="w-4 h-4"/> Sauvegardé !</> : "Enregistrer les modifications"}
        </button>
      </div>
    </div>
  );
}
