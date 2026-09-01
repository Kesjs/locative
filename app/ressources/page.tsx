"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import CTA from "@/components/landing/CTA";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { motion } from "framer-motion";
import {
  DocumentTextIcon,
  ScaleIcon,
  CalculatorIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

export default function RessourcesPage() {
  // Simulator State
  const [propertyPrice, setPropertyPrice] = useState<number>(35000000); // 35M FCFA
  const [monthlyRent, setMonthlyRent] = useState<number>(250000); // 250k FCFA
  const [annualCharges, setAnnualCharges] = useState<number>(350000); // 350k FCFA

  const annualRent = monthlyRent * 12;
  const grossYield = propertyPrice > 0 ? ((annualRent / propertyPrice) * 100).toFixed(2) : "0.00";
  const netAnnualRent = annualRent - annualCharges;
  const netYield = propertyPrice > 0 ? ((netAnnualRent / propertyPrice) * 100).toFixed(2) : "0.00";

  const lawPoints = [
    {
      title: "Plafonnement strict de la caution (3 mois max)",
      desc: "L'article 10 de la Loi n° 2022-30 interdit formellement d'exiger plus de 3 mois de loyer au titre de la caution ou du dépôt de garantie au Bénin.",
      status: "Obligatoire",
    },
    {
      title: "Durée légale minimale du bail (1 an)",
      desc: "Tout contrat de bail à usage d'habitation est conclu pour une durée minimale d'un (01) an renouvelable, sauf accord écrit particulier.",
      status: "Obligatoire",
    },
    {
      title: "Délivrance obligatoire de la quittance",
      desc: "Le bailleur ou son agence est tenu de délivrer gratuitement une quittance mentionnant le détail du loyer et des charges à chaque règlement.",
      status: "Obligatoire",
    },
    {
      title: "Plafonnement des honoraires de gestion (10%)",
      desc: "Les commissions des agences et gestionnaires pour la gestion locative continue ne peuvent excéder 10% des sommes perçues.",
      status: "Réglementé",
    },
    {
      title: "État des lieux contradictoire",
      desc: "L'état des lieux d'entrée et de sortie doit être établi contradictoirement en présence des deux parties et annexé au contrat de bail.",
      status: "Obligatoire",
    },
  ];

  const templates = [
    {
      title: "Contrat de bail d'habitation type Bénin",
      desc: "Modèle certifié conforme Loi n° 2022-30 avec clauses obligatoires, durée et modalités de paiement.",
      format: "PDF & DOCX",
    },
    {
      title: "Fiche d'état des lieux contradictoire",
      desc: "Grille d'inspection pièce par pièce avec emplacements pour relevés de compteurs SBEE / SONEB.",
      format: "PDF",
    },
    {
      title: "Reçu de versement de caution légale",
      desc: "Attestation formelle de remise du dépôt de garantie (3 mois max) avec conditions de restitution.",
      format: "PDF",
    },
    {
      title: "Mise en demeure pour loyers impayés",
      desc: "Modèle de relance juridique formelle conforme aux délais légaux de préavis avant contentieux.",
      format: "PDF & DOCX",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FAF9F6] pt-28 sm:pt-36">
        {/* Hero Section */}
        <section className="container mx-auto max-w-5xl px-4 sm:px-6 text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F6EFE7] border border-[#E8E3DC] text-[11.5px] font-extrabold uppercase tracking-[0.14em] text-[#9D6B3C] mb-5">
              <SparklesIcon className="w-3.5 h-3.5" />
              Centre de Ressources
            </div>

            <h1 className="text-[clamp(2.4rem,5.2vw,4.2rem)] font-extrabold text-[#18181B] tracking-[-0.045em] leading-[1.08] mb-6">
              Le guide essentiel de la gestion locative au{" "}
              <span className="font-serif italic font-normal text-[#52525B]">
                Bénin
              </span>
            </h1>

            <p className="text-[16px] sm:text-[18px] max-w-2xl mx-auto text-[#52525B] leading-relaxed">
              Maîtrisez les exigences de la Loi n° 2022-30, téléchargez vos modèles juridiques certifiés et simulez la rentabilité de vos investissements.
            </p>
          </motion.div>
        </section>

        {/* Section 1: Loi 2022-30 Guide */}
        <section className="container mx-auto max-w-5xl px-4 sm:px-6 pb-20">
          <div className="bg-white border border-[#E8E3DC] rounded-3xl p-8 sm:p-12 shadow-xs mb-16">
            <div className="flex items-center gap-3.5 mb-8">
              <div className="h-12 w-12 rounded-2xl bg-[#F6EFE7] border border-[#E8E3DC] flex items-center justify-center text-[#9D6B3C]">
                <ScaleIcon className="h-6 w-6 text-[#9D6B3C]" />
              </div>
              <div>
                <h2 className="text-[22px] sm:text-[26px] font-extrabold text-[#18181B] tracking-tight">
                  Ce que change la Loi n° 2022-30 pour les bailleurs
                </h2>
                <p className="text-[13.5px] text-[#52525B]">
                  Promulguée pour encadrer les baux d&apos;habitation au Bénin et protéger propriétaires et locataires.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#E8E3DC]">
              {lawPoints.map((point, index) => (
                <div key={index} className="p-6 rounded-2xl bg-[#FAF9F6] border border-[#E8E3DC] shadow-2xs hover:border-[#9D6B3C]/40 transition-colors">
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <h3 className="text-[15px] font-bold text-[#18181B]">
                      {point.title}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                      {point.status}
                    </span>
                  </div>
                  <p className="text-[13.5px] text-[#52525B] leading-relaxed">
                    {point.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2: Simulator Tool */}
        <section className="bg-white py-20 border-y border-[#E8E3DC] mb-20">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F6EFE7] border border-[#E8E3DC] text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#9D6B3C] mb-3">
                Outil Interactif
              </div>
              <h2 className="text-[28px] sm:text-[34px] font-extrabold text-[#18181B] tracking-tight mb-2">
                Simulateur de Rendement Locatif (FCFA)
              </h2>
              <p className="text-[14.5px] text-[#52525B]">
                Estimez le rendement brut et net de votre bien immobilier à Cotonou, Calavi ou Porto-Novo.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FAF9F6] border border-[#E8E3DC] rounded-3xl p-8 sm:p-10 shadow-xs">
              {/* Inputs */}
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <label className="block text-[13px] font-bold text-[#18181B] mb-2">
                    Valeur d&apos;achat ou estimation du bien (FCFA)
                  </label>
                  <input
                    type="number"
                    value={propertyPrice}
                    onChange={(e) => setPropertyPrice(Number(e.target.value) || 0)}
                    className="w-full h-12 px-4 rounded-xl bg-white border border-[#E8E3DC] text-[#18181B] font-bold text-[15px] focus:outline-none focus:border-[#9D6B3C] focus:ring-4 focus:ring-[#9D6B3C]/15 shadow-2xs"
                    placeholder="35000000"
                  />
                  <span className="text-[11.5px] text-[#71717A] mt-1.5 block">
                    Ex: 35 000 000 FCFA pour une villa à Fidjrossè ou Haie Vive
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-bold text-[#18181B] mb-2">
                      Loyer mensuel prévu (FCFA)
                    </label>
                    <input
                      type="number"
                      value={monthlyRent}
                      onChange={(e) => setMonthlyRent(Number(e.target.value) || 0)}
                      className="w-full h-12 px-4 rounded-xl bg-white border border-[#E8E3DC] text-[#18181B] font-bold text-[15px] focus:outline-none focus:border-[#9D6B3C] focus:ring-4 focus:ring-[#9D6B3C]/15 shadow-2xs"
                      placeholder="250000"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-[#18181B] mb-2">
                      Charges &amp; entretien annuels (FCFA)
                    </label>
                    <input
                      type="number"
                      value={annualCharges}
                      onChange={(e) => setAnnualCharges(Number(e.target.value) || 0)}
                      className="w-full h-12 px-4 rounded-xl bg-white border border-[#E8E3DC] text-[#18181B] font-bold text-[15px] focus:outline-none focus:border-[#9D6B3C] focus:ring-4 focus:ring-[#9D6B3C]/15 shadow-2xs"
                      placeholder="350000"
                    />
                  </div>
                </div>
              </div>

              {/* Result KPI Card */}
              <div className="lg:col-span-5 bg-[#18181B] text-white rounded-2xl p-7 text-center flex flex-col justify-center shadow-xl">
                <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#9D6B3C] mb-2">
                  Résultats de Rentabilité
                </div>

                <div className="mb-5">
                  <div className="text-[44px] font-serif font-bold text-white leading-none mb-1">
                    {netYield}%
                  </div>
                  <div className="text-[12px] text-white/70">
                    Rendement locatif net estimé
                  </div>
                </div>

                <div className="pt-4 border-t border-white/15 grid grid-cols-2 gap-3 text-left text-[12px]">
                  <div>
                    <span className="text-white/60 block mb-0.5">Rendement brut :</span>
                    <span className="font-extrabold text-white text-[14px]">{grossYield}%</span>
                  </div>
                  <div>
                    <span className="text-white/60 block mb-0.5">Revenu net / an :</span>
                    <span className="font-extrabold text-emerald-400 text-[14px] tabular-nums">
                      {netAnnualRent.toLocaleString("fr-FR")} F
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Document Templates */}
        <section className="container mx-auto max-w-5xl px-4 sm:px-6 pb-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F6EFE7] border border-[#E8E3DC] text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#9D6B3C] mb-3">
              Modèles Juridiques
            </div>
            <h2 className="text-[28px] sm:text-[34px] font-extrabold text-[#18181B] tracking-tight mb-2">
              Modèles types certifiés à télécharger
            </h2>
            <p className="text-[14.5px] text-[#52525B]">
              Utilisez nos modèles rédigés par des juristes béninois pour sécuriser votre gestion locative.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templates.map((tpl, i) => (
              <div
                key={i}
                className="p-7 rounded-3xl bg-white border border-[#E8E3DC] shadow-xs flex flex-col justify-between hover:border-[#9D6B3C]/50 transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-10 w-10 rounded-2xl bg-[#FAF9F6] border border-[#E8E3DC] flex items-center justify-center text-[#9D6B3C]">
                      <DocumentTextIcon className="h-5 w-5 text-[#9D6B3C]" />
                    </div>
                    <span className="text-[11px] font-extrabold text-[#52525B] bg-[#FAF9F6] px-3 py-1 rounded-full border border-[#E8E3DC]">
                      {tpl.format}
                    </span>
                  </div>

                  <h3 className="text-[17px] font-bold text-[#18181B] mb-2">
                    {tpl.title}
                  </h3>
                  <p className="text-[13.5px] text-[#52525B] leading-relaxed mb-6">
                    {tpl.desc}
                  </p>
                </div>

                <Link href="/auth/register" className="mt-auto">
                  <button className="w-full h-11 rounded-xl bg-[#FAF9F6] hover:bg-[#18181B] hover:text-white text-[#18181B] border border-[#E8E3DC] text-[13px] font-bold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-2xs">
                    <ArrowDownTrayIcon className="h-4 w-4 text-[#9D6B3C]" />
                    <span>Télécharger le modèle (Gratuit)</span>
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
