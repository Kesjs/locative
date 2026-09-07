"use client";

import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  FileText,
  Printer,
  ShieldCheck,
  Building2,
  Landmark,
  HandCoins,
  CheckCircle2,
  Calendar,
  X,
} from "lucide-react";

export interface CrgData {
  mandantNom: string;
  bienNom: string;
  periode: string;
  loyerBrut: number;
  commission10: number;
  chargesTravaux: number;
  netReversed: number;
  statutVirement: "executé" | "en_attente";
  dateReglement?: string;
  referencePaiement?: string;
}

interface CrgModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CrgData | null;
  agencyName?: string;
  agencyIfu?: string;
  agencyRccm?: string;
  agencyAddress?: string;
  agencyCachet?: string;
}

export function CrgModal({
  isOpen,
  onClose,
  data,
  agencyName = "Cabinet Immobilier Lokka Gérance",
  agencyIfu = "02026119874523",
  agencyRccm = "RB/COT/26 B 18492",
  agencyAddress = "Cotonou, République du Bénin",
  agencyCachet,
}: CrgModalProps) {
  if (!data) return null;

  const handlePrint = () => {
    window.print();
  };

  const crgRef = `CRG-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="lg" className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 border-0 bg-transparent shadow-none">
        <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden print:border-0 print:shadow-none">
          {/* Top Bar Actions */}
          <div className="flex items-center justify-between px-6 py-4 bg-muted/60 border-b border-border print:hidden">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                CRG Certifié · Loi n° 2022-30
              </span>
              <span className="text-[12px] font-mono text-muted-foreground">{crgRef}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[12px] font-bold shadow-xs transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimer CRG (PDF)</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Document Body */}
          <div className="p-6 sm:p-8 space-y-6 bg-card text-foreground font-sans">
            {/* Header Officiel */}
            <div className="border-b-2 border-border pb-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold text-sm">
                    🏛️
                  </div>
                  <h3 className="text-[16px] font-extrabold text-foreground uppercase tracking-tight">
                    {agencyName}
                  </h3>
                </div>
                <div className="text-[11.5px] text-muted-foreground space-y-0.5 pt-1">
                  <div>IFU : {agencyIfu} · RCCM : {agencyRccm}</div>
                  <div>Siège : {agencyAddress}</div>
                </div>
              </div>

              <div className="sm:text-right space-y-1">
                <div className="inline-block px-2.5 py-1 bg-muted text-foreground font-mono text-[11px] font-bold rounded-lg border border-border">
                  {crgRef}
                </div>
                <div className="text-[12px] text-muted-foreground">
                  Période : <strong>{data.periode}</strong>
                </div>
              </div>
            </div>

            {/* Titre */}
            <div className="text-center space-y-1">
              <h2 className="font-serif text-lg sm:text-xl font-bold uppercase tracking-tight text-foreground">
                Compte-Rendu de Gérance Mensuel (CRG)
              </h2>
              <p className="text-[12px] text-muted-foreground">
                Reddition légale des comptes d'administration locative
              </p>
            </div>

            {/* Mandant & Lot */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-muted/30 border border-border text-[12px]">
              <div>
                <span className="text-muted-foreground block text-[11px]">Propriétaire Mandant :</span>
                <span className="font-bold text-foreground text-[13px]">{data.mandantNom}</span>
              </div>
              <div className="text-right sm:text-left">
                <span className="text-muted-foreground block text-[11px]">Lot / Ensemble géré :</span>
                <span className="font-bold text-foreground text-[13px]">{data.bienNom}</span>
              </div>
            </div>

            {/* Tableau Financier */}
            <div className="border border-border rounded-xl overflow-hidden text-[12.5px]">
              <div className="bg-muted/50 p-2.5 border-b border-border font-bold text-[11px] uppercase tracking-wider text-muted-foreground grid grid-cols-12">
                <div className="col-span-8">Désignation des opérations</div>
                <div className="col-span-4 text-right">Montant (FCFA)</div>
              </div>

              <div className="divide-y divide-border">
                <div className="p-3 grid grid-cols-12 items-center">
                  <div className="col-span-8">
                    <span className="font-semibold text-foreground">Loyer brut encaissé</span>
                    <span className="block text-[11px] text-muted-foreground">
                      Recouvrement certifié auprès du locataire ({data.periode})
                    </span>
                  </div>
                  <div className="col-span-4 text-right font-mono font-bold text-foreground">
                    {data.loyerBrut.toLocaleString("fr-FR")} FCFA
                  </div>
                </div>

                <div className="p-3 grid grid-cols-12 items-center bg-muted/10">
                  <div className="col-span-8">
                    <span className="font-semibold text-blue-600">Honoraires de gestion mandataire (10%)</span>
                    <span className="block text-[11px] text-muted-foreground">
                      Plafonnement légal Loi 2022-30 du Bénin
                    </span>
                  </div>
                  <div className="col-span-4 text-right font-mono font-semibold text-blue-600">
                    - {data.commission10.toLocaleString("fr-FR")} FCFA
                  </div>
                </div>

                {data.chargesTravaux > 0 && (
                  <div className="p-3 grid grid-cols-12 items-center">
                    <div className="col-span-8">
                      <span className="font-semibold text-foreground">Dépenses de maintenance / réparations</span>
                      <span className="block text-[11px] text-muted-foreground">
                        Travaux conservatoires validés
                      </span>
                    </div>
                    <div className="col-span-4 text-right font-mono font-semibold text-amber-600">
                      - {data.chargesTravaux.toLocaleString("fr-FR")} FCFA
                    </div>
                  </div>
                )}

                <div className="p-3.5 grid grid-cols-12 items-center bg-emerald-500/10 border-t-2 border-emerald-500/30">
                  <div className="col-span-8">
                    <span className="font-extrabold text-emerald-800 dark:text-emerald-300 text-[13.5px]">
                      Solde net reversé au mandant (90%)
                    </span>
                    <span className="block text-[11px] text-emerald-700 dark:text-emerald-400">
                      {data.statutVirement === "executé"
                        ? "Virement bancaire / Mobile Money exécuté avec succès"
                        : "Ordre de virement en attente de validation"}
                    </span>
                  </div>
                  <div className="col-span-4 text-right font-mono font-extrabold text-emerald-600 text-[16px]">
                    {data.netReversed.toLocaleString("fr-FR")} FCFA
                  </div>
                </div>
              </div>
            </div>

            {/* Cachet et visa */}
            <div className="pt-4 border-t border-border grid grid-cols-2 gap-6 text-[11.5px]">
              <div className="space-y-1">
                <span className="font-bold text-muted-foreground uppercase text-[10px]">
                  Attestation de conformité
                </span>
                <p className="text-muted-foreground leading-tight">
                  Le présent compte-rendu certifie l'exactitude des écritures et reversements pour le compte du mandant.
                </p>
              </div>

              <div className="text-right space-y-1">
                <span className="font-bold text-muted-foreground uppercase text-[10px]">
                  Cachet du Cabinet Mandataire
                </span>
                <div className="h-16 flex items-center justify-end">
                  {agencyCachet ? (
                    <img
                      src={agencyCachet}
                      alt="Cachet"
                      className="max-h-14 object-contain opacity-85"
                    />
                  ) : (
                    <div className="inline-block border border-blue-600 text-blue-700 dark:text-blue-400 px-2 py-1 rounded text-[10px] font-bold uppercase rotate-[-2deg]">
                      ★ {agencyName.slice(0, 20)} ★<br />CRG CERTIFIÉ
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
