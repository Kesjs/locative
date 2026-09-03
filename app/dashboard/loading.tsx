import React from "react";
import { Building2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="w-full min-h-screen bg-[#F8FAF9] p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-300">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/70">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-100/60 flex items-center justify-center animate-pulse">
              <Building2 className="w-5 h-5 text-emerald-700" />
            </div>
            <div className="h-8 w-48 bg-slate-200/80 rounded-lg animate-pulse" />
          </div>
          <div className="h-4 w-72 bg-slate-200/60 rounded animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-28 bg-slate-200/70 rounded-xl animate-pulse" />
          <div className="h-10 w-36 bg-emerald-200/50 rounded-xl animate-pulse" />
        </div>
      </div>

      {/* 4 KPIs Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-white border border-slate-200/70 shadow-2xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-slate-200/70 rounded animate-pulse" />
              <div className="h-8 w-8 rounded-lg bg-slate-100 animate-pulse" />
            </div>
            <div className="h-7 w-32 bg-slate-200/90 rounded animate-pulse" />
            <div className="h-3.5 w-40 bg-slate-100 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Main Grid: Chart & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200/70 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-5 w-44 bg-slate-200/80 rounded animate-pulse" />
            <div className="h-4 w-20 bg-slate-100 rounded animate-pulse" />
          </div>
          <div className="h-64 w-full bg-slate-50/80 rounded-xl flex items-end justify-between p-4 gap-2">
            {[40, 65, 80, 50, 90, 75, 85].map((h, idx) => (
              <div
                key={idx}
                style={{ height: `${h}%` }}
                className="w-full bg-slate-200/60 rounded-t-md animate-pulse"
              />
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/70 shadow-2xs space-y-4">
          <div className="h-5 w-36 bg-slate-200/80 rounded animate-pulse" />
          <div className="space-y-3 pt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 space-y-2">
                <div className="h-4 w-3/4 bg-slate-200/70 rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-slate-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
