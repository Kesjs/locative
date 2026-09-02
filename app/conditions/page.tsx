import React from "react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { DocumentTextIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export const metadata = {
  title: "Conditions Générales d'Utilisation — Lokka",
  description: "Conditions générales d'utilisation du service Lokka pour propriétaires bailleurs, gestionnaires et locataires au Bénin.",
};

export default function ConditionsPage() {
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
                <DocumentTextIcon className="w-5 h-5" />
              </div>
              <span className="text-[12px] font-bold uppercase tracking-wider text-emerald-700">
                Cadre Juridique &amp; Contractuel
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-slate-900 tracking-tight mb-4">
              Conditions Générales d&apos;Utilisation
            </h1>
            <p className="text-[14px] text-slate-500">
              En vigueur au 2 septembre 2026 · Régies par la Loi n° 2022-30 relative aux baux d&apos;habitation en République du Bénin
            </p>
          </div>

          {/* Content */}
          <div className="space-y-8 text-[15px] leading-relaxed text-slate-700">
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">1. Objet de la plateforme</h2>
              <p>
                La plateforme <strong>Lokka</strong> fournit une solution logicielle SaaS (Software as a Service) d&apos;aide à la gestion locative immobilière, conçue pour les propriétaires bailleurs, gestionnaires de biens, agences immobilières et locataires en République du Bénin et pour la diaspora béninoise.
              </p>
              <p>
                Lokka facilite le suivi des baux, l&apos;enregistrement des encaissements par Mobile Money (MTN MoMo, Moov Money) ou espèces, la génération de quittances numériques certifiées, le suivi des impayés et la gestion des incidents techniques.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">2. Conformité à la Loi n° 2022-30 (Baux d&apos;habitation au Bénin)</h2>
              <p>
                L&apos;ensemble des fonctionnalités de Lokka est conçu pour respecter et faire respecter les obligations légales en vigueur en République du Bénin, notamment :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li>
                  <strong>Plafond du cautionnement</strong> : Conformément aux articles de la Loi n° 2022-30, le montant de la garantie ou caution exigé du locataire est strictement plafonné à <strong>trois (3) mois de loyer</strong>. Lokka intègre des contrôles automatisés alertant l&apos;utilisateur en cas de dépassement.
                </li>
                <li>
                  <strong>Délivrance de quittance</strong> : Tout paiement de loyer perçu ouvre droit à la remise immédiate et gratuite d&apos;une quittance mentionnant le détail des sommes réglées et la période concernée.
                </li>
                <li>
                  <strong>Honoraires de gestion d&apos;agence</strong> : Pour les profils Agence, les commissions de gérance sont calculées selon les normes déontologiques et réglementaires en vigueur (taux légal de 10% des loyers recouvrés).
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">3. Inscription et Sécurité des comptes</h2>
              <p>
                L&apos;accès à la plateforme nécessite la création d&apos;un compte via adresse e-mail vérifiée (OTP) ou compte social certifié (Google OAuth).
              </p>
              <p>
                L&apos;utilisateur s&apos;engage à fournir des informations véridiques, à jour et complètes. Il est seul responsable de la garde et de la confidentialité de ses accès. Toute action réalisée depuis son espace utilisateur est réputée avoir été effectuée par lui-même.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">4. Responsabilités</h2>
              <p>
                Lokka agit en tant qu&apos;éditeur de logiciel technique et ne se substitue pas aux parties au contrat de bail. Le bailleur ou l&apos;agence demeure l&apos;unique responsable de l&apos;exactitude des montants déclarés, de la validité de ses titres de propriété et de l&apos;exécution du contrat de bail.
              </p>
              <p>
                Lokka s&apos;efforce d&apos;assurer une disponibilité 24h/24 et 7j/7 de ses services, mais ne saurait être tenu responsable des pannes de réseau tiers (fournisseurs d&apos;accès Internet, réseaux GSM Mobile Money ou pannes d&apos;électricité locales).
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">5. Propriété intellectuelle</h2>
              <p>
                La marque Lokka, le logo, les chartes graphiques, codes sources, interfaces logicielles et documentations sont la propriété exclusive de leurs concepteurs. Toute reproduction ou rétro-ingénierie non autorisée est passible de poursuites judiciaires.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">6. Loi applicable et juridiction compétente</h2>
              <p>
                Les présentes Conditions Générales d&apos;Utilisation sont régies par le droit de la République du Bénin. En cas de différend ou litige relatif à l&apos;interprétation ou à l&apos;exécution des présentes, les parties s&apos;engagent à rechercher préalablement une solution amiable. À défaut d&apos;accord, compétence exclusive est attribuée aux tribunaux compétents de Cotonou.
              </p>
              <p>
                Pour toute question ou demande d&apos;assistance juridique, contactez-nous à :{" "}
                <a href="mailto:support@lokka.bj" className="text-emerald-700 font-semibold underline">
                  support@lokka.bj
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
