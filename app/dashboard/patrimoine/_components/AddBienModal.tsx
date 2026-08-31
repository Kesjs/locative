"use client";

import React, { useState } from "react";
import { useAddBien } from "@/lib/hooks/useBiens";
import { XMarkIcon } from "@heroicons/react/24/outline";

export function AddBienModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { mutateAsync: addBien, isPending } = useAddBien();
  const [formData, setFormData] = useState({
    nom: "",
    adresse: "",
    ville: "",
    type: "Appartement",
    loyer_mensuel: "",
    statut: "vacant" as "loué" | "vacant" | "travaux",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addBien({
        ...formData,
        loyer_mensuel: Number(formData.loyer_mensuel) || 0,
        charges: 0,
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
          <h3 className="text-[18px] font-bold text-[#1C1C1C]">Ajouter un bien</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <XMarkIcon className="w-5 h-5 text-[#64635F]" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12px] font-bold text-[#64635F] mb-1">Nom du bien</label>
            <input required type="text" value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} className="w-full border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none" />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[#64635F] mb-1">Adresse</label>
            <input required type="text" value={formData.adresse} onChange={e => setFormData({...formData, adresse: e.target.value})} className="w-full border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-[#64635F] mb-1">Ville</label>
              <input required type="text" value={formData.ville} onChange={e => setFormData({...formData, ville: e.target.value})} className="w-full border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none" />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#64635F] mb-1">Loyer (FCFA)</label>
              <input required type="number" value={formData.loyer_mensuel} onChange={e => setFormData({...formData, loyer_mensuel: e.target.value})} className="w-full border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-[13px] font-bold text-[#64635F] hover:bg-gray-100 rounded-[6px]">
              Annuler
            </button>
            <button type="submit" disabled={isPending} className="px-4 py-2 bg-[#1C1C1C] text-white text-[13px] font-bold rounded-[6px] disabled:opacity-50">
              {isPending ? "Création..." : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
