"use client";

import React, { useState } from "react";
import { useAddArtisan } from "@/lib/hooks/useMaintenance";
import { XMarkIcon } from "@heroicons/react/24/outline";

export function AddArtisanModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { mutateAsync: addArtisan, isPending } = useAddArtisan();
  const [formData, setFormData] = useState({
    nom: "",
    specialite: "",
    telephone: "",
    note: "Nouveau",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addArtisan(formData);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[12px] p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[18px] font-bold text-[#0F172A]">Ajouter un artisan</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <XMarkIcon className="w-5 h-5 text-[#64635F]" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12px] font-bold text-[#64635F] mb-1">Nom ou Entreprise</label>
            <input required type="text" value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} className="w-full border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none" />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[#64635F] mb-1">Spécialité</label>
            <input required type="text" value={formData.specialite} onChange={e => setFormData({...formData, specialite: e.target.value})} className="w-full border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none" placeholder="Ex: Plomberie" />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[#64635F] mb-1">Téléphone</label>
            <input required type="tel" value={formData.telephone} onChange={e => setFormData({...formData, telephone: e.target.value})} className="w-full border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none" />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-[13px] font-bold text-[#64635F] hover:bg-gray-100 rounded-[6px]">
              Annuler
            </button>
            <button type="submit" disabled={isPending || !formData.nom || !formData.specialite} className="px-4 py-2 bg-[#0F172A] text-white text-[13px] font-bold rounded-[6px] disabled:opacity-50">
              {isPending ? "Ajout..." : "Ajouter au carnet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
