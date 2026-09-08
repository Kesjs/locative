"use client";

import React, { useEffect, useState } from "react";
import { useUpdatePayment, useDeletePayment, type LoyerTransaction } from "@/lib/hooks/useLoyers";
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

export function EditPaiementModal({
  isOpen,
  onClose,
  transaction,
}: {
  isOpen: boolean;
  onClose: () => void;
  transaction: LoyerTransaction | null;
}) {
  const { mutateAsync: updatePayment, isPending: isUpdating } = useUpdatePayment();
  const { mutateAsync: deletePayment, isPending: isDeleting } = useDeletePayment();

  const [locataireNom, setLocataireNom] = useState("");
  const [bienNom, setBienNom] = useState("");
  const [montant, setMontant] = useState("");
  const [methode, setMethode] = useState<LoyerTransaction["methode"]>("MTN MoMo");
  const [dateReglement, setDateReglement] = useState("");
  const [referencePaiement, setReferencePaiement] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (transaction) {
      setLocataireNom(transaction.locataire_nom || "");
      setBienNom(transaction.bien_nom || "");
      setMontant(String(transaction.montant || ""));
      setMethode(transaction.methode || "MTN MoMo");
      setDateReglement(
        transaction.date_reglement ? transaction.date_reglement.slice(0, 10) : new Date().toISOString().slice(0, 10)
      );
      setReferencePaiement(transaction.reference_paiement || "");
      setConfirmDelete(false);
    }
  }, [transaction?.id]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setConfirmDelete(false);
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transaction) return;
    if (!locataireNom || !bienNom || !montant) {
      toast.error("Veuillez renseigner le locataire, le bien et le montant.");
      return;
    }
    try {
      await updatePayment({
        id: transaction.id,
        locataire_nom: locataireNom,
        bien_nom: bienNom,
        montant: Number(montant),
        methode,
        date_reglement: dateReglement ? new Date(dateReglement).toISOString() : undefined,
        reference_paiement: referencePaiement || null,
      });
      toast.success("Paiement corrigé avec succès.");
      handleOpenChange(false);
    } catch (error: any) {
      toast.error(error?.message || "Erreur lors de la correction du paiement.");
    }
  };

  const handleDelete = async () => {
    if (!transaction) return;
    try {
      await deletePayment(transaction.id);
      toast.success("Paiement supprimé.");
      handleOpenChange(false);
    } catch (error: any) {
      toast.error(error?.message || "Erreur lors de la suppression du paiement.");
      setConfirmDelete(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>Corriger un paiement</DialogTitle>
          <DialogDescription>
            Corrigez une erreur de saisie (montant, date, locataire...) sur ce règlement déjà enregistré.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="edit-locataire">Nom du locataire</Label>
            <Input
              id="edit-locataire"
              required
              value={locataireNom}
              onChange={(e) => setLocataireNom(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-bien">Nom du bien / Lot</Label>
            <Input id="edit-bien" required value={bienNom} onChange={(e) => setBienNom(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-montant">Montant perçu (FCFA)</Label>
            <Input
              id="edit-montant"
              type="number"
              min="1"
              required
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-date">Date de règlement</Label>
            <Input
              id="edit-date"
              type="date"
              required
              value={dateReglement}
              onChange={(e) => setDateReglement(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-reference">
              ID transaction MoMo/Moov <span className="text-muted-foreground font-normal">(optionnel)</span>
            </Label>
            <Input
              id="edit-reference"
              value={referencePaiement}
              onChange={(e) => setReferencePaiement(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-methode-select">Moyen de paiement reçu</Label>
            <Select value={methode} onValueChange={(v) => setMethode(v as LoyerTransaction["methode"])}>
              <SelectTrigger id="edit-methode-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MTN MoMo">MTN Mobile Money (MoMo)</SelectItem>
                <SelectItem value="Moov Money">Moov Money (Flooz)</SelectItem>
                <SelectItem value="Espèces">Espèces (Remise en main propre)</SelectItem>
                <SelectItem value="Virement">Virement bancaire / Chèque</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2 flex-wrap">
            {!confirmDelete ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setConfirmDelete(true)}
                className="text-destructive hover:text-destructive mr-auto"
              >
                Supprimer ce paiement
              </Button>
            ) : (
              <div className="flex items-center gap-2 mr-auto">
                <span className="text-[12px] text-muted-foreground">Confirmer la suppression ?</span>
                <Button type="button" variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? <Spinner size="sm" /> : "Oui, supprimer"}
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>
                  Annuler
                </Button>
              </div>
            )}

            <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>
              Fermer
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Enregistrement...
                </>
              ) : (
                "Enregistrer la correction"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
