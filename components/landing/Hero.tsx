"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Star } from "lucide-react";
import EmailOtpForm from "./EmailOtpForm";
import DashboardPreview from "./DashboardPreview";
import FluidFlowGrid from "@/components/ui/fluid-flow-grid";
import { BorderBeam } from "@/components/ui/border-beam";

export default function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden bg-[#FAF9F6] pb-12 pt-28 sm:pb-20 sm:pt-36">
      
      {/* 21st.dev Interactive Fluid Flow Grid Background */}
      <div className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-30">
        <FluidFlowGrid
          lineBaseColor="24, 24, 27"
          accentColor="157, 107, 60"
          spacing={42}
          interactiveRadius={220}
        />
      </div>

      {/* Halo Ambiant Doux Caramel & Sable */}
      <div className="pointer-events-none absolute left-1/2 top-20 h-[360px] w-[640px] -translate-x-1/2 rounded-full bg-[#9D6B3C]/[0.05] blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div data-landing-hero-copy className="mx-auto flex max-w-[780px] flex-col items-center text-center">
          
          {/* Badge Officiel avec BorderBeam & Animation d'Entrée */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center mb-6"
          >
            <div className="relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-[#E8E3DC] bg-white/95 backdrop-blur-md px-3.5 py-1.5 text-[12px] font-semibold text-[#18181B] shadow-xs transition-transform duration-200 hover:scale-[1.02]">
              <BorderBeam size={36} duration={5} delay={0} colorFrom="#9D6B3C" colorTo="#E8E3DC" />
              <span className="relative z-10 inline-flex items-center gap-2">
                <span className="rounded-[4px] bg-[#15803D] px-1.5 py-0.5 text-[9px] font-bold tracking-[0.12em] text-white shadow-2xs">
                  NEW
                </span>
                <span className="font-semibold text-[#18181B]">Une nouvelle façon de gérer vos biens</span>
              </span>
            </div>
          </motion.div>

          {/* Titre Principal H1 - Haute Lisibilité & Contraste WCAG AAA */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[740px] text-[clamp(2.4rem,5.6vw,4.1rem)] font-extrabold leading-[1.03] tracking-[-0.045em] text-[#18181B]"
          >
            Votre patrimoine locatif
            <span className="mt-2 block font-serif text-[1.08em] font-normal italic tracking-[-0.035em] text-[#52525B]">
              Enfin sous contrôle
            </span>
          </motion.h1>

          {/* Description & Proposition de Valeur */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-[620px] text-[15.5px] leading-[1.75] font-normal text-[#3F3F46] sm:text-[17px]"
          >
            Que vous soyez au Bénin ou dans la diaspora, pilotez vos logements, encaissez vos loyers par MTN MoMo, émettez vos quittances certifiées et publiez votre mini-site vitrine depuis un seul espace.
          </motion.p>

          {/* Formulaire de Conversion Email OTP */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
            data-landing-hero-form
            className="mt-8 w-full max-w-[480px]"
          >
            <EmailOtpForm
              source="hero_landing"
              buttonLabel="Commencer"
              helperText="Créez votre espace en quelques secondes. Essai gratuit 14 jours sans engagement."
            />
          </motion.div>

          {/* Preuve Sociale & Indicateurs de Confiance */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.46, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-[12px] font-medium text-[#52525B]"
          >
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
                <span className="inline-flex items-center gap-1.5 text-[11.5px] font-bold text-[#18181B]">
                  <CheckCircle2 aria-hidden="true" size={13} className="text-[#15803D]" />
                  +100 bailleurs &amp; gestionnaires
                </span>
              </div>
            </div>

            <span className="hidden h-5 w-px bg-[#E8E3DC] sm:block" />

            <span className="inline-flex items-center gap-1.5 text-[11.5px] font-bold text-[#18181B]">
              <span className="rounded-[4px] border border-[#E8E3DC] bg-white px-1.5 py-0.5 text-[10px] font-extrabold text-[#9D6B3C]">
                FCFA
              </span>
              100% adapté au Bénin &amp; Afrique de l&apos;Ouest
            </span>
          </motion.div>
        </div>

        {/* Aperçu Tableau de Bord avec Révélation Fluide */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.58, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 sm:mt-16"
        >
          <div className="mb-3 flex items-center justify-between px-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#71717A]">
            <span>Votre tableau de bord en direct</span>
            <span className="hidden sm:inline">Patrimoine &amp; encaissements · Cotonou</span>
          </div>
          <DashboardPreview />
        </motion.div>
      </div>
    </section>
  );
}
