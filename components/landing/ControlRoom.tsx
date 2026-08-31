"use client";

import { useState } from "react";
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
    <section id="controle" data-control-room className="landing-section bg-bg-canvas py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div data-landing-reveal className="max-w-[700px]">
          <p className="landing-label">Pilotage quotidien</p>
          <h2 className="mt-4 text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1] tracking-[-0.06em] text-text-primary">
            Ce qui mérite votre attention,
            <span className="mt-1 block font-serif font-normal italic text-text-secondary">pas seulement ce qui va bien.</span>
          </h2>
          <p className="mt-5 max-w-[620px] text-[14px] leading-relaxed text-text-secondary">
            Les encaissements donnent le rythme. Les retards, les logements vacants et les règles de caution indiquent ce qu&apos;il faut décider ensuite.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(260px,0.75fr)]">
          <div data-landing-reveal className="min-w-0 border border-border-default bg-white">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border-default px-5 py-4 sm:px-7">
              <div>
                <p className="landing-label">Rapport de revenus</p>
                <h3 className="mt-1 text-[14px] font-semibold text-text-primary">Évolution des loyers encaissés</h3>
              </div>
              <span className="text-[11px] font-medium text-text-muted">Jan — Juin 2026 · FCFA</span>
            </div>
            <div className="h-[275px] px-2 py-5 sm:px-5">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={REVENUE_DATA} margin={{ top: 8, right: 12, bottom: 4, left: -12 }} barCategoryGap="28%" aria-label="Évolution des loyers encaissés de janvier à juin 2026">
                  <CartesianGrid vertical={false} stroke="#E4E0D8" strokeDasharray="2 4" />
                  <XAxis dataKey="month" tick={{ fill: "#71717A", fontSize: 10 }} axisLine={{ stroke: "#E4E0D8" }} tickLine={false} />
                  <YAxis tickFormatter={formatMillions} tick={{ fill: "#71717A", fontSize: 10 }} axisLine={false} tickLine={false} width={45} domain={[0, 1600000]} />
                  <Tooltip cursor={{ fill: "rgba(24,24,27,0.04)" }} formatter={(value) => [`${Number(value).toLocaleString("fr-FR")} FCFA`, "Loyers encaissés"]} contentStyle={{ border: "1px solid #E4E0D8", borderRadius: "6px", boxShadow: "0 8px 24px rgba(24,24,27,0.08)", fontSize: "11px" }} />
                  <Bar dataKey="value" fill="#18181B" radius={[3, 3, 0, 0]} isAnimationActive animationDuration={700} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid border-t border-border-default sm:grid-cols-2">
              <div className="border-b border-border-default px-5 py-4 sm:border-b-0 sm:border-r sm:px-7"><p className="text-[11px] text-text-muted">Taux de recouvrement</p><p className="tabular-nums mt-1 text-[23px] font-semibold tracking-[-0.04em] text-text-primary">90%</p><p className="text-[10px] text-text-secondary">sur les loyers attendus</p></div>
              <div className="px-5 py-4 sm:px-7"><p className="text-[11px] text-text-muted">Occupation</p><p className="tabular-nums mt-1 text-[23px] font-semibold tracking-[-0.04em] text-text-primary">80%</p><p className="text-[10px] text-text-secondary">4 / 5 biens loués</p></div>
            </div>
          </div>

          <aside data-landing-reveal className="border border-border-default bg-white p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4 border-b border-border-default pb-4"><div><p className="landing-label">À traiter</p><h3 className="mt-1 text-[14px] font-semibold text-text-primary">Un loyer en retard</h3></div><CircleAlert aria-hidden="true" size={18} className="text-danger" /></div>
            <div className="py-5"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-danger">Retard · J+6</p><p className="mt-2 text-[16px] font-semibold text-text-primary">Koudjo Dossou</p><p className="mt-1 text-[12px] text-text-secondary">150 000 FCFA à relancer</p><button type="button" onClick={() => setIsReminderSent((current) => !current)} aria-expanded={isReminderSent} aria-controls="reminder-detail" className="mt-6 inline-flex items-center gap-2 border-b border-text-primary pb-1 text-[11px] font-semibold text-text-primary hover:border-danger hover:text-danger">{isReminderSent ? "Masquer le contexte" : "Envoyer une relance"}<ArrowRight aria-hidden="true" size={13} /></button><div id="reminder-detail" aria-live="polite" className={`mt-4 border-l-2 border-warning pl-3 text-[11px] leading-relaxed text-text-secondary ${isReminderSent ? "block" : "hidden"}`}>Relance WhatsApp automatique envoyée. Le suivi reste attaché au dossier du locataire.</div></div>
            <div className="border-t border-border-default pt-5"><div className="flex items-start gap-2"><ShieldCheck aria-hidden="true" size={16} className="mt-0.5 text-success-strong" /><div><p className="text-[11px] font-semibold text-text-primary">Règle appliquée</p><p className="mt-1 text-[11px] leading-relaxed text-text-secondary">Caution limitée à 3 mois selon la Loi n° 2022-30.</p></div></div></div>
          </aside>
        </div>
      </div>
    </section>
  );
}
