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
  const [formData, setFormData] = useState({ nom: "", email: "", role: "Gestionnaire", statut: "Actif" });

  const handleOpenChange = (open: boolean) => {
    if (!open) { setFormData({ nom: "", email: "", role: "Gestionnaire", statut: "Actif" }); onClose(); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addMember(formData);
      toast.success("Collaborateur invité avec succès !");
      handleOpenChange(false);
    } catch (error: any) {
      toast.error("Erreur lors de l'invitation", {
        description: error?.message || "Veuillez vérifier les informations.",
      });
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent size="md" className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Inviter un collaborateur</DialogTitle>
          <DialogDescription>Ajoutez un gestionnaire ou un comptable à votre cabinet.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label htmlFor="member-nom" className="text-[12.5px] font-bold">Nom complet</Label>
            <Input id="member-nom" required autoFocus value={formData.nom} onChange={e => setFormData({ ...formData, nom: e.target.value })} placeholder="Ex. Ange Adankon" className="rounded-xl text-[13px]" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="member-email" className="text-[12.5px] font-bold">Adresse Email</Label>
            <Input id="member-email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="ange@cabinet.bj" className="rounded-xl text-[13px]" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="member-role" className="text-[12.5px] font-bold">Rôle au sein du Cabinet</Label>
            <Select value={formData.role} onValueChange={v => setFormData({ ...formData, role: v })}>
              <SelectTrigger id="member-role" className="rounded-xl text-[13px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>Annuler</Button>
            <Button type="submit" disabled={isPending || !formData.nom} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs">
              {isPending ? <><Spinner size="sm" className="mr-2" />Envoi...</> : "Inviter au Cabinet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
