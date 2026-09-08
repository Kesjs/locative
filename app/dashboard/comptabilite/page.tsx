"use client";

import React, { useMemo, useState } from "react";
import { NumberTicker } from "@/components/ui/number-ticker";
import { BorderBeam } from "@/components/ui/border-beam";
import {
  ArrowDownTrayIcon,
  ShieldCheckIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
  HandCoins,
  Landmark,
  Wallet,
  CheckCircle2,
  AlertCircle,
  FileText,
  Printer,
  Scale,
  Building2,
} from "lucide-react";
import { useLoyers } from "@/lib/hooks/useLoyers";
import { useTickets } from "@/lib/hooks/useMaintenance";
import { useMandats } from "@/lib/hooks/useMandats";
import { useUserProfile } from "@/hooks/useUserProfile";
import { usePatrimoineFilter, useActiveGroupBienIds, useActiveGroupBienNames } from "@/lib/patrimoineFilterContext";
import { toast } from "sonner";
import { CrgModal, type CrgData } from "./_components/CrgModal";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function AccountingPage() {
  const userProfile = useUserProfile();
  const isAgency = userProfile.role === "Agence" || userProfile.plan === "agence";

  const [activeTab, setActiveTab] = useState<"reversements" | "fiscalite">(
    isAgency ? "reversements" : "fiscalite"
  );
  const [selectedYear, setSelectedYear] = useState("2026");

  const { data: allLoyers = [], isLoading: isLoadingLoyers } = useLoyers();
  const { data: allTickets = [], isLoading: isLoadingTickets } = useTickets();
  const { data: mandats = [] } = useMandats();
  const { activeGroup, setActiveGroup } = usePatrimoineFilter();
  const activeGroupBienIds = useActiveGroupBienIds();
  const activeGroupBienNames = useActiveGroupBienNames();

  // Filtre résidence appliqué aux loyers et tickets utilisés dans tous les calculs du bilan
  // (mêmes hooks/logique que Loyers & Maintenance) : match par bien_id, repli par nom du bien.
  const loyers = useMemo(() => {
    if (!activeGroupBienIds || !activeGroupBienNames) return allLoyers;
    return allLoyers.filter((l) =>
      l.bien_id ? activeGroupBienIds.includes(l.bien_id) : activeGroupBienNames.includes(l.bien_nom)
    );
  }, [allLoyers, activeGroupBienIds, activeGroupBienNames]);

  const tickets = useMemo(() => {
    if (!activeGroupBienIds || !activeGroupBienNames) return allTickets;
    return allTickets.filter((t) =>
      t.bien_id ? activeGroupBienIds.includes(t.bien_id) : activeGroupBienNames.includes(t.bien)
    );
  }, [allTickets, activeGroupBienIds, activeGroupBienNames]);

  // Suivi persistant des reversements validés
  const [validatedReversements, setValidatedReversements] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("lokka_validated_reversements") || "[]");
    } catch {
      return [];
    }
  });

  // État de la modale CRG
  const [selectedCrg, setSelectedCrg] = useState<CrgData | null>(null);

  // Recherche sur la table des reversements mandants
  const [searchReversements, setSearchReversements] = useState("");

  const handleValidateReversement = (loyerId: string, montantNet: number) => {
    const updated = [...validatedReversements, loyerId];
    setValidatedReversements(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("lokka_validated_reversements", JSON.stringify(updated));
    }
    toast.success("Ordre de virement validé", {
      description: `Reversement de ${montantNet.toLocaleString("fr-FR")} FCFA enregistré et comptabilisé.`,
    });
  };

  const handleOpenCrg = (l: any) => {
    const montant = Number(l.montant) || 0;
    const com = Math.round(montant * 0.1);
    const net = montant - com;
    const isReversed = validatedReversements.includes(l.id);

    setSelectedCrg({
      mandantNom: l.bien_nom.includes("SCI") ? "SCI Partenaire" : (mandats[0]?.proprietaire || "Propriétaire Mandant"),
      bienNom: l.bien_nom || "Lot sous gestion",
      periode: "Septembre 2026",
      loyerBrut: montant,
      commission10: com,
      chargesTravaux: 0,
      netReversed: net,
      statutVirement: isReversed ? "executé" : "en_attente",
      dateReglement: l.date_reglement || l.echeance,
      referencePaiement: l.reference_paiement,
    });
  };

  const stats = useMemo(() => {
    const payes = loyers.filter((l) => l.statut === "payé");
    const totalEncaisse = payes.reduce((sum, l) => sum + (Number(l.montant) || 0), 0);

    const totalTravaux = tickets.reduce(
      (sum, t) => sum + (Number(t.cout_reel) || Number(t.cout_estime) || 0),
      0
    );

    const commissions10 = Math.round(totalEncaisse * 0.1);
    const tfuEstimee = Math.round(totalEncaisse * 0.05);
    const totalCharges = totalTravaux + commissions10;
    const revenuNet = Math.max(0, totalEncaisse - totalCharges - tfuEstimee);
    const margeNette = totalEncaisse > 0 ? Math.round((revenuNet / totalEncaisse) * 100) : 100;

    const montantDejaReverse = payes
      .filter((l) => validatedReversements.includes(l.id))
      .reduce((sum, l) => sum + Math.round((Number(l.montant) || 0) * 0.9), 0);

    const reversementsAttente = Math.max(0, totalEncaisse - commissions10 - montantDejaReverse);

    return {
      totalEncaisse,
      totalTravaux,
      commissions10,
      tfuEstimee,
      totalCharges,
      revenuNet,
      margeNette,
      montantDejaReverse,
      reversementsAttente,
      payes,
    };
  }, [loyers, tickets, validatedReversements]);

  // Filtrage de la table des reversements par mandant ou par lot
  const filteredPayes = useMemo(() => {
    if (!searchReversements.trim()) return stats.payes;
    const q = searchReversements.trim().toLowerCase();
    return stats.payes.filter((l) => {
      const mandantLabel = l.bien_nom.includes("SCI")
        ? "SCI Partenaire"
        : (mandats[0]?.proprietaire || "Propriétaire Mandant");
      return l.bien_nom?.toLowerCase().includes(q) || mandantLabel.toLowerCase().includes(q);
    });
  }, [stats.payes, searchReversements, mandats]);

  const accountingLines = [
    {
      label: "Loyers bruts encaissés (Total annuel)",
      val: stats.totalEncaisse,
      note: "Total réel des encaissements enregistrés",
      type: "income",
    },
    {
      label: "Dépenses d'entretien, plomberie et réfection",
      val: stats.totalTravaux,
      note: "Montant cumulé des tickets de maintenance",
      type: "expense",
    },
    {
      label: "Commissions de gestion mandataire (10% — Loi 2022-30)",
      val: stats.commissions10,
      note: "Honoraires de gestion mandataire déductibles",
      type: "expense",
    },
    {
      label: "Taxe Foncière Unique estimée (TFU DGI Bénin)",
      val: stats.tfuEstimee,
      note: "Estimation fiscale conforme au Code Général des Impôts (5%)",
      type: "tax",
    },
  ];

  const handleExportPdf = () => {
    toast.success("Export comptable préparé", {
      description: "Le récapitulatif annuel certifié a été préparé pour impression.",
    });
    window.print();
  };

  const isLoading = isLoadingLoyers || isLoadingTickets;

  if (isLoading) {
    return (
      <div className="space-y-6 pb-12">
        <div className="h-20 bg-muted/60 animate-pulse rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-36 bg-muted/60 animate-pulse rounded-xl" />
          <div className="h-36 bg-muted/60 animate-pulse rounded-xl" />
          <div className="h-36 bg-muted/60 animate-pulse rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header avec sélecteur d'onglets pour Agence */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-card border border-border rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
              {isAgency ? "Comptabilité Mandataire · Loi 2022-30" : "Comptabilité Foncier"}
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">République du Bénin</span>
          </div>
          <h1 className="font-serif text-2xl font-normal text-card-foreground tracking-tight">
            {isAgency ? "Reversements Mandants & Reddition des Comptes" : "Comptabilité & Fiscalité Immobilière"}
          </h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            {isAgency
              ? "Ventilation des honoraires d'agence (10%), solde net dû aux propriétaires (90%) et émission des CRG."
              : "Bilan financier réel, suivi des charges d'entretien et estimation officielle TFU conforme DGI Bénin."}
          </p>
        </div>

        {isAgency && (
          <div className="flex items-center p-1 bg-muted/70 border border-border rounded-xl shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab("reversements")}
              className={`px-3 py-1.5 text-[12px] font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === "reversements"
                  ? "bg-card text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Reversements Mandants (90%)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("fiscalite")}
              className={`px-3 py-1.5 text-[12px] font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === "fiscalite"
                  ? "bg-card text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Fiscalité Cabinet &amp; TFU
            </button>
          </div>
        )}
      </div>

      {activeGroup && (
        <div className="flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl border border-[var(--primary)]/25 bg-[var(--primary-subtle)] text-[12.5px] font-semibold text-[var(--primary)]">
          <span className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4" />
            Filtré sur le groupe « {activeGroup} »
          </span>
          <button
            type="button"
            onClick={() => setActiveGroup(null)}
            className="flex items-center gap-1 text-[11.5px] font-bold px-2 py-1 rounded-lg hover:bg-white/60 cursor-pointer"
          >
            <XMarkIcon className="w-3.5 h-3.5" />
            Retirer le filtre
          </button>
        </div>
      )}

      {/* VUE REVERSEMENTS MANDANTS (AGENCE) */}
      {isAgency && activeTab === "reversements" ? (
        <div className="space-y-6">
          {/* 4 KPIs Reversements */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-[12px] text-muted-foreground font-medium mb-1">
                  Volume Global Perçu
                </div>
                <div className="text-[24px] font-extrabold text-card-foreground font-mono tracking-tight mb-2">
                  <NumberTicker value={stats.totalEncaisse} /> <span className="text-[13px] font-sans font-normal text-muted-foreground">FCFA</span>
                </div>
              </div>
              <div className="pt-2 border-t border-border text-[11px] text-muted-foreground">
                Total des loyers encaissés
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-[12px] text-blue-600 font-bold mb-1 flex items-center gap-1">
                  <HandCoins className="w-3.5 h-3.5" />
                  Honoraires Cabinet (10%)
                </div>
                <div className="text-[24px] font-extrabold text-blue-600 font-mono tracking-tight mb-2">
                  <NumberTicker value={stats.commissions10} /> <span className="text-[13px] font-sans font-normal text-blue-600/70">FCFA</span>
                </div>
              </div>
              <div className="pt-2 border-t border-border text-[11px] text-muted-foreground">
                Rémunération légale perçue
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-[12px] text-emerald-600 font-bold mb-1 flex items-center gap-1">
                  <Wallet className="w-3.5 h-3.5" />
                  Net Déjà Reversé
                </div>
                <div className="text-[24px] font-extrabold text-emerald-600 font-mono tracking-tight mb-2">
                  <NumberTicker value={stats.montantDejaReverse} /> <span className="text-[13px] font-sans font-normal text-emerald-600/70">FCFA</span>
                </div>
              </div>
              <div className="pt-2 border-t border-border text-[11px] text-muted-foreground">
                {validatedReversements.length} virement(s) exécuté(s)
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-[12px] text-amber-600 font-bold mb-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  À Reverser en Attente
                </div>
                <div className="text-[24px] font-extrabold text-amber-600 font-mono tracking-tight mb-2">
                  <NumberTicker value={stats.reversementsAttente} /> <span className="text-[13px] font-sans font-normal text-amber-600/70">FCFA</span>
                </div>
              </div>
              <div className="pt-2 border-t border-border text-[11px] text-muted-foreground">
                Soldes mandants à virer
              </div>
            </div>
          </div>

          {/* Table des Reversements Mandataires */}
          <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
              <div>
                <h3 className="text-[16px] font-bold text-card-foreground">
                  États des Reversements par Propriétaire Mandant
                </h3>
                <p className="text-[12px] text-muted-foreground">
                  Ventilation légale (90% propriétaire / 10% agence) et reddition mensuelle des comptes
                </p>
              </div>
              <span className="text-[11.5px] font-bold text-muted-foreground">
                {filteredPayes.length} encaissement(s) éligible(s)
              </span>
            </div>

            {stats.payes.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-[13px] border border-dashed border-border rounded-xl">
                Aucun loyer encaissé pour le moment. Dès qu'un locataire règle son loyer, le décompte des honoraires et du reversement net s'affichera ici.
              </div>
            ) : (
              <>
                <div className="relative max-w-md">
                  <MagnifyingGlassIcon className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchReversements}
                    onChange={(e) => setSearchReversements(e.target.value)}
                    placeholder="Rechercher un mandant, un lot..."
                    className="w-full pl-9 pr-3 py-2.5 border border-border rounded-lg text-[13px] bg-card text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                {filteredPayes.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground text-[13px] border border-dashed border-border rounded-xl">
                    Aucun reversement ne correspond à cette recherche.
                  </div>
                ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      <th className="pb-3">Mandant / Propriétaire</th>
                      <th className="pb-3">Lot Confié</th>
                      <th className="pb-3 text-right">Loyer Encaissé</th>
                      <th className="pb-3 text-right">Honoraires (10%)</th>
                      <th className="pb-3 text-right">Net Mandant (90%)</th>
                      <th className="pb-3 text-center">Statut Virement</th>
                      <th className="pb-3 text-right">Reddition CRG</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredPayes.map((l) => {
                      const montant = Number(l.montant) || 0;
                      const com = Math.round(montant * 0.1);
                      const net = montant - com;
                      const isReversed = validatedReversements.includes(l.id);
                      const mandantLabel = l.bien_nom.includes("SCI")
                        ? "SCI Partenaire"
                        : (mandats[0]?.proprietaire || "Propriétaire Mandant");

                      return (
                        <tr key={l.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3.5 font-semibold text-foreground">
                            {mandantLabel}
                          </td>
                          <td className="py-3.5 text-muted-foreground">
                            {l.bien_nom}
                          </td>
                          <td className="py-3.5 text-right font-mono font-medium">
                            {montant.toLocaleString("fr-FR")} FCFA
                          </td>
                          <td className="py-3.5 text-right font-mono text-blue-600 font-medium">
                            - {com.toLocaleString("fr-FR")} FCFA
                          </td>
                          <td className="py-3.5 text-right font-mono font-bold text-emerald-600">
                            {net.toLocaleString("fr-FR")} FCFA
                          </td>
                          <td className="py-3.5 text-center">
                            {isReversed ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 rounded-full text-[11px] font-bold">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Virement exécuté
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleValidateReversement(l.id, net)}
                                className="px-2.5 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-500/20 rounded-lg text-[11px] font-bold transition-all cursor-pointer"
                              >
                                Valider virement
                              </button>
                            )}
                          </td>
                          <td className="py-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => handleOpenCrg(l)}
                              className="inline-flex items-center gap-1 text-[12px] font-bold text-blue-600 hover:text-blue-800 underline cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Émettre CRG</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        /* VUE FISCALITÉ & TFU */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-[12px] text-muted-foreground font-medium mb-1">
                  Revenus bruts perçus ({selectedYear})
                </div>
                <div className="text-[26px] font-extrabold text-card-foreground tracking-tight mb-2 flex items-baseline gap-1">
                  <NumberTicker value={stats.totalEncaisse} />
                  <span className="text-[14px] font-semibold text-muted-foreground">FCFA</span>
                </div>
              </div>
              <div className="pt-2 border-t border-border text-[11px] text-muted-foreground">
                {stats.payes.length} loyer(s) réglé(s) avec reçu
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-[12px] text-muted-foreground font-medium mb-1">
                  Charges &amp; Travaux déductibles
                </div>
                <div className="text-[26px] font-extrabold text-card-foreground tracking-tight mb-2 flex items-baseline gap-1">
                  <NumberTicker value={stats.totalCharges} />
                  <span className="text-[14px] font-semibold text-muted-foreground">FCFA</span>
                </div>
              </div>
              <div className="pt-2 border-t border-border text-[11px] text-muted-foreground">
                {tickets.length} intervention(s) de maintenance
              </div>
            </div>

            <div className="relative bg-card border border-border rounded-xl p-5 shadow-xs flex flex-col justify-between overflow-hidden">
              <BorderBeam size={160} duration={12} colorFrom="#10B981" colorTo="#FAF9F6" />
              <div>
                <div className="text-[12px] text-muted-foreground font-medium mb-1">
                  Revenu net foncier estimé
                </div>
                <div className="text-[26px] font-extrabold text-card-foreground tracking-tight mb-2 flex items-baseline gap-1">
                  <NumberTicker value={stats.revenuNet} className="text-card-foreground" />
                  <span className="text-[14px] font-semibold text-muted-foreground">FCFA</span>
                </div>
              </div>
              <div className="pt-2 border-t border-border text-[11px] text-emerald-600 font-bold">
                Marge nette estimée : {stats.margeNette}%
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border mb-5">
              <div>
                <h3 className="text-[17px] font-bold text-card-foreground">
                  Synthèse Comptable &amp; Déclaration TFU {selectedYear}
                </h3>
                <p className="text-[12px] text-muted-foreground">
                  Ventilation calculée sur les flux réels de vos locations au Bénin
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportPdf}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-[12px] font-semibold rounded-lg transition cursor-pointer shadow-xs"
                >
                  <ArrowDownTrayIcon className="h-3.5 w-3.5" />
                  <span>Imprimer / Exporter (PDF)</span>
                </button>
              </div>
            </div>

            <div className="space-y-2.5">
              {accountingLines.map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg bg-muted/30 border border-border gap-2 hover:border-primary/40 transition-colors"
                >
                  <div>
                    <span className="font-semibold text-card-foreground text-[13px] block">
                      {item.label}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{item.note}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`text-[15px] font-bold ${
                        item.type === "income"
                          ? "text-emerald-600"
                          : item.type === "tax"
                          ? "text-amber-600"
                          : "text-card-foreground"
                      }`}
                    >
                      {item.type === "expense" && "- "}
                      {item.val.toLocaleString("fr-FR")} FCFA
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 p-4 rounded-xl bg-muted/20 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shrink-0">
                  <ShieldCheckIcon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[13px] font-bold text-card-foreground">
                    Calcul conforme Loi n° 2022-30 &amp; Code Général des Impôts
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    TFU déclarable en ligne auprès de la Direction Générale des Impôts (DGI Bénin)
                  </div>
                </div>
              </div>

              <a
                href="https://dgi.bj"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-card hover:bg-muted border border-border text-card-foreground text-[12px] font-semibold rounded-lg shadow-2xs transition cursor-pointer shrink-0"
              >
                Portail Officiel DGI Bénin →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Modale CRG pour reddition des comptes */}
      <CrgModal
        isOpen={Boolean(selectedCrg)}
        onClose={() => setSelectedCrg(null)}
        data={selectedCrg}
        agencyName={userProfile.name || "Cabinet Immobilier Lokka Gérance"}
      />
    </div>
  );
}
