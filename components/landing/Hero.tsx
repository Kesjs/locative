"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import SideRays from "@/components/ui/side-rays";
import { LiquidButton } from "@/components/ui/liquid-button";
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
        await supabase.from("leads_waitlist").insert([
          {
            email,
            source: "hero_landing",
            profile_type: "bailleur",
            city: "Cotonou",
          },
        ]);

        await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
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
    <section className="relative overflow-hidden pt-24 pb-12 sm:pt-32 sm:pb-20 bg-[#FAF9F6] sm:min-h-screen flex flex-col items-center justify-start sm:justify-center">
      {/* ─── 1. WEBGL SIDE RAYS (Volumetric Silver-Platinum Glow) ─── */}
      <div className="absolute top-0 right-0 w-[520px] h-[520px] pointer-events-none opacity-25 sm:opacity-35 overflow-hidden z-0">
        <SideRays
          origin="top-right"
          rayColor1="#D4D0C8"
          rayColor2="#FAF9F6"
          intensity={0.9}
          spread={1.8}
          speed={1.0}
          opacity={0.3}
        />
      </div>

      {/* ─── 2. ANIMATED ARCHITECTURAL GRID (Magic UI Luxury) ─── */}
      <AnimatedGridPattern
        numSquares={32}
        maxOpacity={0.05}
        duration={4.5}
        repeatDelay={0.6}
        className={cn(
          "[mask-image:radial-gradient(650px_circle_at_center,white,transparent_85%)]",
          "inset-x-0 inset-y-[-15%] h-[130%]"
        )}
      />

      {/* Ambient Accent Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[280px] bg-[#1C1C1C]/[0.02] blur-[130px] rounded-full pointer-events-none" />

      {/* ─── 3. HERO CONTENT ─── */}
      <div className="container relative z-10 mx-auto max-w-[900px] px-4 sm:px-6 text-center my-auto flex flex-col items-center justify-center">
        {/* A. BADGE OFFICIEL AVEC LE 'NEW' & BORDER BEAM DORÉ / SABLE SÉLECTION */}
        <div className="flex justify-center mb-4">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-[#E8E5E0] text-[#1C1C1C] text-[13px] font-medium shadow-xs overflow-hidden group"
          >
            {/* Border Beam Rotating Glow (Couleur sélection Sable Doré / Champagne) */}
            <div
              className="absolute -inset-[150%] animate-[spin_3.5s_linear_infinite] opacity-85 pointer-events-none"
              style={{
                background:
                  "conic-gradient(from 0deg at 50% 50%, transparent 0%, transparent 65%, #C5A880 80%, #F5F5DC 90%, transparent 100%)",
              }}
            />
            <div className="absolute inset-[1.5px] bg-white rounded-full pointer-events-none z-0" />

            {/* Badge Content */}
            <span className="relative z-10 inline-flex items-center px-2 py-0.5 rounded-md bg-[#1C1C1C] text-white text-[10px] font-bold uppercase tracking-wider">
              NEW
            </span>
            <span className="relative z-10 font-semibold text-[#1C1C1C]">
              Une nouvelle façon de gérer vos biens
            </span>
          </motion.div>
        </div>

        {/* B. TITRE H1 ÉDITORIAL AVEC SHIMMER SUR L'ITALIQUE */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="heading-1 mb-3.5 text-[#1C1C1C] text-[clamp(2.2rem,5vw,3.9rem)] leading-[1.12] tracking-[-0.03em]"
        >
          Votre patrimoine locatif <br />
          <span className="font-serif italic font-normal bg-gradient-to-r from-[#64635F] via-[#1C1C1C] to-[#64635F] bg-[length:200%_auto] animate-[shimmer_6s_ease-in-out_infinite] bg-clip-text text-transparent">
            Enfin sous contrôle
          </span>
        </motion.h1>

        {/* C. SOUS-TITRE PROPRE & MINIMALISTE (DUO 1) */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="body-text mx-auto mb-6 max-w-[620px] text-sm sm:text-base text-[#64635F] leading-relaxed"
        >
          Que vous soyez au Bénin ou dans la diaspora, gérez vos logements, vos quittances officielles et votre site vitrine depuis un seul espace.
        </motion.p>

        {/* D. FORMULAIRE DE CONVERSION AVEC LIQUID BUTTON HOVER SABLE SÉLECTION */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center justify-center mb-6 w-full"
        >
          <form
            onSubmit={handleHeroSubmit}
            className="group relative flex w-full max-w-[430px] items-stretch rounded-[8px] bg-white p-1.5 border border-[#E8E5E0] shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 focus-within:border-[#1C1C1C] focus-within:shadow-[0_8px_30px_rgba(28,28,28,0.1)]"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse email"
              required
              className="flex-1 border-none bg-transparent px-3.5 py-2 text-[14px] text-[#1C1C1C] placeholder-[#9C9A95] outline-none min-w-0"
            />
            <LiquidButton
              type="submit"
              disabled={isSubmitting}
              baseColor="#1C1C1C"
              liquidColor="#F5F5DC"
              textColor="#FFFFFF"
              textHoverColor="#1C1C1C"
              className="shrink-0 rounded-[6px] px-5 py-2.5 text-[13px] font-semibold border border-transparent hover:border-[#E8E5E0]"
            >
              {isSubmitting ? "Envoi..." : "Commencer"}
              <ArrowRightIcon className="h-4 w-4" />
            </LiquidButton>
          </form>

          <p className="mt-2 text-[11px] font-medium text-[#9C9A95]">
            Créez votre espace en quelques secondes. Essai gratuit 14 jours.
          </p>
        </motion.div>

        {/* E. PREUVE SOCIALE (+100 BAILLEURS) AVEC ÉTOILES DORÉES */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[#64635F] text-[12px] sm:text-[13px] font-medium pt-1"
        >
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {["12", "33", "47", "68"].map((img, i) => (
                <img
                  key={i}
                  src={`https://i.pravatar.cc/60?img=${img}`}
                  alt=""
                  className="h-7 w-7 sm:h-8 sm:w-8 rounded-full border-2 border-[#FAF9F6] object-cover shadow-2xs"
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              {/* Étoiles Dorées Jaune Chaud d'origine */}
              <div className="flex gap-0.5 text-[#F59E0B]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-current drop-shadow-2xs" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <span className="text-[12px] sm:text-[13px] font-medium text-[#1C1C1C]">
                +100 bailleurs &amp; gestionnaires
              </span>
            </div>
          </div>

          <div className="hidden sm:block h-4 w-px bg-[#E8E5E0]" />

          <div className="flex items-center gap-2 text-[#1C1C1C] text-[12px] sm:text-[13px]">
            <span className="rounded px-2 py-0.5 bg-[#F3F2EE] border border-[#E8E5E0] text-[#1C1C1C] text-[10px] sm:text-[11px] font-bold">
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
