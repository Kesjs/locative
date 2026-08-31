"use client";

import React, { useState } from "react";
import { useAddBail } from "@/lib/hooks/useBaux";
import { XMarkIcon } from "@heroicons/react/24/outline";

export function AddBailModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { mutateAsync: addBail, isPending } = useAddBail();
  const [formData, setFormData] = useState({
    locataire: "",
    mandat: "",
    bien: "",
    loyer: "",
    caution: "Séquestrée",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addBail({
        ...formData,
        loyer: Number(formData.loyer) || 0,
      });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[12px] p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[18px] font-bold text-[#1C1C1C]">Nouveau bail</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <XMarkIcon className="w-5 h-5 text-[#64635F]" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12px] font-bold text-[#64635F] mb-1">Locataire (Nom complet)</label>
            <input required type="text" value={formData.locataire} onChange={e => setFormData({...formData, locataire: e.target.value})} className="w-full border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none" />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[#64635F] mb-1">Mandat / Représentant</label>
            <input required type="text" value={formData.mandat} onChange={e => setFormData({...formData, mandat: e.target.value})} className="w-full border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none" />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[#64635F] mb-1">Bien concerné</label>
            <input required type="text" value={formData.bien} onChange={e => setFormData({...formData, bien: e.target.value})} className="w-full border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-[#64635F] mb-1">Loyer (FCFA)</label>
              <input required type="number" value={formData.loyer} onChange={e => setFormData({...formData, loyer: e.target.value})} className="w-full border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none" />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#64635F] mb-1">Caution</label>
              <select 
                required 
                value={formData.caution} 
                onChange={e => setFormData({...formData, caution: e.target.value})} 
                className="w-full border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none"
              >
                <option value="Séquestrée">Séquestrée</option>
                <option value="Utilisée">Utilisée</option>
                <option value="Restituée">Restituée</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-[13px] font-bold text-[#64635F] hover:bg-gray-100 rounded-[6px]">
              Annuler
            </button>
            <button type="submit" disabled={isPending || !formData.locataire} className="px-4 py-2 bg-[#1C1C1C] text-white text-[13px] font-bold rounded-[6px] disabled:opacity-50">
              {isPending ? "Création..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
