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
    <div className="min-h-screen w-full lg:h-screen lg:overflow-hidden grid grid-cols-1 lg:grid-cols-12 bg-[#F8FAF9]">
      {/* ========================================================================= */}
      {/* COLONNE GAUCHE : Scroll Indépendant & Formulaire                          */}
      {/* ========================================================================= */}
      <div className="lg:col-span-6 xl:col-span-5 h-full lg:h-screen lg:overflow-y-auto flex flex-col justify-between p-6 sm:p-10 lg:p-12 z-10 bg-[#F8FAF9]">
        {/* Top Header: Unified Logo + Back Hover Button */}
        <div className="flex items-center justify-start mb-6">
          <StripeAuthLogo />
        </div>

        {/* Dynamic Form Slot */}
        <div className="w-full max-w-md mx-auto my-auto py-2">
          {children}
        </div>

        {/* Bottom Minimal Footer */}
        <footer className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[12px] text-slate-500">
          <span className="font-medium">© 2026 Lokka · Fait pour le Bénin</span>
          <div className="flex gap-4 font-semibold">
            <Link href="/produit" className="hover:text-emerald-700 transition-colors">
              Fonctionnalités
            </Link>
            <Link href="/tarifs" className="hover:text-emerald-700 transition-colors">
              Tarifs
            </Link>
          </div>
        </footer>
      </div>

      {/* ========================================================================= */}
      {/* COLONNE DROITE : Vidéo Plein Écran Libre & Épurée (Sans Texte Dessus)    */}
      {/* ========================================================================= */}
      <div className="hidden lg:block lg:col-span-6 xl:col-span-7 h-screen sticky top-0 relative bg-slate-950 overflow-hidden">
        {/* Full-Bleed Video - 100% libre et visible */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/videos/login-poster.jpg"
          className="absolute inset-0 w-full h-full object-cover opacity-95 scale-[1.01]"
        >
          <source src="/videos/login.webm" type="video/webm" />
          <source src="/videos/login.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
