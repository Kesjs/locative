"use client";

import { motion } from "framer-motion";
import { PROOF_METRICS } from "./landing-data";

export default function Stats() {
  return (
    <section id="preuves" className="landing-section bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="grid rounded-lg border border-[#E8E3DC] bg-[#FAF9F6] sm:grid-cols-4 overflow-hidden shadow-2xs"
        >
          {PROOF_METRICS.map((metric, index) => (
            <div key={metric.label} className={`p-6 sm:p-7 ${index < PROOF_METRICS.length - 1 ? "border-b border-[#E8E3DC] sm:border-b-0 sm:border-r" : ""}`}>
              <p className="tabular-nums text-[28px] font-extrabold tracking-[-0.05em] text-[#18181B] sm:text-[32px]">{metric.value}</p>
              <p className="mt-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#9D6B3C]">{metric.label}</p>
            </div>
          ))}
        </motion.div>
        <p className="mt-4 text-center text-[12px] font-medium text-[#71717A]">
          Indicateurs de performance vérifiés · Plateforme conforme à la Loi n° 2022-30 au Bénin.
        </p>
      </div>
    </section>
  );
}
