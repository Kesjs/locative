"use client";

import React from "react";
import { type Objectif, type ProfileType } from "../_types";
import { ObjectiveCard } from "./ObjectiveCard";
import { FileCheck, Sparkles, Building2, Megaphone } from "lucide-react";

interface StepObjectifsProps {
  profileType: ProfileType;
  selected: Objectif[];
  onChange: (selected: Objectif[]) => void;
}

export function StepObjectifs({ profileType, selected, onChange }: StepObjectifsProps) {
  const toggle = (id: Objectif) => {
    if (selected.includes(id)) {
      onChange(selected.filter((x) => x !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const isAgency = profileType === "agence";

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Étape 2 sur 3
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            Priorités
          </span>
        </div>
        <h2 className="text-[22px] sm:text-[25px] font-extrabold text-slate-900 tracking-tight leading-tight">
          {isAgency
            ? "Quels sont les objectifs de votre cabinet ?"
            : "Quels sont vos objectifs prioritaires ?"}
        </h2>
        <p className="text-[13px] text-slate-600 mt-1">
          Sélectionnez vos modules prioritaires (plusieurs choix possibles).
        </p>
      </div>

      <div className="flex flex-col gap-3.5">
        <ObjectiveCard
          id="digitaliser"
          title={
            isAgency
              ? "Digitaliser la gestion de mes mandats"
              : "Digitaliser ma gestion en cours"
          }
          subtitle={
            isAgency
              ? "Gestion des conventions de mandat, calcul automatique de vos honoraires (10%), reversements aux mandants (90%) et quittances certifiées."
              : "Édition de quittances dématérialisées conformes, suivi des encaissements par Mobile Money et relances automatiques."
          }
          icon={isAgency ? Building2 : FileCheck}
          isChecked={selected.includes("digitaliser")}
          onToggle={toggle}
        />

        <ObjectiveCard
          id="trouver_locataires"
          title={
            isAgency
              ? "Développer mon portefeuille & vitrine agence"
              : "Trouver de nouveaux locataires"
          }
          subtitle={
            isAgency
              ? "Mini-site agence public, publication d'annonces de lots vacants et acquisition de nouveaux mandats exclusifs."
              : "Publier des annonces de biens vacants, filtrer les dossiers candidats et plafonner la caution à 3 mois max (Loi 2022-30)."
          }
          icon={isAgency ? Megaphone : Sparkles}
          isChecked={selected.includes("trouver_locataires")}
          onToggle={toggle}
        />
      </div>
    </div>
  );
}
