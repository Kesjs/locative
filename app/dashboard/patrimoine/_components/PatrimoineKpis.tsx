"use client";

import React, { useMemo } from "react";
import { BuildingOffice2Icon, BanknotesIcon, ChartBarIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { KpiCard } from "@/components/dashboard/shared/KpiCard";
import type { Bien } from "@/lib/hooks/useBiens";
import type { LoyerTransaction } from "@/lib/hooks/useLoyers";

interface PatrimoineKpisProps {
  biens: Bien[];
  loyers: LoyerTransaction[];
  onFilterVacants30j: () => void;
}

const JOUR_MS = 1000 * 60 * 60 * 24;

export function PatrimoineKpis({ biens, loyers, onFilterVacants30j }: PatrimoineKpisProps) {
  const stats = useMemo(() => {
    const total = biens.length;
    const loues = biens.filter((b) => b.statut === "loué").length;
    const vacants = biens.filter((b) => b.statut === "vacant").length;
    const travaux = biens.filter((b) => b.statut === "travaux").length;

    const revenuPotentiel = biens.reduce((sum, b) => sum + (b.loyer_mensuel || 0), 0);

    const now = new Date();
    const moisCourant = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const revenuEncaisse = loyers
      .filter((t) => t.statut === "payé" && t.date_reglement && t.date_reglement.includes(moisCourant.split("-")[1]))
      .reduce((sum, t) => sum + (t.montant || 0), 0);

    const tauxOccupation = total > 0 ? Math.round((loues / total) * 100) : 0;

    const vacants30j = biens.filter((b) => {
      if (b.statut !== "vacant" || !b.created_at) return false;
      const diffJours = (now.getTime() - new Date(b.created_at).getTime()) / JOUR_MS;
      return diffJours > 30;
    }).length;

    return { total, loues, vacants, travaux, revenuPotentiel, revenuEncaisse, tauxOccupation, vacants30j };
  }, [biens, loyers]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Biens au total"
          value={stats.total}
          subtitle={`${stats.loues} loué${stats.loues > 1 ? "s" : ""} · ${stats.vacants} vacant${stats.vacants > 1 ? "s" : ""} · ${stats.travaux} en travaux`}
          icon={BuildingOffice2Icon}
          iconColor="default"
        />
        <KpiCard
          title="Revenu locatif potentiel"
          value={stats.revenuPotentiel}
          currency="FCFA"
          subtitle="Somme des loyers mensuels"
          icon={ChartBarIcon}
          iconColor="blue"
        />
        <KpiCard
          title="Encaissé ce mois"
          value={stats.revenuEncaisse}
          currency="FCFA"
          subtitle={stats.revenuPotentiel > 0 ? `${Math.round((stats.revenuEncaisse / stats.revenuPotentiel) * 100)}% du potentiel` : undefined}
          icon={BanknotesIcon}
          iconColor="emerald"
        />
        <KpiCard
          title="Taux d'occupation"
          value={stats.tauxOccupation}
          valueSuffix="%"
          subtitle={`${stats.loues} sur ${stats.total} biens`}
          icon={ChartBarIcon}
          iconColor="amber"
        />
      </div>

      {stats.vacants30j > 0 && (
        <button
          type="button"
          onClick={onFilterVacants30j}
          className="w-full flex items-center gap-2 px-4 py-2.5 bg-destructive/10 border border-destructive/20 rounded-lg text-[13px] font-semibold text-destructive hover:bg-destructive/15 transition-colors"
        >
          <ExclamationTriangleIcon className="w-4 h-4 shrink-0" />
          <span>
            {stats.vacants30j} bien{stats.vacants30j > 1 ? "s" : ""} vacant{stats.vacants30j > 1 ? "s" : ""} depuis plus de 30 jours — cliquez pour filtrer
          </span>
        </button>
      )}
    </div>
  );
}
