"use client";

import React, { useState } from "react";
import { useAddAnnonce, Annonce } from "@/lib/hooks/useAnnonces";
import { XMarkIcon } from "@heroicons/react/24/outline";

export function AddAnnonceModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { mutateAsync: addAnnonce, isPending } = useAddAnnonce();
  const [bien, setBien] = useState("");
  const [statut, setStatut] = useState<Annonce["statut"]>("Active");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addAnnonce({ bien, statut });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[12px] p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[18px] font-bold text-[#1C1C1C]">Créer une annonce</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <XMarkIcon className="w-5 h-5 text-[#64635F]" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12px] font-bold text-[#64635F] mb-1">Nom du bien à annoncer</label>
            <input required type="text" value={bien} onChange={e => setBien(e.target.value)} className="w-full border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none" />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[#64635F] mb-1">Statut initial</label>
            <select 
              required 
              value={statut} 
              onChange={e => setStatut(e.target.value as any)} 
              className="w-full border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none"
            >
              <option value="Active">Publiée (Active)</option>
              <option value="Brouillon">Brouillon</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-[13px] font-bold text-[#64635F] hover:bg-gray-100 rounded-[6px]">
              Annuler
            </button>
            <button type="submit" disabled={isPending || !bien} className="px-4 py-2 bg-[#1C1C1C] text-white text-[13px] font-bold rounded-[6px] disabled:opacity-50">
              {isPending ? "Création..." : "Publier"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
