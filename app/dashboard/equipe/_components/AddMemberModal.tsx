"use client";

import React, { useState } from "react";
import { useAddEquipeMember } from "@/lib/hooks/useEquipe";
import { XMarkIcon } from "@heroicons/react/24/outline";

export function AddMemberModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { mutateAsync: addMember, isPending } = useAddEquipeMember();
  const [formData, setFormData] = useState({
    nom: "",
    role: "Gestionnaire",
    statut: "Actif",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addMember(formData);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[12px] p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[18px] font-bold text-[#1C1C1C]">Inviter un collaborateur</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <XMarkIcon className="w-5 h-5 text-[#64635F]" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12px] font-bold text-[#64635F] mb-1">Nom complet</label>
            <input required type="text" value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} className="w-full border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none" />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[#64635F] mb-1">Rôle</label>
            <select 
              required 
              value={formData.role} 
              onChange={e => setFormData({...formData, role: e.target.value})} 
              className="w-full border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none"
            >
              <option value="Administrateur">Administrateur</option>
              <option value="Gestionnaire">Gestionnaire</option>
              <option value="Comptable">Comptable</option>
              <option value="Agent de terrain">Agent de terrain</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-[13px] font-bold text-[#64635F] hover:bg-gray-100 rounded-[6px]">
              Annuler
            </button>
            <button type="submit" disabled={isPending || !formData.nom} className="px-4 py-2 bg-[#1C1C1C] text-white text-[13px] font-bold rounded-[6px] disabled:opacity-50">
              {isPending ? "Envoi..." : "Envoyer l'invitation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
