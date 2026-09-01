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
} from "@heroicons/react/24/outline";

export default function SolutionsPage() {
  const solutions = [
    {
      id: "particuliers",
      badge: "Propriétaires Particuliers",
      title: "Bailleurs individuels & Investisseurs",
      scale: "De 1 à 5 biens locatifs",
      icon: UserIcon,
      subtitle: "Gagnez du temps et dites adieu aux tensions de fin de mois.",
      problems: [
        "Temps perdu à vérifier manuellement les dépôts d'argent",
        "Cahiers et reçus papier faciles à égarer",
        "Gêne ou retards au moment de relancer les locataires",
      ],
      benefits: [
        "Encaissement direct par MTN MoMo & Moov Money",
        "Rappels WhatsApp automatiques et cordiaux sans confrontation",
        "Quittances PDF générées et transmises instantanément",
        "Contrats conformes à la Loi 2022-30 (caution max 3 mois)",
      ],
      ctaText: "Commencer en Starter (Gratuit)",
      popular: false,
    },
    {
      id: "gestionnaires",
      badge: "Gestionnaires & Démarcheurs",
      title: "Gestionnaires Indépendants",
      scale: "De 5 à 30 biens locatifs",
      icon: BriefcaseIcon,
      subtitle: "Offrez un service de standing premium à tous vos mandants.",
      problems: [
        "Confusion entre les flux financiers de différents propriétaires",
        "Calcul complexe des honoraires de gestion (max 10% selon la loi)",
        "États des lieux manuscrits contestés par les locataires",
      ],
      benefits: [
        "Cloisonnement étanche des comptes par propriétaire",
        "Rapports de gestion mensuels exportables en 1 clic (PDF/Excel)",
        "États des lieux contradictoires avec photos horodatées",
        "Journal de caisse pour la saisie des règlements en espèces",
      ],
      ctaText: "Découvrir l'offre Pro",
      popular: true,
    },
    {
      id: "agences",
      badge: "Agences & Sociétés",
      title: "Agences Immobilières & SCI",
      scale: "Parcs de 30 biens et plus",
      icon: BuildingOffice2Icon,
      subtitle: "L'infrastructure d'entreprise pour piloter un parc multi-villes.",
      problems: [
        "Manque de visibilité globale sur plusieurs équipes et villes",
        "Risques juridiques et litiges liés aux clauses des baux",
        "Comptabilité annuelle fastidieuse pour la déclaration de la TFU",
      ],
      benefits: [
        "Comptes multi-utilisateurs avec permissions granulaires",
        "Vue consolidée multi-villes (Cotonou, Calavi, Porto-Novo, Parakou)",
        "Bilan financier complet prêt pour la Taxe Foncière Unique",
        "Gestionnaire de compte dédié et assistance prioritaire",
      ],
      ctaText: "Contacter notre équipe",
      popular: false,
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FAF9F6] pt-28 sm:pt-36">
        {/* Hero Section */}
        <section className="container mx-auto max-w-5xl px-6 text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="section-label mb-4">Solutions par Profil</div>
            <h1 className="heading-1 text-[#0F172A] text-[clamp(2.4rem,5.5vw,4.25rem)] leading-[1.12] mb-6">
              Une gestion sur-mesure pour chaque{" "}
              <span className="font-serif italic font-normal text-[#64635F]">
                acteur immobilier
              </span>
            </h1>
            <p className="body-text text-lg max-w-2xl mx-auto text-[#64635F] mb-10">
              Que vous possédiez un unique studio à Calavi ou un portefeuille de 50 logements à Cotonou,
              Lokka adapte ses fonctionnalités pour répondre exactement à votre volume d&apos;activité.
            </p>
          </motion.div>
        </section>

        {/* Solutions Cards */}
        <section className="container mx-auto max-w-6xl px-6 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {solutions.map((sol, index) => {
              const Icon = sol.icon;

              return (
                <motion.div
                  key={sol.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className={`flex flex-col justify-between rounded-[12px] bg-white p-8 border transition-all duration-300 ${
                    sol.popular
                      ? "border-[#0F172A] shadow-[0_12px_40px_rgba(0,0,0,0.08)] relative"
                      : "border-[#E8E5E0] shadow-sm hover:border-[#0F172A]"
                  }`}
                >
                  {sol.popular && (
                    <span className="absolute -top-3.5 right-6 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#D97706] text-white">
                      Recommandé
                    </span>
                  )}

                  <div>
                    <div className="h-12 w-12 rounded-[8px] bg-[#FAF9F6] border border-[#E8E5E0] flex items-center justify-center mb-6">
                      <Icon className="h-6 w-6 text-[#0F172A]" />
                    </div>

                    <div className="text-[12px] font-bold tracking-wider uppercase text-[#D97706] mb-1">
                      {sol.badge}
                    </div>
                    <h3 className="text-[20px] font-bold text-[#0F172A] mb-1">
                      {sol.title}
                    </h3>
                    <div className="text-[13px] font-medium text-[#64635F] mb-4">
                      {sol.scale}
                    </div>

                    <p className="text-[14px] text-[#64635F] leading-relaxed mb-6">
                      {sol.subtitle}
                    </p>

                    <div className="pt-6 border-t border-[#E8E5E0] mb-8 space-y-3">
                      <div className="text-[12px] font-bold uppercase tracking-wider text-[#0F172A] mb-3">
                        Avantages clés Lokka :
                      </div>
                      {sol.benefits.map((b, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-[13px] text-[#0F172A]">
                          <CheckIcon className="h-4 w-4 text-[#D97706] shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link href="/auth/register" className="block w-full mt-auto">
                    <button
                      className={`w-full py-3 px-4 rounded-[6px] text-[13px] font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                        sol.popular
                          ? "bg-[#0F172A] text-white hover:bg-[#333333]"
                          : "bg-[#FAF9F6] text-[#0F172A] border border-[#E8E5E0] hover:bg-white"
                      }`}
                    >
                      {sol.ctaText}
                      <ArrowRightIcon className="h-3.5 w-3.5" />
                    </button>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Commitment Banner */}
        <section className="bg-white border-y border-[#E8E5E0] py-16">
          <div className="container mx-auto max-w-4xl px-6 text-center">
            <ShieldCheckIcon className="h-10 w-10 text-[#D97706] mx-auto mb-4" />
            <h2 className="heading-2 text-[#0F172A] text-[26px] mb-3">
              Un engagement sans compromis sur la sécurité
            </h2>
            <p className="body-text text-[15px] text-[#64635F] max-w-xl mx-auto leading-relaxed">
              Toutes vos données financières, pièces d&apos;identité et contrats sont chiffrés et hébergés
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
