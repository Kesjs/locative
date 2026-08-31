"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Tabs } from "radix-ui";
import {
  ArrowRight,
  Banknote,
  Building2,
  Check,
  CircleAlert,
  Download,
  FileText,
  Globe2,
  House,
  LockKeyhole,
  MessageCircle,
  Plus,
  QrCode,
  ReceiptText,
  UsersRound,
} from "lucide-react";
import { DASHBOARD_KPIS, DASHBOARD_TRANSACTIONS, formatFcfa } from "./landing-data";
import type { DashboardView } from "./types";
import ReceiptSlip from "./ReceiptSlip";

const views: Array<{ value: DashboardView; label: string; icon: typeof Building2 }> = [
  { value: "dashboard", label: "Tableau de bord", icon: Building2 },
  { value: "vitrine", label: "Site vitrine", icon: Globe2 },
  { value: "locataire", label: "Portail locataire", icon: UsersRound },
];

const revenueBars = [62, 76, 68, 88, 84, 92];

export default function DashboardPreview() {
  const [activeView, setActiveView] = useState<DashboardView>("dashboard");
  const [receiptId, setReceiptId] = useState<string | null>(null);
  const isReceiptOpen = receiptId !== null;
  const selectedReceipt = DASHBOARD_TRANSACTIONS.find((transaction) => transaction.id === receiptId) ?? DASHBOARD_TRANSACTIONS[0];

  return (
    <div data-dashboard-stage className="landing-dashboard-stage mx-auto w-full max-w-[1080px]">
      <div className="landing-dashboard-depth" aria-hidden="true" />
      <div data-dashboard-scroll className="landing-dashboard-scroll">
        <div data-dashboard-hover className="landing-dashboard-hover">
          <div data-dashboard-3d className="landing-dashboard-surface">
            <span className="landing-dashboard-beam" aria-hidden="true" />

            <Tabs.Root
              value={activeView}
              onValueChange={(value) => setActiveView(value as DashboardView)}
            >
              <div className="relative z-10 grid min-h-[560px] lg:grid-cols-[174px_minmax(0,1fr)]">
                <aside className="hidden border-r border-border-default bg-bg-subtle/70 p-4 lg:block">
                  <div className="mb-8 flex items-center gap-2 px-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-brand-primary text-white">
                      <House aria-hidden="true" size={15} />
                    </span>
                    <span className="font-serif text-[19px] text-text-primary">Lokka.</span>
                  </div>
                  <p className="mb-2 px-2 text-[9px] font-bold uppercase tracking-[0.14em] text-text-muted">Gestion</p>
                  <nav aria-label="Navigation du tableau de bord" className="space-y-1 text-[11px]">
                    {[
                      ["Tableau de bord", true],
                      ["Patrimoine", false],
                      ["Baux & locataires", false],
                      ["Loyers & quittances", false],
                      ["Mandats & propriétaires", false],
                      ["Vitrine", false],
                    ].map(([label, active]) => (
                      <button
                        key={label as string}
                        type="button"
                        className={`flex w-full items-center gap-2 rounded-[5px] px-2 py-2 text-left ${active ? "bg-brand-primary font-semibold text-white" : "text-text-secondary hover:bg-white hover:text-text-primary"}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-white" : "bg-border-strong"}`} />
                        {label as string}
                      </button>
                    ))}
                  </nav>
                  <div className="mt-12 border-t border-border-default pt-4 text-[10px] leading-relaxed text-text-muted">
                    <p className="font-semibold text-text-secondary">Propriétaire Bailleur</p>
                    <p>Cotonou · Septembre 2026</p>
                  </div>
                </aside>

                <div className="min-w-0 bg-white">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-default px-5 py-4 sm:px-7">
                    <div>
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-success-strong">
                        <span className="h-1.5 w-1.5 rounded-full bg-success-strong" />
                        Tableau de bord
                      </div>
                      <p className="mt-1 text-[16px] font-semibold tracking-[-0.03em] text-text-primary sm:text-[18px]">
                        Patrimoine &amp; Encaissements
                        <span className="font-normal text-text-muted"> · Bailleur · Cotonou</span>
                      </p>
                    </div>
                    <div className="text-right text-[11px] text-text-muted">
                      <p className="font-semibold text-text-secondary">Septembre 2026</p>
                      <p>Mis à jour aujourd&apos;hui</p>
                    </div>
                  </div>

                  <Tabs.List asChild>
                    <div className="flex gap-1 overflow-x-auto border-b border-border-default bg-bg-subtle/65 px-4 py-2.5 sm:px-6" aria-label="Vues du produit">
                      {views.map(({ value, label, icon: Icon }) => (
                        <Tabs.Trigger key={value} value={value} asChild>
                          <button
                            type="button"
                            className="group inline-flex min-h-[34px] shrink-0 items-center gap-1.5 rounded-[5px] px-3 text-[11px] font-semibold text-text-muted data-[state=active]:bg-brand-primary data-[state=active]:text-white hover:bg-white hover:text-text-primary"
                          >
                            <Icon aria-hidden="true" size={14} />
                            {label}
                          </button>
                        </Tabs.Trigger>
                      ))}
                    </div>
                  </Tabs.List>

                  <Tabs.Content value="dashboard" asChild>
                    <div className="min-w-0">
                      <div className="grid grid-cols-2 border-b border-border-default sm:grid-cols-4">
                        {DASHBOARD_KPIS.map((kpi, index) => (
                          <motion.div 
                            key={kpi.label} 
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className={`group border-border-default px-4 py-4 hover:bg-bg-canvas sm:px-5 ${index < 3 ? "border-b sm:border-b-0 sm:border-r" : ""} ${index === 1 ? "sm:border-r" : ""}`}
                          >
                            <p className="text-[10px] font-medium text-text-muted">{kpi.label}</p>
                            <p className="tabular-nums mt-2 text-[17px] font-semibold tracking-[-0.04em] text-text-primary sm:text-[19px]">{kpi.value}</p>
                            <p className={`mt-1 text-[10px] font-semibold ${kpi.status === "danger" ? "text-danger" : "text-success-strong"}`}>{kpi.helper}</p>
                          </motion.div>
                        ))}
                      </div>

                      <div className="grid lg:grid-cols-[minmax(0,1fr)_220px]">
                        <div className="min-w-0 border-b border-border-default p-5 sm:p-7 lg:border-b-0 lg:border-r">
                          <div className="mb-4 flex items-center justify-between gap-3">
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-text-muted">Évolution des loyers</p>
                              <p className="mt-1 text-[13px] font-semibold text-text-primary">Revenus encaissés · Jan — Juin 2026</p>
                            </div>
                            <span className="text-[10px] text-text-muted">FCFA</span>
                          </div>
                          <div className="flex h-[150px] items-end gap-2 border-b border-border-default px-1 pt-4 sm:gap-4">
                            {revenueBars.map((height, index) => (
                              <div key={index} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                                <motion.div 
                                  initial={{ height: 0 }}
                                  whileInView={{ height: `${height}%` }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                                  data-dashboard-bar 
                                  className={`w-full max-w-[34px] origin-bottom rounded-t-[3px] ${index > 3 ? "bg-success-strong" : index === 3 ? "bg-brand-primary" : "bg-border-strong"}`} 
                                />
                                <span className="text-[9px] text-text-muted">{["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"][index]}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 flex items-center justify-between text-[10px] text-text-muted">
                            <span>1,2 M</span>
                            <span>1,45 M FCFA</span>
                          </div>
                        </div>

                        <div className="border-b border-border-default bg-bg-subtle/45 p-5 lg:border-b-0">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-text-muted">À traiter</p>
                              <p className="mt-1 text-[13px] font-semibold text-text-primary">1 action aujourd&apos;hui</p>
                            </div>
                            <CircleAlert aria-hidden="true" size={16} className="text-danger" />
                          </div>
                          <div className="mt-6 border-t border-border-default pt-4">
                            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-danger">Retard · J+6</p>
                            <p className="mt-2 text-[13px] font-semibold text-text-primary">Koudjo Dossou</p>
                            <p className="mt-1 text-[11px] text-text-secondary">150 000 FCFA à relancer</p>
                            <button type="button" className="mt-5 inline-flex items-center gap-2 text-[11px] font-semibold text-text-primary underline underline-offset-4 hover:text-danger">
                              Envoyer une relance
                              <ArrowRight aria-hidden="true" size={13} />
                            </button>
                          </div>
                          <div className="mt-8 border-t border-border-default pt-4 text-[10px] leading-relaxed text-text-secondary">
                            <p className="font-semibold text-text-primary">Règle appliquée</p>
                            <p className="mt-1">Caution limitée à 3 mois selon la Loi n° 2022-30.</p>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-border-default px-5 py-4 sm:px-7">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-text-muted">Derniers règlements</p>
                            <p className="mt-1 text-[13px] font-semibold text-text-primary">Mobile Money &amp; quittances PDF</p>
                          </div>
                          <button type="button" className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-text-secondary hover:text-text-primary">
                            <Plus aria-hidden="true" size={14} />
                            Enregistrer un loyer
                          </button>
                        </div>
                        <div className="divide-y divide-border-default border-y border-border-default">
                          {DASHBOARD_TRANSACTIONS.map((transaction) => (
                            <div key={transaction.id} className="group flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                              <div className="flex min-w-0 items-start gap-2.5">
                                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-success-strong" />
                                <div className="min-w-0">
                                  <p className="truncate text-[12px] font-semibold text-text-primary">{transaction.name} <span className="font-normal text-text-muted">· {transaction.property}</span></p>
                                  <p className="mt-0.5 flex items-center gap-1.5 text-[10px] text-text-muted"><Banknote aria-hidden="true" size={12} />{transaction.method} · {transaction.detail}</p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between gap-4 pl-4 sm:justify-end sm:pl-0">
                                <span className="tabular-nums text-[12px] font-semibold text-text-primary">{formatFcfa(transaction.amountFcfa)}</span>
                                <button type="button" onClick={() => setReceiptId((current) => current === transaction.id ? null : transaction.id)} className="inline-flex items-center gap-1 text-[10px] font-semibold text-success-strong underline underline-offset-4 hover:text-text-primary" aria-expanded={receiptId === transaction.id} aria-controls="dashboard-receipt-drawer">
                                  <ReceiptText aria-hidden="true" size={13} />
                                  {transaction.receipt}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <AnimatePresence initial={false}>
                          {isReceiptOpen ? (
                            <motion.div id="dashboard-receipt-drawer" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2, ease: "easeOut" }} className="overflow-hidden">
                              <div className="grid gap-5 border-b border-border-default bg-bg-canvas p-4 sm:grid-cols-[minmax(0,1fr)_minmax(250px,0.8fr)] sm:p-5">
                                <div>
                                  <p className="text-[11px] font-semibold text-text-primary">Le paiement devient un document.</p>
                                  <p className="mt-2 max-w-[42ch] text-[11px] leading-relaxed text-text-secondary">La quittance officielle reprend le montant, le locataire et sa référence de vérification. Elle est ensuite disponible dans le portail locataire.</p>
                                  <div className="mt-3 flex flex-wrap gap-3 text-[10px] font-semibold text-text-muted">
                                    <span className="inline-flex items-center gap-1"><QrCode aria-hidden="true" size={13} /> QR vérifiable</span>
                                    <span className="inline-flex items-center gap-1"><Download aria-hidden="true" size={13} /> PDF disponible</span>
                                  </div>
                                </div>
                                <ReceiptSlip
                                  compact
                                  showDownload
                                  tenant={selectedReceipt.name}
                                  property={selectedReceipt.property}
                                  amountFcfa={selectedReceipt.amountFcfa}
                                  method={selectedReceipt.method}
                                  reference={selectedReceipt.receipt}
                                  period="Septembre 2026"
                                />
                              </div>
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </div>
                    </div>
                  </Tabs.Content>

                  <Tabs.Content value="vitrine" asChild>
                    <div className="min-h-[430px] bg-bg-canvas p-5 sm:p-8">
                      <div className="mx-auto max-w-[700px] border border-border-default bg-white">
                        <div className="flex items-center justify-between border-b border-border-default px-4 py-3">
                          <div className="flex items-center gap-2 text-[11px] font-semibold text-text-primary"><Globe2 aria-hidden="true" size={15} /> Votre vitrine publique</div>
                          <span className="font-mono text-[10px] text-text-muted">agence-littoral.lokka.bj</span>
                        </div>
                        <div className="p-5 sm:p-7">
                          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-success-strong">Disponible immédiatement</p>
                          <h3 className="mt-2 text-[20px] font-semibold tracking-[-0.04em] text-text-primary">Appartement F3 Standing · Arconville, Calavi</h3>
                          <div className="mt-5 grid gap-4 border-y border-border-default py-4 text-[12px] sm:grid-cols-2">
                            <div><p className="text-text-muted">Loyer mensuel</p><p className="mt-1 text-[18px] font-semibold text-text-primary">180 000 FCFA</p></div>
                            <div><p className="text-text-muted">Caution légale</p><p className="mt-1 font-semibold text-text-primary">3 mois maximum</p></div>
                          </div>
                          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-text-secondary"><span>Compteur SBEE personnel</span><span>Forage avec surpresseur</span><span>Climatisation installée</span></div>
                          <div className="mt-6 flex flex-col gap-2 sm:flex-row"><button type="button" className="inline-flex flex-1 items-center justify-center gap-2 border border-brand-primary px-4 py-2.5 text-[11px] font-semibold text-text-primary hover:bg-bg-canvas"><FileText aria-hidden="true" size={14} /> Réserver une visite</button><button type="button" className="inline-flex flex-1 items-center justify-center gap-2 bg-brand-primary px-4 py-2.5 text-[11px] font-semibold text-white hover:bg-brand-hover"><MessageCircle aria-hidden="true" size={14} /> Discuter sur WhatsApp</button></div>
                        </div>
                      </div>
                    </div>
                  </Tabs.Content>

                  <Tabs.Content value="locataire" asChild>
                    <div className="min-h-[430px] bg-bg-canvas p-5 sm:p-8">
                      <div className="mx-auto max-w-[700px] border border-border-default bg-white p-5 sm:p-7">
                        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border-default pb-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">Portail locataire sécurisé</p><h3 className="mt-1 text-[18px] font-semibold text-text-primary">Bienvenue Koudjo Dossou</h3></div><span className="inline-flex items-center gap-1 text-[10px] font-semibold text-success-strong"><LockKeyhole aria-hidden="true" size={13} /> Accès OTP actif</span></div>
                        <div className="mt-5 grid gap-4 text-[12px] sm:grid-cols-2"><div><p className="text-text-muted">Logement occupé</p><p className="mt-1 font-semibold text-text-primary">Villa 4P · Fidjrossè Calvaire</p></div><div><p className="text-text-muted">Prochaine échéance</p><p className="mt-1 font-semibold text-text-primary">05 octobre 2026</p></div></div>
                        <div className="mt-6 border-y border-border-default py-4"><p className="text-[12px] font-semibold text-text-primary">Mes quittances PDF officielles</p><div className="mt-3 flex items-center justify-between gap-3 text-[11px]"><span><span className="font-semibold text-text-primary">Septembre 2026</span><span className="ml-2 text-text-muted">LOK-2026-0891</span></span><button type="button" className="inline-flex items-center gap-1 font-semibold text-text-primary underline underline-offset-4"><Download aria-hidden="true" size={13} /> PDF</button></div></div>
                      </div>
                    </div>
                  </Tabs.Content>
                </div>
              </div>
            </Tabs.Root>
          </div>
        </div>
      </div>
    </div>
  );
}
