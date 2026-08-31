"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRightIcon,
  ArrowTrendingUpIcon,
  DevicePhoneMobileIcon,
  HomeModernIcon,
} from "@heroicons/react/24/outline";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import SideRays from "@/components/ui/side-rays";
import FluidFlowGrid from "@/components/ui/fluid-flow-grid";
import { LiquidButton } from "@/components/ui/liquid-button";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Loyers encaissés", value: "2,4M", unit: "FCFA", delta: "+12%" },
  { label: "Biens gérés", value: "12", unit: "", delta: null },
  { label: "Recouvrement", value: "98", unit: "%", delta: null },
];

const activity = [
  { name: "Appartement 4B — Cocotiers", amount: "150 000 FCFA" },
  { name: "Villa — Fidjrossè", amount: "320 000 FCFA" },
];

const ease = [0.16, 1, 0.3, 1] as const;

export default function HeroSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-bg-canvas py-20 sm:py-28 lg:py-32">
      {/* Background interactif Fluid Flow */}
      <FluidFlowGrid />
      <div className="pointer-events-none absolute right-[6%] top-1/3 h-[280px] w-[380px] -translate-y-1/2 rounded-full bg-brand-primary/[0.03] blur-[110px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-8">
          {/* Colonne gauche — accroche */}
          <div className="lg:col-span-5">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="text-[clamp(2.1rem,4.5vw,3.4rem)] font-serif leading-[1.12] tracking-[-0.02em] text-text-primary"
            >
              Votre écosystème locatif,{" "}
              <span className="font-serif italic text-text-secondary">automatisé</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease }}
              className="mt-5 max-w-[46ch] text-[15px] leading-relaxed text-text-secondary sm:text-base"
            >
              Suivez vos loyers, générez vos quittances et présentez vos biens en
              ligne — sans quitter votre tableau de bord.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <LiquidButton
                baseColor="#18181B"
                liquidColor="#F4F2EC"
                textColor="#FFFFFF"
                textHoverColor="#18181B"
                size="lg"
              >
                Démarrer gratuitement
                <ArrowRightIcon className="h-4 w-4" />
              </LiquidButton>

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-md border border-border-default px-5 py-3 text-sm font-medium text-text-primary transition-colors hover:bg-bg-subtle"
              >
                Voir une démo
              </button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-6 text-xs font-medium text-text-muted"
            >
              Déjà utilisé par 100+ bailleurs et gestionnaires au Bénin.
            </motion.p>
          </div>

          {/* Colonne droite — mock UI du tableau de bord (sans image) */}
          <div className="relative lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease }}
              className="relative rounded-lg border border-border-default bg-bg-surface p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_-1px_rgba(0,0,0,0.03)] sm:p-7"
            >
              <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                  </span>
                  <span className="text-sm font-medium text-text-primary">
                    Tableau de bord
                  </span>
                </div>
                <span className="text-xs text-text-muted">Cette semaine</span>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-md bg-bg-subtle p-3.5 sm:p-4">
                    <p className="text-[11px] text-text-muted">{stat.label}</p>
                    <p className="mt-1.5 font-serif text-xl text-text-primary sm:text-2xl">
                      {stat.value}
                      <span className="ml-1 font-sans text-xs text-text-muted">
                        {stat.unit}
                      </span>
                    </p>
                    {stat.delta && (
                      <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-success">
                        <ArrowTrendingUpIcon className="h-3 w-3" />
                        {stat.delta}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-5 divide-y divide-border-subtle border-t border-border-subtle">
                {activity.map((row) => (
                  <div key={row.name} className="flex items-center justify-between py-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <HomeModernIcon className="h-4 w-4 shrink-0 text-text-muted" />
                      <span className="truncate text-sm text-text-primary">{row.name}</span>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="text-sm font-medium text-text-primary">{row.amount}</span>
                      <span className="rounded-full bg-success-bg px-2 py-0.5 text-[11px] font-medium text-success">
                        Payé
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Notification flottante — le "moment" signature de ce Hero */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0.3, delay: 1 }
                  : { type: "spring", stiffness: 100, damping: 14, delay: 1.1 }
              }
              className="absolute -bottom-6 left-4 z-20 flex max-w-[250px] items-center gap-3 rounded-lg border border-border-default bg-bg-surface p-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] sm:-left-8 sm:p-4"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-success-bg text-success">
                <DevicePhoneMobileIcon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold leading-tight text-text-primary">
                  Paiement Mobile Money reçu
                </p>
                <p className="mt-0.5 text-[11px] text-text-muted">
                  150 000 FCFA · Appt 4B
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
