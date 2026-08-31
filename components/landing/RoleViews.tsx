"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, CircleDollarSign, FileText, Globe2, Home, UsersRound } from "lucide-react";
import { Tabs } from "radix-ui";
import { ROLE_PANELS } from "./landing-data";
import type { RoleView } from "./types";

const roleIcons: Record<RoleView, typeof Home> = {
  bailleur: Home,
  agence: UsersRound,
  diaspora: Globe2,
};

export default function RoleViews() {
  return (
    <section id="roles" className="landing-section bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <div data-landing-reveal className="max-w-[360px]">
            <p className="landing-label">Une même base, trois lectures</p>
            <h2 className="mt-4 text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1] tracking-[-0.06em] text-text-primary">Votre métier change.<span className="mt-1 block font-serif font-normal italic text-text-secondary">Le contrôle reste.</span></h2>
            <p className="mt-5 text-[14px] leading-relaxed text-text-secondary">Les mêmes données restent liées, que vous suiviez vos biens, des mandats ou un patrimoine depuis l&apos;étranger.</p>
          </div>

          <Tabs.Root defaultValue="bailleur" className="min-w-0" data-landing-reveal>
            <Tabs.List asChild>
              <div className="grid grid-cols-3 border border-border-default bg-bg-canvas p-1" aria-label="Choisir une vue métier">
                {ROLE_PANELS.map((panel) => {
                  const Icon = roleIcons[panel.id];
                  return <Tabs.Trigger key={panel.id} value={panel.id} asChild><button type="button" className="inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-[4px] px-2 text-[11px] font-semibold text-text-muted data-[state=active]:bg-brand-primary data-[state=active]:text-white hover:text-text-primary"><Icon aria-hidden="true" size={14} />{panel.label}</button></Tabs.Trigger>;
                })}
              </div>
            </Tabs.List>

            {ROLE_PANELS.map((panel) => (
              <Tabs.Content key={panel.id} value={panel.id} asChild>
                <div className="mt-3 border border-border-default bg-white">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div key={panel.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2, ease: "easeOut" }} className="grid min-h-[300px] lg:grid-cols-[minmax(0,1fr)_220px]">
                      <div className="p-5 sm:p-7">
                        <p className="landing-label">{panel.eyebrow}</p>
                        <h3 className="mt-3 text-[22px] font-semibold tracking-[-0.05em] text-text-primary">{panel.title}</h3>
                        <p className="mt-3 max-w-[48ch] text-[13px] leading-relaxed text-text-secondary">{panel.description}</p>
                        <div className="mt-8 grid border-y border-border-default sm:grid-cols-2">
                          {panel.metrics.map((metric) => <div key={metric.label} className="border-b border-border-default py-4 last:border-b-0 sm:border-b-0 sm:pr-5 sm:last:border-l sm:last:pl-5"><p className="text-[10px] text-text-muted">{metric.label}</p><p className="tabular-nums mt-1 text-[17px] font-semibold tracking-[-0.035em] text-text-primary">{metric.value}</p></div>)}
                        </div>
                        <button type="button" className="mt-7 inline-flex items-center gap-2 border-b border-brand-primary pb-1 text-[11px] font-semibold text-text-primary hover:text-success-strong">{panel.action}<ArrowRight aria-hidden="true" size={13} /></button>
                      </div>
                      <div className="border-t border-border-default bg-bg-subtle/60 p-5 lg:border-l lg:border-t-0">
                        <p className="landing-label">Dans le même espace</p>
                        <ul className="mt-5 divide-y divide-border-default text-[11px] text-text-secondary">
                          {(panel.id === "agence" ? ["Mandats actifs", "Encaissements des locataires", "Commission de gestion", "Reversements propriétaires"] : panel.id === "diaspora" ? ["Activité en FCFA", "Contexte Euro / Dollar", "Archive des documents", "Notifications MoMo"] : ["Biens & occupation", "Baux & locataires", "Loyers & quittances", "Vitrine & acquisition"]).map((item) => <li key={item} className="flex items-center justify-between py-3"><span>{item}</span><Check aria-hidden="true" size={14} className="text-success-strong" /></li>)}
                        </ul>
                        {panel.id === "diaspora" ? <div className="mt-7 border-t border-border-default pt-4"><CircleDollarSign aria-hidden="true" size={17} className="text-success-strong" /><p className="mt-2 text-[11px] leading-relaxed text-text-secondary">Suivez vos biens à Cotonou depuis Paris, avec les montants en FCFA et le contexte de conversion.</p></div> : panel.id === "agence" ? <div className="mt-7 border-t border-border-default pt-4"><FileText aria-hidden="true" size={17} className="text-text-secondary" /><p className="mt-2 text-[11px] leading-relaxed text-text-secondary">24 mandats actifs · Reversements en attente : 7 650 000 FCFA.</p></div> : <div className="mt-7 border-t border-border-default pt-4"><Home aria-hidden="true" size={17} className="text-success-strong" /><p className="mt-2 text-[11px] leading-relaxed text-text-secondary">Un locataire invité retrouve son bail et ses quittances depuis son portail OTP.</p></div>}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </Tabs.Content>
            ))}
          </Tabs.Root>
        </div>
      </div>
    </section>
  );
}
