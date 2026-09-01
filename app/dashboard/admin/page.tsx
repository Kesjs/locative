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
      <div className="space-y-6 pb-12">
        <div className="h-20 bg-muted/60 animate-pulse rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[120px] rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[300px] rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-card border border-border rounded-xl shadow-xs">
        <div>
          <h1 className="text-[20px] font-extrabold text-card-foreground tracking-tight">Supervision Plateforme Lokka</h1>
          <p className="text-[13px] text-muted-foreground mt-1">Gérez les agences, surveillez le MRR et les métriques système en temps réel.</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-[13px] font-bold transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          Générer Rapport Global
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard
          title="Agences Actives"
          value={(stats?.totalAgences || 0) + (stats?.totalBailleurs || 0)}
          subtitle={`${stats?.totalAgences || 0} Agences / ${stats?.totalBailleurs || 0} Bailleurs`}
          icon={Building2}
          iconColor="blue"
          trend="+12% ce mois"
          trendUp={true}
        />
        <KpiCard
          title="Nouveaux Utilisateurs"
          value={stats?.totalLocataires || 0}
          subtitle="Utilisateurs actifs plateforme"
          icon={Users}
          iconColor="emerald"
          trend="+5% ce mois"
          trendUp={true}
        />
        <KpiCard
          title="Volume Transactions"
          value={stats?.transactionsMois || 0}
          currency="FCFA"
          subtitle="Loyers perçus via MoMo/Virement"
          icon={DollarSign}
          iconColor="blue"
          trend="+18% vs mois préc."
          trendUp={true}
        />
        <KpiCard
          title="MRR (Abonnements)"
          value={stats?.revenusLokka || 0}
          currency="FCFA"
          subtitle="Frais et abonnements (Estimation)"
          icon={Activity}
          iconColor="amber"
          trend="+22% ce mois"
          trendUp={true}
        />
      </div>

      <div className="bg-card border border-border rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-bold text-card-foreground">Abonnements Récents (Agences)</h3>
        </div>
        <DataTable
          data={abonnements?.slice(0, 5) || []}
          columns={[
            { header: "Agence", accessorKey: "agence" },
            {
              header: "Plan",
              accessorKey: "plan",
              cell: (row) => (
                <span className="font-semibold text-card-foreground">{row.plan}</span>
              ),
            },
            {
              header: "Statut",
              accessorKey: "statut",
              cell: (row) => (
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                  row.statut === "Actif" ? "bg-success/10 text-success border-success/20" :
                  row.statut === "Impayé" ? "bg-destructive/10 text-destructive border-destructive/20" :
                  "bg-warning/10 text-warning border-warning/20"
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

