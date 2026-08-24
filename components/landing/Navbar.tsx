"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/ui/Logo";
import { ArrowRightIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
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
        className={`pointer-events-auto w-full max-w-[980px] rounded-[10px] transition-all duration-300 flex items-center justify-between px-4 sm:px-6 py-2.5 ${
          scrolled
            ? "bg-[#FAF9F6]/90 backdrop-blur-xl border border-[#E8E5E0] shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
            : "bg-[#FAF9F6]/80 backdrop-blur-md border border-[#E8E5E0]/90 shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
        }`}
      >
        {/* Brand Logo with Dark Monogram Icon */}
        <div className="flex items-center">
          <Logo size="sm" variant="dark" />
        </div>

        {/* Desktop Navigation Links with Hover & Active Pill Indicator */}
        <div className="hidden md:flex items-center gap-1 bg-[#1C1C1C]/[0.03] p-1 rounded-[8px] border border-[#1C1C1C]/[0.04]">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[13px] rounded-[6px] px-3.5 py-1.5 transition-all duration-200 ${
                  isActive
                    ? "font-semibold text-[#1C1C1C] bg-white shadow-sm"
                    : "font-medium text-[#64635F] hover:text-[#1C1C1C] hover:bg-white/60 shadow-none"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop Right Action: Single "Se connecter" button with refined 6px radius */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/auth/login"
            className="group inline-flex items-center gap-1.5 text-[13px] font-semibold text-white bg-[#1C1C1C] hover:bg-[#333333] px-4 py-2 rounded-[6px] transition-all duration-200 shadow-sm active:scale-95"
          >
            Se connecter
            <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1.5 text-[#1C1C1C] hover:text-[#087F5B] transition-colors rounded-[6px] hover:bg-black/5"
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
        <div className="pointer-events-auto fixed top-20 left-4 right-4 max-w-[420px] mx-auto bg-[#FAF9F6] border border-[#E8E5E0] rounded-[12px] px-6 py-6 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200 z-50">
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[15px] font-medium text-[#1C1C1C] py-2 border-b border-[#E8E5E0]"
            >
              Accueil
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-[15px] font-medium text-[#64635F] hover:text-[#1C1C1C] py-2 border-b border-[#E8E5E0]"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 flex flex-col gap-2.5">
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-[6px] border border-[#E8E5E0] text-[14px] font-medium text-[#1C1C1C] bg-white shadow-sm"
              >
                Se connecter
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-[6px] text-[14px] font-medium text-white bg-[#1C1C1C] flex items-center justify-center gap-2 shadow-md"
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
