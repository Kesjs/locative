"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, User, Building2 } from "lucide-react";

interface ModernStepperProps {
  currentStep: 0 | 1;
  onStepClick?: (step: 0 | 1) => void;
}

const STEPS_DATA = [
  { id: 0, title: "Profil & Perception", desc: "Statut & Coordonnées", icon: User },
  { id: 1, title: "Patrimoine & Biens", desc: "Résidence & Logements", icon: Building2 },
];

export function ModernStepper({ currentStep }: ModernStepperProps) {
  const progressPercentage = currentStep === 0 ? 50 : 100;

  return (
    <div className="w-full space-y-4">
      {/* Barre de progression continue */}
      <div className="relative w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <motion.div
          className="absolute left-0 top-0 bottom-0 bg-emerald-600 rounded-full"
          initial={{ width: "50%" }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {/* Étapes numérotées */}
      <div className="grid grid-cols-2 gap-2.5">
        {STEPS_DATA.map((step) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className={`flex items-center gap-2.5 p-2.5 rounded-xl transition-all duration-200 ${
                isCurrent
                  ? "bg-emerald-50 border border-emerald-300 shadow-2xs"
                  : isCompleted
                  ? "bg-slate-100/80 border border-slate-200"
                  : "opacity-60 border border-transparent"
              }`}
            >
              {/* Badge d'étape */}
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-[12px] font-bold shrink-0 transition-all ${
                  isCompleted
                    ? "bg-emerald-600 text-white"
                    : isCurrent
                    ? "bg-emerald-600 text-white ring-2 ring-emerald-500/30"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 stroke-[2.5]" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
              </div>

              {/* Textes de l'étape */}
              <div className="min-w-0">
                <div
                  className={`text-[12.5px] font-bold truncate leading-tight ${
                    isCurrent || isCompleted
                      ? "text-slate-900"
                      : "text-slate-500"
                  }`}
                >
                  {step.title}
                </div>
                <div className="text-[11px] text-slate-500 truncate leading-tight mt-0.5">
                  {step.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
