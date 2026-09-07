"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  UserPlusIcon,
  BuildingOffice2Icon,
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { useBiens, plafondCaution } from "@/lib/hooks/useBiens";
import { useAddTenantWithLease } from "@/lib/hooks/useLocataires";
import { Building2, Sparkles, KeyRound, Mail, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Locataire", "Affectation Logement", "Conditions du bail", "Invitation & Accès"] as const;
type StepIndex = 0 | 1 | 2 | 3;

const ID_CARD_TYPES = ["CIP (Bénin)", "CNI", "Passeport", "Permis de conduire", "Carte consulaire", "Autre"];

interface FormState {
  full_name: string;
  phone_number: string;
  whatsapp_number: string;
  email: string;
  profession: string;
  id_card_type: string;
  id_card_number: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  bien_id: string; // "" signifie "Candidat sans logement immédiat"
  rent_amount: string;
  charges_amount: string;
  deposit_months: string;
  due_day: string;
  start_date: string;
  end_date: string;
  lease_contract_url: string;
  temporary_password: string;
}

const EMPTY_FORM: FormState = {
  full_name: "",
  phone_number: "",
  whatsapp_number: "",
  email: "",
  profession: "",
  id_card_type: "CIP (Bénin)",
  id_card_number: "",
  emergency_contact_name: "",
  emergency_contact_phone: "",
  bien_id: "",
  rent_amount: "",
  charges_amount: "",
  deposit_months: "3",
  due_day: "5",
  start_date: new Date().toISOString().split("T")[0],
  end_date: "",
  lease_contract_url: "",
  temporary_password: "",
};

function generateTempPassword(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return "Lokka#" + num;
}

export function AddLocataireModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { data: biens = [] } = useBiens();
  const { mutateAsync: addTenantWithLease, isPending } = useAddTenantWithLease();

  const [step, setStep] = useState<StepIndex>(0);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [isCandidatSansLogement, setIsCandidatSansLogement] = useState(false);
  const [selectedPatrimoineFilter, setSelectedPatrimoineFilter] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const biensVacants = useMemo(() => biens.filter((b) => b.statut === "vacant"), [biens]);
  const bienSelectionne = useMemo(() => biens.find((b) => b.id === form.bien_id), [biens, form.bien_id]);

  // Groupement des biens vacants par Patrimoine parent
  const patrimoinesVacantsMap = useMemo(() => {
    const map = new Map<string, typeof biensVacants>();
    biensVacants.forEach((b) => {
      const p = b.nom.includes(" - ")
        ? b.nom.split(" - ")[0].trim()
        : b.nom.includes(" (")
        ? b.nom.split(" (")[0].trim()
        : "Autre patrimoine";
      if (!map.has(p)) map.set(p, []);
      map.get(p)!.push(b);
    });
    return map;
  }, [biensVacants]);

  const patrimoinesList = useMemo(() => Array.from(patrimoinesVacantsMap.keys()).sort(), [patrimoinesVacantsMap]);

  useEffect(() => {
    if (isOpen) {
      setForm({ ...EMPTY_FORM, temporary_password: generateTempPassword() });
      setIsCandidatSansLogement(false);
      setSelectedPatrimoineFilter(null);
      setStep(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (bienSelectionne && !form.rent_amount) {
      setForm((f) => ({
        ...f,
        rent_amount: String(bienSelectionne.loyer_mensuel || ""),
        charges_amount: String(bienSelectionne.charges || ""),
      }));
    }
  }, [form.bien_id, bienSelectionne]);

  if (!isOpen) return null;

  const update = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }));

  const loyerNum = Number(form.rent_amount) || (bienSelectionne?.loyer_mensuel || 0);
  const plafond = plafondCaution(loyerNum);
  const depositAmount = (plafond * (Number(form.deposit_months) || 0)) / 3;
  const cautionDepasse = Number(form.deposit_months) > 3;

  const canAdvance = (): boolean => {
    if (step === 0) return form.full_name.trim() !== "" && form.phone_number.trim() !== "";
    if (step === 1) return isCandidatSansLogement || form.bien_id !== "";
    if (step === 2) {
      if (isCandidatSansLogement) return true;
      return form.rent_amount.trim() !== "" && form.due_day.trim() !== "" && !cautionDepasse;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && isCandidatSansLogement) {
      setStep(3);
    } else {
      setStep((s) => (s + 1) as StepIndex);
    }
  };

  const handlePrev = () => {
    if (step === 3 && isCandidatSansLogement) {
      setStep(1);
    } else {
      setStep((s) => (s - 1) as StepIndex);
    }
  };

  const handleSubmit = async () => {
    try {
      // 1. Enregistrement du locataire et du bail dans Supabase
      await addTenantWithLease({
        tenant: {
          full_name: form.full_name.trim(),
          phone_number: form.phone_number.trim(),
          whatsapp_number: form.whatsapp_number.trim() || null,
          email: form.email.trim() || null,
          profession: form.profession.trim() || null,
          id_card_type: form.id_card_type || null,
          id_card_number: form.id_card_number.trim() || null,
          emergency_contact_name: form.emergency_contact_name.trim() || null,
          emergency_contact_phone: form.emergency_contact_phone.trim() || null,
        },
        lease: !isCandidatSansLogement && form.bien_id
          ? {
              bien_id: form.bien_id,
              start_date: form.start_date,
              end_date: form.end_date || null,
              rent_amount: Number(form.rent_amount) || 0,
              charges_amount: Number(form.charges_amount) || 0,
              deposit_months: Number(form.deposit_months) || 0,
              deposit_amount: depositAmount,
              due_day: Number(form.due_day) || 5,
              lease_contract_url: form.lease_contract_url.trim() || null,
            }
          : undefined,
      });

      // 2. Envoi automatique de l'email d'invitation avec identifiants et mot de passe temporaire
      if (form.email && form.email.includes("@")) {
        try {
          await fetch("/api/send-tenant-invitation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tenantName: form.full_name.trim(),
              tenantEmail: form.email.trim(),
              tenantPhone: form.phone_number.trim(),
              propertyTitle: bienSelectionne?.nom || "Votre logement Lokka",
              propertyAddress: (bienSelectionne?.adresse || "") + (bienSelectionne?.ville ? ", " + bienSelectionne.ville : ""),
              rentAmount: Number(form.rent_amount) || 0,
              depositMonths: Number(form.deposit_months) || 3,
              temporaryPassword: form.temporary_password,
            }),
          });
          toast.success("Invitation officielle envoyée par email au locataire avec ses identifiants !");
        } catch (invErr) {
          console.warn("Notice envoi invitation email:", invErr);
        }
      }

      toast.success(
        isCandidatSansLogement
          ? "Candidat enregistré avec succès (en attente d'attribution)"
          : 'Locataire et bail créés — le bien passe en "loué"'
      );
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Erreur lors de l'enregistrement du locataire");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-card rounded-t-2xl sm:rounded-2xl w-full sm:max-w-xl max-h-[92vh] sm:max-h-[88vh] flex flex-col shadow-2xl border border-border overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="text-[16px] font-bold text-card-foreground">Nouveau Locataire</h2>
            <p className="text-[11.5px] text-muted-foreground">
              {STEPS[step]} · Étape {step + 1} sur 4
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper horizontal */}
        <div className="flex items-center px-5 py-2.5 bg-muted/30 border-b border-border gap-1 overflow-x-auto shrink-0">
          {STEPS.map((label, idx) => (
            <div key={label} className="flex items-center gap-1 shrink-0">
              <div
                className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-[10.5px] font-bold transition-all",
                  idx < step
                    ? "bg-emerald-600 text-white"
                    : idx === step
                    ? "bg-primary text-primary-foreground ring-2 ring-primary/20"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {idx < step ? "✓" : idx + 1}
              </div>
              <span className={cn("text-[11px] font-semibold mr-2", idx === step ? "text-foreground" : "text-muted-foreground")}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Corps défilable */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="space-y-4"
            >
              {/* ÉTAPE 0 : IDENTITÉ */}
              {step === 0 && (
                <>
                  <Field label="Nom complet du locataire *">
                    <input
                      type="text"
                      required
                      value={form.full_name}
                      onChange={(e) => update({ full_name: e.target.value })}
                      placeholder="Ex. Koffi Mensah, Dr. Dossou..."
                      className="w-full border border-border rounded-lg px-3 py-2 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background"
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-2.5">
                    <Field label="Téléphone appel (MoMo) *">
                      <input
                        type="tel"
                        required
                        value={form.phone_number}
                        onChange={(e) => update({ phone_number: e.target.value })}
                        placeholder="+229 97 00 00 00"
                        className="w-full border border-border rounded-lg px-3 py-2 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background"
                      />
                    </Field>
                    <Field label="Numéro WhatsApp">
                      <input
                        type="tel"
                        value={form.whatsapp_number}
                        onChange={(e) => update({ whatsapp_number: e.target.value })}
                        placeholder="+229 97 12 34 56"
                        className="w-full border border-border rounded-lg px-3 py-2 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background"
                      />
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <Field label="Adresse Email (Obligatoire pour accès espace) *">
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => update({ email: e.target.value })}
                        placeholder="locataire@gmail.com"
                        className="w-full border border-border rounded-lg px-3 py-2 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background"
                      />
                    </Field>
                    <Field label="Profession">
                      <input
                        type="text"
                        value={form.profession}
                        onChange={(e) => update({ profession: e.target.value })}
                        placeholder="Ex. Comptable, Commerçant..."
                        className="w-full border border-border rounded-lg px-3 py-2 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background"
                      />
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <Field label="Type de pièce">
                      <select
                        value={form.id_card_type}
                        onChange={(e) => update({ id_card_type: e.target.value })}
                        className="w-full border border-border rounded-lg px-3 py-2 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background"
                      >
                        {ID_CARD_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Numéro de pièce (CIP/CNI)">
                      <input
                        type="text"
                        value={form.id_card_number}
                        onChange={(e) => update({ id_card_number: e.target.value })}
                        placeholder="Ex. 11982736450"
                        className="w-full border border-border rounded-lg px-3 py-2 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background font-mono"
                      />
                    </Field>
                  </div>
                </>
              )}

              {/* ÉTAPE 1 : LOGEMENT HIÉRARCHIQUE (Patrimoine -> Lot) */}
              {step === 1 && (
                <div className="space-y-3">
                  <p className="text-[12.5px] font-semibold text-foreground">
                    Sélectionnez le patrimoine et le lot vacant à lui attribuer :
                  </p>

                  {/* Option Candidat libre sans logement */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsCandidatSansLogement(true);
                      update({ bien_id: "" });
                    }}
                    className={cn(
                      "w-full text-left flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer",
                      isCandidatSansLogement
                        ? "border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/20"
                        : "border-border hover:bg-muted/40"
                    )}
                  >
                    <div className="w-10 h-10 rounded-lg bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0">
                      <UserPlusIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-card-foreground">
                        Candidat libre (Sans logement immédiat)
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Enregistre le profil en base sans créer de bail actif.
                      </p>
                    </div>
                  </button>

                  <div className="pt-1 space-y-2">
                    <p className="text-[11px] font-bold text-muted-foreground uppercase">
                      Ou choisir parmi les résidences & lots vacants :
                    </p>

                    {biensVacants.length === 0 ? (
                      <p className="text-[12px] text-muted-foreground text-center py-6 border border-dashed border-border rounded-xl">
                        Aucun lot vacant disponible actuellement. Vous pouvez enregistrer le locataire comme candidat ci-dessus.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {/* Filtre par Patrimoine */}
                        {patrimoinesList.length > 1 && (
                          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                            <button
                              type="button"
                              onClick={() => setSelectedPatrimoineFilter(null)}
                              className={cn(
                                "px-2.5 py-1 rounded-lg text-[11px] font-bold border shrink-0 transition-all cursor-pointer",
                                selectedPatrimoineFilter === null
                                  ? "bg-emerald-600 text-white border-emerald-600"
                                  : "bg-card text-muted-foreground border-border hover:bg-muted"
                              )}
                            >
                              Tous ({biensVacants.length})
                            </button>
                            {patrimoinesList.map((p) => {
                              const cnt = patrimoinesVacantsMap.get(p)?.length || 0;
                              const isSel = selectedPatrimoineFilter === p;
                              return (
                                <button
                                  key={p}
                                  type="button"
                                  onClick={() => setSelectedPatrimoineFilter(isSel ? null : p)}
                                  className={cn(
                                    "px-2.5 py-1 rounded-lg text-[11px] font-bold border shrink-0 transition-all cursor-pointer flex items-center gap-1",
                                    isSel
                                      ? "bg-emerald-600 text-white border-emerald-600"
                                      : "bg-card text-muted-foreground border-border hover:bg-muted"
                                  )}
                                >
                                  <Building2 className="w-3 h-3" />
                                  <span>{p}</span>
                                  <span className={cn("text-[9.5px] px-1 rounded-full", isSel ? "bg-white/20" : "bg-muted")}>
                                    {cnt}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* Liste des Lots vacants filtrés */}
                        <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                          {biensVacants
                            .filter((b) => {
                              if (!selectedPatrimoineFilter) return true;
                              return b.nom.startsWith(selectedPatrimoineFilter);
                            })
                            .map((b) => {
                              const isSelected = !isCandidatSansLogement && form.bien_id === b.id;
                              return (
                                <button
                                  key={b.id}
                                  type="button"
                                  onClick={() => {
                                    setIsCandidatSansLogement(false);
                                    update({ bien_id: b.id });
                                  }}
                                  className={cn(
                                    "w-full text-left flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer",
                                    isSelected
                                      ? "border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20 text-slate-900"
                                      : "border-border hover:bg-muted/40 text-card-foreground"
                                  )}
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                      <KeyRound className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-[12.5px] font-bold truncate">{b.nom}</p>
                                      <p className="text-[11px] text-muted-foreground truncate">
                                        {b.ville} {b.quartier ? "· " + b.quartier : ""}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <span className="text-[12px] font-bold font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                      {b.loyer_mensuel.toLocaleString("fr-FR")} F
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ÉTAPE 2 : CONDITIONS DU BAIL */}
              {step === 2 && !isCandidatSansLogement && (
                <>
                  <div className="grid grid-cols-2 gap-2.5">
                    <Field label="Loyer mensuel convenu (FCFA) *">
                      <input
                        type="number"
                        min={0}
                        value={form.rent_amount}
                        onChange={(e) => update({ rent_amount: e.target.value })}
                        className="w-full border border-border rounded-lg px-3 py-2 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background font-semibold"
                      />
                    </Field>
                    <Field label="Charges mensuelles (FCFA)">
                      <input
                        type="number"
                        min={0}
                        value={form.charges_amount}
                        onChange={(e) => update({ charges_amount: e.target.value })}
                        className="w-full border border-border rounded-lg px-3 py-2 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background"
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <Field label="Nombre de mois de caution">
                      <input
                        type="number"
                        min={0}
                        max={3}
                        value={form.deposit_months}
                        onChange={(e) => update({ deposit_months: e.target.value })}
                        className="w-full border border-border rounded-lg px-3 py-2 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background"
                      />
                    </Field>
                    <Field label="Jour d'échéance mensuelle (1-28)">
                      <input
                        type="number"
                        min={1}
                        max={28}
                        value={form.due_day}
                        onChange={(e) => update({ due_day: e.target.value })}
                        className="w-full border border-border rounded-lg px-3 py-2 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background"
                      />
                    </Field>
                  </div>

                  <div
                    className={cn(
                      "rounded-xl p-2.5 text-[11.5px] flex items-start gap-1.5",
                      cautionDepasse
                        ? "bg-destructive/10 text-destructive border border-destructive/20 font-semibold"
                        : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    )}
                  >
                    {cautionDepasse ? (
                      <ExclamationTriangleIcon className="w-4 h-4 shrink-0 mt-0.5" />
                    ) : (
                      <CheckIcon className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                    )}
                    <span>
                      Caution légale calculée : <strong>{depositAmount.toLocaleString("fr-FR")} FCFA</strong> (Plafond Loi 2022-30 : {plafond.toLocaleString("fr-FR")} FCFA)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <Field label="Date de prise d'effet du bail *">
                      <input
                        type="date"
                        value={form.start_date}
                        onChange={(e) => update({ start_date: e.target.value })}
                        className="w-full border border-border rounded-lg px-3 py-2 text-[12px] outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background"
                      />
                    </Field>
                    <Field label="Date de fin (Optionnel)">
                      <input
                        type="date"
                        value={form.end_date}
                        onChange={(e) => update({ end_date: e.target.value })}
                        className="w-full border border-border rounded-lg px-3 py-2 text-[12px] outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background"
                      />
                    </Field>
                  </div>
                </>
              )}

              {/* ÉTAPE 3 : APERÇU DU MAIL & IDENTIFIANTS DU LOCATAIRE */}
              {step === 3 && (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-[13.5px] font-bold text-slate-900">Aperçu du Courriel d'Invitation</h3>
                      <p className="text-[11.5px] text-slate-500">
                        Ce message sera automatiquement envoyé à l'adresse du locataire.
                      </p>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Resend Certifié
                    </span>
                  </div>

                  {/* CARTE DE PRÉVISUALISATION DIRECTE DU MAIL */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3 text-slate-800 text-[12.5px]">
                    <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold text-[11px] flex items-center justify-center">
                          L
                        </div>
                        <span className="font-extrabold text-[13px] text-slate-900">Lokka</span>
                      </div>
                      <span className="text-[10.5px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Loi n° 2022-30 · Bénin
                      </span>
                    </div>

                    <div>
                      <p className="font-bold text-slate-900">Bonjour {form.full_name || "Locataire"},</p>
                      <p className="text-slate-600 text-[12px] mt-0.5">
                        Votre bailleur vous a activé un accès sécurisé à votre Espace Locataire pour le logement :
                      </p>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1 text-[11.5px]">
                      <p className="font-bold text-slate-900">{bienSelectionne?.nom || "Logement attribué"}</p>
                      <p className="text-slate-500">📍 {bienSelectionne?.adresse || "Cotonou, Bénin"}</p>
                      <div className="pt-1 border-t border-slate-200/60 flex items-center justify-between">
                        <span>Loyer mensuel : <strong>{Number(form.rent_amount).toLocaleString("fr-FR")} FCFA</strong></span>
                        <span>Caution : <strong>{depositAmount.toLocaleString("fr-FR")} FCFA</strong></span>
                      </div>
                    </div>

                    {/* Bloc Identifiants */}
                    <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200/90 space-y-1.5">
                      <p className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1">
                        <LockClosedIcon className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Identifiants Personnels de Connexion</span>
                      </p>
                      <div className="text-[12px] space-y-1 text-slate-800">
                        <p>• <strong>Identifiant :</strong> <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-emerald-200 text-slate-900">{form.email || "Email non renseigné"}</code></p>
                        <div className="flex items-center gap-2">
                          <span>• <strong>Mot de passe temporaire :</strong></span>
                          <input
                            type={showPassword ? "text" : "password"}
                            value={form.temporary_password}
                            onChange={(e) => update({ temporary_password: e.target.value })}
                            className="font-mono bg-white px-2 py-0.5 rounded border border-emerald-300 font-bold text-emerald-800 text-[12px] w-28 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="p-1 text-slate-400 hover:text-slate-700"
                          >
                            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                      <p className="text-[10.5px] text-emerald-800 pt-1 border-t border-emerald-200/60">
                        ⚠️ <em>Consigne : Le locataire sera invité à personnaliser ce mot de passe dès sa 1ère connexion pour sa sécurité.</em>
                      </p>
                    </div>

                    {/* Bouton du mail */}
                    <div className="text-center pt-1">
                      <span className="inline-block px-4 py-2 bg-emerald-600 text-white font-bold text-[12px] rounded-xl shadow-xs">
                        Accéder à mon Espace Locataire &rarr;
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1">Lien direct vers https://codeo-ui.com/auth/locataire</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="px-5 py-3 border-t border-border flex items-center justify-between shrink-0 bg-muted/20">
          {step > 0 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="px-3.5 py-2 rounded-lg border border-border text-[12.5px] font-semibold hover:bg-muted transition cursor-pointer text-foreground"
            >
              Précédent
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              disabled={!canAdvance()}
              onClick={handleNext}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[12.5px] font-semibold disabled:opacity-50 transition cursor-pointer shadow-xs"
            >
              Suivant
            </button>
          ) : (
            <button
              type="button"
              disabled={isPending || (!form.email && !isCandidatSansLogement)}
              onClick={handleSubmit}
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[12.5px] font-bold disabled:opacity-50 transition cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <CheckIcon className="w-4 h-4 stroke-[2.5]" />
              <span>
                {isCandidatSansLogement
                  ? "Créer le dossier candidat"
                  : "Créer le bail & envoyer l'invitation"}
              </span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-[12px] font-semibold text-foreground block">{label}</label>
      {children}
    </div>
  );
}
