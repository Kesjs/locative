"use client";

import React from "react";
import { type ProfilStepData } from "../_types";
import { ProfileCard } from "./ProfileCard";
import { cn } from "@/lib/utils";
import { Home, Building2, Smartphone, Landmark, ShieldCheck, Check } from "lucide-react";

interface StepProfilProps {
  data: ProfilStepData;
  onChange: (data: ProfilStepData) => void;
  error?: string;
}

/** Pill-style toggle buttons */
function BrandedToggleGroup({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string; icon?: React.ElementType }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 border border-slate-200 rounded-2xl">
      {options.map((opt) => {
        const isSelected = value === opt.value;
        const Icon = opt.icon;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex items-center justify-center gap-2 py-2.5 px-3 text-[13px] font-bold rounded-xl transition-all duration-200 cursor-pointer",
              isSelected
                ? "bg-white text-slate-900 shadow-2xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            {Icon && <Icon className="w-4 h-4" />}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function StepProfil({ data, onChange, error }: StepProfilProps) {
  const updateData = (updates: Partial<ProfilStepData>) => {
    onChange({ ...data, ...updates });
  };

  const isAgency = data.profileType === "agence";

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Étape 1 sur 2
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            Profil &amp; Perception
          </span>
        </div>
        <h2 className="text-[22px] sm:text-[25px] font-extrabold text-slate-900 tracking-tight">
          Quel est votre statut d'activité ?
        </h2>
        <p className="text-[13px] text-slate-600 mt-1">
          Lokka adapte son interface, ses calculs de commissions et ses baux légaux à votre métier.
        </p>
      </div>

      {/* Cartes de sélection de Profil */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <ProfileCard
          id="bailleur"
          title="Bailleur Privé"
          subtitle="Je gère mon propre patrimoine immobilier en direct"
          badge="Direct"
          icon={Home}
          isSelected={data.profileType === "bailleur"}
          onSelect={(id) => updateData({ profileType: id })}
        />
        <ProfileCard
          id="agence"
          title="Agence & Cabinet"
          subtitle="Je gère des mandats de location pour le compte de tiers"
          badge="Loi 2022-30 (10%)"
          icon={Building2}
          isSelected={data.profileType === "agence"}
          onSelect={(id) => updateData({ profileType: id })}
        />
      </div>

      {/* Bannière d'encadrement légal pour l'agence */}
      {isAgency && (
        <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-[12px]">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
          <div className="leading-snug">
            <span className="font-bold">Cadre légal Loi n° 2022-30 :</span> Vos mandats et reversements seront automatiquement plafonnés au barème officiel de 10% d'honoraires.
          </div>
        </div>
      )}

      {/* Nom ou Raison Sociale */}
      <div className="space-y-1.5">
        <label htmlFor="onboarding-nom" className="text-[13px] font-bold text-slate-900 block">
          {isAgency ? "Raison sociale du cabinet ou de l'agence" : "Votre nom complet"}
          <span className="text-rose-500 ml-1">*</span>
        </label>
        <input
          id="onboarding-nom"
          type="text"
          autoComplete="name"
          value={data.nom}
          onChange={(e) => updateData({ nom: e.target.value })}
          placeholder={
            isAgency
              ? "Ex: Cabinet Immobilier du Golfe, Agence Bénin Prestige"
              : "Ex: Koudjo Dossou, Claudine Mensah"
          }
          className={cn(
            "w-full px-3.5 py-2.5 bg-white border rounded-xl text-[13.5px] text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all shadow-2xs",
            error
              ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15"
              : "border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
          )}
        />
        {error && (
          <p className="text-[11.5px] text-rose-600 font-medium">{error}</p>
        )}
      </div>

      {/* Moyen de réception des fonds privilégié */}
      <div className="space-y-2">
        <label className="text-[13px] font-bold text-slate-900 block">
          Moyen de réception des loyers privilégié
        </label>
        <BrandedToggleGroup
          value={data.moyenReception}
          onChange={(v) =>
            updateData({
              moyenReception: v as "mobile_money" | "banque",
              mobileProvider: v === "mobile_money" ? "mtn" : undefined,
            })
          }
          options={[
            { value: "mobile_money", label: "Mobile Money", icon: Smartphone },
            { value: "banque", label: "Virement Bancaire", icon: Landmark },
          ]}
        />
      </div>

      {/* Opérateur Mobile Money avec design soigné */}
      {data.moyenReception === "mobile_money" && (
        <div className="space-y-2 animate-in fade-in-50 duration-200">
          <label className="text-[12.5px] font-semibold text-slate-900 block">
            Réseau Mobile Money principal
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "mtn", label: "MTN MoMo" },
              { id: "moov", label: "Moov Money" },
              { id: "celtiis", label: "Celtiis Cash" },
            ].map((prov) => {
              const active = data.mobileProvider === prov.id;
              return (
                <button
                  key={prov.id}
                  type="button"
                  onClick={() => updateData({ mobileProvider: prov.id as any })}
                  className={cn(
                    "py-2.5 px-2 text-[12px] font-bold rounded-xl border transition-all text-center cursor-pointer",
                    active
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs ring-1 ring-emerald-500/30"
                      : "bg-white text-slate-700 border-slate-200 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  {prov.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Carte explicative dynamique de la formule choisie */}
      {!isAgency ? (
        <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/90 rounded-xl space-y-1.5 text-[12.5px]">
          <div className="flex items-center gap-2 font-bold text-emerald-800">
            <Check className="w-4 h-4 text-emerald-600 stroke-[3] shrink-0" />
            <span>Spécificités du parcours Bailleur Direct :</span>
          </div>
          <ul className="space-y-1 pl-6 text-[12px] text-slate-600 list-disc">
            <li><strong>100% de vos loyers</strong> encaissés sans commission ni intermédiaire.</li>
            <li><strong>Quittances officielles conformes</strong> à la Loi n° 2022-30 générées en 1 clic.</li>
            <li><strong>Cockpit patrimonial direct</strong> : suivi de vos logements, locataires et impayés.</li>
          </ul>
        </div>
      ) : (
        <div className="p-3.5 bg-blue-50/70 border border-blue-200/90 rounded-xl space-y-1.5 text-[12.5px]">
          <div className="flex items-center gap-2 font-bold text-blue-900">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Spécificités du parcours Agence & Mandats :</span>
          </div>
          <ul className="space-y-1 pl-6 text-[12px] text-slate-600 list-disc">
            <li><strong>Plafonnement légal à 10%</strong> d'honoraires de gestion (Loi 2022-30 Bénin).</li>
            <li><strong>Reversements mandants (90%)</strong> calculés et tracés automatiquement.</li>
            <li><strong>Cockpit multi-propriétaires</strong> : gestion des contrats de mandat et CRG.</li>
          </ul>
        </div>
      )}
    </div>
  );
}
