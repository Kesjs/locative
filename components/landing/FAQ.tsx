"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageCircle, HelpCircle, ArrowUpRight } from "lucide-react";
import { FAQS } from "./landing-data";

export default function FAQ() {
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set([0, 1]));

  const toggleAccordion = (index: number) => {
    setOpenIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  // Split FAQs into 2 columns for a balanced layout
  const col1 = FAQS.filter((_, i) => i % 2 === 0);
  const col2 = FAQS.filter((_, i) => i % 2 === 1);

  return (
    <section id="faq" className="relative overflow-hidden bg-white py-16 sm:py-24 border-t border-slate-200/80">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        
        {/* En-tête Centré & Épuré */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-2xl text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-[11.5px] font-semibold text-emerald-800 mb-3.5">
            <HelpCircle size={13} className="text-emerald-600" />
            Questions fréquentes
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
            Tout ce que vous devez savoir
            <span className="block font-serif font-normal italic text-slate-600 text-[0.95em] mt-1">
              pour bien démarrer.
            </span>
          </h2>

          <p className="mt-3 text-[14.5px] sm:text-[15.5px] leading-relaxed text-slate-600">
            Des réponses concrètes sur la gestion de vos biens, vos encaissements Mobile Money et votre conformité.
          </p>
        </motion.div>

        {/* Grille FAQ en 2 Colonnes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 items-start">
          
          {/* Colonne 1 */}
          <div className="space-y-4">
            {col1.map((faq, idx) => {
              const actualIndex = idx * 2;
              const isOpen = openIndexes.has(actualIndex);

              return (
                <div
                  key={faq.question}
                  className={`rounded-xl border transition-all duration-200 overflow-hidden bg-slate-50/50 ${
                    isOpen
                      ? "border-emerald-500/40 bg-white shadow-sm ring-1 ring-emerald-500/10"
                      : "border-slate-200/80 hover:border-slate-300 hover:bg-white"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(actualIndex)}
                    className="flex w-full items-center justify-between gap-3.5 p-4 sm:p-5 text-left cursor-pointer select-none"
                  >
                    <span className="text-[14.5px] sm:text-[15px] font-semibold text-slate-900 leading-snug">
                      {faq.question}
                    </span>

                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-transform duration-200 ${
                        isOpen
                          ? "rotate-180 bg-emerald-600 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <ChevronDown size={15} />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                      >
                        <div className="border-t border-slate-100 px-4 sm:px-5 pb-5 pt-3 text-[13.5px] sm:text-[14px] leading-relaxed text-slate-600">
                          <p>{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Colonne 2 */}
          <div className="space-y-4">
            {col2.map((faq, idx) => {
              const actualIndex = idx * 2 + 1;
              const isOpen = openIndexes.has(actualIndex);

              return (
                <div
                  key={faq.question}
                  className={`rounded-xl border transition-all duration-200 overflow-hidden bg-slate-50/50 ${
                    isOpen
                      ? "border-emerald-500/40 bg-white shadow-sm ring-1 ring-emerald-500/10"
                      : "border-slate-200/80 hover:border-slate-300 hover:bg-white"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(actualIndex)}
                    className="flex w-full items-center justify-between gap-3.5 p-4 sm:p-5 text-left cursor-pointer select-none"
                  >
                    <span className="text-[14.5px] sm:text-[15px] font-semibold text-slate-900 leading-snug">
                      {faq.question}
                    </span>

                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-transform duration-200 ${
                        isOpen
                          ? "rotate-180 bg-emerald-600 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <ChevronDown size={15} />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                      >
                        <div className="border-t border-slate-100 px-4 sm:px-5 pb-5 pt-3 text-[13.5px] sm:text-[14px] leading-relaxed text-slate-600">
                          <p>{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>

        {/* Encadré d'Assistance Directe / WhatsApp */}
        <div className="mx-auto max-w-4xl mt-10 sm:mt-12 p-5 sm:p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200/60">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <MessageCircle size={20} />
              </div>
              <div>
                <h4 className="text-[14.5px] font-bold text-slate-900">Vous avez une autre question ?</h4>
                <p className="text-[13px] text-slate-600">
                  Notre équipe à Cotonou vous répond en direct 7j/7 sur WhatsApp.
                </p>
              </div>
            </div>

            <a
              href="https://wa.me/22900000000?text=Bonjour%20Lokka,%20j'ai%20une%20question%20sur%20la%20plateforme"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-semibold shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              <span>Discuter sur WhatsApp</span>
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
