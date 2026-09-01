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
        <footer className="pt-6 border-t border-[#E8E3DC] flex flex-col sm:flex-row items-center justify-between gap-2 text-[12px] text-[#52525B]">
          <span className="font-medium">© 2026 Lokka. Fait pour le Bénin 🇧🇯</span>
          <div className="flex gap-4 font-semibold">
            <Link href="/#features" className="hover:text-[#18181B] transition-colors">
              Fonctionnalités
            </Link>
            <Link href="/#pricing" className="hover:text-[#18181B] transition-colors">
              Tarifs
            </Link>
          </div>
        </footer>
      </div>

      {/* ========================================================================= */}
      {/* COLONNE DROITE : Visuel Immersif & Présentation Lokka                     */}
      {/* ========================================================================= */}
      <div className="hidden lg:block lg:col-span-6 xl:col-span-7 h-screen sticky top-0 relative bg-[#18181B] overflow-hidden">
        {/* Full-Bleed Sticky Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/videos/login-poster.jpg"
          className="absolute inset-0 w-full h-full object-cover opacity-85 scale-[1.02]"
        >
          <source src="/videos/login.webm" type="video/webm" />
          <source src="/videos/login.mp4" type="video/mp4" />
        </video>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#18181B]/80 via-[#18181B]/20 to-transparent pointer-events-none" />

        {/* Floating Quote Badge */}
        <div className="absolute bottom-10 left-10 right-10 p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white max-w-lg shadow-2xl">
          <p className="font-serif text-[20px] font-normal italic leading-snug">
            &ldquo;Lokka nous a permis de sécuriser 100% de nos loyers et d&apos;éliminer la paperasse au Bénin.&rdquo;
          </p>
          <div className="mt-3 flex items-center justify-between text-[12px] text-white/80">
            <span className="font-bold text-white">Cabinet Immobilier du Golfe · Cotonou</span>
            <span className="text-[#F59E0B] font-bold">★★★★★</span>
          </div>
        </div>
      </div>
    </div>
  );
}
