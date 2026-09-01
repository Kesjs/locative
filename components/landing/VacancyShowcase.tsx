"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { CalendarDays, Check, Eye, Globe2, MessageCircle, Send } from "lucide-react";
import { VACANT_LISTING, formatFcfa } from "./landing-data";

export default function VacancyShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const [step, setStep] = useState(0);
  const [isRequested, setIsRequested] = useState(false);

  useEffect(() => {
    if (!isInView) return;
    
    let timeouts: NodeJS.Timeout[] = [];
    
    timeouts.push(setTimeout(() => setStep(1), 700));  // Titre
    timeouts.push(setTimeout(() => setStep(2), 1400)); // Localisation & Loyer
    timeouts.push(setTimeout(() => setStep(3), 2100)); // Caractéristiques
    timeouts.push(setTimeout(() => setStep(4), 2800)); // Clic bouton
    timeouts.push(setTimeout(() => setStep(5), 3100)); // Publié

    return () => timeouts.forEach(clearTimeout);
  }, [isInView]);

  const isPublished = step >= 5;

  return (
    <section id="vitrine" className="landing-section bg-[#FAF9F6] py-20 sm:py-28" ref={containerRef}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end"
        >
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#9D6B3C]">Vitrine &amp; acquisition</p>
            <h2 className="mt-4 max-w-[760px] text-[clamp(2.1rem,4.2vw,3.3rem)] font-extrabold leading-[1.02] tracking-[-0.05em] text-[#18181B]">
              Un bien vacant devient visible en 1 clic.
            </h2>
          </div>
          <p className="max-w-[340px] text-[14px] leading-relaxed text-[#3F3F46]">
            Publiez les données déjà saisies dans votre portefeuille. Aucun outil tiers nécessaire pour recevoir des demandes de visite qualifiées.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 grid rounded-lg border border-[#E8E3DC] bg-white shadow-xs lg:grid-cols-[1fr_96px_1fr] overflow-hidden"
        >
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between gap-3 border-b border-[#E8E3DC] pb-4">
              <p className="text-[13px] font-bold text-[#18181B]">Dans votre portefeuille bailleur</p>
              <span className={`rounded-md px-2.5 py-0.5 text-[11px] font-extrabold ${isPublished ? "bg-[#15803D]/10 text-[#15803D]" : "bg-[#9D6B3C]/10 text-[#9D6B3C]"}`}>
                {isPublished ? "Publié en ligne" : "Prêt à publier"}
              </span>
            </div>
            <div className="pt-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#71717A]">Titre de l'annonce</label>
                <div className="flex h-[42px] items-center rounded-md border border-[#E8E3DC] bg-[#FAF9F6] px-3.5 text-[13.5px] font-semibold text-[#18181B]">
                  <span className={`transition-opacity duration-500 ${step >= 1 ? "opacity-100" : "opacity-0"}`}>{VACANT_LISTING.title}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#71717A]">Localisation</label>
                  <div className="flex h-[42px] items-center rounded-md border border-[#E8E3DC] bg-[#FAF9F6] px-3.5 text-[13.5px] font-semibold text-[#18181B]">
                    <span className={`transition-opacity duration-500 ${step >= 2 ? "opacity-100" : "opacity-0"}`}>{VACANT_LISTING.location}</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#71717A]">Loyer mensuel</label>
                  <div className="flex h-[42px] items-center rounded-md border border-[#E8E3DC] bg-[#FAF9F6] px-3.5 text-[13.5px] font-semibold text-[#18181B]">
                    <span className={`transition-opacity duration-500 ${step >= 2 ? "opacity-100" : "opacity-0"}`}>{formatFcfa(VACANT_LISTING.rentFcfa)}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#71717A]">Équipements & Caractéristiques</label>
                <div className="rounded-md border border-[#E8E3DC] bg-[#FAF9F6] p-3.5 min-h-[82px]">
                  <ul className={`grid gap-2 text-[12px] font-medium text-[#3F3F46] sm:grid-cols-2 transition-opacity duration-500 ${step >= 3 ? "opacity-100" : "opacity-0"}`}>
                    {VACANT_LISTING.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check size={14} className="text-[#15803D] shrink-0 font-bold" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center border-y border-[#E8E3DC] bg-[#FAF9F6] py-5 lg:border-x lg:border-y-0">
            <button 
              type="button" 
              onClick={() => { if(step < 5) setStep(5); else setStep(0); }} 
              aria-pressed={isPublished} 
              className={`inline-flex items-center gap-2 rounded-md bg-[#9D6B3C] px-4 py-2.5 text-[12px] font-bold text-white transition-all duration-200 hover:bg-[#85572E] shadow-sm cursor-pointer lg:[writing-mode:vertical-rl] ${step === 4 ? "scale-90 bg-[#85572E]" : "scale-100"}`}
            >
              <span>{isPublished ? "Annonce en ligne" : "Publier sur la vitrine"}</span>
              <Send aria-hidden="true" size={14} className={`transition-transform ${isPublished ? "-translate-y-1 lg:translate-x-1 lg:-translate-y-0 opacity-90" : ""}`} />
            </button>
          </div>

          <div className={`p-6 sm:p-8 transition-all duration-700 ease-out bg-white ${isPublished ? "opacity-100 blur-none translate-y-0" : "opacity-35 blur-[3px] translate-y-3 pointer-events-none select-none"}`}>
            <div className="flex items-center justify-between gap-3 border-b border-[#E8E3DC] pb-4">
              <p className="text-[13px] font-bold text-[#18181B]">Rendu sur votre site vitrine public</p>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#15803D]/10 px-2.5 py-0.5 text-[11px] font-extrabold text-[#15803D]">
                <Globe2 aria-hidden="true" size={13} /> {isPublished ? "En ligne" : "Prêt"}
              </span>
            </div>
            <div className="pt-6">
              <div className="mb-4 aspect-[16/10] w-full overflow-hidden rounded-md bg-[#E8E3DC] shadow-xs relative">
                <Image 
                  src="/vitrine-appartement.jpg" 
                  alt="Appartement F3 Standing" 
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105" 
                />
              </div>
              <p className="font-mono text-[11px] font-semibold text-[#71717A]">{VACANT_LISTING.domain}</p>
              <h3 className="mt-1 text-[19px] font-bold tracking-[-0.03em] text-[#18181B]">{VACANT_LISTING.title}</h3>
              <p className="mt-1 text-[17px] font-extrabold text-[#18181B]">
                {formatFcfa(VACANT_LISTING.rentFcfa)} <span className="text-[12px] font-medium text-[#71717A]">/ mois</span>
              </p>
              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                <button type="button" onClick={() => setIsRequested((current) => !current)} aria-pressed={isRequested} className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-[#E8E3DC] bg-white px-3.5 py-2.5 text-[12px] font-bold text-[#18181B] hover:bg-[#FAF9F6] transition-colors cursor-pointer shadow-xs">
                  <span>{isRequested ? "Visite confirmée" : "Demander une visite"}</span>
                  <CalendarDays aria-hidden="true" size={14} className="text-[#9D6B3C]" />
                </button>
                <button type="button" className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-[#18181B] px-3.5 py-2.5 text-[12px] font-bold text-white hover:bg-[#9D6B3C] transition-colors cursor-pointer shadow-xs">
                  <MessageCircle aria-hidden="true" size={14} />
                  <span>WhatsApp direct</span>
                </button>
              </div>
              <p aria-live="polite" className={`mt-3 flex items-center justify-center gap-1.5 text-[12px] font-bold text-[#15803D] transition-opacity ${isRequested ? "opacity-100" : "opacity-0"}`}>
                <Check aria-hidden="true" size={15} /> Demande de visite reçue dans votre espace
              </p>
            </div>
          </div>
        </motion.div>
        <div className="mt-4 flex items-center gap-2 text-[12px] font-medium text-[#71717A]">
          <Eye aria-hidden="true" size={14} className="text-[#9D6B3C]" />
          <span>Les mêmes informations alimentent la gestion locative et la vitrine publique sans double saisie.</span>
        </div>
      </div>
    </section>
  );
}
