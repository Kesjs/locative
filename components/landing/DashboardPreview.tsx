"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

// Brand tokens from DESIGN.md
const BRAND = "#1C1C1C"; // Deep Black
const BRAND_SOFT = "#F5F5DC"; // Crisp Sand
const SUCCESS = "#087F5B"; // Action Green
const WARN = "#C92A2A"; // Alert Red
const BG_PAPER = "#FAF9F6";
const BORDER = "#E8E5E0";

export default function DashboardPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-80px" });

  const tabs = ["Aperçu", "Loyers en FCFA", "Biens", "Locataires"];

  const stats = [
    { label: "Revenus du mois", value: "4 850 000 F", change: "+12,4%", positive: true },
    { label: "Taux d'occupation", value: "96%", change: "+3,1%", positive: true },
    { label: "Loyers en attente", value: "150 000 F", change: "1 retard", positive: false },
    { label: "Biens gérés", value: "18", change: "+2 ce mois", positive: true },
  ];

  const transactions = [
    { name: "Aïchatou Kossou", property: "Apt 4B — Cadjehoun", amount: "+150 000 F", status: "MTN MoMo", ok: true },
    { name: "Koffi Mensah", property: "Villa 12 — Haie Vive", amount: "+350 000 F", status: "Moov Money", ok: true },
    { name: "Sessinou Martial", property: "Studio 2A — Akpakpa", amount: "85 000 F", status: "En attente", ok: false },
    { name: "Gérard Bio", property: "T3 — Ganhi", amount: "+220 000 F", status: "MTN MoMo", ok: true },
  ];

  return (
    <section
      ref={containerRef}
      className="py-24 sm:py-32 overflow-hidden relative"
      style={{ backgroundColor: BG_PAPER }}
    >
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#1C1C1C 1px, transparent 1px), linear-gradient(90deg, #1C1C1C 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="container relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 text-center"
        >
          <div className="section-label mb-4">Aperçu du produit</div>
          <h2 className="heading-2">
            Une interface pensée pour la clarté
          </h2>
        </motion.div>

        {/* Dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto w-full max-w-5xl rounded-[8px] bg-white p-6 sm:p-8 relative"
          style={{ 
            boxShadow: "0 24px 48px rgba(0,0,0,0.12)",
            border: `1px solid ${BORDER}`
          }}
        >
          {/* Top Bar Fake Window UI */}
          <div className="flex items-center gap-2 mb-6 border-b border-[#E8E5E0] pb-4">
            <div className="h-3 w-3 rounded-full bg-[#E8E5E0]"></div>
            <div className="h-3 w-3 rounded-full bg-[#E8E5E0]"></div>
            <div className="h-3 w-3 rounded-full bg-[#E8E5E0]"></div>
          </div>

          {/* Tabs */}
          <div className="mb-8 flex items-center justify-between border-b border-[#E8E5E0] pb-4">
            <div className="flex items-center gap-6 overflow-x-auto">
              {tabs.map((tab, i) => (
                <span
                  key={tab}
                  className="whitespace-nowrap pb-1 text-[14px] font-medium transition-colors"
                  style={
                    i === 0
                      ? { color: BRAND, borderBottom: `2px solid ${BRAND}` }
                      : { color: "#64635F" }
                  }
                >
                  {tab}
                </span>
              ))}
            </div>
            <div className="hidden items-center gap-4 sm:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold"
                style={{ backgroundColor: BRAND, color: "#FFF" }}>
                AK
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="rounded-[6px] border bg-white p-5 transition-all hover:shadow-sm"
                style={{ borderColor: BORDER }}
              >
                <p className="mb-2 text-[12px] font-medium text-[#64635F] uppercase tracking-wider">{stat.label}</p>
                <p className="text-[24px] font-semibold text-[#1C1C1C] mb-1">{stat.value}</p>
                <p
                  className="text-[12px] font-medium flex items-center gap-1"
                  style={{ color: stat.positive ? SUCCESS : WARN }}
                >
                  {stat.change}
                </p>
              </div>
            ))}
          </div>

          {/* Transactions */}
          <div className="overflow-hidden rounded-[8px] border" style={{ borderColor: BORDER }}>
            <div className="flex items-center justify-between border-b bg-[#FAF9F6] px-5 py-4" style={{ borderColor: BORDER }}>
              <span className="text-[14px] font-medium text-[#1C1C1C]">Paiements récents</span>
              <span className="cursor-pointer text-[13px] font-medium underline" style={{ color: BRAND }}>
                Voir tout
              </span>
            </div>
            {transactions.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-2 items-center gap-4 px-5 py-4 text-[14px] last:border-0 hover:bg-[#FAF9F6] sm:grid-cols-4 transition-colors"
                style={{ borderBottom: i === transactions.length - 1 ? 'none' : `1px solid ${BORDER}` }}
              >
                <div className="font-medium text-[#1C1C1C]">{row.name}</div>
                <div className="truncate text-[#64635F]">{row.property}</div>
                <div className="text-right font-semibold text-[#1C1C1C]">
                  {row.amount}
                </div>
                <div className="text-right">
                  <span
                    className="inline-block rounded-[4px] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide"
                    style={
                      row.ok
                        ? { backgroundColor: "rgba(8,127,91,0.1)", color: SUCCESS, border: `1px solid rgba(8,127,91,0.2)` }
                        : { backgroundColor: "rgba(201,42,42,0.1)", color: WARN, border: `1px solid rgba(201,42,42,0.2)` }
                    }
                  >
                    {row.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}