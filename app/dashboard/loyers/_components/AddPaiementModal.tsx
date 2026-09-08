"use client";

import React, { useEffect, useState } from "react";
import { useEncaisserLoyer, useAddPaymentDirect, LoyerTransaction } from "@/lib/hooks/useLoyers";
import { useBiens } from "@/lib/hooks/useBiens";
import { parseMomoSms } from "@/lib/parse-momo-sms";
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
  preselectedTransactionId,
}: {
  isOpen: boolean;
  onClose: () => void;
  transactions: LoyerTransaction[];
  /** Échéance à présélectionner (ex: clic sur "Encaisser" depuis une ligne précise) */
  preselectedTransactionId?: string | null;
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
  const [directBienId, setDirectBienId] = useState<string | null>(null);
  const [directLocataire, setDirectLocataire] = useState("");
  const [directMontant, setDirectMontant] = useState("");

  // Commun aux deux modes : justificatif de paiement
  const [referencePaiement, setReferencePaiement] = useState("");
  const [preuveFile, setPreuveFile] = useState<File | null>(null);
  const [preuvePreview, setPreuvePreview] = useState<string | null>(null);

  // Rapprochement instantané : coller le SMS de confirmation MoMo/Moov
  const [smsText, setSmsText] = useState("");
  const [smsOpen, setSmsOpen] = useState(false);
  const [smsStatus, setSmsStatus] = useState<"idle" | "matched" | "unmatched" | "unreadable" | "duplicate">("idle");
  const [duplicateTx, setDuplicateTx] = useState<LoyerTransaction | null>(null);

  // Présélection de l'échéance quand la modale est ouverte depuis le bouton
  // "Encaisser" d'une ligne précise, pour éviter à l'utilisateur de la rechercher à nouveau.
  useEffect(() => {
    if (isOpen && preselectedTransactionId) {
      setMode("pending");
      setSelectedTxId(preselectedTransactionId);
    }
  }, [isOpen, preselectedTransactionId]);

  const findByReference = (ref: string, excludeId?: string) =>
    transactions.find((t) => t.reference_paiement && t.reference_paiement === ref && t.id !== excludeId);

  const handleAnalyserSms = () => {
    const parsed = parseMomoSms(smsText);
    if (!parsed) {
      setSmsStatus("unreadable");
      setDuplicateTx(null);
      return;
    }

    if (parsed.reference) {
      const doublon = findByReference(parsed.reference);
      if (doublon) {
        setDuplicateTx(doublon);
        setSmsStatus("duplicate");
        return; // on n'auto-remplit rien : mieux vaut forcer une vérification manuelle
      }
    }
    setDuplicateTx(null);

    if (parsed.reference) setReferencePaiement(parsed.reference);
    if (parsed.operateur) setMethode(parsed.operateur);

    // Mode échéance en attente : on cherche une correspondance exacte par montant
    if (pendingTxs.length > 0) {
      const candidates = pendingTxs.filter((t) => Number(t.montant) === parsed.montant);
      if (candidates.length === 1) {
        setMode("pending");
        setSelectedTxId(candidates[0].id);
        setSmsStatus("matched");
        return;
      }
    }

    // Pas de correspondance unique : on bascule en paiement direct pré-rempli
    setMode("direct");
    setDirectMontant(String(parsed.montant));
    if (parsed.expediteurNom) setDirectLocataire(parsed.expediteurNom);
    setSmsStatus("unmatched");
  };

  const handlePreuveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPreuveFile(file);
    if (preuvePreview) URL.revokeObjectURL(preuvePreview);
    setPreuvePreview(file ? URL.createObjectURL(file) : null);
  };

  const clearPreuve = () => {
    setPreuveFile(null);
    if (preuvePreview) URL.revokeObjectURL(preuvePreview);
    setPreuvePreview(null);
  };

  const handleBienSelect = (bienId: string) => {
    const found = biens.find((b) => b.id === bienId);
    if (found) {
      setDirectBien(found.nom);
      setDirectBienId(found.id);
      if (found.locataire_nom) setDirectLocataire(found.locataire_nom);
      if (found.loyer_mensuel) setDirectMontant(String(found.loyer_mensuel));
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedTxId("");
      setDirectBien("");
      setDirectBienId(null);
      setDirectLocataire("");
      setDirectMontant("");
      setReferencePaiement("");
      clearPreuve();
      setSmsText("");
      setSmsOpen(false);
      setSmsStatus("idle");
      setDuplicateTx(null);
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (referencePaiement) {
      const doublon = findByReference(referencePaiement, mode === "pending" ? selectedTxId : undefined);
      if (doublon) {
        toast.error(
          `Cette référence est déjà associée à un encaissement de ${Number(doublon.montant).toLocaleString("fr-FR")} FCFA (${doublon.locataire_nom}). Vérifie avant de continuer.`
        );
        return;
      }
    }

    if (mode === "pending") {
      if (!selectedTxId) return;
      try {
        await encaisser({
          id: selectedTxId,
          methode,
          reference_paiement: referencePaiement || undefined,
          preuveFile,
        });
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
          bien_id: directBienId,
          locataire_nom: directLocataire,
          montant: Number(directMontant),
          methode,
          reference_paiement: referencePaiement || undefined,
          preuveFile,
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
          <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
            <button
              type="button"
              onClick={() => setSmsOpen((v) => !v)}
              className="text-[12.5px] font-bold text-foreground flex items-center gap-1.5"
            >
              📋 Coller le SMS MoMo/Moov {smsOpen ? "▲" : "▼"}
            </button>
            {smsOpen && (
              <div className="space-y-2">
                <textarea
                  className="w-full rounded-md border bg-background p-2 text-[13px] min-h-[70px]"
                  placeholder="Colle ici le SMS de confirmation reçu (Transfert ... F de ... Ref:... ID:...)"
                  value={smsText}
                  onChange={(e) => {
                    setSmsText(e.target.value);
                    setSmsStatus("idle");
                  }}
                />
                <Button type="button" variant="secondary" size="sm" onClick={handleAnalyserSms}>
                  Analyser le SMS
                </Button>
                {smsStatus === "matched" && (
                  <p className="text-[12.5px] text-green-600">
                    ✓ SMS reconnu — échéance correspondante pré-sélectionnée, vérifie et confirme.
                  </p>
                )}
                {smsStatus === "unmatched" && (
                  <p className="text-[12.5px] text-amber-600">
                    Montant reconnu mais aucune échéance en attente ne correspond exactement — champs pré-remplis en paiement direct, à vérifier.
                  </p>
                )}
                {smsStatus === "unreadable" && (
                  <p className="text-[12.5px] text-destructive">
                    Format non reconnu — remplis les champs manuellement ci-dessous.
                  </p>
                )}
                {smsStatus === "duplicate" && duplicateTx && (
                  <p className="text-[12.5px] text-destructive">
                    ⚠️ Ce SMS a déjà été enregistré — {duplicateTx.locataire_nom},{" "}
                    {Number(duplicateTx.montant).toLocaleString("fr-FR")} FCFA ({duplicateTx.bien_nom}). Rien n'a été
                    pré-rempli pour éviter un double comptage.
                  </p>
                )}
              </div>
            )}
          </div>

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
                  onChange={(e) => {
                    setDirectBien(e.target.value);
                    setDirectBienId(null);
                  }}
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
            <Label htmlFor="reference-paiement">
              ID transaction MoMo/Moov <span className="text-muted-foreground font-normal">(optionnel)</span>
            </Label>
            <Input
              id="reference-paiement"
              placeholder="Ex: MP240611.1032.A12345"
              value={referencePaiement}
              onChange={(e) => setReferencePaiement(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="preuve-paiement">
              Preuve de paiement <span className="text-muted-foreground font-normal">(optionnel)</span>
            </Label>
            {preuvePreview ? (
              <div className="flex items-center gap-3">
                <img
                  src={preuvePreview}
                  alt="Aperçu de la preuve de paiement"
                  className="h-14 w-14 rounded-md object-cover border"
                />
                <Button type="button" variant="ghost" size="sm" onClick={clearPreuve}>
                  Retirer
                </Button>
              </div>
            ) : (
              <Input
                id="preuve-paiement"
                type="file"
                accept="image/*"
                onChange={handlePreuveChange}
              />
            )}
          </div>

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
