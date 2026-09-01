"use client";

import Link from "next/link";
import Logo from "@/components/ui/Logo";

const footerLinks = {
  Produit: [
    { label: "Fonctionnalités", href: "/produit" },
    { label: "Solutions", href: "/solutions" },
    { label: "Tarifs en FCFA", href: "/tarifs" },
    { label: "Ressources & Loi 2022-30", href: "/ressources" },
  ],
  Solutions: [
    { label: "Propriétaires Bailleurs", href: "/solutions#particuliers" },
    { label: "Gestionnaires & Démarcheurs", href: "/solutions#gestionnaires" },
    { label: "Agences & SCI", href: "/solutions#agences" },
    { label: "Simulateur de Rendement", href: "/ressources" },
  ],
  Compte: [
    { label: "Se connecter", href: "/auth/login" },
    { label: "Créer un compte", href: "/auth/register" },
    { label: "Tableau de bord", href: "/dashboard" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#18181B] text-[#FAF9F6] border-t border-[#27272A]">
      <div className="container mx-auto max-w-6xl px-6 py-20 pb-10">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand Column */}
          <div className="md:col-span-5">
            <div className="mb-6">
              <Logo size="md" variant="light" />
            </div>
            <p className="text-[14.5px] text-[#A1A1AA] leading-relaxed max-w-[360px]">
              La plateforme de gestion locative pensée pour les propriétaires et gestionnaires exigeants au Bénin.
              Automatisez vos encaissements Mobile Money et émettez vos quittances certifiées en toute sérénité.
            </p>
          </div>

          {/* Link columns */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <div className="text-[12px] font-extrabold tracking-[0.08em] uppercase text-white mb-5">
                  {title}
                </div>
                <ul className="space-y-3.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[14px] text-[#A1A1AA] hover:text-[#9D6B3C] transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-[#27272A] flex flex-col sm:flex-row justify-between items-center gap-4 text-[13px] text-[#71717A]">
          <span>
            © {new Date().getFullYear()} Lokka. Tous droits réservés · Conforme Loi n° 2022-30.
          </span>
          <div className="flex gap-6">
            {["Twitter", "LinkedIn", "GitHub"].map((social) => (
              <a
                key={social}
                href="#"
                className="hover:text-[#9D6B3C] transition-colors duration-200 font-medium"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
