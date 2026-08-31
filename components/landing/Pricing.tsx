"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
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
  const [cycle, setCycle] = useState<BillingCycle>("annual");
  const rows = useMemo(() => buildComparisonRows(), []);
  const isAnnual = cycle === "annual";

  return (
    <section id="pricing" className="landing-section bg-bg-canvas py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div data-landing-reveal className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-[720px]">
            <p className="landing-label">Tarifs clairs &amp; adaptés</p>
            <h2 className="mt-4 text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1] tracking-[-0.06em] text-text-primary">
              Une tarification transparente
            </h2>
            <p className="mt-5 max-w-[620px] text-[14px] leading-relaxed text-text-secondary">
              Rentabilisé dès le premier mois grâce aux retards éliminés et à votre site vitrine clé en main.
            </p>
          </div>
          <div className="flex items-center gap-3 text-[12px] font-semibold text-text-secondary">
            <span className={!isAnnual ? "text-text-primary" : "text-text-muted"}>Mensuel</span>
            <Switch.Root 
              checked={isAnnual} 
              onCheckedChange={(checked) => setCycle(checked ? "annual" : "monthly")} 
              asChild
            >
              <button 
                type="button" 
                aria-label="Basculer entre facturation mensuelle et annuelle" 
                className="relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border border-border-strong bg-border-strong p-0.5 data-[state=checked]:bg-brand-primary transition-colors"
              >
                <Switch.Thumb className="block h-5 w-5 rounded-full bg-white shadow-xs transition-transform duration-200 data-[state=checked]:translate-x-5" />
              </button>
            </Switch.Root>
            <span className={isAnnual ? "text-text-primary" : "text-text-muted"}>Annuel</span>
            <span className="border-l border-border-default pl-3 text-[10px] font-bold text-success-strong">
              -20% de remise
            </span>
          </div>
        </div>

        {/* Mobile View: Stacked Cards (visible on screens smaller than lg) */}
        <div className="mt-10 grid gap-6 lg:hidden" data-landing-reveal>
          {PLANS.map((plan) => (
            <div 
              key={plan.name} 
              className={`relative flex flex-col rounded-[16px] border bg-white p-6 shadow-sm ${
                plan.popular ? "border-brand-primary ring-1 ring-brand-primary" : "border-border-default"
              }`}
            >
              {plan.badgeLabel && (
                <div className="absolute -top-3 right-6 rounded-full bg-success-strong px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase shadow-sm">
                  {plan.badgeLabel}
                </div>
              )}
              
              <div className="mb-4">
                <h3 className="text-[18px] font-semibold text-text-primary">{plan.name}</h3>
                <p className="mt-2 text-[13px] text-text-secondary">{plan.description}</p>
              </div>
              
              <div className="mb-6 border-b border-border-subtle pb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-[28px] font-bold tracking-tight text-text-primary">
                    {formatPlanPrice(plan, cycle)}
                  </span>
                  {plan.period && <span className="text-[12px] font-medium text-text-muted">{plan.period}</span>}
                </div>
                <p className="mt-1 text-[11px] font-medium text-text-muted">
                  {isAnnual ? plan.annualDetail : "Facturation mensuelle sans engagement"}
                </p>
              </div>
              
              <ul className="mb-8 flex-1 space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success-strong" />
                  <span className="text-[13px] font-semibold text-text-primary">
                    {plan.propertyLimit}
                  </span>
                </li>
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success-strong" />
                    <span className="text-[13px] text-text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link 
                href="/auth/register" 
                className={`flex w-full items-center justify-center rounded-[8px] py-2.5 text-[13px] font-semibold transition-colors ${
                  plan.popular 
                    ? "bg-brand-primary text-white hover:bg-brand-hover" 
                    : "bg-bg-subtle text-text-primary hover:bg-border-default"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
          
          <div className="rounded-[12px] border border-border-default bg-bg-subtle/60 p-4 text-[12px] text-text-secondary">
            <p className="mb-2">
              <span className="font-semibold text-text-primary">{ADDONS[0].split(" :")[0]} :</span>
              {ADDONS[0].substring(ADDONS[0].indexOf(" :") + 2)}
            </p>
            <p>
              <span className="font-semibold text-text-primary">{ADDONS[1].split(" :")[0]} :</span>
              {ADDONS[1].substring(ADDONS[1].indexOf(" :") + 2)}
            </p>
          </div>
        </div>

        {/* Desktop View: Detailed Comparison Table (hidden on screens smaller than lg) */}
        <div data-landing-reveal className="mt-10 hidden overflow-hidden border border-border-default bg-white lg:block">
          <div className="landing-table-scroll overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-left">
              <caption className="sr-only">
                Comparaison des plans Lokka en {isAnnual ? "facturation annuelle" : "facturation mensuelle"}
              </caption>
              <thead>
                <tr className="border-b border-border-default bg-bg-subtle/70">
                  <th scope="col" className="sticky left-0 z-20 min-w-[220px] bg-bg-subtle/95 px-4 py-5 text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted sm:px-6">
                    Opérations
                  </th>
                  {PLANS.map((plan) => (
                    <th 
                      key={plan.name} 
                      scope="col" 
                      className={`min-w-[195px] border-l border-border-default px-4 py-5 align-top sm:px-6 relative ${
                        plan.popular ? "border-t-2 border-t-brand-primary bg-white" : ""
                      }`}
                    >
                      {plan.badgeLabel && (
                        <div className="absolute -top-3 right-4 rounded-full bg-success-strong px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase shadow-sm">
                          {plan.badgeLabel}
                        </div>
                      )}
                      <div className="text-[14px] font-semibold text-text-primary">{plan.name}</div>
                      <div className="tabular-nums mt-4 text-[22px] font-semibold tracking-[-0.05em] text-text-primary">
                        {formatPlanPrice(plan, cycle)}
                        {plan.period ? <span className="ml-1 text-[10px] font-medium tracking-normal text-text-muted">{plan.period}</span> : null}
                      </div>
                      <div className="mt-1 text-[10px] font-medium leading-relaxed text-text-muted">
                        {isAnnual ? plan.annualDetail : "Facturation mensuelle sans engagement"}
                      </div>
                      <p className="mt-3 max-w-[22ch] text-[11px] font-medium leading-relaxed text-text-secondary">
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
                          <th scope="rowgroup" colSpan={4} className="border-y border-border-default bg-bg-canvas px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted sm:px-6">
                            {group}
                          </th>
                        </tr>
                      ) : null}
                      <tr className="group border-b border-border-subtle text-[12px] hover:bg-bg-canvas/70">
                        <th scope="row" className="sticky left-0 z-10 bg-white px-4 py-3.5 font-semibold text-text-primary group-hover:bg-bg-canvas sm:px-6">
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
          <div className="grid gap-2 border-t border-border-default bg-bg-subtle/60 px-4 py-4 text-[11px] text-text-secondary sm:grid-cols-2 sm:px-6">
            <p><span className="font-semibold text-text-primary">{ADDONS[0].split(" :")[0]} :</span>{ADDONS[0].substring(ADDONS[0].indexOf(" :") + 2)}</p>
            <p><span className="font-semibold text-text-primary">{ADDONS[1].split(" :")[0]} :</span>{ADDONS[1].substring(ADDONS[1].indexOf(" :") + 2)}</p>
          </div>
        </div>

        <div data-landing-reveal className="mt-5 flex flex-col justify-between gap-3 border-b border-border-default pb-5 text-[12px] text-text-secondary sm:flex-row sm:items-center">
          <p>Les montants et fonctionnalités reprennent la grille actuelle de Lokka.</p>
          <Link href="/auth/register" className="font-semibold text-text-primary underline underline-offset-4 hover:text-success-strong">
            Choisir mon forfait <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function ComparisonCell({ value, highlighted = false }: { value: string | boolean; highlighted?: boolean }) {
  return (
    <td className={`border-l border-border-subtle px-4 py-3.5 align-middle sm:px-6 ${highlighted ? "bg-success-soft/25" : ""}`}>
      {typeof value === "string" ? (
        <span className="font-semibold text-text-primary">{value}</span>
      ) : value ? (
        <Check aria-label="Inclus" size={15} className="text-success-strong" />
      ) : (
        <Minus aria-label="Non inclus" size={15} className="text-text-muted" />
      )}
    </td>
  );
}
