"use client";

import { motion } from "framer-motion";
import { PROOF_METRICS } from "./landing-data";

export default function Stats() {
  return (
    <section id="preuves" className="landing-section bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="grid rounded-2xl border border-slate-200 bg-slate-50/70 sm:grid-cols-4 overflow-hidden shadow-2xs"
        >
          {PROOF_METRICS.map((metric, index) => (
            <div key={metric.label} className={`p-6 sm:p-7 ${index < PROOF_METRICS.length - 1 ? "border-b border-slate-200 sm:border-b-0 sm:border-r" : ""}`}>
              <p className="tabular-nums text-[26px] font-bold tracking-tight text-slate-900 sm:text-[30px]">{metric.value}</p>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700">{metric.label}</p>
            </div>
          ))}
        </motion.div>
        <p className="mt-3.5 text-center text-[11.5px] font-medium text-slate-500">
          Indicateurs de performance vérifiés · Plateforme conforme à la Loi n° 2022-30 au Bénin.
        </p>
      </div>
    </section>
  );
}
