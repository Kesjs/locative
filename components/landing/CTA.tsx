"use client";

import { motion } from "framer-motion";
import EmailOtpForm from "./EmailOtpForm";

export default function CTA() {
  return (
    <section id="signup-final" className="landing-section relative overflow-hidden bg-[#18181B] py-20 text-white sm:py-28">
      {/* Subtle Warm Caramel Radial Glow */}
      <div className="pointer-events-none absolute right-1/4 top-1/2 h-[340px] w-[500px] -translate-y-1/2 rounded-full bg-[#9D6B3C]/10 blur-3xl" />

      <div className="relative z-10 mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_0.75fr] lg:items-end lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#9D6B3C]">Commencez simplement</p>
          <h2 className="mt-4 max-w-[680px] text-[clamp(2.3rem,5vw,4.2rem)] font-extrabold leading-[0.98] tracking-[-0.05em] text-white">
            Prêt à simplifier votre
            <span className="mt-2 block font-serif font-normal italic text-[#E8E3DC]">gestion locative au Bénin ?</span>
          </h2>
          <p className="mt-6 max-w-[520px] text-[15px] leading-relaxed text-[#D4D4D8]">
            Rejoignez les bailleurs, agences et investisseurs de la diaspora qui ont digitalisé leurs baux, automatisé leurs quittances certifiées et créé leur site vitrine.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="border-t border-white/20 pt-6 lg:border-t-0 lg:pt-0"
        >
          <EmailOtpForm source="landing_cta" buttonLabel="Démarrer" dark helperText="Inscription gratuite · Sans carte bancaire · Activation en 2 minutes." />
        </motion.div>
      </div>
    </section>
  );
}
