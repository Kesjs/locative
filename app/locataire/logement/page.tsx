"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  MapPin,
  Zap,
  Droplets,
  Phone,
  MessageSquare,
  Copy,
  Check,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function LogementPage() {
  const [copiedSbee, setCopiedSbee] = useState(false);
  const [copiedSoneb, setCopiedSoneb] = useState(false);

  const { data: logement, isLoading } = useQuery({
    queryKey: ["locataire-real-logement"],
    queryFn: async () => {
      let defaultLogement = {
        nom: "Mon Logement Lokka",
        adresse: "Quartier Haie Vive, Cotonou, Bénin",
        type: "Appartement / Logement conventionné",
        surface: "Standard",
        loyer: "75 000 FCFA",
        charges: "0 FCFA",
        caution: "225 000 FCFA (3 mois max - Loi 2022-30)",
        dateEntree: "01 Janvier 2026",
        compteurSbee: "142 889 002 19",
        compteurSoneb: "SON-8821-C",
        bailleurNom: "Propriétaire Bailleur Lokka",
        bailleurTel: "+22997001122",
      };

      if (!isSupabaseConfigured()) return defaultLogement;

      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const { data: tenant } = await supabase
            .from("tenants")
            .select("id, full_name")
            .or("email.eq." + user.email + ",full_name.ilike.%" + (user.user_metadata?.full_name || "") + "%")
            .limit(1)
            .maybeSingle();

          let lease = null;
          if (tenant) {
            const { data: l } = await supabase
              .from("leases")
              .select("*, bien:biens(*)")
              .eq("tenant_id", tenant.id)
              .maybeSingle();
            lease = l;
          }

          if (!lease) {
            const { data: b } = await supabase
              .from("biens")
              .select("*")
              .ilike("locataire_nom", "%" + (user.user_metadata?.full_name || user.email?.split("@")[0]) + "%")
              .limit(1)
              .maybeSingle();
            if (b) {
              const loyerNum = Number(b.loyer_mensuel) || 75000;
              const cautionNum = Math.min(loyerNum * 3, Number(b.caution) || loyerNum * 3);
              return {
                ...defaultLogement,
                nom: b.nom,
                adresse: (b.adresse ? b.adresse + ", " : "") + (b.ville || "Cotonou, Bénin"),
                type: b.type || "Logement d'habitation",
                loyer: loyerNum.toLocaleString("fr-FR") + " FCFA",
                charges: (Number(b.charges) || 0).toLocaleString("fr-FR") + " FCFA",
                caution: cautionNum.toLocaleString("fr-FR") + " FCFA (3 mois max - Loi 2022-30)",
              };
            }
          } else if (lease && lease.bien) {
            const loyerNum = Number(lease.rent_amount) || Number(lease.bien.loyer_mensuel) || 75000;
            const chargesNum = Number(lease.charges_amount) || Number(lease.bien.charges) || 0;
            const cautionNum = Number(lease.deposit_amount) || loyerNum * 3;

            return {
              ...defaultLogement,
              nom: lease.bien.nom,
              adresse: (lease.bien.adresse ? lease.bien.adresse + ", " : "") + (lease.bien.ville || "Cotonou, Bénin"),
              type: lease.bien.type || "Logement d'habitation",
              loyer: loyerNum.toLocaleString("fr-FR") + " FCFA",
              charges: chargesNum.toLocaleString("fr-FR") + " FCFA",
              caution: cautionNum.toLocaleString("fr-FR") + " FCFA (3 mois max - Loi 2022-30)",
              dateEntree: lease.start_date ? new Date(lease.start_date).toLocaleDateString("fr-FR") : defaultLogement.dateEntree,
            };
          }
        }
      } catch (err) {
        console.warn("Notice logement fetch:", err);
      }

      return defaultLogement;
    },
  });

  const handleCopy = (text: string, type: "sbee" | "soneb") => {
    navigator.clipboard.writeText(text.replace(/\s+/g, ""));
    if (type === "sbee") {
      setCopiedSbee(true);
      setTimeout(() => setCopiedSbee(false), 2000);
    } else {
      setCopiedSoneb(true);
      setTimeout(() => setCopiedSoneb(false), 2000);
    }
    toast.success("Numéro de compteur copié !");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-24 bg-muted/60 animate-pulse rounded-2xl" />
        <div className="h-64 bg-muted/60 animate-pulse rounded-2xl" />
      </div>
    );
  }

  if (!logement) return null;

  return (
    <div className="space-y-6">
      {/* ── HEADER ÉDITORIAL ── */}
      <div className="p-5 sm:p-6 bg-card border border-border rounded-2xl shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            Fiche Technique
          </span>
          <span className="text-[11px] text-muted-foreground font-medium">Bail d'habitation · Loi 2022-30</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-normal text-foreground tracking-tight">
          Mon Logement &amp; Compteurs
        </h1>
        <p className="text-[13px] text-muted-foreground mt-0.5">
          Détails contractuels de votre bail, numéros de compteurs pour vos recharges et contact direct de votre gestionnaire.
        </p>
      </div>

      {/* ── CARTE LOGEMENT & INFOS BAIL ── */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-6">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
            {logement.nom}
          </h2>
          <div className="flex items-center gap-1.5 text-muted-foreground text-[13px] mt-1">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{logement.adresse}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 bg-muted/30 border border-border rounded-xl">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
              Type de bien
            </span>
            <span className="text-[13px] font-bold text-foreground mt-1 block truncate">
              {logement.type}
            </span>
          </div>
          <div className="p-3.5 bg-muted/30 border border-border rounded-xl">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
              Loyer Net
            </span>
            <span className="text-[13px] font-bold text-foreground mt-1 block font-mono">
              {logement.loyer}
            </span>
          </div>
          <div className="p-3.5 bg-muted/30 border border-border rounded-xl">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
              Charges
            </span>
            <span className="text-[13px] font-bold text-foreground mt-1 block font-mono">
              {logement.charges}
            </span>
          </div>
          <div className="p-3.5 bg-muted/30 border border-border rounded-xl">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
              Caution légale
            </span>
            <span className="text-[12.5px] font-bold text-foreground mt-1 block font-mono">
              {logement.caution}
            </span>
          </div>
        </div>
      </div>

      {/* ── COMPTEURS SBEE & SONEB (RECHARGE LOCATAIRE) ── */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-[15px] font-bold text-foreground">Compteurs Utilitaires</h3>
          <p className="text-[12px] text-muted-foreground">
            Numéros officiels à renseigner pour vos recharges de crédits électricité SBEE et paiements d'eau SONEB.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* SBEE */}
          <div className="p-4 bg-muted/30 border border-border rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700 dark:text-amber-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase text-muted-foreground block">
                  Compteur SBEE (Électricité à carte)
                </span>
                <span className="font-mono font-bold text-[14px] text-foreground">
                  {logement.compteurSbee}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(logement.compteurSbee, "sbee")}
              className="p-2 rounded-lg bg-card hover:bg-muted border border-border text-foreground transition-colors cursor-pointer shadow-2xs"
              title="Copier le numéro SBEE"
            >
              {copiedSbee ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* SONEB */}
          <div className="p-4 bg-muted/30 border border-border rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-700 dark:text-blue-400">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase text-muted-foreground block">
                  Police SONEB (Eau potable)
                </span>
                <span className="font-mono font-bold text-[14px] text-foreground">
                  {logement.compteurSoneb}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(logement.compteurSoneb, "soneb")}
              className="p-2 rounded-lg bg-card hover:bg-muted border border-border text-foreground transition-colors cursor-pointer shadow-2xs"
              title="Copier la police SONEB"
            >
              {copiedSoneb ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── CONTACTS D'URGENCE DU BAILLEUR ── */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase text-emerald-700 dark:text-emerald-400 block mb-0.5">
              Gestionnaire du Bien
            </span>
            <div className="font-bold text-[15px] text-foreground">{logement.bailleurNom}</div>
            <div className="text-[12px] text-muted-foreground">Propriétaire Bailleur certifié Lokka</div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={"tel:" + logement.bailleurTel}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-[13px] font-bold transition-all border border-border cursor-pointer"
            >
              <Phone className="w-4 h-4 text-blue-600" />
              <span>Appeler</span>
            </a>
            <a
              href={"https://wa.me/" + logement.bailleurTel.replace(/[^0-9]/g, "")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[13px] font-bold transition-all cursor-pointer shadow-2xs"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
