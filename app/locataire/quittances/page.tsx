"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Receipt,
  Download,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  FileText,
} from "lucide-react";
import ReceiptModal from "@/components/dashboard/ReceiptModal";

export default function QuittancesPage() {
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);

  const { data: quittances = [], isLoading } = useQuery({
    queryKey: ["locataire-quittances-list"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return [
        {
          id: "LOK-2026-08",
          mois: "Août 2026",
          montant: 160000,
          dateReglement: "04/08/2026",
          methode: "MTN MoMo",
          reference: "TX-992140-BJ",
        },
        {
          id: "LOK-2026-07",
          mois: "Juillet 2026",
          montant: 160000,
          dateReglement: "05/07/2026",
          methode: "MTN MoMo",
          reference: "TX-883102-BJ",
        },
        {
          id: "LOK-2026-06",
          mois: "Juin 2026",
          montant: 160000,
          dateReglement: "03/06/2026",
          methode: "Moov Money",
          reference: "TX-774011-BJ",
        },
      ];
    },
  });

  const handleOpenReceipt = (q: any) => {
    setSelectedReceipt({
      receiptNo: q.id,
      date: q.dateReglement,
      month: q.mois,
      tenantName: "Koffi Mensah",
      propertyTitle: "Villa Les Cocotiers - Apt 2B",
      propertyAddress: "Quartier Haie Vive, Cotonou, Bénin",
      amountFcfa: q.montant,
      amountEuros: Math.round(q.montant / 655.957),
      channel: q.methode,
      ownerName: "Patrimoine Lokka (M. Koudjo)",
      depositMonths: 3,
    });
  };

  return (
    <div className="space-y-6">
      {/* ── HEADER ÉDITORIAL ── */}
      <div className="p-5 sm:p-6 bg-card border border-border rounded-2xl shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            Coffre-fort Légal
          </span>
          <span className="text-[11px] text-muted-foreground font-medium">Loi n° 2022-30</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-normal text-foreground tracking-tight">
          Mes Quittances de Loyer
        </h1>
        <p className="text-[13px] text-muted-foreground mt-0.5">
          Téléchargez vos quittances officielles certifiées conformes pour vos démarches administratives et bancaires.
        </p>
      </div>

      {/* ── LISTE DES QUITTANCES ── */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <h3 className="text-[15px] font-bold text-foreground">Historique des Quittances</h3>
          <span className="text-[12px] font-bold text-muted-foreground">
            {quittances.length} document{quittances.length > 1 ? "s" : ""} disponible{quittances.length > 1 ? "s" : ""}
          </span>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <div className="h-16 bg-muted/60 animate-pulse rounded-xl" />
            <div className="h-16 bg-muted/60 animate-pulse rounded-xl" />
          </div>
        ) : (
          <div className="space-y-3">
            {quittances.map((q) => (
              <div
                key={q.id}
                className="p-4 bg-muted/30 hover:bg-muted/50 border border-border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[14px] text-foreground">{q.mois}</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        Certifiée
                      </span>
                    </div>
                    <div className="text-[12px] text-muted-foreground mt-0.5">
                      Règlement le {q.dateReglement} via {q.methode} ({q.reference})
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <span className="font-mono font-bold text-[14px] text-foreground">
                    {q.montant.toLocaleString("fr-FR")} FCFA
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenReceipt(q)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[12px] font-bold transition-all shadow-2xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Télécharger PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modale de visualisation et impression de la quittance */}
      <ReceiptModal
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        data={selectedReceipt}
      />
    </div>
  );
}
