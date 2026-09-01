"use client";

import React, { useState } from "react";
import { useEncaisserLoyer, LoyerTransaction } from "@/lib/hooks/useLoyers";
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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function AddPaiementModal({
  isOpen,
  onClose,
  transactions,
}: {
  isOpen: boolean;
  onClose: () => void;
  transactions: LoyerTransaction[];
}) {
  const { mutateAsync: encaisser, isPending } = useEncaisserLoyer();
  const [selectedTxId, setSelectedTxId] = useState("");
  const [methode, setMethode] = useState<LoyerTransaction["methode"]>("Espèces");

  const pendingTxs = transactions.filter((t) => t.statut !== "payé");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTxId) return;
    try {
      await encaisser({ id: selectedTxId, methode });
      toast.success("Paiement enregistré avec succès !");
      setSelectedTxId("");
      onClose();
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement du paiement.");
      console.error(error);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedTxId("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>Enregistrer un paiement</DialogTitle>
          <DialogDescription>
            Sélectionnez la transaction à encaisser et la méthode de paiement.
          </DialogDescription>
        </DialogHeader>

        {pendingTxs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <span className="text-3xl">🎉</span>
            <p className="text-[14px] font-semibold text-foreground">Tous les loyers sont à jour !</p>
            <p className="text-[12px] text-muted-foreground">Aucun paiement en attente pour le moment.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="tx-select">Transaction à encaisser</Label>
              <Select required value={selectedTxId} onValueChange={setSelectedTxId}>
                <SelectTrigger id="tx-select" error={!selectedTxId && undefined}>
                  <SelectValue placeholder="Sélectionner une transaction..." />
                </SelectTrigger>
                <SelectContent>
                  {pendingTxs.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.locataire_nom} — {t.montant.toLocaleString("fr-FR")} FCFA ({t.echeance})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="methode-select">Méthode de paiement</Label>
              <Select
                value={methode}
                onValueChange={(v) => setMethode(v as LoyerTransaction["methode"])}
              >
                <SelectTrigger id="methode-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Espèces">💵 Espèces</SelectItem>
                  <SelectItem value="MTN MoMo">📱 MTN MoMo</SelectItem>
                  <SelectItem value="Moov Money">📱 Moov Money</SelectItem>
                  <SelectItem value="Virement">🏦 Virement bancaire</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={isPending || !selectedTxId}>
                {isPending ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Validation...
                  </>
                ) : (
                  "Valider le paiement"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
