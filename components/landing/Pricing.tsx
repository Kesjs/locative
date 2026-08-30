"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  CheckIcon,
  SparklesIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MinusIcon,
} from "@heroicons/react/24/outline";

interface FeatureRow {
  name: string;
  decouverte: string | boolean;
  pro: string | boolean;
  diaspora: string | boolean;
  agence: string | boolean;
}

interface Plan {
  name: string;
  monthlyPrice: string;
  annualPrice: string;
  period: string;
  annualDetail: string;
  description: string;
  bienLabel: string;
  features: string[];
  cta: string;
  popular: boolean;
  badgeLabel?: string;
}

// SOURCE UNIQUE DE DONNÉES — cards ET tableau comparatif sont générés à partir
// de ce seul tableau (spec section 19 : "il ne doit jamais exister deux
// sources différentes pour les prix ou fonctionnalités").
const PLANS: Plan[] = [
  {
    name: "Découverte",
    monthlyPrice: "0 FCFA",
    annualPrice: "0 FCFA",
    period: "",
    annualDetail: "Gratuit pour démarrer",
    description: "Pour découvrir Lokka avec 1 ou 2 logements, sans engagement.",
    bienLabel: "Jusqu'à 2 biens",
    features: [
      "Gestion des locataires",
      "Gestion des baux",
      "Quittances PDF",
      "Accès portail locataire",
    ],
    cta: "Créer mon compte gratuit",
    popular: false,
  },
  {
    name: "Bailleur Pro",
    monthlyPrice: "5 000 FCFA",
    annualPrice: "4 200 FCFA",
    period: "/mois",
    annualDetail: "50 000 FCFA facturés par an (2 mois offerts)",
    description: "Pour les bailleurs indépendants qui gèrent leur propre patrimoine.",
    bienLabel: "Jusqu'à 10 biens",
    features: [
      "Quittances illimitées",
      "Mobile Money",
      "Suivi des paiements",
      "Publication sur la vitrine Lokka",
      "Vitrine dédiée",
      "Relances",
      "Statistiques",
      "Partage WhatsApp",
    ],
    cta: "Démarrer l'essai 14 jours",
    popular: true,
    badgeLabel: "Le Plus Populaire",
  },
  {
    name: "Diaspora & Patrimoine",
    monthlyPrice: "12 000 FCFA",
    annualPrice: "10 000 FCFA",
    period: "/mois",
    annualDetail: "120 000 FCFA facturés par an (2 mois offerts)",
    description: "Pour les propriétaires vivant à l'étranger qui suivent leur patrimoine à distance.",
    bienLabel: "Jusqu'à 30 biens",
    features: [
      "Dashboard patrimoine",
      "Suivi à distance",
      "Alertes",
      "Suivi des encaissements",
      "Gestion des visites",
      "États des lieux",
      "Rapports",
      "Export fiscal",
    ],
    cta: "Choisir Diaspora & Patrimoine",
    popular: false,
  },
  {
    name: "Agence & Conciergerie",
    monthlyPrice: "25 000 FCFA",
    annualPrice: "20 800 FCFA",
    period: "/mois",
    annualDetail: "250 000 FCFA facturés par an (2 mois offerts)",
    description: "Pour les agences immobilières et gestionnaires multi-mandants.",
    bienLabel: "Biens illimités",
    features: [
      "Multi-propriétaires",
      "Mandats",
      "Équipe",
      "Rôles et permissions",
      "Commissions",
      "Reporting",
      "Vitrine professionnelle",
      "Domaine personnalisé",
      "Support prioritaire",
    ],
    cta: "Choisir le Plan Agence",
    popular: false,
  },
];

