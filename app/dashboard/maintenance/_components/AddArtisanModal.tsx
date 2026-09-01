"use client";

import React, { useState } from "react";
import { useAddArtisan } from "@/lib/hooks/useMaintenance";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function AddArtisanModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { mutateAsync: addArtisan, isPending } = useAddArtisan();
  const [formData, setFormData] = useState({ nom: "", specialite: "", telephone: "", note: "Nouveau" });

  const handleOpenChange = (open: boolean) => {
    if (!open) { setFormData({ nom: "", specialite: "", telephone: "", note: "Nouveau" }); onClose(); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addArtisan(formData);
      toast.success("Artisan ajouté au carnet !");
      handleOpenChange(false);
    } catch (error) {
      toast.error("Erreur lors de l'ajout de l'artisan.");
      console.error(error);
    }
  };

  const isValid = formData.nom.trim() !== "" && formData.specialite.trim() !== "";

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>Ajouter un artisan</DialogTitle>
          <DialogDescription>Enregistrez un prestataire dans votre carnet d'adresses.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="artisan-nom">Nom ou Entreprise</Label>
            <Input id="artisan-nom" required autoFocus value={formData.nom} onChange={e => setFormData({ ...formData, nom: e.target.value })} placeholder="Ex. Plomberie Express" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="artisan-specialite">Spécialité</Label>
            <Input id="artisan-specialite" required value={formData.specialite} onChange={e => setFormData({ ...formData, specialite: e.target.value })} placeholder="Ex. Plomberie, Électricité..." />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="artisan-tel">Téléphone</Label>
            <Input id="artisan-tel" required type="tel" value={formData.telephone} onChange={e => setFormData({ ...formData, telephone: e.target.value })} placeholder="+229 97 00 11 22" />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>Annuler</Button>
            <Button type="submit" disabled={isPending || !isValid}>
              {isPending ? <><Spinner size="sm" className="mr-2" />Ajout...</> : "Ajouter au carnet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
