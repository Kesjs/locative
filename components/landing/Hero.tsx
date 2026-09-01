"use client";

import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Star, Mail } from "lucide-react";
import DashboardPreview from "./DashboardPreview";
import FluidFlowGrid from "@/components/ui/fluid-flow-grid";
import { BorderBeam } from "@/components/ui/border-beam";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { handleError } from "@/lib/errors";

export default function Hero() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("Créez votre espace en quelques secondes. Essai gratuit 14 jours sans engagement.");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const [phraseIndex, setPhraseIndex] = useState(0);
  const ROTATING_PHRASES = [
    "Enfin sous contrôle",
    "100% automatisé",
    "Rentabilisé sans stress",
    "Géré depuis partout",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % ROTATING_PHRASES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [ROTATING_PHRASES.length]);

  const handleHeroSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setIsError(false);
    setFeedback("Un code de connexion sécurisé va vous être envoyé...");

    try {
      if (!isSupabaseConfigured()) {
        const message = handleError(
          new Error("Configuration Supabase manquante"),
          "Service momentanément indisponible. Réessayez dans un instant.",
          "hero:otp"
        );
        setIsError(true);
        setFeedback(message);
        setIsSubmitting(false);
        return;
      }

      const supabase = createClient();
      await supabase.from("leads_waitlist").insert([
        {
          email: email.trim(),
          source: "hero_landing",
          profile_type: "bailleur",
          city: "Cotonou",
        },
      ]);

      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
          shouldCreateUser: true,
        },
      });
      if (error) throw error;

      setIsSuccess(true);
      setFeedback(`Code envoyé à ${email.trim()}. Redirection...`);
      window.setTimeout(() => {
        window.location.href = `/auth/verify?email=${encodeURIComponent(email.trim())}`;
      }, 800);
    } catch (err) {
      const message = handleError(err, "Impossible d'envoyer le code. Vérifiez votre email.", "hero:otp");
      setIsError(true);
      setFeedback(message);
      setIsSubmitting(false);
    }
  };

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
          
          {/* Badge Épuré avec Flèche Droite Animée */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center mb-6"
          >
            <a
              href="#features"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-[#E8E3DC] bg-white/90 backdrop-blur-md px-4 py-1.5 text-[12.5px] font-semibold text-[#18181B] shadow-xs transition-all duration-200 hover:border-[#9D6B3C]/50 hover:bg-white hover:shadow-sm"
            >
              <BorderBeam size={36} duration={6} delay={0} colorFrom="#9D6B3C" colorTo="#E8E3DC" />
              <span className="relative z-10 inline-flex items-center gap-2">
                <span className="font-semibold text-[#18181B]">Une nouvelle façon de gérer vos biens</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#9D6B3C] transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </a>
          </motion.div>

          {/* Titre Principal H1 avec Rotateur de Mots Fluide */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[740px] text-[clamp(2.4rem,5.6vw,4.1rem)] font-extrabold leading-[1.08] tracking-[-0.045em] text-[#18181B]"
          >
            Votre patrimoine locatif
            <span className="mt-2 block h-[1.3em] relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={phraseIndex}
                  initial={{ y: 28, opacity: 0, filter: "blur(4px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: -28, opacity: 0, filter: "blur(4px)" }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block font-serif text-[1.08em] font-normal italic tracking-[-0.035em] text-[#52525B]"
                >
                  {ROTATING_PHRASES[phraseIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.h1>

          {/* Description & Proposition de Valeur SaaS Moderne */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 max-w-[620px] text-[16px] leading-[1.6] font-medium text-[#3F3F46] sm:text-[18px]"
          >
            Tous vos biens, toute votre gestion, dans un espace pensé pour vous.
          </motion.p>

          {/* Formulaire de Conversion Email OTP - Visible & Ultra-Contraste */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 w-full max-w-[500px]"
          >
            <form
              onSubmit={handleHeroSubmit}
              className="group relative flex w-full flex-col gap-2 rounded-xl bg-white p-2 border-2 border-[#18181B] shadow-[0_12px_36px_rgba(24,24,27,0.08)] transition-all duration-300 focus-within:border-[#9D6B3C] focus-within:ring-4 focus-within:ring-[#9D6B3C]/15 sm:flex-row sm:items-center"
            >
              <div className="flex flex-1 items-center gap-3 px-3">
                <Mail size={20} className="shrink-0 text-[#18181B]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse email"
                  required
                  className="h-11 w-full bg-transparent text-[15px] font-semibold text-[#18181B] placeholder-[#71717A] outline-none min-w-0"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-[#18181B] hover:bg-[#9D6B3C] px-6 text-[14px] font-bold text-white transition-all duration-200 shadow-md cursor-pointer disabled:cursor-wait disabled:opacity-75 shrink-0"
              >
                <span>{isSubmitting ? "Envoi..." : isSuccess ? "Code envoyé" : "Commencer"}</span>
                <ArrowRight aria-hidden="true" size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </form>

            <p
              className={`mt-2.5 text-center text-[12px] font-medium leading-relaxed ${
                isSuccess
                  ? "text-[#15803D] font-bold"
                  : isError
                  ? "text-[#E11D48] font-bold"
                  : "text-[#52525B]"
              }`}
            >
              {feedback}
            </p>
          </motion.div>

          {/* Preuve Sociale & Indicateurs de Confiance */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.46, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-[12px] font-medium text-[#52525B]"
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    className="inline-block h-7 w-7 rounded-full border-2 border-white shadow-2xs object-cover"
                    src={`https://i.pravatar.cc/100?img=${i + 10}`}
                    alt="Avatar bailleur"
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" />
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
              <span className="rounded-[4px] border border-[#E8E3DC] bg-[#F6EFE7] px-1.5 py-0.5 text-[10px] font-extrabold text-[#9D6B3C]">
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
