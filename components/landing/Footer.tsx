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
    <footer className="bg-slate-950 text-slate-100 border-t border-slate-800">
      <div className="container mx-auto max-w-6xl px-6 py-16 pb-10">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-14">
          {/* Brand Column */}
          <div className="md:col-span-5">
            <div className="mb-5">
              <Logo size="md" variant="light" />
            </div>
            <p className="text-[14px] text-slate-400 leading-relaxed max-w-[360px]">
              La plateforme de gestion locative pensée pour les propriétaires et gestionnaires exigeants au Bénin.
              Automatisez vos encaissements Mobile Money et émettez vos quittances certifiées en toute sérénité.
            </p>
          </div>

          {/* Link columns */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <div className="text-[11.5px] font-bold tracking-wider uppercase text-white mb-4">
                  {title}
                </div>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[13.5px] text-slate-400 hover:text-emerald-400 transition-colors duration-200"
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
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-[12.5px] text-slate-500">
          <span>
            © {new Date().getFullYear()} Lokka. Tous droits réservés · Conforme Loi n° 2022-30.
          </span>
          <div className="flex gap-6">
            {["Twitter", "LinkedIn", "GitHub"].map((social) => (
              <a
                key={social}
                href="#"
                className="hover:text-emerald-400 transition-colors duration-200 font-medium"
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
