"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  SparklesIcon,
  XMarkIcon,
  CheckCircleIcon,
  BuildingOffice2Icon,
  UsersIcon,
  CreditCardIcon,
  GlobeAltIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";

interface OnboardingTourProps {
  onOpenAddBien?: () => void;
}

export function OnboardingTour({ onOpenAddBien }: OnboardingTourProps) {
  const [isDismissed, setIsDismissed] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]);

  useEffect(() => {
    const isSkipped = localStorage.getItem("lokka_onboarding_skipped");
    if (!isSkipped) {
      setIsDismissed(false);
    }
  }, []);

  const handleSkip = () => {
    setIsDismissed(true);
    localStorage.setItem("lokka_onboarding_skipped", "true");
  };

  const handleToggleStep = (stepId: number) => {
    if (completedSteps.includes(stepId)) {
      setCompletedSteps(completedSteps.filter((s) => s !== stepId));
    } else {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  if (isDismissed) {
    return null;
  }

  const steps = [
    {
      id: 1,
      title: "Ajouter votre premier bien immobilier",
      desc: "Enregistrez une villa, un appartement ou un studio avec ses compteurs SBEE.",
      icon: BuildingOffice2Icon,
      actionLabel: "Ajouter un bien",
      action: onOpenAddBien,
      href: "/dashboard/patrimoine",
    },
    {
      id: 2,
      title: "Enregistrer un locataire & contrat de bail",
      desc: "Générez un contrat conforme Loi 2022-30 et invitez le locataire sur son portail web.",
      icon: UsersIcon,
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
    <div className="bg-gradient-to-r from-card via-card to-primary/5 border border-primary/25 rounded-2xl p-5 shadow-sm text-card-foreground mb-6 relative overflow-hidden transition-all animate-in fade-in-50 duration-200">
      
      {/* Decorative Glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center font-bold shrink-0">
            <SparklesIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-[15px] text-foreground">
                Bienvenue sur Lokka ! Guide de Démarrage Rapide
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-primary/15 text-primary">
                {progressPercentage}% Complété
              </span>
            </div>
            <p className="text-[12px] text-muted-foreground mt-0.5">
              Suivez ces 4 étapes simples pour automatiser 100% de votre gestion locative béninoise.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition text-[12px] flex items-center gap-1 cursor-pointer"
          >
            {isCollapsed ? <ChevronDownIcon className="w-4 h-4" /> : <ChevronUpIcon className="w-4 h-4" />}
            <span className="hidden sm:inline">{isCollapsed ? "Dérouler" : "Réduire"}</span>
          </button>
          <button
            type="button"
            onClick={handleSkip}
            className="px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition text-[12px] font-bold flex items-center gap-1 cursor-pointer"
            title="Masquer le guide"
          >
            <XMarkIcon className="w-4 h-4" />
            <span>Passer le guide (Skiper)</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-muted h-1.5 rounded-full mt-3 overflow-hidden border border-border/40">
        <div
          className="bg-primary h-full transition-all duration-500 rounded-full"
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
                  className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                    isDone
                      ? "bg-card border-border/80 opacity-90 shadow-2xs"
                      : "bg-card border-primary/30 shadow-xs ring-1 ring-primary/15"
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">
                          Étape {st.id}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleStep(st.id)}
                        className={`p-1 rounded-md transition cursor-pointer ${
                          isDone ? "text-success" : "text-muted-foreground hover:text-foreground"
                        }`}
                        title={isDone ? "Marquer non fait" : "Marquer comme fait"}
                      >
                        <CheckCircleIcon className="w-4 h-4 stroke-[2]" />
                      </button>
                    </div>

                    <h4 className="font-bold text-[13px] text-foreground leading-snug">
                      {st.title}
                    </h4>
                    <p className="text-[11.5px] text-muted-foreground leading-relaxed">
                      {st.desc}
                    </p>
                  </div>

                  {st.action ? (
                    <button
                      type="button"
                      onClick={st.action}
                      className="w-full py-1.5 px-3 bg-primary hover:bg-primary/90 text-primary-foreground text-[12px] font-bold rounded-lg flex items-center justify-center gap-1 transition shadow-2xs cursor-pointer"
                    >
                      <span>{st.actionLabel}</span>
                      <ArrowRightIcon className="w-3 h-3" />
                    </button>
                  ) : (
                    <Link
                      href={st.href}
                      className="w-full py-1.5 px-3 bg-muted hover:bg-primary hover:text-primary-foreground text-foreground text-[12px] font-bold rounded-lg flex items-center justify-center gap-1 transition shadow-2xs cursor-pointer"
                    >
                      <span>{st.actionLabel}</span>
                      <ArrowRightIcon className="w-3 h-3" />
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
