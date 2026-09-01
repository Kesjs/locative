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
      a: "Vous pouvez régler votre abonnement en toute simplicité directement par MTN Mobile Money, Moov Money, ou par carte bancaire (Visa / Mastercard).",
    },
    {
      q: "Puis-je changer de formule ou annuler à tout moment ?",
      a: "Oui, les forfaits mensuels sont sans aucun engagement. Vous pouvez passer d'un plan à un autre ou annuler votre abonnement depuis vos paramètres en 1 clic.",
    },
    {
      q: "La version Starter gratuite a-t-elle une limite de durée ?",
      a: "Non ! Le forfait Starter est gratuit à vie pour 1 ou 2 biens. Vous ne payez que si vous décidez d'ajouter plus de biens ou d'activer des fonctionnalités avancées.",
    },
    {
      q: "Mes locataires doivent-ils payer pour utiliser Lokka ?",
      a: "Non, Lokka est 100% gratuit pour vos locataires. Ils peuvent recevoir leurs rappels et quittances sans aucun frais supplémentaire.",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FAF9F6] pt-12 sm:pt-16">
        <Pricing />

        {/* Pricing FAQs */}
        <section className="bg-white border-y border-[#E8E5E0] py-20">
          <div className="container mx-auto max-w-4xl px-6">
            <div className="text-center mb-14">
              <div className="section-label mb-3">Questions fréquentes</div>
              <h2 className="heading-2 text-[#0F172A] text-[30px]">
                Tout comprendre sur nos abonnements
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {faqs.map((faq, index) => (
                <div key={index} className="p-6 rounded-[8px] bg-[#FAF9F6] border border-[#E8E5E0]">
                  <h3 className="text-[16px] font-bold text-[#0F172A] mb-2.5 flex items-start gap-2">
                    <QuestionMarkCircleIcon className="h-5 w-5 text-[#D97706] shrink-0 mt-0.5" />
                    <span>{faq.q}</span>
                  </h3>
                  <p className="text-[14px] text-[#64635F] leading-relaxed pl-7">
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
