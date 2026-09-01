"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Minus } from "lucide-react";
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
    <section id="pricing" className="landing-section bg-[#F8FAF9] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        
        {/* En-tête avec Bascule Mensuel / Annuel */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end"
        >
          <div className="max-w-[640px]">
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Tarifs clairs &amp; transparents</p>
            <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
              Une tarification simple et prévisible
            </h2>
            <p className="mt-3 text-[14.5px] sm:text-[15.5px] leading-relaxed text-slate-600">
              Rentabilisé dès le premier mois grâce aux retards éliminés et aux encaissements automatisés.
            </p>
          </div>

          {/* Toggle Switch Fiable & Accessible */}
          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white p-1.5 px-4 shadow-2xs text-[12.5px] font-semibold text-slate-600 shrink-0">
            <button
              type="button"
              onClick={() => setCycle("monthly")}
              className={`transition-colors cursor-pointer ${!isAnnual ? "text-slate-900 font-bold" : "text-slate-500 hover:text-slate-700"}`}
            >
              Mensuel
            </button>

            <button
              type="button"
              role="switch"
              aria-checked={isAnnual}
              aria-label="Basculer entre facturation mensuelle et annuelle"
              onClick={() => setCycle(isAnnual ? "monthly" : "annual")}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                isAnnual ? "bg-emerald-600" : "bg-slate-200"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 rounded-full bg-white shadow-xs transform transition-transform duration-200 ease-in-out ${
                  isAnnual ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>

            <button
              type="button"
              onClick={() => setCycle("annual")}
              className={`transition-colors cursor-pointer ${isAnnual ? "text-slate-900 font-bold" : "text-slate-500 hover:text-slate-700"}`}
            >
              Annuel
            </button>

            <span className="border-l border-slate-200 pl-3 text-[11px] font-bold text-emerald-700">
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
              className={`relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm ${
                plan.popular ? "border-2 border-emerald-600 ring-4 ring-emerald-500/10" : "border-slate-200"
              }`}
            >
              <div className="mb-4 flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-[19px] font-bold text-slate-900">{plan.name}</h3>
                  <p className="mt-1 text-[13px] text-slate-500">{plan.description}</p>
                </div>
                {plan.badgeLabel && (
                  <span className="shrink-0 rounded-full bg-emerald-600 px-3 py-1 text-[10.5px] font-bold tracking-wider text-white uppercase shadow-xs">
                    {plan.badgeLabel}
                  </span>
                )}
              </div>
              
              <div className="mb-6 border-b border-slate-100 pb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-[28px] font-bold tracking-tight text-slate-900">
                    {formatPlanPrice(plan, cycle)}
                  </span>
                  {plan.period && <span className="text-[12px] font-medium text-slate-500">{plan.period}</span>}
                </div>
                <p className="mt-1 text-[11.5px] font-medium text-slate-500">
                  {isAnnual ? plan.annualDetail : "Facturation mensuelle sans engagement"}
                </p>
              </div>
              
              <ul className="mb-8 flex-1 space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <span className="text-[13.5px] font-bold text-slate-900">
                    {plan.propertyLimit}
                  </span>
                </li>
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span className="text-[13px] text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link 
                href="/auth/register" 
                className={`flex w-full items-center justify-center rounded-xl py-2.5 text-[13px] font-semibold transition-colors shadow-xs ${
                  plan.popular 
                    ? "bg-emerald-600 text-white hover:bg-emerald-700" 
                    : "bg-slate-50 border border-slate-200 text-slate-900 hover:bg-slate-100"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
          
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-[12.5px] text-slate-600 shadow-2xs">
            <p className="mb-2">
              <span className="font-bold text-slate-900">{ADDONS[0].split(" :")[0]} :</span>
              {ADDONS[0].substring(ADDONS[0].indexOf(" :") + 2)}
            </p>
            <p>
              <span className="font-bold text-slate-900">{ADDONS[1].split(" :")[0]} :</span>
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
          className="mt-10 hidden rounded-2xl border border-slate-200 bg-white shadow-xs lg:block overflow-hidden"
        >
          <div className="landing-table-scroll overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-left">
              <caption className="sr-only">
                Comparaison des plans Lokka en {isAnnual ? "facturation annuelle" : "facturation mensuelle"}
              </caption>
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70">
                  <th scope="col" className="sticky left-0 z-20 min-w-[220px] bg-slate-50/70 px-5 py-5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Opérations
                  </th>
                  {PLANS.map((plan) => (
                    <th 
                      key={plan.name} 
                      scope="col" 
                      className={`min-w-[195px] border-l border-slate-200 px-5 py-5 align-top relative ${
                        plan.popular ? "border-t-2 border-t-emerald-600 bg-emerald-50/30" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="text-[15.5px] font-bold text-slate-900">{plan.name}</div>
                        {plan.badgeLabel && (
                          <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase shadow-xs">
                            {plan.badgeLabel}
                          </span>
                        )}
                      </div>
                      <div className="tabular-nums text-[23px] font-bold tracking-tight text-slate-900">
                        {formatPlanPrice(plan, cycle)}
                        {plan.period ? <span className="ml-1 text-[11.5px] font-medium tracking-normal text-slate-500">{plan.period}</span> : null}
                      </div>
                      <div className="mt-1 text-[11px] font-medium leading-relaxed text-slate-500">
                        {isAnnual ? plan.annualDetail : "Facturation mensuelle sans engagement"}
                      </div>
                      <p className="mt-2.5 max-w-[24ch] text-[12px] font-normal leading-relaxed text-slate-600">
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
                          <th scope="rowgroup" colSpan={4} className="border-y border-slate-200 bg-slate-50 px-5 py-2.5 text-[10.5px] font-bold uppercase tracking-wider text-emerald-800">
                            {group}
                          </th>
                        </tr>
                      ) : null}
                      <tr className="group border-b border-slate-100 text-[13px] hover:bg-slate-50/60">
                        <th scope="row" className="sticky left-0 z-10 bg-white px-5 py-3.5 font-medium text-slate-800 group-hover:bg-slate-50/60">
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
          <div className="grid gap-2 border-t border-slate-200 bg-slate-50/50 px-5 py-4 text-[12px] text-slate-600 sm:grid-cols-2">
            <p><span className="font-bold text-slate-900">{ADDONS[0].split(" :")[0]} :</span>{ADDONS[0].substring(ADDONS[0].indexOf(" :") + 2)}</p>
            <p><span className="font-bold text-slate-900">{ADDONS[1].split(" :")[0]} :</span>{ADDONS[1].substring(ADDONS[1].indexOf(" :") + 2)}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 flex flex-col justify-between gap-3 border-b border-slate-200 pb-6 text-[13px] text-slate-600 sm:flex-row sm:items-center"
        >
          <p>Toutes nos formules incluent un essai gratuit de 14 jours sans engagement.</p>
          <Link href="/auth/register" className="font-semibold text-emerald-700 underline underline-offset-4 hover:text-emerald-800 transition-colors">
            Choisir mon forfait <span aria-hidden="true">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function ComparisonCell({ value, highlighted = false }: { value: string | boolean; highlighted?: boolean }) {
  return (
    <td className={`border-l border-slate-100 px-5 py-3.5 align-middle ${highlighted ? "bg-emerald-50/20" : ""}`}>
      {typeof value === "string" ? (
        <span className="font-medium text-slate-900">{value}</span>
      ) : value ? (
        <Check aria-label="Inclus" size={16} className="text-emerald-600" />
      ) : (
        <Minus aria-label="Non inclus" size={16} className="text-slate-300" />
      )}
    </td>
  );
}
