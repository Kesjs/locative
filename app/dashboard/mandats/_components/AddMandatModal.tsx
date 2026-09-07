"use client";

import React, { useState } from "react";
import { useAddMandat } from "@/lib/hooks/useMandats";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ShieldCheck, Scale, AlertCircle } from "lucide-react";

export function AddMandatModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { mutateAsync: addMandat, isPending } = useAddMandat();
  const [formData, setFormData] = useState({
    proprietaire: "",
    telephone: "+229 ",
    email: "",
    biens: "1",
    commission: "10%",
    solde: "0",
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setFormData({
        proprietaire: "",
        telephone: "+229 ",
        email: "",
        biens: "1",
        commission: "10%",
        solde: "0",
      });
      onClose();
    }
  };

  const commissionNum = parseFloat(formData.commission.replace("%", "").trim()) || 10;
  const isOverCommission = commissionNum > 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addMandat({
        proprietaire: formData.proprietaire.trim(),
        telephone: formData.telephone.trim() || null,
        email: formData.email.trim() || null,
        biens: Number(formData.biens) || 1,
        commission: formData.commission.includes("%") ? formData.commission : `${formData.commission}%`,
        commission_pct: commissionNum,
        solde: Number(formData.solde) || 0,
      });
      toast.success("Mandat de gérance enregistré avec succès !", {
        description: `Convention créée pour ${formData.proprietaire}. Taux légal : ${formData.commission}.`,
      });
      handleOpenChange(false);
    } catch (error: any) {
      toast.error("Erreur lors de l'enregistrement du mandat", {
        description: error?.message || "Veuillez vérifier les informations.",
      });
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent size="md" className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
              <ShieldCheck className="w-3 h-3" />
              Loi n° 2022-30 du Bénin
            </span>
          </div>
          <DialogTitle className="text-xl">Nouveau Mandat de Gérance</DialogTitle>
          <DialogDescription>
            Enregistrez un contrat de gestion liant votre cabinet à un propriétaire mandant.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="mandat-proprietaire" className="text-[12.5px] font-bold">
              Propriétaire Mandant / SCI <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="mandat-proprietaire"
              required
              autoFocus
              value={formData.proprietaire}
              onChange={(e) => setFormData({ ...formData, proprietaire: e.target.value })}
              placeholder="Ex: M. Koffi Mensah ou SCI Les Cocotiers"
              className="rounded-xl text-[13px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="mandat-tel" className="text-[12px] font-bold">
                Téléphone / WhatsApp
              </Label>
              <Input
                id="mandat-tel"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                placeholder="+229 97 00 00 00"
                className="rounded-xl text-[13px]"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="mandat-email" className="text-[12px] font-bold">
                Email (Envoi CRG)
              </Label>
              <Input
                id="mandat-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="mandant@gmail.com"
                className="rounded-xl text-[13px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="mandat-biens" className="text-[12px] font-bold">
                Lots / Unités confiés
              </Label>
              <Input
                id="mandat-biens"
                required
                type="number"
                min={1}
                value={formData.biens}
                onChange={(e) => setFormData({ ...formData, biens: e.target.value })}
                className="rounded-xl text-[13px]"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="mandat-commission" className="text-[12px] font-bold">
                  Honoraires Cabinet
                </Label>
                <span className="text-[10px] text-blue-600 font-bold">Max 10%</span>
              </div>
              <Input
                id="mandat-commission"
                required
                value={formData.commission}
                onChange={(e) => setFormData({ ...formData, commission: e.target.value })}
                placeholder="10%"
                className={`rounded-xl text-[13px] ${isOverCommission ? "border-amber-500 focus:border-amber-600" : ""}`}
              />
            </div>
          </div>

          {isOverCommission && (
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2 text-[11.5px] text-amber-700 dark:text-amber-400">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Attention : La Loi 2022-30 plafonne les honoraires de gérance à 10% maximum des sommes recouvrées au Bénin.
              </span>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="mandat-solde" className="text-[12px] font-bold">
              Solde initial ou avance de trésorerie (FCFA)
            </Label>
            <Input
              id="mandat-solde"
              type="number"
              value={formData.solde}
              onChange={(e) => setFormData({ ...formData, solde: e.target.value })}
              placeholder="0"
              className="rounded-xl text-[13px]"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isPending || !formData.proprietaire.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs"
            >
              {isPending ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Enregistrement...
                </>
              ) : (
                "Établir le Mandat"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
