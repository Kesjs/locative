import React from "react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { ShieldCheckIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export const metadata = {
  title: "Politique de Confidentialité — Lokka",
  description: "Politique de confidentialité et protection des données personnelles sur Lokka, conforme au Code du Numérique du Bénin.",
};

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-[#F4F9F6] text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white border border-[#E2ECE6] rounded-3xl p-6 sm:p-12 shadow-sm">
          {/* Header */}
          <div className="mb-10 pb-8 border-b border-slate-100">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[13px] font-semibold text-emerald-700 hover:text-emerald-800 mb-6 transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Retour à l&apos;accueil
            </Link>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                <ShieldCheckIcon className="w-5 h-5" />
              </div>
              <span className="text-[12px] font-bold uppercase tracking-wider text-emerald-700">
                Protection des données
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-slate-900 tracking-tight mb-4">
              Politique de Confidentialité
            </h1>
            <p className="text-[14px] text-slate-500">
              Dernière mise à jour : 2 septembre 2026 · Conforme au Code du Numérique du Bénin (Loi n° 2017-20)
            </p>
          </div>

          {/* Content */}
          <div className="space-y-8 text-[15px] leading-relaxed text-slate-700">
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">1. Introduction</h2>
              <p>
                La présente Politique de Confidentialité décrit la manière dont la plateforme <strong>Lokka</strong> (ci-après « nous », « notre » ou « la Plateforme ») collecte, utilise, protège et partage les données à caractère personnel de ses utilisateurs (propriétaires bailleurs, gestionnaires de biens, agences immobilières et locataires).
              </p>
              <p>
                En utilisant Lokka, vous acceptez les pratiques décrites dans le présent document. Nous nous engageons à respecter scrupuleusement les dispositions du Code du Numérique en République du Bénin et les recommandations de l&apos;Autorité de Protection des Données Personnelles (APDP).
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">2. Données collectées</h2>
              <p>Dans le cadre de nos services de gestion locative, nous collectons les catégories d&apos;informations suivantes :</p>
              <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
                <li><strong>Données d&apos;identité et de contact</strong> : nom, prénom, adresse e-mail, numéro de téléphone (WhatsApp), adresse postale, ville.</li>
                <li><strong>Données de connexion et d&apos;authentification</strong> : identifiants de compte, jetons de session, profil Google OAuth (nom, email, photo de profil si vous choisissez de vous connecter avec Google).</li>
                <li><strong>Données du patrimoine et des baux</strong> : adresse des biens, caractéristiques techniques, compteurs SBEE/SONEB, montants des loyers et charges, montants de caution, date de prise d&apos;effet des contrats de location.</li>
                <li><strong>Données financières et règlements</strong> : montants perçus, historique des transactions, méthode de règlement (MTN Mobile Money, Moov Money, Espèces, Virement), références de paiement et quittances émises.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">3. Finalités du traitement</h2>
              <p>Vos données sont collectées et traitées pour les finalités légitimes suivantes :</p>
              <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
                <li>Fourniture et maintien de votre espace de gestion locative (suivi des loyers, alertes impayés, maintenance).</li>
                <li>Génération et certification des quittances de loyer conformes à la <strong>Loi n° 2022-30</strong> régissant les baux d&apos;habitation au Bénin.</li>
                <li>Envoi des notifications d&apos;échéance, relances cordiales par message ou WhatsApp, et alertes de maintenance.</li>
                <li>Calcul des plafonds légaux de caution (limités à 3 mois de loyer en République du Bénin).</li>
                <li>Sécurité de la plateforme, prévention de la fraude et respect de nos obligations légales et réglementaires.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">4. Partage et sous-traitance</h2>
              <p>
                Lokka ne vend, ne loue, ni ne cède vos données personnelles à des tiers à des fins publicitaires. Vos informations ne sont accessibles qu&apos;aux prestataires techniques indispensables au fonctionnement de la plateforme :
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
                <li><strong>Supabase</strong> : hébergement de la base de données sécurisée sous chiffrement au repos (AES-256) et en transit (TLS 1.3).</li>
                <li><strong>Fournisseurs d&apos;authentification (Google)</strong> : validation de votre identité lorsque vous optez pour la connexion sociale.</li>
                <li><strong>Services de messagerie (Resend)</strong> : acheminement sécurisé de vos codes de connexion OTP et quittances PDF.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">5. Sécurité et conservation des données</h2>
              <p>
                Nous mettons en œuvre des politiques de sécurité strictes incluant l&apos;isolation multi-tenant par <em>Row Level Security</em> (RLS), garantissant qu&apos;aucun utilisateur ne peut accéder aux biens, transactions ou quittances d&apos;un autre compte.
              </p>
              <p>
                Vos données sont conservées pendant toute la durée d&apos;activité de votre compte, puis archivées conformément aux durées de prescription légale en vigueur au Bénin.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">6. Vos droits</h2>
              <p>Conformément aux lois applicables, vous bénéficiez à tout moment :</p>
              <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
                <li>D&apos;un droit d&apos;accès et d&apos;obtention d&apos;une copie de vos données enregistrées.</li>
                <li>D&apos;un droit de rectification des données inexactes ou incomplètes.</li>
                <li>D&apos;un droit de suppression définitive de votre compte et des données afférentes.</li>
              </ul>
              <p>
                Pour exercer ces droits ou pour toute question relative à la protection de votre vie privée, vous pouvez nous écrire directement à :{" "}
                <a href="mailto:contact@lokka.bj" className="text-emerald-700 font-semibold underline">
                  contact@lokka.bj
                </a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
