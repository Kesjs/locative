"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageCircle, HelpCircle, ArrowUpRight } from "lucide-react";
import { FAQS, FAQ_CATEGORIES } from "./landing-data";
import type { FaqCategory } from "./landing-data";

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState<FaqCategory["id"]>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = activeCategory === "all"
    ? FAQS
    : FAQS.filter((faq) => faq.category === activeCategory);

  const toggleAccordion = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="relative overflow-hidden bg-white py-20 sm:py-28 border-t border-[#E8E3DC]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* ========================================================================= */}
          {/* COLONNE GAUCHE (Sticky sur Desktop) : En-tête, Filtres & Contact          */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F6EFE7] border border-[#E8E3DC] text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#9D6B3C] mb-4">
                <HelpCircle size={13} className="text-[#9D6B3C]" />
                Questions fréquentes
              </div>

              <h2 className="text-[clamp(2.1rem,3.8vw,3.2rem)] font-extrabold leading-[1.06] tracking-[-0.045em] text-[#18181B]">
                Tout ce que vous devez savoir
                <span className="mt-1 block font-serif font-normal italic text-[#52525B]">
                  avant de démarrer.
                </span>
              </h2>

              <p className="mt-4 text-[15px] leading-[1.65] font-medium text-[#52525B]">
                Des réponses transparentes et détaillées pour piloter vos biens en toute conformité et automatiser vos encaissements.
              </p>
            </motion.div>

            {/* Sélecteur de Catégories / Filtres */}
            <div className="space-y-1.5">
              <p className="text-[11.5px] font-bold uppercase tracking-[0.12em] text-[#71717A] mb-2 px-1">
                Filtrer par thème
              </p>
              <div className="flex flex-wrap lg:flex-col gap-1.5">
                {FAQ_CATEGORIES.map((category) => {
                  const isActive = activeCategory === category.id;
                  const count = category.id === "all"
                    ? FAQS.length
                    : FAQS.filter((f) => f.category === category.id).length;

                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => {
                        setActiveCategory(category.id);
                        setOpenIndex(0);
                      }}
                      className={`relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-200 text-left cursor-pointer ${
                        isActive
                          ? "bg-[#18181B] text-white shadow-xs"
                          : "bg-[#FAF9F6] text-[#52525B] hover:bg-[#F6EFE7] hover:text-[#18181B] border border-[#E8E3DC]/60"
                      }`}
                    >
                      <span>{category.label}</span>
                      <span
                        className={`ml-2 text-[11px] font-mono px-2 py-0.5 rounded-full ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-[#E8E3DC]/60 text-[#71717A]"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Encadré d'Assistance Directe / WhatsApp */}
            <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-[#E8E3DC] shadow-2xs">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-700">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-[#18181B]">Vous avez une question spécifique ?</h4>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-[#52525B]">
                    Notre équipe à Cotonou vous répond 7j/7 par WhatsApp ou email.
                  </p>
                  <a
                    href="https://wa.me/22900000000?text=Bonjour%20Lokka,%20j'ai%20une%20question%20sur%20la%20plateforme"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[#9D6B3C] hover:text-[#18181B] transition-colors"
                  >
                    <span>Échanger avec un conseiller</span>
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* COLONNE DROITE : Accordéon 21st.dev Animé et Interactif                   */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 space-y-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-3"
              >
                {filteredFaqs.map((faq, index) => {
                  const isOpen = openIndex === index;

                  return (
                    <motion.div
                      key={faq.question}
                      layout
                      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                        isOpen
                          ? "bg-white border-[#9D6B3C]/50 shadow-sm"
                          : "bg-white border-[#E8E3DC] hover:border-[#9D6B3C]/30 shadow-2xs"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleAccordion(index)}
                        className="flex w-full items-center justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-3.5 pr-2">
                          <span className="shrink-0 text-[11px] font-mono font-bold text-[#9D6B3C] bg-[#F6EFE7] px-2 py-0.5 rounded-md">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className={`text-[15px] sm:text-[16px] font-bold transition-colors ${
                            isOpen ? "text-[#18181B]" : "text-[#18181B] hover:text-[#9D6B3C]"
                          }`}>
                            {faq.question}
                          </span>
                        </div>

                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform duration-300 ${
                            isOpen
                              ? "rotate-180 bg-[#18181B] text-white"
                              : "bg-[#FAF9F6] text-[#71717A] border border-[#E8E3DC]"
                          }`}
                        >
                          <ChevronDown size={16} />
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
                            <div className="border-t border-[#E8E3DC]/60 px-5 sm:px-6 pb-6 pt-4 text-[14px] sm:text-[14.5px] leading-relaxed text-[#52525B]">
                              <p className="max-w-[660px]">{faq.answer}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
