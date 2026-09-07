"use client";

import React from "react";
import { type ProfileType, type Objectif, type SaisieExpressData } from "../_types";
import { getExpressFields, type ExpressField } from "../_config/expressFieldsMatrix";
import { AgencyCalculatorPreview } from "./AgencyCalculatorPreview";
import { Sparkles, Calendar, DollarSign, UserCheck, Building } from "lucide-react";

interface StepSaisieExpressProps {
  profileType: ProfileType;
  objectifs: Objectif[];
  data: SaisieExpressData;
  onChange: (data: SaisieExpressData) => void;
}

export function StepSaisieExpress({
  profileType,
  objectifs,
  data,
  onChange,
}: StepSaisieExpressProps) {
  const fields = getExpressFields(profileType, objectifs);

  const updateField = (key: string, value: string | number | undefined) => {
    onChange({ ...data, [key]: value });
  };

  const isAgency = profileType === "agence";
  const agencyLoyer = Number(data.loyerActuelMandat || data.loyerSouhaite || 200000);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Étape 3 sur 3
          </span>
          <span className="text-[11px] text-muted-foreground font-medium">
            Configuration opérationnelle
          </span>
        </div>
        <h2 className="text-[22px] sm:text-[26px] font-extrabold text-foreground tracking-tight leading-tight">
          {isAgency ? "Configuration de votre premier mandat" : "Saisie Express de votre premier bien"}
        </h2>
        <p className="text-[13px] text-muted-foreground mt-1.5">
          {isAgency
            ? "Renseignez le premier lot sous mandat confié à votre agence pour initialiser vos reversements."
            : "Quelques informations simples pour initialiser vos tableaux de bord avec de vraies données."}
        </p>
      </div>

      <div className="space-y-4">
        {fields.map((field) => (
          <ExpressInput
            key={field.key}
            field={field}
            value={data[field.key as keyof SaisieExpressData]}
            onChange={(val) => updateField(field.key, val)}
          />
        ))}

        {/* Prévisualisation calculatrice pour profil Agence */}
        {isAgency && (
          <AgencyCalculatorPreview
            loyer={agencyLoyer}
            mandantNom={data.proprietaireMandantNom || "Propriétaire mandant"}
          />
        )}

        {fields.length === 0 && (
          <div className="text-[13px] text-muted-foreground p-4 bg-slate-50 rounded-2xl border border-border text-center">
            Aucune information supplémentaire requise pour cette sélection.
          </div>
        )}
      </div>
    </div>
  );
}

function ExpressInput({
  field,
  value,
  onChange,
}: {
  field: ExpressField;
  value: any;
  onChange: (val: string | number | undefined) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[13px] font-bold text-foreground">
        {field.label}
      </label>
      <div className="relative">
        <input
          type={field.type === "number" ? "text" : field.type}
          inputMode={field.type === "number" ? "numeric" : undefined}
          value={value === undefined ? "" : value}
          onChange={(e) => {
            if (field.type === "number") {
              const val = e.target.value.replace(/\D/g, "");
              onChange(val ? parseInt(val, 10) : undefined);
            } else {
              onChange(e.target.value);
            }
          }}
          className={`w-full px-3.5 py-2.5 bg-card border border-border rounded-xl text-[14px] text-foreground focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 shadow-2xs transition-all ${
            field.suffix ? "pr-16" : ""
          }`}
          placeholder={field.placeholder}
        />
        {field.suffix && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-[11.5px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-1 rounded-md border border-border">
              {field.suffix}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
