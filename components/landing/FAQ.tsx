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
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        
        {/* En-tête Centré */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-2xl text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F6EFE7] border border-[#E8E3DC] text-[11.5px] font-extrabold uppercase tracking-[0.14em] text-[#9D6B3C] mb-4">
            <HelpCircle size={13} className="text-[#9D6B3C]" />
            Questions fréquentes
          </div>

          <h2 className="text-[clamp(2.1rem,4.2vw,3.3rem)] font-extrabold leading-[1.08] tracking-[-0.045em] text-[#18181B]">
            Tout ce que vous devez savoir
            <span className="mt-1 block font-serif font-normal italic text-[#52525B]">
              avant de démarrer.
            </span>
          </h2>

          <p className="mt-4 text-[15px] sm:text-[16px] leading-[1.65] font-medium text-[#52525B]">
            Des réponses concrètes pour gérer vos biens, vos encaissements Mobile Money et votre conformité en toute sérénité.
          </p>
        </motion.div>

        {/* Onglets de Catégories Horizontaux Centrés */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
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
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#18181B] text-white shadow-xs"
                    : "bg-[#FAF9F6] text-[#52525B] hover:bg-[#F6EFE7] hover:text-[#18181B] border border-[#E8E3DC]"
                }`}
              >
                <span>{category.label}</span>
                <span
                  className={`text-[11px] font-mono px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-[#E8E3DC]/70 text-[#71717A]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Accordéon Accordé Centré & Fluide */}
        <div className="mx-auto max-w-3xl space-y-3.5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3.5"
            >
              {filteredFaqs.map((faq, index) => {
                const isOpen = openIndex === index;

                return (
                  <div
                    key={faq.question}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isOpen
                        ? "bg-white border-[#9D6B3C]/60 shadow-sm ring-2 ring-[#9D6B3C]/10"
                        : "bg-white border-[#E8E3DC] hover:border-[#9D6B3C]/40 shadow-2xs"
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
                        <span
                          className={`text-[15px] sm:text-[16px] font-bold transition-colors ${
                            isOpen ? "text-[#18181B]" : "text-[#18181B] hover:text-[#9D6B3C]"
                          }`}
                        >
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
                          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <div className="border-t border-[#E8E3DC]/60 px-5 sm:px-6 pb-6 pt-4 text-[14px] sm:text-[14.5px] leading-relaxed text-[#52525B]">
                            <p>{faq.answer}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Encadré d'Assistance Directe / WhatsApp Centré */}
        <div className="mx-auto max-w-3xl mt-12 p-6 rounded-2xl bg-[#FAF9F6] border border-[#E8E3DC] shadow-2xs">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-700">
                <MessageCircle size={22} />
              </div>
              <div>
                <h4 className="text-[15px] font-bold text-[#18181B]">Vous avez une autre question ?</h4>
                <p className="text-[13px] text-[#52525B]">
                  Notre équipe à Cotonou vous répond en direct 7j/7 sur WhatsApp.
                </p>
              </div>
            </div>

            <a
              href="https://wa.me/22900000000?text=Bonjour%20Lokka,%20j'ai%20une%20question%20sur%20la%20plateforme"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-[#18181B] hover:bg-[#9D6B3C] text-white text-[13px] font-bold shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              <span>Discuter sur WhatsApp</span>
              <ArrowUpRight size={15} />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
