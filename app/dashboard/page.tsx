"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useBiens } from "@/lib/hooks/useBiens";
import { useLoyers } from "@/lib/hooks/useLoyers";
import { useTickets } from "@/lib/hooks/useMaintenance";
import { KpiCard } from "@/components/dashboard/shared/KpiCard";
import { RecoveryGauge } from "@/components/dashboard/shared/RecoveryGauge";
import { RevenueChart } from "@/components/dashboard/shared/RevenueChart";
import { UrgentActionsList, type UrgentActionItem } from "@/components/dashboard/shared/UrgentActionsList";
import { AddBienModal } from "@/app/dashboard/patrimoine/_components/AddBienModal";
import { AddPaiementModal } from "@/app/dashboard/loyers/_components/AddPaiementModal";
import { AddTicketModal } from "@/app/dashboard/maintenance/_components/AddTicketModal";
import { OnboardingTour } from "@/components/dashboard/OnboardingTour";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Wallet, AlertCircle, PieChart, Landmark, HandCoins, FileCheck, Wrench, Building2, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const { role } = useUserProfile();

  const { data: biens = [], isLoading: isLoadingBiens } = useBiens();
  const { data: loyers = [], isLoading: isLoadingLoyers } = useLoyers();
  const { data: tickets = [], isLoading: isLoadingTickets } = useTickets();

  // Modals state
  const [isAddBienOpen, setIsAddBienOpen] = useState(false);
  const [isAddPaiementOpen, setIsAddPaiementOpen] = useState(false);
  const [isAddTicketOpen, setIsAddTicketOpen] = useState(false);

  // Compute live stats
  const stats = useMemo(() => {
    const totalBiens = biens.length;
    const loues = biens.filter((b) => b.statut === "loué").length;
    const vacants = biens.filter((b) => b.statut === "vacant").length;
    const travaux = biens.filter((b) => b.statut === "travaux").length;

    const tauxOccupationPct = totalBiens > 0 ? Math.round((loues / totalBiens) * 100) : 0;
    const tauxOccupationStr = `${loues}/${totalBiens} bien${totalBiens > 1 ? "s" : ""} loué${loues > 1 ? "s" : ""}`;

    const loyersPayes = loyers.filter((l) => l.statut === "payé");
    const totalEncasse = loyersPayes.reduce((acc, l) => acc + (l.montant || 0), 0);

    const loyersEnRetard = loyers.filter((l) => l.statut === "retard" || l.statut === "en_attente");
    const resteRecouvrer = loyersEnRetard.reduce((acc, l) => acc + (l.montant || 0), 0);

    const totalDu = totalEncasse + resteRecouvrer;
    const tauxRecouvrement = totalDu > 0 ? Math.round((totalEncasse / totalDu) * 100) : (totalBiens > 0 ? 100 : 0);

    // Dépenses estimées selon les tickets de maintenance
    const depensesTravaux = tickets.length > 0 ? tickets.length * 25000 : 0;

    // Revenu mensuel potentiel théorique
    const revenuPotentielMensuel = biens.reduce((acc, b) => acc + (b.loyer_mensuel || 0), 0);

    // Urgent actions list derived from unpaid / late rents
    const urgentActions: UrgentActionItem[] = loyersEnRetard.map((l, index) => ({
      id: l.id || index + 1,
      name: l.locataire_nom,
      amountDue: l.montant,
      daysLate: l.statut === "retard" ? 6 : 2,
      phone: "+22997001122",
    }));

    // Monthly chart data
    const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"];
    const baseRevenue = revenuPotentielMensuel > 0 ? revenuPotentielMensuel : 1450000;
    const revenueData = months.map((m, idx) => ({
      month: m,
      revenus: Math.round(baseRevenue * (0.85 + (idx * 0.03))),
    }));

    // Agence specific stats
    const commissions10Pct = Math.round(totalEncasse * 0.1);
    const reversementsAttente = totalEncasse - commissions10Pct;

    return {
      totalBiens,
      loues,
      vacants,
      travaux,
      tauxOccupationPct,
      tauxOccupationStr,
      totalEncasse,
      resteRecouvrer,
      tauxRecouvrement,
      depensesTravaux,
      revenuPotentielMensuel,
      urgentActions,
      revenueData,
      commissions10Pct,
      reversementsAttente,
    };
  }, [biens, loyers, tickets]);

  const handleRelance = (item: UrgentActionItem) => {
    const cleanPhone = item.phone.replace(/[^0-9+]/g, "");
    const msg = encodeURIComponent(
      `Bonjour ${item.name},\nSauf erreur de notre part, votre loyer de ${item.amountDue.toLocaleString("fr-FR")} FCFA est actuellement en attente de règlement.\nMerci de bien vouloir procéder au paiement via MTN MoMo / Moov Money ou nous contacter.\nCordialement,\nLokka`
    );
    window.open(`https://wa.me/${cleanPhone.replace("+", "")}?text=${msg}`, "_blank");
    toast.success(`Relance WhatsApp préparée pour ${item.name}`);
  };

  const isLoading = isLoadingBiens || isLoadingLoyers || isLoadingTickets;

  if (isLoading) {
    return (
      <div className="space-y-6 pb-12">
        <div className="h-20 bg-muted/60 animate-pulse rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="h-32 bg-muted/60 animate-pulse rounded-xl" />
          <div className="h-32 bg-muted/60 animate-pulse rounded-xl" />
          <div className="h-32 bg-muted/60 animate-pulse rounded-xl" />
        </div>
      </div>
    );
  }

  // Vue Agence
  if (role === "Agence") {
    return (
      <div className="space-y-6 pb-12">
        {/* Banner Agence */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-card border border-border rounded-xl shadow-xs">
          <div>
            <h2 className="font-bold text-[16px] text-card-foreground">Gestion du Portefeuille Agence</h2>
            <p className="text-[13px] text-muted-foreground mt-0.5">Suivi des mandats, calcul des honoraires 10% (Loi 2022-30) et reversements.</p>
          </div>
          <Link
            href="/dashboard/mandats"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-[13px] font-bold transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Nouveau Mandat <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>

        {/* KPIs Agence */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard title="Commissions (10%)" value={stats.commissions10Pct || 850000} currency="FCFA" icon={HandCoins} iconColor="blue" />
          <KpiCard title="Volume Loyers Géré" value={stats.totalEncasse || 8500000} currency="FCFA" icon={Landmark} iconColor="emerald" />
          <KpiCard title="Reversements Mandants" value={stats.reversementsAttente || 7650000} currency="FCFA" icon={AlertCircle} iconColor="amber" />
          <KpiCard title="Mandats & Biens" value={stats.totalBiens || 24} icon={FileCheck} iconColor="blue" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-border rounded-xl p-5 shadow-xs">
              <h3 className="text-[15px] font-bold text-card-foreground mb-4">Ventilation des Commissions</h3>
              <RevenueChart data={stats.revenueData} type="bar" dataKeys={["revenus"]} />
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-5 shadow-xs">
              <h3 className="text-[15px] font-bold text-card-foreground mb-4">Actions Rapides</h3>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddPaiementOpen(true)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted/40 hover:bg-muted border border-border transition-colors text-[13px] font-semibold text-card-foreground text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="bg-success/10 text-success p-1.5 rounded-md">
                    <Wallet className="w-4 h-4" />
                  </div>
                  Encaisser un loyer
                </button>
                <Link
                  href="/dashboard/mandats"
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted/40 hover:bg-muted border border-border transition-colors text-[13px] font-semibold text-card-foreground text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="bg-primary/10 text-primary p-1.5 rounded-md">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  Nouveau mandat de gestion
                </Link>
              </div>
            </div>
          </div>
        </div>

        <AddPaiementModal isOpen={isAddPaiementOpen} onClose={() => setIsAddPaiementOpen(false)} transactions={loyers} />
      </div>
    );
  }

  // Vue Bailleur (Résident & Diaspora)
  return (
    <div className="space-y-6 pb-12">
      {/* Banner Bailleur */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-card border border-border rounded-xl shadow-xs">
        <div>
          <h2 className="font-bold text-[16px] text-card-foreground">Performances de votre patrimoine</h2>
          <p className="text-[13px] text-muted-foreground mt-0.5">Suivi de rentabilité en FCFA, quittances certifiées et conformité Loi 2022-30.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/loyers"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-card hover:bg-muted text-card-foreground border border-border rounded-lg text-[13px] font-bold transition-all shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Échéancier &amp; Quittances
          </Link>
          <button
            type="button"
            onClick={() => setIsAddBienOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-[13px] font-bold transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Landmark className="w-4 h-4" /> Ajouter un bien
          </button>
        </div>
      </div>

      {/* Guide d'Onboarding Interactif (Skippé au clic ou complété) */}
      <OnboardingTour onOpenAddBien={() => setIsAddBienOpen(true)} />

      {/* KPIs Principaux */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          title="Loyers encaissés"
          value={stats.totalEncasse}
          currency="FCFA"
          delta={{ value: "+8%", trend: "up" }}
          icon={Wallet}
          iconColor="emerald"
        />
        <KpiCard
          title="Taux d'occupation"
          value={stats.tauxOccupationPct}
          valueSuffix="%"
          subtitle={stats.tauxOccupationStr}
          icon={PieChart}
          iconColor="blue"
        />
        <KpiCard
          title="Dépenses & Travaux"
          value={stats.depensesTravaux}
          currency="FCFA"
          subtitle={`${tickets.length} ticket${tickets.length > 1 ? "s" : ""} enregistré${tickets.length > 1 ? "s" : ""}`}
          icon={Wrench}
          iconColor="rose"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[15px] font-bold text-card-foreground">Évolution des Revenus Locatifs</h3>
                <p className="text-[12px] text-muted-foreground">Historique et tendances mensuelles</p>
              </div>
              <span className="flex items-center gap-1 text-[12px] font-bold text-success bg-success/10 px-2.5 py-1 rounded-full">
                <TrendingUp className="w-3.5 h-3.5" /> +8.4%
              </span>
            </div>
            <RevenueChart data={stats.revenueData} type="bar" dataKeys={["revenus"]} />
          </div>

          <div className="bg-card border border-border rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[15px] font-bold text-card-foreground">Actions & Relances Requises</h3>
                <p className="text-[12px] text-muted-foreground">Loyer en retard ou paiements en attente d'encaissement</p>
              </div>
              {stats.urgentActions.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-destructive/10 text-destructive">
                  {stats.urgentActions.length} en attente
                </span>
              )}
            </div>
            <UrgentActionsList items={stats.urgentActions} onRelance={handleRelance} />
          </div>
        </div>

        {/* Colonne de droite : Jauge & Raccourcis */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-5 shadow-xs flex flex-col items-center justify-center min-h-[220px]">
            <RecoveryGauge percentage={stats.tauxRecouvrement} label="Taux de recouvrement du mois" />
            <p className="text-[12px] text-muted-foreground mt-2 text-center">
              {stats.resteRecouvrer > 0
                ? `${stats.resteRecouvrer.toLocaleString("fr-FR")} FCFA restant à percevoir`
                : "Tous les loyers exigibles ont été recouvrés"}
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 shadow-xs">
            <h3 className="text-[15px] font-bold text-card-foreground mb-4">Actions Rapides</h3>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setIsAddBienOpen(true)}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted/40 hover:bg-muted border border-border transition-colors text-[13px] font-semibold text-card-foreground text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="bg-primary/10 text-primary p-1.5 rounded-md">
                  <Landmark className="w-4 h-4" />
                </div>
                Ajouter un nouveau bien
              </button>

              <button
                type="button"
                onClick={() => setIsAddPaiementOpen(true)}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted/40 hover:bg-muted border border-border transition-colors text-[13px] font-semibold text-card-foreground text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="bg-success/10 text-success p-1.5 rounded-md">
                  <Wallet className="w-4 h-4" />
                </div>
                Enregistrer un paiement manuel
              </button>

              <button
                type="button"
                onClick={() => setIsAddTicketOpen(true)}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted/40 hover:bg-muted border border-border transition-colors text-[13px] font-semibold text-card-foreground text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="bg-rose-500/10 text-rose-500 p-1.5 rounded-md">
                  <Wrench className="w-4 h-4" />
                </div>
                Créer un ticket travaux
              </button>

              <Link
                href="/dashboard/patrimoine"
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted/40 hover:bg-muted border border-border transition-colors text-[13px] font-semibold text-card-foreground text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="bg-blue-500/10 text-blue-500 p-1.5 rounded-md">
                  <Building2 className="w-4 h-4" />
                </div>
                Consulter mon patrimoine ({stats.totalBiens} biens)
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modals connectés */}
      <AddBienModal isOpen={isAddBienOpen} onClose={() => setIsAddBienOpen(false)} />
      <AddPaiementModal isOpen={isAddPaiementOpen} onClose={() => setIsAddPaiementOpen(false)} transactions={loyers} />
      <AddTicketModal isOpen={isAddTicketOpen} onClose={() => setIsAddTicketOpen(false)} />
    </div>
  );
}
