import React from "react";
import { type ProfilStepData } from "../_types";
import { ProfileCard } from "./ProfileCard";
import { HomeModernIcon, BuildingOffice2Icon } from "@heroicons/react/24/outline";

interface StepProfilProps {
  data: ProfilStepData;
  onChange: (data: ProfilStepData) => void;
}

const COUNTRIES = [
  { code: "BJ", name: "Bénin" },
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

export function StepProfil({ data, onChange }: StepProfilProps) {
  const updateData = (updates: Partial<ProfilStepData>) => {
    onChange({ ...data, ...updates });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[22px] sm:text-[26px] font-extrabold text-[#1C1C1C] tracking-tight">
          Quel est votre profil ?
        </h2>
        <p className="text-[13px] text-[#64635F] mt-1">
          Lokka s'adapte à votre mode de gestion.
        </p>
      </div>

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

      <div>
        <label className="block text-[13px] font-bold text-[#1C1C1C] mb-1.5">
          {data.profileType === "bailleur" ? "Nom" : "Raison sociale du cabinet"}
        </label>
        <input
          type="text"
          value={data.nom}
          onChange={(e) => updateData({ nom: e.target.value })}
          className="w-full px-3.5 py-2.5 bg-white border border-[#E8E5E0] rounded-lg text-[14px] text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C] focus:ring-1 focus:ring-[#1C1C1C]/10 shadow-sm transition-shadow"
          placeholder={data.profileType === "bailleur" ? "Ex: Koudjo Dossou" : "Ex: Agence Immobilière du Golfe"}
        />
      </div>

      <div>
        <label className="block text-[13px] font-bold text-[#1C1C1C] mb-1.5">
          Moyen de réception des fonds privilégié
        </label>
        <div className="flex gap-2 p-1 bg-[#FAF9F6] border border-[#E8E5E0] rounded-lg">
          <button
            type="button"
            onClick={() => updateData({ moyenReception: "mobile_money", mobileProvider: "mtn" })}
            className={`flex-1 py-2 text-[13px] font-semibold rounded-md transition-all ${
              data.moyenReception === "mobile_money"
                ? "bg-white text-[#1C1C1C] shadow-sm ring-1 ring-black/5"
                : "text-[#64635F] hover:text-[#1C1C1C]"
            }`}
          >
            Mobile Money
          </button>
          <button
            type="button"
            onClick={() => updateData({ moyenReception: "banque", mobileProvider: undefined })}
            className={`flex-1 py-2 text-[13px] font-semibold rounded-md transition-all ${
              data.moyenReception === "banque"
                ? "bg-white text-[#1C1C1C] shadow-sm ring-1 ring-black/5"
                : "text-[#64635F] hover:text-[#1C1C1C]"
            }`}
          >
            Virement Bancaire
          </button>
        </div>
      </div>

      {data.moyenReception === "mobile_money" && (
        <div>
          <label className="block text-[13px] font-bold text-[#1C1C1C] mb-1.5">
            Réseau mobile
          </label>
          <div className="flex gap-2">
            {(["mtn", "moov", "celtiis"] as const).map((provider) => (
              <button
                key={provider}
                type="button"
                onClick={() => updateData({ mobileProvider: provider })}
                className={`flex-1 py-2 text-[13px] font-semibold rounded-lg border transition-all capitalize ${
                  data.mobileProvider === provider
                    ? "bg-[#F5F5DC] text-[#1C1C1C] border-[#1C1C1C]"
                    : "bg-white text-[#64635F] border-[#E8E5E0] hover:border-[#1C1C1C]"
                }`}
              >
                {provider}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-[13px] font-bold text-[#1C1C1C] mb-1.5">
          Zone géographique actuelle
        </label>
        <div className="flex gap-2 p-1 bg-[#FAF9F6] border border-[#E8E5E0] rounded-lg">
          <button
            type="button"
            onClick={() => updateData({ zoneGeo: "benin", paysDiaspora: undefined })}
            className={`flex-1 py-2 text-[13px] font-semibold rounded-md transition-all ${
              data.zoneGeo === "benin"
                ? "bg-white text-[#1C1C1C] shadow-sm ring-1 ring-black/5"
                : "text-[#64635F] hover:text-[#1C1C1C]"
            }`}
          >
            Au Bénin 🇧🇯
          </button>
          <button
            type="button"
            onClick={() => updateData({ zoneGeo: "diaspora", paysDiaspora: "France" })}
            className={`flex-1 py-2 text-[13px] font-semibold rounded-md transition-all ${
              data.zoneGeo === "diaspora"
                ? "bg-white text-[#1C1C1C] shadow-sm ring-1 ring-black/5"
                : "text-[#64635F] hover:text-[#1C1C1C]"
            }`}
          >
            Diaspora 🌍
          </button>
        </div>
      </div>

      {data.zoneGeo === "diaspora" && (
        <div>
          <label className="block text-[13px] font-bold text-[#1C1C1C] mb-1.5">
            Pays de résidence
          </label>
          <div className="relative">
            <select
              value={data.paysDiaspora || ""}
              onChange={(e) => updateData({ paysDiaspora: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white border border-[#E8E5E0] rounded-lg text-[14px] text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C] focus:ring-1 focus:ring-[#1C1C1C]/10 shadow-sm transition-shadow appearance-none cursor-pointer"
            >
              {COUNTRIES.filter(c => c.code !== "BJ").map((c) => (
                <option key={c.code} value={c.name}>
                  {c.name}
                </option>
              ))}
              <option value="Autre">Autre pays</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-[#64635F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
