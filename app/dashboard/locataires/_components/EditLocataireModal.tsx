"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useUpdateTenant, type Tenant } from "@/lib/hooks/useLocataires";
import { cn } from "@/lib/utils";

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
}

function tenantToForm(tenant: Tenant): FormState {
  return {
    full_name: tenant.full_name || "",
    phone_number: tenant.phone_number || "",
    whatsapp_number: tenant.whatsapp_number || "",
    email: tenant.email || "",
    profession: tenant.profession || "",
    id_card_type: tenant.id_card_type || "CIP (Bénin)",
    id_card_number: tenant.id_card_number || "",
    emergency_contact_name: tenant.emergency_contact_name || "",
    emergency_contact_phone: tenant.emergency_contact_phone || "",
  };
}

export function EditLocataireModal({
  tenant,
  onClose,
}: {
  tenant: Tenant | null;
  onClose: () => void;
}) {
  const [form, setForm] = useState<FormState | null>(null);
  const { mutateAsync: updateTenant, isPending } = useUpdateTenant();

  useEffect(() => {
    if (tenant) setForm(tenantToForm(tenant));
  }, [tenant]);

  if (!tenant || !form) return null;

  const update = (patch: Partial<FormState>) => setForm((f) => (f ? { ...f, ...patch } : f));

  const handleSubmit = async () => {
    if (!form.full_name.trim() || !form.phone_number.trim()) {
      toast.error("Le nom et le téléphone sont obligatoires.");
      return;
    }
    try {
      await updateTenant({
        id: tenant.id,
        full_name: form.full_name.trim(),
        phone_number: form.phone_number.trim(),
        whatsapp_number: form.whatsapp_number.trim() || null,
        email: form.email.trim() || null,
        profession: form.profession.trim() || null,
        id_card_type: form.id_card_type || null,
        id_card_number: form.id_card_number.trim() || null,
        emergency_contact_name: form.emergency_contact_name.trim() || null,
        emergency_contact_phone: form.emergency_contact_phone.trim() || null,
      });
      toast.success("Fiche locataire mise à jour");
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "Erreur lors de la mise à jour du locataire");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-card rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[92vh] sm:max-h-[88vh] flex flex-col shadow-2xl border border-border overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="text-[16px] font-bold text-card-foreground">Compléter la fiche locataire</h2>
            <p className="text-[11.5px] text-muted-foreground">
              Ajoute les infos manquantes (téléphone, pièce d'identité...)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Corps */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          <Field label="Nom complet du locataire *">
            <input
              type="text"
              required
              value={form.full_name}
              onChange={(e) => update({ full_name: e.target.value })}
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
            <Field label="Adresse Email">
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
          <div className="grid grid-cols-2 gap-2.5">
            <Field label="Contact d'urgence — nom">
              <input
                type="text"
                value={form.emergency_contact_name}
                onChange={(e) => update({ emergency_contact_name: e.target.value })}
                className="w-full border border-border rounded-lg px-3 py-2 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background"
              />
            </Field>
            <Field label="Contact d'urgence — téléphone">
              <input
                type="tel"
                value={form.emergency_contact_phone}
                onChange={(e) => update({ emergency_contact_phone: e.target.value })}
                className="w-full border border-border rounded-lg px-3 py-2 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background"
              />
            </Field>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 px-5 py-3.5 border-t border-border shrink-0 bg-muted/20">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-lg text-[12.5px] font-semibold text-muted-foreground hover:bg-muted transition cursor-pointer"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12.5px] font-bold text-white transition cursor-pointer",
              "bg-[var(--primary)] hover:opacity-90 disabled:opacity-60"
            )}
          >
            <CheckIcon className="w-4 h-4" />
            {isPending ? "Enregistrement..." : "Enregistrer"}
          </button>
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
