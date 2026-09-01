"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/ui/Logo";
import { ArrowRightIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      // Détecte quand l'utilisateur quitte le Hero (environ 280px)
      setScrolled(window.scrollY > 280);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/produit", label: "Produit" },
    { href: "/solutions", label: "Solutions" },
    { href: "/tarifs", label: "Tarifs" },
    { href: "/ressources", label: "Ressources" },
  ];

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav
        className={`pointer-events-auto w-full max-w-[980px] rounded-2xl transition-all duration-300 flex items-center justify-between px-4 sm:px-6 py-2.5 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-[0_12px_32px_rgba(15,23,42,0.06)]"
            : "bg-[#F8FAF9]/90 backdrop-blur-md border border-slate-200/60 shadow-[0_4px_16px_rgba(15,23,42,0.03)]"
        }`}
      >
        {/* Brand Logo */}
        <div className="flex items-center">
          <Logo size="sm" variant="dark" />
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 bg-slate-900/[0.03] p-1 rounded-xl border border-slate-900/[0.04]">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[13px] rounded-lg px-3.5 py-1.5 transition-all duration-200 ${
                  isActive
                    ? "font-semibold text-slate-900 bg-white shadow-xs"
                    : "font-medium text-slate-500 hover:text-slate-900 hover:bg-white/50 shadow-none"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop Right Actions Dynamiques selon le Scroll */}
        <div className="hidden md:flex items-center gap-3">
          <AnimatePresence mode="wait" initial={false}>
            {!scrolled ? (
              // SUR LE HERO : Uniquement "Se connecter" sous forme de bouton solide (sans flèche au hover, zéro doublon avec le Hero)
              <motion.div
                key="hero-actions"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href="/auth/login"
                  className="inline-flex items-center justify-center text-[13px] font-semibold text-white bg-slate-900 hover:bg-emerald-700 px-4 py-2 rounded-xl transition-all duration-200 shadow-xs active:scale-95 cursor-pointer"
                >
                  Se connecter
                </Link>
              </motion.div>
            ) : (
              // HORS DU HERO : Les deux boutons réapparaissent (Lien "Se connecter" + Bouton "Démarrer")
              <motion.div
                key="scrolled-actions"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="flex items-center gap-3"
              >
                <Link
                  href="/auth/login"
                  className="text-[13px] font-semibold text-slate-700 hover:text-emerald-700 px-3 py-1.5 transition-colors cursor-pointer"
                >
                  Se connecter
                </Link>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl transition-all duration-200 shadow-xs active:scale-95 cursor-pointer"
                >
                  <span>Démarrer</span>
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1.5 text-slate-800 hover:bg-slate-100 transition-colors rounded-lg"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? (
            <XMarkIcon className="h-5 w-5" />
          ) : (
            <Bars3Icon className="h-5 w-5" />
          )}
        </button>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto fixed top-20 left-4 right-4 max-w-[420px] mx-auto bg-white border border-slate-200 rounded-2xl px-6 py-6 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200 z-50">
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[15px] font-medium text-slate-900 py-2 border-b border-slate-100 hover:bg-slate-50 px-2 rounded-lg transition-colors"
            >
              Accueil
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-[15px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-2 rounded-lg py-2 border-b border-slate-100 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 flex flex-col gap-2.5">
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl border border-slate-200 text-[14px] font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 transition-colors shadow-xs"
              >
                Se connecter
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl text-[14px] font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                Commencer <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
