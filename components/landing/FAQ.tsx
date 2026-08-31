"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const faqs = [
  {
    question: "Quelle est la différence entre les formules Découverte, Bailleur Pro et Agence Pro ?",
    answer:
      "Découverte est gratuit à vie pour 1 bien avec une gestion basique et des quittances PDF manuelles. Bailleur Pro (5 000 FCFA/mois, jusqu'à 15 biens) débloque le Mobile Money, le portail locataire et la Marketplace Lokka. Agence Pro (25 000 FCFA/mois, 50 biens inclus) ajoute la gestion multi-propriétaires avec mandats, les reversements automatiques, un domaine personnalisé et le SEO/blog.",
  },
  {
    question: "Que se passe-t-il si je dépasse le plafond de biens de mon forfait ?",
    answer:
      "Vous pouvez étendre votre forfait avec un pack additionnel plutôt que de changer de plan : +5 biens pour 2 000 FCFA/mois en Bailleur Pro (jusqu'à 35 biens max), ou un pack +100 biens pour 5 000 FCFA/mois en Agence Pro. Au-delà, contactez l'équipe Lokka pour une formule personnalisée.",
  },
  {
    question: "Comment mes locataires accèdent-ils à leurs quittances PDF et à leur espace ?",
    answer:
      "Dès que vous ajoutez un locataire sur Lokka, il reçoit un accès sécurisé par email ou numéro de téléphone (avec code OTP sans mot de passe complexe). Sur son espace web dédié, il retrouve l'historique complet de tous ses mois payés et peut télécharger à tout moment ses quittances PDF officielles certifiées avec QR Code.",
  },
  {
    question: "Comment fonctionne l'encaissement par Mobile Money (MTN MoMo & Moov) ?",
    answer:
      "Vos locataires peuvent régler leur loyer directement depuis leur téléphone en FCFA. Dès que la transaction est confirmée, votre tableau de bord s'actualise en temps réel et la quittance certifiée est générée automatiquement.",
  },
  {
    question: "Comment Lokka garantit-il la conformité avec la Loi n° 2022-30 au Bénin ?",
    answer:
      "Lokka intègre un bouclier juridique automatique : le sélecteur de caution bloque tout dépassement du plafond légal de 3 mois de loyer en vigueur au Bénin, les quittances comportent toutes les mentions légales obligatoires, et pour les agences, la commission de gestion est plafonnée à 10% comme l'exige la loi.",
  },
  {
    question: "Comment fonctionne mon site vitrine public et le nom de domaine personnalisé ?",
    answer:
      "Chaque compte Bailleur Pro ou Agence Pro dispose d'un mini-site public (ex: agence-littoral.lokka.bj). Il vous suffit de cocher 'Publier' sur vos logements vacants pour qu'ils apparaissent instantanément avec leurs photos, loyers et bouton de réservation de visite. Avec Agence Pro, vous pouvez connecter votre propre nom de domaine (ex: www.monagence.bj) avec votre logo et bénéficier du SEO/blog inclus.",
  },
  {
    question: "Qu'est-ce que la Marketplace Lokka et les frais de visite Mobile Money ?",
    answer:
      "La Marketplace Lokka permet de publier vos annonces de biens vacants pour trouver des locataires sans passer par une agence tierce (disponible à partir de Bailleur Pro). Vous pouvez fixer des frais de visite payables en ligne par Mobile Money, intégralement acquis, pour filtrer les demandes non sérieuses.",
  },
  {
    question: "Je vis à l'étranger, Lokka est-il adapté pour gérer mes biens au Bénin ?",
    answer:
      "Absolument. En configurant votre profil Bailleur Pro, vous choisissez simplement votre zone (Bénin ou Diaspora) : vous suivez en direct vos loyers avec double conversion FCFA / Euros (€) ou Dollars ($), échangez directement avec vos locataires pour éviter les intermédiaires opaques, et bénéficiez d'un archivage infalsifiable de tous les paiements.",
  },
  {
    question: "Mes locataires doivent-ils payer pour utiliser Lokka ?",
    answer:
      "Non, Lokka est 100% gratuit pour vos locataires. Ils peuvent recevoir leurs rappels et quittances, payer leur loyer et suivre leur bail sans aucun frais supplémentaire.",
  },
  {
    question: "Puis-je changer de formule ou annuler à tout moment ?",
    answer:
      "Oui, les forfaits mensuels sont sans aucun engagement. Vous pouvez passer d'un plan à un autre ou annuler votre abonnement depuis vos paramètres en 1 clic, sans frais de résiliation.",
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
