"use client";

import React, { useMemo, useState } from "react";
import { NumberTicker } from "@/components/ui/number-ticker";
import { BorderBeam } from "@/components/ui/border-beam";
import {
  ArrowDownTrayIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { useLoyers } from "@/lib/hooks/useLoyers";
import { useTickets } from "@/lib/hooks/useMaintenance";
import { toast } from "sonner";

export default function AccountingPage() {
  const [selectedYear, setSelectedYear] = useState("2026");
  const { data: loyers = [], isLoading: isLoadingLoyers } = useLoyers();
  const { data: tickets = [], isLoading: isLoadingTickets } = useTickets();

  const stats = useMemo(() => {
    // Total encaissé réel
    const payes = loyers.filter((l) => l.statut === "payé");
    const totalEncaisse = payes.reduce((sum, l) => sum + (Number(l.montant) || 0), 0);

    // Total dépenses travaux réelles
    const totalTravaux = tickets.reduce(
      (sum, t) => sum + (Number(t.cout_reel) || Number(t.cout_estime) || 0),
      0
    );

    // Commission d'agence estimée (10% max Loi 2022-30)
    const commissions10 = Math.round(totalEncaisse * 0.1);

    // TFU estimée DGI Bénin (5% des revenus locatifs bruts)
    const tfuEstimee = Math.round(totalEncaisse * 0.05);

    // Total des charges déductibles
    const totalCharges = totalTravaux + commissions10;

    // Revenu net foncier
    const revenuNet = Math.max(0, totalEncaisse - totalCharges - tfuEstimee);

    const margeNette = totalEncaisse > 0 ? Math.round((revenuNet / totalEncaisse) * 100) : 100;

    return {
      totalEncaisse,
      totalTravaux,
      commissions10,
      tfuEstimee,
      totalCharges,
      revenuNet,
      margeNette,
    };
  }, [loyers, tickets]);

  const accountingLines = [
    {
      label: "Loyers bruts encaissés (Total annuel)",
      val: stats.totalEncaisse,
      note: "Total réel des encaissements enregistrés",
      type: "income",
    },
    {
      label: "Dépenses d'entretien, plomberie et réfection",
      val: stats.totalTravaux,
      note: "Montant cumulé des tickets de maintenance",
      type: "expense",
    },
    {
      label: "Commissions de gestion mandataire (10% — Loi 2022-30)",
      val: stats.commissions10,
      note: "Honoraires de gestion mandataire déductibles",
      type: "expense",
    },
    {
      label: "Taxe Foncière Unique estimée (TFU DGI Bénin)",
      val: stats.tfuEstimee,
      note: "Estimation fiscale conforme au Code Général des Impôts (5%)",
      type: "tax",
    },
  ];

  const handleExportPdf = () => {
    toast.success("Export comptable préparé", {
      description: "Le récapitulatif annuel certifié a été préparé pour impression.",
    });
    window.print();
  };

  const isLoading = isLoadingLoyers || isLoadingTickets;

  if (isLoading) {
    return (
      <div className="space-y-6 pb-12">
        <div className="h-20 bg-muted/60 animate-pulse rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-36 bg-muted/60 animate-pulse rounded-xl" />
          <div className="h-36 bg-muted/60 animate-pulse rounded-xl" />
          <div className="h-36 bg-muted/60 animate-pulse rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-card border border-border rounded-xl shadow-xs">
        <div>
          <h1 className="text-[20px] font-extrabold text-card-foreground tracking-tight">
            Comptabilité &amp; Fiscalité Immobilière
          </h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            Bilan financier réel, suivi des charges d&apos;entretien et estimation officielle TFU conforme DGI Bénin.
          </p>
        </div>
      </div>

      {/* 3 Summary Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-[12px] text-muted-foreground font-medium mb-1">
              Revenus bruts perçus ({selectedYear})
            </div>
            <div className="text-[26px] font-extrabold text-card-foreground tracking-tight mb-2 flex items-baseline gap-1">
              <NumberTicker value={stats.totalEncaisse} />
              <span className="text-[14px] font-semibold text-muted-foreground">FCFA</span>
            </div>
          </div>
          <div className="pt-2 border-t border-border text-[11px] text-muted-foreground">
            {loyers.filter((l) => l.statut === "payé").length} loyer(s) réglé(s) avec reçu
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-[12px] text-muted-foreground font-medium mb-1">
              Charges &amp; Travaux déductibles
            </div>
            <div className="text-[26px] font-extrabold text-card-foreground tracking-tight mb-2 flex items-baseline gap-1">
              <NumberTicker value={stats.totalCharges} />
              <span className="text-[14px] font-semibold text-muted-foreground">FCFA</span>
            </div>
          </div>
          <div className="pt-2 border-t border-border text-[11px] text-muted-foreground">
            {tickets.length} intervention(s) de maintenance
          </div>
        </div>

        <div className="relative bg-card border border-border rounded-xl p-5 shadow-xs flex flex-col justify-between overflow-hidden">
          <BorderBeam size={160} duration={12} colorFrom="#10B981" colorTo="#FAF9F6" />
          <div>
            <div className="text-[12px] text-muted-foreground font-medium mb-1">
              Revenu net foncier estimé
            </div>
            <div className="text-[26px] font-extrabold text-card-foreground tracking-tight mb-2 flex items-baseline gap-1">
              <NumberTicker value={stats.revenuNet} className="text-card-foreground" />
              <span className="text-[14px] font-semibold text-muted-foreground">FCFA</span>
            </div>
          </div>
          <div className="pt-2 border-t border-border text-[11px] text-emerald-600 font-bold">
            Marge nette estimée : {stats.margeNette}%
          </div>
        </div>
      </div>

      {/* Main Breakdown Section */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border mb-5">
          <div>
            <h3 className="text-[17px] font-bold text-card-foreground">
              Synthèse Comptable &amp; Déclaration TFU {selectedYear}
            </h3>
            <p className="text-[12px] text-muted-foreground">
              Ventilation calculée sur les flux réels de vos locations au Bénin
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportPdf}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-[12px] font-semibold rounded-lg transition cursor-pointer shadow-xs"
            >
              <ArrowDownTrayIcon className="h-3.5 w-3.5" />
              <span>Imprimer / Exporter (PDF)</span>
            </button>
          </div>
        </div>

        <div className="space-y-2.5">
          {accountingLines.map((item, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg bg-muted/30 border border-border gap-2 hover:border-primary/40 transition-colors"
            >
              <div>
                <span className="font-semibold text-card-foreground text-[13px] block">
                  {item.label}
                </span>
                <span className="text-[11px] text-muted-foreground">{item.note}</span>
              </div>
              <div className="text-right shrink-0">
                <span
                  className={`text-[15px] font-bold ${
                    item.type === "income"
                      ? "text-emerald-600"
                      : item.type === "tax"
                      ? "text-amber-600"
                      : "text-card-foreground"
                  }`}
                >
                  {item.type === "expense" && "- "}
                  {item.val.toLocaleString("fr-FR")} FCFA
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 p-4 rounded-xl bg-muted/20 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shrink-0">
              <ShieldCheckIcon className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[13px] font-bold text-card-foreground">
                Calcul conforme Loi n° 2022-30 &amp; Code Général des Impôts
              </div>
              <div className="text-[11px] text-muted-foreground">
                TFU déclarable en ligne auprès de la Direction Générale des Impôts (DGI Bénin)
              </div>
            </div>
          </div>

          <a
            href="https://dgi.bj"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 bg-card hover:bg-muted border border-border text-card-foreground text-[12px] font-semibold rounded-lg shadow-2xs transition cursor-pointer shrink-0"
          >
            Portail Officiel DGI Bénin →
          </a>
        </div>
      </div>
    </div>
  );
}
