"use client";

import React from "react";
import Header from "@/components/dashboard/Header";

export default function LocataireParametresPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-4">
      <Header breadcrumbs={["Tableau de bord", "Paramètres"]} />

      <div className="mb-6">
        <h1 className="text-[24px] font-extrabold text-[var(--text-primary)] tracking-tight">
          Paramètres du compte
        </h1>
        <p className="text-[14px] text-[var(--text-secondary)] mt-1">
          Gérez vos informations personnelles et vos préférences.
        </p>
      </div>

      <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[12px] p-6 shadow-2xs">
        <h3 className="text-[15px] font-bold text-[var(--text-primary)] mb-4">Profil Locataire</h3>
        <p className="text-[13px] text-[var(--text-secondary)]">Paramètres de profil en cours de développement...</p>
      </div>
    </div>
  );
}
