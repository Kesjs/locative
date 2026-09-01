"use client";

import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Star, Mail } from "lucide-react";
import DashboardPreview from "./DashboardPreview";
import FluidFlowGrid from "@/components/ui/fluid-flow-grid";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
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
    "sous contrôle",
    "plus rentable",
    "sans stress",
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
    <section id="hero" className="relative overflow-hidden bg-[#F8FAF9] pb-12 pt-24 sm:pb-20 sm:pt-36">
      
      {/* Subtle Fluid Grid with Unified Palette */}
      <div className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-40">
        <FluidFlowGrid
          lineBaseColor="15, 23, 42"
          accentColor="5, 150, 105"
          spacing={42}
          interactiveRadius={220}
        />
      </div>

      {/* Ambiant Soft Emerald Halo */}
      <div className="pointer-events-none absolute left-1/2 top-14 h-[380px] w-[660px] -translate-x-1/2 rounded-full bg-emerald-500/[0.07] blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div data-landing-hero-copy className="mx-auto flex max-w-[740px] flex-col items-center text-center">
          
          {/* Badge Hero : Fond & Bordure Purement Blancs au Repos, Action vers /auth/register */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center mb-6"
          >
            <Link href="/auth/register" className="inline-block">
              <InteractiveHoverButton
                className="border-slate-200 bg-white text-[12px] font-semibold text-slate-800 py-1.5 px-4 shadow-xs hover:border-slate-300"
              >
                Une nouvelle façon de gérer vos biens
              </InteractiveHoverButton>
            </Link>
          </motion.div>

          {/* Titre Principal H1 Harmonisé & Équilibré */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[700px] text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-bold leading-[1.12] tracking-tight text-slate-900"
          >
            Votre patrimoine locatif
            <span className="mt-1 block h-[1.3em] relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={phraseIndex}
                  initial={{ y: 24, opacity: 0, filter: "blur(4px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: -24, opacity: 0, filter: "blur(4px)" }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block font-serif font-normal italic text-emerald-700"
                >
                  {ROTATING_PHRASES[phraseIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.h1>

          {/* Description & Proposition de Valeur */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 max-w-[560px] text-[15px] sm:text-[16.5px] leading-relaxed font-normal text-slate-600"
          >
            Tous vos biens, encaissements et quittances réunis dans un espace fluide, moderne et 100% conforme.
          </motion.p>

          {/* Formulaire de Conversion Email OTP avec InteractiveHoverButton */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 w-full max-w-[490px]"
          >
            <form
              onSubmit={handleHeroSubmit}
              className="group relative flex w-full flex-col gap-2 rounded-2xl bg-white p-1.5 border border-slate-200 shadow-md shadow-slate-900/5 transition-all duration-200 focus-within:border-emerald-600 focus-within:ring-3 focus-within:ring-emerald-500/15 sm:flex-row sm:items-center"
            >
              <div className="flex flex-1 items-center gap-2.5 px-3">
                <Mail size={18} className="shrink-0 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse email"
                  required
                  className="h-10 w-full bg-transparent text-[14.5px] font-medium text-slate-900 placeholder-slate-400 outline-none min-w-0"
                />
              </div>

              <InteractiveHoverButton
                type="submit"
                disabled={isSubmitting}
                className="h-11 rounded-xl px-5 text-[13.5px] bg-slate-900 text-white border-transparent hover:border-transparent shrink-0"
              >
                {isSubmitting ? "Envoi..." : isSuccess ? "Code envoyé" : "Commencer"}
              </InteractiveHoverButton>
            </form>

            <p
              className={`mt-2.5 text-center text-[11.5px] font-medium leading-relaxed ${
                isSuccess
                  ? "text-emerald-700 font-semibold"
                  : isError
                  ? "text-rose-600 font-semibold"
                  : "text-slate-500"
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
            className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5 text-[12px] font-medium text-slate-600"
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    className="inline-block h-6 w-6 rounded-full border-2 border-white shadow-2xs object-cover"
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
                <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-slate-800">
                  <CheckCircle2 aria-hidden="true" size={13} className="text-emerald-600" />
                  +100 bailleurs &amp; gestionnaires
                </span>
              </div>
            </div>

            <span className="hidden h-4 w-px bg-slate-200 sm:block" />

            <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-slate-800">
              <span className="rounded px-1.5 py-0.5 text-[10px] font-bold bg-emerald-100/70 text-emerald-800 border border-emerald-200/50">
                FCFA
              </span>
              100% adapté au Bénin &amp; Afrique de l&apos;Ouest
            </span>
          </motion.div>
        </div>

        {/* Aperçu Tableau de Bord avec Perspective 3D & Isométrique */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.58, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 sm:mt-12 w-full"
        >
          <div className="mb-3 flex items-center justify-between px-2 text-[10.5px] font-bold uppercase tracking-wider text-slate-500 max-w-5xl mx-auto">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Tableau de bord en direct
            </span>
            <span className="hidden sm:inline text-slate-400">Patrimoine &amp; encaissements · Cotonou</span>
          </div>

          <div className="mx-auto max-w-6xl [mask-image:linear-gradient(to_bottom,black_85%,transparent_100%)]">
            <div className="[perspective:1200px] transition-all duration-700 ease-out">
              <div className="[transform:rotateX(10deg)_scale(0.98)] hover:[transform:rotateX(2deg)_scale(1)] transition-transform duration-500 ease-out">
                <div className="relative">
                  <DashboardPreview />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
