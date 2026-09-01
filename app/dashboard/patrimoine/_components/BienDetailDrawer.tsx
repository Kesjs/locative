"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MapPinIcon,
  ChevronDownIcon,
  ArrowDownTrayIcon,
  ExclamationTriangleIcon,
  WrenchScrewdriverIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { RevenueChart } from "@/components/dashboard/shared/RevenueChart";
import type { Bien } from "@/lib/hooks/useBiens";
import { useUpdateBienStatut, useArchiveBien, plafondCaution } from "@/lib/hooks/useBiens";
import { useLoyers } from "@/lib/hooks/useLoyers";
import { useTickets } from "@/lib/hooks/useMaintenance";
import { useAnnonces, useToggleAnnonceStatut } from "@/lib/hooks/useAnnonces";

type Tab = "apercu" | "location" | "finances" | "annonce" | "maintenance";

const TABS: { id: Tab; label: string }[] = [
  { id: "apercu", label: "Aperçu" },
  { id: "location", label: "Location" },
  { id: "finances", label: "Finances" },
  { id: "annonce", label: "Annonce & Vitrine" },
  { id: "maintenance", label: "Maintenance" },
];

const STATUT_OPTIONS: Bien["statut"][] = ["loué", "vacant", "travaux"];

interface BienDetailDrawerProps {
  bien: Bien | null;
  onClose: () => void;
  onEdit: (bien: Bien) => void;
}

