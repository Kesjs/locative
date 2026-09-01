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
    <section id="controle" data-control-room className="landing-section bg-[#F8FAF9] py-16 sm:py-24 border-t border-slate-200/80">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[660px]"
        >
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Pilotage quotidien</p>
          <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
            Ce qui mérite votre attention,
            <span className="block font-serif font-normal italic text-slate-600 text-[0.95em] mt-1">pas seulement ce qui va bien.</span>
          </h2>
          <p className="mt-3 max-w-[580px] text-[14.5px] leading-relaxed text-slate-600">
            Les encaissements donnent le rythme. Les retards, les logements vacants et les règles de caution indiquent précisément ce qu&apos;il faut décider ensuite.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.75fr)]"
        >
          <div className="min-w-0 rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-7">
              <div>
                <p className="text-[10.5px] font-bold uppercase tracking-wider text-emerald-700">Rapport de revenus</p>
                <h3 className="mt-0.5 text-[15px] font-bold text-slate-900">Évolution des loyers encaissés</h3>
              </div>
              <span className="text-[12px] font-medium text-slate-500">Jan — Juin 2026 · FCFA</span>
            </div>
            <div className="h-[270px] px-2 py-5 sm:px-5">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={REVENUE_DATA} margin={{ top: 8, right: 12, bottom: 4, left: -12 }} barCategoryGap="28%" aria-label="Évolution des loyers encaissés de janvier à juin 2026">
                  <CartesianGrid vertical={false} stroke="#F1F5F9" strokeDasharray="2 4" />
                  <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 11, fontWeight: 500 }} axisLine={{ stroke: "#E2E8F0" }} tickLine={false} />
                  <YAxis tickFormatter={formatMillions} tick={{ fill: "#64748B", fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} width={45} domain={[0, 1600000]} />
                  <Tooltip cursor={{ fill: "rgba(5,150,105,0.06)" }} formatter={(value) => [`${Number(value).toLocaleString("fr-FR")} FCFA`, "Loyers encaissés"]} contentStyle={{ border: "1px solid #E2E8F0", borderRadius: "10px", backgroundColor: "#FFFFFF", boxShadow: "0 8px 24px rgba(15,23,42,0.06)", fontSize: "12px", color: "#0F172A" }} />
                  <Bar dataKey="value" fill="#059669" radius={[6, 6, 0, 0]} isAnimationActive animationDuration={900} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid border-t border-slate-100 sm:grid-cols-2">
              <div className="border-b border-slate-100 px-5 py-4 sm:border-b-0 sm:border-r sm:px-7"><p className="text-[11px] font-medium text-slate-500">Taux de recouvrement</p><p className="tabular-nums mt-0.5 text-[22px] font-bold tracking-tight text-slate-900">90%</p><p className="text-[11px] font-medium text-slate-500">sur les loyers attendus</p></div>
              <div className="px-5 py-4 sm:px-7"><p className="text-[11px] font-medium text-slate-500">Occupation</p><p className="tabular-nums mt-0.5 text-[22px] font-bold tracking-tight text-slate-900">80%</p><p className="text-[11px] font-medium text-slate-500">4 / 5 biens loués</p></div>
            </div>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-rose-600">À traiter</p>
                  <h3 className="mt-0.5 text-[15px] font-bold text-slate-900">Un loyer en retard</h3>
                </div>
                <CircleAlert aria-hidden="true" size={20} className="text-rose-500" />
              </div>
              <div className="py-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-rose-600">Retard · J+6</p>
                <p className="mt-1 text-[16px] font-bold text-slate-900">Koudjo Dossou</p>
                <p className="mt-0.5 text-[13px] font-medium text-slate-500">150 000 FCFA à relancer</p>
                <button type="button" onClick={() => setIsReminderSent((current) => !current)} aria-expanded={isReminderSent} aria-controls="reminder-detail" className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer">{isReminderSent ? "Masquer le contexte" : "Envoyer une relance WhatsApp"}<ArrowRight aria-hidden="true" size={13} /></button>
                <div id="reminder-detail" aria-live="polite" className={`mt-3.5 border border-slate-200 bg-slate-50 p-3 rounded-xl text-[12px] leading-relaxed text-slate-600 ${isReminderSent ? "block" : "hidden"}`}>Relance WhatsApp prête avec le lien de paiement direct. L&apos;historique reste attaché au dossier du locataire.</div>
              </div>
            </div>
            <div className="border-t border-slate-100 pt-4">
              <div className="flex items-start gap-2.5">
                <ShieldCheck aria-hidden="true" size={18} className="mt-0.5 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-[12px] font-bold text-slate-900">Règle légale appliquée</p>
                  <p className="mt-0.5 text-[11.5px] leading-relaxed text-slate-500">Caution limitée à 3 mois maximum selon la Loi n° 2022-30 au Bénin.</p>
                </div>
              </div>
            </div>
          </aside>
        </motion.div>
      </div>
    </section>
  );
}
