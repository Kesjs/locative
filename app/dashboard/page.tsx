"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useUserProfile } from "@/hooks/useUserProfile";
import { KpiCard } from "@/components/dashboard/shared/KpiCard";
import { RecoveryGauge } from "@/components/dashboard/shared/RecoveryGauge";
import { RevenueChart } from "@/components/dashboard/shared/RevenueChart";
import { UrgentActionsList } from "@/components/dashboard/shared/UrgentActionsList";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Wallet, AlertCircle, PieChart, Landmark, HandCoins, FileCheck, Wrench } from "lucide-react";

export default function DashboardPage() {
  const { role } = useUserProfile();
  
  // Fake query
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboardStats", role],
    queryFn: async () => {
      // Simulate network
      await new Promise((resolve) => setTimeout(resolve, 600));
      return {
        objectifs: ["digitaliser", "trouver_locataires"],
        bailleur: {
          kpi: {
            totalEncasse: 1450000,
            resteRecouvrer: 350000,
            tauxOccupationStr: "4/5 biens loués",
            tauxOccupationPct: 80,
          },
          revenueData: [
            { month: "Jan", revenus: 1200000 },
            { month: "Fév", revenus: 1300000 },
            { month: "Mar", revenus: 1250000 },
            { month: "Avr", revenus: 1450000 },
            { month: "Mai", revenus: 1450000 },
            { month: "Juin", revenus: 1450000 },
          ],
          urgentActions: [
            { id: 1, name: "Koudjo Dossou", amountDue: 150000, daysLate: 6, phone: "+22997001122" },
          ],
        },
        agence: {
          kpi: {
            commissionsBrutes: 850000,
            volumeLoyers: 8500000,
            attenteReversement: 7650000,
            mandatsActifs: 24,
          },
          revenueData: [
            { month: "Jan", commissions: 700000, frais: 150000 },
            { month: "Fév", commissions: 750000, frais: 100000 },
            { month: "Mar", commissions: 720000, frais: 180000 },
            { month: "Avr", commissions: 800000, frais: 200000 },
            { month: "Mai", commissions: 810000, frais: 150000 },
            { month: "Juin", commissions: 850000, frais: 250000 },
          ],
        }
      };
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-20 bg-muted/60 animate-pulse rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="h-32 bg-muted/60 animate-pulse rounded-xl" />
          <div className="h-32 bg-muted/60 animate-pulse rounded-xl" />
          <div className="h-32 bg-muted/60 animate-pulse rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-6 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-[14px] font-medium">
        Une erreur est survenue lors du chargement des statistiques.
      </div>
    );
  }

  if (role === "Agence") {
    return (
      <div className="space-y-6">
        {/* CTA Banner Agence */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-card border border-border rounded-xl shadow-xs">
          <div>
            <h2 className="font-bold text-[16px] text-card-foreground">Développez votre portefeuille</h2>
            <p className="text-[13px] text-muted-foreground mt-0.5">Créez un mandat de gestion ou invitez un nouveau propriétaire.</p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-[13px] font-bold transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            Nouveau Mandat <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard title="Commissions" value={data.agence.kpi.commissionsBrutes} currency="FCFA" icon={HandCoins} iconColor="blue" />
          <KpiCard title="Volume Géré" value={data.agence.kpi.volumeLoyers} currency="FCFA" icon={Landmark} iconColor="emerald" />
          <KpiCard title="Reversements Attente" value={data.agence.kpi.attenteReversement} currency="FCFA" icon={AlertCircle} iconColor="amber" />
          <KpiCard title="Mandats Actifs" value={data.agence.kpi.mandatsActifs} icon={FileCheck} iconColor="blue" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Revenue Chart */}
            <div className="bg-card border border-border rounded-xl p-5 shadow-xs">
              <h3 className="text-[15px] font-bold text-card-foreground mb-4">Ventilation des Revenus</h3>
              <RevenueChart data={data.agence.revenueData} type="bar" dataKeys={["commissions", "frais"]} />
            </div>
          </div>
          <div className="space-y-6">
            {/* Quick Actions Component/Section */}
            <div className="bg-card border border-border rounded-xl p-5 shadow-xs">
              <h3 className="text-[15px] font-bold text-card-foreground mb-4">Actions Rapides</h3>
              <div className="flex flex-col gap-2">
                <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted/40 hover:bg-muted border border-border transition-colors text-[13px] font-semibold text-card-foreground text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <div className="bg-success/10 text-success p-1.5 rounded-md">
                    <Wallet className="w-4 h-4" />
                  </div>
                  Encaisser un loyer
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted/40 hover:bg-muted border border-border transition-colors text-[13px] font-semibold text-card-foreground text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <div className="bg-primary/10 text-primary p-1.5 rounded-md">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  Nouveau mandat
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Bailleur
  return (
    <div className="space-y-6">
      {/* CTA Banner Bailleur */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-card border border-border rounded-xl shadow-xs">
        <div>
          <h2 className="font-bold text-[16px] text-card-foreground">Performances de votre patrimoine</h2>
          <p className="text-[13px] text-muted-foreground mt-0.5">Suivi de rentabilité, états locatifs et reversements mensuels.</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-[13px] font-bold transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          Rapport Détaillé <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard title="Revenus nets reversés" value={data.bailleur.kpi.totalEncasse} currency="FCFA" delta={{ value: "+5%", trend: "up" }} icon={Wallet} iconColor="emerald" />
        <KpiCard title="Taux d'occupation" value={data.bailleur.kpi.tauxOccupationPct} valueSuffix="%" subtitle={data.bailleur.kpi.tauxOccupationStr} icon={PieChart} iconColor="blue" />
        <KpiCard title="Dépenses (Travaux & Frais)" value={150000} currency="FCFA" delta={{ value: "-2%", trend: "down" }} icon={Wrench} iconColor="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-xl p-5 shadow-xs">
            <h3 className="text-[15px] font-bold text-card-foreground mb-4">Évolution des Loyers</h3>
            <RevenueChart data={data.bailleur.revenueData} type="bar" dataKeys={["revenus"]} />
          </div>

          <div className="bg-card border border-border rounded-xl p-5 shadow-xs">
            <h3 className="text-[15px] font-bold text-card-foreground mb-4">Actions Urgentes</h3>
            <UrgentActionsList items={data.bailleur.urgentActions} onRelance={() => {}} />
          </div>
        </div>

        {/* Right Column / Quick Actions */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-5 shadow-xs flex flex-col items-center justify-center min-h-[220px]">
            <RecoveryGauge percentage={90} label="Taux de recouvrement" />
          </div>

          <div className="bg-card border border-border rounded-xl p-5 shadow-xs">
            <h3 className="text-[15px] font-bold text-card-foreground mb-4">Actions Rapides</h3>
            <div className="flex flex-col gap-2">
              <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted/40 hover:bg-muted border border-border transition-colors text-[13px] font-semibold text-card-foreground text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <div className="bg-primary/10 text-primary p-1.5 rounded-md">
                  <Landmark className="w-4 h-4" />
                </div>
                Ajouter un nouveau bien
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted/40 hover:bg-muted border border-border transition-colors text-[13px] font-semibold text-card-foreground text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <div className="bg-success/10 text-success p-1.5 rounded-md">
                  <Wallet className="w-4 h-4" />
                </div>
                Enregistrer un paiement
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted/40 hover:bg-muted border border-border transition-colors text-[13px] font-semibold text-card-foreground text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <div className="bg-destructive/10 text-destructive p-1.5 rounded-md">
                  <Wrench className="w-4 h-4" />
                </div>
                Créer un ticket travaux
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
