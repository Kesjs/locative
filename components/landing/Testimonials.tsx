"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const testimonials = [
  {
    quote:
      "Lokka a complètement changé ma façon de gérer mes biens. Avant, je perdais des heures chaque mois sur des reçus papier et des cahiers. Maintenant, tout est clair et automatisé.",
    name: "Aïcha Houndété",
    role: "Propriétaire bailleur · Calavi · 8 biens",
    avatar: "https://i.pravatar.cc/48?img=12",
  },
  {
    quote:
      "L'interface est d'une clarté remarquable. Mes locataires paient par MTN MoMo ou Moov Money, reçoivent leurs quittances automatiquement, et je suis tout en direct.",
    name: "Aristide Gbaguidi",
    role: "Gestionnaire de parc · Cotonou · 15 biens",
    avatar: "https://i.pravatar.cc/48?img=68",
  },
  {
    quote:
      "Gérant mes biens depuis l'étranger, Lokka me permet de suivre les encaissements MoMo en direct et d'avoir des baux 100% conformes à la loi béninoise.",
    name: "Dr. Fabrice Tossou",
    role: "Investisseur Diaspora · Paris & Cotonou · 6 biens",
    avatar: "https://i.pravatar.cc/48?img=47",
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} id="testimonials" className="py-24" style={{ backgroundColor: "#FAF9F6", borderTop: "1px solid #E8E5E0" }}>
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl mb-16 text-center mx-auto sm:text-left sm:mx-0"
        >
          <div className="section-label mb-4">Témoignages</div>
          <h2 className="heading-2">Ils nous font confiance</h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col justify-between p-8 rounded-[8px] bg-white group hover:-translate-y-1 transition-transform duration-300"
              style={{ border: "1px solid #E8E5E0", boxShadow: "4px 4px 0px rgba(232,229,224,0.5)" }}
            >
              <p 
                className="heading-2 mb-10" 
                style={{ fontSize: "1.5rem", lineHeight: 1.4, color: "#1C1C1C", letterSpacing: "0.01em" }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="h-12 w-12 rounded-[4px] object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                  style={{ border: "1px solid #E8E5E0" }}
                />
                <div>
                  <div className="text-[14px] font-bold text-[#1C1C1C]">
                    {t.name}
                  </div>
                  <div className="text-[13px] font-medium text-[#64635F]">
                    {t.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
