"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  UserPlusIcon,
  BuildingOffice2Icon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useBiens, plafondCaution } from "@/lib/hooks/useBiens";
import { useAddTenantWithLease } from "@/lib/hooks/useLocataires";
import { UserCheck, Sparkles } from "lucide-react";

const STEPS = ["Locataire", "Affectation Logement", "Conditions du bail", "Confirmation"] as const;
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
};

export function AddLocataireModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { data: biens = [] } = useBiens();
  const { mutateAsync: addTenantWithLease, isPending } = useAddTenantWithLease();

  const [step, setStep] = useState<StepIndex>(0);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [isCandidatSansLogement, setIsCandidatSansLogement] = useState(false);

  const biensVacants = biens.filter((b) => b.statut === "vacant");
  const bienSelectionne = biens.find((b) => b.id === form.bien_id);

  useEffect(() => {
    if (isOpen) {
      setForm(EMPTY_FORM);
      setIsCandidatSansLogement(false);
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
      // Si sans logement, aller directement à la confirmation
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

      toast.success(
        isCandidatSansLogement
          ? "Candidat enregistré avec succès (en attente d'attribution)"
          : 'Locataire et bail créés — le bien passe en "loué"'
      );
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'enregistrement du locataire");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-card rounded-t-2xl sm:rounded-2xl w-full sm:max-w-xl max-h-[92vh] sm:max-h-[85vh] flex flex-col shadow-2xl border border-border overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div>
            <h3 className="text-[16px] font-bold text-card-foreground">
              {isCandidatSansLogement ? "Nouveau dossier candidat" : "Nouveau locataire + bail"}
            </h3>
            <p className="text-[11.5px] text-muted-foreground mt-0.5">
              Enregistrez un locataire avec ou sans logement immédiat.
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-5 pt-3.5 shrink-0 bg-card">
          <div className="flex items-center gap-1.5 mb-1.5">
            {STEPS.map((label, i) => (
              <div key={label} className="flex-1">
                <div
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: i <= step ? "var(--brand-accent, #059669)" : "hsl(var(--muted))",
                  }}
                />
              </div>
            ))}
          </div>
          <p className="text-[10.5px] font-bold text-muted-foreground uppercase tracking-wider">
            Étape {step + 1}/{STEPS.length} — {STEPS[step]}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-3.5">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.15 }}
              className="space-y-3.5"
            >
              {/* ÉTAPE 0 : LOCATAIRE */}
              {step === 0 && (
                <>
                  <Field label="Nom complet du locataire *">
                    <input
                      autoFocus
                      type="text"
                      value={form.full_name}
                      onChange={(e) => update({ full_name: e.target.value })}
                      placeholder="Ex. Koudjo Dossou"
                      className="w-full border border-border rounded-lg px-3 py-2 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background"
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-2.5">
                    <Field label="Téléphone / Appel *">
                      <input
                        type="tel"
                        value={form.phone_number}
                        onChange={(e) => update({ phone_number: e.target.value })}
                        placeholder="+229 97 12 34 56"
                        className="w-full border border-border rounded-lg px-3 py-2 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background"
                      />
                    </Field>
                    <Field label="WhatsApp (si différent)">
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
                    <Field label="Email">
                      <input
                        type="email"
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

              {/* ÉTAPE 1 : LOGEMENT OU CANDIDAT */}
              {step === 1 && (
                <div className="space-y-2.5">
                  <p className="text-[12px] font-semibold text-foreground">
                    Sélectionnez un logement vacant ou enregistrez le locataire comme candidat :
                  </p>

                  {/* Option Candidat libre sans logement */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsCandidatSansLogement(true);
                      update({ bien_id: "" });
                    }}
                    className={`w-full text-left flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      isCandidatSansLogement
                        ? "border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/20"
                        : "border-border hover:bg-muted/40"
                    }`}
                  >
                    <div className="w-11 h-11 rounded-lg bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0">
                      <UserPlusIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-card-foreground">
                        Candidat libre (Sans logement immédiat)
                      </p>
                      <p className="text-[11.5px] text-muted-foreground">
                        Enregistre le profil dans la base en attente d&apos;attribution future.
                      </p>
                    </div>
                  </button>

                  <div className="pt-2">
                    <p className="text-[11px] font-bold text-muted-foreground uppercase mb-2">
                      Ou attribuer un logement vacant :
                    </p>

                    {biensVacants.length === 0 ? (
                      <p className="text-[12px] text-muted-foreground text-center py-5 border border-dashed border-border rounded-lg">
                        Aucun logement vacant disponible actuellement. Vous pouvez enregistrer le locataire comme candidat ci-dessus.
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {biensVacants.map((b) => {
                          const isSelected = !isCandidatSansLogement && form.bien_id === b.id;
                          return (
                            <button
                              key={b.id}
                              type="button"
                              onClick={() => {
                                setIsCandidatSansLogement(false);
                                update({ bien_id: b.id });
                              }}
                              className={`w-full text-left flex items-center gap-3 p-2.5 rounded-lg border transition-all cursor-pointer ${
                                isSelected
                                  ? "border-[var(--brand-accent)] bg-[var(--brand-accent)]/5 ring-1 ring-[var(--brand-accent)]/20"
                                  : "border-border hover:bg-muted/40"
                              }`}
                            >
                              <img
                                src={b.photo_principale || b.photos?.[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=100&q=80"}
                                alt=""
                                className="w-10 h-10 rounded-lg object-cover shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="text-[13px] font-bold text-card-foreground truncate">{b.nom}</p>
                                <p className="text-[11px] text-muted-foreground truncate">
                                  {b.quartier ? `${b.quartier}, ` : ""}{b.ville} — {b.loyer_mensuel.toLocaleString("fr-FR")} FCFA/mois
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ÉTAPE 2 : CONDITIONS DU BAIL (Seulement si logement attribué) */}
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
                    className={`rounded-lg p-2 text-[11.5px] flex items-start gap-1.5 ${
                      cautionDepasse
                        ? "bg-destructive/10 text-destructive border border-destructive/20 font-semibold"
                        : "bg-muted/40 text-muted-foreground"
                    }`}
                  >
                    {cautionDepasse ? (
                      <ExclamationTriangleIcon className="w-4 h-4 shrink-0 mt-0.5" />
                    ) : (
                      <CheckIcon className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                    )}
                    <span>
                      Caution totale : <strong>{depositAmount.toLocaleString("fr-FR")} FCFA</strong> (Plafond légal 3 mois : {plafond.toLocaleString("fr-FR")} FCFA)
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

              {/* ÉTAPE 3 : CONFIRMATION */}
              {step === 3 && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-2">
                    <p className="text-[13px] font-bold text-card-foreground">Récapitulatif du dossier :</p>
                    <p className="text-[12px] text-foreground flex items-center gap-1.5">
                      <UserIcon className="w-4 h-4 text-[var(--brand-accent)]" />
                      <strong>Locataire :</strong> {form.full_name} ({form.phone_number})
                    </p>
                    <p className="text-[12px] text-foreground flex items-center gap-1.5">
                      <BuildingOffice2Icon className="w-4 h-4 text-[var(--brand-accent)]" />
                      <strong>Logement :</strong>{" "}
                      {isCandidatSansLogement ? "Candidat (En attente d'affectation)" : bienSelectionne?.nom || "Non assigné"}
                    </p>
                    {!isCandidatSansLogement && (
                      <p className="text-[12px] text-foreground">
                        💰 <strong>Loyer :</strong> {Number(form.rent_amount).toLocaleString("fr-FR")} FCFA / mois (Caution : {depositAmount.toLocaleString("fr-FR")} FCFA)
                      </p>
                    )}
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
              className="px-4 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[12.5px] font-semibold hover:opacity-90 disabled:opacity-50 transition cursor-pointer shadow-xs"
            >
              Suivant
            </button>
          ) : (
            <button
              type="button"
              disabled={isPending}
              onClick={handleSubmit}
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[12.5px] font-semibold disabled:opacity-50 transition cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <CheckIcon className="w-4 h-4 stroke-[2.5]" />
              <span>{isCandidatSansLogement ? "Créer le dossier candidat" : "Créer le locataire et le bail"}</span>
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
