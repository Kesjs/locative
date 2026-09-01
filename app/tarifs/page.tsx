"use client";

import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import CTA from "@/components/landing/CTA";
import ScrollToTop from "@/components/ui/ScrollToTop";
import Pricing from "@/components/landing/Pricing";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

export default function TarifsPage() {
  const faqs = [
    {
      q: "Comment puis-je régler mon abonnement Lokka ?",
      a: "Vous pouvez régler votre abonnement en toute simplicité directement en FCFA par MTN Mobile Money, Moov Money, ou par carte bancaire.",
    },
    {
      q: "Puis-je changer de formule ou annuler à tout moment ?",
      a: "Oui, les forfaits mensuels sont sans aucun engagement. Vous pouvez passer d'un plan à un autre (Bailleur 5 000 FCFA ou Agence 25 000 FCFA) ou annuler en 1 clic sans frais.",
    },
    {
      q: "La version Découverte est-elle vraiment gratuite à vie ?",
      a: "Oui ! Le forfait Découverte est 100% gratuit pour 1 logement avec gestion des quittances manuelles. Vous ne payez que si vous souhaitez automatiser vos encaissements MoMo et gérer plus de biens.",
    },
    {
      q: "Mes locataires doivent-ils payer pour utiliser Lokka ?",
      a: "Non, Lokka est 100% gratuit pour vos locataires. Ils peuvent payer leur loyer par Mobile Money, recevoir leurs rappels et télécharger leurs quittances certifiées sans aucun frais.",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FAF9F6] pt-12 sm:pt-16">
        <Pricing />

        {/* Pricing FAQs */}
        <section className="bg-white border-y border-[#E8E3DC] py-20">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F6EFE7] border border-[#E8E3DC] text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#9D6B3C] mb-3">
                Questions fréquentes
              </div>
              <h2 className="text-[28px] sm:text-[34px] font-extrabold text-[#18181B] tracking-tight">
                Tout comprendre sur nos abonnements
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faqs.map((faq, index) => (
                <div key={index} className="p-6 rounded-2xl bg-[#FAF9F6] border border-[#E8E3DC] shadow-2xs hover:border-[#9D6B3C]/40 transition-colors">
                  <h3 className="text-[15.5px] font-bold text-[#18181B] mb-2.5 flex items-start gap-2.5">
                    <QuestionMarkCircleIcon className="h-5 w-5 text-[#9D6B3C] shrink-0 mt-0.5" />
                    <span>{faq.q}</span>
                  </h3>
                  <p className="text-[13.5px] text-[#52525B] leading-relaxed pl-7.5">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
