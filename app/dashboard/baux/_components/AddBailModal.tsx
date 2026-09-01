"use client";

import React, { useState } from "react";
import { useAddBail } from "@/lib/hooks/useBaux";
import { useBiens } from "@/lib/hooks/useBiens";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function AddBailModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { mutateAsync: addBail, isPending } = useAddBail();
  const { data: biens = [] } = useBiens();
  const [formData, setFormData] = useState({ locataire: "", mandat: "", bien: "", loyer: "", caution: "Séquestrée" });

  const handleOpenChange = (open: boolean) => {
    if (!open) { setFormData({ locataire: "", mandat: "", bien: "", loyer: "", caution: "Séquestrée" }); onClose(); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addBail({ ...formData, loyer: Number(formData.loyer) || 0 });
      toast.success("Bail créé avec succès !");
      handleOpenChange(false);
    } catch (error) {
      toast.error("Erreur lors de la création du bail.");
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>Nouveau bail</DialogTitle>
          <DialogDescription>Enregistrez un nouveau contrat de location.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="bail-locataire">Locataire (Nom complet)</Label>
            <Input id="bail-locataire" required autoFocus value={formData.locataire} onChange={e => setFormData({ ...formData, locataire: e.target.value })} placeholder="Ex. Koudjo Dossou" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bail-mandat">Mandat / Représentant</Label>
            <Input id="bail-mandat" required value={formData.mandat} onChange={e => setFormData({ ...formData, mandat: e.target.value })} placeholder="Ex. Lokka Gestion" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bail-bien">Bien concerné</Label>
            {biens.length > 0 ? (
              <Select value={formData.bien} onValueChange={v => setFormData({ ...formData, bien: v })}>
                <SelectTrigger id="bail-bien"><SelectValue placeholder="Sélectionner un bien..." /></SelectTrigger>
                <SelectContent>
                  {biens.map(b => <SelectItem key={b.id} value={b.nom}>{b.nom}</SelectItem>)}
                </SelectContent>
              </Select>
            ) : (
              <Input id="bail-bien" required value={formData.bien} onChange={e => setFormData({ ...formData, bien: e.target.value })} placeholder="Nom du bien" />
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="bail-loyer">Loyer (FCFA)</Label>
              <Input id="bail-loyer" required type="number" value={formData.loyer} onChange={e => setFormData({ ...formData, loyer: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bail-caution">Caution</Label>
              <Select value={formData.caution} onValueChange={v => setFormData({ ...formData, caution: v })}>
                <SelectTrigger id="bail-caution"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Séquestrée">Séquestrée</SelectItem>
                  <SelectItem value="Utilisée">Utilisée</SelectItem>
                  <SelectItem value="Restituée">Restituée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>Annuler</Button>
            <Button type="submit" disabled={isPending || !formData.locataire || !formData.bien}>
              {isPending ? <><Spinner size="sm" className="mr-2" />Création...</> : "Enregistrer le bail"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
