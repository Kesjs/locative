"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/ui/Logo";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  UserCircleIcon,
  CheckCircleIcon,
  CheckIcon,
  FlagIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

import { type OnboardingState, type ProfilStepData } from "./_types";
import { StepProfil } from "./_components/StepProfil";
import { StepObjectifs } from "./_components/StepObjectifs";
import { StepSaisieExpress } from "./_components/StepSaisieExpress";

const STEPS = [
  { id: "profil", label: "Profil", icon: UserCircleIcon },
  { id: "objectifs", label: "Objectifs", icon: FlagIcon },
  { id: "express", label: "Saisie Express", icon: DocumentTextIcon },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<0 | 1 | 2>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [state, setState] = useState<OnboardingState>({
    profil: {
      profileType: "bailleur",
      nom: "",
      moyenReception: "mobile_money",
      mobileProvider: "mtn",
      zoneGeo: "benin",
    },
    objectifs: [],
    saisieExpress: {},
  });

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("lokka_user_profile");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setState(prev => ({
          ...prev,
          profil: {
            ...prev.profil,
            nom: parsed.name || "",
            profileType: parsed.accountType === "agence" ? "agence" : "bailleur",
          }
        }));
      }
    } catch (_) {}
  }, []);

  const handleNext = () => {
    if (currentStep < 2) setCurrentStep((prev) => (prev + 1) as 0 | 1 | 2);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((prev) => (prev - 1) as 0 | 1 | 2);
  };

  const isStepValid = () => {
    if (currentStep === 0) return state.profil.nom.trim().length > 0;
    if (currentStep === 1) return state.objectifs.length > 0;
    return true; // Étape 3 optionnelle selon les champs
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          // TODO: RPC `complete_onboarding` ne persiste potentiellement pas profil_type comme attendu par le schéma strict, 
          // ou l'enum `role_interne_type` ne correspond pas. Mise à jour de la table profile.
          await supabase
            .from("profiles")
            .update({
              full_name: state.profil.nom,
              role: state.profil.profileType,
              onboarding_completed: true,
              // Sauvegarde du state complet d'onboarding dans raw_user_meta_data ou dans une autre colonne JSON si disponible
              // ou sauvegarde des objectifs localement pour le dashboard.
            })
            .eq("id", user.id);
            
          // Sauvegarde locale pour affichage contextuel du Dashboard
          localStorage.setItem("lokka_onboarding_objectifs", JSON.stringify(state.objectifs));
        }
      }
    } catch (err) {
      console.warn("Supabase onboarding sync notice:", err);
    }

    setTimeout(() => {
      router.push("/dashboard");
    }, 900);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center py-8 px-4 bg-[#FAF9F6]">
      <div className="w-full max-w-xl flex flex-col justify-between p-4 mb-4 z-10 bg-[#FAF9F6]">
        {/* Header */}
        <div className="w-full flex items-center justify-between pb-6 border-b border-[#E8E5E0]">
          <Logo size="sm" variant="dark" />
          <span className="text-[12px] font-bold text-[#64635F]">
            Configuration de votre espace
          </span>
        </div>

        {/* Stepper Progress Bar */}
        <div className="w-full max-w-sm mx-auto my-8">
          <div className="flex items-center justify-between px-2">
            {STEPS.map((s, index) => {
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;

              return (
                <div key={index} className="flex-1 flex flex-col items-center relative">
                  {index > 0 && (
                    <div
                      className={`absolute top-4 -left-1/2 w-full h-[2px] -z-0 transition-colors duration-300 ${
                        index <= currentStep ? "bg-[#1C1C1C]" : "bg-[#E8E5E0]"
                      }`}
                    />
                  )}

                  <div
                    className={`relative z-10 h-8 w-8 rounded-full flex items-center justify-center text-[12px] font-bold transition-all duration-300 ${
                      isCompleted
                        ? "bg-[#1C1C1C] text-white shadow-sm"
                        : isCurrent
                        ? "bg-[#1C1C1C] text-white ring-4 ring-[#1C1C1C]/10 shadow-sm"
                        : "bg-[#FAF9F6] text-[#9C9A95] border-2 border-[#E8E5E0]"
                    }`}
                  >
                    {isCompleted ? <CheckIcon className="h-4 w-4 stroke-[2.5]" /> : index + 1}
                  </div>

                  <span
                    className={`mt-2 text-[11px] font-medium hidden sm:block ${
                      isCurrent
                        ? "text-[#1C1C1C] font-bold"
                        : isCompleted
                        ? "text-[#1C1C1C]"
                        : "text-[#9C9A95]"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card Content Form */}
        <div className="w-full bg-white border border-[#E8E5E0] rounded-2xl p-6 sm:p-8 shadow-sm">
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <StepProfil
                  data={state.profil}
                  onChange={(profil) => setState({ ...state, profil })}
                />
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <StepObjectifs
                  selected={state.objectifs}
                  onChange={(objectifs) => setState({ ...state, objectifs })}
                />
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <StepSaisieExpress
                  profileType={state.profil.profileType}
                  objectifs={state.objectifs}
                  data={state.saisieExpress}
                  onChange={(saisieExpress) => setState({ ...state, saisieExpress })}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-6">
          {currentStep > 0 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={isSubmitting}
              className="px-5 py-2.5 text-[13px] font-bold text-[#64635F] hover:text-[#1C1C1C] transition-colors disabled:opacity-50"
            >
              Retour
            </button>
          ) : (
            <div></div> // Spacer
          )}

          <button
            type="button"
            disabled={!isStepValid() || isSubmitting}
            onClick={currentStep === 2 ? handleSubmit : handleNext}
            className={`px-8 py-2.5 text-[14px] font-bold rounded-lg shadow-sm transition-all flex items-center gap-2 ${
              !isStepValid() || isSubmitting
                ? "bg-[#E8E5E0] text-[#9C9A95] cursor-not-allowed"
                : "bg-[#1C1C1C] text-white hover:bg-black hover:shadow-md cursor-pointer"
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>Configuration...</span>
              </>
            ) : currentStep === 2 ? (
              <>
                <span>Terminer</span>
                <CheckCircleIcon className="w-4 h-4" />
              </>
            ) : (
              <span>Continuer</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
