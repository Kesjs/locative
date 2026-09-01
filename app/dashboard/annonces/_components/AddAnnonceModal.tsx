"use client";

import React, { useState } from "react";
import { useAddAnnonce, Annonce } from "@/lib/hooks/useAnnonces";
import { useBiens } from "@/lib/hooks/useBiens";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function AddAnnonceModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { mutateAsync: addAnnonce, isPending } = useAddAnnonce();
  const { data: biens = [] } = useBiens();
  const [bien, setBien] = useState("");
  const [statut, setStatut] = useState<Annonce["statut"]>("Active");

  const handleOpenChange = (open: boolean) => {
    if (!open) { setBien(""); setStatut("Active"); onClose(); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addAnnonce({ bien, statut });
      toast.success("Annonce créée !");
      handleOpenChange(false);
    } catch (error) {
      toast.error("Erreur lors de la création de l'annonce.");
      console.error(error);
    }
  };

  // Biens vacants uniquement (candidates pour une annonce)
  const biensVacants = biens.filter(b => b.statut === "vacant");

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>Créer une annonce</DialogTitle>
          <DialogDescription>Sélectionnez le bien à mettre en location.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="annonce-bien">Bien à annoncer</Label>
            {biensVacants.length > 0 ? (
              <Select value={bien} onValueChange={setBien}>
                <SelectTrigger id="annonce-bien"><SelectValue placeholder="Sélectionner un bien vacant..." /></SelectTrigger>
                <SelectContent>
                  {biensVacants.map(b => <SelectItem key={b.id} value={b.nom}>{b.nom} — {b.ville}</SelectItem>)}
                </SelectContent>
              </Select>
            ) : (
              <Input id="annonce-bien" required autoFocus value={bien} onChange={e => setBien(e.target.value)} placeholder="Nom du bien à annoncer" />
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="annonce-statut">Statut initial</Label>
            <Select value={statut} onValueChange={v => setStatut(v as Annonce["statut"])}>
              <SelectTrigger id="annonce-statut"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">🟢 Publiée (Active)</SelectItem>
                <SelectItem value="Brouillon">📝 Brouillon</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>Annuler</Button>
            <Button type="submit" disabled={isPending || !bien}>
              {isPending ? <><Spinner size="sm" className="mr-2" />Création...</> : "Publier l'annonce"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
