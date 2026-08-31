"use client";

import React, { useState } from "react";
import { useAddMandat } from "@/lib/hooks/useMandats";
import { XMarkIcon } from "@heroicons/react/24/outline";

export function AddMandatModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { mutateAsync: addMandat, isPending } = useAddMandat();
  const [formData, setFormData] = useState({
    proprietaire: "",
    biens: "",
    commission: "",
    solde: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addMandat({
        proprietaire: formData.proprietaire,
        biens: Number(formData.biens) || 0,
        commission: formData.commission,
        solde: Number(formData.solde) || 0,
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
          <h3 className="text-[18px] font-bold text-[#1C1C1C]">Nouveau Mandat</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <XMarkIcon className="w-5 h-5 text-[#64635F]" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12px] font-bold text-[#64635F] mb-1">Propriétaire / SCI</label>
            <input required type="text" value={formData.proprietaire} onChange={e => setFormData({...formData, proprietaire: e.target.value})} className="w-full border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-[#64635F] mb-1">Nombre de biens</label>
              <input required type="number" value={formData.biens} onChange={e => setFormData({...formData, biens: e.target.value})} className="w-full border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none" />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#64635F] mb-1">Commission (%)</label>
              <input required type="text" placeholder="ex: 8%" value={formData.commission} onChange={e => setFormData({...formData, commission: e.target.value})} className="w-full border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[#64635F] mb-1">Solde initial (FCFA)</label>
            <input type="number" value={formData.solde} onChange={e => setFormData({...formData, solde: e.target.value})} className="w-full border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none" />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-[13px] font-bold text-[#64635F] hover:bg-gray-100 rounded-[6px]">
              Annuler
            </button>
            <button type="submit" disabled={isPending || !formData.proprietaire} className="px-4 py-2 bg-[#1C1C1C] text-white text-[13px] font-bold rounded-[6px] disabled:opacity-50">
              {isPending ? "Création..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
