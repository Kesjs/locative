"use client";

import EmailOtpForm from "./EmailOtpForm";

export default function CTA() {
  return (
    <section id="signup-final" className="landing-section bg-brand-primary py-20 text-white sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_0.7fr] lg:items-end lg:gap-24">
        <div data-landing-reveal><p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55">Commencez simplement</p><h2 className="mt-5 max-w-[680px] text-[clamp(2.25rem,5vw,4.15rem)] font-semibold leading-[0.96] tracking-[-0.07em] text-white">Prêt à simplifier votre<span className="mt-2 block font-serif font-normal italic text-white/70">gestion locative au Bénin ?</span></h2><p className="mt-6 max-w-[520px] text-[14px] leading-relaxed text-white/65">Rejoignez les bailleurs, agences et investisseurs de la diaspora qui ont digitalisé leurs baux, automatisé leurs quittances et créé leur site vitrine.</p></div>
        <div data-landing-reveal className="border-t border-white/20 pt-5"><EmailOtpForm source="landing_cta" buttonLabel="Démarrer" dark helperText="Inscription gratuite · Sans carte bancaire · Activation en 2 minutes." /></div>
      </div>
    </section>
  );
}
