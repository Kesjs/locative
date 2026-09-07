"use client";

import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  BuildingOffice2Icon,
  UsersIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

interface AdminStats {
  totalUsers: number;
  bailleursCount: number;
  agencesCount: number;
  locatairesCount: number;
  totalBiens: number;
  biensLoues: number;
  biensVacants: number;
  totalVolumeGmv: number;
  totalMandats: number;
  recentTransactions: any[];
  recentUsers: any[];
  totalEncaissements: number;
}

export default function AdminDashboardPage() {
  const { data: stats, isLoading, refetch, isFetching } = useQuery<AdminStats>({
    queryKey: ["admin-live-stats"],
    queryFn: async () => {
      if (!isSupabaseConfigured()) {
        return {
          totalUsers: 24,
          bailleursCount: 14,
          agencesCount: 5,
          locatairesCount: 5,
          totalBiens: 38,
          biensLoues: 29,
          biensVacants: 9,
          totalVolumeGmv: 4850000,
          totalMandats: 6,
          recentTransactions: [],
          recentUsers: [],
          totalEncaissements: 3250000,
        };
      }

      const supabase = createClient();

      // 1. Profils & Utilisateurs
      const { data: profiles = [] } = await supabase
        .from("profiles")
        .select("id, full_name, email, role, created_at, preferred_payment_channel")
        .order("created_at", { ascending: false });

      const totalUsers = profiles?.length || 0;
      const bailleursCount = profiles?.filter((p) => p.role === "owner" || p.role === "bailleur" || !p.role).length || 0;
      const agencesCount = profiles?.filter((p) => p.role === "agence" || p.role === "agency_admin").length || 0;
      const locatairesCount = profiles?.filter((p) => p.role === "tenant" || p.role === "locataire").length || 0;

      // 2. Biens & Patrimoine
      const { data: biens = [] } = await supabase
        .from("biens")
        .select("id, nom, loyer_mensuel, statut, ville, created_at")
        .eq("archive", false);

      const totalBiens = biens?.length || 0;
      const biensLoues = biens?.filter((b) => b.statut === "loué" || b.statut === "loue").length || 0;
      const biensVacants = totalBiens - biensLoues;
      const totalVolumeGmv = biens?.reduce((sum, b) => sum + (Number(b.loyer_mensuel) || 0), 0) || 0;

      // 3. Mandats d'Agences
      const { data: mandats = [] } = await supabase
        .from("mandats")
        .select("id, commission_pct, solde");

      const totalMandats = mandats?.length || 0;

      // 4. Transactions de Loyers
      const { data: transactions = [] } = await supabase
        .from("loyers_transactions")
        .select("id, bien_nom, locataire_nom, montant, methode, statut, echeance, date_paiement, created_at")
        .order("created_at", { ascending: false })
        .limit(10);

      const totalEncaissements = transactions
        ?.filter((t) => t.statut === "payé" || t.statut === "paye")
        ?.reduce((sum, t) => sum + (Number(t.montant) || 0), 0) || 0;

      return {
        totalUsers,
        bailleursCount,
        agencesCount,
        locatairesCount,
        totalBiens,
        biensLoues,
        biensVacants,
        totalVolumeGmv,
        totalMandats,
        recentTransactions: transactions || [],
        recentUsers: (profiles || []).slice(0, 6),
        totalEncaissements,
      };
    },
    staleTime: 30000,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const s = stats || {
    totalUsers: 0,
    bailleursCount: 0,
    agencesCount: 0,
    locatairesCount: 0,
    totalBiens: 0,
    biensLoues: 0,
    biensVacants: 0,
    totalVolumeGmv: 0,
    totalMandats: 0,
    recentTransactions: [],
    recentUsers: [],
    totalEncaissements: 0,
  };

  const tauxOccupation = s.totalBiens > 0 ? Math.round((s.biensLoues / s.totalBiens) * 100) : 0;

  return (
    <div className="space-y-8 pb-12">
      {/* ─── EN-TÊTE DE SUPERVISION ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Plateforme Opérationnelle · République du Bénin 🇧🇯
            </span>
          </div>
          <h1 className="text-[24px] sm:text-[28px] font-extrabold text-slate-900 tracking-tight">
            Tour de Contrôle Lokka
          </h1>
          <p className="text-[13px] text-slate-600 mt-0.5">
            Supervision globale des loyers, parcs immobiliers, agences mandatées et transactions Genius Pay.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-[12.5px] rounded-xl shadow-2xs transition cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          <ArrowPathIcon className={`w-4 h-4 ${isFetching ? "animate-spin text-emerald-600" : ""}`} />
          <span>{isFetching ? "Actualisation..." : "Actualiser les données"}</span>
        </button>
      </div>

      {/* ─── LES 4 CARTES KPI CARDINALES ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 : GMV */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider">
              Volume Sous Gestion (GMV)
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <ArrowTrendingUpIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[22px] font-extrabold text-slate-900">
            {s.totalVolumeGmv.toLocaleString("fr-FR")} <span className="text-[14px] font-bold text-slate-500">FCFA/mois</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Loyer mensuel cumulé des logements enregistrés
          </div>
        </div>

        {/* KPI 2 : Logements & Portes */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider">
              Lots &amp; Logements
            </span>
            <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
              <BuildingOffice2Icon className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[22px] font-extrabold text-slate-900">
            {s.totalBiens} <span className="text-[13px] font-bold text-slate-500">unités</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-semibold">
            <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              {s.biensLoues} loués ({tauxOccupation}%)
            </span>
            <span className="text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
              {s.biensVacants} vacants
            </span>
          </div>
        </div>

        {/* KPI 3 : Utilisateurs & Rôles */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider">
              Comptes &amp; Écosystème
            </span>
            <div className="p-2 bg-purple-50 text-purple-700 rounded-xl">
              <UsersIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[22px] font-extrabold text-slate-900">
            {s.totalUsers} <span className="text-[13px] font-bold text-slate-500">acteurs</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
            <span>{s.bailleursCount} bailleurs</span>
            <span>·</span>
            <span>{s.agencesCount} agences</span>
            <span>·</span>
            <span>{s.locatairesCount} locataires</span>
          </div>
        </div>

        {/* KPI 4 : Encaissements Loyers */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider">
              Transactions Loyers
            </span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
              <CreditCardIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[22px] font-extrabold text-slate-900">
            {s.totalEncaissements.toLocaleString("fr-FR")} <span className="text-[14px] font-bold text-slate-500">FCFA</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircleIcon className="w-3.5 h-3.5" />
            <span>Passerelle Genius Pay &amp; Virement</span>
          </div>
        </div>
      </div>

      {/* ─── BANDEAU CONFORMITÉ LOI 2022-30 ─── */}
      <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <ShieldCheckIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[13.5px] font-bold text-slate-900">
              Observatoire de Conformité Réglementaire (Loi n° 2022-30 du Bénin)
            </div>
            <div className="text-[12px] text-slate-600 mt-0.5">
              Plafonds légaux surveillés : <strong>Honoraires d&apos;agence $\le$ 10% TTC</strong> · <strong>Caution locative $\le$ 3 mois</strong> · Quittances numériques à QR Code.
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {s.totalMandats} mandats d&apos;agence vérifiés
          </span>
        </div>
      </div>

      {/* ─── GRILLE : TRANSACTIONS RÉCENTES & DERNIERS INSCRITS ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Colonne Gauche : Dernières Transactions (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-[15px] font-bold text-slate-900">Flux des Loyers Récent</h2>
              <p className="text-[11.5px] text-slate-500">Dernières transactions enregistrées sur la plateforme</p>
            </div>
            <Link
              href="/admin/facturation"
              className="text-[12px] font-bold text-emerald-600 hover:underline"
            >
              Voir tout &rarr;
            </Link>
          </div>

          {s.recentTransactions.length === 0 ? (
            <div className="py-8 text-center text-[12.5px] text-slate-500">
              Aucune transaction de loyer enregistrée pour le moment.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {s.recentTransactions.map((tx) => (
                <div key={tx.id} className="py-3 flex items-center justify-between gap-3 text-[12.5px]">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">{tx.bien_nom || "Logement"}</p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {tx.locataire_nom || "Locataire"} · {tx.methode || "MoMo"}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-slate-900">
                      {Number(tx.montant).toLocaleString("fr-FR")} FCFA
                    </p>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        tx.statut === "payé" || tx.statut === "paye"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {tx.statut === "payé" || tx.statut === "paye" ? "Payé" : "En attente"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Colonne Droite : Nouveaux Utilisateurs (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-[15px] font-bold text-slate-900">Derniers Inscrits</h2>
              <p className="text-[11.5px] text-slate-500">Comptes récemment créés</p>
            </div>
            <Link
              href="/admin/utilisateurs"
              className="text-[12px] font-bold text-emerald-600 hover:underline"
            >
              Gérer &rarr;
            </Link>
          </div>

          {s.recentUsers.length === 0 ? (
            <div className="py-8 text-center text-[12.5px] text-slate-500">
              Aucun utilisateur enregistré.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {s.recentUsers.map((u) => {
                const roleLabel =
                  u.role === "agence" || u.role === "agency_admin"
                    ? "Agence"
                    : u.role === "tenant" || u.role === "locataire"
                    ? "Locataire"
                    : u.role === "super_admin" || u.role === "admin"
                    ? "Admin"
                    : "Bailleur";

                const roleBadgeClass =
                  roleLabel === "Agence"
                    ? "bg-blue-50 text-blue-700"
                    : roleLabel === "Admin"
                    ? "bg-purple-50 text-purple-700"
                    : roleLabel === "Locataire"
                    ? "bg-amber-50 text-amber-700"
                    : "bg-emerald-50 text-emerald-700";

                return (
                  <div key={u.id} className="py-2.5 flex items-center justify-between gap-3 text-[12px]">
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate">{u.full_name || "Sans nom"}</p>
                      <p className="text-[11px] text-slate-500 truncate font-mono">{u.email || "Email non renseigné"}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase shrink-0 ${roleBadgeClass}`}>
                      {roleLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
