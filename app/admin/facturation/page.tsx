"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  CreditCardIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

interface TransactionItem {
  id: string;
  bien_nom?: string;
  locataire_nom?: string;
  montant: number;
  methode?: string;
  statut?: string;
  echeance?: string;
  date_paiement?: string;
  created_at?: string;
}

export default function AdminFacturationPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "paye" | "en_attente">("all");

  const { data: transactions = [], isLoading } = useQuery<TransactionItem[]>({
    queryKey: ["admin-all-transactions"],
    queryFn: async () => {
      if (!isSupabaseConfigured()) {
        return [];
      }
      const supabase = createClient();
      const { data, error } = await supabase
        .from("loyers_transactions")
        .select("id, bien_nom, locataire_nom, montant, methode, statut, echeance, date_paiement, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erreur récupération transactions:", error);
        return [];
      }
      return data || [];
    },
  });

  const stats = useMemo(() => {
    let totalEncaissé = 0;
    let totalEnAttente = 0;
    let countMoMo = 0;

    transactions.forEach((t) => {
      const isPaid = t.statut === "payé" || t.statut === "paye";
      if (isPaid) {
        totalEncaissé += Number(t.montant) || 0;
      } else {
        totalEnAttente += Number(t.montant) || 0;
      }

      if (t.methode?.toLowerCase().includes("momo") || t.methode?.toLowerCase().includes("moov")) {
        countMoMo++;
      }
    });

    return { totalEncaissé, totalEnAttente, countMoMo };
  }, [transactions]);

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch =
        !search.trim() ||
        (t.bien_nom || "").toLowerCase().includes(search.toLowerCase()) ||
        (t.locataire_nom || "").toLowerCase().includes(search.toLowerCase()) ||
        (t.methode || "").toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return false;

      const isPaid = t.statut === "payé" || t.statut === "paye";
      if (statusFilter === "paye") return isPaid;
      if (statusFilter === "en_attente") return !isPaid;
      return true;
    });
  }, [transactions, search, statusFilter]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-extrabold text-slate-900 tracking-tight">
            Loyers &amp; Flux Financiers
          </h1>
          <p className="text-[13px] text-slate-600 mt-0.5">
            Surveillance en temps réel des encaissements Mobile Money (MTN, Moov) et virements bancaires.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full text-[12px] font-bold bg-white border border-slate-200 text-slate-700 shadow-2xs">
            Passerelle Genius Pay 🇧🇯
          </span>
        </div>
      </div>

      {/* Cartes de synthèse financière */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Total Encaissé Validé
          </span>
          <div className="text-[22px] font-extrabold text-emerald-600">
            {stats.totalEncaissé.toLocaleString("fr-FR")} FCFA
          </div>
          <p className="text-[11px] text-slate-500">Paiements confirmés et quittances émises</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            En Attente de Règlement
          </span>
          <div className="text-[22px] font-extrabold text-amber-600">
            {stats.totalEnAttente.toLocaleString("fr-FR")} FCFA
          </div>
          <p className="text-[11px] text-slate-500">Échéances en cours du mois</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Transactions Mobile Money
          </span>
          <div className="text-[22px] font-extrabold text-slate-900">
            {stats.countMoMo} <span className="text-[13px] text-slate-500 font-bold">opérations</span>
          </div>
          <p className="text-[11px] text-slate-500">MTN MoMo, Moov Money &amp; Cartes</p>
        </div>
      </div>

      {/* Recherche & Filtres */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par logement, locataire ou méthode..."
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[12.5px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-1">
          {[
            { id: "all", label: "Toutes" },
            { id: "paye", label: "Payées" },
            { id: "en_attente", label: "En attente" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table des Transactions */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400">Chargement des flux...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-[13px]">
            Aucune transaction ne correspond à ce filtre.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12.5px]">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10.5px]">
                <tr>
                  <th className="py-3 px-4">Logement &amp; Réf</th>
                  <th className="py-3 px-4">Locataire</th>
                  <th className="py-3 px-4">Montant Loyer</th>
                  <th className="py-3 px-4">Méthode</th>
                  <th className="py-3 px-4">Échéance / Date</th>
                  <th className="py-3 px-4 text-right">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((t) => {
                  const isPaid = t.statut === "payé" || t.statut === "paye";
                  return (
                    <tr key={t.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {t.bien_nom || "Bien non spécifié"}
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {t.locataire_nom || "Locataire"}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {Number(t.montant).toLocaleString("fr-FR")} FCFA
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <span className="inline-flex items-center gap-1 font-medium">
                          {t.methode || "Mobile Money"}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                        {t.echeance || t.created_at?.slice(0, 10) || "—"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase ${
                            isPaid
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {isPaid ? "Payé" : "En attente"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
