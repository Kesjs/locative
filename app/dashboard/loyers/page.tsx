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
import { DataTable } from "@/components/dashboard/shared/DataTable";
import { KpiCard } from "@/components/dashboard/shared/KpiCard";
import { useLoyers, type LoyerTransaction } from "@/lib/hooks/useLoyers";
import { AddPaiementModal } from "./_components/AddPaiementModal";
import ReceiptModal from "@/components/dashboard/ReceiptModal";

export default function LoyersPage() {
  const [filterMonth, setFilterMonth] = useState("09");
  const [filterYear, setFilterYear] = useState("2026");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);

  const { data: loyers = [], isLoading } = useLoyers();

  // Statistics calculation
  const stats = useMemo(() => {
    const totalTransactions = loyers.length;
    const payes = loyers.filter((l) => l.statut === "payé");
    const totalEncaisse = payes.reduce((sum, l) => sum + (l.montant || 0), 0);

    const impayes = loyers.filter((l) => l.statut === "retard" || l.statut === "en_attente");
    const totalReste = impayes.reduce((sum, l) => sum + (l.montant || 0), 0);

    const totalExigible = totalEncaisse + totalReste;
    const tauxRecouvrement = totalExigible > 0 ? Math.round((totalEncaisse / totalExigible) * 100) : (totalTransactions > 0 ? 100 : 0);

    return { totalTransactions, totalEncaisse, totalReste, tauxRecouvrement };
  }, [loyers]);

  const handleOpenReceipt = (row: LoyerTransaction) => {
    setSelectedReceipt({
      receiptNo: `LOK-2026-${row.id || "01"}`,
      date: row.date_reglement || "05/09/2026",
      month: "Septembre 2026",
      tenantName: row.locataire_nom,
      propertyTitle: row.bien_nom,
      propertyAddress: "Cotonou, République du Bénin",
      amountFcfa: row.montant,
      amountEuros: Math.round(row.montant / 655.957),
      channel: row.methode || "MTN MoMo",
      ownerName: "Alexandre K. (Bailleur)",
      depositMonths: 3,
    });
  };

  const handleWhatsAppRelance = (row: LoyerTransaction) => {
    const msg = encodeURIComponent(
      `Bonjour ${row.locataire_nom},\nSauf erreur de notre part, votre loyer de ${row.montant.toLocaleString("fr-FR")} FCFA pour "${row.bien_nom}" est en attente de règlement.\nMerci de procéder au règlement via MTN MoMo / Moov Money ou nous contacter.\nCordialement,\nLokka`
    );
    window.open(`https://wa.me/22997001122?text=${msg}`, "_blank");
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
        <span className="font-bold text-card-foreground">
          {row.montant.toLocaleString("fr-FR")} FCFA
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
        let badgeClass = "bg-success/10 text-success border-success/20";
        let label = `Payé (${row.methode || "MoMo"})`;

        if (row.statut === "en_attente") {
          badgeClass = "bg-warning/10 text-warning border-warning/20";
          label = "En attente";
        } else if (row.statut === "retard") {
          badgeClass = "bg-destructive/10 text-destructive border-destructive/20";
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
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary/10 hover:bg-primary/20 text-primary font-bold text-[12px] transition cursor-pointer"
            >
              <DocumentArrowDownIcon className="w-3.5 h-3.5" />
              <span>Quittance PDF</span>
            </button>
          );
        }
        return (
          <button
            type="button"
            onClick={() => handleWhatsAppRelance(row)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold text-[12px] transition cursor-pointer"
          >
            <ChatBubbleLeftRightIcon className="w-3.5 h-3.5" />
            <span>Relancer WhatsApp</span>
          </button>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-20 bg-muted/60 animate-pulse rounded-xl" />
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
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-extrabold text-foreground">Loyers &amp; Quittances Certifiées</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            Suivi des encaissements MTN MoMo, Moov Money et génération des quittances Loi 2022-30.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="border border-border rounded-lg px-3 py-2 text-[13px] bg-card text-card-foreground outline-none shadow-2xs cursor-pointer"
          >
            <option value="08">Août 2026</option>
            <option value="09">Septembre 2026</option>
            <option value="10">Octobre 2026</option>
          </select>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="border border-border rounded-lg px-3 py-2 text-[13px] bg-card text-card-foreground outline-none shadow-2xs cursor-pointer"
          >
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </select>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-[13px] font-bold hover:bg-primary/90 transition shadow-xs cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" /> Paiement manuel
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          title="Total Encaissé ce mois"
          value={stats.totalEncaisse}
          currency="FCFA"
          subtitle="Paiements confirmés et certifiés"
          icon={BanknotesIcon}
          iconColor="emerald"
        />
        <KpiCard
          title="Reste à Recouvrer"
          value={stats.totalReste}
          currency="FCFA"
          subtitle="Paiements en attente ou retard"
          icon={ClockIcon}
          iconColor="amber"
        />
        <KpiCard
          title="Taux de Recouvrement"
          value={stats.tauxRecouvrement}
          valueSuffix="%"
          subtitle="Objectif mensuel : 100%"
          icon={CheckCircleIcon}
          iconColor="blue"
        />
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-card-foreground">Échéancier &amp; Règlements</h2>
          <span className="text-[12px] text-muted-foreground font-medium">{loyers.length} règlement(s)</span>
        </div>
        <DataTable data={loyers} columns={columns} keyExtractor={(r) => r.id} />
      </div>

      {/* Modals */}
      <AddPaiementModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} transactions={loyers} />

      {selectedReceipt && (
        <ReceiptModal
          isOpen={Boolean(selectedReceipt)}
          onClose={() => setSelectedReceipt(null)}
          receiptData={selectedReceipt}
        />
      )}
    </div>
  );
}
