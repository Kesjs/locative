"use client";

import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import {
  DevicePhoneMobileIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

const steps = [
  {
    label: "Encaissements MoMo",
    description:
      "Vos locataires paient leur loyer en Mobile Money. Chaque paiement est rapproché et visible en temps réel dans votre tableau de bord.",
  },
  {
    label: "Quittances automatiques",
    description:
      "Dès qu'un loyer est encaissé, la quittance légale est générée et envoyée au locataire — sans intervention de votre part.",
  },
  {
    label: "Vitrine agence",
    description:
      "Vos biens disponibles s'affichent sur une page publique à votre nom, à partager directement à vos prospects.",
  },
];

const ease = [0.16, 1, 0.3, 1] as const;

export default function StickyFeatures() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const rawIndex = useTransform(scrollYProgress, [0, 1], [0, steps.length - 1]);

  useMotionValueEvent(rawIndex, "change", (latest) => {
    const idx = Math.min(steps.length - 1, Math.max(0, Math.round(latest)));
    setActiveIndex(idx);
  });

  return (
    <section className="bg-bg-canvas py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-14 max-w-xl lg:mb-20">
          <h2 className="text-[clamp(1.8rem,3.5vw,2.6rem)] font-serif leading-[1.15] tracking-[-0.02em] text-text-primary">
            Trois automatismes,{" "}
            <span className="font-serif italic text-text-secondary">un seul espace</span>
          </h2>
        </div>

        {/* Mobile — version empilée, sans scroll-jacking */}
        <div className="space-y-16 lg:hidden">
          {steps.map((step, idx) => (
            <div key={step.label}>
              <StepText step={step} index={idx} isActive />
              <div className="mt-6 h-[380px]">
                <MockFrame index={idx} />
              </div>
            </div>
          ))}
        </div>

        {/* Desktop — sticky scroll narratif */}
        <div ref={containerRef} className="hidden lg:block lg:h-[300vh]">
          <div className="sticky top-20 grid grid-cols-2 gap-16">
            <div className="flex flex-col justify-center gap-10 py-10">
              {steps.map((step, idx) => (
                <StepText
                  key={step.label}
                  step={step}
                  index={idx}
                  isActive={idx === activeIndex}
                />
              ))}
            </div>
            <div className="flex items-center">
              <div className="relative h-[440px] w-full">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -28 }}
                    transition={{ duration: 0.45, ease }}
                    className="absolute inset-0"
                  >
                    <MockFrame index={activeIndex} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepText({
  step,
  index,
  isActive,
}: {
  step: { label: string; description: string };
  index: number;
  isActive: boolean;
}) {
  return (
    <div
      className={cn(
        "border-l-2 pl-5 transition-colors duration-500",
        isActive ? "border-brand-primary" : "border-border-subtle"
      )}
    >
      <span
        className={cn(
          "text-xs font-medium tabular-nums transition-colors duration-500",
          isActive ? "text-brand-primary" : "text-text-muted"
        )}
      >
        0{index + 1}
      </span>
      <h3
        className={cn(
          "mt-1.5 text-lg font-semibold transition-colors duration-500 sm:text-xl",
          isActive ? "text-text-primary" : "text-text-muted"
        )}
      >
        {step.label}
      </h3>
      <p
        className={cn(
          "mt-2 max-w-[42ch] text-sm leading-relaxed transition-colors duration-500",
          isActive ? "text-text-secondary" : "text-text-muted/70"
        )}
      >
        {step.description}
      </p>
    </div>
  );
}

function MockFrame({ index }: { index: number }) {
  if (index === 1) return <ReceiptMock />;
  if (index === 2) return <BrowserMock />;
  return <MomoMock />;
}

function MomoMock() {
  return (
    <div className="flex h-full flex-col justify-center gap-4 rounded-lg border border-border-default bg-bg-surface p-6 sm:p-8">
      <div className="rounded-2xl bg-brand-primary p-6 text-white shadow-[0_20px_40px_rgba(0,0,0,0.18)]">
        <div className="flex items-center justify-between">
          <span className="font-serif text-lg italic">Lokka Pay</span>
          <div className="h-5 w-7 rounded-sm bg-gradient-to-br from-[#E8C97A] to-[#C9A227]" />
        </div>
        <p className="mt-8 font-mono text-lg tracking-[0.25em] text-white/80">
          •••• •••• •••• 4821
        </p>
        <div className="mt-6 flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/50">
              Titulaire
            </p>
            <p className="text-sm">AMINATA K.</p>
          </div>
          <DevicePhoneMobileIcon className="h-6 w-6 text-white/70" />
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-md bg-success-bg px-4 py-3">
        <span className="h-2 w-2 shrink-0 rounded-full bg-success" />
        <p className="text-sm font-medium text-success">
          + 150 000 FCFA reçu à l&apos;instant
        </p>
      </div>
    </div>
  );
}

function ReceiptMock() {
  return (
    <div className="flex h-full items-center justify-center rounded-lg border border-border-default bg-bg-subtle p-6 sm:p-10">
      <div className="w-full max-w-[300px] rounded-md border border-border-default bg-bg-surface p-6 shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between border-b border-border-subtle pb-4">
          <span className="font-serif text-base text-text-primary">Lokka</span>
          <span className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-text-muted">
            <DocumentTextIcon className="h-3 w-3" />
            Quittance
          </span>
        </div>
        <dl className="mt-4 space-y-2.5 text-[13px]">
          <Row label="Locataire" value="M. Dossou" />
          <Row label="Bien" value="Appt 4B, Cocotiers" />
          <Row label="Période" value="Août 2026" />
          <Row label="Montant" value="150 000 FCFA" />
        </dl>
        <div className="mt-5 flex items-center justify-between border-t border-border-subtle pt-4">
          <span className="text-[10px] text-text-muted">Réf. LK-2026-0847</span>
          <span className="-rotate-6 rounded-sm border-2 border-success px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-success">
            Payé
          </span>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-text-muted">{label}</dt>
      <dd className="font-medium text-text-primary">{value}</dd>
    </div>
  );
}

function BrowserMock() {
  const listings = ["Appt 2 pièces — Fidjrossè", "Villa 4 ch. — Akpakpa"];

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border-default bg-bg-surface shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
      <div className="flex items-center gap-4 border-b border-border-subtle bg-bg-subtle px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        </div>
        <div className="flex flex-1 items-center gap-1.5 rounded-md bg-bg-surface px-3 py-1 text-[11px] text-text-muted">
          <LockClosedIcon className="h-3 w-3" />
          lokka.bj/agence/cocotiers-immo
        </div>
      </div>
      <div className="flex-1 space-y-3 p-5">
        <p className="text-sm font-semibold text-text-primary">Agence Cocotiers Immo</p>
        <div className="grid grid-cols-2 gap-3">
          {listings.map((item) => (
            <div key={item} className="rounded-md bg-bg-subtle p-3">
              <GlobeAltIcon className="h-4 w-4 text-text-muted" />
              <p className="mt-2 text-[11px] leading-snug text-text-secondary">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
