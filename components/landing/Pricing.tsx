"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { CheckIcon } from "@heroicons/react/24/outline";

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const plans = [
    {
      name: "Starter",
      monthlyPrice: "Gratuit",
      annualPrice: "Gratuit",
      period: "",
      pricePrefix: "",
      annualDetail: "Gratuit à vie",
      description: "Pour découvrir Lokka et gérer vos premiers biens.",
      features: [
        "Jusqu'à 2 biens",
        "Suivi des loyers et retards",
        "Quittances automatiques",
        "Espace locataire (paiement Mobile Money)",
        "Tableau de bord basique",
        "Support par email",
      ],
      cta: "Commencer gratuitement",
      popular: false,
    },
    {
      name: "Pro",
      monthlyPrice: "5 000 FCFA",
      annualPrice: "4 000 FCFA",
      period: "/mois",
      pricePrefix: "",
      annualDetail: "48 000 FCFA facturés par an (-20%)",
      description: "Pour les bailleurs avec un patrimoine en croissance.",
      features: [
        "Jusqu'à 20 biens",
        "Tout Starter, plus :",
        "Contrats de location générés automatiquement",
        "États des lieux numériques",
        "Alertes personnalisées (échéances, retards)",
        "Rapports exportables (PDF/Excel)",
        "Support prioritaire WhatsApp",
      ],
      cta: "Essai gratuit 14 jours",
      popular: true,
      badgeLabel: "Recommandé",
    },
    {
      name: "Entreprise",
      monthlyPrice: "25 000 FCFA",
      annualPrice: "20 000 FCFA",
      period: "/mois",
      pricePrefix: "À partir de ",
      annualDetail: "240 000 FCFA facturés par an (-20%)",
      description: "Pour les gestionnaires professionnels et grandes structures.",
      features: [
        "Biens illimités",
        "Tout Pro, plus :",
        "Multi-utilisateurs (équipe)",
        "Rapports personnalisés",
        "Gestionnaire de compte dédié",
        "Onboarding accompagné",
      ],
      cta: "Nous contacter",
      popular: false,
    },
  ];

  return (
    <section ref={sectionRef} id="pricing" className="py-24" style={{ backgroundColor: "#FAF9F6" }}>
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <div className="section-label mb-4">Tarifs</div>
          <h2 className="heading-2 mb-4">Simple et transparent</h2>
          <p className="body-text text-lg">
            Pas de frais cachés. Choisissez la formule adaptée à votre gestion immobilière.
          </p>

          {/* Billing Cycle Toggle Switch */}
          <div className="mt-10 flex items-center justify-center gap-4">
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
              <span className="inline-flex items-center rounded-full bg-[#E5F2ED] px-2.5 py-1 text-[11px] font-bold text-[#087F5B]">
                -20%
              </span>
            </div>
          </div>
        </motion.div>

        {/* Pricing grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex flex-col justify-between p-8 rounded-[8px] transition-all duration-300 group hover:-translate-y-1"
              style={{ 
                backgroundColor: plan.popular ? "#1C1C1C" : "#FFFFFF",
                border: plan.popular ? "1px solid #1C1C1C" : "1px solid #E8E5E0",
                boxShadow: plan.popular ? "8px 8px 0px rgba(0,0,0,0.1)" : "4px 4px 0px rgba(232,229,224,0.5)",
                color: plan.popular ? "#FFFFFF" : "#1C1C1C",
              }}
            >
              {plan.popular && (
                <span className="absolute -top-4 right-6 px-4 py-1.5 rounded-[4px] text-[11px] font-bold tracking-widest uppercase bg-[#087F5B] text-white">
                  {plan.badgeLabel}
                </span>
              )}

              <div>
                <div className="mb-8">
                  <div className="text-[18px] font-bold mb-2">
                    {plan.name}
                  </div>
                  {plan.pricePrefix && (
                    <span className="text-[12px] opacity-70 font-medium block mb-1">
                      {plan.pricePrefix}
                    </span>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span className="heading-2" style={{ fontSize: "clamp(2rem, 3vw, 2.5rem)", lineHeight: 1, color: "inherit" }}>
                      {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    {plan.period && (
                      <span className="text-[14px] font-medium opacity-60">{plan.period}</span>
                    )}
                  </div>

                  <div className="h-4 mt-2">
                    {isAnnual && plan.annualDetail && (
                      <span className="text-[12px] font-medium" style={{ color: plan.popular ? "#E5F2ED" : "#087F5B" }}>
                        {plan.annualDetail}
                      </span>
                    )}
                  </div>

                  <p className="text-[14px] mt-4 leading-relaxed opacity-80 min-h-[42px]">
                    {plan.description}
                  </p>
                </div>

                <div className="pt-6 mb-8" style={{ borderTop: plan.popular ? "1px solid rgba(255,255,255,0.1)" : "1px solid #E8E5E0" }}>
                  <ul className="space-y-4">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-3 text-[13px]">
                        <CheckIcon className="h-4 w-4 shrink-0 mt-0.5" style={{ color: plan.popular ? "#E5F2ED" : "#087F5B" }} />
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
                  className="w-full py-3 px-4 rounded-[6px] text-[14px] font-semibold transition-all duration-200"
                  style={{
                    backgroundColor: plan.popular ? "#FFFFFF" : "#F5F5DC",
                    color: plan.popular ? "#1C1C1C" : "#1C1C1C",
                    border: plan.popular ? "none" : "1px solid #E8E5E0",
                  }}
                >
                  {plan.cta}
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
