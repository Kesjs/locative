"use client";

import React, { useState } from "react";
import { useAddMandat } from "@/lib/hooks/useMandats";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function AddMandatModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { mutateAsync: addMandat, isPending } = useAddMandat();
  const [formData, setFormData] = useState({ proprietaire: "", biens: "", commission: "", solde: "" });

  const handleOpenChange = (open: boolean) => {
    if (!open) { setFormData({ proprietaire: "", biens: "", commission: "", solde: "" }); onClose(); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addMandat({
        proprietaire: formData.proprietaire,
        biens: Number(formData.biens) || 0,
        commission: formData.commission,
        solde: Number(formData.solde) || 0,
      });
      toast.success("Mandat enregistré !");
      handleOpenChange(false);
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement du mandat.");
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>Nouveau Mandat</DialogTitle>
          <DialogDescription>Enregistrez un mandat de gestion pour un propriétaire.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="mandat-proprietaire">Propriétaire / SCI</Label>
            <Input id="mandat-proprietaire" required autoFocus value={formData.proprietaire} onChange={e => setFormData({ ...formData, proprietaire: e.target.value })} placeholder="Ex. SCI Les Palmiers" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="mandat-biens">Nombre de biens</Label>
              <Input id="mandat-biens" required type="number" min={1} value={formData.biens} onChange={e => setFormData({ ...formData, biens: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mandat-commission">Commission (%)</Label>
              <Input id="mandat-commission" required placeholder="ex: 8%" value={formData.commission} onChange={e => setFormData({ ...formData, commission: e.target.value })} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="mandat-solde">Solde initial (FCFA)</Label>
            <Input id="mandat-solde" type="number" value={formData.solde} onChange={e => setFormData({ ...formData, solde: e.target.value })} placeholder="0" />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>Annuler</Button>
            <Button type="submit" disabled={isPending || !formData.proprietaire}>
              {isPending ? <><Spinner size="sm" className="mr-2" />Création...</> : "Enregistrer le mandat"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
