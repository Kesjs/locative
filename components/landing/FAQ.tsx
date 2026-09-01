"use client";

import { motion } from "framer-motion";
import { Accordion } from "radix-ui";
import { ChevronDown } from "lucide-react";
import { FAQS } from "./landing-data";

export default function FAQ() {
  return (
    <section id="faq" className="landing-section bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[680px]"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#9D6B3C]">Questions fréquentes</p>
          <h2 className="mt-4 text-[clamp(2.1rem,4.2vw,3.3rem)] font-extrabold leading-[1.02] tracking-[-0.05em] text-[#18181B]">
            Tout ce que vous devez savoir
            <span className="mt-1 block font-serif font-normal italic text-[#52525B]">avant de commencer.</span>
          </h2>
          <p className="mt-5 text-[15px] leading-[1.7] text-[#3F3F46]">
            Des réponses concrètes et précises pour comprendre le fonctionnement de votre espace de gestion et de votre site vitrine.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <Accordion.Root type="single" collapsible defaultValue="faq-0" className="mt-10 border-y border-[#E8E3DC]">
            {FAQS.map((faq, index) => (
              <Accordion.Item key={faq.question} value={`faq-${index}`} className="border-b border-[#E8E3DC] last:border-b-0">
                <Accordion.Header asChild>
                  <h3>
                    <Accordion.Trigger asChild>
                      <button type="button" className="group flex min-h-[68px] w-full items-center justify-between gap-5 text-left text-[14.5px] font-bold text-[#18181B] hover:text-[#9D6B3C] transition-colors cursor-pointer py-4">
                        <span>{faq.question}</span>
                        <ChevronDown aria-hidden="true" size={18} className="shrink-0 text-[#71717A] transition-transform duration-200 group-data-[state=open]:rotate-180 group-data-[state=open]:text-[#9D6B3C]" />
                      </button>
                    </Accordion.Trigger>
                  </h3>
                </Accordion.Header>
                <Accordion.Content asChild>
                  <div className="faq-content overflow-hidden text-[14px] leading-relaxed text-[#52525B]">
                    <p className="max-w-[760px] pb-6 pr-8">{faq.answer}</p>
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </motion.div>
      </div>
    </section>
  );
}
