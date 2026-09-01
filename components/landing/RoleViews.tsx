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
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[380px]"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#9D6B3C]">Une même base, trois lectures</p>
            <h2 className="mt-4 text-[clamp(2.1rem,4.2vw,3.3rem)] font-extrabold leading-[1.02] tracking-[-0.05em] text-[#18181B]">
              Votre métier change.
              <span className="mt-1 block font-serif font-normal italic text-[#52525B]">Le contrôle reste.</span>
            </h2>
            <p className="mt-5 text-[15px] leading-[1.7] text-[#3F3F46]">
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
                <div className="grid grid-cols-3 rounded-lg border border-[#E8E3DC] bg-[#FAF9F6] p-1.5 shadow-2xs" aria-label="Choisir une vue métier">
                  {ROLE_PANELS.map((panel) => {
                    const Icon = roleIcons[panel.id];
                    return (
                      <Tabs.Trigger key={panel.id} value={panel.id} asChild>
                        <button
                          type="button"
                          className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-md px-3 text-[12px] font-bold text-[#71717A] transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-[#18181B] data-[state=active]:shadow-xs hover:text-[#18181B] cursor-pointer"
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
                  <div className="mt-4 rounded-lg border border-[#E8E3DC] bg-white shadow-xs overflow-hidden">
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
                          <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#9D6B3C]">{panel.eyebrow}</p>
                          <h3 className="mt-2 text-[23px] font-bold tracking-[-0.04em] text-[#18181B]">{panel.title}</h3>
                          <p className="mt-3 max-w-[48ch] text-[14px] leading-[1.7] text-[#3F3F46]">{panel.description}</p>
                          <div className="mt-8 grid border-y border-[#E8E3DC] sm:grid-cols-2">
                            {panel.metrics.map((metric) => (
                              <div key={metric.label} className="border-b border-[#E8E3DC] py-4 last:border-b-0 sm:border-b-0 sm:pr-6 sm:last:border-l sm:last:pl-6">
                                <p className="text-[11px] font-medium text-[#71717A]">{metric.label}</p>
                                <p className="tabular-nums mt-1 text-[20px] font-bold tracking-[-0.035em] text-[#18181B]">{metric.value}</p>
                              </div>
                            ))}
                          </div>
                          <button type="button" className="mt-7 inline-flex items-center gap-2 border-b-2 border-[#9D6B3C] pb-1 text-[12.5px] font-bold text-[#18181B] hover:text-[#9D6B3C] transition-colors cursor-pointer">
                            <span>{panel.action}</span>
                            <ArrowRight aria-hidden="true" size={14} />
                          </button>
                        </div>
                        <div className="border-t border-[#E8E3DC] bg-[#FAF9F6] p-6 lg:border-l lg:border-t-0 flex flex-col justify-between">
                          <div>
                            <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#71717A]">Dans le même espace</p>
                            <ul className="mt-4 divide-y divide-[#E8E3DC] text-[12px] text-[#3F3F46]">
                              {(panel.id === "agence" ? ["Mandats actifs", "Encaissements locataires", "Commissions de gestion", "Reversements propriétaires"] : panel.id === "diaspora" ? ["Activité en FCFA", "Contexte Euro / Dollar", "Archive certifiée", "Notifications MoMo directes"] : ["Biens & occupation", "Baux & locataires", "Loyers & quittances", "Vitrine & acquisition"]).map((item) => (
                                <li key={item} className="flex items-center justify-between py-2.5">
                                  <span className="font-medium">{item}</span>
                                  <Check aria-hidden="true" size={15} className="text-[#15803D] shrink-0" />
                                </li>
                              ))}
                            </ul>
                          </div>
                          {panel.id === "diaspora" ? (
                            <div className="mt-6 border-t border-[#E8E3DC] pt-4">
                              <CircleDollarSign aria-hidden="true" size={18} className="text-[#15803D]" />
                              <p className="mt-2 text-[11.5px] leading-relaxed text-[#52525B]">Suivez vos biens à Cotonou depuis Paris, avec les montants en FCFA et les quittances instantanées.</p>
                            </div>
                          ) : panel.id === "agence" ? (
                            <div className="mt-6 border-t border-[#E8E3DC] pt-4">
                              <FileText aria-hidden="true" size={18} className="text-[#9D6B3C]" />
                              <p className="mt-2 text-[11.5px] leading-relaxed text-[#52525B]">24 mandats actifs · Reversements en attente : 7 650 000 FCFA.</p>
                            </div>
                          ) : (
                            <div className="mt-6 border-t border-[#E8E3DC] pt-4">
                              <Home aria-hidden="true" size={18} className="text-[#15803D]" />
                              <p className="mt-2 text-[11.5px] leading-relaxed text-[#52525B]">Un locataire invité retrouve son bail et ses quittances officielles depuis son portail OTP sécurisé.</p>
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
