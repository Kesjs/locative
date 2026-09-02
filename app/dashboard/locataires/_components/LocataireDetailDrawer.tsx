"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  XMarkIcon,
  MapPinIcon,
  PhoneIcon,
  IdentificationIcon,
  ExclamationTriangleIcon,
  DocumentArrowDownIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { plafondCaution } from "@/lib/hooks/useBiens";
import {
  type LeaseWithDetails,
  useRentLedger,
  useReceipts,
  useRecordPayment,
  useTerminateLease,
  useRenewLease,
  joursAvantEcheanceBail,
  statutPaiement,
} from "@/lib/hooks/useLocataires";
import { useTickets } from "@/lib/hooks/useMaintenance";

type Tab = "profil" | "bail" | "paiements" | "maintenance";

const TABS: { id: Tab; label: string }[] = [
  { id: "profil", label: "Profil" },
  { id: "bail", label: "Bail" },
  { id: "paiements", label: "Paiements" },
  { id: "maintenance", label: "Maintenance" },
];

interface LocataireDetailDrawerProps {
  lease: LeaseWithDetails | null;
  onClose: () => void;
}

export function LocataireDetailDrawer({ lease, onClose }: LocataireDetailDrawerProps) {
  const [tab, setTab] = useState<Tab>("profil");
  const [confirmTerminate, setConfirmTerminate] = useState(false);
  const [renewDate, setRenewDate] = useState("");
  const [showRenew, setShowRenew] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");

  const { mutateAsync: terminateLease, isPending: isTerminating } = useTerminateLease();
  const { mutateAsync: renewLease, isPending: isRenewing } = useRenewLease();
  const { mutateAsync: recordPayment, isPending: isRecording } = useRecordPayment();

  useEffect(() => {
    if (lease) {
      setTab("profil");
      setConfirmTerminate(false);
      setShowRenew(false);
      setPaymentAmount("");
    }
  }, [lease?.id]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && lease) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lease, onClose]);

  const handleTerminate = async () => {
    if (!lease) return;
    try {
      await terminateLease({ leaseId: lease.id, bienId: lease.bien_id });
      toast.success("Bail résilié, le bien repasse en vacant");
      setConfirmTerminate(false);
      onClose();
    } catch {
      toast.error("Erreur lors de la résiliation");
    }
  };

  const handleRenew = async () => {
    if (!lease || !renewDate) return;
    try {
      await renewLease({ leaseId: lease.id, newEndDate: renewDate });
      toast.success("Bail renouvelé");
      setShowRenew(false);
    } catch {
      toast.error("Erreur lors du renouvellement");
    }
  };

  const handleRecordPayment = async () => {
    if (!lease || !paymentAmount) return;
    const now = new Date();
    const period = now.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
    try {
      await recordPayment({
        lease_id: lease.id,
        bien_id: lease.bien_id,
        amount: Number(paymentAmount),
        payment_method: "virement",
        notes: period,
      });
      toast.success("Paiement enregistré, quittance générée");
      setPaymentAmount("");
    } catch {
      toast.error("Erreur lors de l'enregistrement du paiement");
    }
  };

  return (
    <AnimatePresence>
      {lease && (
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
                       max-sm:inset-x-0 max-sm:top-[8%] max-sm:rounded-t-2xl max-sm:h-[92%]"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
              <div className="min-w-0">
                <h2 className="text-[16px] font-bold text-card-foreground truncate">{lease.tenant.full_name}</h2>
                <p className="text-[12px] text-muted-foreground flex items-center gap-1 truncate">
                  <MapPinIcon className="w-3.5 h-3.5 shrink-0" /> {lease.bien?.nom || "Logement supprimé"}
                </p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-muted rounded-full shrink-0 ml-2" aria-label="Fermer">
                <XMarkIcon className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

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
                  {tab === t.id && <motion.div layoutId="loc-tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                </button>
              ))}
            </div>

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
                  {tab === "profil" && <ProfilTab lease={lease} />}
                  {tab === "bail" && (
                    <BailTab
                      lease={lease}
                      showRenew={showRenew}
                      setShowRenew={setShowRenew}
                      renewDate={renewDate}
                      setRenewDate={setRenewDate}
                      onRenew={handleRenew}
                      isRenewing={isRenewing}
                    />
                  )}
                  {tab === "paiements" && (
                    <PaiementsTab
                      lease={lease}
                      paymentAmount={paymentAmount}
                      setPaymentAmount={setPaymentAmount}
                      onRecordPayment={handleRecordPayment}
                      isRecording={isRecording}
                    />
                  )}
                  {tab === "maintenance" && <MaintenanceTab bienNom={lease.bien?.nom} />}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="border-t border-border p-4 flex items-center gap-2 shrink-0">
              {!confirmTerminate ? (
                <button
                  onClick={() => setConfirmTerminate(true)}
                  className="w-full px-4 py-2.5 border border-destructive/30 text-destructive rounded-lg text-[13px] font-bold hover:bg-destructive/10 transition-colors"
                >
                  Résilier le bail
                </button>
              ) : (
                <div className="flex items-center gap-2 w-full">
                  <button
                    onClick={handleTerminate}
                    disabled={isTerminating}
                    className="flex-1 px-4 py-2.5 bg-destructive text-white rounded-lg text-[13px] font-bold disabled:opacity-50"
                  >
                    {isTerminating ? "..." : "Confirmer la résiliation"}
                  </button>
                  <button
                    onClick={() => setConfirmTerminate(false)}
                    className="px-4 py-2.5 border border-border rounded-lg text-[13px] font-bold text-foreground"
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

function ProfilTab({ lease }: { lease: LeaseWithDetails }) {
  const t = lease.tenant;
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border p-4 space-y-3">
        <InfoRow icon={PhoneIcon} label="Téléphone" value={t.phone_number} />
        {t.whatsapp_number && <InfoRow icon={PhoneIcon} label="WhatsApp" value={t.whatsapp_number} />}
        {t.email && <InfoRow icon={PhoneIcon} label="Email" value={t.email} />}
        {t.profession && <InfoRow icon={IdentificationIcon} label="Profession" value={t.profession} />}
        {t.id_card_type && (
          <InfoRow icon={IdentificationIcon} label="Pièce d'identité" value={`${t.id_card_type} — ${t.id_card_number || "—"}`} />
        )}
      </div>

      {(t.emergency_contact_name || t.emergency_contact_phone) && (
        <div>
          <p className="text-[11px] font-bold text-muted-foreground uppercase mb-2">Contact d'urgence</p>
          <div className="rounded-lg border border-border p-3">
            <p className="text-[13px] font-semibold text-card-foreground">{t.emergency_contact_name || "—"}</p>
            <p className="text-[12px] text-muted-foreground">{t.emergency_contact_phone || "—"}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
      <div className="min-w-0">
        <p className="text-[10.5px] text-muted-foreground font-semibold uppercase">{label}</p>
        <p className="text-[13px] font-semibold text-card-foreground truncate">{value}</p>
      </div>
    </div>
  );
}

function BailTab({
  lease,
  showRenew,
  setShowRenew,
  renewDate,
  setRenewDate,
  onRenew,
  isRenewing,
}: {
  lease: LeaseWithDetails;
  showRenew: boolean;
  setShowRenew: (v: boolean) => void;
  renewDate: string;
  setRenewDate: (v: string) => void;
  onRenew: () => void;
  isRenewing: boolean;
}) {
  const plafond = plafondCaution(lease.rent_amount);
  const cautionDepasse = (lease.deposit_amount || 0) > plafond;
  const joursEcheance = joursAvantEcheanceBail(lease.end_date);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-muted/40 p-3">
          <p className="text-[10.5px] text-muted-foreground font-semibold uppercase">Loyer</p>
          <p className="text-[15px] font-extrabold text-card-foreground">{lease.rent_amount.toLocaleString("fr-FR")} FCFA</p>
        </div>
        <div className="rounded-lg bg-muted/40 p-3">
          <p className="text-[10.5px] text-muted-foreground font-semibold uppercase">Charges</p>
          <p className="text-[15px] font-extrabold text-card-foreground">{(lease.charges_amount || 0).toLocaleString("fr-FR")} FCFA</p>
        </div>
        <div className="rounded-lg bg-muted/40 p-3">
          <p className="text-[10.5px] text-muted-foreground font-semibold uppercase">Échéance mensuelle</p>
          <p className="text-[15px] font-extrabold text-card-foreground">Le {lease.due_day} du mois</p>
        </div>
        <div className="rounded-lg bg-muted/40 p-3">
          <p className="text-[10.5px] text-muted-foreground font-semibold uppercase">Début du bail</p>
          <p className="text-[15px] font-extrabold text-card-foreground">{new Date(lease.start_date).toLocaleDateString("fr-FR")}</p>
        </div>
      </div>

      <div>
        <p className="text-[11px] font-bold text-muted-foreground uppercase mb-2">Caution</p>
        <div className={`rounded-lg p-3 border ${cautionDepasse ? "border-destructive/30 bg-destructive/5" : "border-border bg-muted/30"}`}>
          <div className="flex items-baseline justify-between">
            <span className="text-[15px] font-extrabold text-card-foreground">{lease.deposit_amount.toLocaleString("fr-FR")} FCFA</span>
            <span className="text-[11px] text-muted-foreground">{lease.deposit_months} mois — plafond {plafond.toLocaleString("fr-FR")} FCFA</span>
          </div>
          {cautionDepasse && (
            <p className="mt-1.5 flex items-center gap-1.5 text-[11.5px] font-semibold text-destructive">
              <ExclamationTriangleIcon className="w-3.5 h-3.5 shrink-0" /> Dépasse le plafond légal de 3 mois de loyer
            </p>
          )}
        </div>
      </div>

      <div>
        <p className="text-[11px] font-bold text-muted-foreground uppercase mb-2">Fin de bail</p>
        {lease.end_date ? (
          <div
            className={`rounded-lg p-3 border ${
              joursEcheance !== null && joursEcheance <= 60 ? "border-warning/30 bg-warning/5" : "border-border bg-muted/30"
            }`}
          >
            <p className="text-[13px] font-semibold text-card-foreground">{new Date(lease.end_date).toLocaleDateString("fr-FR")}</p>
            {joursEcheance !== null && joursEcheance <= 60 && joursEcheance >= 0 && (
              <p className="text-[11.5px] font-semibold text-warning mt-1">Dans {joursEcheance} jours</p>
            )}
          </div>
        ) : (
          <p className="text-[12.5px] text-muted-foreground">Durée indéterminée</p>
        )}
      </div>

      {lease.lease_contract_url ? (
        <a
          href={lease.lease_contract_url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-border rounded-lg text-[13px] font-bold text-foreground hover:bg-muted/50 transition-colors"
        >
          <DocumentArrowDownIcon className="w-4 h-4" /> Voir le contrat signé
        </a>
      ) : (
        <p className="text-[12px] text-muted-foreground text-center py-2 border border-dashed border-border rounded-lg">
          Aucun contrat signé n'a été joint à ce bail.
        </p>
      )}

      {!showRenew ? (
        <button
          onClick={() => setShowRenew(true)}
          className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-[13px] font-bold hover:bg-primary/90 transition-colors"
        >
          Renouveler le bail
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={renewDate}
            onChange={(e) => setRenewDate(e.target.value)}
            className="flex-1 border border-border rounded-lg px-3 py-2.5 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background"
          />
          <button
            onClick={onRenew}
            disabled={!renewDate || isRenewing}
            className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-[13px] font-bold disabled:opacity-50"
          >
            {isRenewing ? "..." : "Valider"}
          </button>
        </div>
      )}
    </div>
  );
}

function PaiementsTab({
  lease,
  paymentAmount,
  setPaymentAmount,
  onRecordPayment,
  isRecording,
}: {
  lease: LeaseWithDetails;
  paymentAmount: string;
  setPaymentAmount: (v: string) => void;
  onRecordPayment: () => void;
  isRecording: boolean;
}) {
  const { data: ledger = [], isLoading: loadingLedger } = useRentLedger(lease.id);
  const { data: receipts = [], isLoading: loadingReceipts } = useReceipts(lease.id);
  const statut = statutPaiement(lease.balance_due || 0);

  return (
    <div className="space-y-5">
      <div className={`rounded-xl border p-4 ${statut === "retard" ? "border-destructive/30 bg-destructive/5" : "border-success/30 bg-success/5"}`}>
        <p className="text-[11px] font-bold text-muted-foreground uppercase mb-1">Solde du bail</p>
        <p className={`text-[20px] font-extrabold ${statut === "retard" ? "text-destructive" : "text-success"}`}>
          {(lease.balance_due || 0).toLocaleString("fr-FR")} FCFA
        </p>
        <p className="text-[11.5px] font-semibold text-muted-foreground mt-0.5">
          {statut === "retard" ? "Montant dû par le locataire" : "À jour"}
        </p>
      </div>

      <div>
        <p className="text-[11px] font-bold text-muted-foreground uppercase mb-2">Enregistrer un paiement</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            placeholder="Montant en FCFA"
            className="flex-1 border border-border rounded-lg px-3 py-2.5 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background"
          />
          <button
            onClick={onRecordPayment}
            disabled={!paymentAmount || isRecording}
            className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-[13px] font-bold disabled:opacity-50 whitespace-nowrap"
          >
            {isRecording ? "..." : "Enregistrer"}
          </button>
        </div>
      </div>

      <div>
        <p className="text-[11px] font-bold text-muted-foreground uppercase mb-2">Historique (grand livre)</p>
        {loadingLedger ? (
          <div className="h-20 bg-muted/40 rounded-lg animate-pulse" />
        ) : ledger.length === 0 ? (
          <p className="text-[12.5px] text-muted-foreground py-4 text-center border border-dashed border-border rounded-lg">
            Aucune écriture pour ce bail.
          </p>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            {ledger.map((entry, i) => (
              <div key={entry.id} className={`flex items-center justify-between px-3 py-2.5 text-[12.5px] ${i !== 0 ? "border-t border-border" : ""}`}>
                <div>
                  <p className="font-semibold text-card-foreground capitalize">{entry.type.replace(/_/g, " ")}</p>
                  <p className="text-muted-foreground text-[11px]">
                    {entry.created_at ? new Date(entry.created_at).toLocaleDateString("fr-FR") : "—"}
                  </p>
                </div>
                <p className={`font-bold ${entry.type === "paiement" ? "text-success" : "text-card-foreground"}`}>
                  {entry.type === "paiement" ? "+" : ""}
                  {entry.amount.toLocaleString("fr-FR")} FCFA
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="text-[11px] font-bold text-muted-foreground uppercase mb-2">Quittances</p>
        {loadingReceipts ? (
          <div className="h-16 bg-muted/40 rounded-lg animate-pulse" />
        ) : receipts.length === 0 ? (
          <p className="text-[12.5px] text-muted-foreground py-3 text-center border border-dashed border-border rounded-lg">
            Aucune quittance générée.
          </p>
        ) : (
          <div className="space-y-1.5">
            {receipts.map((r) => (
              <div key={r.id} className="flex items-center justify-between px-3 py-2 rounded-lg border border-border text-[12.5px]">
                <span className="font-semibold text-card-foreground capitalize">{r.period}</span>
                <span className="text-muted-foreground">{r.amount.toLocaleString("fr-FR")} FCFA</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MaintenanceTab({ bienNom }: { bienNom?: string }) {
  const { data: tickets = [], isLoading } = useTickets();
  const ticketsBien = useMemo(() => tickets.filter((t) => t.bien === bienNom), [tickets, bienNom]);

  if (isLoading) return <div className="h-32 bg-muted/40 rounded-xl animate-pulse" />;

  return (
    <div className="space-y-4">
      {ticketsBien.length === 0 ? (
        <p className="text-[12.5px] text-muted-foreground py-6 text-center border border-dashed border-border rounded-lg">
          Aucun ticket de maintenance pour ce logement.
        </p>
      ) : (
        <div className="space-y-2">
          {ticketsBien.map((t) => (
            <div key={t.id} className="rounded-lg border border-border p-3 flex items-center justify-between">
              <p className="text-[13px] font-semibold text-card-foreground truncate">{t.titre}</p>
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
      <a
        href={`/dashboard/maintenance?bien=${encodeURIComponent(bienNom || "")}`}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-border rounded-lg text-[13px] font-bold text-foreground hover:bg-muted/50 transition-colors"
      >
        <WrenchScrewdriverIcon className="w-4 h-4" /> Créer un ticket
      </a>
    </div>
  );
}
