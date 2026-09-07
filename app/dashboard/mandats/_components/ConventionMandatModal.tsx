"use client";

import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  FileCheck2,
  Printer,
  ShieldCheck,
  Building2,
  User,
  Scale,
  Calendar,
  X,
} from "lucide-react";
import type { Mandat } from "@/lib/hooks/useMandats";

interface ConventionMandatModalProps {
  isOpen: boolean;
  onClose: () => void;
  mandat: Mandat | null;
  agencyName?: string;
  agencyIfu?: string;
  agencyRccm?: string;
  agencyGerant?: string;
  agencyCity?: string;
  agencyAddress?: string;
  agencyCachet?: string;
}

export function ConventionMandatModal({
  isOpen,
  onClose,
  mandat,
  agencyName = "Cabinet Immobilier Lokka Gérance",
  agencyIfu = "02026119874523",
  agencyRccm = "RB/COT/26 B 18492",
  agencyGerant = "Direction de la Gestion Mandataire",
  agencyCity = "Cotonou",
  agencyAddress = "Boulevard de la Marina, Cotonou",
  agencyCachet,
}: ConventionMandatModalProps) {
  if (!mandat) return null;

  const commissionRate = mandat.commission || "10%";
  const dateCreation = mandat.created_at
    ? new Date(mandat.created_at).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : new Date().toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

  const referenceMandat = `MANDAT-2026-${mandat.id ? mandat.id.slice(0, 6).toUpperCase() : "BEN"}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="lg" className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 border-0 bg-transparent shadow-none">
        <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden print:border-0 print:shadow-none">
          {/* Top Bar Actions (hidden when printing) */}
          <div className="flex items-center justify-between px-6 py-4 bg-muted/60 border-b border-border print:hidden">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                Conforme Loi n° 2022-30 du Bénin
              </span>
              <span className="text-[12px] font-mono text-muted-foreground">{referenceMandat}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[12px] font-bold shadow-xs transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimer / Télécharger (PDF)</span>
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

          {/* Printable Document Body */}
          <div className="p-6 sm:p-10 space-y-8 bg-card text-foreground font-sans">
            {/* Header Officiel du Document */}
            <div className="border-b-2 border-border pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold text-base">
                    🏛️
                  </div>
                  <h2 className="text-[18px] font-extrabold text-foreground tracking-tight uppercase">
                    {agencyName}
                  </h2>
                </div>
                <p className="text-[12px] text-muted-foreground">
                  Administration de Biens &amp; Gérance Immobilière Agréée
                </p>
                <div className="text-[11.5px] text-muted-foreground space-y-0.5 pt-1">
                  <div><strong>IFU :</strong> {agencyIfu} · <strong>RCCM :</strong> {agencyRccm}</div>
                  <div><strong>Siège :</strong> {agencyAddress}, {agencyCity}</div>
                  <div><strong>Directeur d'Agence :</strong> {agencyGerant}</div>
                </div>
              </div>

              <div className="sm:text-right space-y-1 shrink-0">
                <div className="inline-block px-3 py-1 bg-blue-500/10 text-blue-700 dark:text-blue-400 font-mono text-[12px] font-bold rounded-lg border border-blue-500/20">
                  {referenceMandat}
                </div>
                <div className="text-[12px] text-muted-foreground">
                  Date d'effet : <strong>{dateCreation}</strong>
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Lieu : <strong>{agencyCity}, République du Bénin</strong>
                </div>
              </div>
            </div>

            {/* Titre Principal de la Convention */}
            <div className="text-center space-y-1.5 py-2">
              <h1 className="font-serif text-xl sm:text-2xl font-bold uppercase tracking-tight text-foreground">
                Convention de Mandat de Gérance Immobilière
              </h1>
              <p className="text-[12px] text-muted-foreground max-w-xl mx-auto italic">
                Établie en application stricte de la Loi n° 2022-30 du 20 décembre 2022 portant réglementation des baux à usage d'habitation et gestion des immeubles en République du Bénin.
              </p>
            </div>

            {/* Parties Contractantes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[12.5px]">
              {/* Le Mandataire */}
              <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-1.5">
                <div className="flex items-center gap-1.5 text-blue-600 font-bold uppercase tracking-wider text-[11px]">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Le Mandataire (L'Agence)</span>
                </div>
                <div className="font-bold text-foreground text-[13.5px]">{agencyName}</div>
                <div className="text-muted-foreground leading-relaxed">
                  Représenté légalement par <strong>{agencyGerant}</strong>, titulaire des garanties et autorisations légales d'exercice en République du Bénin.
                </div>
              </div>

              {/* Le Mandant */}
              <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-1.5">
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold uppercase tracking-wider text-[11px]">
                  <User className="w-3.5 h-3.5" />
                  <span>Le Mandant (Le Propriétaire)</span>
                </div>
                <div className="font-bold text-foreground text-[13.5px]">{mandat.proprietaire}</div>
                <div className="text-muted-foreground leading-relaxed">
                  Propriétaire légitime des biens désignés ci-après, agissant en qualité de bailleur mandant.
                  {mandat.telephone && <div>Tél. : {mandat.telephone}</div>}
                  {mandat.email && <div>Email : {mandat.email}</div>}
                </div>
              </div>
            </div>

            {/* Articles de la Convention */}
            <div className="space-y-4 text-[12.5px] text-muted-foreground leading-relaxed">
              {/* Article 1 */}
              <div className="p-4 rounded-xl bg-card border border-border space-y-1">
                <h3 className="font-bold text-foreground text-[13px] flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-blue-600" />
                  Article 1 : Objet du Mandat et Biens Confiés
                </h3>
                <p>
                  Le Mandant confie au Mandataire, qui l'accepte, le mandat exclusif d'administrer et gérer un portefeuille de <strong>{mandat.biens} lot(s)</strong> d'habitation ou commercial situés en République du Bénin.
                </p>
              </div>

              {/* Article 2 */}
              <div className="p-4 rounded-xl bg-card border border-border space-y-1">
                <h3 className="font-bold text-foreground text-[13px] flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
                  Article 2 : Missions et Pouvoirs du Mandataire
                </h3>
                <p>
                  Le Mandataire est expressément habilité à :
                </p>
                <ul className="list-disc list-inside space-y-0.5 pl-2 text-[12px]">
                  <li>Établir et signer les contrats de bail conformes aux dispositions légales de la Loi 2022-30 (caution plafonnée à 3 mois).</li>
                  <li>Percevoir et encaisser l'ensemble des loyers, charges et dépôts de garantie, notamment par Mobile Money (MTN MoMo, Moov Money) ou virement bancaire.</li>
                  <li>Délivrer aux locataires les quittances dématérialisées certifiées conformes.</li>
                  <li>Exercer toutes relances et poursuites nécessaires en cas de retard de paiement.</li>
                  <li>Faire exécuter les travaux urgents d'entretien et de réparations locatives nécessaires à la conservation du bien.</li>
                </ul>
              </div>

              {/* Article 3 */}
              <div className="p-4 rounded-xl bg-card border border-border space-y-1">
                <h3 className="font-bold text-foreground text-[13px] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  Article 3 : Rémunération Légale (Plafonnement 10% Loi 2022-30)
                </h3>
                <p>
                  Conformément au barème légal en vigueur au Bénin, la rémunération du Mandataire est fixée à <strong>{commissionRate}</strong> toutes taxes comprises des sommes effectivement recouvrées au titre des loyers.
                </p>
                <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Le Mandataire s'engage à reverser l'intégralité du solde net (90% des encaissements, déduction faite des éventuels frais de travaux validés) sur le compte bancaire ou Mobile Money du Mandant au plus tard le 10 de chaque mois civil.
                </p>
              </div>

              {/* Article 4 */}
              <div className="p-4 rounded-xl bg-card border border-border space-y-1">
                <h3 className="font-bold text-foreground text-[13px] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  Article 4 : Reddition des Comptes (Compte-Rendu de Gérance - CRG)
                </h3>
                <p>
                  Le Mandataire établit chaque mois un Compte-Rendu de Gérance (CRG) récapitulant l'état des encaissements, la liste des locataires à jour, les honoraires d'agence prélevés et le détail des reversements exécutés.
                </p>
              </div>
            </div>

            {/* Bloc Signatures et Cachet */}
            <div className="pt-6 border-t-2 border-border grid grid-cols-2 gap-8 text-[12.5px]">
              <div className="space-y-2">
                <div className="font-bold text-foreground uppercase tracking-wider text-[11px]">
                  Pour le Mandant (Le Propriétaire)
                </div>
                <div className="text-[11px] text-muted-foreground italic">
                  Mention manuscrite « Lu et approuvé, bon pour mandat de gérance »
                </div>
                <div className="h-24 border border-dashed border-border rounded-xl flex items-end p-2 text-[11px] text-muted-foreground">
                  Signature du Propriétaire
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-foreground uppercase tracking-wider text-[11px]">
                  Pour le Mandataire (L'Agence Agréée)
                </div>
                <div className="text-[11px] text-muted-foreground italic">
                  Cachet officiel et signature de la Direction
                </div>
                <div className="h-24 border border-dashed border-border rounded-xl relative flex items-center justify-center p-2 bg-muted/10">
                  {agencyCachet ? (
                    <img
                      src={agencyCachet}
                      alt="Cachet Agence"
                      className="max-h-20 object-contain mix-blend-multiply dark:mix-blend-screen opacity-90"
                    />
                  ) : (
                    <div className="text-center space-y-1">
                      <div className="inline-block border-2 border-blue-600 text-blue-700 dark:text-blue-400 font-bold text-[10.5px] uppercase tracking-widest px-3 py-1 rounded-md rotate-[-3deg]">
                        ★ {agencyName.slice(0, 24)} ★<br />
                        <span className="text-[9px] font-normal">DIRECTION DE LA GÉRANCE · AGRÉÉE LOI 2022-30</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Pied de page du document */}
            <div className="text-center pt-4 border-t border-border text-[10.5px] text-muted-foreground">
              Document officiel édité par Lokka · Conforme au Code Général des Impôts et à la Loi n° 2022-30 du Bénin · {referenceMandat}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
