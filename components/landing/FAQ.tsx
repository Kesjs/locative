"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const faqs = [
  {
    question: "Comment mes locataires accèdent-ils à leurs quittances PDF et à leur espace ?",
    answer:
      "Dès que vous ajoutez un locataire sur Lokka, il reçoit un accès sécurisé par email ou numéro de téléphone (avec code OTP sans mot de passe complexe). Sur son espace web dédié, il retrouve l'historique complet de tous ses mois payés et peut télécharger à tout moment ses quittances PDF officielles certifiées avec QR Code.",
  },
  {
    question: "Comment fonctionne mon site vitrine public et le nom de domaine personnalisé ?",
    answer:
      "Chaque compte Lokka dispose immédiatement d'un mini-site public (ex: agence-littoral.lokka.bj). Il vous suffit de cocher 'Publier' sur vos logements vacants pour qu'ils apparaissent instantanément avec leurs photos, loyers et bouton de réservation de visite. Avec le Plan Agence, vous pouvez connecter votre propre nom de domaine personnalisé (ex: www.monagence.bj) avec votre logo.",
  },
  {
    question: "Comment Lokka garantit-il la conformité avec la Loi n° 2022-30 au Bénin ?",
    answer:
      "Lokka intègre un bouclier juridique automatique : le sélecteur de caution bloque tout dépassement du plafond légal de 3 mois de loyer en vigueur au Bénin, les quittances comportent toutes les mentions légales obligatoires, et pour les agences, la commission de gestion est plafonnée à 10% comme l'exige la loi.",
  },
  {
    question: "Comment fonctionne l'encaissement par Mobile Money (MTN MoMo & Moov) ?",
    answer:
      "Vos locataires peuvent régler leur loyer directement depuis leur téléphone en FCFA. Dès que la transaction est confirmée, votre tableau de bord s'actualise en temps réel et la quittance certifiée est générée automatiquement.",
  },
  {
    question: "Je vis à l'étranger (Diaspora), Lokka est-il adapté pour moi ?",
    answer:
      "Absolument. Le profil Investisseur Diaspora a été pensé pour vous : suivi en direct des loyers au Bénin avec double conversion FCFA / Euros (€) ou Dollars ($), contact direct avec vos locataires pour éviter les intermédiaires opaques, et archivage infalsifiable de tous les paiements.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="py-24 sm:py-32 bg-[#FAF9F6] border-t border-[#E8E5E0] relative"
    >
      <div className="container mx-auto max-w-4xl px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-16 text-center"
        >
          <div className="section-label mb-3 text-[#1C1C1C]">Foire Aux Questions</div>
          <h2 className="heading-2 mb-4 text-[#1C1C1C]">
            Tout ce que vous devez savoir sur Lokka
          </h2>
          <p className="body-text text-base sm:text-lg text-[#64635F]">
            Des réponses claires pour comprendre le fonctionnement de votre espace de gestion et de votre site vitrine.
          </p>
        </motion.div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-[8px] bg-white border border-[#E8E5E0] overflow-hidden transition-all duration-200 shadow-2xs hover:border-[#1C1C1C]"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left focus:outline-none cursor-pointer"
                >
                  <span className="text-[15px] sm:text-[16px] font-bold text-[#1C1C1C] pr-4">
                    {faq.question}
                  </span>
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FAF9F6] border border-[#E8E5E0] transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-[#1C1C1C] text-white border-[#1C1C1C]" : "text-[#1C1C1C]"
                    }`}
                  >
                    <ChevronDownIcon className="h-4 w-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-[14px] leading-relaxed text-[#64635F] border-t border-[#FAF9F6]">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
