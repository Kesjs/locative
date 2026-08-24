"use client";

import { ReactNode } from "react";
import Link from "next/link";
import StripeAuthLogo from "@/components/auth/StripeAuthLogo";

interface AuthLayoutProps {
  mode: "login" | "register" | "forgot";
  children?: ReactNode;
}

export default function AuthLayout({
  children,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full lg:h-screen lg:overflow-hidden grid grid-cols-1 lg:grid-cols-12 bg-[#FAF9F6]">
      {/* ========================================================================= */}
      {/* COLONNE GAUCHE : Scroll Indépendant & Formulaire                          */}
      {/* ========================================================================= */}
      <div className="lg:col-span-6 xl:col-span-5 h-full lg:h-screen lg:overflow-y-auto flex flex-col justify-between p-6 sm:p-10 lg:p-12 z-10 bg-[#FAF9F6]">
        {/* Top Header: Unified Stripe-style Logo + Back Hover Button */}
        <div className="flex items-center justify-start mb-8">
          <StripeAuthLogo />
        </div>

        {/* Dynamic Form Slot */}
        <div className="w-full max-w-md mx-auto my-auto py-2">
          {children}
        </div>

        {/* Bottom Minimal Footer */}
        <footer className="pt-6 border-t border-[#E8E5E0]/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[12px] text-[#9C9A95]">
          <span>© 2026 Lokka. Fait pour le Bénin 🇧🇯</span>
          <div className="flex gap-4">
            <Link href="/ressources" className="hover:text-[#1C1C1C] transition-colors">
              Loi n° 2022-30
            </Link>
            <Link href="/tarifs" className="hover:text-[#1C1C1C] transition-colors">
              Tarifs
            </Link>
          </div>
        </footer>
      </div>

      {/* ========================================================================= */}
      {/* COLONNE DROITE : Vidéo Immersive Fixée (Variante 5 - Dark Minimal)        */}
      {/* ========================================================================= */}
      <div className="hidden lg:block lg:col-span-6 xl:col-span-7 h-screen sticky top-0 relative bg-[#1C1C1C] overflow-hidden">
        {/* Full-Bleed Sticky Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-90 scale-[1.02]"
          src="/videos/login.mp4"
        />

        {/* Subtle Bottom Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
