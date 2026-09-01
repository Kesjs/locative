"use client";

import React, { useState } from "react";
import { useAddTicket, Ticket } from "@/lib/hooks/useMaintenance";
import { useBiens } from "@/lib/hooks/useBiens";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const URGENCE_OPTIONS: { value: Ticket["urgence"]; label: string; emoji: string }[] = [
  { value: "Basse", label: "Basse", emoji: "🟢" },
  { value: "Moyenne", label: "Moyenne", emoji: "🟡" },
  { value: "Haute", label: "Haute 🔴", emoji: "🔴" },
];

export function AddTicketModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { mutateAsync: addTicket, isPending } = useAddTicket();
  const { data: biens = [] } = useBiens();

  const [formData, setFormData] = useState({
    titre: "",
    bien: "",
    urgence: "Moyenne" as Ticket["urgence"],
    statut: "Nouveau" as Ticket["statut"],
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setFormData({ titre: "", bien: "", urgence: "Moyenne", statut: "Nouveau" });
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addTicket(formData);
      toast.success("Ticket créé avec succès !");
      handleOpenChange(false);
    } catch (error) {
      toast.error("Erreur lors de la création du ticket.");
      console.error(error);
    }
  };

  const isValid = formData.titre.trim() !== "" && formData.bien.trim() !== "";

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>Nouveau ticket de maintenance</DialogTitle>
          <DialogDescription>
            Décrivez le problème et associez-le à un bien de votre patrimoine.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Titre */}
          <div className="space-y-1.5">
            <Label htmlFor="ticket-titre">Titre du problème</Label>
            <Input
              id="ticket-titre"
              required
              autoFocus
              placeholder="Ex. Fuite d'eau robinet cuisine"
              value={formData.titre}
              onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
            />
          </div>

          {/* Bien concerné */}
          <div className="space-y-1.5">
            <Label htmlFor="ticket-bien">Bien concerné</Label>
            {biens.length > 0 ? (
              <Select
                value={formData.bien}
                onValueChange={(v) => setFormData({ ...formData, bien: v })}
              >
                <SelectTrigger id="ticket-bien">
                  <SelectValue placeholder="Sélectionner un bien..." />
                </SelectTrigger>
                <SelectContent>
                  {biens.map((b) => (
                    <SelectItem key={b.id} value={b.nom}>
                      {b.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="ticket-bien"
                required
                placeholder="Ex. Villa Fidjrossè Plage"
                value={formData.bien}
                onChange={(e) => setFormData({ ...formData, bien: e.target.value })}
              />
            )}
          </div>

          {/* Urgence */}
          <div className="space-y-1.5">
            <Label htmlFor="ticket-urgence">Niveau d'urgence</Label>
            <Select
              value={formData.urgence}
              onValueChange={(v) => setFormData({ ...formData, urgence: v as Ticket["urgence"] })}
            >
              <SelectTrigger id="ticket-urgence">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {URGENCE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.emoji} {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isPending || !isValid}>
              {isPending ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Création...
                </>
              ) : (
                "Créer le ticket"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
