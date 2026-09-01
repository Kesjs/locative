"use client";

import React, { useState } from "react";
import { useAddEquipeMember } from "@/lib/hooks/useEquipe";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const ROLES = ["Administrateur", "Gestionnaire", "Comptable", "Agent de terrain"];

export function AddMemberModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { mutateAsync: addMember, isPending } = useAddEquipeMember();
  const [formData, setFormData] = useState({ nom: "", role: "Gestionnaire", statut: "Actif" });

  const handleOpenChange = (open: boolean) => {
    if (!open) { setFormData({ nom: "", role: "Gestionnaire", statut: "Actif" }); onClose(); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addMember(formData);
      toast.success("Invitation envoyée !");
      handleOpenChange(false);
    } catch (error) {
      toast.error("Erreur lors de l'invitation.");
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>Inviter un collaborateur</DialogTitle>
          <DialogDescription>Ajoutez un membre à votre équipe de gestion.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="member-nom">Nom complet</Label>
            <Input id="member-nom" required autoFocus value={formData.nom} onChange={e => setFormData({ ...formData, nom: e.target.value })} placeholder="Ex. Ange Adankon" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="member-role">Rôle</Label>
            <Select value={formData.role} onValueChange={v => setFormData({ ...formData, role: v })}>
              <SelectTrigger id="member-role"><SelectValue /></SelectTrigger>
              <SelectContent>
                {ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>Annuler</Button>
            <Button type="submit" disabled={isPending || !formData.nom}>
              {isPending ? <><Spinner size="sm" className="mr-2" />Envoi...</> : "Envoyer l'invitation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
