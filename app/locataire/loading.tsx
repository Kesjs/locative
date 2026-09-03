import React from "react";
import { Building2 } from "lucide-react";

export default function LocataireLoading() {
  return (
    <div className="w-full min-h-screen bg-[#F4F9F6] p-4 sm:p-6 lg:p-8 space-y-6 animate-in fade-in duration-300">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-200/80">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-emerald-100/70 flex items-center justify-center animate-pulse">
              <Building2 className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="h-6 w-40 bg-slate-200/80 rounded animate-pulse" />
          </div>
          <div className="h-4 w-56 bg-slate-200/60 rounded animate-pulse" />
        </div>
        <div className="h-8 w-24 bg-emerald-100/60 rounded-full animate-pulse" />
      </div>

      {/* Hero Card Skeleton (Loyer à régler) */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/70 shadow-2xs space-y-4">
        <div className="h-4 w-32 bg-slate-200/70 rounded animate-pulse" />
        <div className="h-10 w-48 bg-slate-200/90 rounded animate-pulse" />
        <div className="h-4 w-64 bg-slate-100 rounded animate-pulse" />
        <div className="pt-2 flex gap-3">
          <div className="h-12 w-44 bg-emerald-200/60 rounded-xl animate-pulse" />
          <div className="h-12 w-36 bg-slate-100 rounded-xl animate-pulse" />
        </div>
      </div>

      {/* Grid: Compteurs & Quittances */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="p-5 rounded-2xl bg-white border border-slate-200/70 shadow-2xs space-y-3">
            <div className="h-4 w-28 bg-slate-200/70 rounded animate-pulse" />
            <div className="h-6 w-36 bg-slate-200/80 rounded animate-pulse" />
            <div className="h-3.5 w-48 bg-slate-100 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
