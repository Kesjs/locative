"use client";

import { Accordion } from "radix-ui";
import { ChevronDown } from "lucide-react";
import { FAQS } from "./landing-data";

export default function FAQ() {
  return (
    <section id="faq" className="landing-section bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div data-landing-reveal className="max-w-[650px]"><p className="landing-label">Questions de gestion</p><h2 className="mt-4 text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1] tracking-[-0.06em] text-text-primary">Tout ce que vous devez savoir<span className="mt-1 block font-serif font-normal italic text-text-secondary">avant de commencer.</span></h2><p className="mt-5 text-[14px] leading-relaxed text-text-secondary">Des réponses claires pour comprendre le fonctionnement de votre espace et de votre site vitrine.</p></div>
        <Accordion.Root type="single" collapsible defaultValue="faq-0" className="mt-10 border-y border-border-default" data-landing-reveal>
          {FAQS.map((faq, index) => <Accordion.Item key={faq.question} value={`faq-${index}`} className="border-b border-border-default last:border-b-0"><Accordion.Header asChild><h3><Accordion.Trigger asChild><button type="button" className="group flex min-h-[66px] w-full items-center justify-between gap-5 text-left text-[13px] font-semibold text-text-primary hover:text-success-strong"><span>{faq.question}</span><ChevronDown aria-hidden="true" size={17} className="shrink-0 text-text-muted transition-transform duration-200 group-data-[state=open]:rotate-180 group-data-[state=open]:text-text-primary" /></button></Accordion.Trigger></h3></Accordion.Header><Accordion.Content asChild><div className="faq-content overflow-hidden text-[13px] leading-relaxed text-text-secondary"><p className="max-w-[760px] pb-6 pr-8">{faq.answer}</p></div></Accordion.Content></Accordion.Item>)}
        </Accordion.Root>
      </div>
    </section>
  );
}
