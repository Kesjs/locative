"use client";

import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { KpiCard } from "@/components/dashboard/shared/KpiCard";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 400));
      return {
        mrr: 1250000,
        portes: 1245,
        repartition: [
          { name: "Bailleurs Pro", value: 450 },
          { name: "Agences", value: 120 },
        ],
      };
    },
  });

  const COLORS = ["#0F172A", "#C5A880"];
  const chartKey = useMemo(() => `chart-${data?.repartition?.length || 0}`, [data]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="h-32 bg-gray-200 animate-pulse rounded-[12px]" />
          <div className="h-32 bg-gray-200 animate-pulse rounded-[12px]" />
          <div className="h-32 bg-gray-200 animate-pulse rounded-[12px]" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-[24px] font-extrabold text-[var(--text-primary)]">Vue d'ensemble</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard title="MRR (Revenu Récurrent)" value={data.mrr} currency="FCFA" delta={{ value: "+12%", trend: "up" }} />
        <KpiCard title="Portes Actives" value={data.portes} delta={{ value: "+45", trend: "up" }} />
        
        {/* Donut Chart */}
        <div className="bg-white border border-[#E8E5E0] rounded-[12px] p-5 shadow-xs flex flex-col justify-center">
          <h3 className="text-[12px] text-[var(--text-secondary)] font-medium mb-2">Répartition Comptes</h3>
          <div className="h-[120px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart key={chartKey}>
                <Pie
                  data={data.repartition}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={55}
                  paddingAngle={2}
                  dataKey="value"
                  isAnimationActive={true}
                  animationDuration={600}
                  stroke="none"
                >
                  {data.repartition.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#0F172A", border: "none", borderRadius: 8, padding: "8px 12px" }}
                  itemStyle={{ color: "#FAF9F6", fontSize: 12, fontWeight: 600 }}
                  formatter={(val: any, name: any) => [val, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2 text-[10px] font-bold text-[#64635F]">
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#0F172A]"></span> Bailleurs</div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#C5A880]"></span> Agences</div>
          </div>
        </div>
      </div>
    </div>
  );
}
