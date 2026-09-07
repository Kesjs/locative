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
    <div className="bg-blue-50/50 border border-blue-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
      {/* Header avec badge Loi 2022-30 */}
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-blue-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[12.5px] font-bold text-slate-900 leading-tight">
              Barème Légal Bénin (Loi n° 2022-30)
            </div>
            <div className="text-[11px] text-slate-500 leading-tight">
              Plafonnement des honoraires de gérance à 10%
            </div>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-blue-100 text-blue-800 border border-blue-200 shrink-0">
          <ShieldCheck className="w-3 h-3" /> Conforme
        </span>
      </div>

      {/* Cartouches de répartition */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Vos Honoraires (10%) */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
              Vos Honoraires (10%)
            </span>
            <HandCoins className="w-3.5 h-3.5 text-blue-700" />
          </div>
          <div className="text-[18px] font-extrabold text-slate-900 font-mono">
            {honoraires10.toLocaleString("fr-FR")}{" "}
            <span className="text-[12px] font-sans font-medium text-slate-500">FCFA</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Rémunération nette agence
          </div>
        </div>

        {/* Reversement Mandant (90%) */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              À Reverser (90%)
            </span>
            <span className="text-[11px] font-semibold text-slate-600 truncate max-w-[120px]">
              {mandantNom || "Propriétaire"}
            </span>
          </div>
          <div className="text-[18px] font-extrabold text-emerald-700 font-mono">
            {reversement90.toLocaleString("fr-FR")}{" "}
            <span className="text-[12px] font-sans font-medium text-slate-500">FCFA</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Montant viré chaque mois au mandant
          </div>
        </div>
      </div>
    </div>
  );
}
