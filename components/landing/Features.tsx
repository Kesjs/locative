"use client";

import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  CheckCircleIcon,
  BellAlertIcon,
  DocumentDuplicateIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  ArrowDownTrayIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";

// Bento Card Component with Magic UI Glow Effect on Hover
interface BentoCardProps {
  title: string;
  badge?: string;
  description: string;
  className?: string;
  delay: number;
  children?: React.ReactNode;
}

function BentoCard({ title, badge, description, className = "", delay, children }: BentoCardProps) {
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
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
      onMouseMove={handleMouseMove}
      className={`group relative overflow-hidden rounded-[10px] bg-white border border-[#E8E5E0] transition-all duration-300 hover:border-[#1C1C1C] hover:shadow-[0_12px_36px_rgba(0,0,0,0.06)] hover:-translate-y-1 flex flex-col justify-between p-7 sm:p-8 ${className}`}
    >
      {/* Magic UI Subtle Radial Glow Effect */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[10px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(28,28,28,0.03), transparent 40%)`,
        }}
      />

      <div className="z-10 mb-6">
        {badge && (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#1C1C1C] bg-[#F3F2EE] border border-[#E8E5E0] px-2.5 py-0.5 rounded-full mb-3">
            {badge}
          </span>
        )}
        <h3 className="text-[20px] sm:text-[22px] font-bold text-[#1C1C1C] tracking-tight mb-2">
          {title}
        </h3>
        <p className="text-[14px] text-[#64635F] leading-relaxed">
          {description}
        </p>
      </div>

      <div className="relative w-full z-10">{children}</div>
    </motion.div>
  );
}

// Simulated Live Notification Feed with Continuous Motion
function NotificationFeed() {
  const notifications = [
    { name: "Koudjo Dossou", amount: "350 000 FCFA", time: "À l'instant", type: "MTN MoMo", prop: "Villa Fidjrossè" },
    { name: "Bérénice Agossou", amount: "120 000 FCFA", time: "Il y a 4 min", type: "Moov Money", prop: "Studio Haie Vive" },
    { name: "Estelle Houndété", amount: "450 000 FCFA", time: "Il y a 22 min", type: "Virement BOA", prop: "Cadjehoun" },
    { name: "Gérard Bio", amount: "220 000 FCFA", time: "Il y a 1h", type: "MTN MoMo", prop: "Ganhi" },
  ];

  return (
    <div className="relative h-60 w-full overflow-hidden mask-image-bottom">
      <motion.div
        animate={{ y: [0, -230] }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 11,
          ease: "linear",
        }}
        className="flex flex-col gap-2.5"
      >
        {[...notifications, ...notifications, ...notifications].map((notif, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between gap-3 rounded-[6px] border border-[#E8E5E0] bg-[#FAF9F6] p-3 transition-colors hover:bg-white"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F3F2EE] border border-[#E8E5E0]">
                <BellAlertIcon className="h-4 w-4 text-[#1C1C1C]" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-bold text-[#1C1C1C]">
                  {notif.amount} reçu
                </p>
                <p className="text-[11px] text-[#64635F]">
                  {notif.name} · {notif.prop}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] font-bold text-[#1C1C1C] bg-white border border-[#E8E5E0] px-1.5 py-0.5 rounded block mb-0.5">
                {notif.type}
              </span>
              <span className="text-[10px] text-[#9C9A95]">{notif.time}</span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative overflow-hidden py-24 sm:py-32 bg-[#FAF9F6] border-t border-[#E8E5E0]"
    >
      {/* Background Architectural Grid (Subtle) */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#1C1C1C 1px, transparent 1px), linear-gradient(90deg, #1C1C1C 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-16 max-w-2xl text-center sm:mb-20"
        >
          <div className="section-label mb-3 text-[#1C1C1C]">Fonctionnalités Animées</div>
          <h2 className="heading-2 mb-4 text-[#1C1C1C]">
            Votre tranquillité d&apos;esprit, automatisée
          </h2>
          <p className="body-text text-base sm:text-lg text-[#64635F]">
            Ne perdez plus votre temps à chasser les loyers ou à rédiger des reçus papier. Lokka gère les encaissements, vos quittances et vos locataires en continu.
          </p>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ========================================================================= */}
          {/* CARTE 1 (2 cols) : ENCAISSEMENTS MOMO AUTOMATISÉS & FLUX EN DIRECT        */}
          {/* ========================================================================= */}
          <BentoCard
            title="Zéro loyer oublié."
            badge="01 · Encaissements MoMo"
            description="Laissez vos locataires payer via MTN MoMo ou Moov Money. L'argent arrive, le statut se met à jour et la quittance est émise instantanément."
            className="md:col-span-2"
            delay={0.1}
          >
            <div className="rounded-[8px] border border-[#E8E5E0] bg-white p-5 shadow-2xs">
              <div className="mb-4 flex items-center justify-between border-b border-[#E8E5E0] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1C1C1C]">
                    <CheckCircleIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-[#1C1C1C]">Statut des collectes</div>
                    <div className="text-[11px] text-[#64635F] font-semibold">100% à jour ce mois-ci</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[18px] font-extrabold text-[#1C1C1C]">4 850 000 FCFA</div>
                  <div className="text-[11px] text-[#64635F]">Total encaissé en direct</div>
                </div>
              </div>

              <NotificationFeed />
            </div>
          </BentoCard>

          {/* ========================================================================= */}
          {/* CARTE 2 (1 col) : ANIMATION DES QUITTANCES EMPILÉES 3D                   */}
          {/* ========================================================================= */}
          <BentoCard
            title="Ne rédigez plus jamais de quittances."
            badge="02 · Quittances PDF Web"
            description="Chaque paiement génère une quittance PDF certifiée avec QR Code et mentions obligatoires Loi n° 2022-30."
            className="md:col-span-1"
            delay={0.2}
          >
            <div className="relative mt-4 flex justify-center py-4">
              {/* Backing Receipt Shadow Card */}
              <div className="absolute h-32 w-44 rounded-[8px] border border-[#E8E5E0] bg-[#FAF9F6] shadow-xs rotate-6 opacity-60" />

              {/* Front Interactive Animated Receipt */}
              <div className="relative z-10 flex h-32 w-44 flex-col justify-between rounded-[8px] border border-[#1C1C1C] bg-white p-3.5 shadow-md -rotate-3 transition-transform duration-300 group-hover:rotate-0">
                <div className="flex items-center justify-between border-b border-[#E8E5E0] pb-1.5">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-[#1C1C1C]">
                    <DocumentDuplicateIcon className="h-3.5 w-3.5 text-[#1C1C1C]" />
                    <span>LOK-2026</span>
                  </div>
                  <span className="text-[9px] font-bold text-[#1C1C1C] bg-[#F3F2EE] px-1.5 py-0.5 rounded border border-[#E8E5E0]">
                    Payé ✓
                  </span>
                </div>

                <div className="text-center my-auto">
                  <span className="text-[14px] font-extrabold text-[#1C1C1C]">250 000 F</span>
                  <span className="text-[9px] text-[#64635F] block">Fidjrossè Plage</span>
                </div>

                <div className="flex items-center justify-between text-[8px] text-[#9C9A95] pt-1 border-t border-[#E8E5E0]">
                  <span>Loi n° 2022-30</span>
                  <QrCodeIcon className="h-3.5 w-3.5 text-[#1C1C1C]" />
                </div>
              </div>
            </div>
          </BentoCard>

          {/* ========================================================================= */}
          {/* CARTE 3 (1 col) : STATISTIQUES ANIMÉES (3 COULEURS : NOIR, GRIS & SABLE) */}
          {/* ========================================================================= */}
          <BentoCard
            title="Une vue claire sur vos revenus."
            badge="03 · Rentabilité &amp; TFU"
            description="Visualisez vos encaissements et votre taux d'occupation mensuel en un coup d'œil sans tableur Excel."
            className="md:col-span-1"
            delay={0.3}
          >
            <div className="mt-4 bg-[#FAF9F6] border border-[#E8E5E0] rounded-[8px] p-3">
              <div className="flex h-28 items-end gap-2 px-1">
                {[
                  { h: 40, color: "bg-[#9C9A95]" },              // M1 Gris
                  { h: 65, color: "bg-[#C5A880]" },              // M2 Sable Doré (Sélection)
                  { h: 45, color: "bg-[#9C9A95]" },              // M3 Gris
                  { h: 80, color: "bg-[#C5A880]" },              // M4 Sable Doré (Sélection)
                  { h: 55, color: "bg-[#9C9A95]" },              // M5 Gris
                  { h: 100, color: "bg-[#1C1C1C]" },             // M6 Noir (Pic Maximum)
                  { h: 85, color: "bg-[#C5A880]" },              // M7 Sable Doré (Sélection)
                ].map((item, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <motion.div
                      initial={{ height: 0 }}
                      whileInView={{ height: `${item.h}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.2 + i * 0.08, ease: "easeOut" }}
                      className={`w-full rounded-t-[3px] shadow-2xs ${item.color}`}
                    />
                    <span className="text-[9px] font-mono text-[#9C9A95]">M{i + 1}</span>
                  </div>
                ))}
              </div>

              {/* 3-Color Legend: Noir, Gris, Sable Doré */}
              <div className="flex items-center justify-between gap-1 pt-2.5 mt-2 border-t border-[#E8E5E0] text-[10px] text-[#64635F]">
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[#1C1C1C]" />
                  <span>Max</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[#C5A880]" />
                  <span>TFU Optimisé</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[#9C9A95]" />
                  <span>Mensuel</span>
                </div>
              </div>
            </div>
          </BentoCard>

          {/* ========================================================================= */}
          {/* CARTE 4 (2 cols) : SITE VITRINE PUBLIC EN 1 CLIC                           */}
          {/* ========================================================================= */}
          <BentoCard
            title="Votre Site Vitrine Public en 1 Clic."
            badge="04 · Trouver des locataires"
            description="Publiez vos logements vacants sur votre propre mini-site ou domaine personnalisé (.bj) pour recevoir des demandes de visite en direct."
            className="md:col-span-2"
            delay={0.4}
          >
            <div className="rounded-[8px] border border-[#E8E5E0] bg-[#FAF9F6] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-left w-full sm:w-auto">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#64635F]">
                  <GlobeAltIcon className="h-3.5 w-3.5 text-[#1C1C1C]" />
                  <span className="font-bold text-[#1C1C1C]">votre-nom.lokka.bj</span>
                </div>
                <div className="text-[12px] text-[#64635F]">
                  Réservations en ligne &amp; contact direct WhatsApp
                </div>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <div className="flex-1 sm:flex-initial py-2 px-3 bg-white border border-[#E8E5E0] text-[#1C1C1C] text-[11px] font-bold rounded flex items-center gap-1 shadow-2xs">
                  <CalendarDaysIcon className="h-3.5 w-3.5" />
                  <span>Visites</span>
                </div>
                <div className="flex-1 sm:flex-initial py-2 px-3 bg-[#1C1C1C] text-white text-[11px] font-bold rounded flex items-center gap-1 shadow-2xs">
                  <ChatBubbleLeftRightIcon className="h-3.5 w-3.5" />
                  <span>WhatsApp direct</span>
                </div>
              </div>
            </div>
          </BentoCard>
        </div>
      </div>

      {/* CSS for mask image gradient */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .mask-image-bottom {
          mask-image: linear-gradient(to bottom, black 65%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, black 65%, transparent 100%);
        }
      `,
        }}
      />
    </section>
  );
}