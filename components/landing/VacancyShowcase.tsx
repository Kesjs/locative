"use client";

import { useState } from "react";
import { CalendarDays, Check, Eye, Globe2, MessageCircle, Send } from "lucide-react";
import { VACANT_LISTING, formatFcfa } from "./landing-data";

export default function VacancyShowcase() {
  const [isPublished, setIsPublished] = useState(false);
  const [isRequested, setIsRequested] = useState(false);

  return (
    <section id="vitrine" className="landing-section bg-bg-canvas py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div data-landing-reveal className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div><p className="landing-label">Vitrine &amp; acquisition</p><h2 className="mt-4 max-w-[760px] text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1] tracking-[-0.06em] text-text-primary">Un bien vacant devient visible.</h2></div>
          <p className="max-w-[300px] text-[13px] leading-relaxed text-text-secondary">Publiez les données déjà présentes dans votre portefeuille. Pas besoin d&apos;un deuxième outil pour recevoir une demande de visite.</p>
        </div>

        <div data-landing-reveal className="mt-12 grid border-y border-border-default bg-white lg:grid-cols-[1fr_90px_1fr]">
          <div className="p-5 sm:p-7">
            <div className="flex items-center justify-between gap-3 border-b border-border-default pb-4"><p className="text-[12px] font-semibold text-text-primary">Dans votre portefeuille</p><span className="text-[10px] font-semibold text-warning">À publier</span></div>
            <div className="pt-7"><p className="landing-label">Logement disponible</p><h3 className="mt-2 text-[20px] font-semibold tracking-[-0.04em] text-text-primary">{VACANT_LISTING.title}</h3><p className="mt-1 text-[12px] text-text-secondary">{VACANT_LISTING.location} · {formatFcfa(VACANT_LISTING.rentFcfa)} / mois</p><ul className="mt-7 grid gap-3 text-[11px] text-text-secondary sm:grid-cols-2">{VACANT_LISTING.features.map((feature) => <li key={feature} className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-border-strong" />{feature}</li>)}</ul></div>
          </div>
          <div className="flex items-center justify-center border-y border-border-default bg-bg-subtle/60 py-4 lg:border-x lg:border-y-0"><button type="button" onClick={() => setIsPublished((current) => !current)} aria-pressed={isPublished} className="inline-flex items-center gap-2 rounded-sm bg-brand-primary px-3 py-2 text-[11px] font-semibold text-white hover:bg-brand-hover lg:[writing-mode:vertical-rl]">{isPublished ? "Annonce publiée" : "Publier l’annonce"}<Send aria-hidden="true" size={13} /></button></div>
          <div className="p-5 sm:p-7">
            <div className="flex items-center justify-between gap-3 border-b border-border-default pb-4"><p className="text-[12px] font-semibold text-text-primary">Sur votre vitrine</p><span className="inline-flex items-center gap-1 text-[10px] font-semibold text-success-strong"><Globe2 aria-hidden="true" size={13} /> {isPublished ? "Publié" : "Prêt"}</span></div>
            <div className="pt-7"><p className="font-mono text-[10px] text-text-muted">{VACANT_LISTING.domain}</p><h3 className="mt-3 text-[20px] font-semibold tracking-[-0.04em] text-text-primary">{VACANT_LISTING.title} · {VACANT_LISTING.location}</h3><p className="mt-2 text-[20px] font-semibold text-text-primary">{formatFcfa(VACANT_LISTING.rentFcfa)} <span className="text-[11px] font-medium text-text-muted">/ mois</span></p><div className="mt-6 flex flex-col gap-2 sm:flex-row"><button type="button" onClick={() => setIsRequested((current) => !current)} aria-pressed={isRequested} className="inline-flex flex-1 items-center justify-center gap-2 border border-brand-primary px-3 py-2.5 text-[11px] font-semibold text-text-primary hover:bg-bg-canvas">{isRequested ? "Visite demandée" : "Réserver une visite"}<CalendarDays aria-hidden="true" size={14} /></button><button type="button" className="inline-flex flex-1 items-center justify-center gap-2 bg-brand-primary px-3 py-2.5 text-[11px] font-semibold text-white hover:bg-brand-hover"><MessageCircle aria-hidden="true" size={14} /> Discuter sur WhatsApp</button></div><p aria-live="polite" className={`mt-4 flex items-center gap-1.5 text-[11px] font-semibold text-success-strong ${isRequested ? "visible" : "invisible"}`}><Check aria-hidden="true" size={14} /> Demande de visite reçue</p></div>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-[11px] text-text-muted"><Eye aria-hidden="true" size={14} /> Les mêmes informations servent au suivi du bien et à sa publication.</div>
      </div>
    </section>
  );
}
