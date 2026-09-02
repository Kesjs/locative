"use client";

import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  CreditCardIcon,
  PlusIcon,
  DocumentArrowDownIcon,
  ChatBubbleLeftRightIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { Wallet, Smartphone, Landmark, CheckCircle2, AlertCircle } from "lucide-react";
import { DataTable } from "@/components/dashboard/shared/DataTable";
import { KpiCard } from "@/components/dashboard/shared/KpiCard";
import { useLoyers, type LoyerTransaction } from "@/lib/hooks/useLoyers";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useLeases } from "@/lib/hooks/useLocataires";
import { AddPaiementModal } from "./_components/AddPaiementModal";
import ReceiptModal from "@/components/dashboard/ReceiptModal";

export default function LoyersPage() {
  const [filterMonth, setFilterMonth] = useState("09");
  const [filterYear, setFilterYear] = useState("2026");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);

  const { data: loyers = [], isLoading } = useLoyers();
  const { data: leases = [] } = useLeases();
  const userProfile = useUserProfile();

  // Statistics calculation
  const stats = useMemo(() => {
    const totalTransactions = loyers.length;
    const payes = loyers.filter((l) => l.statut === "payé");
    const totalEncaisse = payes.reduce((sum, l) => sum + (Number(l.montant) || 0), 0);

    const impayes = loyers.filter((l) => l.statut === "retard" || l.statut === "en_attente");
    const totalReste = impayes.reduce((sum, l) => sum + (Number(l.montant) || 0), 0);

    const totalExigible = totalEncaisse + totalReste;
    const tauxRecouvrement = totalExigible > 0 ? Math.round((totalEncaisse / totalExigible) * 100) : (totalTransactions > 0 ? 100 : 0);

    return { totalTransactions, totalEncaisse, totalReste, tauxRecouvrement, payesCount: payes.length, impayesCount: impayes.length };
  }, [loyers]);

  const handleOpenReceipt = (row: LoyerTransaction) => {
    setSelectedReceipt({
      receiptNo: `LOK-2026-${row.id ? row.id.slice(0, 6).toUpperCase() : "01"}`,
      date: row.date_reglement || new Date().toLocaleDateString("fr-FR"),
      month: "Septembre 2026",
      tenantName: row.locataire_nom,
      propertyTitle: row.bien_nom,
      propertyAddress: "Cotonou, République du Bénin",
      amountFcfa: row.montant,
      amountEuros: Math.round(row.montant / 655.957),
      channel: row.methode || "MTN MoMo",
      ownerName: userProfile.name || "Propriétaire Bailleur Lokka",
      depositMonths: 3,
    });
  };

  const handleWhatsAppRelance = (row: LoyerTransaction) => {
    const matchingLease = leases.find(
      (l) =>
        l.tenant?.full_name?.toLowerCase() === row.locataire_nom?.toLowerCase() ||
        l.bien?.nom?.toLowerCase() === row.bien_nom?.toLowerCase()
    );
    const phone = matchingLease?.tenant?.whatsapp_number || matchingLease?.tenant?.phone_number || "";

    if (!phone || phone.includes("00000000")) {
      toast.error(`Aucun numéro WhatsApp enregistré pour ${row.locataire_nom}.`);
      return;
    }

    const cleanPhone = phone.replace(/[^0-9+]/g, "").replace("+", "");
    const msg = encodeURIComponent(
      `Bonjour ${row.locataire_nom},\nSauf erreur de notre part, votre loyer de ${row.montant.toLocaleString("fr-FR")} FCFA pour "${row.bien_nom}" est en attente de règlement.\nMerci de procéder au règlement via MTN MoMo / Moov Money ou nous contacter.\nCordialement,\n${userProfile.name || "Lokka"}`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank");
    toast.success(`Relance WhatsApp préparée pour ${row.locataire_nom}`);
  };

  const columns = [
    {
      key: "locataire_nom",
      header: "Locataire & Logement",
      renderCell: (row: LoyerTransaction) => (
        <div>
          <p className="font-bold text-card-foreground">{row.locataire_nom}</p>
          <p className="text-[11.5px] text-muted-foreground">{row.bien_nom}</p>
        </div>
      ),
    },
    {
      key: "montant",
      header: "Montant",
      renderCell: (row: LoyerTransaction) => (
        <span className="font-bold font-mono text-card-foreground">
          {Number(row.montant).toLocaleString("fr-FR")} FCFA
        </span>
      ),
    },
    {
      key: "echeance",
      header: "Échéance",
      renderCell: (row: LoyerTransaction) => (
        <span className="text-[12.5px] text-muted-foreground">{row.echeance || "05/09/2026"}</span>
      ),
    },
    {
      key: "statut",
      header: "Statut & Canal",
      renderCell: (row: LoyerTransaction) => {
        let badgeClass = "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20";
        let label = `Payé (${row.methode || "MoMo"})`;

        if (row.statut === "en_attente") {
          badgeClass = "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20";
          label = "En attente";
        } else if (row.statut === "retard") {
          badgeClass = "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20";
          label = "En retard";
        }

        return (
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase border ${badgeClass}`}>
            {label}
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "Quittance / Action",
      renderCell: (row: LoyerTransaction) => {
        if (row.statut === "payé") {
          return (
            <button
              type="button"
              onClick={() => handleOpenReceipt(row)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold text-[12px] transition cursor-pointer"
            >
              <DocumentArrowDownIcon className="w-4 h-4" />
              <span>Quittance certifiée</span>
            </button>
          );
        }
        return (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11.5px] transition cursor-pointer shadow-2xs"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Encaisser</span>
            </button>
            <button
              type="button"
              onClick={() => handleWhatsAppRelance(row)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground font-bold text-[11.5px] transition cursor-pointer border border-border"
            >
              <ChatBubbleLeftRightIcon className="w-3.5 h-3.5 text-emerald-600" />
              <span>Relancer</span>
            </button>
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-20 bg-muted/60 animate-pulse rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="h-28 bg-muted/60 animate-pulse rounded-xl" />
          <div className="h-28 bg-muted/60 animate-pulse rounded-xl" />
          <div className="h-28 bg-muted/60 animate-pulse rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header Éditorial & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 bg-card border border-border rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Échéancier &amp; Recouvrement
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">Conforme Loi 2022-30</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-foreground tracking-tight">
            Loyers &amp; Quittances Certifiées
          </h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            Suivi des règlements Mobile Money (MTN / Moov), gestion des impayés et édition des quittances légales.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="border border-border rounded-xl px-3 py-2 text-[13px] bg-card text-card-foreground outline-none shadow-2xs cursor-pointer"
          >
            <option value="08">Août 2026</option>
            <option value="09">Septembre 2026</option>
            <option value="10">Octobre 2026</option>
          </select>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="border border-border rounded-xl px-3 py-2 text-[13px] bg-card text-card-foreground outline-none shadow-2xs cursor-pointer"
          >
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </select>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[13px] font-bold transition-all shadow-xs cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" /> Encaisser un loyer
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          title="Total Encaissé (Mois)"
          value={stats.totalEncaisse}
          currency="FCFA"
          subtitle={`${stats.payesCount} loyer${stats.payesCount > 1 ? "s" : ""} réglé${stats.payesCount > 1 ? "s" : ""}`}
          icon={Wallet}
          iconColor="emerald"
        />
        <KpiCard
          title="Reste à Recouvrer"
          value={stats.totalReste}
          currency="FCFA"
          subtitle={`${stats.impayesCount} échéance${stats.impayesCount > 1 ? "s" : ""} en attente`}
          icon={AlertCircle}
          iconColor="amber"
        />
        <KpiCard
          title="Taux de Recouvrement"
          value={stats.tauxRecouvrement}
          valueSuffix="%"
          subtitle={stats.tauxRecouvrement >= 80 ? "Excellent niveau de collecte" : "Relances requises"}
          icon={CheckCircle2}
          iconColor="blue"
        />
      </div>

      {/* Tableau des Loyers */}
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[15px] font-bold text-card-foreground">Journal des Transactions</h3>
            <p className="text-[12px] text-muted-foreground">Registre officiel des loyers perçus et en attente pour la période</p>
          </div>
          <span className="text-[12px] font-bold text-muted-foreground">
            {loyers.length} ligne{loyers.length > 1 ? "s" : ""}
          </span>
        </div>

        <DataTable data={loyers} columns={columns} keyExtractor={(r) => r.id} />
      </div>

      {/* Modales connectées */}
      <AddPaiementModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} transactions={loyers} />
      <ReceiptModal isOpen={!!selectedReceipt} onClose={() => setSelectedReceipt(null)} data={selectedReceipt} />
    </div>
  );
}
