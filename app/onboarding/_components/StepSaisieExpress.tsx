"use client";

import React from "react";
import { type ProfileType, type Objectif, type SaisieExpressData } from "../_types";
import { AgencyCalculatorPreview } from "./AgencyCalculatorPreview";
import { Building2, Home, KeyRound, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepSaisieExpressProps {
  profileType: ProfileType;
  objectifs: Objectif[];
  data: SaisieExpressData;
  onChange: (data: SaisieExpressData) => void;
  errors?: Record<string, string>;
}

export function StepSaisieExpress({
  profileType,
  objectifs,
  data,
  onChange,
  errors = {},
}: StepSaisieExpressProps) {
  const isAgency = profileType === "agence";
  const isVacant = data.statutOccupation === "vacant";

  const updateField = (key: keyof SaisieExpressData, value: any) => {
    onChange({ ...data, [key]: value });
  };

  const agencyLoyer = Number(data.loyerActuelMandat || data.loyerMensuel || 250000);

  return (
    <div className="space-y-6">
      {/* En-tête concise */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Étape 3 sur 3
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            Configuration initiale
          </span>
        </div>
        <h2 className="text-[22px] sm:text-[25px] font-extrabold text-slate-900 tracking-tight leading-tight">
          {isAgency ? "Premier mandat de gestion" : "Votre premier patrimoine & lot"}
        </h2>
        <p className="text-[13px] text-slate-600 mt-1">
          {isAgency
            ? "Renseignez le propriétaire mandant et le lot confié à votre cabinet."
            : "Renseignez votre ensemble immobilier et son premier lot locatif."}
        </p>
      </div>

      {/* Formulaire Bailleur : Hiérarchie Patrimoine -> Lot */}
      {!isAgency ? (
        <div className="space-y-4">
          {/* 1. Nom du Patrimoine / Ensemble */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-bold text-slate-900 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Nom de l'ensemble ou résidence</span>
                <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">Patrimoine parent</span>
            </div>
            <input
              type="text"
              value={data.nomPatrimoine || ""}
              onChange={(e) => updateField("nomPatrimoine", e.target.value)}
              placeholder="Ex: Résidence Les Cocotiers, Villa Haie-Vive, Immeuble Marina"
              className={cn(
                "w-full px-3.5 py-2.5 bg-white border rounded-xl text-[13.5px] text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all shadow-2xs",
                errors.nomPatrimoine
                  ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15"
                  : "border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
              )}
            />
            {errors.nomPatrimoine ? (
              <p className="flex items-center gap-1 text-[11.5px] text-rose-600 font-medium">
                <AlertCircle className="w-3 h-3" />
                {errors.nomPatrimoine}
              </p>
            ) : (
              <p className="text-[11.5px] text-slate-500">
                L'immeuble ou complexe regroupant vos logements.
              </p>
            )}
          </div>

          {/* 2. Premier Lot / Désignation */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-bold text-slate-900 flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-emerald-600" />
                <span>Premier lot / Type de bien</span>
                <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">Unité louable</span>
            </div>
            <input
              type="text"
              value={data.typeLot || ""}
              onChange={(e) => updateField("typeLot", e.target.value)}
              placeholder="Ex: Appartement 3 pièces (Lot 12), Villa 4 chambres, Studio A"
              className={cn(
                "w-full px-3.5 py-2.5 bg-white border rounded-xl text-[13.5px] text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all shadow-2xs",
                errors.typeLot
                  ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15"
                  : "border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
              )}
            />
            {errors.typeLot && (
              <p className="flex items-center gap-1 text-[11.5px] text-rose-600 font-medium">
                <AlertCircle className="w-3 h-3" />
                {errors.typeLot}
              </p>
            )}
          </div>

          {/* 3. Loyer mensuel */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-900 flex items-center gap-1">
              <span>Loyer mensuel</span>
              <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={data.loyerMensuel ? Number(data.loyerMensuel).toLocaleString("fr-FR") : ""}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  updateField("loyerMensuel", val ? parseInt(val, 10) : undefined);
                }}
                placeholder="Ex: 250 000"
                className={cn(
                  "w-full px-3.5 py-2.5 pr-24 bg-white border rounded-xl text-[13.5px] text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all shadow-2xs",
                  errors.loyerMensuel
                    ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15"
                    : "border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
                )}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
                <span className="text-[11px] font-bold tracking-wider text-slate-600 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                  FCFA / mois
                </span>
              </div>
            </div>
            {errors.loyerMensuel && (
              <p className="flex items-center gap-1 text-[11.5px] text-rose-600 font-medium">
                <AlertCircle className="w-3 h-3" />
                {errors.loyerMensuel}
              </p>
            )}
          </div>

          {/* 4. Statut d'occupation : Loué ou Vacant */}
          <div className="space-y-2 pt-1">
            <label className="text-[13px] font-bold text-slate-900 block">
              Situation actuelle de ce lot
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 border border-slate-200 rounded-xl">
              <button
                type="button"
                onClick={() => updateField("statutOccupation", "loue")}
                className={cn(
                  "flex items-center justify-center gap-2 py-2 px-3 text-[12.5px] font-bold rounded-lg transition-all cursor-pointer",
                  !isVacant
                    ? "bg-white text-slate-900 shadow-2xs border border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
                <span>Actuellement loué</span>
              </button>
              <button
                type="button"
                onClick={() => updateField("statutOccupation", "vacant")}
                className={cn(
                  "flex items-center justify-center gap-2 py-2 px-3 text-[12.5px] font-bold rounded-lg transition-all cursor-pointer",
                  isVacant
                    ? "bg-white text-slate-900 shadow-2xs border border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <span>Lot vacant (à louer)</span>
              </button>
            </div>
          </div>

          {/* 5. Locataire en place si loué */}
          {!isVacant && (
            <div className="space-y-1.5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-bold text-slate-900">
                  Nom du locataire en place
                </label>
                <span className="text-[11px] text-slate-400">Facultatif</span>
              </div>
              <input
                type="text"
                value={data.locataireEnPlaceNom || ""}
                onChange={(e) => updateField("locataireEnPlaceNom", e.target.value)}
                placeholder="Ex: Claudine Mensah, Dr. Dossou"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-[13.5px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-2xs"
              />
            </div>
          )}
        </div>
      ) : (
        /* Formulaire Agence : Mandant -> Immeuble -> Lot -> Honoraires */
        <div className="space-y-4">
          {/* 1. Mandant */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-bold text-slate-900 flex items-center gap-1">
                <span>Propriétaire mandant</span>
                <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">Bailleur sous mandat</span>
            </div>
            <input
              type="text"
              value={data.proprietaireMandantNom || ""}
              onChange={(e) => updateField("proprietaireMandantNom", e.target.value)}
              placeholder="Ex: M. Mensah, Dr. Akakpo, SCI Les Palmiers"
              className={cn(
                "w-full px-3.5 py-2.5 bg-white border rounded-xl text-[13.5px] text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all shadow-2xs",
                errors.proprietaireMandantNom
                  ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15"
                  : "border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
              )}
            />
            {errors.proprietaireMandantNom && (
              <p className="flex items-center gap-1 text-[11.5px] text-rose-600 font-medium">
                <AlertCircle className="w-3 h-3" />
                {errors.proprietaireMandantNom}
              </p>
            )}
          </div>

          {/* 2. Nom Immeuble / Résidence */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-bold text-slate-900 flex items-center gap-1">
                <span>Immeuble ou résidence sous mandat</span>
                <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">Patrimoine confié</span>
            </div>
            <input
              type="text"
              value={data.nomPatrimoine || ""}
              onChange={(e) => updateField("nomPatrimoine", e.target.value)}
              placeholder="Ex: Résidence Marina, Immeuble Ganhi"
              className={cn(
                "w-full px-3.5 py-2.5 bg-white border rounded-xl text-[13.5px] text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all shadow-2xs",
                errors.nomPatrimoine
                  ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15"
                  : "border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
              )}
            />
            {errors.nomPatrimoine && (
              <p className="flex items-center gap-1 text-[11.5px] text-rose-600 font-medium">
                <AlertCircle className="w-3 h-3" />
                {errors.nomPatrimoine}
              </p>
            )}
          </div>

          {/* 3. Premier Lot sous mandat */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-bold text-slate-900 flex items-center gap-1">
                <span>Désignation du lot sous mandat</span>
                <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">Premier lot</span>
            </div>
            <input
              type="text"
              value={data.typeLot || ""}
              onChange={(e) => updateField("typeLot", e.target.value)}
              placeholder="Ex: Appartement B2 (Lot 101), Bureau 80m²"
              className={cn(
                "w-full px-3.5 py-2.5 bg-white border rounded-xl text-[13.5px] text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all shadow-2xs",
                errors.typeLot
                  ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15"
                  : "border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
              )}
            />
            {errors.typeLot && (
              <p className="flex items-center gap-1 text-[11.5px] text-rose-600 font-medium">
                <AlertCircle className="w-3 h-3" />
                {errors.typeLot}
              </p>
            )}
          </div>

          {/* 4. Loyer mensuel sous mandat */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-900 flex items-center gap-1">
              <span>Loyer mensuel du lot</span>
              <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={data.loyerActuelMandat ? Number(data.loyerActuelMandat).toLocaleString("fr-FR") : ""}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  updateField("loyerActuelMandat", val ? parseInt(val, 10) : undefined);
                }}
                placeholder="Ex: 350 000"
                className={cn(
                  "w-full px-3.5 py-2.5 pr-24 bg-white border rounded-xl text-[13.5px] text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all shadow-2xs",
                  errors.loyerActuelMandat
                    ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15"
                    : "border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
                )}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
                <span className="text-[11px] font-bold tracking-wider text-slate-600 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                  FCFA / mois
                </span>
              </div>
            </div>
            {errors.loyerActuelMandat && (
              <p className="flex items-center gap-1 text-[11.5px] text-rose-600 font-medium">
                <AlertCircle className="w-3 h-3" />
                {errors.loyerActuelMandat}
              </p>
            )}
          </div>

          {/* Prévisualisation barème légal 10% / 90% */}
          <AgencyCalculatorPreview
            loyer={agencyLoyer}
            mandantNom={data.proprietaireMandantNom || "Propriétaire mandant"}
          />
        </div>
      )}
    </div>
  );
}