// Le tableau comparatif est dérivé de PLANS : union ordonnée de tous les
// libellés (bienLabel + features), un seul passage, aucune donnée ajoutée.
function buildComparisonRows(): FeatureRow[] {
  const rows: FeatureRow[] = [
    {
      name: "Nombre de biens",
      decouverte: PLANS[0].bienLabel,
      pro: PLANS[1].bienLabel,
      diaspora: PLANS[2].bienLabel,
      agence: PLANS[3].bienLabel,
    },
  ];

  const seen = new Set<string>();
  PLANS.forEach((plan) => {
    plan.features.forEach((label) => {
      if (seen.has(label)) return;
      seen.add(label);
      rows.push({
        name: label,
        decouverte: PLANS[0].features.includes(label),
        pro: PLANS[1].features.includes(label),
        diaspora: PLANS[2].features.includes(label),
        agence: PLANS[3].features.includes(label),
      });
    });
  });

  return rows;
}

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [showComparison, setShowComparison] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const comparisonRows = React.useMemo(() => buildComparisonRows(), []);

  return (
    <section ref={sectionRef} id="pricing" className="py-24 sm:py-32 bg-[#FAF9F6] border-t border-[#E8E5E0]">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <div className="section-label mb-3 text-[#1C1C1C]">Tarifs Clairs &amp; Adaptés</div>
          <h2 className="heading-2 mb-4 text-[#1C1C1C]">Une tarification transparente en FCFA</h2>
          <p className="body-text text-base sm:text-lg text-[#64635F]">
            Rentabilisé dès le premier mois grâce aux retards éliminés et à votre site vitrine clé en main.
          </p>

          {/* Billing Cycle Toggle Switch */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <span className={`text-[13px] font-bold ${!isAnnual ? "text-[#1C1C1C]" : "text-[#9C9A95]"}`}>
              Mensuel
            </span>

            <button
              type="button"
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none cursor-pointer"
              style={{ backgroundColor: isAnnual ? "#1C1C1C" : "#E8E5E0" }}
            >
              <motion.span
                animate={{ x: isAnnual ? 30 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="inline-block h-6 w-6 rounded-full bg-white shadow-xs"
              />
            </button>

            <div className="flex items-center gap-2">
              <span className={`text-[13px] font-bold ${isAnnual ? "text-[#1C1C1C]" : "text-[#9C9A95]"}`}>
                Annuel
              </span>
              <span className="inline-flex items-center rounded-full bg-[#F3F2EE] border border-[#E8E5E0] px-2.5 py-0.5 text-[11px] font-bold text-[#1C1C1C]">
                Jusqu'à 2 mois offerts
              </span>
            </div>
          </div>
        </motion.div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch mb-12">
          {PLANS.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex flex-col justify-between p-6 sm:p-7 rounded-[10px] transition-all duration-300 group hover:-translate-y-1"
              style={{
                backgroundColor: plan.popular ? "#1C1C1C" : "#FFFFFF",
                border: plan.popular ? "1px solid #1C1C1C" : "1px solid #E8E5E0",
                boxShadow: plan.popular
                  ? "0 20px 40px rgba(28,28,28,0.15)"
                  : "0 4px 12px rgba(0,0,0,0.03)",
                color: plan.popular ? "#FFFFFF" : "#1C1C1C",
              }}
            >
              {plan.popular && (
                <span className="absolute -top-3.5 right-6 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#333333] text-white border border-white/20 shadow-xs">
                  {plan.badgeLabel}
                </span>
              )}

              <div>
                <div className="mb-6">
                  <div className="text-[18px] font-bold mb-2 text-inherit flex items-center justify-between">
                    <span>{plan.name}</span>
                    {plan.popular && <SparklesIcon className="h-5 w-5 text-white/70" />}
                  </div>

                  <div className="flex items-baseline gap-1.5 mt-2">
                    <span
                      className="font-extrabold text-[24px] sm:text-[28px] tracking-tight"
                      style={{ color: "inherit" }}
                    >
                      {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    {plan.period && (
                      <span className="text-[13px] font-medium opacity-70">{plan.period}</span>
                    )}
                  </div>

                  <div className="h-4 mt-1.5">
                    {plan.annualDetail && (
                      <span
                        className="text-[12px] font-medium"
                        style={{ color: plan.popular ? "rgba(255,255,255,0.7)" : "#64635F" }}
                      >
                        {isAnnual ? plan.annualDetail : "Facturation mensuelle sans engagement"}
                      </span>
                    )}
                  </div>

                  <p className="text-[13px] mt-4 leading-relaxed opacity-80 min-h-[40px]">
                    {plan.description}
                  </p>
                </div>

                <div
                  className="pt-5 mb-8"
                  style={{
                    borderTop: plan.popular
                      ? "1px solid rgba(255,255,255,0.15)"
                      : "1px solid #E8E5E0",
                  }}
                >
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2.5 text-[13px] font-bold">
                      <CheckIcon
                        className="h-4 w-4 shrink-0 mt-0.5"
                        style={{ color: plan.popular ? "#FFFFFF" : "#1C1C1C" }}
                      />
                      <span>{plan.bienLabel}</span>
                    </li>
                    {i > 0 && (
                      <li className="text-[12px] italic opacity-60 pl-[26px]">
                        Tout {PLANS[i - 1].name}, plus :
                      </li>
                    )}
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-[13px]">
                        <CheckIcon
                          className="h-4 w-4 shrink-0 mt-0.5"
                          style={{ color: plan.popular ? "#FFFFFF" : "#1C1C1C" }}
                        />
                        <span className="opacity-90">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Boutons CTA : Milieu en blanc, Découverte & Agence en couleur de sélection (#F5F5DC) */}
              <Link href="/auth/register" className="w-full block mt-auto">
                <button
                  type="button"
                  className={`w-full py-3 px-4 rounded-[6px] text-[13px] font-bold transition-all duration-200 cursor-pointer shadow-xs active:scale-[0.98] border ${
                    plan.popular
                      ? "bg-white text-[#1C1C1C] border-white/30 hover:bg-[#F5F5DC] hover:text-[#1C1C1C] hover:border-[#C5A880]"
                      : "bg-[#F5F5DC] text-[#1C1C1C] border-[#E8E5E0] hover:bg-[#1C1C1C] hover:text-white hover:border-[#1C1C1C]"
                  }`}
                >
                  {plan.cta}
                </button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* BOUTON DÉPLIABLE DU TABLEAU COMPARATIF COMPLET                             */}
        {/* ========================================================================= */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setShowComparison(!showComparison)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#E8E5E0] text-[13px] font-bold text-[#1C1C1C] shadow-xs hover:border-[#1C1C1C] hover:bg-[#F5F5DC] transition-all duration-200 cursor-pointer group"
          >
            <span>{showComparison ? "Masquer le comparatif détaillé" : "Comparer tous les forfaits en détail"}</span>
            {showComparison ? (
              <ChevronUpIcon className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
            ) : (
              <ChevronDownIcon className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
            )}
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TABLEAU COMPARATEUR DÉPLIABLE (ACCORDÉON SOUS LE PRICING)                  */}
        {/* ========================================================================= */}
        <AnimatePresence>
          {showComparison && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 32 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="bg-white border border-[#E8E5E0] rounded-[12px] shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  {/* Table Header */}
                  <thead>
                    <tr className="border-b border-[#E8E5E0] bg-[#FAF9F6]">
                      <th className="py-4 px-6 text-[13px] font-extrabold text-[#1C1C1C] w-1/3">
                        Fonctionnalités &amp; Services
                      </th>
                      <th className="py-4 px-4 text-[13px] font-bold text-[#1C1C1C] text-center">
                        Découverte
                        <span className="block text-[11px] font-normal text-[#64635F]">0 FCFA</span>
                      </th>
                      <th className="py-4 px-4 text-[13px] font-bold text-[#1C1C1C] text-center bg-[#F5F5DC]/40 border-x border-[#E8E5E0]">
                        <span className="inline-flex items-center gap-1 justify-center">
                          Bailleur Pro
                          <SparklesIcon className="h-3.5 w-3.5 text-[#C5A880]" />
                        </span>
                        <span className="block text-[11px] font-bold text-[#1C1C1C]">
                          {isAnnual ? "4 200 FCFA" : "5 000 FCFA"}
                        </span>
                      </th>
                      <th className="py-4 px-4 text-[13px] font-bold text-[#1C1C1C] text-center">
                        Diaspora
                        <span className="block text-[11px] font-normal text-[#64635F]">
                          {isAnnual ? "10 000 FCFA" : "12 000 FCFA"}
                        </span>
                      </th>
                      <th className="py-4 px-4 text-[13px] font-bold text-[#1C1C1C] text-center">
                        Agence
                        <span className="block text-[11px] font-normal text-[#64635F]">
                          {isAnnual ? "20 800 FCFA" : "25 000 FCFA"}
                        </span>
                      </th>
                    </tr>
                  </thead>

                  {/* Table Body — dérivé de PLANS, aucune donnée additionnelle */}
                  <tbody className="divide-y divide-[#E8E5E0]">
                    {comparisonRows.map((feat, fIdx) => (
                      <tr
                        key={fIdx}
                        className="hover:bg-[#FAF9F6]/50 transition-colors text-[13px]"
                      >
                        <td className="py-3.5 px-6">
                          <div className="font-bold text-[#1C1C1C]">{feat.name}</div>
                        </td>

                        {/* Découverte */}
                        <td className="py-3.5 px-4 text-center">
                          {typeof feat.decouverte === "boolean" ? (
                            feat.decouverte ? (
                              <CheckIcon className="h-4 w-4 mx-auto text-[#1C1C1C] stroke-[2.5]" />
                            ) : (
                              <MinusIcon className="h-4 w-4 mx-auto text-[#9C9A95]" />
                            )
                          ) : (
                            <span className="font-bold text-[#1C1C1C]">{feat.decouverte}</span>
                          )}
                        </td>

                        {/* Bailleur Pro (Highlighted Column) */}
                        <td className="py-3.5 px-4 text-center bg-[#F5F5DC]/25 border-x border-[#E8E5E0]">
                          {typeof feat.pro === "boolean" ? (
                            feat.pro ? (
                              <CheckIcon className="h-4 w-4 mx-auto text-[#1C1C1C] stroke-[2.5]" />
                            ) : (
                              <MinusIcon className="h-4 w-4 mx-auto text-[#9C9A95]" />
                            )
                          ) : (
                            <span className="font-bold text-[#1C1C1C]">{feat.pro}</span>
                          )}
                        </td>

                        {/* Diaspora & Patrimoine */}
                        <td className="py-3.5 px-4 text-center">
                          {typeof feat.diaspora === "boolean" ? (
                            feat.diaspora ? (
                              <CheckIcon className="h-4 w-4 mx-auto text-[#1C1C1C] stroke-[2.5]" />
                            ) : (
                              <MinusIcon className="h-4 w-4 mx-auto text-[#9C9A95]" />
                            )
                          ) : (
                            <span className="font-bold text-[#1C1C1C]">{feat.diaspora}</span>
                          )}
                        </td>

                        {/* Agence & Conciergerie */}
                        <td className="py-3.5 px-4 text-center">
                          {typeof feat.agence === "boolean" ? (
                            feat.agence ? (
                              <CheckIcon className="h-4 w-4 mx-auto text-[#1C1C1C] stroke-[2.5]" />
                            ) : (
                              <MinusIcon className="h-4 w-4 mx-auto text-[#9C9A95]" />
                            )
                          ) : (
                            <span className="font-bold text-[#1C1C1C]">{feat.agence}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Table Footer Action */}
                <div className="p-4 bg-[#FAF9F6] border-t border-[#E8E5E0] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                  <span className="text-[12px] text-[#64635F]">
                    Besoin d&apos;une formule personnalisée pour un parc de plus de 50 biens ?
                  </span>
                  <Link
                    href="/auth/register"
                    className="text-[12px] font-bold text-[#1C1C1C] hover:underline"
                  >
                    Contactez l&apos;équipe Lokka à Cotonou →
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
