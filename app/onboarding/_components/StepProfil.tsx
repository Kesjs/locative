"use client";

import React from "react";
import { type ProfilStepData } from "../_types";
import { ProfileCard } from "./ProfileCard";
import { CustomCountrySelect } from "./CustomCountrySelect";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Home, Building2, Smartphone, Landmark, ShieldCheck } from "lucide-react";

interface StepProfilProps {
  data: ProfilStepData;
  onChange: (data: ProfilStepData) => void;
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
    <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100/80 border border-slate-200/80 rounded-2xl">
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
                ? "bg-card text-foreground shadow-2xs ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground"
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

export function StepProfil({ data, onChange }: StepProfilProps) {
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
            Étape 1 sur 3
          </span>
          <span className="text-[11px] text-muted-foreground font-medium">
            Configuration initiale
          </span>
        </div>
        <h2 className="text-[22px] sm:text-[26px] font-extrabold text-foreground tracking-tight">
          Quel est votre statut d'activité ?
        </h2>
        <p className="text-[13px] text-muted-foreground mt-1">
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
        <div className="flex items-center gap-3 p-3 bg-blue-50/70 border border-blue-200/70 rounded-xl text-blue-900 text-[12px]">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
          <div className="leading-snug">
            <span className="font-bold">Cadre légal Loi n° 2022-30 :</span> Vos mandats et reversements seront automatiquement plafonnés au barème officiel de 10% d'honoraires.
          </div>
        </div>
      )}

      {/* Nom ou Raison Sociale */}
      <FormField
        label={isAgency ? "Raison sociale du cabinet ou de l'agence" : "Votre nom complet"}
        htmlFor="onboarding-nom"
        required
      >
        <Input
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
          className="h-11 rounded-xl text-[14px]"
        />
      </FormField>

      {/* Moyen de réception des fonds privilégié */}
      <div className="space-y-2">
        <label className="text-[13px] font-bold text-foreground block">
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
          <label className="text-[12.5px] font-semibold text-slate-700 block">
            Réseau Mobile Money principal
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "mtn", label: "MTN MoMo", color: "hover:border-amber-400 active:bg-amber-50" },
              { id: "moov", label: "Moov Money", color: "hover:border-blue-400 active:bg-blue-50" },
              { id: "celtiis", label: "Celtiis Cash", color: "hover:border-emerald-400 active:bg-emerald-50" },
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
                      ? "bg-slate-900 text-white border-slate-900 shadow-2xs ring-1 ring-emerald-500/30"
                      : "bg-card text-muted-foreground border-border hover:text-foreground hover:bg-slate-50"
                  )}
                >
                  {prov.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Zone géographique */}
      <div className="space-y-2">
        <label className="text-[13px] font-bold text-foreground block">
          Localisation de votre activité
        </label>
        <BrandedToggleGroup
          value={data.zoneGeo}
          onChange={(v) =>
            updateData({
              zoneGeo: v as "benin" | "diaspora",
              paysDiaspora: v === "diaspora" ? "France" : undefined,
            })
          }
          options={[
            { value: "benin", label: "Bénin (National)" },
            { value: "diaspora", label: "Diaspora (International)" },
          ]}
        />
      </div>

      {/* Sélecteur de pays diaspora sur-mesure (sans <select> natif) */}
      {data.zoneGeo === "diaspora" && (
        <div className="space-y-2 animate-in fade-in-50 duration-200">
          <label className="text-[12.5px] font-semibold text-slate-700 block">
            Pays de résidence actuel
          </label>
          <CustomCountrySelect
            value={data.paysDiaspora || "France"}
            onChange={(country) => updateData({ paysDiaspora: country })}
          />
        </div>
      )}
    </div>
  );
}
