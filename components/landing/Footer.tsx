"use client";

import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { ShieldCheck, MessageSquare, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-100 border-t border-slate-800/80">
      <div className="container mx-auto max-w-7xl px-6 py-16 pb-12">
        {/* Grille Principale */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-14">
          {/* Colonne 1 : Marque & Identité Institutionnelle */}
          <div className="md:col-span-4 space-y-4">
            <Logo size="md" variant="light" />
            <p className="text-[13.5px] text-slate-400 leading-relaxed max-w-[340px]">
              La plateforme immobilière de référence au Bénin. Automatisez vos encaissements Mobile Money, sécurisez vos baux et délivrez des quittances certifiées conformes.
            </p>

            <div className="pt-2 space-y-2">
              <div className="flex items-center gap-2 text-[12px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Conforme Loi n° 2022-30 &amp; APDP Bénin</span>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-slate-400">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Haie Vive, Cotonou, République du Bénin</span>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-slate-400">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Assistance WhatsApp : +229 97 00 11 22</span>
              </div>
            </div>
          </div>

          {/* Colonne 2 : Fonctionnalités & Outils */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-[11.5px] font-bold tracking-wider uppercase text-white mb-4">
              Fonctionnalités
            </div>
            <ul className="space-y-2.5 text-[13.5px]">
              <li>
                <Link href="/produit" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Gestion des Baux &amp; Contrats
                </Link>
              </li>
              <li>
                <Link href="/produit" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Quittances Certifiées Loi 2022-30
                </Link>
              </li>
              <li>
                <Link href="/produit" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Recouvrement MTN MoMo &amp; Moov Money
                </Link>
              </li>
              <li>
                <Link href="/produit" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Compteurs SBEE &amp; SONEB
                </Link>
              </li>
              <li>
                <Link href="/produit" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Gestion Maintenance &amp; Pannes
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Solutions Métier */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-[11.5px] font-bold tracking-wider uppercase text-white mb-4">
              Solutions Métier
            </div>
            <ul className="space-y-2.5 text-[13.5px]">
              <li>
                <Link href="/solutions#particuliers" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Propriétaires Bailleurs
                </Link>
              </li>
              <li>
                <Link href="/solutions#agences" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Agences Immobilières &amp; SCI
                </Link>
              </li>
              <li>
                <Link href="/solutions#gestionnaires" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Gestionnaires &amp; Démarcheurs
                </Link>
              </li>
              <li>
                <Link href="/locataire" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Espace Locataire Dédié
                </Link>
              </li>
              <li>
                <Link href="/tarifs" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Tarifs &amp; Abonnements FCFA
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 4 : Cadre Légal & Réglementaire */}
          <div className="md:col-span-2 space-y-3">
            <div className="text-[11.5px] font-bold tracking-wider uppercase text-white mb-4">
              Légal &amp; Sécurité
            </div>
            <ul className="space-y-2.5 text-[13.5px]">
              <li>
                <Link href="/confidentialite" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Politique de Confidentialité
                </Link>
              </li>
              <li>
                <Link href="/conditions" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Conditions Générales (CGU)
                </Link>
              </li>
              <li>
                <span className="text-slate-400 block">
                  Caution plafonnée (3 mois)
                </span>
              </li>
              <li>
                <span className="text-slate-400 block">
                  Honoraires 10% Loi 2022-30
                </span>
              </li>
              <li>
                <span className="text-slate-400 block">
                  Protection APDP Bénin
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Ligne Inférieure */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-[12.5px] text-slate-500">
          <span>
            © {new Date().getFullYear()} Lokka Bénin. Tous droits réservés · Conforme Loi n° 2022-30 portant bail d&apos;habitation.
          </span>
          <div className="flex items-center gap-6">
            <Link href="/confidentialite" className="hover:text-emerald-400 transition-colors">
              Données Personnelles
            </Link>
            <Link href="/conditions" className="hover:text-emerald-400 transition-colors">
              Mentions Légales
            </Link>
            <span className="text-slate-400 font-medium">Devise : FCFA (XOF)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
