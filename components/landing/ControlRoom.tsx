"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CircleAlert, ShieldCheck } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { REVENUE_DATA } from "./landing-data";

function formatMillions(value: number) {
  return `${(value / 1000000).toLocaleString("fr-FR", { maximumFractionDigits: 2 })} M`;
}

export default function ControlRoom() {
  const [isReminderSent, setIsReminderSent] = useState(false);

  return (
    <section id="controle" data-control-room className="landing-section bg-[#FAF9F6] py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[700px]"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#9D6B3C]">Pilotage quotidien</p>
          <h2 className="mt-4 text-[clamp(2.1rem,4.2vw,3.3rem)] font-extrabold leading-[1.02] tracking-[-0.05em] text-[#18181B]">
            Ce qui mérite votre attention,
            <span className="mt-1 block font-serif font-normal italic text-[#52525B]">pas seulement ce qui va bien.</span>
          </h2>
          <p className="mt-5 max-w-[620px] text-[15px] leading-[1.7] text-[#3F3F46]">
            Les encaissements donnent le rythme. Les retards, les logements vacants et les règles de caution indiquent précisément ce qu&apos;il faut décider ensuite.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.75fr)]"
        >
          <div className="min-w-0 rounded-lg border border-[#E8E3DC] bg-white shadow-xs">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#E8E3DC] px-5 py-4 sm:px-7">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#9D6B3C]">Rapport de revenus</p>
                <h3 className="mt-1 text-[15px] font-bold text-[#18181B]">Évolution des loyers encaissés</h3>
              </div>
              <span className="text-[12px] font-semibold text-[#71717A]">Jan — Juin 2026 · FCFA</span>
            </div>
            <div className="h-[275px] px-2 py-5 sm:px-5">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={REVENUE_DATA} margin={{ top: 8, right: 12, bottom: 4, left: -12 }} barCategoryGap="28%" aria-label="Évolution des loyers encaissés de janvier à juin 2026">
                  <CartesianGrid vertical={false} stroke="#E8E3DC" strokeDasharray="2 4" />
                  <XAxis dataKey="month" tick={{ fill: "#71717A", fontSize: 11, fontWeight: 500 }} axisLine={{ stroke: "#E8E3DC" }} tickLine={false} />
                  <YAxis tickFormatter={formatMillions} tick={{ fill: "#71717A", fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} width={45} domain={[0, 1600000]} />
                  <Tooltip cursor={{ fill: "rgba(157,107,60,0.06)" }} formatter={(value) => [`${Number(value).toLocaleString("fr-FR")} FCFA`, "Loyers encaissés"]} contentStyle={{ border: "1px solid #E8E3DC", borderRadius: "8px", backgroundColor: "#FFFFFF", boxShadow: "0 8px 24px rgba(24,24,27,0.08)", fontSize: "12px", color: "#18181B" }} />
                  <Bar dataKey="value" fill="#9D6B3C" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={900} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid border-t border-[#E8E3DC] sm:grid-cols-2">
              <div className="border-b border-[#E8E3DC] px-5 py-4 sm:border-b-0 sm:border-r sm:px-7"><p className="text-[11px] font-medium text-[#71717A]">Taux de recouvrement</p><p className="tabular-nums mt-1 text-[24px] font-bold tracking-[-0.04em] text-[#18181B]">90%</p><p className="text-[11px] font-medium text-[#52525B]">sur les loyers attendus</p></div>
              <div className="px-5 py-4 sm:px-7"><p className="text-[11px] font-medium text-[#71717A]">Occupation</p><p className="tabular-nums mt-1 text-[24px] font-bold tracking-[-0.04em] text-[#18181B]">80%</p><p className="text-[11px] font-medium text-[#52525B]">4 / 5 biens loués</p></div>
            </div>
          </div>

          <aside className="rounded-lg border border-[#E8E3DC] bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-4 border-b border-[#E8E3DC] pb-4">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#E11D48]">À traiter</p>
                  <h3 className="mt-1 text-[15px] font-bold text-[#18181B]">Un loyer en retard</h3>
                </div>
                <CircleAlert aria-hidden="true" size={20} className="text-[#E11D48]" />
              </div>
              <div className="py-5">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#E11D48]">Retard · J+6</p>
                <p className="mt-2 text-[17px] font-bold text-[#18181B]">Koudjo Dossou</p>
                <p className="mt-1 text-[13px] font-medium text-[#52525B]">150 000 FCFA à relancer</p>
                <button type="button" onClick={() => setIsReminderSent((current) => !current)} aria-expanded={isReminderSent} aria-controls="reminder-detail" className="mt-5 inline-flex items-center gap-2 border-b-2 border-[#18181B] pb-1 text-[12px] font-bold text-[#18181B] hover:border-[#E11D48] hover:text-[#E11D48] transition-colors cursor-pointer">{isReminderSent ? "Masquer le contexte" : "Envoyer une relance WhatsApp"}<ArrowRight aria-hidden="true" size={13} /></button>
                <div id="reminder-detail" aria-live="polite" className={`mt-4 border-l-2 border-[#9D6B3C] bg-[#F6EFE7]/50 p-2.5 rounded-r-md text-[12px] leading-relaxed text-[#3F3F46] ${isReminderSent ? "block" : "hidden"}`}>Relance WhatsApp prête avec le lien de paiement direct. L&apos;historique reste attaché au dossier du locataire.</div>
              </div>
            </div>
            <div className="border-t border-[#E8E3DC] pt-5">
              <div className="flex items-start gap-2.5">
                <ShieldCheck aria-hidden="true" size={18} className="mt-0.5 text-[#15803D] shrink-0" />
                <div>
                  <p className="text-[12px] font-bold text-[#18181B]">Règle légale appliquée</p>
                  <p className="mt-1 text-[11.5px] leading-relaxed text-[#52525B]">Caution limitée à 3 mois maximum selon la Loi n° 2022-30 au Bénin.</p>
                </div>
              </div>
            </div>
          </aside>
        </motion.div>
      </div>
    </section>
  );
}
