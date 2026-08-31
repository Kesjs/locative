"use client";

import React from "react";
import {
  UsersIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { useAdminStats, useAdminAbonnements } from "@/lib/hooks/useAdmin";
import { KpiCard } from "@/components/dashboard/shared/KpiCard";
import { DataTable } from "@/components/dashboard/shared/DataTable";
import Header from "@/components/dashboard/Header";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminOverviewPage() {
  const { data: stats, isLoading: loadingStats } = useAdminStats();
  const { data: abonnements, isLoading: loadingAbos } = useAdminAbonnements();

  if (loadingStats || loadingAbos) {
    return (
      <div className="p-6">
        <Header breadcrumbs={["Tableau de bord Admin", "Vue Globale"]} />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[120px] rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[300px] rounded-xl" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-4">
      <Header breadcrumbs={["Tableau de bord Admin", "Vue Globale"]} />

      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-extrabold text-[var(--text-primary)] tracking-tight">
            Plateforme Lokka HQ
          </h1>
          <p className="text-[14px] text-[var(--text-secondary)] mt-1">
            Indicateurs clés et métriques globales du système.
          </p>
        </div>
        <button className="bg-[#1C1C1C] dark:bg-white text-white dark:text-black hover:opacity-90 px-5 py-2.5 rounded-[8px] font-bold text-[13px] shadow-sm transition-all">
          Générer Rapport
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard
          title="Agences & Bailleurs"
          value={`${((stats?.totalAgences || 0) + (stats?.totalBailleurs || 0)).toLocaleString("fr-FR")}`}
          subtitle={`${stats?.totalAgences} Agences / ${stats?.totalBailleurs} Bailleurs`}
          icon={BuildingOfficeIcon}
          trend="+12% ce mois"
          trendUp={true}
        />
        <KpiCard
          title="Total Locataires"
          value={stats?.totalLocataires.toLocaleString("fr-FR") || "0"}
          subtitle="Utilisateurs actifs"
          icon={UsersIcon}
          trend="+5% ce mois"
          trendUp={true}
        />
        <KpiCard
          title="Volume Transactions"
          value={`${stats?.transactionsMois.toLocaleString("fr-FR")} FCFA`}
          subtitle="Loyers perçus via MoMo/Virement"
          icon={CurrencyDollarIcon}
          trend="+18% vs mois préc."
          trendUp={true}
        />
        <KpiCard
          title="Revenus Lokka"
          value={`${stats?.revenusLokka.toLocaleString("fr-FR")} FCFA`}
          subtitle="Frais et abonnements (Estimation)"
          icon={ChartBarIcon}
          trend="+22% ce mois"
          trendUp={true}
        />
      </div>

      <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[12px] p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-bold text-[var(--text-primary)]">Abonnements Récents (Agences)</h3>
        </div>
        <DataTable
          data={abonnements?.slice(0, 5) || []}
          columns={[
            { header: "Agence", accessorKey: "agence" },
            {
              header: "Plan",
              accessorKey: "plan",
              cell: (row) => (
                <span className="font-semibold text-[var(--text-primary)]">{row.plan}</span>
              ),
            },
            {
              header: "Statut",
              accessorKey: "statut",
              cell: (row) => (
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  row.statut === "Actif" ? "bg-emerald-100 text-emerald-700" :
                  row.statut === "Impayé" ? "bg-red-100 text-red-700" :
                  "bg-amber-100 text-amber-700"
                }`}>
                  {row.statut}
                </span>
              ),
            },
            { header: "Fin d'abonnement", accessorKey: "dateFin" },
          ]}
          searchKey="agence"
        />
      </div>
    </div>
  );
}

