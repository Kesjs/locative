"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function Hero() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            shouldCreateUser: true,
          },
        });
      }
    } catch (err) {
      console.warn("Hero OTP send notice:", err);
    } finally {
      window.location.href = `/auth/verify?email=${encodeURIComponent(email)}`;
    }
  };

  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20 bg-[#FAF9F6] min-h-[calc(100vh-64px)] flex flex-col items-center justify-center">
      {/* Animated Architectural Grid (Magic UI - Quiet Luxury) */}
      <AnimatedGridPattern
        numSquares={32}
        maxOpacity={0.07}
        duration={4.5}
        repeatDelay={0.6}
        className={cn(
          "[mask-image:radial-gradient(650px_circle_at_center,white,transparent_85%)]",
          "inset-x-0 inset-y-[-15%] h-[130%]"
        )}
      />

      {/* Hero Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[280px] bg-[#087F5B]/[0.035] blur-[130px] rounded-full pointer-events-none" />

      {/* Hero Content Container */}
      <div className="container relative z-10 mx-auto max-w-[960px] px-6 text-center">
        {/* ─── A. BADGE OFFICIEL (Border Beam & Textes préservés) ─── */}
        <div className="flex justify-center mb-5">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-[#E8E5E0] text-[#1C1C1C] text-[13px] font-medium shadow-sm overflow-hidden group"
          >
            {/* Border Beam Rotating Glow */}
            <div
              className="absolute -inset-[150%] animate-[spin_4s_linear_infinite] opacity-60 pointer-events-none"
              style={{
                background:
                  "conic-gradient(from 0deg at 50% 50%, transparent 0%, transparent 70%, #087F5B 85%, transparent 100%)",
              }}
            />
            {/* Inner mask to keep beam on border */}
            <div className="absolute inset-[1px] bg-white rounded-full pointer-events-none z-0" />

            {/* Badge Content */}
            <span className="relative z-10 inline-flex items-center px-2 py-0.5 rounded-md bg-[#1C1C1C] text-white text-[10px] font-bold uppercase tracking-wider">
              NEW
            </span>
            <span className="relative z-10 font-semibold text-[#1C1C1C]">
              Une nouvelle façon de gérer vos biens
            </span>
          </motion.div>
        </div>

        {/* ─── B. TITRE H1 (Variante 4 : Gradient Shimmer sur l'Italique) ─── */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="heading-1 mb-4 text-[#1C1C1C] text-[clamp(2.5rem,6.5vw,4.75rem)] leading-[1.08] tracking-[-0.03em]"
        >
          Votre patrimoine locatif <br />
          <span className="font-serif italic font-normal bg-gradient-to-r from-[#64635F] via-[#1C1C1C] to-[#64635F] bg-[length:200%_auto] animate-[shimmer_6s_ease-in-out_infinite] bg-clip-text text-transparent">
            Enfin sous contrôle
          </span>
        </motion.h1>

        {/* ─── C. SOUS-TITRE ─── */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="body-text mx-auto mb-7 max-w-[600px] text-base sm:text-lg text-[#64635F] leading-relaxed"
        >
          Gérez vos logements, loyers, contrats et locataires depuis un seul espace.
        </motion.p>

        {/* ─── D. FORMULAIRE DE CONVERSION ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center justify-center mb-8"
        >
          <form
            onSubmit={handleHeroSubmit}
            className="group relative flex w-full max-w-[440px] items-stretch rounded-[8px] bg-white p-1.5 border border-[#E8E5E0] shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 focus-within:border-[#1C1C1C] focus-within:shadow-[0_8px_30px_rgba(28,28,28,0.1)]"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse email"
              required
              className="flex-1 border-none bg-transparent px-4 py-2.5 text-[15px] text-[#1C1C1C] placeholder-[#9C9A95] outline-none min-w-0"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-[6px] bg-[#1C1C1C] px-5 py-2.5 text-[14px] font-semibold text-white transition-all duration-200 hover:bg-[#333333] active:scale-[0.98] shrink-0 disabled:opacity-75"
            >
              {isSubmitting ? "Envoi..." : "Commencer"}
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <p className="mt-2.5 text-[12px] font-medium text-[#9C9A95]">
            Créez votre espace en quelques secondes. Essai gratuit 14 jours.
          </p>
        </motion.div>

        {/* ─── E. PREUVE SOCIALE (+100 BAILLEURS) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-6 text-[#64635F] text-[13px] font-medium"
        >
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {["12", "33", "47", "68"].map((img, i) => (
                <img
                  key={i}
                  src={`https://i.pravatar.cc/60?img=${img}`}
                  alt=""
                  className="h-8 w-8 rounded-full border-2 border-[#FAF9F6] object-cover"
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5 text-[#087F5B]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <span className="text-[13px] font-medium text-[#1C1C1C]">
                +100 bailleurs &amp; gestionnaires
              </span>
            </div>
          </div>

          <div className="hidden sm:block h-4 w-px bg-[#E8E5E0]" />

          <div className="flex items-center gap-2 text-[#1C1C1C] text-[13px]">
            <span className="rounded px-2 py-0.5 bg-[#E6F5EF] border border-[#087F5B]/20 text-[#087F5B] text-[11px] font-bold">
              FCFA
            </span>
            <span className="font-semibold text-[#1C1C1C]">
              100% adapté à l&apos;Afrique francophone
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
