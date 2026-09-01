"use client";

import React, { useMemo } from "react";
import { UsersIcon, ExclamationTriangleIcon, ClockIcon, BanknotesIcon } from "@heroicons/react/24/outline";
import { KpiCard } from "@/components/dashboard/shared/KpiCard";
import type { LeaseWithDetails } from "@/lib/hooks/useLocataires";
import { joursAvantEcheanceBail } from "@/lib/hooks/useLocataires";

export function LocatairesKpis({ leases }: { leases: LeaseWithDetails[] }) {
  const stats = useMemo(() => {
    const actifs = leases.filter((l) => l.is_active);
    const echeance60j = actifs.filter((l) => {
      const j = joursAvantEcheanceBail(l);
      return j !== null && j <= 60 && j >= 0;
    });
    const enRetard = actifs.filter((l) => (l.balance_due || 0) > 0);
    const totalDu = enRetard.reduce((sum, l) => sum + (l.balance_due || 0), 0);

    return { actifs: actifs.length, echeance60j: echeance60j.length, enRetard: enRetard.length, totalDu };
  }, [leases]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard title="Locataires actifs" value={stats.actifs} icon={UsersIcon} iconColor="default" />
      <KpiCard
        title="Baux à échéance"
        value={stats.echeance60j}
        subtitle="Dans les 60 prochains jours"
        icon={ClockIcon}
        iconColor="amber"
      />
      <KpiCard
        title="Locataires en retard"
        value={stats.enRetard}
        subtitle={stats.enRetard > 0 ? "Nécessite une relance" : undefined}
        icon={ExclamationTriangleIcon}
        iconColor="amber"
      />
      <KpiCard title="Total impayés" value={stats.totalDu} currency="FCFA" icon={BanknotesIcon} iconColor="blue" />
    </div>
  );
}
