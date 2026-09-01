"use client";

import React from "react";
import Header from "@/components/dashboard/Header";
import { ServerIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

export default function AdminSystemePage() {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-card border border-border rounded-xl shadow-xs">
        <div>
          <h1 className="text-[20px] font-extrabold text-card-foreground tracking-tight">
            État &amp; Santé du Système
          </h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            Surveillez les performances des bases de données Postgres, du stockage Supabase et des passerelles Mobile Money.
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-card border border-border text-foreground hover:bg-accent rounded-lg font-bold text-[13px] shadow-xs transition-all cursor-pointer">
          <ArrowPathIcon className="h-4 w-4" />
          Actualiser les métriques
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-xs">
          <div className="flex items-center gap-3 mb-4">
            <ServerIcon className="h-6 w-6 text-success" />
            <h3 className="text-[16px] font-bold text-card-foreground">Services Supabase &amp; API</h3>
          </div>
          <div className="space-y-4 text-[13px]">
            <div className="flex justify-between items-center border-b border-border pb-2">
              <span className="text-muted-foreground">Base de données Postgres</span>
              <span className="font-bold text-success flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-success"></span>
                Opérationnel
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-border pb-2">
              <span className="text-muted-foreground">Passerelle MTN MoMo / Moov</span>
              <span className="font-bold text-success flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-success"></span>
                Opérationnel
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-border pb-2">
              <span className="text-muted-foreground">Latence moyenne</span>
              <span className="font-semibold text-card-foreground tabular-nums">38 ms</span>
            </div>
            <div className="flex justify-between items-center border-b border-border pb-2">
              <span className="text-muted-foreground">Disponibilité (Uptime 30j)</span>
              <span className="font-semibold text-card-foreground tabular-nums">99.98%</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-xs">
          <h3 className="text-[16px] font-bold text-card-foreground mb-4">Journal d&apos;Événements Récents</h3>
          <div className="space-y-3 text-[12px] font-mono">
            <div className="p-3 bg-muted/20 rounded-lg border border-border">
              <span className="text-primary font-bold">[INFO]</span> 2026-09-01 09:55:00 - Quittance certifiée générée avec QR Code (LOK-2026-01)
            </div>
            <div className="p-3 bg-muted/20 rounded-lg border border-border">
              <span className="text-success font-bold">[AUTH]</span> 2026-09-01 09:30:12 - Connexion sécurisée OTP validée (Bailleur Cotonou)
            </div>
            <div className="p-3 bg-muted/20 rounded-lg border border-border">
              <span className="text-primary font-bold">[CRON]</span> 2026-09-01 08:00:00 - Vérification des échéances de loyers exécutée avec succès
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
