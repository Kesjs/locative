"use client";

import React, { useState } from "react";
import { useAddLocataire } from "@/lib/hooks/useLocataires";
import { XMarkIcon } from "@heroicons/react/24/outline";

export function AddLocataireModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { mutateAsync: addLocataire, isPending } = useAddLocataire();
  const [formData, setFormData] = useState({
    nom_complet: "",
    telephone: "",
    email: "",
    bien_nom: "",
    loyer_mensuel: "",
    date_entree: new Date().toISOString().split("T")[0],
    statut_paiement: "à jour" as const,
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addLocataire({
        ...formData,
        loyer_mensuel: Number(formData.loyer_mensuel) || 0,
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
          <h3 className="text-[18px] font-bold text-[#1C1C1C]">Nouveau bail / locataire</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <XMarkIcon className="w-5 h-5 text-[#64635F]" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12px] font-bold text-[#64635F] mb-1">Nom complet</label>
            <input required type="text" value={formData.nom_complet} onChange={e => setFormData({...formData, nom_complet: e.target.value})} className="w-full border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-[#64635F] mb-1">Téléphone</label>
              <input required type="tel" value={formData.telephone} onChange={e => setFormData({...formData, telephone: e.target.value})} className="w-full border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none" />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#64635F] mb-1">Email</label>
              <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[#64635F] mb-1">Nom du bien affecté</label>
            <input required type="text" value={formData.bien_nom} onChange={e => setFormData({...formData, bien_nom: e.target.value})} className="w-full border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-[#64635F] mb-1">Loyer convenu</label>
              <input required type="number" value={formData.loyer_mensuel} onChange={e => setFormData({...formData, loyer_mensuel: e.target.value})} className="w-full border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none" />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#64635F] mb-1">Date d'entrée</label>
              <input required type="date" value={formData.date_entree} onChange={e => setFormData({...formData, date_entree: e.target.value})} className="w-full border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-[13px] font-bold text-[#64635F] hover:bg-gray-100 rounded-[6px]">
              Annuler
            </button>
            <button type="submit" disabled={isPending} className="px-4 py-2 bg-[#1C1C1C] text-white text-[13px] font-bold rounded-[6px] disabled:opacity-50">
              {isPending ? "Création..." : "Créer le bail"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
