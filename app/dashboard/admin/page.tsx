"use client";

import React from "react";
import { useAdminStats, useAdminAbonnements } from "@/lib/hooks/useAdmin";
import { Building2, Users, DollarSign, Activity } from "lucide-react";
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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 text-white rounded-[12px] shadow-md border border-indigo-500/20 mb-6">
        <div>
          <h1 className="text-[20px] font-extrabold tracking-tight">Supervision Plateforme Lokka</h1>
          <p className="text-[13px] text-indigo-100 mt-1">Gérez les agences, surveillez le MRR et les métriques système.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-indigo-900 rounded-[8px] text-[13px] font-bold hover:bg-indigo-50 transition-colors shadow-sm">
          Générer Rapport Global
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard
          title="Agences Actives"
          value={(stats?.totalAgences || 0) + (stats?.totalBailleurs || 0)}
          subtitle={`${stats?.totalAgences} Agences / ${stats?.totalBailleurs} Bailleurs`}
          icon={Building2} iconColor="blue"
          trend="+12% ce mois"
          trendUp={true}
        />
        <KpiCard
          title="Nouveaux Utilisateurs"
          value={stats?.totalLocataires || 0}
          subtitle="Utilisateurs actifs"
          icon={Users} iconColor="emerald"
          trend="+5% ce mois"
          trendUp={true}
        />
        <KpiCard
          title="Volume Transactions"
          value={stats?.transactionsMois || 0} currency="FCFA"
          subtitle="Loyers perçus via MoMo/Virement"
          icon={DollarSign} iconColor="blue"
          trend="+18% vs mois préc."
          trendUp={true}
        />
        <KpiCard
          title="MRR (Abonnements)"
          value={stats?.revenusLokka || 0} currency="FCFA"
          subtitle="Frais et abonnements (Estimation)"
          icon={Activity} iconColor="amber"
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

