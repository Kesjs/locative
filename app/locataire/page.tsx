"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Wallet,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  ShieldCheck,
  Clock,
  MessageSquare,
  X,
  Lock,
  ArrowRight,
  Download,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { GeniusPayModal } from "./_components/GeniusPayModal";
import ReceiptModal from "@/components/dashboard/ReceiptModal";

export default function MonLoyerPage() {
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [dismissSecurityBanner, setDismissSecurityBanner] = useState(false);

  // Données dynamiques du bail locataire connectées à Supabase
  const { data: rentInfo, isLoading, refetch } = useQuery({
    queryKey: ["locataire-loyer-status"],
    queryFn: async () => {
      const currentDate = new Date();
      const currentMonthStr = currentDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
      const formattedMonth = currentMonthStr.charAt(0).toUpperCase() + currentMonthStr.slice(1);

      let defaultData = {
        leaseId: undefined as string | undefined,
        bienId: undefined as string | undefined,
        montantLoyer: 75000,
        charges: 0,
        totalDu: 75000,
        echeanceDate: "05/" + String(currentDate.getMonth() + 1).padStart(2, "0") + "/" + currentDate.getFullYear(),
        moisConcerne: formattedMonth,
        statut: "a_payer" as "a_payer" | "a_jour",
        bailleurNom: "Propriétaire Bailleur Lokka",
        bailleurTel: "+22997001122",
        bailleurWhatsapp: "22997001122",
        logementNom: "Logement Lokka",
        tenantName: "Locataire Lokka",
        tenantEmail: "",
        tenantPhone: "+229",
      };

      if (!isSupabaseConfigured()) return defaultData;

      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          defaultData.tenantEmail = user.email || "";
          defaultData.tenantName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Locataire";
          defaultData.tenantPhone = user.user_metadata?.phone_number || "+229";

          // Chercher le locataire correspondant
          const { data: tenant } = await supabase
            .from("tenants")
            .select("id, full_name, phone_number")
            .or("email.eq." + user.email + ",full_name.ilike.%" + (user.user_metadata?.full_name || "") + "%")
            .limit(1)
            .maybeSingle();

          let lease = null;
          if (tenant) {
            defaultData.tenantName = tenant.full_name || defaultData.tenantName;
            defaultData.tenantPhone = tenant.phone_number || defaultData.tenantPhone;

            const { data: l } = await supabase
              .from("leases")
              .select("*, bien:biens(*)")
              .eq("tenant_id", tenant.id)
              .eq("is_active", true)
              .maybeSingle();
            lease = l;
          }

          if (!lease) {
            const { data: assignedBien } = await supabase
              .from("biens")
              .select("*")
              .ilike("locataire_nom", "%" + (user.user_metadata?.full_name || user.email?.split("@")[0]) + "%")
              .limit(1)
              .maybeSingle();

            if (assignedBien) {
              const montant = Number(assignedBien.loyer_mensuel) || 75000;
              defaultData.montantLoyer = montant;
              defaultData.totalDu = montant;
              defaultData.logementNom = assignedBien.nom;
              defaultData.bienId = assignedBien.id;
            }
          } else if (lease && lease.bien) {
            const montant = Number(lease.rent_amount) || Number(lease.bien.loyer_mensuel) || 75000;
            const charges = Number(lease.charges_amount) || Number(lease.bien.charges) || 0;
            defaultData.leaseId = lease.id;
            defaultData.bienId = lease.bien.id;
            defaultData.montantLoyer = montant;
            defaultData.charges = charges;
            defaultData.totalDu = montant + charges;
            defaultData.logementNom = lease.bien.nom;
          }

          // Vérifier si une transaction payée existe déjà pour la période courante
          if (defaultData.leaseId) {
            const { data: paidTx } = await supabase
              .from("loyers_transactions")
              .select("id, statut")
              .eq("lease_id", defaultData.leaseId)
              .eq("statut", "paye")
              .order("date_reglement", { ascending: false })
              .limit(1)
              .maybeSingle();

            if (paidTx) {
              defaultData.statut = "a_jour";
            }
          }
        }
      } catch (err) {
        console.warn("Notice chargement bail locataire:", err);
      }

      return defaultData;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-24 bg-muted/60 animate-pulse rounded-2xl" />
        <div className="h-64 bg-muted/60 animate-pulse rounded-2xl" />
      </div>
    );
  }

  if (!rentInfo) return null;

  const isUpToDate = rentInfo.statut === "a_jour";

  return (
    <div className="space-y-6">
      {/* ── BANNIÈRE DE SÉCURITÉ & BIENVENUE ── */}
      {!dismissSecurityBanner && (
        <div className="p-4 bg-emerald-50/90 border border-emerald-200/90 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-emerald-950 shadow-2xs">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 shrink-0 mt-0.5 sm:mt-0">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-[13px] font-bold">
                Bienvenue sur votre Espace Sécurisé Lokka
              </p>
              <p className="text-[12px] text-emerald-800">
                Vous venez de vous connecter avec un mot de passe temporaire ? Définissez votre mot de passe personnel pour sécuriser votre compte.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <Link
              href="/locataire/compte#securite"
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[12px] font-bold transition-all shadow-2xs cursor-pointer"
            >
              Modifier mon mot de passe &rarr;
            </Link>
            <button
              type="button"
              onClick={() => setDismissSecurityBanner(true)}
              className="p-1 text-emerald-600 hover:text-emerald-900 rounded-lg"
              title="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── HEADER ÉDITORIAL ── */}
      <div className="p-5 sm:p-6 bg-card border border-border rounded-2xl shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            {rentInfo.logementNom}
          </span>
          <span className="text-[11px] text-muted-foreground font-medium">Bail en cours · Loi 2022-30</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-normal text-foreground tracking-tight">
          Mon Loyer &amp; Échéances
        </h1>
        <p className="text-[13px] text-muted-foreground mt-0.5">
          Suivi de vos règlements, paiement automatisé via Genius Pay et téléchargement instantané de quittance.
        </p>
      </div>

      {/* ── CARTE HÉROÏQUE LOYER & STATUT ── */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Période : {rentInfo.moisConcerne}</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-mono text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                {rentInfo.totalDu.toLocaleString("fr-FR")}
              </span>
              <span className="text-base sm:text-lg font-bold text-muted-foreground">
                FCFA / mois
              </span>
            </div>
            <div className="text-[12px] text-muted-foreground mt-1">
              Loyer net : {rentInfo.montantLoyer.toLocaleString("fr-FR")} FCFA {rentInfo.charges > 0 ? "+ " + rentInfo.charges.toLocaleString("fr-FR") + " FCFA charges" : ""}
            </div>
          </div>

          <div>
            {isUpToDate ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold text-[13px]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Loyer Réglé &amp; À Jour</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 font-bold text-[13px]">
                <Clock className="w-4 h-4" />
                <span>À régler avant le 5 du mois</span>
              </div>
            )}
          </div>
        </div>

        {/* Action de Paiement */}
        <div className="pt-6">
          {isUpToDate ? (
            <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-[13.5px] font-bold text-emerald-950 dark:text-emerald-200">
                  Votre quittance certifiée conforme Loi 2022-30 est disponible
                </p>
                <p className="text-[12px] text-emerald-800 dark:text-emerald-400">
                  Règlement validé par votre bailleur. Vous pouvez la télécharger à tout moment.
                </p>
              </div>
              <Link
                href="/locataire/quittances"
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[13px] font-bold transition shadow-xs flex items-center justify-center gap-1.5 shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Consulter mes quittances</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setIsPayModalOpen(true)}
                className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-[15px] font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Smartphone className="w-5 h-5" />
                <span>Payer mon loyer avec Genius Pay (MTN MoMo / Moov)</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
              <p className="text-center text-[11.5px] text-muted-foreground flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Paiement sécurisé crypté par Genius Pay · Quittance certifiée générée immédiatement</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── MODALE GENIUS PAY ── */}
      <GeniusPayModal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        rentAmount={rentInfo.montantLoyer}
        chargesAmount={rentInfo.charges}
        logementNom={rentInfo.logementNom}
        leaseId={rentInfo.leaseId}
        bienId={rentInfo.bienId}
        tenantName={rentInfo.tenantName}
        tenantEmail={rentInfo.tenantEmail}
        tenantPhone={rentInfo.tenantPhone}
        onPaymentSuccess={() => {
          refetch();
        }}
        onOpenReceipt={(tx) => {
          setSelectedReceipt({
            receiptNo: tx?.transactionId || "GP-LOK-VERIFIED",
            date: new Date().toLocaleDateString("fr-FR"),
            month: rentInfo.moisConcerne,
            tenantName: rentInfo.tenantName || "Locataire Lokka",
            propertyTitle: rentInfo.logementNom,
            propertyAddress: "Quartier Haie Vive, Cotonou, Bénin",
            amountFcfa: rentInfo.totalDu,
            amountEuros: Math.round(rentInfo.totalDu / 655.957),
            channel: "Genius Pay (" + (tx?.operator || "mtn").toUpperCase() + ")",
            ownerName: rentInfo.bailleurNom,
            depositMonths: 3,
          });
        }}
      />

      {/* ── MODALE QUITTANCE CERTIFIÉE ── */}
      <ReceiptModal
        isOpen={Boolean(selectedReceipt)}
        onClose={() => setSelectedReceipt(null)}
        data={selectedReceipt}
      />
    </div>
  );
}
