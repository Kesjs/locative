"use client";

import { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";
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
    
    timeouts.push(setTimeout(() => setStep(1), 800));  // Titre
    timeouts.push(setTimeout(() => setStep(2), 1600)); // Localisation & Loyer
    timeouts.push(setTimeout(() => setStep(3), 2400)); // Caractéristiques
    timeouts.push(setTimeout(() => setStep(4), 3200)); // Clic bouton
    timeouts.push(setTimeout(() => setStep(5), 3500)); // Publié

    return () => timeouts.forEach(clearTimeout);
  }, [isInView]);

  const isPublished = step >= 5;

  return (
    <section id="vitrine" className="landing-section bg-bg-canvas py-20 sm:py-28" ref={containerRef}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div data-landing-reveal className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div><p className="landing-label">Vitrine &amp; acquisition</p><h2 className="mt-4 max-w-[760px] text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1] tracking-[-0.06em] text-text-primary">Un bien vacant devient visible.</h2></div>
          <p className="max-w-[300px] text-[13px] leading-relaxed text-text-secondary">Publiez les données déjà présentes dans votre portefeuille. Pas besoin d&apos;un deuxième outil pour recevoir une demande de visite.</p>
        </div>

        <div data-landing-reveal className="mt-12 grid border-y border-border-default bg-white lg:grid-cols-[1fr_90px_1fr]">
          <div className="p-5 sm:p-7">
            <div className="flex items-center justify-between gap-3 border-b border-border-default pb-4"><p className="text-[12px] font-semibold text-text-primary">Dans votre portefeuille</p><span className={`text-[10px] font-semibold ${isPublished ? "text-success-strong" : "text-warning"}`}>{isPublished ? "Publié" : "À publier"}</span></div>
            <div className="pt-5 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-medium text-text-muted">Titre de l'annonce</label>
                <div className="flex h-[38px] items-center rounded-md border border-border-default bg-bg-canvas px-3 text-[13px] text-text-primary">
                  <span className={`transition-opacity duration-500 ${step >= 1 ? "opacity-100" : "opacity-0"}`}>{VACANT_LISTING.title}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-medium text-text-muted">Localisation</label>
                  <div className="flex h-[38px] items-center rounded-md border border-border-default bg-bg-canvas px-3 text-[13px] text-text-primary">
                    <span className={`transition-opacity duration-500 ${step >= 2 ? "opacity-100" : "opacity-0"}`}>{VACANT_LISTING.location}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-medium text-text-muted">Loyer mensuel</label>
                  <div className="flex h-[38px] items-center rounded-md border border-border-default bg-bg-canvas px-3 text-[13px] text-text-primary">
                    <span className={`transition-opacity duration-500 ${step >= 2 ? "opacity-100" : "opacity-0"}`}>{formatFcfa(VACANT_LISTING.rentFcfa)}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-medium text-text-muted">Équipements & Caractéristiques</label>
                <div className="rounded-md border border-border-default bg-bg-canvas p-3 min-h-[76px]">
                  <ul className={`grid gap-2 text-[11px] text-text-secondary sm:grid-cols-2 transition-opacity duration-500 ${step >= 3 ? "opacity-100" : "opacity-0"}`}>
                    {VACANT_LISTING.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check size={12} className="text-success-strong"/>{feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center border-y border-border-default bg-bg-subtle/60 py-4 lg:border-x lg:border-y-0">
            <button 
              type="button" 
              onClick={() => { if(step < 5) setStep(5); else setStep(0); }} 
              aria-pressed={isPublished} 
              className={`inline-flex items-center gap-2 rounded-sm bg-brand-primary px-3 py-2 text-[11px] font-semibold text-white transition-all duration-200 hover:bg-brand-hover lg:[writing-mode:vertical-rl] ${step === 4 ? "scale-90 bg-brand-hover" : "scale-100"}`}
            >
              {isPublished ? "Annonce publiée" : "Publier l’annonce"}
              <Send aria-hidden="true" size={13} className={`transition-transform ${isPublished ? "-translate-y-1 lg:translate-x-1 lg:-translate-y-0 opacity-80" : ""}`} />
            </button>
          </div>
          <div className={`p-5 sm:p-7 transition-all duration-700 ease-out ${isPublished ? "opacity-100 blur-none translate-y-0" : "opacity-30 blur-[4px] translate-y-4 pointer-events-none select-none"}`}>
            <div className="flex items-center justify-between gap-3 border-b border-border-default pb-4"><p className="text-[12px] font-semibold text-text-primary">Sur votre vitrine</p><span className="inline-flex items-center gap-1 text-[10px] font-semibold text-success-strong"><Globe2 aria-hidden="true" size={13} /> {isPublished ? "En ligne" : "Prêt"}</span></div>
            <div className="pt-5">
              <div className="mb-4 aspect-[16/10] w-full overflow-hidden rounded-md bg-border-default shadow-sm">
                <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600" alt="Appartement F3 Standing" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
              </div>
              <p className="font-mono text-[10px] text-text-muted">{VACANT_LISTING.domain}</p>
              <h3 className="mt-2 text-[18px] font-semibold tracking-[-0.04em] text-text-primary">{VACANT_LISTING.title}</h3>
              <p className="mt-1 text-[16px] font-semibold text-text-primary">{formatFcfa(VACANT_LISTING.rentFcfa)} <span className="text-[11px] font-medium text-text-muted">/ mois</span></p>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <button type="button" onClick={() => setIsRequested((current) => !current)} aria-pressed={isRequested} className="inline-flex flex-1 items-center justify-center gap-2 border border-brand-primary px-3 py-2 text-[11px] font-semibold text-text-primary hover:bg-bg-canvas transition-colors">{isRequested ? "Visite demandée" : "Réserver"}<CalendarDays aria-hidden="true" size={14} /></button>
                <button type="button" className="inline-flex flex-1 items-center justify-center gap-2 bg-brand-primary px-3 py-2 text-[11px] font-semibold text-white hover:bg-brand-hover transition-colors"><MessageCircle aria-hidden="true" size={14} /> WhatsApp</button>
              </div>
              <p aria-live="polite" className={`mt-3 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-success-strong transition-opacity ${isRequested ? "opacity-100" : "opacity-0"}`}><Check aria-hidden="true" size={14} /> Demande de visite reçue</p>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-[11px] text-text-muted"><Eye aria-hidden="true" size={14} /> Les mêmes informations servent au suivi du bien et à sa publication.</div>
      </div>
    </section>
  );
}
