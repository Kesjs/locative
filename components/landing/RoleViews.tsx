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
    <section id="roles" className="landing-section bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[380px]"
          >
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Une même base, trois lectures</p>
            <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
              Votre métier change.
              <span className="block font-serif font-normal italic text-slate-600 text-[0.95em] mt-1">Le contrôle reste.</span>
            </h2>
            <p className="mt-3 text-[14.5px] leading-relaxed text-slate-600">
              Les mêmes données restent interconnectées, que vous suiviez vos biens propres, des mandats d&apos;agence ou un patrimoine géré depuis la diaspora.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <Tabs.Root defaultValue="bailleur" className="min-w-0">
              <Tabs.List asChild>
                <div className="grid grid-cols-3 rounded-xl border border-slate-200 bg-slate-50 p-1.5 shadow-2xs" aria-label="Choisir une vue métier">
                  {ROLE_PANELS.map((panel) => {
                    const Icon = roleIcons[panel.id];
                    return (
                      <Tabs.Trigger key={panel.id} value={panel.id} asChild>
                        <button
                          type="button"
                          className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-lg px-3 text-[12.5px] font-semibold text-slate-600 transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-xs hover:text-slate-900 cursor-pointer"
                        >
                          <Icon aria-hidden="true" size={15} />
                          <span>{panel.label}</span>
                        </button>
                      </Tabs.Trigger>
                    );
                  })}
                </div>
              </Tabs.List>

              {ROLE_PANELS.map((panel) => (
                <Tabs.Content key={panel.id} value={panel.id} asChild>
                  <div className="mt-4 rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={panel.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="grid min-h-[300px] lg:grid-cols-[minmax(0,1fr)_240px]"
                      >
                        <div className="p-6 sm:p-8">
                          <p className="text-[10.5px] font-bold uppercase tracking-wider text-emerald-700">{panel.eyebrow}</p>
                          <h3 className="mt-1.5 text-[21px] font-bold tracking-tight text-slate-900">{panel.title}</h3>
                          <p className="mt-2.5 max-w-[48ch] text-[13.5px] leading-relaxed text-slate-600">{panel.description}</p>
                          <div className="mt-6 grid border-y border-slate-100 sm:grid-cols-2">
                            {panel.metrics.map((metric) => (
                              <div key={metric.label} className="border-b border-slate-100 py-3.5 last:border-b-0 sm:border-b-0 sm:pr-6 sm:last:border-l sm:last:pl-6">
                                <p className="text-[11px] font-medium text-slate-500">{metric.label}</p>
                                <p className="tabular-nums mt-0.5 text-[18px] font-bold tracking-tight text-slate-900">{metric.value}</p>
                              </div>
                            ))}
                          </div>
                          <button type="button" className="mt-6 inline-flex items-center gap-2 text-[12.5px] font-semibold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer">
                            <span>{panel.action}</span>
                            <ArrowRight aria-hidden="true" size={14} />
                          </button>
                        </div>
                        <div className="border-t border-slate-100 bg-slate-50/70 p-6 lg:border-l lg:border-t-0 flex flex-col justify-between">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Dans le même espace</p>
                            <ul className="mt-3.5 divide-y divide-slate-200/60 text-[12px] text-slate-700">
                              {(panel.id === "agence" ? ["Mandats actifs", "Encaissements locataires", "Commissions de gestion", "Reversements propriétaires"] : panel.id === "diaspora" ? ["Activité en FCFA", "Contexte Euro / Dollar", "Archive certifiée", "Notifications MoMo directes"] : ["Biens & occupation", "Baux & locataires", "Loyers & quittances", "Vitrine & acquisition"]).map((item) => (
                                <li key={item} className="flex items-center justify-between py-2">
                                  <span className="font-medium">{item}</span>
                                  <Check aria-hidden="true" size={14} className="text-emerald-600 shrink-0" />
                                </li>
                              ))}
                            </ul>
                          </div>
                          {panel.id === "diaspora" ? (
                            <div className="mt-5 border-t border-slate-200/60 pt-3.5">
                              <CircleDollarSign aria-hidden="true" size={17} className="text-emerald-600" />
                              <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">Suivez vos biens à Cotonou depuis Paris, avec les montants en FCFA et les quittances instantanées.</p>
                            </div>
                          ) : panel.id === "agence" ? (
                            <div className="mt-5 border-t border-slate-200/60 pt-3.5">
                              <FileText aria-hidden="true" size={17} className="text-emerald-600" />
                              <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">24 mandats actifs · Reversements en attente : 7 650 000 FCFA.</p>
                            </div>
                          ) : (
                            <div className="mt-5 border-t border-slate-200/60 pt-3.5">
                              <Home aria-hidden="true" size={17} className="text-emerald-600" />
                              <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">Un locataire invité retrouve son bail et ses quittances officielles depuis son portail OTP sécurisé.</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </Tabs.Content>
              ))}
            </Tabs.Root>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
