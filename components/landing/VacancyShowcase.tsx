"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CalendarDays, Check, Eye, Globe2, MessageCircle, Send } from "lucide-react";
import { VACANT_LISTING, formatFcfa } from "./landing-data";

export default function VacancyShowcase() {
  const [step, setStep] = useState(0);
  const [isRequested, setIsRequested] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((current) => (current + 1) % 6);
    }, 2400);

    return () => clearInterval(timer);
  }, []);

  const isPublished = step >= 4;

  return (
    <section id="vitrine" className="landing-section bg-white py-16 sm:py-24 border-t border-slate-200/80">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end"
        >
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Vitrine &amp; acquisition</p>
            <h2 className="mt-2 max-w-[700px] text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
              Un bien vacant devient visible en 1 clic.
            </h2>
          </div>
          <p className="max-w-[360px] text-[14px] leading-relaxed text-slate-600">
            Publiez les données déjà saisies dans votre portefeuille. Aucun outil tiers nécessaire pour recevoir des demandes de visite qualifiées.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 grid rounded-2xl border border-slate-200 bg-white shadow-xs lg:grid-cols-[1fr_96px_1fr] overflow-hidden"
        >
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <p className="text-[13px] font-bold text-slate-900">Dans votre portefeuille bailleur</p>
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${isPublished ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>
                {isPublished ? "Publié en ligne" : "Prêt à publier"}
              </span>
            </div>
            <div className="pt-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-500">Titre de l'annonce</label>
                <div className="flex h-[42px] items-center rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 text-[13.5px] font-medium text-slate-900">
                  <span className={`transition-opacity duration-500 ${step >= 1 ? "opacity-100" : "opacity-0"}`}>{VACANT_LISTING.title}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-500">Localisation</label>
                  <div className="flex h-[42px] items-center rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 text-[13.5px] font-medium text-slate-900">
                    <span className={`transition-opacity duration-500 ${step >= 2 ? "opacity-100" : "opacity-0"}`}>{VACANT_LISTING.location}</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-500">Loyer mensuel</label>
                  <div className="flex h-[42px] items-center rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 text-[13.5px] font-semibold text-slate-900">
                    <span className={`transition-opacity duration-500 ${step >= 2 ? "opacity-100" : "opacity-0"}`}>{formatFcfa(VACANT_LISTING.rentFcfa)}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-500">Équipements &amp; Caractéristiques</label>
                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 min-h-[82px]">
                  <ul className={`grid gap-2 text-[12px] font-medium text-slate-600 sm:grid-cols-2 transition-opacity duration-500 ${step >= 3 ? "opacity-100" : "opacity-0"}`}>
                    {VACANT_LISTING.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-600 shrink-0 font-bold" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center border-y border-slate-100 bg-slate-50/70 py-5 lg:border-x lg:border-y-0">
            <button 
              type="button" 
              onClick={() => { if(step < 5) setStep(5); else setStep(0); }} 
              aria-pressed={isPublished} 
              className={`inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-[12px] font-semibold text-white transition-all duration-200 hover:bg-emerald-700 shadow-sm cursor-pointer lg:[writing-mode:vertical-rl] ${step === 4 ? "scale-95 bg-emerald-700" : "scale-100"}`}
            >
              <span>{isPublished ? "Annonce en ligne" : "Publier sur la vitrine"}</span>
              <Send aria-hidden="true" size={14} className={`transition-transform ${isPublished ? "-translate-y-1 lg:translate-x-1 lg:-translate-y-0 opacity-90" : ""}`} />
            </button>
          </div>

          <div className={`p-6 sm:p-8 transition-all duration-700 ease-out bg-white ${isPublished ? "opacity-100 blur-none translate-y-0" : "opacity-35 blur-[3px] translate-y-3 pointer-events-none select-none"}`}>
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <p className="text-[13px] font-bold text-slate-900">Rendu sur votre site vitrine public</p>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
                <Globe2 aria-hidden="true" size={13} /> {isPublished ? "En ligne" : "Prêt"}
              </span>
            </div>
            <div className="pt-6">
              <div className="mb-4 aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-100 shadow-xs relative">
                <Image 
                  src="/vitrine-appartement.jpg" 
                  alt="Appartement F3 Standing" 
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105" 
                />
              </div>
              <p className="font-mono text-[11px] font-medium text-slate-500">{VACANT_LISTING.domain}</p>
              <h3 className="mt-1 text-[18px] font-bold tracking-tight text-slate-900">{VACANT_LISTING.title}</h3>
              <p className="mt-1 text-[16px] font-bold text-slate-900">
                {formatFcfa(VACANT_LISTING.rentFcfa)} <span className="text-[12px] font-normal text-slate-500">/ mois</span>
              </p>
              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                <button type="button" onClick={() => setIsRequested((current) => !current)} aria-pressed={isRequested} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[12px] font-semibold text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer shadow-xs">
                  <span>{isRequested ? "Visite confirmée" : "Demander une visite"}</span>
                  <CalendarDays aria-hidden="true" size={14} className="text-emerald-600" />
                </button>
                <button type="button" className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2.5 text-[12px] font-semibold text-white hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs">
                  <MessageCircle aria-hidden="true" size={14} />
                  <span>WhatsApp direct</span>
                </button>
              </div>
              <p aria-live="polite" className={`mt-3 flex items-center justify-center gap-1.5 text-[12px] font-semibold text-emerald-700 transition-opacity ${isRequested ? "opacity-100" : "opacity-0"}`}>
                <Check aria-hidden="true" size={15} /> Demande de visite reçue dans votre espace
              </p>
            </div>
          </div>
        </motion.div>
        <div className="mt-4 flex items-center gap-2 text-[12px] font-medium text-slate-500">
          <Eye aria-hidden="true" size={14} className="text-emerald-600" />
          <span>Les mêmes informations alimentent la gestion locative et la vitrine publique sans double saisie.</span>
        </div>
      </div>
    </section>
  );
}
