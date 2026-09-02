"use client";

import React, { useState } from "react";
import { useUserProfile, type LokkaPlan } from "@/hooks/useUserProfile";
import {
  SparklesIcon,
  XMarkIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ShieldCheckIcon,
  BuildingOffice2Icon,
  CheckIcon,
} from "@heroicons/react/24/outline";

export function DevPlanSwitcher() {
  const { plan, role, quotaBiens, switchDevPlan } = useUserProfile();
  const [isOpen, setIsOpen] = useState(false);

  // Sécurité : Ne jamais afficher le switcher en production
  if (process.env.NODE_ENV === "production") return null;

  const PLANS: { id: LokkaPlan; name: string; price: string; role: string; desc: string; color: string }[] = [
    {
      id: "starter",
      name: "Starter (Gratuit)",
      price: "0 FCFA / mois",
      role: "Propriétaire Bailleur",
      desc: "Limite 2 biens max · Idéal pour tester",
      color: "bg-emerald-500",
    },
    {
      id: "pro",
      name: "Pro Bailleur & Diaspora",
      price: "15 000 FCFA / mois",
      role: "Propriétaire Bailleur",
      desc: "Jusqu'à 10 biens · Quittances illimitées",
      color: "bg-amber-500",
    },
    {
      id: "agence",
      name: "Agence & Multi-Mandats",
      price: "35 000 FCFA / mois",
      role: "Agence",
      desc: "Biens illimités · 10% CRG · White-label",
      color: "bg-blue-600",
    },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50 select-none font-sans">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#0F172A] text-white shadow-xl hover:scale-105 border border-white/20 text-[11.5px] font-extrabold tracking-wide transition-all cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>DEV PLAN :</span>
          <span className="uppercase text-amber-400">{plan}</span>
          <ChevronUpIcon className="w-3.5 h-3.5 text-white/70" />
        </button>
      ) : (
        <div className="bg-card border border-border rounded-2xl p-4 w-80 shadow-2xl space-y-3 animate-in slide-in-from-bottom-5 duration-200 text-card-foreground">
          <div className="flex items-center justify-between pb-2.5 border-b border-border">
            <div className="flex items-center gap-1.5 text-[12px] font-extrabold text-foreground">
              <SparklesIcon className="w-4 h-4 text-primary" />
              <span>Simulateur de Plan &amp; Quotas (Dev)</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-muted-foreground hover:bg-muted"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            {PLANS.map((p) => {
              const isSelected = plan === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => switchDevPlan(p.id, p.role)}
                  className={`p-3 rounded-xl border-2 transition cursor-pointer flex items-start justify-between ${
                    isSelected
                      ? "border-primary bg-primary/10 shadow-xs"
                      : "border-border bg-muted/40 hover:bg-muted"
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${p.color}`} />
                      <span className="font-bold text-[12.5px] text-foreground">{p.name}</span>
                    </div>
                    <p className="text-[11px] font-semibold text-primary">{p.price}</p>
                    <p className="text-[10px] text-muted-foreground">{p.desc}</p>
                  </div>
                  {isSelected && <CheckIcon className="w-4 h-4 text-primary shrink-0 mt-0.5" />}
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-border space-y-2">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Rôle actif : <strong>{role}</strong></span>
              <span>Biens : <strong>{quotaBiens.current}/{quotaBiens.max}</strong></span>
            </div>
            <a
              href="/locataire"
              className="w-full py-1.5 px-3 rounded-lg bg-muted hover:bg-muted/80 text-[11px] font-bold text-foreground text-center block transition-colors border border-border"
            >
              Tester l'Espace Locataire
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
