import React from "react";
import { type Objectif } from "../_types";
import { ObjectiveCard } from "./ObjectiveCard";

interface StepObjectifsProps {
  selected: Objectif[];
  onChange: (selected: Objectif[]) => void;
}

export function StepObjectifs({ selected, onChange }: StepObjectifsProps) {
  const toggle = (id: Objectif) => {
    if (selected.includes(id)) {
      onChange(selected.filter((x) => x !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[22px] sm:text-[26px] font-extrabold text-[#0F172A] tracking-tight leading-tight">
          Quels sont vos objectifs ?
        </h2>
        <p className="text-[13px] text-[#64635F] mt-1.5">
          Sélectionnez ce que vous souhaitez accomplir (plusieurs choix possibles).
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <ObjectiveCard
          id="digitaliser"
          title="Digitaliser ma gestion en cours"
          subtitle="Gérer les quittances, suivre les encaissements et automatiser les relances de vos locataires actuels."
          isChecked={selected.includes("digitaliser")}
          onToggle={toggle}
        />
        
        <ObjectiveCard
          id="trouver_locataires"
          title="Trouver de nouveaux locataires"
          subtitle="Publier des annonces, recevoir des dossiers vérifiés et organiser des visites pour vos biens vacants."
          isChecked={selected.includes("trouver_locataires")}
          onToggle={toggle}
        />
      </div>
    </div>
  );
}
