"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Minus } from "lucide-react";
import { Switch } from "radix-ui";
import { ADDONS, PLANS, buildComparisonRows, formatPlanPrice } from "./landing-data";
import type { BillingCycle } from "./types";

const GROUP_LABELS = new Map<string, string>([
  ["Nombre de biens", "Gérer le dossier"],
  ["Gestion basique (baux, locataires)", "Gérer le dossier"],
  ["Multi-propriétaires & mandats", "Gérer le dossier"],
  ["Paiements & quittances PDF manuels", "Encaisser & remettre les documents"],
  ["Paiements Mobile Money", "Encaisser & remettre les documents"],
  ["Portail locataire", "Encaisser & remettre les documents"],
  ["Reversements automatiques aux bailleurs", "Encaisser & remettre les documents"],
  ["Marketplace Lokka (annonces)", "Publier & trouver des locataires"],
  ["Vitrine web (lien standard)", "Publier & trouver des locataires"],
  ["Domaine personnalisé + thèmes", "Publier & trouver des locataires"],
  ["SEO & Blog inclus", "Publier & trouver des locataires"],
]);

export default function Pricing() {
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const rows = useMemo(() => buildComparisonRows(), []);
  const isAnnual = cycle === "annual";

  return (
    <section id="pricing" className="landing-section bg-[#FAF9F6] py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end"
        >
          <div className="max-w-[720px]">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#9D6B3C]">Tarifs clairs &amp; transparents</p>
            <h2 className="mt-4 text-[clamp(2.1rem,4.2vw,3.3rem)] font-extrabold leading-[1.02] tracking-[-0.05em] text-[#18181B]">
              Une tarification transparente
            </h2>
            <p className="mt-5 max-w-[620px] text-[15px] leading-[1.7] text-[#3F3F46]">
              Rentabilisé dès le premier mois grâce aux retards éliminés et à votre site vitrine clé en main.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-[#E8E3DC] bg-white p-1.5 px-4 shadow-2xs text-[12px] font-semibold text-[#52525B]">
            <span className={!isAnnual ? "text-[#18181B] font-bold" : "text-[#71717A]"}>Mensuel</span>
            <Switch.Root 
              checked={isAnnual} 
              onCheckedChange={(checked) => setCycle(checked ? "annual" : "monthly")} 
              asChild
            >
              <button 
                type="button" 
                aria-label="Basculer entre facturation mensuelle et annuelle" 
                className="relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border border-[#E8E3DC] bg-[#FAF9F6] p-0.5 data-[state=checked]:bg-[#9D6B3C] transition-colors cursor-pointer"
              >
                <Switch.Thumb className="block h-5 w-5 rounded-full bg-white shadow-xs transition-transform duration-200 data-[state=checked]:translate-x-5" />
              </button>
            </Switch.Root>
            <span className={isAnnual ? "text-[#18181B] font-bold" : "text-[#71717A]"}>Annuel</span>
            <span className="border-l border-[#E8E3DC] pl-3 text-[11px] font-extrabold text-[#15803D]">
              -20% de remise
            </span>
          </div>
        </motion.div>

        {/* Mobile View: Stacked Cards */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 grid gap-6 lg:hidden"
        >
          {PLANS.map((plan) => (
            <div 
              key={plan.name} 
              className={`relative flex flex-col rounded-[16px] border bg-white p-6 shadow-sm ${
                plan.popular ? "border-2 border-[#9D6B3C] ring-4 ring-[#9D6B3C]/10" : "border-[#E8E3DC]"
              }`}
            >
              <div className="mb-4 flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-[20px] font-bold text-[#18181B]">{plan.name}</h3>
                  <p className="mt-1 text-[13px] text-[#52525B]">{plan.description}</p>
                </div>
                {plan.badgeLabel && (
                  <span className="shrink-0 rounded-full bg-[#15803D] px-3 py-1 text-[10.5px] font-extrabold tracking-wider text-white uppercase shadow-xs">
                    {plan.badgeLabel}
                  </span>
                )}
              </div>
              
              <div className="mb-6 border-b border-[#E8E3DC] pb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-[30px] font-extrabold tracking-tight text-[#18181B]">
                    {formatPlanPrice(plan, cycle)}
                  </span>
                  {plan.period && <span className="text-[12px] font-semibold text-[#71717A]">{plan.period}</span>}
                </div>
                <p className="mt-1 text-[11.5px] font-medium text-[#71717A]">
                  {isAnnual ? plan.annualDetail : "Facturation mensuelle sans engagement"}
                </p>
              </div>
              
              <ul className="mb-8 flex-1 space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#15803D]" />
                  <span className="text-[13.5px] font-bold text-[#18181B]">
                    {plan.propertyLimit}
                  </span>
                </li>
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#15803D]" />
                    <span className="text-[13px] text-[#3F3F46]">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link 
                href="/auth/register" 
                className={`flex w-full items-center justify-center rounded-[8px] py-2.5 text-[13px] font-bold transition-colors shadow-xs ${
                  plan.popular 
                    ? "bg-[#9D6B3C] text-white hover:bg-[#85572E]" 
                    : "bg-[#FAF9F6] border border-[#E8E3DC] text-[#18181B] hover:bg-[#F6EFE7]"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
          
          <div className="rounded-[12px] border border-[#E8E3DC] bg-white p-4 text-[12.5px] text-[#52525B] shadow-2xs">
            <p className="mb-2">
              <span className="font-bold text-[#18181B]">{ADDONS[0].split(" :")[0]} :</span>
              {ADDONS[0].substring(ADDONS[0].indexOf(" :") + 2)}
            </p>
            <p>
              <span className="font-bold text-[#18181B]">{ADDONS[1].split(" :")[0]} :</span>
              {ADDONS[1].substring(ADDONS[1].indexOf(" :") + 2)}
            </p>
          </div>
        </motion.div>

        {/* Desktop View: Detailed Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 hidden rounded-lg border border-[#E8E3DC] bg-white shadow-xs lg:block overflow-hidden"
        >
          <div className="landing-table-scroll overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-left">
              <caption className="sr-only">
                Comparaison des plans Lokka en {isAnnual ? "facturation annuelle" : "facturation mensuelle"}
              </caption>
              <thead>
                <tr className="border-b border-[#E8E3DC] bg-[#FAF9F6]">
                  <th scope="col" className="sticky left-0 z-20 min-w-[220px] bg-[#FAF9F6] px-5 py-5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#71717A]">
                    Opérations
                  </th>
                  {PLANS.map((plan) => (
                    <th 
                      key={plan.name} 
                      scope="col" 
                      className={`min-w-[195px] border-l border-[#E8E3DC] px-5 py-5 align-top relative ${
                        plan.popular ? "border-t-2 border-t-[#9D6B3C] bg-[#F6EFE7]/30" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="text-[16px] font-bold text-[#18181B]">{plan.name}</div>
                        {plan.badgeLabel && (
                          <span className="rounded-full bg-[#15803D] px-2.5 py-0.5 text-[10px] font-extrabold tracking-wide text-white uppercase shadow-xs">
                            {plan.badgeLabel}
                          </span>
                        )}
                      </div>
                      <div className="tabular-nums text-[24px] font-extrabold tracking-[-0.04em] text-[#18181B]">
                        {formatPlanPrice(plan, cycle)}
                        {plan.period ? <span className="ml-1 text-[11px] font-semibold tracking-normal text-[#71717A]">{plan.period}</span> : null}
                      </div>
                      <div className="mt-1 text-[11px] font-medium leading-relaxed text-[#71717A]">
                        {isAnnual ? plan.annualDetail : "Facturation mensuelle sans engagement"}
                      </div>
                      <p className="mt-2.5 max-w-[24ch] text-[12px] font-medium leading-relaxed text-[#52525B]">
                        {plan.description}
                      </p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => {
                  const group = GROUP_LABELS.get(row.name);
                  const previousGroup = index > 0 ? GROUP_LABELS.get(rows[index - 1].name) : undefined;
                  return (
                    <React.Fragment key={row.name}>
                      {group && group !== previousGroup ? (
                        <tr>
                          <th scope="rowgroup" colSpan={4} className="border-y border-[#E8E3DC] bg-[#FAF9F6] px-5 py-3 text-[10.5px] font-extrabold uppercase tracking-[0.12em] text-[#9D6B3C]">
                            {group}
                          </th>
                        </tr>
                      ) : null}
                      <tr className="group border-b border-[#E8E3DC]/60 text-[13px] hover:bg-[#FAF9F6]">
                        <th scope="row" className="sticky left-0 z-10 bg-white px-5 py-3.5 font-semibold text-[#18181B] group-hover:bg-[#FAF9F6]">
                          {row.name}
                        </th>
                        <ComparisonCell value={row.decouverte} />
                        <ComparisonCell value={row.pro} highlighted />
                        <ComparisonCell value={row.agence} />
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="grid gap-2 border-t border-[#E8E3DC] bg-[#FAF9F6] px-5 py-4 text-[12px] text-[#52525B] sm:grid-cols-2">
            <p><span className="font-bold text-[#18181B]">{ADDONS[0].split(" :")[0]} :</span>{ADDONS[0].substring(ADDONS[0].indexOf(" :") + 2)}</p>
            <p><span className="font-bold text-[#18181B]">{ADDONS[1].split(" :")[0]} :</span>{ADDONS[1].substring(ADDONS[1].indexOf(" :") + 2)}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 flex flex-col justify-between gap-3 border-b border-[#E8E3DC] pb-6 text-[13px] text-[#52525B] sm:flex-row sm:items-center"
        >
          <p>Toutes nos formules incluent un essai gratuit de 14 jours sans engagement.</p>
          <Link href="/auth/register" className="font-bold text-[#18181B] underline underline-offset-4 hover:text-[#9D6B3C] transition-colors">
            Choisir mon forfait <span aria-hidden="true">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function ComparisonCell({ value, highlighted = false }: { value: string | boolean; highlighted?: boolean }) {
  return (
    <td className={`border-l border-[#E8E3DC]/60 px-5 py-3.5 align-middle ${highlighted ? "bg-[#F6EFE7]/25" : ""}`}>
      {typeof value === "string" ? (
        <span className="font-semibold text-[#18181B]">{value}</span>
      ) : value ? (
        <Check aria-label="Inclus" size={16} className="text-[#15803D]" />
      ) : (
        <Minus aria-label="Non inclus" size={16} className="text-[#A1A1AA]" />
      )}
    </td>
  );
}
