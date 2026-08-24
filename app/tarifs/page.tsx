"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import CTA from "@/components/landing/CTA";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { motion } from "framer-motion";
import { CheckIcon, XMarkIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

export default function TarifsPage() {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: "Starter",
      badge: "Pour débuter",
      monthlyPrice: "Gratuit",
      annualPrice: "Gratuit",
      period: "",
      annualDetail: "Sans engagement ni carte bancaire",
      description: "Idéal pour les propriétaires souhaitant automatiser leurs 1 ou 2 premiers biens.",
      features: [
        "Jusqu'à 2 biens immobiliers",
        "Suivi des encaissements et retards",
        "Génération de quittances de loyer en PDF",
        "Paiements Mobile Money (MTN & Moov)",
        "Tableau de bord financier de base",
        "Support standard par email",
      ],
      cta: "Commencer gratuitement",
      popular: false,
    },
    {
      name: "Pro",
      badge: "Recommandé",
      monthlyPrice: "5 000 FCFA",
      annualPrice: "4 000 FCFA",
      period: "/mois",
      annualDetail: "Soit 48 000 FCFA facturés par an (-20%)",
      description: "Pour les bailleurs et gestionnaires avec un portefeuille en pleine expansion.",
      features: [
        "Jusqu'à 20 biens immobiliers",
        "Tout le plan Starter, plus :",
        "Baux conformes Loi n° 2022-30",
        "Rappels automatiques par WhatsApp & SMS",
        "États des lieux contradictoires avec photos",
        "Journal de caisse pour paiements en espèces",
        "Rapports exportables (PDF / Excel)",
        "Assistance prioritaire sur WhatsApp",
      ],
      cta: "Essai gratuit 14 jours",
      popular: true,
    },
    {
      name: "Entreprise",
      badge: "Agences & Parcs",
      monthlyPrice: "25 000 FCFA",
      annualPrice: "20 000 FCFA",
      period: "/mois",
      annualDetail: "Soit 240 000 FCFA facturés par an (-20%)",
      description: "Pour les gestionnaires professionnels, agences et SCI gérant de grands ensembles.",
      features: [
        "Biens et logements illimités",
        "Tout le plan Pro, plus :",
        "Comptes multi-utilisateurs & collaborateurs",
        "Gestion multi-villes et multi-propriétaires",
        "Synthèse annuelle Taxe Foncière Unique (TFU)",
        "Accompagnement & onboarding personnalisé",
        "Gestionnaire de compte dédié",
      ],
      cta: "Contacter un conseiller",
      popular: false,
    },
  ];

  const comparisonFeatures = [
    { name: "Nombre de biens gérés", starter: "2 biens", pro: "Jusqu'à 20", enterprise: "Illimité" },
    { name: "Paiements MTN MoMo & Moov", starter: true, pro: true, enterprise: true },
    { name: "Journal des paiements en espèces", starter: false, pro: true, enterprise: true },
    { name: "Quittances de loyer PDF certifiées", starter: true, pro: true, enterprise: true },
    { name: "Contrats de bail Loi 2022-30", starter: false, pro: true, enterprise: true },
    { name: "Rappels WhatsApp & SMS", starter: false, pro: true, enterprise: true },
    { name: "États des lieux avec photos", starter: false, pro: true, enterprise: true },
    { name: "Multi-utilisateurs & Rôles", starter: false, pro: false, enterprise: true },
    { name: "Synthèse fiscale TFU Bénin", starter: false, pro: true, enterprise: true },
    { name: "Support client", starter: "Email (48h)", pro: "WhatsApp prioritaire", enterprise: "Dédié 24/7" },
  ];

  const faqs = [
    {
      q: "Comment puis-je régler mon abonnement Lokka ?",
      a: "Vous pouvez régler votre abonnement en toute simplicité directement par MTN Mobile Money, Moov Money, ou par carte bancaire (Visa / Mastercard).",
    },
    {
      q: "Puis-je changer de formule ou annuler à tout moment ?",
      a: "Oui, les forfaits mensuels sont sans aucun engagement. Vous pouvez passer d'un plan à un autre ou annuler votre abonnement depuis vos paramètres en 1 clic.",
    },
    {
      q: "La version Starter gratuite a-t-elle une limite de durée ?",
      a: "Non ! Le forfait Starter est gratuit à vie pour 1 ou 2 biens. Vous ne payez que si vous décidez d'ajouter plus de biens ou d'activer des fonctionnalités avancées.",
    },
    {
      q: "Mes locataires doivent-ils payer pour utiliser Lokka ?",
      a: "Non, Lokka est 100% gratuit pour vos locataires. Ils peuvent recevoir leurs rappels et quittances sans aucun frais supplémentaire.",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FAF9F6] pt-28 sm:pt-36">
        {/* Hero Section */}
        <section className="container mx-auto max-w-5xl px-6 text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="section-label mb-4">Grille Tarifaire</div>
            <h1 className="heading-1 text-[#1C1C1C] text-[clamp(2.4rem,5.5vw,4.25rem)] leading-[1.12] mb-6">
              Une offre transparente, calibrée en{" "}
              <span className="font-serif italic font-normal text-[#64635F]">
                FCFA
              </span>
            </h1>
            <p className="body-text text-lg max-w-2xl mx-auto text-[#64635F] mb-10">
              Aucun frais caché ni mauvaise surprise. Choisissez le forfait adapté à la dimension de votre parc immobilier.
            </p>

            {/* Toggle Annuel / Mensuel */}
            <div className="flex items-center justify-center gap-4">
              <span className={`text-[14px] font-semibold ${!isAnnual ? "text-[#1C1C1C]" : "text-[#9C9A95]"}`}>
                Mensuel
              </span>

              <button
                type="button"
                onClick={() => setIsAnnual(!isAnnual)}
                className="relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none"
                style={{ backgroundColor: isAnnual ? "#1C1C1C" : "#E8E5E0" }}
              >
                <motion.span
                  animate={{ x: isAnnual ? 34 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="inline-block h-7 w-7 rounded-full bg-white shadow-sm"
                />
              </button>

              <div className="flex items-center gap-2">
                <span className={`text-[14px] font-semibold ${isAnnual ? "text-[#1C1C1C]" : "text-[#9C9A95]"}`}>
                  Annuel
                </span>
                <span className="inline-flex items-center rounded-full bg-[#E6F5EF] px-2.5 py-1 text-[11px] font-bold text-[#087F5B]">
                  -20% de remise
                </span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Pricing Cards Grid */}
        <section className="container mx-auto max-w-6xl px-6 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`flex flex-col justify-between p-8 rounded-[12px] transition-all duration-300 ${
                  plan.popular
                    ? "bg-[#1C1C1C] text-white border border-[#1C1C1C] shadow-[0_16px_40px_rgba(0,0,0,0.15)] relative"
                    : "bg-white text-[#1C1C1C] border border-[#E8E5E0] shadow-sm hover:border-[#1C1C1C]"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3.5 right-6 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase bg-[#087F5B] text-white">
                    {plan.badge}
                  </span>
                )}

                <div>
                  <div className="mb-6">
                    <div className={`text-[12px] font-bold tracking-wider uppercase mb-1 ${plan.popular ? "text-[#E6F5EF]" : "text-[#087F5B]"}`}>
                      {plan.name}
                    </div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="font-serif text-[38px] font-bold tracking-tight">
                        {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                      </span>
                      {plan.period && (
                        <span className="text-[14px] opacity-70 font-medium">{plan.period}</span>
                      )}
                    </div>
                    <p className={`text-[12px] min-h-[20px] ${plan.popular ? "text-[#E6F5EF]" : "text-[#087F5B]"}`}>
                      {isAnnual ? plan.annualDetail : "Facturation mensuelle sans engagement"}
                    </p>
                    <p className="text-[14px] opacity-80 mt-4 leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  <div className={`pt-6 mb-8 border-t ${plan.popular ? "border-white/15" : "border-[#E8E5E0]"}`}>
                    <div className="text-[12px] font-bold uppercase tracking-wider mb-4 opacity-90">
                      Inclus dans ce forfait :
                    </div>
                    <ul className="space-y-3">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-start gap-2.5 text-[13px]">
                          <CheckIcon
                            className={`h-4 w-4 shrink-0 mt-0.5 ${
                              plan.popular ? "text-[#E6F5EF]" : "text-[#087F5B]"
                            }`}
                          />
                          <span className={feature.startsWith("Tout") ? "font-bold" : "opacity-90"}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Link href="/auth/register" className="w-full block mt-auto">
                  <button
                    className={`w-full py-3 px-4 rounded-[6px] text-[14px] font-semibold transition-all duration-200 ${
                      plan.popular
                        ? "bg-white text-[#1C1C1C] hover:bg-[#FAF9F6]"
                        : "bg-[#1C1C1C] text-white hover:bg-[#333333]"
                    }`}
                  >
                    {plan.cta}
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Detailed Comparison Table */}
        <section className="container mx-auto max-w-5xl px-6 pb-24">
          <div className="text-center mb-12">
            <h2 className="heading-2 text-[#1C1C1C] text-[28px] mb-3">
              Tableau comparatif des fonctionnalités
            </h2>
            <p className="body-text text-[#64635F]">
              Comparez chaque détail pour choisir l&apos;offre qui correspond à vos besoins.
            </p>
          </div>

          <div className="bg-white border border-[#E8E5E0] rounded-[10px] overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF9F6] border-b border-[#E8E5E0]">
                  <th className="p-4 sm:p-5 text-[13px] font-bold text-[#1C1C1C] uppercase tracking-wider">Fonctionnalité</th>
                  <th className="p-4 sm:p-5 text-[13px] font-bold text-[#1C1C1C] uppercase tracking-wider text-center">Starter</th>
                  <th className="p-4 sm:p-5 text-[13px] font-bold text-[#087F5B] uppercase tracking-wider text-center">Pro</th>
                  <th className="p-4 sm:p-5 text-[13px] font-bold text-[#1C1C1C] uppercase tracking-wider text-center">Entreprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E5E0] text-[14px]">
                {comparisonFeatures.map((f, idx) => (
                  <tr key={idx} className="hover:bg-[#FAF9F6]/50 transition-colors">
                    <td className="p-4 sm:p-5 font-medium text-[#1C1C1C]">{f.name}</td>
                    
                    <td className="p-4 sm:p-5 text-center text-[#64635F]">
                      {typeof f.starter === "boolean" ? (
                        f.starter ? (
                          <CheckIcon className="h-5 w-5 text-[#087F5B] mx-auto" />
                        ) : (
                          <XMarkIcon className="h-5 w-5 text-[#9C9A95] mx-auto opacity-40" />
                        )
                      ) : (
                        f.starter
                      )}
                    </td>

                    <td className="p-4 sm:p-5 text-center font-semibold text-[#1C1C1C] bg-[#087F5B]/[0.02]">
                      {typeof f.pro === "boolean" ? (
                        f.pro ? (
                          <CheckIcon className="h-5 w-5 text-[#087F5B] mx-auto" />
                        ) : (
                          <XMarkIcon className="h-5 w-5 text-[#9C9A95] mx-auto opacity-40" />
                        )
                      ) : (
                        f.pro
                      )}
                    </td>

                    <td className="p-4 sm:p-5 text-center text-[#64635F]">
                      {typeof f.enterprise === "boolean" ? (
                        f.enterprise ? (
                          <CheckIcon className="h-5 w-5 text-[#087F5B] mx-auto" />
                        ) : (
                          <XMarkIcon className="h-5 w-5 text-[#9C9A95] mx-auto opacity-40" />
                        )
                      ) : (
                        f.enterprise
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Pricing FAQs */}
        <section className="bg-white border-y border-[#E8E5E0] py-20">
          <div className="container mx-auto max-w-4xl px-6">
            <div className="text-center mb-14">
              <div className="section-label mb-3">Questions fréquentes</div>
              <h2 className="heading-2 text-[#1C1C1C] text-[30px]">
                Tout comprendre sur nos abonnements
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {faqs.map((faq, index) => (
                <div key={index} className="p-6 rounded-[8px] bg-[#FAF9F6] border border-[#E8E5E0]">
                  <h3 className="text-[16px] font-bold text-[#1C1C1C] mb-2.5 flex items-start gap-2">
                    <QuestionMarkCircleIcon className="h-5 w-5 text-[#087F5B] shrink-0 mt-0.5" />
                    <span>{faq.q}</span>
                  </h3>
                  <p className="text-[14px] text-[#64635F] leading-relaxed pl-7">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
