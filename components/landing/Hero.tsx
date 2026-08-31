"use client";

import { ArrowRight, CheckCircle2, Star } from "lucide-react";
import EmailOtpForm from "./EmailOtpForm";
import DashboardPreview from "./DashboardPreview";
import { BorderBeam } from "@/components/ui/border-beam";

export default function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden bg-bg-canvas pb-10 pt-28 sm:pb-16 sm:pt-36">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[620px] landing-grid opacity-70 [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" />
      <div className="pointer-events-none absolute left-1/2 top-24 h-[300px] w-[560px] -translate-x-1/2 rounded-full bg-success-soft/40 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div data-landing-hero-copy className="mx-auto flex max-w-[760px] flex-col items-center text-center">
          <div className="relative mb-6 inline-flex items-center gap-2 overflow-hidden rounded-full border border-border-default bg-white px-3 py-1.5 text-[12px] font-semibold text-text-primary shadow-xs">
            <BorderBeam size={32} duration={4} delay={0} />
            <span className="relative z-10 inline-flex items-center gap-1.5">
              <span className="rounded-[4px] bg-success-strong px-1.5 py-0.5 text-[9px] font-bold tracking-[0.12em] text-white">NEW</span>
              <span>Une nouvelle façon de gérer vos biens</span>
            </span>
          </div>

          <h1 className="max-w-[720px] text-[clamp(2.2rem,5.3vw,3.9rem)] font-semibold leading-[0.98] tracking-[-0.06em] text-text-primary">
            Votre patrimoine locatif
            <span className="mt-2 block font-serif text-[1.08em] font-normal italic tracking-[-0.045em] text-text-secondary">
              Enfin sous contrôle
            </span>
          </h1>

          <p className="mt-7 max-w-[610px] text-[15px] leading-[1.75] text-text-secondary sm:text-[16px]">
            Que vous soyez au Bénin ou dans la diaspora, gérez vos logements, vos quittances officielles et votre site vitrine depuis un seul espace.
          </p>

          <div data-landing-hero-form className="mt-8 w-full max-w-[470px]">
            <EmailOtpForm
              source="hero_landing"
              buttonLabel="Commencer"
              helperText="Créez votre espace en quelques secondes. Essai gratuit 14 jours."
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-[12px] font-medium text-text-secondary">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    className="inline-block h-7 w-7 rounded-full border-2 border-white"
                    src={`https://i.pravatar.cc/100?img=${i + 10}`}
                    alt="Avatar bailleur"
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="inline-flex items-center gap-1.5 text-[11.5px]">
                  <CheckCircle2 aria-hidden="true" size={13} className="text-success-strong" />
                  +100 bailleurs &amp; gestionnaires
                </span>
              </div>
            </div>

            <span className="hidden h-5 w-px bg-border-default sm:block" />

            <span className="inline-flex items-center gap-1.5">
              <span className="rounded-[4px] border border-border-default bg-white px-1.5 py-0.5 text-[10px] font-bold text-text-primary">FCFA</span>
              100% adapté à l&apos;Afrique francophone
            </span>
          </div>
        </div>

        <div className="mt-12 sm:mt-16">
          <div className="mb-3 flex items-center justify-between px-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
            <span>Votre tableau de bord</span>
            <span className="hidden sm:inline">Patrimoine &amp; encaissements · Cotonou</span>
          </div>
          <DashboardPreview />
        </div>
      </div>
    </section>
  );
}
