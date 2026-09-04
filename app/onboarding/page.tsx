"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/ui/Logo";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
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

const ONBOARDING_DRAFT_KEY = "lokka_onboarding_draft";

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<0 | 1 | 2>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [isHydrated, setIsHydrated] = useState(false);

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

  // 1. Restauration de l'état (brouillon sauvé ou profil Google)
  useEffect(() => {
    try {
      // Vérifier si un brouillon d'onboarding existe déjà
      const draft = localStorage.getItem(ONBOARDING_DRAFT_KEY);
      if (draft) {
        const parsed = JSON.parse(draft);
        if (parsed.state) setState(parsed.state);
        if (typeof parsed.currentStep === "number" && [0, 1, 2].includes(parsed.currentStep)) {
          setCurrentStep(parsed.currentStep as 0 | 1 | 2);
        }
      } else {
        // Fallback sur profil d'inscription
        const savedUser = localStorage.getItem("lokka_user_profile");
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          setState((prev) => ({
            ...prev,
            profil: {
              ...prev.profil,
              nom: parsed.name || "",
              profileType: parsed.accountType === "agence" ? "agence" : "bailleur",
            },
          }));
        }
      }
    } catch (_) {}

    // Pré-remplissage avec le compte Supabase / Google si le nom est encore vide
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          const googleName =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            (user.email ? user.email.split("@")[0] : "");

          setState((prev) => {
            if (!prev.profil.nom && googleName) {
              return {
                ...prev,
                profil: {
                  ...prev.profil,
                  nom: googleName,
                },
              };
            }
            return prev;
          });
        }
      });
    }

    setIsHydrated(true);
  }, []);

  // 2. Sauvegarde automatique à chaque changement
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(
        ONBOARDING_DRAFT_KEY,
        JSON.stringify({
          currentStep,
          state,
          savedAt: Date.now(),
        })
      );
    } catch (_) {}
  }, [currentStep, state, isHydrated]);

  const handleNext = () => {
    setDirection("forward");
    if (currentStep < 2) setCurrentStep((prev) => (prev + 1) as 0 | 1 | 2);
  };

  const handleBack = () => {
    setDirection("back");
    if (currentStep > 0) setCurrentStep((prev) => (prev - 1) as 0 | 1 | 2);
  };

  const isStepValid = () => {
    if (currentStep === 0) return state.profil.nom.trim().length > 0;
    if (currentStep === 1) return state.objectifs.length > 0;
    return true;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const isAgency = state.profil.profileType === "agence";
    const canonicalRole = isAgency ? "agency_admin" : "owner";

    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        let activeOrgId: string | null = null;

        if (user) {
          // 1. Tenter d'exécuter la RPC complete_onboarding_organization
          const orgName = state.profil.nom || (isAgency ? "Mon Agence Immobilière" : "Mon Portefeuille");
          const { data: orgData, error: rpcError } = await supabase.rpc("complete_onboarding_organization", {
            p_name: orgName,
            p_type: isAgency ? "agency" : "owner",
            p_portfolio_size: "1-5",
            p_role: canonicalRole,
          });

          if (rpcError) {
            console.warn("RPC complete_onboarding_organization notice:", rpcError.message);
          } else if (orgData) {
            activeOrgId = orgData;
          }

          // 2. Mettre à jour le profil avec le rôle canonique et onboarding_completed
          await supabase
            .from("profiles")
            .update({
              full_name: state.profil.nom,
              role: canonicalRole,
              onboarding_completed: true,
            })
            .eq("id", user.id);

          // 3. ENREGISTREMENT RÉEL DES INFORMATIONS DE LA SAISIE EXPRESS
          const { saisieExpress } = state;
          const isTrouverLocataires = state.objectifs.includes("trouver_locataires");

          // Détermination du nom, loyer et locataire du premier bien
          let bienNom = isAgency
            ? `Lot 101 - ${state.profil.nom || "Agence"}`
            : `Bien principal - ${state.profil.nom || "Bailleur"}`;

          let bienType = "Appartement 3P (2 chambres)";
          if (saisieExpress.typeBienVacant) {
            bienNom = saisieExpress.typeBienVacant;
            bienType = saisieExpress.typeBienVacant;
          } else if (saisieExpress.proprietaireMandantNom) {
            bienNom = `Appartement mandat (${saisieExpress.proprietaireMandantNom})`;
          }

          const montantLoyer = Number(
            saisieExpress.loyerActuel ||
            saisieExpress.loyerSouhaite ||
            saisieExpress.loyerActuelMandat ||
            150000
          );

          const bienStatut: "loué" | "vacant" = (isTrouverLocataires && !saisieExpress.locataireEnPlaceNom)
            ? "vacant"
            : "loué";

          const locataireNom = saisieExpress.locataireEnPlaceNom || (bienStatut === "loué" ? "Locataire principal" : undefined);

          // Insertion du premier bien dans la table `biens`
          const { data: insertedBien, error: bienError } = await supabase
            .from("biens")
            .insert({
              nom: bienNom,
              adresse: "Haie Vive, Zone Résidentielle",
              ville: "Cotonou",
              type: bienType,
              loyer_mensuel: montantLoyer,
              charges: 0,
              statut: bienStatut,
              locataire_nom: locataireNom || null,
              photos: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"],
              photo_principale: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"],
              archive: false,
              organization_id: activeOrgId,
            })
            .select()
            .maybeSingle();

          if (bienError) {
            console.warn("Notice insertion bien onboarding:", bienError.message);
          }

          // Cache local immédiat du bien créé pour un affichage instantané sur le dashboard
          const cachedBien = {
            id: insertedBien?.id || "bien_" + Date.now().toString(36),
            nom: bienNom,
            adresse: "Haie Vive, Zone Résidentielle",
            ville: "Cotonou",
            type: bienType,
            loyer_mensuel: montantLoyer,
            charges: 0,
            statut: bienStatut,
            locataire_nom: locataireNom,
            photos: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"],
            photo_principale: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"],
            archive: false,
            created_at: new Date().toISOString(),
          };
          const existingBiens = JSON.parse(localStorage.getItem("lokka_biens_cache") || "[]");
          localStorage.setItem("lokka_biens_cache", JSON.stringify([cachedBien, ...existingBiens]));

          // Si le bien est loué, générer une première échéance de loyer
          if (bienStatut === "loué" && locataireNom) {
            const echeance = saisieExpress.prochaineEcheance || new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0];
            const paymentTx = {
              id: "tx_" + Date.now().toString(36),
              bien_nom: bienNom,
              locataire_nom: locataireNom,
              montant: montantLoyer,
              methode: (state.profil.moyenReception === "virement" ? "Virement" : "MTN MoMo") as any,
              statut: "en_attente" as const,
              echeance,
            };

            try {
              await supabase.from("loyers_transactions").insert(paymentTx);
            } catch (_) {}

            const existingLoyers = JSON.parse(localStorage.getItem("lokka_loyers_cache") || "[]");
            localStorage.setItem("lokka_loyers_cache", JSON.stringify([paymentTx, ...existingLoyers]));
          }

          // Sauvegarder dans le localStorage pour l'UX client
          localStorage.setItem("lokka_onboarding_objectifs", JSON.stringify(state.objectifs));
          localStorage.setItem("lokka_dev_role", isAgency ? "Agence" : "Propriétaire Bailleur");
          localStorage.setItem("lokka_dev_plan", isAgency ? "agence" : "pro");
        }
      }
    } catch (err) {
      console.warn("Supabase onboarding sync notice:", err);
    } finally {
      // 4. Nettoyage du brouillon après finalisation réussie
      try {
        localStorage.removeItem(ONBOARDING_DRAFT_KEY);
      } catch (_) {}
    }

    setTimeout(() => {
      router.push("/dashboard");
    }, 600);
  };

  // Animation variants inspired by 21st.dev multistep pattern
  const variants = {
    enter: (dir: "forward" | "back") => ({
      x: dir === "forward" ? 32 : -32,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: "forward" | "back") => ({
      x: dir === "forward" ? -32 : 32,
      opacity: 0,
    }),
  };

  const progressPct = Math.round(((currentStep) / (STEPS.length - 1)) * 100);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center py-8 px-4 bg-background">
      <div className="w-full max-w-lg flex flex-col gap-8">

        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-border">
          <Logo size="sm" variant="dark" />
          <span className="text-[12px] font-bold text-muted-foreground">
            Configuration de votre espace
          </span>
        </div>

        {/* Stepper — style 21st.dev with animated progress bar */}
        <div className="space-y-4">
          {/* Progress bar */}
          <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-primary rounded-full"
              initial={false}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
          </div>

          {/* Step dots */}
          <div className="flex items-start justify-between px-0">
            {STEPS.map((s, index) => {
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;
              const Icon = s.icon;

              return (
                <div key={index} className="flex flex-col items-center gap-1.5 flex-1">
                  <motion.div
                    className={[
                      "h-9 w-9 rounded-full flex items-center justify-center transition-all border-2",
                      isCompleted
                        ? "bg-primary border-primary text-primary-foreground"
                        : isCurrent
                        ? "border-primary bg-card text-primary shadow-[0_0_0_4px_hsl(var(--primary)/0.12)]"
                        : "border-border bg-card text-muted-foreground",
                    ].join(" ")}
                    animate={{
                      scale: isCurrent ? 1.08 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    {isCompleted ? (
                      <CheckIcon className="h-4 w-4 stroke-[2.5]" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </motion.div>
                  <span
                    className={[
                      "text-[11px] font-bold hidden sm:block transition-colors",
                      isCurrent
                        ? "text-foreground"
                        : isCompleted
                        ? "text-muted-foreground"
                        : "text-muted-foreground/60",
                    ].join(" ")}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: "easeInOut" }}
            >
              {currentStep === 0 && (
                <StepProfil
                  data={state.profil}
                  onChange={(profil) => setState({ ...state, profil })}
                />
              )}
              {currentStep === 1 && (
                <StepObjectifs
                  selected={state.objectifs}
                  onChange={(objectifs) => setState({ ...state, objectifs })}
                />
              )}
              {currentStep === 2 && (
                <StepSaisieExpress
                  profileType={state.profil.profileType}
                  objectifs={state.objectifs}
                  data={state.saisieExpress}
                  onChange={(saisieExpress) =>
                    setState({ ...state, saisieExpress })
                  }
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          {currentStep > 0 ? (
            <Button
              type="button"
              variant="ghost"
              onClick={handleBack}
              disabled={isSubmitting}
            >
              Retour
            </Button>
          ) : (
            <div />
          )}

          <Button
            type="button"
            disabled={!isStepValid() || isSubmitting}
            onClick={currentStep === 2 ? handleSubmit : handleNext}
            size="lg"
            className="px-8"
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Configuration…
              </>
            ) : currentStep === 2 ? (
              <>
                Terminer la configuration
                <CheckCircleIcon className="w-4 h-4 ml-2" />
              </>
            ) : (
              "Continuer"
            )}
          </Button>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-muted-foreground">
          Étape {currentStep + 1} sur {STEPS.length} · Vous pourrez modifier ces informations plus tard
        </p>
      </div>
    </div>
  );
}
