"use client";

import React, { useState } from "react";
import { useAddTicket, Ticket } from "@/lib/hooks/useMaintenance";
import { XMarkIcon } from "@heroicons/react/24/outline";

export function AddTicketModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { mutateAsync: addTicket, isPending } = useAddTicket();
  const [formData, setFormData] = useState({
    titre: "",
    bien: "",
    urgence: "Moyenne" as Ticket["urgence"],
    statut: "Nouveau" as Ticket["statut"],
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addTicket(formData);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[12px] p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[18px] font-bold text-[#0F172A]">Nouveau ticket</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <XMarkIcon className="w-5 h-5 text-[#64635F]" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12px] font-bold text-[#64635F] mb-1">Titre (Ex: Fuite d'eau)</label>
            <input required type="text" value={formData.titre} onChange={e => setFormData({...formData, titre: e.target.value})} className="w-full border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none" />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[#64635F] mb-1">Bien concerné</label>
            <input required type="text" value={formData.bien} onChange={e => setFormData({...formData, bien: e.target.value})} className="w-full border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none" />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[#64635F] mb-1">Urgence</label>
            <select 
              required 
              value={formData.urgence} 
              onChange={e => setFormData({...formData, urgence: e.target.value as any})} 
              className="w-full border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none"
            >
              <option value="Basse">Basse</option>
              <option value="Moyenne">Moyenne</option>
              <option value="Haute">Haute</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-[13px] font-bold text-[#64635F] hover:bg-gray-100 rounded-[6px]">
              Annuler
            </button>
            <button type="submit" disabled={isPending || !formData.titre || !formData.bien} className="px-4 py-2 bg-[#0F172A] text-white text-[13px] font-bold rounded-[6px] disabled:opacity-50">
              {isPending ? "Création..." : "Créer le ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
