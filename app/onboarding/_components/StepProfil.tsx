import React from "react";
import { type ProfilStepData } from "../_types";
import { ProfileCard } from "./ProfileCard";
import { HomeModernIcon, BuildingOffice2Icon } from "@heroicons/react/24/outline";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface StepProfilProps {
  data: ProfilStepData;
  onChange: (data: ProfilStepData) => void;
}

const COUNTRIES = [
  { code: "FR", name: "France" },
  { code: "CI", name: "Côte d'Ivoire" },
  { code: "TG", name: "Togo" },
  { code: "SN", name: "Sénégal" },
  { code: "US", name: "États-Unis" },
  { code: "CA", name: "Canada" },
  { code: "BE", name: "Belgique" },
  { code: "GB", name: "Royaume-Uni" },
  { code: "GA", name: "Gabon" },
  { code: "CG", name: "Congo" },
  { code: "CM", name: "Cameroun" },
  { code: "ML", name: "Mali" },
  { code: "NG", name: "Nigeria" },
  { code: "DE", name: "Allemagne" },
  { code: "CH", name: "Suisse" },
  { code: "IT", name: "Italie" },
];

/** Pill-style toggle buttons (Mobile Money / Banque, zone géo, provider) */
function ToggleGroup({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-1.5 p-1 bg-muted/50 border border-border rounded-xl">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "flex-1 py-2 text-[13px] font-semibold rounded-lg transition-all",
            value === opt.value
              ? "bg-card text-foreground shadow-sm ring-1 ring-border"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/** Pill-button pour Mobile provider */
function PillButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 py-2 text-[13px] font-semibold rounded-xl border transition-all capitalize",
        active
          ? "bg-primary/10 text-primary border-primary/40"
          : "bg-card text-muted-foreground border-border hover:border-primary/40"
      )}
    >
      {label}
    </button>
  );
}

export function StepProfil({ data, onChange }: StepProfilProps) {
  const updateData = (updates: Partial<ProfilStepData>) => {
    onChange({ ...data, ...updates });
  };

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h2 className="text-[22px] sm:text-[26px] font-extrabold text-foreground tracking-tight">
          Quel est votre profil ?
        </h2>
        <p className="text-[13px] text-muted-foreground mt-1">
          Lokka s'adapte à votre mode de gestion.
        </p>
      </div>

      {/* Type de profil */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ProfileCard
          id="bailleur"
          title="Bailleur"
          subtitle="Je gère mes propres biens"
          icon={HomeModernIcon}
          isSelected={data.profileType === "bailleur"}
          onSelect={(id) => updateData({ profileType: id, nom: "" })}
        />
        <ProfileCard
          id="agence"
          title="Agence"
          subtitle="Je gère des mandats pour des tiers"
          icon={BuildingOffice2Icon}
          isSelected={data.profileType === "agence"}
          onSelect={(id) => updateData({ profileType: id, nom: "" })}
        />
      </div>

      {/* Nom */}
      <FormField
        label={data.profileType === "bailleur" ? "Votre nom" : "Raison sociale du cabinet"}
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
            data.profileType === "bailleur"
              ? "Ex: Koudjo Dossou"
              : "Ex: Agence Immobilière du Golfe"
          }
        />
      </FormField>

      {/* Moyen de réception */}
      <FormField label="Moyen de réception des fonds privilégié" htmlFor="moyen-reception">
        <ToggleGroup
          value={data.moyenReception}
          onChange={(v) =>
            updateData({
              moyenReception: v as "mobile_money" | "banque",
              mobileProvider: v === "mobile_money" ? "mtn" : undefined,
            })
          }
          options={[
            { value: "mobile_money", label: "📱 Mobile Money" },
            { value: "banque", label: "🏦 Virement Bancaire" },
          ]}
        />
      </FormField>

      {/* Réseau mobile */}
      {data.moyenReception === "mobile_money" && (
        <FormField label="Réseau mobile" htmlFor="mobile-provider">
          <div className="flex gap-2">
            {(["mtn", "moov", "celtiis"] as const).map((provider) => (
              <PillButton
                key={provider}
                label={provider.toUpperCase()}
                active={data.mobileProvider === provider}
                onClick={() => updateData({ mobileProvider: provider })}
              />
            ))}
          </div>
        </FormField>
      )}

      {/* Zone géographique */}
      <FormField label="Zone géographique actuelle" htmlFor="zone-geo">
        <ToggleGroup
          value={data.zoneGeo}
          onChange={(v) =>
            updateData({
              zoneGeo: v as "benin" | "diaspora",
              paysDiaspora: v === "diaspora" ? "France" : undefined,
            })
          }
          options={[
            { value: "benin", label: "Au Bénin" },
            { value: "diaspora", label: "Diaspora" },
          ]}
        />
      </FormField>

      {/* Pays diaspora */}
      {data.zoneGeo === "diaspora" && (
        <FormField label="Pays de résidence" htmlFor="pays-diaspora">
          <Select
            value={data.paysDiaspora || "France"}
            onValueChange={(v) => updateData({ paysDiaspora: v })}
          >
            <SelectTrigger id="pays-diaspora">
              <SelectValue placeholder="Sélectionner un pays..." />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => (
                <SelectItem key={c.code} value={c.name}>
                  {c.name}
                </SelectItem>
              ))}
              <SelectItem value="Autre">Autre pays</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
      )}
    </div>
  );
}
