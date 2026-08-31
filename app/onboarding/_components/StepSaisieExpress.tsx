import React from "react";
import { type ProfileType, type Objectif, type SaisieExpressData } from "../_types";
import { getExpressFields, type ExpressField } from "../_config/expressFieldsMatrix";

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[22px] sm:text-[26px] font-extrabold text-[#1C1C1C] tracking-tight leading-tight">
          Saisie Express
        </h2>
        <p className="text-[13px] text-[#64635F] mt-1.5">
          Quelques informations pour paramétrer votre espace selon vos objectifs.
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
        {fields.length === 0 && (
          <div className="text-[13px] text-[#64635F] italic p-4 bg-[#FAF9F6] rounded-xl border border-[#E8E5E0] text-center">
            Aucune information supplémentaire requise.
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
    <div>
      <label className="block text-[13px] font-bold text-[#1C1C1C] mb-1.5">
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
          className={`w-full px-3.5 py-2.5 bg-white border border-[#E8E5E0] rounded-lg text-[14px] text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C] focus:ring-1 focus:ring-[#1C1C1C]/10 shadow-sm transition-shadow ${
            field.suffix ? "pr-12" : ""
          }`}
          placeholder={field.placeholder}
        />
        {field.suffix && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none">
            <span className="text-[#9C9A95] text-[13px] font-medium">{field.suffix}</span>
          </div>
        )}
      </div>
    </div>
  );
}
