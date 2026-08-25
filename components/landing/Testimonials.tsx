"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const testimonials = [
  {
    quote:
      "Lokka a révolutionné ma gestion locative. Mes locataires téléchargent leurs quittances PDF certifiées directement depuis leur espace web, et je n'ai plus jamais à rédiger de reçus papier manuscrits.",
    name: "Aïcha Houndété",
    role: "Propriétaire Bailleur · Calavi · 8 logements",
    avatar: "https://i.pravatar.cc/80?img=12",
  },
  {
    quote:
      "Grâce au site vitrine généré en 1 clic et aux Comptes-Rendus de Gestion (CRG) édités pour nos propriétaires mandants avec les 10% de commission Loi 2022-30, notre agence a gagné une crédibilité exceptionnelle.",
    name: "Aristide Gbaguidi",
    role: "Directeur d'Agence Immobilière · Cotonou Haie Vive · 24 lots",
    avatar: "https://i.pravatar.cc/80?img=68",
  },
  {
    quote:
      "Gérant mes biens à Cotonou depuis Paris, le double affichage FCFA / Euros et les notifications de paiement MoMo en direct me procurent une totale tranquillité d'esprit sans intermédiaire douteux.",
    name: "Dr. Fabrice Tossou",
    role: "Investisseur Diaspora · Paris & Cotonou · 6 biens",
    avatar: "https://i.pravatar.cc/80?img=47",
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="py-24 sm:py-32 bg-[#FAF9F6] border-t border-[#E8E5E0]"
    >
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl mb-16 text-center mx-auto sm:text-left sm:mx-0"
        >
          <div className="section-label mb-3 text-[#1C1C1C]">Témoignages</div>
          <h2 className="heading-2 text-[#1C1C1C]">Ils gèrent et louent avec Lokka</h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col justify-between p-7 sm:p-8 rounded-[10px] bg-white border border-[#E8E5E0] shadow-xs group hover:-translate-y-1 hover:border-[#1C1C1C] transition-all duration-300"
            >
              <p className="text-[15px] sm:text-[16px] leading-relaxed text-[#1C1C1C] mb-8 font-medium">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3.5 pt-4 border-t border-[#FAF9F6]">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="h-11 w-11 rounded-full object-cover border border-[#E8E5E0] shrink-0"
                />
                <div>
                  <div className="text-[14px] font-bold text-[#1C1C1C]">{t.name}</div>
                  <div className="text-[12px] font-medium text-[#64635F]">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
