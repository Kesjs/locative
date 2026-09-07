"use client";

import React from "react";
import { HandCoins, ArrowRight, ShieldCheck, Scale } from "lucide-react";

interface AgencyCalculatorPreviewProps {
  loyer: number;
  mandantNom?: string;
}

export function AgencyCalculatorPreview({
  loyer,
  mandantNom,
}: AgencyCalculatorPreviewProps) {
  const safeLoyer = Math.max(0, Number(loyer) || 0);
  const honoraires10 = Math.round(safeLoyer * 0.1);
  const reversement90 = safeLoyer - honoraires10;

  if (safeLoyer === 0) return null;

  return (
    <div className="bg-card/80 border border-blue-500/30 dark:border-blue-400/25 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
      {/* Header avec badge Loi 2022-30 */}
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[12.5px] font-bold text-foreground leading-tight">
              Barème Légal Bénin (Loi n° 2022-30)
            </div>
            <div className="text-[11px] text-muted-foreground leading-tight">
              Plafonnement des honoraires de gérance à 10%
            </div>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/25 shrink-0">
          <ShieldCheck className="w-3 h-3" /> Conforme
        </span>
      </div>

      {/* Cartouches de répartition */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Vos Honoraires (10%) */}
        <div className="bg-muted/40 dark:bg-muted/20 p-3.5 rounded-xl border border-border space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Vos Honoraires (10%)
            </span>
            <HandCoins className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-[18px] font-extrabold text-foreground font-mono">
            {honoraires10.toLocaleString("fr-FR")}{" "}
            <span className="text-[12px] font-sans font-medium text-muted-foreground">FCFA</span>
          </div>
          <div className="text-[11px] text-muted-foreground">
            Rémunération nette agence
          </div>
        </div>

        {/* Reversement Mandant (90%) */}
        <div className="bg-muted/40 dark:bg-muted/20 p-3.5 rounded-xl border border-border space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              À Reverser (90%)
            </span>
            <span className="text-[11px] font-semibold text-muted-foreground truncate max-w-[120px]">
              {mandantNom || "Propriétaire"}
            </span>
          </div>
          <div className="text-[18px] font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
            {reversement90.toLocaleString("fr-FR")}{" "}
            <span className="text-[12px] font-sans font-medium text-muted-foreground">FCFA</span>
          </div>
          <div className="text-[11px] text-muted-foreground">
            Montant viré chaque mois au mandant
          </div>
        </div>
      </div>
    </div>
  );
}
