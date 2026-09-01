"use client";

import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import CTA from "@/components/landing/CTA";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { motion } from "framer-motion";
import {
  BanknotesIcon,
  DocumentCheckIcon,
  DevicePhoneMobileIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SparklesIcon,
  QrCodeIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export default function ProduitPage() {
  const modules = [
    {
      badge: "Paiements & Trésorerie",
      title: "Encaissements Mobile Money & Gestion des Espèces",
      description:
        "Offrez à vos locataires la simplicité de payer via MTN MoMo ou Moov Money. Pour les règlements en liquide, enregistrez les reçus en 1 clic avec preuve photo.",
      icon: BanknotesIcon,
      points: [
        "Liaison directe avec les comptes MTN Mobile Money & Moov Money",
        "Enregistrement des paiements en espèces avec archivage des reçus",
        "Rapprochement automatique et mise à jour instantanée du statut du bail",
        "Journal de trésorerie exportable pour votre comptabilité",
      ],
      highlight: "Zéro retard non identifié",
    },
    {
      badge: "Conformité Légale",
      title: "Contrats & Documents conformes Loi n° 2022-30",
      description:
        "Sécurisez chaque relation locative avec des documents certifiés, rédigés selon les exigences strictes de la législation béninoise sur le bail d'habitation.",
      icon: ShieldCheckIcon,
      points: [
        "Plafonnement automatique de la caution à 3 mois maximum",
        "Bail d'habitation type généré automatiquement en PDF",
        "État des lieux contradictoire avec téléversement de photos",
        "Modèles de mise en demeure et relances formelles en cas de litige",
      ],
      highlight: "100% conforme au droit béninois",
    },
    {
      badge: "Communication",
      title: "Rappels WhatsApp & Quittances Automatiques",
      description:
        "Fini la relance manuelle des locataires. Lokka envoie des rappels courtois via WhatsApp et transmet instantanément les quittances dès réception du paiement.",
      icon: DevicePhoneMobileIcon,
      points: [
        "Rappels d'échéance programmés à J-3 directement sur WhatsApp",
        "Émission instantanée d'une quittance de loyer détaillée en PDF",
        "Partage facile de la quittance en un clic sur WhatsApp ou par email",
        "Historique des notifications archivé dans le dossier locataire",
      ],
      highlight: "Le canal #1 au Bénin",
    },
    {
      badge: "Pilotage & Fiscalité",
      title: "Tableau de Bord & Estimation de la TFU",
      description:
        "Gardez une vision limpide sur vos flux financiers, calculez votre rentabilité nette et anticipez le règlement de la Taxe Foncière Unique.",
      icon: ChartBarIcon,
      points: [
        "Indicateurs clés : taux d'occupation, MRR en FCFA, loyers en retard",
        "Suivi des charges d'entretien, plomberie et factures SBEE/Eau",
        "Calcul automatique du rendement locatif net par bien",
        "Synthèse annuelle prête pour la déclaration de la TFU Bénin",
      ],
      highlight: "Clarté financière totale",
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
            <div className="section-label mb-4">Le Produit Lokka</div>
            <h1 className="heading-1 text-[#0F172A] text-[clamp(2.4rem,5.5vw,4.25rem)] leading-[1.12] mb-6">
              L&apos;infrastructure moderne de votre gestion locative au{" "}
              <span className="font-serif italic font-normal text-[#64635F]">
                Bénin
              </span>
            </h1>
            <p className="body-text text-lg max-w-2xl mx-auto text-[#64635F] mb-10">
              De l&apos;encaissement Mobile Money à l&apos;émission automatique des quittances,
              Lokka transforme chaque tâche fastidieuse en un processus fluide, transparent et sécurisé.
            </p>

            <div className="flex flex-wrap justify-center items-center gap-4">
              <Link
                href="/auth/register"
                className="btn-primary inline-flex items-center gap-2 py-3 px-6 text-[14px]"
              >
                Créer un compte gratuit
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                href="/tarifs"
                className="btn-secondary inline-flex items-center gap-2 py-3 px-6 text-[14px]"
              >
                Voir les tarifs
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Modules Grid */}
        <section className="container mx-auto max-w-5xl px-6 pb-24">
          <div className="space-y-16">
            {modules.map((mod, index) => {
              const Icon = mod.icon;
              const isEven = index % 2 === 1;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-[12px] bg-white border border-[#E8E5E0] p-8 sm:p-12 shadow-sm ${
                    isEven ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  <div className="lg:col-span-7">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF9F6] border border-[#E8E5E0] text-[12px] font-semibold text-[#D97706] mb-4">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#D97706]" />
                      {mod.badge}
                    </div>

                    <h2 className="heading-2 text-[#0F172A] text-[26px] sm:text-[32px] mb-4">
                      {mod.title}
                    </h2>

                    <p className="body-text text-[15px] text-[#64635F] mb-6 leading-relaxed">
                      {mod.description}
                    </p>

                    <ul className="space-y-3">
                      {mod.points.map((pt, i) => (
                        <li key={i} className="flex items-start gap-3 text-[14px] text-[#0F172A]">
                          <CheckCircleIcon className="h-5 w-5 text-[#D97706] shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="lg:col-span-5 bg-[#FAF9F6] border border-[#E8E5E0] rounded-[8px] p-6 flex flex-col justify-center items-center text-center min-h-[260px] relative overflow-hidden">
                    <div className="h-16 w-16 rounded-full bg-white border border-[#E8E5E0] flex items-center justify-center mb-4 shadow-sm">
                      <Icon className="h-8 w-8 text-[#0F172A]" />
                    </div>
                    <span className="text-[12px] font-bold uppercase tracking-wider text-[#D97706] mb-1">
                      {mod.highlight}
                    </span>
                    <span className="text-[14px] font-medium text-[#64635F]">
                      Optimisé pour Cotonou, Calavi &amp; Porto-Novo
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Workflow Showcase */}
        <section className="bg-[#F3F1ED] py-20 border-y border-[#E8E5E0]">
          <div className="container mx-auto max-w-5xl px-6 text-center">
            <div className="section-label mb-3">Expérience Simplifiée</div>
            <h2 className="heading-2 text-[#0F172A] text-[30px] mb-12">
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
                  desc: "Le locataire reçoit son contrat et ses coordonnées de paiement Mobile Money ou espèces.",
                },
                {
                  step: "03",
                  title: "Collectez & Dormez serein",
                  desc: "Les règlements sont enregistrés, les quittances générées et votre comptabilité mise à jour.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-[#E8E5E0] rounded-[8px] p-8 text-left relative"
                >
                  <div className="text-[28px] font-serif italic text-[#D97706] mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-[18px] font-bold text-[#0F172A] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[14px] text-[#64635F] leading-relaxed">
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
