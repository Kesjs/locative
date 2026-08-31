"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useUserProfile } from "@/hooks/useUserProfile";
import { KpiCard } from "@/components/dashboard/shared/KpiCard";
import { RecoveryGauge } from "@/components/dashboard/shared/RecoveryGauge";
import { RevenueChart } from "@/components/dashboard/shared/RevenueChart";
import { UrgentActionsList } from "@/components/dashboard/shared/UrgentActionsList";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Wallet, AlertCircle, PieChart, Landmark, HandCoins, FileCheck } from "lucide-react";

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
        <div className="h-20 bg-[var(--bg-surface)] animate-pulse rounded-[8px]" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="h-32 bg-[var(--bg-surface)] animate-pulse rounded-[12px]" />
          <div className="h-32 bg-[var(--bg-surface)] animate-pulse rounded-[12px]" />
          <div className="h-32 bg-[var(--bg-surface)] animate-pulse rounded-[12px]" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-[8px]">
        Une erreur est survenue lors du chargement des statistiques.
      </div>
    );
  }

  if (role === "Agence") {
    return (
      <div className="space-y-6">
        {/* CTA Banner Agence */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white rounded-[12px] shadow-md border border-blue-500/20">
          <span className="font-semibold text-[15px] sm:text-[16px]">Créer un nouveau mandat propriétaire</span>
          <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-blue-900 rounded-[8px] text-[13px] font-bold hover:bg-blue-50 transition-colors shadow-sm">
            Commencer <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard title="Commissions" value={data.agence.kpi.commissionsBrutes} currency="FCFA" icon={HandCoins} iconColor="blue" />
          <KpiCard title="Volume Géré" value={data.agence.kpi.volumeLoyers} currency="FCFA" icon={Landmark} iconColor="emerald" />
          <KpiCard title="Reversements Attente" value={data.agence.kpi.attenteReversement} currency="FCFA" icon={AlertCircle} iconColor="amber" />
          <KpiCard title="Mandats Actifs" value={data.agence.kpi.mandatsActifs} icon={FileCheck} iconColor="blue" />
        </div>

        {/* Revenue Chart */}
        <div className="bg-white border border-[#E8E5E0] rounded-[12px] p-5 shadow-xs">
          <h3 className="text-[14px] font-bold text-[#1C1C1C] mb-4">Ventilation des Revenus</h3>
          <RevenueChart data={data.agence.revenueData} type="bar" dataKeys={["commissions", "frais"]} />
        </div>
      </div>
    );
  }

  // Bailleur
  return (
    <div className="space-y-6">
      {/* CTA Banner Bailleur */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white rounded-[12px] shadow-md border border-blue-500/20">
        <span className="font-semibold text-[15px] sm:text-[16px]">Inviter mon locataire sur le portail</span>
        <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-blue-900 rounded-[8px] text-[13px] font-bold hover:bg-blue-50 transition-colors shadow-sm">
          Inviter <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard title="Encaissé ce mois" value={data.bailleur.kpi.totalEncasse} currency="FCFA" delta={{ value: "+5%", trend: "up" }} icon={Wallet} iconColor="emerald" />
        <KpiCard title="Reste à recouvrer" value={data.bailleur.kpi.resteRecouvrer} currency="FCFA" delta={{ value: "-2%", trend: "down" }} icon={AlertCircle} iconColor="amber" />
        <KpiCard title="Occupation" value={data.bailleur.kpi.tauxOccupationPct} valueSuffix="%" subtitle={data.bailleur.kpi.tauxOccupationStr} icon={PieChart} iconColor="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recovery & Chart */}
        <div className="bg-white border border-[#E8E5E0] rounded-[12px] p-5 shadow-xs flex flex-col items-center justify-center">
          <RecoveryGauge percentage={90} label="Taux de recouvrement" />
        </div>
        <div className="bg-white border border-[#E8E5E0] rounded-[12px] p-5 shadow-xs">
          <h3 className="text-[14px] font-bold text-[#1C1C1C] mb-4">Évolution des Loyers</h3>
          <RevenueChart data={data.bailleur.revenueData} type="area" dataKeys={["revenus"]} />
        </div>
      </div>

      {/* Urgent Actions */}
      <div className="bg-[#FAF9F6] border border-[#E8E5E0] rounded-[12px] p-5 shadow-xs">
        <h3 className="text-[14px] font-bold text-[#1C1C1C] mb-4">Actions Urgentes</h3>
        <UrgentActionsList items={data.bailleur.urgentActions} onRelance={() => {}} />
      </div>
    </div>
  );
}
