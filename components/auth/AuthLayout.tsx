"use client";

import { ReactNode, useRef, useEffect, useState } from "react";
import Link from "next/link";
import StripeAuthLogo from "@/components/auth/StripeAuthLogo";

interface AuthLayoutProps {
  mode: "login" | "register" | "forgot";
  children?: ReactNode;
}

export default function AuthLayout({
  children,
}: AuthLayoutProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = true;

    // Déclenchement immédiat de la lecture dès le montage
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsVideoReady(true))
        .catch(() => {
          // Autoplay standard fallback
        });
    }
  }, []);

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
      {/* COLONNE DROITE : Vidéo Plein Écran Optimisée en One-Shot                  */}
      {/* ========================================================================= */}
      <div className="hidden lg:block lg:col-span-6 xl:col-span-7 h-screen sticky top-0 relative bg-[#0B132B] overflow-hidden">
        {/* Fond d'ambiance architectural instantané (supprime tout écran noir) */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-950/40 to-black pointer-events-none transition-opacity duration-700"
          style={{ opacity: isVideoReady ? 0.3 : 1 }}
        />

        {/* Vidéo direct streaming MP4 (zéro 404 sur webm/poster) */}
        <video
          ref={videoRef}
          src="/videos/login.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onLoadedData={() => setIsVideoReady(true)}
          className={`absolute inset-0 w-full h-full object-cover scale-[1.01] transition-opacity duration-500 ${
            isVideoReady ? "opacity-95" : "opacity-0"
          }`}
        />
      </div>
    </div>
  );
}
