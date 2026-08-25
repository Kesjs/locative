"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  BuildingOffice2Icon,
  GlobeAltIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon,
  CalendarDaysIcon,
  ArrowDownTrayIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  PlusIcon,
  SparklesIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";

export default function DashboardPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-80px" });

  const [activeTab, setActiveTab] = useState<"dashboard" | "vitrine" | "locataire">("dashboard");

  return (
    <section
      ref={containerRef}
      className="py-24 sm:py-32 overflow-hidden relative bg-[#FAF9F6] border-t border-[#E8E5E0]"
    >
      {/* Architectural Background Grid */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#1C1C1C 1px, transparent 1px), linear-gradient(90deg, #1C1C1C 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 text-center max-w-2xl mx-auto"
        >
          <div className="section-label mb-3 text-[#1C1C1C]">Démonstration Produit</div>
          <h2 className="heading-2 mb-4 text-[#1C1C1C]">
            Une plateforme. Trois univers connectés.
          </h2>
          <p className="body-text text-base sm:text-lg text-[#64635F]">
            Basculez entre le tableau de bord de gestion, votre site vitrine public et le portail locataire autonome.
          </p>
        </motion.div>

        {/* View Switcher Pills */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white p-1.5 rounded-full border border-[#E8E5E0] shadow-xs gap-1">
            {[
              { id: "dashboard", label: "Tableau de Bord ERP", icon: BuildingOffice2Icon },
              { id: "vitrine", label: "Site Vitrine Public", icon: GlobeAltIcon },
              { id: "locataire", label: "Portail Locataire", icon: UserGroupIcon },
            ].map((tab) => {
              const isCurrent = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-full text-[13px] font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                    isCurrent
                      ? "bg-[#1C1C1C] text-white shadow-xs"
                      : "text-[#64635F] hover:text-[#1C1C1C] hover:bg-[#F5F5DC]"
                  }`}
                >
                  <tab.icon className={`h-4 w-4 ${isCurrent ? "text-white" : "text-[#9C9A95]"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mockup Container Window */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto w-full max-w-5xl rounded-[12px] bg-white border border-[#E8E5E0] shadow-[0_24px_48px_rgba(0,0,0,0.08)] overflow-hidden"
        >
          {/* Top Browser Bar */}
          <div className="flex items-center justify-between px-5 py-3 bg-[#FAF9F6] border-b border-[#E8E5E0]">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#E8E5E0]" />
              <div className="h-3 w-3 rounded-full bg-[#E8E5E0]" />
              <div className="h-3 w-3 rounded-full bg-[#E8E5E0]" />
            </div>

            <div className="bg-white border border-[#E8E5E0] px-4 py-1 rounded-full text-[11px] font-mono text-[#64635F] flex items-center gap-1.5 shadow-2xs">
              <span className="text-[#1C1C1C]">●</span>
              <span>
                {activeTab === "dashboard"
                  ? "app.lokka.bj/dashboard"
                  : activeTab === "vitrine"
                  ? "agence-littoral.lokka.bj"
                  : "app.lokka.bj/locataire"}
              </span>
            </div>

            <div className="text-[11px] font-bold text-[#1C1C1C] flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#1C1C1C] animate-pulse" />
              <span>En direct</span>
            </div>
          </div>

          {/* Dynamic Content View */}
          <div className="p-6 sm:p-8 min-h-[460px]">
            <AnimatePresence mode="wait">
              {/* ================================================================= */}
              {/* VUE 1 : DASHBOARD ERP                                             */}
              {/* ================================================================= */}
              {activeTab === "dashboard" && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Top Welcome Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8E5E0]">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#1C1C1C] bg-[#F3F2EE] border border-[#E8E5E0] px-2.5 py-0.5 rounded-full">
                          Propriétaire Bailleur · Cotonou
                        </span>
                      </div>
                      <h3 className="text-[20px] font-bold text-[#1C1C1C]">Patrimoine &amp; Encaissements</h3>
                    </div>
                    <button
                      type="button"
                      className="btn-primary py-2 px-4 text-[13px] inline-flex items-center gap-2 self-start sm:self-auto cursor-pointer hover:bg-[#F5F5DC] hover:text-[#1C1C1C] hover:border-[#E8E5E0]"
                    >
                      <PlusIcon className="h-4 w-4" />
                      <span>Enregistrer un loyer</span>
                    </button>
                  </div>

                  {/* 4 KPI Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    {[
                      { label: "Loyers du mois", val: "4 850 000 F", sub: "96.5% collecté", ok: true },
                      { label: "Taux d'occupation", val: "12 / 12 Lots", sub: "Zéro vacance", ok: true },
                      { label: "Retards de loyer", val: "180 000 F", sub: "Relance J+5 programmée", ok: false },
                      { label: "Conformité Loi 2022", val: "100% Conforme", sub: "Caution 3 mois max", ok: true },
                    ].map((kpi, idx) => (
                      <div key={idx} className="bg-[#FAF9F6] border border-[#E8E5E0] rounded-[8px] p-3.5">
                        <div className="text-[11px] text-[#64635F] uppercase font-semibold mb-1">{kpi.label}</div>
                        <div className="text-[18px] sm:text-[20px] font-extrabold text-[#1C1C1C]">{kpi.val}</div>
                        <div className={`text-[11px] font-medium mt-1 ${kpi.ok ? "text-[#1C1C1C]" : "text-[#C92A2A]"}`}>
                          {kpi.sub}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Stream of transactions */}
                  <div className="border border-[#E8E5E0] rounded-[8px] overflow-hidden">
                    <div className="bg-[#FAF9F6] px-4 py-2.5 border-b border-[#E8E5E0] text-[12px] font-bold text-[#1C1C1C]">
                      Derniers Règlements Mobile Money &amp; Quittances PDF
                    </div>
                    <div className="divide-y divide-[#E8E5E0]">
                      {[
                        { name: "Koudjo Dossou", prop: "Villa Fidjrossè Plage", amount: "350 000 FCFA", chan: "MTN MoMo", receipt: "LOK-2026-0891" },
                        { name: "Bérénice Agossou", prop: "Studio Meublé Haie Vive", amount: "120 000 FCFA", chan: "Moov Money", receipt: "LOK-2026-0890" },
                        { name: "Estelle Houndété", prop: "Duplex Cadjehoun", amount: "450 000 FCFA", chan: "Virement BOA", receipt: "LOK-2026-0865" },
                      ].map((tx, i) => (
                        <div key={i} className="p-3 flex items-center justify-between text-[13px] hover:bg-[#FAF9F6] transition">
                          <div>
                            <span className="font-bold text-[#1C1C1C] block">{tx.name}</span>
                            <span className="text-[11px] text-[#64635F]">{tx.prop} · {tx.chan}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-[#1C1C1C] block">{tx.amount}</span>
                            <span className="text-[10px] text-[#1C1C1C] font-semibold underline cursor-pointer hover:text-[#C5A880]">
                              Quittance PDF ({tx.receipt})
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ================================================================= */}
              {/* VUE 2 : SITE VITRINE PUBLIC                                       */}
              {/* ================================================================= */}
              {activeTab === "vitrine" && (
                <motion.div
                  key="vitrine"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="p-4 bg-[#FAF9F6] border border-[#E8E5E0] rounded-[8px] flex items-center justify-between text-[12px]">
                    <div className="flex items-center gap-2 text-[#1C1C1C] font-bold">
                      <GlobeAltIcon className="h-4 w-4 text-[#1C1C1C]" />
                      <span>Votre Mini-Site Public est prêt et accessible à vos futurs locataires.</span>
                    </div>
                    <span className="font-mono text-[#1C1C1C] font-semibold hidden sm:block">agence-littoral.lokka.bj</span>
                  </div>

                  {/* Public Property Card on Showcase */}
                  <div className="border border-[#E8E5E0] rounded-[10px] bg-white overflow-hidden shadow-xs max-w-xl mx-auto">
                    <div className="h-44 bg-[#1C1C1C] relative flex items-end p-4 text-white">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      <div className="relative z-10">
                        <span className="bg-white text-[#1C1C1C] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-1 inline-block">
                          Disponible immédiatement
                        </span>
                        <h4 className="text-[18px] font-bold">Appartement F3 Standing · Arconville, Calavi</h4>
                      </div>
                    </div>

                    <div className="p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-[11px] text-[#64635F]">Loyer Mensuel</div>
                          <div className="text-[20px] font-extrabold text-[#1C1C1C]">180 000 FCFA</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[11px] text-[#64635F]">Caution Légale (Loi 2022-30)</div>
                          <div className="text-[13px] font-bold text-[#1C1C1C]">3 mois max (540 000 F)</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 text-[11px] font-medium text-[#64635F]">
                        <span className="bg-[#FAF9F6] border border-[#E8E5E0] px-2.5 py-1 rounded">Compteur SBEE personnel</span>
                        <span className="bg-[#FAF9F6] border border-[#E8E5E0] px-2.5 py-1 rounded">Forage avec surpresseur</span>
                        <span className="bg-[#FAF9F6] border border-[#E8E5E0] px-2.5 py-1 rounded">Climatisation installée</span>
                      </div>

                      <div className="pt-3 border-t border-[#E8E5E0] flex items-center justify-between gap-3">
                        <button
                          type="button"
                          className="flex-1 py-2.5 px-3 rounded-[6px] border border-[#1C1C1C] text-[#1C1C1C] text-[13px] font-bold flex items-center justify-center gap-1.5 hover:bg-[#F5F5DC] transition-colors cursor-pointer"
                        >
                          <CalendarDaysIcon className="h-4 w-4" />
                          <span>Réserver une visite</span>
                        </button>
                        <button
                          type="button"
                          className="flex-1 py-2.5 px-3 rounded-[6px] bg-[#1C1C1C] hover:bg-[#F5F5DC] hover:text-[#1C1C1C] hover:border-[#E8E5E0] border border-transparent text-white text-[13px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <ChatBubbleLeftRightIcon className="h-4 w-4" />
                          <span>Discuter sur WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ================================================================= */}
              {/* VUE 3 : PORTAIL ESPACE LOCATAIRE                                  */}
              {/* ================================================================= */}
              {activeTab === "locataire" && (
                <motion.div
                  key="locataire"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 max-w-2xl mx-auto"
                >
                  <div className="bg-[#FAF9F6] border border-[#E8E5E0] rounded-[8px] p-5">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E8E5E0]">
                      <div>
                        <span className="text-[11px] font-bold text-[#1C1C1C] uppercase tracking-wider block">Portail Locataire Sécurisé</span>
                        <h4 className="text-[18px] font-bold text-[#1C1C1C]">Bienvenue Koudjo Dossou</h4>
                      </div>
                      <span className="text-[11px] font-bold bg-[#F3F2EE] border border-[#E8E5E0] text-[#1C1C1C] px-3 py-1 rounded-full">
                        Bail Actif ✓
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-[13px]">
                      <div>
                        <span className="text-[#64635F] text-[11px] block">Logement occupé :</span>
                        <span className="font-semibold text-[#1C1C1C]">Villa 4P — Fidjrossè Calvaire</span>
                      </div>
                      <div>
                        <span className="text-[#64635F] text-[11px] block">Loyer mensuel :</span>
                        <span className="font-bold text-[#1C1C1C]">250 000 FCFA</span>
                      </div>
                    </div>

                    <div className="p-3 bg-white border border-[#E8E5E0] rounded-[6px] flex items-center justify-between mb-4">
                      <div>
                        <div className="text-[12px] font-bold text-[#1C1C1C]">Prochaine échéance : 05 Octobre 2026</div>
                        <div className="text-[11px] text-[#64635F]">Paiement automatique via MTN MoMo / Moov</div>
                      </div>
                      <button
                        type="button"
                        className="py-1.5 px-3 bg-[#1C1C1C] hover:bg-[#F5F5DC] hover:text-[#1C1C1C] border border-transparent hover:border-[#E8E5E0] text-white text-[12px] font-bold rounded-[4px] transition-colors cursor-pointer"
                      >
                        Payer 250 000 F
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div className="text-[12px] font-bold text-[#1C1C1C]">Mes Quittances PDF Officielles :</div>
                      {[
                        { month: "Septembre 2026", num: "LOK-2026-0891", date: "Payé le 02/09/2026" },
                        { month: "Août 2026", num: "LOK-2026-0740", date: "Payé le 03/08/2026" },
                      ].map((q, i) => (
                        <div key={i} className="flex items-center justify-between p-2.5 bg-white border border-[#E8E5E0] rounded text-[12px]">
                          <div>
                            <span className="font-semibold text-[#1C1C1C]">{q.month}</span>
                            <span className="text-[#64635F] text-[11px] ml-2">({q.num} · {q.date})</span>
                          </div>
                          <button
                            type="button"
                            className="text-[#1C1C1C] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                          >
                            <ArrowDownTrayIcon className="h-3.5 w-3.5" />
                            <span>Télécharger PDF</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}