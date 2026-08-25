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
  detail?: string;
  decouverte: string | boolean;
  pro: string | boolean;
  agence: string | boolean;
}

interface FeatureCategory {
  category: string;
  features: FeatureRow[];
}

const COMPARISON_DATA: FeatureCategory[] = [
  {
    category: "1. Gestion Locative & Quittances",
    features: [
      {
        name: "Nombre de biens & lots gérés",
        detail: "Appartements, villas, studios ou boutiques",
        decouverte: "Jusqu'à 2",
        pro: "Jusqu'à 10",
        agence: "Illimité",
      },
      {
        name: "Quittances PDF certifiées web",
        detail: "Valeur juridique Loi n° 2022-30",
        decouverte: true,
        pro: true,
        agence: true,
      },
      {
        name: "QR Code d'authentification officiel",
        detail: "Vérifiable instantanément par scan",
        decouverte: true,
        pro: true,
        agence: true,
      },
      {
        name: "Espace Locataire dédié sécurisé",
        detail: "Connexion sans mot de passe par code OTP",
        decouverte: true,
        pro: true,
        agence: true,
      },
      {
        name: "Encaissements MTN MoMo & Moov Money",
        detail: "Pointage automatique et mise à jour en direct",
        decouverte: true,
        pro: true,
        agence: true,
      },
      {
        name: "Plafonnement caution 3 mois (Loi 2022-30)",
        detail: "Bouclier juridique anti-contentieux",
        decouverte: true,
        pro: true,
        agence: true,
      },
    ],
  },
  {
    category: "2. Site Vitrine Public & Acquisition",
    features: [
      {
        name: "Page vitrine publique partagée",
        detail: "lokka.bj/p/votre-bien",
        decouverte: true,
        pro: true,
        agence: true,
      },
      {
        name: "Sous-domaine dédié personnalisé",
        detail: "mon-nom.lokka.bj",
        decouverte: false,
        pro: true,
        agence: true,
      },
      {
        name: "Nom de Domaine Pro indépendant",
        detail: "www.monagence.bj (SSL & hébergement inclus)",
        decouverte: false,
        pro: false,
        agence: true,
      },
      {
        name: "Module de réservation de visite en ligne",
        detail: "Planning synchronisé avec vos disponibilités",
        decouverte: false,
        pro: true,
        agence: true,
      },
      {
        name: "Bouton de contact direct WhatsApp",
        detail: "Message pré-rempli avec référence du logement",
        decouverte: true,
        pro: true,
        agence: true,
      },
      {
        name: "Site en marque blanche (Votre logo)",
        detail: "Suppression totale des mentions Lokka",
        decouverte: false,
        pro: false,
        agence: true,
      },
    ],
  },
  {
    category: "3. Comptabilité, Fiscalité & Bilan",
    features: [
      {
        name: "Calculateur & Bilan fiscal TFU DGI",
        detail: "Taxe Foncière Unique déclarable aux impôts",
        decouverte: false,
        pro: true,
        agence: true,
      },
      {
        name: "Double affichage devises (FCFA / € / $)",
        detail: "Idéal pour la diaspora et investisseurs",
        decouverte: false,
        pro: true,
        agence: true,
      },
      {
        name: "Comptes-Rendus de Gestion (CRG) en 1 clic",
        detail: "Relevé officiel mensuel pour mandants",
        decouverte: false,
        pro: false,
        agence: true,
      },
      {
        name: "Barème commission 10% Loi 2022-30",
        detail: "Honoraires de gestion automatisés",
        decouverte: false,
        pro: false,
        agence: true,
      },
      {
        name: "Multi-comptes / Collaborateurs d'agence",
        detail: "Accès gestionnaires, comptables et agents",
        decouverte: false,
        pro: false,
        agence: true,
      },
    ],
  },
  {
    category: "4. Accompagnement & Sécurité",
    features: [
      {
        name: "Relances WhatsApp automatiques (J+5)",
        detail: "Rappels cordiaux avec lien de paiement",
        decouverte: false,
        pro: true,
        agence: true,
      },
      {
        name: "Sauvegarde cloud quotidienne chiffrée",
        detail: "Données protégées et disponibles 24/7",
        decouverte: true,
        pro: true,
        agence: true,
      },
      {
        name: "Niveau de support technique",
        detail: "Assistance par email, chat et téléphone",
        decouverte: "Email standard",
        pro: "Support Prioritaire",
        agence: "Support VIP Dédié Cotonou",
      },
    ],
  },
];

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [showComparison, setShowComparison] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const plans = [
    {
      name: "Découverte",
      monthlyPrice: "0 FCFA",
      annualPrice: "0 FCFA",
      period: "",
      pricePrefix: "",
      annualDetail: "Gratuit pour démarrer",
      description: "Pour les bailleurs avec 1 ou 2 logements qui veulent tester Lokka en toute simplicité.",
      features: [
        "Jusqu'à 2 biens gérés",
        "Quittances PDF certifiées web",
        "Espace Locataire dédié",
        "Suivi des règlements MTN & Moov",
        "Conformité Loi n° 2022-30",
        "Page vitrine partagée lokka.bj",
      ],
      cta: "Créer mon compte gratuit",
      popular: false,
    },
    {
      name: "Propriétaire Pro",
      monthlyPrice: "9 900 FCFA",
      annualPrice: "7 900 FCFA",
      period: "/mois",
      pricePrefix: "",
      annualDetail: "94 800 FCFA facturés par an (-20%)",
      description: "Pour les bailleurs actifs et la diaspora gérant jusqu'à 10 logements.",
      features: [
        "Jusqu'à 10 biens gérés",
        "Tout Découverte, plus :",
        "Sous-domaine dédié (mon-nom.lokka.bj)",
        "Module de réservation de visite en ligne",
        "Option Frais de visite en FCFA",
        "Double affichage devises (FCFA / € / $)",
        "Calculateur & Bilan fiscal TFU DGI",
        "Rappels WhatsApp automatiques",
      ],
      cta: "Démarrer l'essai 14 jours",
      popular: true,
      badgeLabel: "Le Plus Populaire",
    },
    {
      name: "Agence & SCI",
      monthlyPrice: "29 000 FCFA",
      annualPrice: "24 000 FCFA",
      period: "/mois",
      pricePrefix: "",
      annualDetail: "288 000 FCFA facturés par an (-20%)",
      description: "Pour les agences immobilières, gestionnaires agréés et parcs multi-propriétaires.",
      features: [
        "Biens & Lots illimités",
        "Tout Propriétaire Pro, plus :",
        "NOM DE DOMAINE PRO (www.monagence.bj)",
        "Site vitrine en marque blanche (votre logo)",
        "Gestion multi-propriétaires mandants",
        "Comptes-Rendus de Gestion (CRG) en 1 clic",
        "Commission 10% Loi 2022-30 intégrée",
        "Multi-comptes / Collaborateurs d'agence",
        "Support VIP dédié à Cotonou",
      ],
      cta: "Choisir le Plan Agence",
      popular: false,
    },
  ];

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
                -20% Économie
              </span>
            </div>
          </div>
        </motion.div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mb-12">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex flex-col justify-between p-7 sm:p-8 rounded-[10px] transition-all duration-300 group hover:-translate-y-1"
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
                      className="font-extrabold text-[28px] sm:text-[34px] tracking-tight"
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
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-[13px]">
                        <CheckIcon
                          className="h-4 w-4 shrink-0 mt-0.5"
                          style={{ color: plan.popular ? "#FFFFFF" : "#1C1C1C" }}
                        />
                        <span className={feature.startsWith("NOM DE") || feature.startsWith("Tout") ? "font-bold" : "opacity-90"}>
                          {feature}
                        </span>
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
                      <th className="py-4 px-6 text-[13px] font-extrabold text-[#1C1C1C] w-2/5">
                        Fonctionnalités &amp; Services
                      </th>
                      <th className="py-4 px-5 text-[13px] font-bold text-[#1C1C1C] text-center w-1/5">
                        Découverte
                        <span className="block text-[11px] font-normal text-[#64635F]">0 FCFA</span>
                      </th>
                      <th className="py-4 px-5 text-[13px] font-bold text-[#1C1C1C] text-center w-1/5 bg-[#F5F5DC]/40 border-x border-[#E8E5E0]">
                        <span className="inline-flex items-center gap-1">
                          Propriétaire Pro
                          <SparklesIcon className="h-3.5 w-3.5 text-[#C5A880]" />
                        </span>
                        <span className="block text-[11px] font-bold text-[#1C1C1C]">
                          {isAnnual ? "7 900 FCFA" : "9 900 FCFA"}
                        </span>
                      </th>
                      <th className="py-4 px-5 text-[13px] font-bold text-[#1C1C1C] text-center w-1/5">
                        Agence &amp; SCI
                        <span className="block text-[11px] font-normal text-[#64635F]">
                          {isAnnual ? "24 000 FCFA" : "29 000 FCFA"}
                        </span>
                      </th>
                    </tr>
                  </thead>

                  {/* Table Body by Categories */}
                  <tbody className="divide-y divide-[#E8E5E0]">
                    {COMPARISON_DATA.map((cat, catIdx) => (
                      <React.Fragment key={catIdx}>
                        {/* Category Row */}
                        <tr className="bg-[#FAF9F6]/80">
                          <td
                            colSpan={4}
                            className="py-3 px-6 text-[12px] font-bold uppercase tracking-wider text-[#1C1C1C]"
                          >
                            {cat.category}
                          </td>
                        </tr>

                        {/* Feature Rows */}
                        {cat.features.map((feat, fIdx) => (
                          <tr
                            key={fIdx}
                            className="hover:bg-[#FAF9F6]/50 transition-colors text-[13px]"
                          >
                            <td className="py-3.5 px-6">
                              <div className="font-bold text-[#1C1C1C]">{feat.name}</div>
                              {feat.detail && (
                                <div className="text-[11px] text-[#64635F]">{feat.detail}</div>
                              )}
                            </td>

                            {/* Découverte */}
                            <td className="py-3.5 px-5 text-center">
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

                            {/* Propriétaire Pro (Highlighted Column) */}
                            <td className="py-3.5 px-5 text-center bg-[#F5F5DC]/25 border-x border-[#E8E5E0]">
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

                            {/* Agence & SCI */}
                            <td className="py-3.5 px-5 text-center">
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
                      </React.Fragment>
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
