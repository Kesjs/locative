"use client";

import React, { useState } from "react";
import { useEncaisserLoyer, useAddPaymentDirect, LoyerTransaction } from "@/lib/hooks/useLoyers";
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

export function AddPaiementModal({
  isOpen,
  onClose,
  transactions,
}: {
  isOpen: boolean;
  onClose: () => void;
  transactions: LoyerTransaction[];
}) {
  const { mutateAsync: encaisser, isPending: isPendingEncaisser } = useEncaisserLoyer();
  const { mutateAsync: addDirectPayment, isPending: isPendingDirect } = useAddPaymentDirect();
  const { data: biens = [] } = useBiens();

  const pendingTxs = transactions.filter((t) => t.statut !== "payé");
  const [mode, setMode] = useState<"pending" | "direct">(pendingTxs.length > 0 ? "pending" : "direct");

  // Mode Pending
  const [selectedTxId, setSelectedTxId] = useState("");
  const [methode, setMethode] = useState<LoyerTransaction["methode"]>("MTN MoMo");

  // Mode Direct
  const [directBien, setDirectBien] = useState("");
  const [directLocataire, setDirectLocataire] = useState("");
  const [directMontant, setDirectMontant] = useState("");

  const handleBienSelect = (bienId: string) => {
    const found = biens.find((b) => b.id === bienId);
    if (found) {
      setDirectBien(found.nom);
      if (found.locataire_nom) setDirectLocataire(found.locataire_nom);
      if (found.loyer_mensuel) setDirectMontant(String(found.loyer_mensuel));
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedTxId("");
      setDirectBien("");
      setDirectLocataire("");
      setDirectMontant("");
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "pending") {
      if (!selectedTxId) return;
      try {
        await encaisser({ id: selectedTxId, methode });
        toast.success("Paiement encaissé avec succès ! Quittance mise à jour.");
        handleOpenChange(false);
      } catch (error) {
        toast.error("Erreur lors de l'enregistrement du paiement.");
        console.error(error);
      }
    } else {
      if (!directBien || !directLocataire || !directMontant) {
        toast.error("Veuillez renseigner le bien, le locataire et le montant.");
        return;
      }
      try {
        await addDirectPayment({
          bien_nom: directBien,
          locataire_nom: directLocataire,
          montant: Number(directMontant),
          methode,
        });
        toast.success("Paiement enregistré avec succès !");
        handleOpenChange(false);
      } catch (error) {
        toast.error("Erreur lors de l'enregistrement du paiement direct.");
        console.error(error);
      }
    }
  };

  const isPending = isPendingEncaisser || isPendingDirect;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>Enregistrer un encaissement</DialogTitle>
          <DialogDescription>
            Enregistrez un loyer perçu via Mobile Money, espèces ou virement bancaire.
          </DialogDescription>
        </DialogHeader>

        {/* Choix du mode si des loyers sont en attente */}
        {pendingTxs.length > 0 && (
          <div className="flex rounded-lg bg-muted p-1 gap-1">
            <button
              type="button"
              onClick={() => setMode("pending")}
              className={`flex-1 py-1.5 text-[12.5px] font-bold rounded-md transition-all cursor-pointer ${
                mode === "pending"
                  ? "bg-card text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Échéance en attente ({pendingTxs.length})
            </button>
            <button
              type="button"
              onClick={() => setMode("direct")}
              className={`flex-1 py-1.5 text-[12.5px] font-bold rounded-md transition-all cursor-pointer ${
                mode === "direct"
                  ? "bg-card text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Nouveau paiement direct
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "pending" && pendingTxs.length > 0 ? (
            <div className="space-y-1.5">
              <Label htmlFor="tx-select">Sélectionner l'échéance à solder</Label>
              <Select required value={selectedTxId} onValueChange={setSelectedTxId}>
                <SelectTrigger id="tx-select">
                  <SelectValue placeholder="Sélectionner une transaction..." />
                </SelectTrigger>
                <SelectContent>
                  {pendingTxs.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.locataire_nom} — {Number(t.montant).toLocaleString("fr-FR")} FCFA ({t.bien_nom})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-3">
              {biens.length > 0 && (
                <div className="space-y-1.5">
                  <Label htmlFor="bien-quick-select">Choisir un bien enregistré (optionnel)</Label>
                  <Select onValueChange={handleBienSelect}>
                    <SelectTrigger id="bien-quick-select">
                      <SelectValue placeholder="Remplir depuis un bien existant..." />
                    </SelectTrigger>
                    <SelectContent>
                      {biens.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.nom} ({Number(b.loyer_mensuel).toLocaleString("fr-FR")} FCFA)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="direct-bien">Nom du bien / Lot</Label>
                <Input
                  id="direct-bien"
                  required
                  placeholder="Ex: Villa Cadjêhoun - Lot 4"
                  value={directBien}
                  onChange={(e) => setDirectBien(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="direct-locataire">Nom du locataire</Label>
                <Input
                  id="direct-locataire"
                  required
                  placeholder="Ex: Koffi Mensah"
                  value={directLocataire}
                  onChange={(e) => setDirectLocataire(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="direct-montant">Montant perçu (FCFA)</Label>
                <Input
                  id="direct-montant"
                  type="number"
                  min="1"
                  required
                  placeholder="Ex: 150000"
                  value={directMontant}
                  onChange={(e) => setDirectMontant(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="methode-select">Moyen de paiement reçu</Label>
            <Select
              value={methode}
              onValueChange={(v) => setMethode(v as LoyerTransaction["methode"])}
            >
              <SelectTrigger id="methode-select">
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

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Validation...
                </>
              ) : (
                "Confirmer l'encaissement"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
