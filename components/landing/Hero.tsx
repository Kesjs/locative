"use client";

import { ArrowRight, CheckCircle2, Star, Sparkles } from "lucide-react";
import EmailOtpForm from "./EmailOtpForm";
import DashboardPreview from "./DashboardPreview";
import FluidFlowGrid from "@/components/ui/fluid-flow-grid";

export default function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden bg-[#FAF9F6] pb-10 pt-28 sm:pb-16 sm:pt-36">
      
      {/* 21st.dev Interactive Fluid Flow Grid Background */}
      <div className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-90 [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]">
        <FluidFlowGrid
          lineBaseColor="15, 23, 42"
          accentColor="8, 127, 91"
          spacing={34}
          interactiveRadius={240}
        />
      </div>

      {/* Subtle Radial Ambient Light */}
      <div className="pointer-events-none absolute left-1/2 top-24 h-[320px] w-[580px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div data-landing-hero-copy className="mx-auto flex max-w-[780px] flex-col items-center text-center">
          
          {/* Nouveau Badge Animé Haut de Gamme avec Bordure Lumineuse et Radar Pulse */}
          <div className="relative group mb-8 inline-flex items-center gap-2.5 rounded-full p-[1.5px] overflow-hidden shadow-sm transition-transform duration-300 hover:scale-105 cursor-default select-none">
            {/* Animated Conic Gradient Border */}
            <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#087F5B_0%,#D97706_50%,#087F5B_100%)] opacity-80" />
            
            {/* Inner Badge Container */}
            <div className="relative inline-flex items-center gap-2.5 rounded-full bg-white/95 backdrop-blur-md px-3.5 py-1.5 text-[12.5px] font-semibold text-[#0F172A]">
              
              {/* Radar Pulsing Icon */}
              <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#087F5B]" />
              </span>

              {/* Tag LOI 2022-30 */}
              <span className="rounded-full bg-[#087F5B]/10 border border-[#087F5B]/20 px-2 py-0.5 text-[10px] font-extrabold tracking-wider text-[#087F5B] uppercase">
                Loi 2022-30 🇧🇯
              </span>

              {/* Main Badge Text */}
              <span className="text-[#0F172A] font-bold">
                Plateforme certifiée de gestion locative au Bénin
              </span>

              {/* Sparkle Icon */}
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            </div>
          </div>

          <h1 className="max-w-[740px] text-[clamp(2.3rem,5.4vw,4rem)] font-extrabold leading-[1.02] tracking-[-0.05em] text-[#0F172A]">
            Votre patrimoine locatif
            <span className="mt-2 block font-serif text-[1.08em] font-normal italic tracking-[-0.04em] text-[#475569]">
              Enfin sous contrôle
            </span>
          </h1>

          <p className="mt-6 max-w-[620px] text-[15px] leading-[1.75] text-[#64748B] sm:text-[16.5px]">
            Que vous soyez au Bénin ou dans la diaspora, pilotez vos logements, encaissez vos loyers par MTN MoMo, émettez vos quittances certifiées et publiez votre mini-site vitrine depuis un seul espace.
          </p>

          <div data-landing-hero-form className="mt-8 w-full max-w-[480px]">
            <EmailOtpForm
              source="hero_landing"
              buttonLabel="Commencer"
              helperText="Créez votre espace en quelques secondes. Essai gratuit 14 jours sans engagement."
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-[12px] font-medium text-[#64748B]">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    className="inline-block h-7 w-7 rounded-full border-2 border-white shadow-2xs"
                    src={`https://i.pravatar.cc/100?img=${i + 10}`}
                    alt="Avatar bailleur"
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="inline-flex items-center gap-1.5 text-[11.5px] font-bold text-[#0F172A]">
                  <CheckCircle2 aria-hidden="true" size={13} className="text-[#087F5B]" />
                  +100 bailleurs &amp; gestionnaires
                </span>
              </div>
            </div>

            <span className="hidden h-5 w-px bg-[#E2E8F0] sm:block" />

            <span className="inline-flex items-center gap-1.5 text-[11.5px] font-bold text-[#0F172A]">
              <span className="rounded-[4px] border border-[#E2E8F0] bg-white px-1.5 py-0.5 text-[10px] font-extrabold text-[#087F5B]">
                FCFA
              </span>
              100% adapté au Bénin &amp; Afrique de l&apos;Ouest
            </span>
          </div>
        </div>

        <div className="mt-12 sm:mt-16">
          <div className="mb-3 flex items-center justify-between px-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#94A3B8]">
            <span>Votre tableau de bord en direct</span>
            <span className="hidden sm:inline">Patrimoine &amp; encaissements · Cotonou</span>
          </div>
          <DashboardPreview />
        </div>
      </div>
    </section>
  );
}