export function BienDetailDrawer({ bien, onClose, onEdit }: BienDetailDrawerProps) {
  const [tab, setTab] = useState<Tab>("apercu");
  const [photoIndex, setPhotoIndex] = useState(0);
  const [statutMenuOpen, setStatutMenuOpen] = useState(false);
  const [confirmArchive, setConfirmArchive] = useState(false);
  const [historiqueOpen, setHistoriqueOpen] = useState(false);

  const { mutateAsync: updateStatut, isPending: isUpdatingStatut } = useUpdateBienStatut();
  const { mutateAsync: archiveBien, isPending: isArchiving } = useArchiveBien();

  useEffect(() => {
    if (bien) {
      setTab("apercu");
      setPhotoIndex(0);
      setStatutMenuOpen(false);
      setConfirmArchive(false);
    }
  }, [bien?.id]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && bien) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [bien, onClose]);

  const handleStatutChange = async (statut: Bien["statut"]) => {
    if (!bien) return;
    setStatutMenuOpen(false);
    try {
      await updateStatut({ id: bien.id, statut });
      toast.success(`Statut mis à jour : ${statut}`);
    } catch {
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  const handleArchive = async () => {
    if (!bien) return;
    try {
      await archiveBien(bien.id);
      toast.success("Bien archivé");
      setConfirmArchive(false);
      onClose();
    } catch {
      toast.error("Erreur lors de l'archivage");
    }
  };

  return (
    <AnimatePresence>
      {bien && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.22, ease: "easeOut" }}
            className="fixed inset-y-0 right-0 z-50 w-full sm:w-[520px] bg-card shadow-modal flex flex-col
                       sm:inset-y-0 max-sm:inset-x-0 max-sm:top-[8%] max-sm:rounded-t-2xl max-sm:h-[92%]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
              <div className="min-w-0">
                <h2 className="text-[16px] font-bold text-card-foreground truncate">{bien.nom}</h2>
                <p className="text-[12px] text-muted-foreground flex items-center gap-1 truncate">
                  <MapPinIcon className="w-3.5 h-3.5 shrink-0" /> {bien.adresse}, {bien.ville}
                </p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-muted rounded-full shrink-0 ml-2" aria-label="Fermer">
                <XMarkIcon className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto border-b border-border shrink-0 no-scrollbar">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`relative px-4 py-3 text-[12.5px] font-bold whitespace-nowrap transition-colors ${
                    tab === t.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label}
                  {tab === t.id && (
                    <motion.div layoutId="drawer-tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="p-5"
                >
                  {tab === "apercu" && <ApercuTab bien={bien} photoIndex={photoIndex} setPhotoIndex={setPhotoIndex} />}
                  {tab === "location" && (
                    <LocationTab bien={bien} historiqueOpen={historiqueOpen} setHistoriqueOpen={setHistoriqueOpen} />
                  )}
                  {tab === "finances" && <FinancesTab bien={bien} />}
                  {tab === "annonce" && <AnnonceTab bien={bien} />}
                  {tab === "maintenance" && <MaintenanceTab bien={bien} />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer actions */}
            <div className="border-t border-border p-4 flex items-center gap-2 shrink-0 relative">
              <button
                onClick={() => onEdit(bien)}
                className="flex-1 px-4 py-2.5 border border-border rounded-lg text-[13px] font-bold text-foreground hover:bg-muted/50 transition-colors"
              >
                Modifier
              </button>

              <div className="relative flex-1">
                <button
                  onClick={() => setStatutMenuOpen((o) => !o)}
                  disabled={isUpdatingStatut}
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-[13px] font-bold text-foreground hover:bg-muted/50 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  Changer statut <ChevronDownIcon className="w-3.5 h-3.5" />
                </button>
                <AnimatePresence>
                  {statutMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute bottom-full mb-2 left-0 right-0 bg-popover border border-border rounded-xl shadow-modal p-1.5 z-10"
                    >
                      {STATUT_OPTIONS.map((s) => (
                        <button
                          key={s}
                          onClick={() => handleStatutChange(s)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium capitalize transition-colors ${
                            bien.statut === s ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted/50"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {!confirmArchive ? (
                <button
                  onClick={() => setConfirmArchive(true)}
                  className="px-4 py-2.5 border border-destructive/30 text-destructive rounded-lg text-[13px] font-bold hover:bg-destructive/10 transition-colors"
                >
                  Archiver
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleArchive}
                    disabled={isArchiving}
                    className="px-3 py-2.5 bg-destructive text-white rounded-lg text-[12.5px] font-bold disabled:opacity-50"
                  >
                    {isArchiving ? "..." : "Confirmer"}
                  </button>
                  <button
                    onClick={() => setConfirmArchive(false)}
                    className="px-3 py-2.5 border border-border rounded-lg text-[12.5px] font-bold text-foreground"
                  >
                    Annuler
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Onglet Aperçu ───────────────────────────────────────────────

function ApercuTab({
  bien,
  photoIndex,
  setPhotoIndex,
}: {
  bien: Bien;
  photoIndex: number;
  setPhotoIndex: (i: number) => void;
}) {
  const photos = bien.photos && bien.photos.length > 0 ? bien.photos : [bien.photo_principale].filter(Boolean) as string[];
  const plafond = plafondCaution(bien.loyer_mensuel);
  const cautionDepasse = (bien.caution_montant || 0) > plafond;

  const touchStart = React.useRef(0);
  const onTouchStart = (e: React.TouchEvent) => (touchStart.current = e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientX - touchStart.current;
    if (delta > 50 && photoIndex > 0) setPhotoIndex(photoIndex - 1);
    if (delta < -50 && photoIndex < photos.length - 1) setPhotoIndex(photoIndex + 1);
  };

  return (
    <div className="space-y-5">
      {photos.length > 0 && (
        <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-muted" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <AnimatePresence mode="wait">
            <motion.img
              key={photoIndex}
              src={photos[photoIndex]}
              alt={bien.nom}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
          {photos.length > 1 && (
            <>
              <button
                onClick={() => setPhotoIndex(Math.max(0, photoIndex - 1))}
                disabled={photoIndex === 0}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/40 text-white rounded-full disabled:opacity-30 hover:bg-black/60 transition-colors"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPhotoIndex(Math.min(photos.length - 1, photoIndex + 1))}
                disabled={photoIndex === photos.length - 1}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/40 text-white rounded-full disabled:opacity-30 hover:bg-black/60 transition-colors"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {photos.map((_, i) => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === photoIndex ? "bg-white" : "bg-white/40"}`} />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-muted/40 rounded-lg py-2.5">
          <p className="text-[16px] font-extrabold text-card-foreground">{bien.surface_m2 ?? "—"}</p>
          <p className="text-[10.5px] text-muted-foreground font-semibold uppercase">m²</p>
        </div>
        <div className="bg-muted/40 rounded-lg py-2.5">
          <p className="text-[16px] font-extrabold text-card-foreground">{bien.nb_pieces ?? "—"}</p>
          <p className="text-[10.5px] text-muted-foreground font-semibold uppercase">Pièces</p>
        </div>
        <div className="bg-muted/40 rounded-lg py-2.5">
          <p className="text-[16px] font-extrabold text-card-foreground truncate px-1">{bien.type || "—"}</p>
          <p className="text-[10.5px] text-muted-foreground font-semibold uppercase">Type</p>
        </div>
      </div>

      {bien.equipements && bien.equipements.length > 0 && (
        <div>
          <p className="text-[11px] font-bold text-muted-foreground uppercase mb-2">Équipements</p>
          <div className="flex flex-wrap gap-1.5">
            {bien.equipements.map((eq) => (
              <span key={eq} className="px-2.5 py-1 rounded-full text-[12px] font-semibold bg-muted text-foreground">
                {eq}
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-[11px] font-bold text-muted-foreground uppercase mb-2">Caution</p>
        <div className={`rounded-lg p-3 border ${cautionDepasse ? "border-destructive/30 bg-destructive/5" : "border-border bg-muted/30"}`}>
          <div className="flex items-baseline justify-between">
            <span className="text-[15px] font-extrabold text-card-foreground">
              {(bien.caution_montant || 0).toLocaleString("fr-FR")} FCFA
            </span>
            <span className="text-[11px] text-muted-foreground">Plafond légal : {plafond.toLocaleString("fr-FR")} FCFA</span>
          </div>
          {cautionDepasse && (
            <p className="mt-1.5 flex items-center gap-1.5 text-[11.5px] font-semibold text-destructive">
              <ExclamationTriangleIcon className="w-3.5 h-3.5 shrink-0" />
              Ce montant dépasse le plafond légal de 3 mois de loyer
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Onglet Location ─────────────────────────────────────────────

function LocationTab({
  bien,
  historiqueOpen,
  setHistoriqueOpen,
}: {
  bien: Bien;
  historiqueOpen: boolean;
  setHistoriqueOpen: (v: boolean) => void;
}) {
  return (
    <div className="space-y-5">
      {bien.statut === "vacant" ? (
        <div className="rounded-xl border border-warning/30 bg-warning/5 p-4 text-center">
          <p className="text-[13px] font-semibold text-foreground mb-3">Ce bien est actuellement vacant.</p>
          <Link
            href={`/dashboard/annonces?bien=${encodeURIComponent(bien.nom)}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-[13px] font-bold hover:bg-primary/90 transition-colors"
          >
            Trouver un locataire
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-border p-4">
          <p className="text-[11px] font-bold text-muted-foreground uppercase mb-1">Locataire actuel</p>
          <p className="text-[15px] font-bold text-card-foreground">{bien.locataire_nom || "—"}</p>
          <div className="grid grid-cols-2 gap-3 mt-3 text-[13px]">
            <div>
              <p className="text-muted-foreground text-[11px]">Loyer</p>
              <p className="font-bold text-card-foreground">{bien.loyer_mensuel.toLocaleString("fr-FR")} FCFA</p>
            </div>
            <div>
              <p className="text-muted-foreground text-[11px]">Charges</p>
              <p className="font-bold text-card-foreground">{(bien.charges || 0).toLocaleString("fr-FR")} FCFA</p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border overflow-hidden">
        <button
          onClick={() => setHistoriqueOpen(!historiqueOpen)}
          className="w-full flex items-center justify-between px-4 py-3 text-[13px] font-bold text-card-foreground hover:bg-muted/30 transition-colors"
        >
          Historique des locataires précédents
          <motion.div animate={{ rotate: historiqueOpen ? 180 : 0 }} transition={{ duration: 0.15 }}>
            <ChevronDownIcon className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        </button>
        <AnimatePresence initial={false}>
          {historiqueOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden border-t border-border"
            >
              <div className="p-4 text-[12.5px] text-muted-foreground">
                Aucun historique disponible pour ce bien pour le moment.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Onglet Finances ─────────────────────────────────────────────

function FinancesTab({ bien }: { bien: Bien }) {
  const { data: loyers = [], isLoading } = useLoyers();
  const paiementsBien = useMemo(() => loyers.filter((t) => t.bien_nom === bien.nom), [loyers, bien.nom]);

  const totalEncaisse = useMemo(
    () => paiementsBien.filter((t) => t.statut === "payé").reduce((sum, t) => sum + t.montant, 0),
    [paiementsBien]
  );

  const chartData = useMemo(() => {
    const byMonth: Record<string, number> = {};
    paiementsBien
      .filter((t) => t.statut === "payé")
      .forEach((t) => {
        const key = t.date_reglement?.slice(3) || "—";
        byMonth[key] = (byMonth[key] || 0) + t.montant;
      });
    return Object.entries(byMonth).map(([month, montant]) => ({ month, montant }));
  }, [paiementsBien]);

  const handleTelechargerQuittances = () => {
    const urls = paiementsBien.map((t) => t.quittance_url).filter(Boolean) as string[];
    if (urls.length === 0) {
      toast.error("Aucune quittance disponible pour ce bien");
      return;
    }
    urls.forEach((url) => window.open(url, "_blank"));
    toast.success(`${urls.length} quittance${urls.length > 1 ? "s" : ""} ouverte${urls.length > 1 ? "s" : ""}`);
  };

  if (isLoading) {
    return <div className="h-40 bg-muted/40 rounded-xl animate-pulse" />;
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border p-4">
        <p className="text-[11px] font-bold text-muted-foreground uppercase mb-1">Total encaissé (12 derniers mois)</p>
        <p className="text-[22px] font-extrabold text-card-foreground">{totalEncaisse.toLocaleString("fr-FR")} FCFA</p>
        {chartData.length > 0 && <RevenueChart data={chartData} type="area" xAxisKey="month" dataKeys={["montant"]} />}
      </div>

      <div>
        <p className="text-[11px] font-bold text-muted-foreground uppercase mb-2">Historique des paiements</p>
        {paiementsBien.length === 0 ? (
          <p className="text-[12.5px] text-muted-foreground py-4 text-center border border-dashed border-border rounded-lg">
            Aucun paiement enregistré pour ce bien.
          </p>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            {paiementsBien.map((t, i) => (
              <div
                key={t.id}
                className={`flex items-center justify-between px-3 py-2.5 text-[12.5px] ${i !== 0 ? "border-t border-border" : ""}`}
              >
                <div>
                  <p className="font-semibold text-card-foreground">{t.echeance}</p>
                  <p className="text-muted-foreground text-[11px]">{t.methode}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-card-foreground">{t.montant.toLocaleString("fr-FR")} FCFA</p>
                  <p
                    className={`text-[10.5px] font-bold uppercase ${
                      t.statut === "payé" ? "text-success" : t.statut === "retard" ? "text-destructive" : "text-warning"
                    }`}
                  >
                    {t.statut}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleTelechargerQuittances}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-border rounded-lg text-[13px] font-bold text-foreground hover:bg-muted/50 transition-colors"
      >
        <ArrowDownTrayIcon className="w-4 h-4" /> Télécharger toutes les quittances
      </button>
    </div>
  );
}

// ─── Onglet Annonce & Vitrine ────────────────────────────────────

function AnnonceTab({ bien }: { bien: Bien }) {
  const { data: annonces = [], isLoading } = useAnnonces();
  const { mutateAsync: toggleStatut, isPending } = useToggleAnnonceStatut();
  const annonce = useMemo(() => annonces.find((a) => a.bien === bien.nom), [annonces, bien.nom]);

  const handleToggle = async () => {
    if (!annonce) return;
    const nextStatut = annonce.statut === "Active" ? "Suspendue" : "Active";
    try {
      await toggleStatut({ id: annonce.id, statut: nextStatut });
      toast.success(nextStatut === "Active" ? "Annonce publiée" : "Annonce suspendue");
    } catch {
      toast.error("Erreur lors de la mise à jour de l'annonce");
    }
  };

  if (isLoading) {
    return <div className="h-32 bg-muted/40 rounded-xl animate-pulse" />;
  }

  if (!annonce) {
    return (
      <div className="text-center py-8">
        <p className="text-[13px] text-muted-foreground mb-4">Ce bien n'a pas encore d'annonce publiée.</p>
        <Link
          href={`/dashboard/annonces?bien=${encodeURIComponent(bien.nom)}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-[13px] font-bold hover:bg-primary/90 transition-colors"
        >
          <PlusIcon className="w-4 h-4" /> Créer une annonce
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border p-4 flex items-center justify-between">
        <div>
          <p className="text-[13px] font-bold text-card-foreground">Statut de publication</p>
          <p className="text-[11.5px] text-muted-foreground">{annonce.statut === "Active" ? "Visible sur la vitrine publique" : "Masquée du public"}</p>
        </div>
        <button
          onClick={handleToggle}
          disabled={isPending}
          aria-pressed={annonce.statut === "Active"}
          className={`relative w-11 h-6 rounded-full transition-colors shrink-0 disabled:opacity-50 ${
            annonce.statut === "Active" ? "bg-success" : "bg-muted"
          }`}
        >
          <motion.div
            animate={{ x: annonce.statut === "Active" ? 20 : 2 }}
            transition={{ duration: 0.15 }}
            className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
          />
        </button>
      </div>

      {annonce.lien_public && (
        <a
          href={`https://${annonce.lien_public}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center px-4 py-2.5 border border-border rounded-lg text-[13px] font-bold text-primary hover:bg-primary/5 transition-colors"
        >
          Voir la page vitrine publique
        </a>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border p-4 text-center">
          <p className="text-[20px] font-extrabold text-card-foreground">{annonce.vues}</p>
          <p className="text-[11px] text-muted-foreground font-semibold uppercase">Vues</p>
        </div>
        <div className="rounded-xl border border-border p-4 text-center">
          <p className="text-[20px] font-extrabold text-card-foreground">{annonce.demandes}</p>
          <p className="text-[11px] text-muted-foreground font-semibold uppercase">Demandes de visite</p>
        </div>
      </div>
    </div>
  );
}

// ─── Onglet Maintenance ──────────────────────────────────────────

function MaintenanceTab({ bien }: { bien: Bien }) {
  const { data: tickets = [], isLoading } = useTickets();
  const ticketsBien = useMemo(() => tickets.filter((t) => t.bien === bien.nom), [tickets, bien.nom]);

  if (isLoading) {
    return <div className="h-32 bg-muted/40 rounded-xl animate-pulse" />;
  }

  return (
    <div className="space-y-4">
      {ticketsBien.length === 0 ? (
        <p className="text-[12.5px] text-muted-foreground py-6 text-center border border-dashed border-border rounded-lg">
          Aucun ticket de maintenance pour ce bien.
        </p>
      ) : (
        <div className="space-y-2">
          {ticketsBien.map((t) => (
            <div key={t.id} className="rounded-lg border border-border p-3 flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-card-foreground truncate">{t.titre}</p>
                <p className="text-[11px] text-muted-foreground">Urgence : {t.urgence}</p>
              </div>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                  t.statut === "Résolu" ? "bg-success/10 text-success" : t.statut === "En cours" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                }`}
              >
                {t.statut}
              </span>
            </div>
          ))}
        </div>
      )}

      <Link
        href={`/dashboard/maintenance?bien=${encodeURIComponent(bien.nom)}`}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-border rounded-lg text-[13px] font-bold text-foreground hover:bg-muted/50 transition-colors"
      >
        <WrenchScrewdriverIcon className="w-4 h-4" /> Créer un ticket pour ce bien
      </Link>
    </div>
  );
}
