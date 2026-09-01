"use client";

import { motion } from "framer-motion";
import EmailOtpForm from "./EmailOtpForm";

export default function CTA() {
  return (
    <section id="signup-final" className="landing-section relative overflow-hidden bg-slate-900 py-16 text-white sm:py-24">
      {/* Subtle Emerald Glow */}
      <div className="pointer-events-none absolute right-1/4 top-1/2 h-[340px] w-[500px] -translate-y-1/2 rounded-full bg-emerald-500/[0.08] blur-3xl" />

      <div className="relative z-10 mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_0.75fr] lg:items-end lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Commencez simplement</p>
          <h2 className="mt-2 max-w-[640px] text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight tracking-tight text-white">
            Prêt à simplifier votre
            <span className="mt-1 block font-serif font-normal italic text-slate-300">gestion locative au Bénin ?</span>
          </h2>
          <p className="mt-4 max-w-[500px] text-[14.5px] leading-relaxed text-slate-400">
            Rejoignez les bailleurs, agences et investisseurs de la diaspora qui ont digitalisé leurs baux, automatisé leurs quittances certifiées et créé leur site vitrine.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="border-t border-slate-800 pt-6 lg:border-t-0 lg:pt-0"
        >
          <EmailOtpForm source="landing_cta" buttonLabel="Démarrer" dark helperText="Inscription gratuite · Sans carte bancaire · Activation en 2 minutes." />
        </motion.div>
      </div>
    </section>
  );
}
