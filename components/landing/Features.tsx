"use client";

import React, { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  CheckCircleIcon,
  BellAlertIcon,
  DocumentDuplicateIcon,
  GlobeAltIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  QrCodeIcon,
  HomeModernIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
  SparklesIcon,
  EyeIcon,
  BuildingOffice2Icon,
  WrenchScrewdriverIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

// Bento Card Component with Magic UI Radial Glow Effect on Hover
interface BentoCardProps {
  title: string;
  badge?: string;
  description: string;
  pills: string[];
  className?: string;
  delay: number;
  children?: React.ReactNode;
}

function BentoCard({
  title,
  badge,
  description,
  pills,
  className = "",
  delay,
  children,
}: BentoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
      onMouseMove={handleMouseMove}
      className={`group relative overflow-hidden rounded-[14px] bg-white border border-border-default transition-all duration-300 hover:border-[#D97706]/50 hover:shadow-[0_16px_40px_rgba(217,119,6,0.06)] flex flex-col justify-between p-6 sm:p-8 ${className}`}
    >
      {/* Magic UI Subtle Radial Glow Effect */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[14px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(500px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(217,119,6,0.04), transparent 45%)`,
        }}
      />

      <div className="z-10 mb-6">
        {badge && (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-success-strong bg-success-soft border border-[#D97706]/20 px-3 py-1 rounded-full mb-3.5">
            {badge}
          </span>
        )}
        <h3 className="text-[20px] sm:text-[23px] font-bold text-text-primary tracking-tight mb-2.5 leading-snug">
          {title}
        </h3>
        <p className="text-[13.5px] sm:text-[14px] text-text-secondary leading-relaxed mb-4">
          {description}
        </p>

        {/* Feature Tags / Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {pills.map((pill, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-text-primary bg-bg-canvas border border-border-default px-2.5 py-1 rounded-[6px] transition-colors group-hover:border-[#D97706]/30"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#D97706]" />
              {pill}
            </span>
          ))}
        </div>
      </div>

      <div className="relative w-full z-10">{children}</div>
    </motion.div>
  );
}

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // State for Card 1: Interactive Payment Filter
  const [paymentFilter, setPaymentFilter] = useState<"all" | "paid" | "late">("all");

  // State for Card 2: View Switcher (Owner vs Tenant Portal)
  const [managementTab, setManagementTab] = useState<"owner" | "tenant">("owner");

  // State for Card 4: Interactive Showcase Style Switcher
  const [showcaseTheme, setShowcaseTheme] = useState<"emerald" | "dark" | "luxury">("emerald");

  const transactions = [
    {
      name: "Koudjo Dossou",
      prop: "Villa 5P · Fidjrossè Plage",
      amount: "350 000 FCFA",
      method: "MTN MoMo",
      status: "paid",
      statusLabel: "Encaissé ✓",
      time: "À l'instant",
      receipt: "Quittance #LOK-2026-08 générée",
    },
    {
      name: "Bérénice Agossou",
      prop: "Studio Meublé · Haie Vive",
      amount: "120 000 FCFA",
      method: "Moov Money",
      status: "paid",
      statusLabel: "Encaissé ✓",
      time: "Il y a 14 min",
      receipt: "Quittance #LOK-2026-09 générée",
    },
    {
      name: "Gérard Bio",
      prop: "Appartement 3P · Ganhi",
      amount: "220 000 FCFA",
      method: "MTN MoMo",
      status: "late",
      statusLabel: "Retard J+4 ⚠️",
      time: "Échéance dépassée",
      receipt: "Rappel WhatsApp automatique envoyé",
    },
  ];

  const filteredTransactions = transactions.filter((t) => {
    if (paymentFilter === "all") return true;
    return t.status === paymentFilter;
  });

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative overflow-hidden py-24 sm:py-32 bg-bg-canvas border-t border-border-default"
    >
      {/* Background Architectural Grid (Subtle) */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#0F172A 1px, transparent 1px), linear-gradient(90deg, #0F172A 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container relative z-10 mx-auto max-w-[1240px] px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-16 max-w-3xl text-center sm:mb-20"
        >
          <div className="section-label mb-3 text-text-primary flex items-center justify-center gap-1.5">
            <SparklesIcon className="h-4 w-4 text-success-strong" />
            <span>Plateforme Complète Tout-en-un</span>
          </div>
          <h2 className="heading-2 mb-4 text-text-primary text-[clamp(2rem,4vw,3.2rem)] leading-tight">
            Tout votre écosystème locatif,{" "}
            <span className="font-serif italic font-normal text-success-strong">
              automatisé
            </span>
          </h2>
          <p className="body-text text-base sm:text-lg text-text-secondary max-w-2xl mx-auto">
            De la commercialisation à la quittance certifiée, pilotez l&apos;intégralité de votre portefeuille en toute conformité avec la Loi n° 2022-30.
          </p>
        </motion.div>

        {/* ========================================================================= */}
        {/* ASYMMETRIC BENTO GRID (TEMPLATE A1)                                       */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* ========================================================================= */}
          {/* CARTE 1 (Col 7) : FINANCES & ENCAISSEMENTS MOMO AUTOMATISÉS               */}
          {/* ========================================================================= */}
          <BentoCard
            badge="01 · Encaissements & Finances"
            title="Paiements Mobile Money & Quittances instantanées"
            description="Encaissez directement par MTN MoMo et Moov Money. Chaque règlement met à jour votre trésorerie et génère automatiquement une quittance PDF officielle avec QR Code."
            pills={[
              "Paiements MTN & Moov Money",
              "Suivi loyers (encaissés, retards, impayés)",
              "Quittances PDF avec QR Code",
              "Notifications & rappels WhatsApp",
            ]}
            className="lg:col-span-7"
            delay={0.1}
          >
            <div className="rounded-[10px] border border-border-default bg-white p-4 sm:p-5 shadow-xs">
              {/* Header with KPI and Filter Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-default pb-4 mb-4">
                <div>
                  <div className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                    Total Encaissé ce mois
                  </div>
                  <div className="text-[22px] font-extrabold text-text-primary flex items-center gap-2">
                    <span>4 850 000 FCFA</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-success-soft text-success-strong">
                      100% collecté
                    </span>
                  </div>
                </div>

                {/* Filter Switcher */}
                <div className="flex items-center gap-1 p-1 bg-bg-canvas border border-border-default rounded-lg self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setPaymentFilter("all")}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                      paymentFilter === "all"
                        ? "bg-white text-text-primary shadow-2xs"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    Tous
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentFilter("paid")}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                      paymentFilter === "paid"
                        ? "bg-success-soft text-success-strong shadow-2xs"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    Encaissés
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentFilter("late")}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                      paymentFilter === "late"
                        ? "bg-[#FEE2E2] text-[#B91C1C] shadow-2xs"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    Retards
                  </button>
                </div>
              </div>

              {/* Transactions List */}
              <div className="space-y-2.5">
                <AnimatePresence mode="popLayout">
                  {filteredTransactions.map((tx, idx) => (
                    <motion.div
                      key={tx.name + idx}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-[8px] border transition-colors ${
                        tx.status === "paid"
                          ? "bg-bg-canvas border-border-default hover:bg-white"
                          : "bg-[#FEF2F2]/60 border-[#FECACA]"
                      }`}
                    >
                      <div className="flex items-start sm:items-center gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                            tx.status === "paid"
                              ? "bg-success-soft text-success-strong"
                              : "bg-[#FEE2E2] text-[#DC2626]"
                          }`}
                        >
                          {tx.status === "paid" ? (
                            <CheckCircleIcon className="h-5 w-5" />
                          ) : (
                            <BellAlertIcon className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-bold text-text-primary">
                              {tx.name}
                            </span>
                            <span className="text-[10px] font-semibold text-text-secondary px-1.5 py-0.2 rounded bg-white border border-border-default">
                              {tx.method}
                            </span>
                          </div>
                          <div className="text-[11px] text-text-secondary">{tx.prop}</div>
                        </div>
                      </div>

                      <div className="text-left sm:text-right flex sm:flex-col justify-between items-center sm:items-end border-t sm:border-t-0 pt-2 sm:pt-0 border-border-default/60">
                        <div className="text-[13px] font-extrabold text-text-primary">
                          {tx.amount}
                        </div>
                        <div className="text-[10px] font-medium flex items-center gap-1 text-success-strong">
                          {tx.status === "paid" ? (
                            <>
                              <DocumentDuplicateIcon className="h-3 w-3" />
                              <span>{tx.receipt}</span>
                            </>
                          ) : (
                            <span className="text-[#DC2626] font-semibold">{tx.receipt}</span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </BentoCard>

          {/* ========================================================================= */}
          {/* CARTE 2 (Col 5) : GESTION LOCATIVE & PORTAIL LOCATAIRE                    */}
          {/* ========================================================================= */}
          <BentoCard
            badge="02 · Gestion Locative & Baux"
            title="Biens, baux légaux & portail locataire"
            description="Centralisez vos lots, fiches locataires et contrats conformes à la loi béninoise. Offrez à chaque locataire son espace sans mot de passe."
            pills={[
              "Gestion des biens & occupation",
              "Fiches locataires 360°",
              "Baux Loi n° 2022-30",
              "Portail locataire OTP & incidents",
            ]}
            className="lg:col-span-5"
            delay={0.2}
          >
            <div className="rounded-[10px] border border-border-default bg-white p-4 sm:p-5 shadow-xs flex flex-col justify-between">
              {/* Tab Selector */}
              <div className="flex border-b border-border-default mb-4 pb-2.5 gap-2">
                <button
                  type="button"
                  onClick={() => setManagementTab("owner")}
                  className={`flex items-center gap-1.5 pb-1 px-2 text-[12px] font-bold border-b-2 transition-all ${
                    managementTab === "owner"
                      ? "border-[#D97706] text-success-strong"
                      : "border-transparent text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <HomeModernIcon className="h-3.5 w-3.5" />
                  <span>Vue Bailleur (Contrats)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setManagementTab("tenant")}
                  className={`flex items-center gap-1.5 pb-1 px-2 text-[12px] font-bold border-b-2 transition-all ${
                    managementTab === "tenant"
                      ? "border-[#D97706] text-success-strong"
                      : "border-transparent text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <UserGroupIcon className="h-3.5 w-3.5" />
                  <span>Espace Locataire (OTP)</span>
                </button>
              </div>

              {/* Dynamic Content based on Tab */}
              {managementTab === "owner" ? (
                <motion.div
                  key="owner-view"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="p-3.5 rounded-[8px] bg-bg-canvas border border-border-default">
                    <div className="flex items-center justify-between text-[11px] font-bold text-text-secondary mb-1.5">
                      <span>Bail Numérique #B-2026-44</span>
                      <span className="text-success-strong bg-success-soft px-2 py-0.5 rounded-full font-bold">
                        Loi 2022-30 ✓
                      </span>
                    </div>
                    <div className="text-[14px] font-extrabold text-text-primary">
                      Amina Touré · Apt 4B (Cotonou)
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-text-secondary mt-2 pt-2 border-t border-border-default">
                      <span>Loyer : <strong>180 000 F/mois</strong></span>
                      <span>Caution : <strong>3 mois max</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-[6px] bg-bg-canvas border border-border-default text-[11px] text-text-primary font-semibold">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheckIcon className="h-4 w-4 text-success-strong" />
                      Clause résolutoire &amp; État des lieux
                    </span>
                    <span className="text-success-strong">Verrouillé 🔒</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="tenant-view"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2.5"
                >
                  <div className="p-3 rounded-[8px] bg-bg-canvas border border-border-default text-center">
                    <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-success-strong bg-success-soft px-2 py-0.5 rounded mb-1.5">
                      <LockClosedIcon className="h-3 w-3" />
                      Connexion Sécurisée sans mot de passe
                    </div>
                    <div className="text-[12px] font-bold text-text-primary">
                      Espace Locataire · Code OTP WhatsApp/SMS
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-[6px] border border-border-default bg-white text-center">
                      <DocumentDuplicateIcon className="h-4 w-4 mx-auto text-success-strong mb-1" />
                      <span className="text-[11px] font-bold text-text-primary block">
                        Mes Quittances
                      </span>
                      <span className="text-[9px] text-text-secondary">Téléchargement PDF</span>
                    </div>
                    <div className="p-2.5 rounded-[6px] border border-border-default bg-white text-center">
                      <WrenchScrewdriverIcon className="h-4 w-4 mx-auto text-text-primary mb-1" />
                      <span className="text-[11px] font-bold text-text-primary block">
                        Signaler Incident
                      </span>
                      <span className="text-[9px] text-text-secondary">Suivi des travaux</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </BentoCard>

          {/* ========================================================================= */}
          {/* CARTE 3 (Col 5) : PILOTAGE, KPIS & ANALYSE FINANCIÈRE                     */}
          {/* ========================================================================= */}
          <BentoCard
            badge="03 · Pilotage & Rentabilité"
            title="Indicateurs de performance & Bilan fiscal"
            description="Suivez vos revenus, taux de recouvrement et d'occupation en temps réel. Préparez votre déclaration fiscale TFU sans calculs fastidieux."
            pills={[
              "Revenus réels & loyers attendus",
              "Taux de recouvrement & occupation",
              "Statistiques vues vitrine",
              "Calculateur fiscal TFU (DGI)",
            ]}
            className="lg:col-span-5"
            delay={0.3}
          >
            <div className="rounded-[10px] border border-border-default bg-bg-canvas p-4 sm:p-5">
              {/* 3 Mini KPI Counters */}
              <div className="grid grid-cols-3 gap-2 mb-4 pb-3 border-b border-border-default text-center">
                <div className="bg-white p-2 rounded-[6px] border border-border-default">
                  <div className="text-[16px] font-extrabold text-success-strong">98.5%</div>
                  <div className="text-[9px] font-bold text-text-secondary uppercase">Recouvrement</div>
                </div>
                <div className="bg-white p-2 rounded-[6px] border border-border-default">
                  <div className="text-[16px] font-extrabold text-text-primary">100%</div>
                  <div className="text-[9px] font-bold text-text-secondary uppercase">Occupation</div>
                </div>
                <div className="bg-white p-2 rounded-[6px] border border-border-default">
                  <div className="text-[16px] font-extrabold text-text-primary">1.4k</div>
                  <div className="text-[9px] font-bold text-text-secondary uppercase">Vues Annonces</div>
                </div>
              </div>

              {/* Animated Mini Bar Chart */}
              <div className="flex h-24 items-end gap-2 px-1">
                {[
                  { h: 45, label: "M1", color: "bg-[#9C9A95]" },
                  { h: 65, label: "M2", color: "bg-[#D97706]" },
                  { h: 55, label: "M3", color: "bg-[#9C9A95]" },
                  { h: 85, label: "M4", color: "bg-[#D97706]" },
                  { h: 70, label: "M5", color: "bg-[#9C9A95]" },
                  { h: 100, label: "M6", color: "bg-[#0F172A]" },
                ].map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <motion.div
                      initial={{ height: 0 }}
                      whileInView={{ height: `${bar.h}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.2 + i * 0.08, ease: "easeOut" }}
                      className={`w-full rounded-t-[3px] shadow-2xs ${bar.color}`}
                    />
                    <span className="text-[9px] font-mono text-text-muted">{bar.label}</span>
                  </div>
                ))}
              </div>

              {/* Chart Legend */}
              <div className="flex items-center justify-between gap-1 pt-2.5 mt-2 border-t border-border-default text-[10px] text-text-secondary">
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[#0F172A]" />
                  <span>Pic Maximal</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[#D97706]" />
                  <span>Objectif Atteint</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[#9C9A95]" />
                  <span>Moyenne</span>
                </div>
              </div>
            </div>
          </BentoCard>

          {/* ========================================================================= */}
          {/* CARTE 4 (Col 7) : ACQUISITION, MARKETPLACE & VITRINE CLÉ EN MAIN          */}
          {/* ========================================================================= */}
          <BentoCard
            badge="04 · Acquisition & Visibilité"
            title="Vitrine personnalisée, Marketplace & Demandes de visite"
            description="Publiez vos logements vacants sur votre propre mini-site ou sur la marketplace globale Lokka. Recevez des demandes de visite directement par WhatsApp et optimisez votre SEO Google."
            pills={[
              "Vitrine personnalisée multi-styles",
              "Marketplace & diffusion d'annonces",
              "Module de demande de visite en ligne",
              "Nom de domaine propre & SEO Google",
            ]}
            className="lg:col-span-7"
            delay={0.4}
          >
            <div className="rounded-[10px] border border-border-default bg-white p-4 sm:p-5 shadow-xs">
              {/* Browser Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-border-default">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#E8E5E0]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#E8E5E0]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#E8E5E0]" />
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-bg-canvas border border-border-default text-[11px] font-mono text-text-secondary">
                    <GlobeAltIcon className="h-3 w-3 text-success-strong" />
                    <span>agence-prestige.lokka.bj</span>
                  </div>
                </div>

                {/* Style Switcher */}
                <div className="flex items-center gap-1 self-start sm:self-auto">
                  <span className="text-[10px] text-text-muted font-semibold mr-1">Thème :</span>
                  <button
                    type="button"
                    onClick={() => setShowcaseTheme("emerald")}
                    className={`h-5 px-2 rounded text-[10px] font-bold transition-all ${
                      showcaseTheme === "emerald"
                        ? "bg-[#D97706] text-white"
                        : "bg-bg-canvas text-text-secondary hover:bg-[#E8E5E0]"
                    }`}
                  >
                    Émeraude
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowcaseTheme("dark")}
                    className={`h-5 px-2 rounded text-[10px] font-bold transition-all ${
                      showcaseTheme === "dark"
                        ? "bg-[#0F172A] text-white"
                        : "bg-bg-canvas text-text-secondary hover:bg-[#E8E5E0]"
                    }`}
                  >
                    Sombre
                  </button>
                </div>
              </div>

              {/* Mock Property Card */}
              <div className="p-3.5 rounded-[8px] bg-bg-canvas border border-border-default flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-success-soft text-success-strong px-2 py-0.5 rounded">
                      Disponible
                    </span>
                    <span className="text-[10px] text-text-secondary flex items-center gap-0.5">
                      <EyeIcon className="h-3 w-3" /> 384 visites
                    </span>
                  </div>
                  <div className="text-[13.5px] font-extrabold text-text-primary">
                    Villa Moderne 4 Pièces avec Jardin
                  </div>
                  <div className="text-[11px] text-text-secondary">
                    Cotonou · Haie Vive · <strong>450 000 FCFA/mois</strong>
                  </div>
                </div>

                {/* Direct Actions (WhatsApp & Booking) */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    className="flex-1 sm:flex-initial py-2 px-3 bg-white border border-border-default text-text-primary hover:border-[#0F172A] text-[11px] font-bold rounded-[6px] flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                  >
                    <CalendarDaysIcon className="h-3.5 w-3.5 text-text-secondary" />
                    <span>Visite</span>
                  </button>
                  <button
                    type="button"
                    className={`flex-1 sm:flex-initial py-2 px-3 text-white text-[11px] font-bold rounded-[6px] flex items-center justify-center gap-1.5 shadow-2xs transition-colors ${
                      showcaseTheme === "emerald"
                        ? "bg-[#D97706] hover:bg-[#066347]"
                        : "bg-[#0F172A] hover:bg-[#333333]"
                    }`}
                  >
                    <ChatBubbleLeftRightIcon className="h-3.5 w-3.5" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          </BentoCard>
        </div>
      </div>
    </section>
  );
}