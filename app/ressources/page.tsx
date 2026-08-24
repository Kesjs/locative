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
  ExclamationTriangleIcon,
  ShieldCheckIcon,
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
      desc: "L'article 10 de la Loi 2022-30 interdit formellement d'exiger plus de 3 mois de loyer au titre de la caution ou du dépôt de garantie.",
      status: "Obligatoire",
    },
    {
      title: "Durée légale minimale du bail (1 an)",
      desc: "Tout contrat de bail à usage d'habitation est conclu pour une durée minimale d'un (01) an renouvelable, sauf accord écrit particulier.",
      status: "Obligatoire",
    },
    {
      title: "Délivrance obligatoire de la quittance",
      desc: "Le bailleur ou son gestionnaire est tenu de délivrer gratuitement une quittance mentionnant le détail du loyer et des charges à chaque règlement.",
      status: "Obligatoire",
    },
    {
      title: "Plafonnement des honoraires de gestion (10%)",
      desc: "Les commissions des agences et démarcheurs pour la gestion locative continue ne peuvent excéder 10% des sommes encaissées.",
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
      desc: "Modèle conforme Loi 2022-30 avec clauses obligatoires, durée et modalités de paiement.",
      format: "PDF & DOCX",
    },
    {
      title: "Fiche d'état des lieux contradictoire",
      desc: "Grille d'inspection pièce par pièce avec emplacements pour relevés de compteurs SBEE/Eau.",
      format: "PDF",
    },
    {
      title: "Reçu de versement de caution légale",
      desc: "Attestation formelle de remise du dépôt de garantie (3 mois max) avec conditions de restitution.",
      format: "PDF",
    },
    {
      title: "Mise en demeure pour loyers impayés",
      desc: "Modèle de lettre de relance juridique conforme aux délais légaux de préavis avant contentieux.",
      format: "PDF & DOCX",
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
            <div className="section-label mb-4">Centre de Ressources</div>
            <h1 className="heading-1 text-[#1C1C1C] text-[clamp(2.4rem,5.5vw,4.25rem)] leading-[1.12] mb-6">
              Le guide essentiel de la gestion locative au{" "}
              <span className="font-serif italic font-normal text-[#64635F]">
                Bénin
              </span>
            </h1>
            <p className="body-text text-lg max-w-2xl mx-auto text-[#64635F]">
              Maîtrisez les exigences de la Loi n° 2022-30, téléchargez vos modèles juridiques certifiés et simulez la rentabilité de vos investissements.
            </p>
          </motion.div>
        </section>

        {/* Section 1: Loi 2022-30 Guide */}
        <section className="container mx-auto max-w-5xl px-6 pb-20">
          <div className="bg-white border border-[#E8E5E0] rounded-[12px] p-8 sm:p-12 shadow-sm mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-full bg-[#FAF9F6] border border-[#E8E5E0] flex items-center justify-center">
                <ScaleIcon className="h-5 w-5 text-[#087F5B]" />
              </div>
              <div>
                <h2 className="text-[22px] font-bold text-[#1C1C1C]">
                  Ce que change la Loi n° 2022-30 pour les bailleurs
                </h2>
                <p className="text-[13px] text-[#64635F]">
                  Promulguée pour encadrer les baux d&apos;habitation au Bénin et protéger propriétaires et locataires.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#E8E5E0]">
              {lawPoints.map((point, index) => (
                <div key={index} className="p-5 rounded-[8px] bg-[#FAF9F6] border border-[#E8E5E0]">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="text-[15px] font-bold text-[#1C1C1C]">
                      {point.title}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#E6F5EF] text-[#087F5B] border border-[#087F5B]/20">
                      {point.status}
                    </span>
                  </div>
                  <p className="text-[13px] text-[#64635F] leading-relaxed">
                    {point.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2: Simulator Tool */}
        <section className="bg-[#F3F1ED] py-20 border-y border-[#E8E5E0] mb-20">
          <div className="container mx-auto max-w-5xl px-6">
            <div className="text-center mb-12">
              <div className="section-label mb-2">Outil Interactif</div>
              <h2 className="heading-2 text-[#1C1C1C] text-[28px] mb-3">
                Simulateur de Rendement Locatif (FCFA)
              </h2>
              <p className="body-text text-[#64635F]">
                Estimez le rendement brut et net de votre bien immobilier à Cotonou ou Calavi.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-[#E8E5E0] rounded-[12px] p-8 sm:p-10 shadow-sm">
              {/* Inputs */}
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <label className="block text-[13px] font-semibold text-[#1C1C1C] mb-2">
                    Valeur d&apos;achat ou estimation du bien (FCFA)
                  </label>
                  <input
                    type="number"
                    value={propertyPrice}
                    onChange={(e) => setPropertyPrice(Number(e.target.value) || 0)}
                    className="input w-full"
                    placeholder="35000000"
                  />
                  <span className="text-[11px] text-[#9C9A95] mt-1 block">
                    Ex: 35 000 000 FCFA pour une villa à Fidjrossè
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-[#1C1C1C] mb-2">
                      Loyer mensuel prévu (FCFA)
                    </label>
                    <input
                      type="number"
                      value={monthlyRent}
                      onChange={(e) => setMonthlyRent(Number(e.target.value) || 0)}
                      className="input w-full"
                      placeholder="250000"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-[#1C1C1C] mb-2">
                      Charges &amp; entretien annuels (FCFA)
                    </label>
                    <input
                      type="number"
                      value={annualCharges}
                      onChange={(e) => setAnnualCharges(Number(e.target.value) || 0)}
                      className="input w-full"
                      placeholder="350000"
                    />
                  </div>
                </div>
              </div>

              {/* Result KPI Card */}
              <div className="lg:col-span-5 bg-[#1C1C1C] text-white rounded-[10px] p-6 text-center flex flex-col justify-center">
                <div className="text-[11px] font-bold uppercase tracking-widest text-[#E6F5EF] mb-2">
                  Résultats de rentabilité
                </div>

                <div className="mb-4">
                  <div className="text-[40px] font-serif font-bold text-white leading-none mb-1">
                    {netYield}%
                  </div>
                  <div className="text-[12px] text-white/70">
                    Rendement locatif net estimé
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-2 text-left text-[12px]">
                  <div>
                    <span className="text-white/60 block">Rendement brut :</span>
                    <span className="font-bold text-white">{grossYield}%</span>
                  </div>
                  <div>
                    <span className="text-white/60 block">Revenu net / an :</span>
                    <span className="font-bold text-[#E6F5EF]">
                      {netAnnualRent.toLocaleString("fr-FR")} F
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Document Templates */}
        <section className="container mx-auto max-w-5xl px-6 pb-24">
          <div className="text-center mb-12">
            <div className="section-label mb-2">Modèles Juridiques</div>
            <h2 className="heading-2 text-[#1C1C1C] text-[28px] mb-3">
              Modèles types certifiés à télécharger
            </h2>
            <p className="body-text text-[#64635F]">
              Utilisez nos modèles rédigés par des juristes béninois pour sécuriser votre gestion locative.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templates.map((tpl, i) => (
              <div
                key={i}
                className="p-6 rounded-[8px] bg-white border border-[#E8E5E0] shadow-sm flex flex-col justify-between hover:border-[#1C1C1C] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-9 w-9 rounded-full bg-[#FAF9F6] border border-[#E8E5E0] flex items-center justify-center">
                      <DocumentTextIcon className="h-5 w-5 text-[#1C1C1C]" />
                    </div>
                    <span className="text-[11px] font-bold text-[#64635F] bg-[#FAF9F6] px-2.5 py-1 rounded border border-[#E8E5E0]">
                      {tpl.format}
                    </span>
                  </div>

                  <h3 className="text-[16px] font-bold text-[#1C1C1C] mb-2">
                    {tpl.title}
                  </h3>
                  <p className="text-[13px] text-[#64635F] leading-relaxed mb-6">
                    {tpl.desc}
                  </p>
                </div>

                <Link href="/auth/register" className="mt-auto">
                  <button className="btn-secondary w-full py-2.5 text-[13px] flex items-center justify-center gap-2">
                    <ArrowDownTrayIcon className="h-4 w-4 text-[#087F5B]" />
                    Accéder au modèle (Gratuit)
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
