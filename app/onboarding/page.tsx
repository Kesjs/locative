"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/ui/Logo";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import {
  CheckCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

import { type OnboardingState, type ProfilStepData } from "./_types";
import { StepProfil } from "./_components/StepProfil";
import { StepObjectifs } from "./_components/StepObjectifs";
import { StepSaisieExpress } from "./_components/StepSaisieExpress";
import { ModernStepper } from "./_components/ModernStepper";

const ONBOARDING_DRAFT_KEY = "lokka_onboarding_draft";

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<0 | 1 | 2>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [isHydrated, setIsHydrated] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [state, setState] = useState<OnboardingState>({
    profil: {
      profileType: "bailleur",
      nom: "",
      moyenReception: "mobile_money",
      mobileProvider: "mtn",
      zoneGeo: "benin",
    },
    objectifs: ["digitaliser"],
    saisieExpress: {},
  });

  // 1. Restauration de l'état (brouillon sauvé ou profil Google)
  useEffect(() => {
    try {
      const draft = localStorage.getItem(ONBOARDING_DRAFT_KEY);
      if (draft) {
        const parsed = JSON.parse(draft);
        if (parsed.state) setState(parsed.state);
        if (typeof parsed.currentStep === "number" && [0, 1, 2].includes(parsed.currentStep)) {
          setCurrentStep(parsed.currentStep as 0 | 1 | 2);
        }
      } else {
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

    // Vérification du statut d'onboarding et pré-remplissage avec le compte Supabase / Google
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      supabase.auth.getUser().then(async ({ data: { user } }) => {
        if (user) {
          // Si le profil a déjà validé son onboarding, rediriger directement vers le dashboard
          const { data: dbProfile } = await supabase
            .from("profiles")
            .select("full_name, onboarding_completed, role")
            .eq("id", user.id)
            .maybeSingle();

          if (dbProfile?.onboarding_completed) {
            router.replace("/dashboard");
            return;
          }

          const prefilledName =
            dbProfile?.full_name ||
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            (user.email ? user.email.split("@")[0] : "");

          setState((prev) => {
            if (!prev.profil.nom && prefilledName) {
              return {
                ...prev,
                profil: {
                  ...prev.profil,
                  nom: prefilledName,
                },
              };
            }
            return prev;
          });
        }
      });
    }

    setIsHydrated(true);
  }, [router]);

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
    if (currentStep === 0) {
      if (!state.profil.nom.trim()) {
        setErrors({ nom: "Veuillez renseigner votre nom ou raison sociale." });
        return;
      }
      setErrors({});
    }
    if (currentStep === 1) {
      if (state.objectifs.length === 0) {
        toast.error("Veuillez sélectionner au moins un objectif.");
        return;
      }
      setErrors({});
    }
    if (currentStep < 2) setCurrentStep((prev) => (prev + 1) as 0 | 1 | 2);
  };

  const handleBack = () => {
    setDirection("back");
    setErrors({});
    if (currentStep > 0) setCurrentStep((prev) => (prev - 1) as 0 | 1 | 2);
  };

  const isStepValid = () => {
    if (currentStep === 0) return state.profil.nom.trim().length > 0;
    if (currentStep === 1) return state.objectifs.length > 0;
    return true;
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    const isAgency = state.profil.profileType === "agence";
    const { saisieExpress } = state;

    if (!isAgency) {
      if (!saisieExpress.nomPatrimoine?.trim()) {
        errs.nomPatrimoine = "Le nom de l'ensemble ou résidence est obligatoire.";
      }
      if (!saisieExpress.typeLot?.trim()) {
        errs.typeLot = "La désignation du premier lot est obligatoire.";
      }
      if (!saisieExpress.loyerMensuel || Number(saisieExpress.loyerMensuel) <= 0) {
        errs.loyerMensuel = "Veuillez indiquer un montant de loyer valide.";
      }
    } else {
      if (!saisieExpress.proprietaireMandantNom?.trim()) {
        errs.proprietaireMandantNom = "Le nom du propriétaire mandant est obligatoire.";
      }
      if (!saisieExpress.nomPatrimoine?.trim()) {
        errs.nomPatrimoine = "L'immeuble ou résidence sous mandat est obligatoire.";
      }
      if (!saisieExpress.typeLot?.trim()) {
        errs.typeLot = "La désignation du lot sous mandat est obligatoire.";
      }
      if (!saisieExpress.loyerActuelMandat || Number(saisieExpress.loyerActuelMandat) <= 0) {
        errs.loyerActuelMandat = "Veuillez indiquer le loyer mensuel du lot.";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateStep2()) {
      toast.error("Veuillez renseigner tous les champs obligatoires.");
      return;
    }

    setIsSubmitting(true);
    const isAgency = state.profil.profileType === "agence";
    const canonicalRole = isAgency ? "agency_admin" : "owner";

    // Si profil diaspora, initialiser la devise locale sur EUR
    if (state.profil.zoneGeo === "diaspora") {
      try {
        localStorage.setItem("lokka_currency", "eur");
      } catch (_) {}
    }

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
            p_portfolio_size: isAgency ? "6-20" : "1-5",
            p_role: canonicalRole,
          });

          if (rpcError) {
            console.warn("RPC complete_onboarding_organization notice:", rpcError.message);
            // Si l'utilisateur possède déjà une organisation, récupérer son ID existant
            const { data: profileCheck } = await supabase
              .from("profiles")
              .select("organization_id")
              .eq("id", user.id)
              .maybeSingle();

            if (profileCheck?.organization_id) {
              activeOrgId = profileCheck.organization_id;
            }
          } else if (orgData) {
            activeOrgId = orgData;
          }

          // 2. Mettre à jour le profil avec le rôle canonique et onboarding_completed
          const { error: profileError } = await supabase
            .from("profiles")
            .update({
              full_name: state.profil.nom,
              role: canonicalRole,
              preferred_payment_channel: state.profil.moyenReception,
              onboarding_completed: true,
            })
            .eq("id", user.id);

          if (profileError) {
            console.error("Erreur profil onboarding:", profileError);
            toast.error("Erreur lors de la mise à jour de votre profil", {
              description: profileError.message,
            });
            setIsSubmitting(false);
            return;
          }

          // 3. ENREGISTREMENT RÉEL : PATRIMOINE & LOT
          const { saisieExpress } = state;
          const montantLoyer = isAgency
            ? Number(saisieExpress.loyerActuelMandat || 250000)
            : Number(saisieExpress.loyerMensuel || 250000);

          // Si Agence : enregistrement d'un mandat réel dans Supabase
          if (isAgency) {
            const mandantNom = saisieExpress.proprietaireMandantNom || "M. Mensah (Mandant)";
            const soldeMandant = Math.round(montantLoyer * 0.9); // 90% reversés

            const { error: mandatError } = await supabase
              .from("mandats")
              .insert({
                proprietaire: mandantNom,
                biens: 1,
                commission: "10%",
                commission_pct: 10,
                solde: soldeMandant,
                organization_id: activeOrgId,
                created_by: user.id,
              });

            if (mandatError) {
              console.warn("Notice insertion mandat onboarding:", mandatError.message);
            }
          }

          // Hiérarchie : Patrimoine -> Lot
          const nomPatrimoine = saisieExpress.nomPatrimoine?.trim() || (isAgency ? "Résidence Marina" : "Résidence Principale");
          const typeLot = saisieExpress.typeLot?.trim() || "Appartement 3 pièces";
          const bienNom = `${nomPatrimoine} (${typeLot})`;

          const bienStatut: "loué" | "vacant" = isAgency
            ? "loué"
            : (saisieExpress.statutOccupation === "vacant" ? "vacant" : "loué");

          const locataireNom = isAgency
            ? "Locataire en place"
            : (bienStatut === "loué" ? (saisieExpress.locataireEnPlaceNom?.trim() || "Locataire en place") : null);

          const isDiaspora = state.profil.zoneGeo === "diaspora";
          const bienVille = isDiaspora ? (state.profil.paysDiaspora || "International") : "Cotonou";
          const bienAdresse = `${nomPatrimoine}, ${bienVille}`;

          // Insertion du lot dans la table `biens`
          const { data: insertedBien, error: bienError } = await supabase
            .from("biens")
            .insert({
              nom: bienNom,
              adresse: bienAdresse,
              ville: bienVille,
              type: typeLot,
              loyer_mensuel: montantLoyer,
              charges: 0,
              statut: bienStatut,
              locataire_nom: locataireNom,
              photos: [],
              photo_principale: null,
              archive: false,
              organization_id: activeOrgId,
            })
            .select()
            .maybeSingle();

          if (bienError) {
            console.error("Erreur insertion bien onboarding:", bienError);
            toast.error("Erreur lors de la configuration de votre premier lot", {
              description: bienError.message || "Veuillez vérifier vos données et réessayer.",
            });
            setIsSubmitting(false);
            return;
          }

          // Si le bien est loué, générer une première échéance de loyer réelle
          if (insertedBien && bienStatut === "loué") {
            const echeance = saisieExpress.prochaineEcheance || new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0];
            const paymentTx = {
              bien_nom: bienNom,
              locataire_nom: locataireNom || "Locataire en place",
              montant: montantLoyer,
              methode: (state.profil.moyenReception === "banque" ? "Virement" : "MTN MoMo") as any,
              statut: "en_attente" as const,
              echeance,
              organization_id: activeOrgId,
            };

            const { error: txError } = await supabase
              .from("loyers_transactions")
              .insert(paymentTx);

            if (txError) {
              console.warn("Notice insertion loyer onboarding:", txError.message);
            }
          }

          // Mettre à jour l'état local du profil
          localStorage.setItem("lokka_onboarding_objectifs", JSON.stringify(state.objectifs));
          localStorage.setItem("lokka_dev_role", isAgency ? "Agence" : "Propriétaire Bailleur");
          localStorage.setItem("lokka_dev_plan", isAgency ? "agence" : "pro");
          localStorage.setItem(
            "lokka_user_profile",
            JSON.stringify({
              name: state.profil.nom,
              role: canonicalRole,
              accountType: isAgency ? "agence" : "bailleur",
            })
          );
        }
      }

      // Nettoyage du brouillon après finalisation réussie
      try {
        localStorage.removeItem(ONBOARDING_DRAFT_KEY);
      } catch (_) {}

      toast.success(
        isAgency
          ? "Cabinet configuré avec succès ! Bienvenue sur votre cockpit Agence."
          : "Espace configuré avec succès ! Bienvenue sur votre tableau de bord."
      );

      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } catch (err: any) {
      console.error("Supabase onboarding critical error:", err);
      toast.error("Une erreur inattendue est survenue", {
        description: err?.message || "Impossible de finaliser la configuration.",
      });
      setIsSubmitting(false);
    }
  };

  const variants = {
    enter: (dir: "forward" | "back") => ({
      x: dir === "forward" ? 28 : -28,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: "forward" | "back") => ({
      x: dir === "forward" ? -28 : 28,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center py-8 sm:py-12 px-4 sm:px-6 bg-[#F8FAF9] bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(16,185,129,0.07),transparent_70%)] text-slate-900 transition-colors">
      <div className="w-full max-w-xl flex flex-col gap-6">

        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <Logo size="sm" />
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-[12px] font-semibold text-slate-500 hover:text-slate-900 transition-colors hidden sm:inline"
            >
              Accéder au dashboard &rarr;
            </Link>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11.5px] font-bold">
              <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-600" />
              <span>Loi n° 2022-30 · Bénin</span>
            </div>
          </div>
        </div>

        {/* Stepper moderne */}
        <ModernStepper currentStep={currentStep} />

        {/* Card Conteneur Principal avec soumission au clavier */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (currentStep === 2) {
              handleSubmit();
            } else {
              handleNext();
            }
          }}
          className="bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-3xl p-6 sm:p-9 shadow-[0_2px_8px_rgba(0,0,0,0.03),0_16px_36px_-6px_rgba(0,0,0,0.04)]"
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {currentStep === 0 && (
                <StepProfil
                  data={state.profil}
                  onChange={(profil) => {
                    setState({ ...state, profil });
                    if (errors.nom) setErrors({});
                  }}
                  error={errors.nom}
                />
              )}
              {currentStep === 1 && (
                <StepObjectifs
                  profileType={state.profil.profileType}
                  selected={state.objectifs}
                  onChange={(objectifs) => setState({ ...state, objectifs })}
                />
              )}
              {currentStep === 2 && (
                <StepSaisieExpress
                  profileType={state.profil.profileType}
                  objectifs={state.objectifs}
                  data={state.saisieExpress}
                  onChange={(saisieExpress) => {
                    setState({ ...state, saisieExpress });
                    setErrors({});
                  }}
                  errors={errors}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </form>

        {/* Navigation Actions */}
        <div className="flex items-center justify-between gap-3 pt-2">
          {currentStep > 0 ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={isSubmitting}
              className="h-11 px-4 sm:px-5 rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[13px] font-bold cursor-pointer shrink-0"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-1 sm:mr-2" />
              <span>Précédent</span>
            </Button>
          ) : (
            <div />
          )}

          <Button
            type="button"
            disabled={!isStepValid() || isSubmitting}
            onClick={currentStep === 2 ? handleSubmit : handleNext}
            className="h-11 px-5 sm:px-7 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[13px] sm:text-[13.5px] transition-all shadow-xs cursor-pointer truncate disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Configuration en cours…
              </>
            ) : currentStep === 2 ? (
              <>
                <span>Accéder au dashboard</span>
                <CheckCircleIcon className="w-4 h-4 ml-1.5 sm:ml-2" />
              </>
            ) : (
              <>
                <span>Continuer</span>
                <ArrowRightIcon className="w-4 h-4 ml-1.5 sm:ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Footer */}
        <p className="text-center text-[11.5px] text-slate-500">
          Configuration certifiée conforme à la réglementation béninoise des baux d'habitation.
        </p>
      </div>
    </div>
  );
}
