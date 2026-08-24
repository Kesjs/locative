"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const faqs = [
  {
    question: "Comment mes locataires paient-ils leur loyer par Mobile Money (MTN & Moov) ?",
    answer:
      "À chaque échéance, le locataire reçoit une notification avec un lien de paiement direct vers son espace. Il sélectionne son opérateur (MTN MoMo ou Moov Money), entre son numéro et reçoit immédiatement le prompt USSD sur son téléphone pour valider son code secret en FCFA.",
  },
  {
    question: "Les quittances PDF générées sont-elles valides légalement au Bénin ?",
    answer:
      "Oui, absolument. Toutes les quittances édictées par Lokka comportent l'ensemble des mentions légales requises (identifiant du contrat, période concernée, montant en FCFA, références de la transaction Mobile Money et identité du bailleur/gestionnaire).",
  },
  {
    question: "Le locataire a-t-il accès aux données de mes autres logements ou locataires ?",
    answer:
      "Non, l'étanchéité est totale. Le portail locataire est complètement isolé du tableau de bord de gestion. Un locataire ne voit que son propre logement, son contrat, ses échéances et ses quittances personnelles.",
  },
  {
    question: "Y a-t-il des frais cachés ou une carte bancaire obligatoire pour essayer ?",
    answer:
      "Aucun frais caché et aucune carte bancaire n'est requise. Vous bénéficiez d'un essai gratuit de 14 jours pour tester Lokka en toute liberté. Vous choisissez votre formule ensuite sans aucun engagement de durée.",
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
          <div className="section-label mb-4 text-[#087F5B]">FAQ</div>
          <h2 className="heading-2 mb-4 text-[#1C1C1C]">
            Questions fréquentes
          </h2>
          <p className="body-text text-lg text-[#64635F]">
            Tout ce que vous devez savoir pour démarrer sereinement avec Lokka.
          </p>
        </motion.div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-[8px] bg-white border border-[#E8E5E0] overflow-hidden transition-all duration-200 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="text-[16px] font-semibold text-[#1C1C1C] pr-4">
                    {faq.question}
                  </span>
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FAF9F6] border border-[#E8E5E0] transition-transform duration-300 ${
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
                      <div className="px-6 pb-6 pt-2 text-[15px] leading-relaxed text-[#64635F] border-t border-[#F0EDE8]">
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
