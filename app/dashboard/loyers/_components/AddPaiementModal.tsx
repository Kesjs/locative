"use client";

import React, { useState } from "react";
import { useEncaisserLoyer, LoyerTransaction } from "@/lib/hooks/useLoyers";
import { XMarkIcon } from "@heroicons/react/24/outline";

export function AddPaiementModal({ 
  isOpen, 
  onClose, 
  transactions 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  transactions: LoyerTransaction[];
}) {
  const { mutateAsync: encaisser, isPending } = useEncaisserLoyer();
  const [selectedTxId, setSelectedTxId] = useState("");
  const [methode, setMethode] = useState<LoyerTransaction["methode"]>("Espèces");

  if (!isOpen) return null;

  const pendingTxs = transactions.filter(t => t.statut !== "payé");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTxId) return;
    try {
      await encaisser({ id: selectedTxId, methode });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[12px] p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[18px] font-bold text-[#1C1C1C]">Enregistrer un paiement manuel</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <XMarkIcon className="w-5 h-5 text-[#64635F]" />
          </button>
        </div>
        
        {pendingTxs.length === 0 ? (
          <div className="text-[13px] text-[#64635F] py-4 text-center">
            Tous les loyers sont à jour, aucun paiement en attente !
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[12px] font-bold text-[#64635F] mb-1">Sélectionner la transaction</label>
              <select 
                required 
                value={selectedTxId} 
                onChange={e => setSelectedTxId(e.target.value)} 
                className="w-full border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none"
              >
                <option value="" disabled>-- Choisir --</option>
                {pendingTxs.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.locataire_nom} - {t.montant.toLocaleString()} FCFA ({t.echeance})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#64635F] mb-1">Méthode de paiement</label>
              <select 
                required 
                value={methode} 
                onChange={e => setMethode(e.target.value as any)} 
                className="w-full border border-[#E8E5E0] rounded-[6px] px-3 py-2 text-[13px] outline-none"
              >
                <option value="Espèces">Espèces</option>
                <option value="MTN MoMo">MTN MoMo</option>
                <option value="Moov Money">Moov Money</option>
                <option value="Virement">Virement bancaire</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button type="button" onClick={onClose} className="px-4 py-2 text-[13px] font-bold text-[#64635F] hover:bg-gray-100 rounded-[6px]">
                Annuler
              </button>
              <button type="submit" disabled={isPending || !selectedTxId} className="px-4 py-2 bg-[#1C1C1C] text-white text-[13px] font-bold rounded-[6px] disabled:opacity-50">
                {isPending ? "Validation..." : "Valider le paiement"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
