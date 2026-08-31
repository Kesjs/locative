"use client";

import React from "react";
import Header from "@/components/dashboard/Header";
import { ServerIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

export default function AdminSystemePage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-4">
      <Header breadcrumbs={["Tableau de bord Admin", "Système"]} />

      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-extrabold text-[var(--text-primary)] tracking-tight">
            État du Système
          </h1>
          <p className="text-[14px] text-[var(--text-secondary)] mt-1">
            Surveillez les performances et la base de données.
          </p>
        </div>
        <button className="bg-[var(--bg-subtle)] border border-[var(--border-default)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] px-4 py-2 rounded-[8px] font-bold text-[13px] shadow-sm transition-all flex items-center gap-2">
          <ArrowPathIcon className="h-4 w-4" />
          Actualiser
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[12px] p-6 shadow-2xs">
          <div className="flex items-center gap-3 mb-4">
            <ServerIcon className="h-6 w-6 text-emerald-500" />
            <h3 className="text-[16px] font-bold text-[var(--text-primary)]">Services API (Supabase)</h3>
          </div>
          <div className="space-y-4 text-[13px]">
            <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-2">
              <span className="text-[var(--text-secondary)]">Statut global</span>
              <span className="font-bold text-emerald-500">Opérationnel</span>
            </div>
            <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-2">
              <span className="text-[var(--text-secondary)]">Latence moyenne</span>
              <span className="font-semibold text-[var(--text-primary)]">42ms</span>
            </div>
            <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-2">
              <span className="text-[var(--text-secondary)]">Uptime</span>
              <span className="font-semibold text-[var(--text-primary)]">99.98%</span>
            </div>
          </div>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[12px] p-6 shadow-2xs">
          <h3 className="text-[16px] font-bold text-[var(--text-primary)] mb-4">Logs Récents</h3>
          <div className="space-y-3 text-[12px] font-mono text-[var(--text-secondary)]">
            <div className="p-2 bg-[var(--bg-subtle)] rounded border border-[var(--border-default)]">
              <span className="text-blue-500">[INFO]</span> 2026-08-31 08:14:22 - Authentification réussie (Koudjo Dossou)
            </div>
            <div className="p-2 bg-[var(--bg-subtle)] rounded border border-[var(--border-default)]">
              <span className="text-amber-500">[WARN]</span> 2026-08-31 07:55:10 - Limite API proche (MTN MoMo Gateway)
            </div>
            <div className="p-2 bg-[var(--bg-subtle)] rounded border border-[var(--border-default)]">
              <span className="text-blue-500">[INFO]</span> 2026-08-31 07:42:01 - CRON Job (Rappels loyers) exécuté avec succès
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
