"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { XMarkIcon, CheckIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useBiens, plafondCaution } from "@/lib/hooks/useBiens";
import { useAddTenantWithLease } from "@/lib/hooks/useLocataires";

const STEPS = ["Locataire", "Logement", "Conditions du bail", "Confirmation"] as const;
type StepIndex = 0 | 1 | 2 | 3;

const ID_CARD_TYPES = ["CIP", "Passeport", "Permis de conduire", "Carte consulaire", "Autre"];

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
  bien_id: string;
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
  id_card_type: "CIP",
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

  const biensVacants = biens.filter((b) => b.statut === "vacant");
  const bienSelectionne = biens.find((b) => b.id === form.bien_id);

  useEffect(() => {
    if (isOpen) {
      setForm(EMPTY_FORM);
      setStep(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (bienSelectionne && !form.rent_amount) {
      setForm((f) => ({ ...f, rent_amount: String(bienSelectionne.loyer_mensuel || ""), charges_amount: String(bienSelectionne.charges || "") }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.bien_id]);

  if (!isOpen) return null;

  const update = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }));

  const plafond = plafondCaution(Number(form.rent_amount) || 0);
  const depositAmount = plafondCaution(Number(form.rent_amount) || 0) * (Number(form.deposit_months) || 0) / 3;
  const cautionDepasse = Number(form.deposit_months) > 3;

  const canAdvance = (): boolean => {
    if (step === 0) return form.full_name.trim() !== "" && form.phone_number.trim() !== "";
    if (step === 1) return form.bien_id !== "";
    if (step === 2) return form.rent_amount.trim() !== "" && form.due_day.trim() !== "";
    return true;
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
        lease: {
          bien_id: form.bien_id,
          start_date: form.start_date,
          end_date: form.end_date || null,
          rent_amount: Number(form.rent_amount) || 0,
          charges_amount: Number(form.charges_amount) || 0,
          deposit_months: Number(form.deposit_months) || 0,
          deposit_amount: depositAmount,
          due_day: Number(form.due_day) || 5,
          lease_contract_url: form.lease_contract_url.trim() || null,
        },
      });
      toast.success("Locataire et bail créés — le bien passe en \"loué\"");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la création du bail");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-card rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[92vh] sm:max-h-[85vh] flex flex-col shadow-modal"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <h3 className="text-[16px] font-bold text-card-foreground">Nouveau locataire + bail</h3>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
            <XMarkIcon className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="px-5 pt-4 shrink-0">
          <div className="flex items-center gap-1.5 mb-2">
            {STEPS.map((label, i) => (
              <div key={label} className="flex-1">
                <div className={`h-1.5 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-muted"}`} />
              </div>
            ))}
          </div>
          <p className="text-[11px] font-bold text-muted-foreground uppercase">
            Étape {step + 1}/{STEPS.length} — {STEPS[step]}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.15 }}
              className="space-y-4"
            >
              {step === 0 && (
                <>
                  <Field label="Nom complet">
                    <input
                      autoFocus
                      type="text"
                      value={form.full_name}
                      onChange={(e) => update({ full_name: e.target.value })}
                      placeholder="Ex. Koudjo Dossou"
                      className="w-full border border-border rounded-lg px-3 py-2.5 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background"
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Téléphone">
                      <input
                        type="tel"
                        value={form.phone_number}
                        onChange={(e) => update({ phone_number: e.target.value })}
                        placeholder="+229 97 12 34 56"
                        className="w-full border border-border rounded-lg px-3 py-2.5 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background"
                      />
                    </Field>
                    <Field label="WhatsApp (si différent)">
                      <input
                        type="tel"
                        value={form.whatsapp_number}
                        onChange={(e) => update({ whatsapp_number: e.target.value })}
                        placeholder="+229 97 12 34 56"
                        className="w-full border border-border rounded-lg px-3 py-2.5 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background"
                      />
                    </Field>
                  </div>
                  <Field label="Email">
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => update({ email: e.target.value })}
                      className="w-full border border-border rounded-lg px-3 py-2.5 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background"
                    />
                  </Field>
                  <Field label="Profession">
                    <input
                      type="text"
                      value={form.profession}
                      onChange={(e) => update({ profession: e.target.value })}
                      className="w-full border border-border rounded-lg px-3 py-2.5 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background"
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Type de pièce">
                      <select
                        value={form.id_card_type}
                        onChange={(e) => update({ id_card_type: e.target.value })}
                        className="w-full border border-border rounded-lg px-3 py-2.5 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background"
                      >
                        {ID_CARD_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Numéro de pièce">
                      <input
                        type="text"
                        value={form.id_card_number}
                        onChange={(e) => update({ id_card_number: e.target.value })}
                        className="w-full border border-border rounded-lg px-3 py-2.5 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background"
                      />
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Contact d'urgence — nom">
                      <input
                        type="text"
                        value={form.emergency_contact_name}
                        onChange={(e) => update({ emergency_contact_name: e.target.value })}
                        className="w-full border border-border rounded-lg px-3 py-2.5 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background"
                      />
                    </Field>
                    <Field label="Contact d'urgence — tél">
                      <input
                        type="tel"
                        value={form.emergency_contact_phone}
                        onChange={(e) => update({ emergency_contact_phone: e.target.value })}
                        className="w-full border border-border rounded-lg px-3 py-2.5 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background"
                      />
                    </Field>
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  {biensVacants.length === 0 ? (
                    <p className="text-[13px] text-muted-foreground text-center py-6 border border-dashed border-border rounded-lg">
                      Aucun bien vacant disponible. Ajoutez d'abord un bien depuis "Mon Patrimoine".
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {biensVacants.map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => update({ bien_id: b.id })}
                          className={`w-full text-left flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                            form.bien_id === b.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40"
                          }`}
                        >
                          <img
                            src={b.photo_principale || b.photos?.[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=100&q=80"}
                            alt=""
                            className="w-11 h-11 rounded-lg object-cover shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-[13px] font-bold text-card-foreground truncate">{b.nom}</p>
                            <p className="text-[11.5px] text-muted-foreground truncate">{b.ville} — {b.loyer_mensuel.toLocaleString("fr-FR")} FCFA/mois</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}

              {step === 2 && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Loyer mensuel (FCFA)">
                      <input
                        type="number"
                        min={0}
                        value={form.rent_amount}
                        onChange={(e) => update({ rent_amount: e.target.value })}
                        className="w-full border border-border rounded-lg px-3 py-2.5 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background"
                      />
                    </Field>
                    <Field label="Charges (FCFA)">
                      <input
                        type="number"
                        min={0}
                        value={form.charges_amount}
                        onChange={(e) => update({ charges_amount: e.target.value })}
                        className="w-full border border-border rounded-lg px-3 py-2.5 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background"
                      />
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Caution (mois de loyer)">
                      <input
                        type="number"
                        min={0}
                        max={3}
                        value={form.deposit_months}
                        onChange={(e) => update({ deposit_months: e.target.value })}
                        className="w-full border border-border rounded-lg px-3 py-2.5 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background"
                      />
                    </Field>
                    <Field label="Jour d'échéance (1-28)">
                      <input
                        type="number"
                        min={1}
                        max={28}
                        value={form.due_day}
                        onChange={(e) => update({ due_day: e.target.value })}
                        className="w-full border border-border rounded-lg px-3 py-2.5 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background"
                      />
                    </Field>
                  </div>
                  <div className={`rounded-lg p-2.5 text-[12px] flex items-start gap-1.5 ${cautionDepasse ? "bg-destructive/10 text-destructive" : "bg-muted/40 text-muted-foreground"}`}>
                    {cautionDepasse && <ExclamationTriangleIcon className="w-4 h-4 shrink-0 mt-0.5" />}
                    <span>
                      Caution calculée : <strong>{depositAmount.toLocaleString("fr-FR")} FCFA</strong> (plafond légal 3 mois : {plafond.toLocaleString("fr-FR")} FCFA)
                      {cautionDepasse && " — dépasse le plafond légal"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Date de début">
                      <input
                        type="date"
                        value={form.start_date}
                        onChange={(e) => update({ start_date: e.target.value })}
                        className="w-full border border-border rounded-lg px-3 py-2.5 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background"
                      />
                    </Field>
                    <Field label="Date de fin (optionnel)">
                      <input
                        type="date"
                        value={form.end_date}
                        onChange={(e) => update({ end_date: e.target.value })}
                        className="w-full border border-border rounded-lg px-3 py-2.5 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background"
                      />
                    </Field>
                  </div>
                </>
              )}

              {step === 3 && (
                <div className="space-y-3">
                  <SummaryRow label="Locataire" value={form.full_name} />
                  <SummaryRow label="Téléphone" value={form.phone_number} />
                  <SummaryRow label="Logement" value={bienSelectionne?.nom || "—"} />
                  <SummaryRow label="Loyer + charges" value={`${(Number(form.rent_amount) + Number(form.charges_amount || 0)).toLocaleString("fr-FR")} FCFA`} />
                  <SummaryRow label="Caution" value={`${depositAmount.toLocaleString("fr-FR")} FCFA`} />
                  <SummaryRow label="Début du bail" value={new Date(form.start_date).toLocaleDateString("fr-FR")} />
                  <p className="text-[12px] text-muted-foreground pt-2">
                    À la confirmation, le logement <strong>{bienSelectionne?.nom}</strong> passera automatiquement au statut "loué".
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-between items-center gap-3 px-5 py-4 border-t border-border shrink-0">
          <button
            type="button"
            onClick={() => (step === 0 ? onClose() : setStep((s) => (s - 1) as StepIndex))}
            className="px-4 py-2.5 text-[13px] font-bold text-muted-foreground hover:bg-muted/50 rounded-lg transition-colors"
          >
            {step === 0 ? "Annuler" : "Précédent"}
          </button>
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              disabled={!canAdvance()}
              onClick={() => setStep((s) => (s + 1) as StepIndex)}
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-[13px] font-bold hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Suivant
            </button>
          ) : (
            <button
              type="button"
              disabled={isPending}
              onClick={handleSubmit}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-[13px] font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              <CheckIcon className="w-4 h-4" />
              {isPending ? "Création..." : "Créer le bail"}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[12px] font-bold text-muted-foreground mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <span className="text-[12.5px] text-muted-foreground">{label}</span>
      <span className="text-[13px] font-bold text-card-foreground">{value}</span>
    </div>
  );
}
