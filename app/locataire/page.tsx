"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Wallet,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Smartphone,
  Landmark,
  ArrowRight,
  ShieldCheck,
  Clock,
  MessageSquare,
  X,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function MonLoyerPage() {
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState<"mtn" | "moov">("mtn");
  const [copiedNumber, setCopiedNumber] = useState(false);

  // Données dynamiques du bail locataire
  const { data: rentInfo, isLoading } = useQuery({
    queryKey: ["locataire-loyer-status"],
    queryFn: async () => {
      // Simule chargement réel ou récupération locale/Supabase
      await new Promise((r) => setTimeout(r, 300));
      return {
        montantLoyer: 150000,
        charges: 10000,
        totalDu: 160000,
        echeanceDate: "05/10/2026",
        moisConcerne: "Septembre 2026",
        statut: "a_payer" as "a_payer" | "a_jour",
        bailleurNom: "Patrimoine Lokka (Gestionnaire)",
        bailleurMomoMtn: "+229 97 00 11 22",
        bailleurMoov: "+229 95 00 33 44",
        bailleurWhatsapp: "22997001122",
        logementNom: "Villa Les Cocotiers - Apt 2B",
      };
    },
  });

  const handleCopyNumber = (num: string) => {
    navigator.clipboard.writeText(num.replace(/[^0-9+]/g, ""));
    setCopiedNumber(true);
    toast.success("Numéro de paiement copié !");
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleNotifyWhatsapp = () => {
    if (!rentInfo) return;
    const msg = encodeURIComponent(
      `Bonjour ${rentInfo.bailleurNom},\nJe viens d'effectuer le règlement de mon loyer de ${rentInfo.totalDu.toLocaleString("fr-FR")} FCFA pour "${rentInfo.logementNom}" via ${selectedOperator === "mtn" ? "MTN MoMo" : "Moov Money"}.\nMerci de valider et d'émettre la quittance certifiée Lokka.\nBien cordialement.`
    );
    window.open(`https://wa.me/${rentInfo.bailleurWhatsapp}?text=${msg}`, "_blank");
    toast.success("Discussion WhatsApp ouverte avec le bailleur !");
    setIsPayModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-28 bg-muted/60 animate-pulse rounded-2xl" />
        <div className="h-64 bg-muted/60 animate-pulse rounded-2xl" />
      </div>
    );
  }

  if (!rentInfo) return null;

  const isUpToDate = rentInfo.statut === "a_jour";

  return (
    <div className="space-y-6">
      {/* ── HEADER ÉDITORIAL ── */}
      <div className="p-5 sm:p-6 bg-card border border-border rounded-2xl shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            {rentInfo.logementNom}
          </span>
          <span className="text-[11px] text-muted-foreground font-medium">Bail en cours</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-normal text-foreground tracking-tight">
          Mon Loyer &amp; Échéances
        </h1>
        <p className="text-[13px] text-muted-foreground mt-0.5">
          Suivi de votre situation locative, règlement direct Mobile Money et téléchargement des quittances certifiées.
        </p>
      </div>

      {/* ── CARTE MAÎTRESSE : STATUT DU LOYER ── */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden shadow-xs">
        <div className="max-w-md mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wide bg-muted border border-border text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>Échéance {rentInfo.moisConcerne}</span>
          </div>

          <div>
            <div className="text-[13px] text-muted-foreground font-medium mb-1">
              Montant total exigible (Loyer + Charges)
            </div>
            <div className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
              {rentInfo.totalDu.toLocaleString("fr-FR")}{" "}
              <span className="text-xl sm:text-2xl font-sans font-semibold text-muted-foreground">
                FCFA
              </span>
            </div>
            <div className="text-[12px] text-muted-foreground mt-1">
              Détail : {rentInfo.montantLoyer.toLocaleString("fr-FR")} FCFA (loyer) + {rentInfo.charges.toLocaleString("fr-FR")} FCFA (charges)
            </div>
          </div>

          {isUpToDate ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 flex items-center justify-center gap-2 font-bold text-[14px]">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Votre loyer est entièrement à jour</span>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-[13px] flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>À régler au plus tard le <strong>{rentInfo.echeanceDate}</strong></span>
              </div>

              <button
                type="button"
                onClick={() => setIsPayModalOpen(true)}
                className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[15px] font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Smartphone className="w-5 h-5" />
                <span>Payer via Mobile Money</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── ACCÈS RAPIDES UTILES ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/locataire/quittances"
          className="p-5 bg-card border border-border rounded-2xl hover:border-emerald-500/40 transition-all flex items-center justify-between group shadow-xs"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-[14px] text-foreground">Mes Quittances Certifiées</div>
              <div className="text-[12px] text-muted-foreground">Télécharger vos reçus officiels Loi 2022-30</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/locataire/assistance"
          className="p-5 bg-card border border-border rounded-2xl hover:border-emerald-500/40 transition-all flex items-center justify-between group shadow-xs"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-700 dark:text-blue-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-[14px] text-foreground">Signaler une Panne</div>
              <div className="text-[12px] text-muted-foreground">Demande d'intervention SBEE, SONEB ou serrurerie</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      {/* ── MODALE DE PAIEMENT MOBILE MONEY DIRECT ── */}
      <Dialog open={isPayModalOpen} onOpenChange={setIsPayModalOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl font-normal text-foreground">
              Paiement Mobile Money
            </DialogTitle>
            <p className="text-[13px] text-muted-foreground">
              Réglez votre loyer de <strong>{rentInfo.totalDu.toLocaleString("fr-FR")} FCFA</strong> directement sur le compte de votre bailleur.
            </p>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* Sélecteur Opérateur */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedOperator("mtn")}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedOperator === "mtn"
                    ? "bg-amber-500/10 border-amber-500 text-amber-900 dark:text-amber-200 font-bold"
                    : "bg-muted/30 border-border text-muted-foreground"
                }`}
              >
                <div className="text-[12px] uppercase tracking-wider font-bold">MTN Bénin</div>
                <div className="text-[13px] font-semibold mt-0.5">Mobile Money</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedOperator("moov")}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedOperator === "moov"
                    ? "bg-blue-500/10 border-blue-500 text-blue-900 dark:text-blue-200 font-bold"
                    : "bg-muted/30 border-border text-muted-foreground"
                }`}
              >
                <div className="text-[12px] uppercase tracking-wider font-bold">Moov Bénin</div>
                <div className="text-[13px] font-semibold mt-0.5">Moov Money (Flooz)</div>
              </button>
            </div>

            {/* Numéro Marchand / Réception du Bailleur */}
            <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2">
              <span className="text-[11.5px] font-bold uppercase tracking-wider text-muted-foreground block">
                Numéro de réception du bailleur
              </span>
              <div className="flex items-center justify-between">
                <span className="font-mono text-lg font-bold text-foreground">
                  {selectedOperator === "mtn" ? rentInfo.bailleurMomoMtn : rentInfo.bailleurMoov}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyNumber(selectedOperator === "mtn" ? rentInfo.bailleurMomoMtn : rentInfo.bailleurMoov)}
                  className="px-2.5 py-1.5 rounded-lg bg-card hover:bg-muted border border-border text-[12px] font-bold text-foreground inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  {copiedNumber ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedNumber ? "Copié" : "Copier"}</span>
                </button>
              </div>
              <p className="text-[11.5px] text-muted-foreground">
                Titulaire : {rentInfo.bailleurNom}
              </p>
            </div>

            {/* Bouton d'envoi de confirmation WhatsApp */}
            <button
              type="button"
              onClick={handleNotifyWhatsapp}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[13.5px] font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Confirmer le virement sur WhatsApp</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
