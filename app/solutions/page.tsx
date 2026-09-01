"use client";

import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import CTA from "@/components/landing/CTA";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { motion } from "framer-motion";
import {
  UserIcon,
  BriefcaseIcon,
  BuildingOffice2Icon,
  CheckIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

export default function SolutionsPage() {
  const solutions = [
    {
      id: "particuliers",
      badge: "Propriétaires Particuliers",
      title: "Bailleurs & Investisseurs",
      scale: "De 1 à 15 logements",
      icon: UserIcon,
      subtitle: "Gagnez du temps et éliminez les tensions de fin de mois grâce à l'automatisation.",
      problems: [
        "Vérifications manuelles interminables des dépôts Mobile Money",
        "Reçus et cahiers papier faciles à égarer ou contester",
        "Gêne au moment de réclamer les loyers impayés",
      ],
      benefits: [
        "Encaissement direct par MTN MoMo & Moov Money en FCFA",
        "Rappels automatiques cordiaux sans confrontation directe",
        "Quittances PDF certifiées générées et archivées en 1 clic",
        "Bouclier légal Loi 2022-30 (caution plafonnée à 3 mois)",
      ],
      ctaText: "Découvrir la formule Bailleur (5 000 F)",
      popular: true,
      badgeLabel: "Idéal Bailleurs",
    },
    {
      id: "gestionnaires",
      badge: "Gestionnaires Indépendants",
      title: "Gestionnaires & Démarcheurs",
      scale: "De 5 à 35 logements",
      icon: BriefcaseIcon,
      subtitle: "Offrez un service haut de gamme et transparent à tous vos propriétaires mandants.",
      problems: [
        "Confusion entre les flux financiers des différents propriétaires",
        "Calcul complexe des honoraires de gestion (plafonnés à 10% par la loi)",
        "États des lieux manuscrits contestés en fin de bail",
      ],
      benefits: [
        "Cloisonnement étanche des comptes par propriétaire",
        "Rapports de gestion mensuels exportables en 1 clic (PDF/Excel)",
        "États des lieux contradictoires avec photos horodatées",
        "Frais de visite payables en ligne par Mobile Money",
      ],
      ctaText: "Découvrir la formule Bailleur Pro",
      popular: false,
    },
    {
      id: "agences",
      badge: "Agences Immobilières & SCI",
      title: "Agences & Cabinets",
      scale: "50 biens et plus",
      icon: BuildingOffice2Icon,
      subtitle: "L'infrastructure complète pour piloter un parc multi-villes et vos équipes.",
      problems: [
        "Manque de visibilité globale sur plusieurs équipes et villes",
        "Frais d'annonces élevés sur les réseaux sans filtrage sérieux",
        "Comptabilité fastidieuse pour la déclaration de la TFU",
      ],
      benefits: [
        "Gestion multi-propriétaires avec mandats & reversements automatiques",
        "Marketplace Lokka & site vitrine avec domaine personnalisé",
        "SEO & blog d'agence inclus pour attirer les locataires",
        "Bilan financier complet prêt pour la Taxe Foncière Unique",
      ],
      ctaText: "Choisir le Plan Agence (25 000 F)",
      popular: false,
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FAF9F6] pt-28 sm:pt-36">
        {/* Hero Section */}
        <section className="container mx-auto max-w-5xl px-4 sm:px-6 text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F6EFE7] border border-[#E8E3DC] text-[11.5px] font-extrabold uppercase tracking-[0.14em] text-[#9D6B3C] mb-5">
              <SparklesIcon className="w-3.5 h-3.5" />
              Solutions sur-mesure
            </div>

            <h1 className="text-[clamp(2.4rem,5.2vw,4.2rem)] font-extrabold text-[#18181B] tracking-[-0.045em] leading-[1.08] mb-6">
              Une solution adaptée à chaque{" "}
              <span className="font-serif italic font-normal text-[#52525B]">
                acteur immobilier
              </span>
            </h1>

            <p className="text-[16px] sm:text-[18px] max-w-2xl mx-auto text-[#52525B] leading-relaxed mb-10">
              Que vous gériez 1 studio à Calavi, 10 appartements à Cotonou ou un portefeuille d&apos;agence de 100 logements,
              Lokka adapte son interface à vos besoins précis.
            </p>
          </motion.div>
        </section>

        {/* Solutions Cards */}
        <section className="container mx-auto max-w-6xl px-4 sm:px-6 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {solutions.map((sol, index) => {
              const Icon = sol.icon;

              return (
                <motion.div
                  key={sol.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className={`flex flex-col justify-between rounded-3xl bg-white p-8 border transition-all duration-300 relative ${
                    sol.popular
                      ? "border-[#9D6B3C] shadow-lg ring-2 ring-[#9D6B3C]/15"
                      : "border-[#E8E3DC] shadow-xs hover:border-[#9D6B3C]/50"
                  }`}
                >
                  {sol.badgeLabel && (
                    <span className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full text-[10.5px] font-extrabold uppercase tracking-wider bg-[#15803D] text-white shadow-xs">
                      {sol.badgeLabel}
                    </span>
                  )}

                  <div>
                    <div className="h-12 w-12 rounded-2xl bg-[#FAF9F6] border border-[#E8E3DC] flex items-center justify-center mb-6 text-[#18181B]">
                      <Icon className="h-6 w-6 text-[#9D6B3C]" />
                    </div>

                    <div className="text-[11.5px] font-extrabold tracking-wider uppercase text-[#9D6B3C] mb-1">
                      {sol.badge}
                    </div>
                    <h3 className="text-[22px] font-extrabold text-[#18181B] mb-1">
                      {sol.title}
                    </h3>
                    <div className="text-[13px] font-bold text-[#71717A] mb-4">
                      {sol.scale}
                    </div>

                    <p className="text-[14px] text-[#52525B] leading-relaxed mb-6">
                      {sol.subtitle}
                    </p>

                    <div className="pt-6 border-t border-[#E8E3DC] mb-8 space-y-3">
                      <div className="text-[11.5px] font-bold uppercase tracking-wider text-[#18181B] mb-3">
                        Avantages clés Lokka :
                      </div>
                      {sol.benefits.map((b, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-[13px] text-[#18181B] font-medium">
                          <CheckIcon className="h-4 w-4 text-[#15803D] shrink-0 mt-0.5 stroke-[2.5]" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link href="/auth/register" className="block w-full mt-auto">
                    <button
                      className={`w-full h-12 px-4 rounded-xl text-[13.5px] font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                        sol.popular
                          ? "bg-[#18181B] text-white hover:bg-[#9D6B3C] shadow-md"
                          : "bg-[#FAF9F6] text-[#18181B] border border-[#E8E3DC] hover:bg-white hover:border-[#9D6B3C]/50 shadow-2xs"
                      }`}
                    >
                      <span>{sol.ctaText}</span>
                      <ArrowRightIcon className="h-4 w-4" />
                    </button>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Commitment Banner */}
        <section className="bg-white border-y border-[#E8E3DC] py-16">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#F6EFE7] border border-[#E8E3DC] flex items-center justify-center mx-auto mb-4 text-[#9D6B3C]">
              <ShieldCheckIcon className="h-6 w-6 text-[#9D6B3C]" />
            </div>
            <h2 className="text-[24px] sm:text-[28px] font-extrabold text-[#18181B] tracking-tight mb-3">
              Un engagement sans compromis sur la sécurité
            </h2>
            <p className="text-[15px] text-[#52525B] max-w-xl mx-auto leading-relaxed">
              Toutes vos données financières, pièces d&apos;identité et contrats sont chiffrés et protégés
              selon les normes de sécurité bancaire les plus strictes.
            </p>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
