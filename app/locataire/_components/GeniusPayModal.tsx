"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Download,
  CreditCard,
  Lock,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface GeniusPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  rentAmount: number;
  chargesAmount?: number;
  logementNom: string;
  leaseId?: string;
  bienId?: string;
  tenantName?: string;
  tenantEmail?: string;
  tenantPhone?: string;
  onPaymentSuccess?: (transaction: any) => void;
  onOpenReceipt?: (transaction: any) => void;
}

type Operator = "mtn" | "moov" | "wave";
type Step = "select" | "processing" | "success";

export function GeniusPayModal({
  isOpen,
  onClose,
  rentAmount,
  chargesAmount = 0,
  logementNom,
  leaseId,
  bienId,
  tenantName = "Locataire",
  tenantEmail,
  tenantPhone = "+229",
  onPaymentSuccess,
  onOpenReceipt,
}: GeniusPayModalProps) {
  const [operator, setOperator] = useState<Operator>("mtn");
  const [phone, setPhone] = useState(tenantPhone || "+229 97 00 00 00");
  const [step, setStep] = useState<Step>("select");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionData, setTransactionData] = useState<any>(null);

  const totalAmount = rentAmount + chargesAmount;

  const handleStartPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 8) {
      toast.error("Veuillez saisir un numéro de téléphone Mobile Money valide.");
      return;
    }

    setIsSubmitting(true);
    setStep("processing");

    try {
      const res = await fetch("/api/payments/geniuspay/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmount,
          customerPhone: phone,
          customerName: tenantName,
          customerEmail: tenantEmail,
          leaseId,
          bienId,
          period: new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" }),
          operator,
          description: `Loyer - ${logementNom}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Échec d'initialisation du paiement.");

      setTransactionData(data);

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
    } catch (err: any) {
      toast.error("Erreur de paiement", { description: err.message });
      setStep("select");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSimulatePinValidation = async () => {
    if (!transactionData?.transactionId) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/payments/geniuspay/confirm-simulated", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId: transactionData.transactionId }),
      });

      if (res.ok) {
        setStep("success");
        toast.success("Paiement validé avec succès par Genius Pay !");
        if (onPaymentSuccess) {
          onPaymentSuccess(transactionData);
        }
      }
    } catch (err) {
      toast.error("Erreur lors de la confirmation du paiement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setStep("select");
    setIsSubmitting(false);
    setTransactionData(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleResetAndClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white dark:bg-card border-border rounded-3xl shadow-2xl">
        {/* Header avec Dégradé Élégant */}
        <div className="p-5 sm:p-6 bg-emerald-700 text-white relative">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10.5px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
              Genius Pay · UEMOA
            </span>
            <span className="text-[11px] text-emerald-100 flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Chiffrement Bancaire 256-bit
            </span>
          </div>

          <DialogTitle className="font-serif text-2xl font-bold tracking-tight text-white">
            Règlement Sécurisé du Loyer
          </DialogTitle>
          <DialogDescription className="text-emerald-100 text-[12.5px] mt-0.5">
            {logementNom} · Échéance courante
          </DialogDescription>

          <div className="mt-4 pt-3 border-t border-emerald-600/60 flex items-baseline justify-between">
            <span className="text-[12px] text-emerald-200 uppercase font-semibold tracking-wider">
              Total à débiter
            </span>
            <div className="font-mono text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {totalAmount.toLocaleString("fr-FR")}{" "}
              <span className="text-base font-normal text-emerald-200">FCFA</span>
            </div>
          </div>
        </div>

        {/* Corps du Formulaire */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* ========================================================================= */}
          {/* ÉTAPE 1 : Choix de l'Opérateur et Numéro MoMo                              */}
          {/* ========================================================================= */}
          {step === "select" && (
            <form onSubmit={handleStartPayment} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Sélectionnez votre moyen de paiement
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setOperator("mtn")}
                    className={cn(
                      "p-3 rounded-2xl border text-left transition-all cursor-pointer relative",
                      operator === "mtn"
                        ? "bg-amber-500/10 border-amber-500 text-amber-950 dark:text-amber-200 shadow-2xs ring-1 ring-amber-500/30"
                        : "bg-muted/30 border-border text-muted-foreground hover:bg-muted/50"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[12.5px] font-bold">MTN Bénin</span>
                      <Smartphone className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="text-[11px] font-medium text-amber-800/80 dark:text-amber-400 mt-0.5">
                      MoMo (*880#)
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOperator("moov")}
                    className={cn(
                      "p-3 rounded-2xl border text-left transition-all cursor-pointer relative",
                      operator === "moov"
                        ? "bg-blue-500/10 border-blue-500 text-blue-950 dark:text-blue-200 shadow-2xs ring-1 ring-blue-500/30"
                        : "bg-muted/30 border-border text-muted-foreground hover:bg-muted/50"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[12.5px] font-bold">Moov Bénin</span>
                      <Smartphone className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-[11px] font-medium text-blue-800/80 dark:text-blue-400 mt-0.5">
                      Moov Money (*855#)
                    </div>
                  </button>
                </div>
              </div>

              {/* Champ Numéro Mobile Money */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Numéro de débit {operator === "mtn" ? "MTN MoMo" : "Moov Money"}
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+229 97 00 00 00"
                    className="w-full px-3.5 py-3 bg-card border border-border rounded-xl text-[14px] font-mono text-foreground outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 shadow-2xs"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[11px] font-bold text-muted-foreground">
                    Bénin (+229)
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Un pop-up USSD de débit sera automatiquement envoyé sur ce numéro.
                </p>
              </div>

              {/* Bouton de Validation */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[14px] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                <span>Déclencher le paiement de {totalAmount.toLocaleString("fr-FR")} FCFA</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* ========================================================================= */}
          {/* ÉTAPE 2 : Traitement et Attente Validation Téléphone (USSD Prompt)         */}
          {/* ========================================================================= */}
          {step === "processing" && (
            <div className="py-6 text-center space-y-5 animate-in fade-in duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center mx-auto text-emerald-600 shadow-md">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>

              <div className="space-y-1.5 max-w-xs mx-auto">
                <h3 className="font-serif text-lg font-bold text-foreground">
                  Invite de Débit en Cours…
                </h3>
                <p className="text-[12.5px] text-muted-foreground leading-relaxed">
                  Vérifiez votre téléphone <strong>{phone}</strong>. Saisissez votre <strong>code secret MoMo</strong> pour autoriser le transfert de{" "}
                  <strong>{totalAmount.toLocaleString("fr-FR")} FCFA</strong>.
                </p>
              </div>

              {/* Simulation Sandbox / Mode Test */}
              <div className="p-4 bg-muted/40 border border-border rounded-2xl space-y-2.5">
                <span className="text-[11px] font-bold uppercase text-emerald-700 dark:text-emerald-400 block tracking-wider">
                  Environnement Bac à Sable (Test Instantané)
                </span>
                <p className="text-[11px] text-muted-foreground">
                  Vous testez actuellement la passerelle ? Cliquez ci-dessous pour simuler la validation instantanée de votre code PIN :
                </p>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSimulatePinValidation}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[12.5px] font-bold transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Valider le prélèvement MoMo (Simulé)</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ÉTAPE 3 : Succès & Quittance Certifiée Immédiate                           */}
          {/* ========================================================================= */}
          {step === "success" && (
            <div className="py-4 text-center space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto text-emerald-600 shadow-md">
                <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
              </div>

              <div className="space-y-1">
                <h3 className="font-serif text-xl font-bold text-foreground">
                  Paiement Confirmé avec Succès !
                </h3>
                <p className="text-[12.5px] text-muted-foreground">
                  Votre loyer de <strong>{totalAmount.toLocaleString("fr-FR")} FCFA</strong> a été validé par Genius Pay. Votre quittance officielle certifiée conforme Loi 2022-30 est prête.
                </p>
              </div>

              <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center justify-between text-left">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                    Référence Genius Pay
                  </span>
                  <span className="font-mono text-[12.5px] font-bold text-emerald-950">
                    {transactionData?.transactionId || "GP-LOK-VERIFIED"}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Payé
                </span>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    handleResetAndClose();
                    if (onOpenReceipt) onOpenReceipt(transactionData);
                  }}
                  className="w-full py-3 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[13.5px] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Télécharger ma Quittance Certifiée (PDF)</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full py-2.5 px-4 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-[12.5px] font-bold transition-all border border-border cursor-pointer"
                >
                  Fermer et revenir au tableau de bord
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
