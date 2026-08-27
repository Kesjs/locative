"use client";

import { useState } from "react";
import Header from "@/components/dashboard/Header";
import { NumberTicker } from "@/components/ui/number-ticker";
import { BorderBeam } from "@/components/ui/border-beam";
import {
  ArrowDownTrayIcon,
  CalculatorIcon,
  ShieldCheckIcon,
  DocumentCheckIcon,
  BuildingOffice2Icon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";

export default function AccountingPage() {
  const [selectedYear, setSelectedYear] = useState("2026");

  const accountingLines = [
    {
      label: "Loyers bruts encaissés (Total annuel)",
      val: 58200000,
      note: "Total des encaissements Mobile Money & Virements",
      type: "income",
    },
    {
      label: "Dépenses d'entretien, plomberie et réfection",
      val: 3450000,
      note: "Travaux d'urgence et rénovations justifiées",
      type: "expense",
    },
    {
      label: "Charges de gardiennage et entretien parties communes",
      val: 2800000,
      note: "Contrats prestataires et sécurité",
      type: "expense",
    },
    {
      label: "Commissions de gestion d'agence (Plafonné à 10% — Loi 2022-30)",
      val: 5820000,
      note: "Honoraires de gestion mandataire déductibles",
      type: "expense",
    },
    {
      label: "Taxe Foncière Unique estimée (TFU DGI Bénin)",
      val: 2910000,
      note: "Estimation fiscale conforme au Code Général des Impôts",
      type: "tax",
    },
  ];

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto pb-10">
      <Header
        title="Comptabilité & Fiscalité"
        subtitle="Bilan financier, charges d'entretien et estimation officielle TFU DGI Bénin."
      />

      {/* 3 Summary Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[12px] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-[12px] text-[var(--text-secondary)] font-medium mb-1">
              Revenus bruts perçus (YTD {selectedYear})
            </div>
            <div className="text-[26px] font-extrabold text-[var(--text-primary)] tracking-tight mb-2 flex items-baseline gap-1">
              <NumberTicker value={58200000} />
              <span className="text-[14px] font-semibold text-[var(--text-secondary)]">FCFA</span>
            </div>
          </div>
          <div className="pt-2 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-secondary)]">
            100% des loyers enregistrés avec reçu
          </div>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[12px] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-[12px] text-[var(--text-secondary)] font-medium mb-1">
              Charges &amp; Réparations déductibles
            </div>
            <div className="text-[26px] font-extrabold text-[var(--text-primary)] tracking-tight mb-2 flex items-baseline gap-1">
              <NumberTicker value={6250000} />
              <span className="text-[14px] font-semibold text-[var(--text-secondary)]">FCFA</span>
            </div>
          </div>
          <div className="pt-2 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-secondary)]">
            10.7% du chiffre d&apos;affaires brut
          </div>
        </div>

        <div className="relative bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[12px] p-5 shadow-xs flex flex-col justify-between overflow-hidden">
          <BorderBeam size={160} duration={12} colorFrom="#C5A880" colorTo="#FAF9F6" />
          <div>
            <div className="text-[12px] text-[var(--text-secondary)] font-medium mb-1">
              Revenu net foncier estimé
            </div>
            <div className="text-[26px] font-extrabold text-[var(--text-primary)] tracking-tight mb-2 flex items-baseline gap-1">
              <NumberTicker value={51950000} className="text-[var(--text-primary)]" />
              <span className="text-[14px] font-semibold text-[var(--text-secondary)]">FCFA</span>
            </div>
          </div>
          <div className="pt-2 border-t border-[var(--border-subtle)] text-[11px] text-[#22C55E] font-bold">
            Marge nette d&apos;exploitation : 89.3%
          </div>
        </div>
      </div>

      {/* Main Breakdown Section */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[12px] p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border-default)] mb-5">
          <div>
            <h3 className="text-[17px] font-bold text-[var(--text-primary)]">
              Synthèse Comptable &amp; Déclaration TFU {selectedYear}
            </h3>
            <p className="text-[12px] text-[var(--text-secondary)]">
              Ventilation des postes conforme aux règles fiscales de la République du Bénin
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-[6px] bg-[var(--bg-canvas)] border border-[var(--border-default)] p-0.5">
              {["2024", "2025", "2026"].map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setSelectedYear(yr)}
                  className={`px-3 py-1 text-[11px] font-semibold rounded-[4px] transition cursor-pointer ${
                    selectedYear === yr
                      ? "bg-[var(--color-brand-primary)] text-[var(--text-inverse)] shadow-xs"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => alert("Génération du bilan certifié PDF...")}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[var(--color-brand-primary)] hover:bg-[#F5F5DC] hover:text-[var(--text-primary)] hover:border-[var(--border-default)] border border-transparent text-[var(--text-inverse)] text-[12px] font-semibold rounded-[6px] transition cursor-pointer"
            >
              <ArrowDownTrayIcon className="h-3.5 w-3.5" />
              <span>Exporter le bilan annuel (PDF)</span>
            </button>
          </div>
        </div>

        <div className="space-y-2.5">
          {accountingLines.map((item, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-[8px] bg-[var(--bg-canvas)] border border-[var(--border-default)] gap-2 hover:border-[#1C1C1C] transition-colors"
            >
              <div>
                <span className="font-semibold text-[var(--text-primary)] text-[13px] block">
                  {item.label}
                </span>
                <span className="text-[11px] text-[var(--text-secondary)]">{item.note}</span>
              </div>
              <div className="text-right shrink-0">
                <span
                  className={`text-[15px] font-bold ${
                    item.type === "income"
                      ? "text-[var(--text-primary)]"
                      : item.type === "tax"
                      ? "text-[#E67700]"
                      : "text-[var(--text-secondary)]"
                  }`}
                >
                  {item.type === "expense" && "- "}
                  {item.val.toLocaleString("fr-FR")} FCFA
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 p-4 rounded-[8px] bg-[var(--bg-canvas)] border border-[var(--border-default)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-[var(--bg-surface)] border border-[var(--border-default)] flex items-center justify-center text-[var(--text-primary)] shrink-0">
              <ShieldCheckIcon className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[13px] font-bold text-[var(--text-primary)]">
                Calcul certifié conforme Loi n° 2022-30 &amp; Code Général des Impôts
              </div>
              <div className="text-[11px] text-[var(--text-secondary)]">
                TFU déclarable en ligne auprès de la Direction Générale des Impôts (DGI Bénin)
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => alert("Ouverture du portail télépaiement DGI Bénin...")}
            className="px-3.5 py-1.5 bg-[var(--bg-surface)] hover:bg-[var(--bg-canvas)] border border-[var(--border-default)] text-[var(--text-primary)] text-[12px] font-semibold rounded-[6px] shadow-2xs transition cursor-pointer shrink-0"
          >
            Guide Télédéclaration DGI →
          </button>
        </div>
      </div>
    </div>
  );
}
