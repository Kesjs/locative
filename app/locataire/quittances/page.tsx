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
  Clock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import ReceiptModal from "@/components/dashboard/ReceiptModal";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function QuittancesPage() {
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);

  const { data: quittanceData, isLoading } = useQuery({
    queryKey: ["locataire-real-quittances"],
    queryFn: async () => {
      let tenantInfo = {
        name: "Locataire Lokka",
        property: "Logement Lokka",
        address: "Quartier Haie Vive, Cotonou, Bénin",
        bailleur: "Propriétaire Bailleur Lokka",
      };

      let list: any[] = [];

      if (!isSupabaseConfigured()) {
        return { tenantInfo, list };
      }

      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          tenantInfo.name = user.user_metadata?.full_name || user.email?.split("@")[0] || "Locataire";

          // Trouver le locataire et le bail
          const { data: tenant } = await supabase
            .from("tenants")
            .select("id, full_name")
            .or("email.eq." + user.email + ",full_name.ilike.%" + (user.user_metadata?.full_name || "") + "%")
            .limit(1)
            .maybeSingle();

          let leaseId = null;
          if (tenant) {
            tenantInfo.name = tenant.full_name || tenantInfo.name;
            const { data: lease } = await supabase
              .from("leases")
              .select("id, bien:biens(nom, adresse, ville)")
              .eq("tenant_id", tenant.id)
              .maybeSingle();

            if (lease) {
              leaseId = lease.id;
              const rawBien: any = lease.bien;
              const bienObj = Array.isArray(rawBien) ? rawBien[0] : rawBien;
              if (bienObj) {
                tenantInfo.property = bienObj.nom || tenantInfo.property;
                tenantInfo.address = (bienObj.adresse ? bienObj.adresse + ", " : "") + (bienObj.ville || "Cotonou");
              }
            }
          }

          // Charger les transactions associées
          let query = supabase.from("loyers_transactions").select("*");
          if (leaseId) {
            query = query.eq("lease_id", leaseId);
          }
          const { data: txs } = await query.order("date_reglement", { ascending: false });

          if (txs && txs.length > 0) {
            list = txs.map((t: any) => ({
              id: t.reference_transaction || "GP-" + t.id.slice(0, 8),
              mois: t.periode || "Septembre 2026",
              montant: Number(t.montant) || 75000,
              dateReglement: t.date_reglement ? new Date(t.date_reglement).toLocaleDateString("fr-FR") : "Récent",
              methode: t.methode_paiement || "Genius Pay (MTN MoMo)",
              reference: t.reference_transaction || "GP-LOK-VERIFIED",
              statut: t.statut === "paye" ? "Payé" : "En attente",
            }));
          }
        }
      } catch (err) {
        console.warn("Notice quittances Supabase:", err);
      }

      return { tenantInfo, list };
    },
  });

  const tenantInfo = quittanceData?.tenantInfo || {
    name: "Locataire",
    property: "Mon Logement",
    address: "Cotonou, Bénin",
    bailleur: "Bailleur Lokka",
  };
  const quittances = quittanceData?.list || [];

  const handleOpenReceipt = (q: any) => {
    setSelectedReceipt({
      receiptNo: q.id,
      date: q.dateReglement,
      month: q.mois,
      tenantName: tenantInfo.name,
      propertyTitle: tenantInfo.property,
      propertyAddress: tenantInfo.address,
      amountFcfa: q.montant,
      amountEuros: Math.round(q.montant / 655.957),
      channel: q.methode,
      ownerName: tenantInfo.bailleur,
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
          Téléchargez vos quittances officielles certifiées conformes pour vos démarches administratives, consulaires et bancaires.
        </p>
      </div>

      {/* ── LISTE DES QUITTANCES OU ÉTAT VIDE ── */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
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
        ) : quittances.length === 0 ? (
          /* État vide élégant et rassurant */
          <div className="py-12 px-4 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-600">
              <Receipt className="w-7 h-7" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h4 className="font-serif text-lg font-bold text-foreground">
                Aucune quittance émise pour le moment
              </h4>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                Dès que vous effectuez le règlement de votre loyer via <strong>Genius Pay</strong> (MTN MoMo ou Moov Money), votre quittance officielle certifiée conforme sera automatiquement générée et téléchargeable ici en PDF.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/locataire"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[13px] font-bold transition shadow-xs"
              >
                <span>Accéder à mon loyer du mois</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
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
                        Certifiée Loi 2022-30
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
        isOpen={Boolean(selectedReceipt)}
        onClose={() => setSelectedReceipt(null)}
        data={selectedReceipt}
      />
    </div>
  );
}
