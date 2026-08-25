"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  BanknotesIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

export default function ConversionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const [claimedDomain, setClaimedDomain] = useState("monagence");

  const pillars = [
    {
      icon: BanknotesIcon,
      number: "01",
      title: "Encaissement MoMo & Quittance PDF Web",
      description:
        "Validez vos loyers via MTN MoMo et Moov Money. Chaque règlement génère automatiquement une quittance PDF officielle certifiée avec QR Code.",
      badge: "Loi n° 2022-30",
    },
    {
      icon: GlobeAltIcon,
      number: "02",
      title: "Site Vitrine Public en 1 Clic",
      description:
        "Économisez les coûts de développement d'un site web. Vos biens vacants sont publiés immédiatement avec module de réservation de visites et contact WhatsApp.",
      badge: "Acquisition Immédiate",
    },
    {
      icon: ShieldCheckIcon,
      number: "03",
      title: "Espace Locataire & Bouclier Juridique",
      description:
        "Un portail web dédié où votre locataire télécharge ses quittances et paie en ligne. Plafonnement automatique de la caution à 3 mois maximum.",
      badge: "Zéro Litige",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-24 sm:py-32 bg-[#FAF9F6] border-t border-[#E8E5E0] relative overflow-hidden"
    >
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <div className="section-label mb-3 text-[#1C1C1C]">Trois Piliers Stratégiques</div>
          <h2 className="heading-2 mb-4 text-[#1C1C1C]">
            Pourquoi Lokka transforme votre gestion
          </h2>
          <p className="body-text text-base sm:text-lg text-[#64635F]">
            Trois fondations solides conçues sur-mesure pour les bailleurs, agences et investisseurs au Bénin.
          </p>
        </motion.div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white border border-[#E8E5E0] rounded-[10px] p-7 sm:p-8 flex flex-col justify-between shadow-xs hover:border-[#1C1C1C] hover:-translate-y-1 transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[8px] bg-[#1C1C1C] text-white">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#1C1C1C] bg-[#F3F2EE] border border-[#E8E5E0] px-2.5 py-1 rounded-full">
                      {pillar.badge}
                    </span>
                  </div>

                  <span className="text-[12px] font-bold text-[#9C9A95] uppercase tracking-widest block mb-1">
                    Pilier {pillar.number}
                  </span>
                  <h3 className="text-[18px] font-bold text-[#1C1C1C] mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-[14px] text-[#64635F] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#FAF9F6] flex items-center gap-2 text-[12px] font-semibold text-[#1C1C1C]">
                  <CheckCircleIcon className="h-4 w-4 shrink-0 text-[#64635F]" />
                  <span>Disponible sur tous les forfaits</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Interactive Storefront Claimer Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white border border-[#1C1C1C] rounded-[12px] p-6 sm:p-10 shadow-sm text-center max-w-3xl mx-auto"
        >
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#1C1C1C] bg-[#F3F2EE] border border-[#E8E5E0] px-3 py-1 rounded-full mb-4">
            <SparklesIcon className="w-3.5 h-3.5 text-[#1C1C1C]" />
            <span>Votre Site Vitrine Prêt en 30 secondes</span>
          </span>

          <h3 className="text-[22px] sm:text-[26px] font-bold text-[#1C1C1C] mb-2">
            Réservez votre lien public d&apos;agence ou de bailleur
          </h3>
          <p className="text-[14px] text-[#64635F] mb-6">
            Tapez votre nom pour prévisualiser l&apos;adresse de votre futur site vitrine Lokka.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch justify-center gap-2 max-w-lg mx-auto">
            <div className="flex items-center bg-[#FAF9F6] border border-[#E8E5E0] rounded-[6px] px-3 py-2.5 flex-1 shadow-2xs">
              <span className="text-[14px] font-bold text-[#1C1C1C]">https://</span>
              <input
                type="text"
                value={claimedDomain}
                onChange={(e) =>
                  setClaimedDomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
                }
                placeholder="votre-nom"
                className="bg-transparent border-none outline-none font-bold text-[14px] text-[#1C1C1C] px-1 w-28 sm:w-36 text-center"
              />
              <span className="text-[14px] font-bold text-[#1C1C1C]">.lokka.bj</span>
            </div>

            <a
              href={`/auth/register?domain=${claimedDomain}`}
              className="btn-primary py-2.5 px-5 text-[13px] inline-flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <span>Réserver mon adresse</span>
              <ArrowRightIcon className="w-4 h-4" />
            </a>
          </div>

          <div className="mt-3 text-[11px] text-[#64635F] font-semibold flex items-center justify-center gap-1">
            <CheckCircleIcon className="w-3.5 h-3.5 text-[#1C1C1C]" />
            <span>Adresse {claimedDomain || "votre-nom"}.lokka.bj disponible immédiatement</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
