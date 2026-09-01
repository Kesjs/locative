"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  SparklesIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  XMarkIcon,
  BuildingOffice2Icon,
  UserPlusIcon,
  CreditCardIcon,
  GlobeAltIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";

export function OnboardingTour({
  onAddPropertyClick,
  onOpenAddBien,
}: {
  onAddPropertyClick?: () => void;
  onOpenAddBien?: () => void;
}) {
  const handleAddProperty = onOpenAddBien || onAddPropertyClick;
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("lokka_onboarding_completed_steps");
      if (saved) {
        setCompletedSteps(JSON.parse(saved));
      }
      const dismissed = localStorage.getItem("lokka_onboarding_dismissed");
      if (dismissed === "true") {
        setIsDismissed(true);
      }
    } catch (_) {}
  }, []);

  const handleToggleStep = (stepId: number) => {
    setCompletedSteps((prev) => {
      let updated: number[];
      if (prev.includes(stepId)) {
        updated = prev.filter((id) => id !== stepId);
      } else {
        updated = [...prev, stepId];
      }
      try {
        localStorage.setItem("lokka_onboarding_completed_steps", JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
  };

  const handleSkip = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem("lokka_onboarding_dismissed", "true");
    } catch (_) {}
  };

  if (isDismissed) return null;

  const steps = [
    {
      id: 1,
      title: "Ajouter votre premier bien immobilier",
      desc: "Enregistrez une villa, un appartement ou un studio avec ses compteurs SBEE.",
      icon: BuildingOffice2Icon,
      actionLabel: "Ajouter un bien",
      action: handleAddProperty,
      href: "/dashboard/patrimoine",
    },
    {
      id: 2,
      title: "Enregistrer un locataire & contrat de bail",
      desc: "Générez un contrat conforme Loi 2022-30 et invitez le locataire sur son portail web.",
      icon: UserPlusIcon,
      actionLabel: "Nouveau bail",
      href: "/dashboard/locataires",
    },
    {
      id: 3,
      title: "Configurer vos coordonnées MTN MoMo & Banques",
      desc: "Renseignez votre numéro de réception pour percevoir les loyers sans intermédiaire.",
      icon: CreditCardIcon,
      actionLabel: "Configurer MoMo",
      href: "/dashboard/parametres",
    },
    {
      id: 4,
      title: "Personnaliser & Partager votre mini-site vitrine",
      desc: "Diffusez vos logements vacants auprès de locataires sérieux et diaspora.",
      icon: GlobeAltIcon,
      actionLabel: "Ouvrir le Studio",
      href: "/dashboard/annonces",
    },
  ];

  const progressPercentage = Math.round((completedSteps.length / steps.length) * 100);

  return (
    <div className="bg-white dark:bg-[#101B17] border border-emerald-200/80 dark:border-emerald-800/60 rounded-2xl p-5 shadow-xs text-slate-900 dark:text-slate-100 mb-6 relative overflow-hidden transition-all animate-in fade-in-50 duration-200">
      
      {/* Decorative Subtle Ambient Glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-emerald-500/[0.08] blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shrink-0 border border-emerald-200/60 dark:border-emerald-800">
            <SparklesIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-[15px] text-slate-900 dark:text-white">
                Bienvenue sur Lokka ! Guide de Démarrage Rapide
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold bg-emerald-100/70 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800">
                {progressPercentage}% Complété
              </span>
            </div>
            <p className="text-[12px] text-slate-600 dark:text-slate-400 mt-0.5">
              Suivez ces 4 étapes simples pour automatiser 100% de votre gestion locative béninoise.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition text-[12px] flex items-center gap-1 cursor-pointer"
          >
            {isCollapsed ? <ChevronDownIcon className="w-4 h-4" /> : <ChevronUpIcon className="w-4 h-4" />}
            <span className="hidden sm:inline font-medium">{isCollapsed ? "Dérouler" : "Réduire"}</span>
          </button>
          <button
            type="button"
            onClick={handleSkip}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition text-[12px] font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Masquer le guide"
          >
            <XMarkIcon className="w-4 h-4" />
            <span>Passer le guide (Skiper)</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-3.5 overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
        <div
          className="bg-emerald-600 dark:bg-emerald-500 h-full transition-all duration-500 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Steps List (Collapsible) */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-4 pt-1"
          >
            {steps.map((st) => {
              const isDone = completedSteps.includes(st.id);
              const Icon = st.icon;

              return (
                <div
                  key={st.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3.5 ${
                    isDone
                      ? "bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-90 shadow-2xs"
                      : "bg-white dark:bg-[#13231E] border-emerald-200/70 dark:border-emerald-800/70 shadow-xs ring-1 ring-emerald-500/15"
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Étape {st.id}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleStep(st.id)}
                        className={`p-1 rounded-lg transition cursor-pointer ${
                          isDone ? "text-emerald-600 dark:text-emerald-400" : "text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300"
                        }`}
                        title={isDone ? "Marquer non fait" : "Marquer comme fait"}
                      >
                        <CheckCircleIcon className="w-4.5 h-4.5 stroke-[2]" />
                      </button>
                    </div>

                    <h4 className="font-bold text-[13.5px] text-slate-900 dark:text-white leading-snug">
                      {st.title}
                    </h4>
                    <p className="text-[11.5px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      {st.desc}
                    </p>
                  </div>

                  {st.action ? (
                    <button
                      type="button"
                      onClick={st.action}
                      className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-semibold rounded-xl flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
                    >
                      <span>{st.actionLabel}</span>
                      <ArrowRightIcon className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <Link
                      href={st.href}
                      className="w-full py-2 px-3 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 text-[12px] font-semibold rounded-xl flex items-center justify-center gap-1.5 transition shadow-2xs cursor-pointer"
                    >
                      <span>{st.actionLabel}</span>
                      <ArrowRightIcon className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
