"use client";

import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import CTA from "@/components/landing/CTA";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { motion } from "framer-motion";
import {
  BanknotesIcon,
  DevicePhoneMobileIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SparklesIcon,
  QrCodeIcon,
  GlobeAltIcon,
  HomeModernIcon,
} from "@heroicons/react/24/outline";

export default function ProduitPage() {
  const modules = [
    {
      badge: "Paiements & Trésorerie",
      title: "Encaissements Mobile Money & Rapprochement Automatique",
      description:
        "Offrez à vos locataires la simplicité de payer leur loyer directement via MTN MoMo ou Moov Money en FCFA. Dès validation, votre tableau de bord s'actualise et la quittance est générée instantanément.",
      icon: BanknotesIcon,
      points: [
        "Liaison directe avec les comptes MTN Mobile Money & Moov Money Bénin",
        "Enregistrement des paiements en espèces avec archivage des reçus horodatés",
        "Rapprochement automatique et mise à jour instantanée du statut du bail",
        "Journal de trésorerie exportable en 1 clic pour votre comptabilité",
      ],
      highlight: "Zéro retard non identifié",
      accent: "#9D6B3C",
    },
    {
      badge: "Bouclier Juridique",
      title: "Contrats & Quittances conformes à la Loi n° 2022-30",
      description:
        "Sécurisez chaque relation locative avec des documents certifiés, rédigés selon les exigences strictes de la législation béninoise sur le bail d'habitation.",
      icon: ShieldCheckIcon,
      points: [
        "Plafonnement automatique de la caution à 3 mois de loyer maximum",
        "Bail d'habitation type certifié généré automatiquement en PDF",
        "État des lieux contradictoire avec téléversement de photos datées",
        "Quittances PDF infalsifiables avec QR Code de vérification",
      ],
      highlight: "100% conforme au droit béninois",
      accent: "#15803D",
    },
    {
      badge: "Communication & Portails",
      title: "Portail Locataire Sécurisé & Rappels Automatiques",
      description:
        "Fini la relance manuelle des locataires. Lokka envoie des rappels courtois et transmet instantanément l'accès aux quittances certifiées sur un espace dédié sans mot de passe complexe.",
      icon: DevicePhoneMobileIcon,
      points: [
        "Accès locataire instantané par code OTP sécurisé (sans mot de passe)",
        "Rappels d'échéance programmés à J-3 directement par SMS / Email",
        "Historique complet de tous les mois payés téléchargeable 24/7",
        "Module de signalement des pannes et demandes d'intervention",
      ],
      highlight: "Zéro friction locative",
      accent: "#9D6B3C",
    },
    {
      badge: "Marketplace & Vitrine",
      title: "Marketplace Lokka, Visites Payantes & Nom de Domaine",
      description:
        "Publiez vos biens vacants en 1 clic sur la Marketplace Lokka. Filtrez les curieux avec des frais de visite payables en ligne par Mobile Money et connectez votre propre domaine.",
      icon: GlobeAltIcon,
      points: [
        "Vitrine publique instantanée (ex: agence.lokka.bj ou domaine propre)",
        "Frais de visite payables par Mobile Money intégralement perçus",
        "Référencement SEO & blog d'agence inclus pour capter des locataires",
        "Gestion multi-propriétaires avec mandats et reversements automatiques",
      ],
      highlight: "Remplissage accéléré",
      accent: "#15803D",
    },
    {
      badge: "Pilotage Financier",
      title: "Tableau de Bord en Direct & Déclaration TFU",
      description:
        "Gardez une vision limpide sur vos flux financiers, suivez votre taux d'occupation et préparez sans stress votre déclaration de la Taxe Foncière Unique.",
      icon: ChartBarIcon,
      points: [
        "Indicateurs clés : taux d'occupation, MRR en FCFA, loyers en retard",
        "Suivi des charges d'entretien, plomberie et factures SBEE / SONEB",
        "Calcul automatique du rendement locatif net par logement",
        "Synthèse annuelle prête pour la déclaration de la TFU au Bénin",
      ],
      highlight: "Clarté financière totale",
      accent: "#9D6B3C",
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
              Infrastructure Lokka
            </div>

            <h1 className="text-[clamp(2.4rem,5.2vw,4.2rem)] font-extrabold text-[#18181B] tracking-[-0.045em] leading-[1.08] mb-6">
              L&apos;infrastructure moderne de votre gestion locative au{" "}
              <span className="font-serif italic font-normal text-[#52525B]">
                Bénin
              </span>
            </h1>

            <p className="text-[16px] sm:text-[18px] max-w-2xl mx-auto text-[#52525B] leading-relaxed mb-10">
              De l&apos;encaissement Mobile Money à l&apos;émission des quittances certifiées,
              Lokka transforme chaque tâche fastidieuse en un flux automatisé, fluide et 100% conforme.
            </p>

            <div className="flex flex-wrap justify-center items-center gap-4">
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-[#18181B] hover:bg-[#9D6B3C] text-white text-[13.5px] font-bold shadow-md transition-all duration-200"
              >
                Créer mon compte gratuit
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                href="/tarifs"
                className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-white hover:bg-[#F6EFE7] text-[#18181B] border border-[#E8E3DC] text-[13.5px] font-bold shadow-2xs transition-all duration-200"
              >
                Découvrir les forfaits
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Modules Grid */}
        <section className="container mx-auto max-w-5xl px-4 sm:px-6 pb-24">
          <div className="space-y-12 sm:space-y-16">
            {modules.map((mod, index) => {
              const Icon = mod.icon;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl bg-white border border-[#E8E3DC] p-8 sm:p-12 shadow-xs hover:border-[#9D6B3C]/40 transition-all duration-300"
                >
                  <div className="lg:col-span-7 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF9F6] border border-[#E8E3DC] text-[11.5px] font-bold text-[#9D6B3C]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#9D6B3C]" />
                      {mod.badge}
                    </div>

                    <h2 className="text-[24px] sm:text-[30px] font-extrabold text-[#18181B] tracking-tight leading-tight">
                      {mod.title}
                    </h2>

                    <p className="text-[14.5px] sm:text-[15px] text-[#52525B] leading-relaxed">
                      {mod.description}
                    </p>

                    <ul className="space-y-3 pt-2">
                      {mod.points.map((pt, i) => (
                        <li key={i} className="flex items-start gap-3 text-[13.5px] sm:text-[14px] text-[#18181B] font-medium">
                          <CheckCircleIcon className="h-5 w-5 text-[#15803D] shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="lg:col-span-5 bg-[#FAF9F6] border border-[#E8E3DC] rounded-2xl p-6 sm:p-8 flex flex-col justify-center items-center text-center min-h-[260px] relative overflow-hidden shadow-2xs">
                    <div className="h-16 w-16 rounded-2xl bg-white border border-[#E8E3DC] flex items-center justify-center mb-4 shadow-sm text-[#18181B]">
                      <Icon className="h-8 w-8 text-[#9D6B3C]" />
                    </div>
                    <span className="text-[11.5px] font-extrabold uppercase tracking-wider text-[#9D6B3C] mb-1">
                      {mod.highlight}
                    </span>
                    <span className="text-[13.5px] font-bold text-[#52525B]">
                      Optimisé pour Cotonou, Calavi, Porto-Novo &amp; Parakou
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Workflow Showcase */}
        <section className="bg-white py-20 border-y border-[#E8E3DC]">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F6EFE7] border border-[#E8E3DC] text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#9D6B3C] mb-4">
              Expérience en 3 étapes
            </div>
            <h2 className="text-[28px] sm:text-[34px] font-extrabold text-[#18181B] tracking-tight mb-12">
              Comment Lokka fonctionne au quotidien
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: "01",
                  title: "Ajoutez vos logements",
                  desc: "Renseignez vos appartements, villas ou boutiques en FCFA avec les détails du bail.",
                },
                {
                  step: "02",
                  title: "Invitez vos locataires",
                  desc: "Le locataire reçoit son contrat et règle directement par MTN MoMo, Moov ou espèces.",
                },
                {
                  step: "03",
                  title: "Collectez & Respirez",
                  desc: "Les règlements sont validés, les quittances générées et votre trésorerie mise à jour.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#FAF9F6] border border-[#E8E3DC] rounded-2xl p-8 text-left relative shadow-2xs hover:border-[#9D6B3C]/40 transition-colors"
                >
                  <div className="text-[32px] font-serif italic font-bold text-[#9D6B3C] mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-[17px] font-bold text-[#18181B] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[13.5px] text-[#52525B] leading-relaxed">
                    {item.desc}
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
