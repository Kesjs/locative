"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/dashboard/Header";
import ReceiptModal from "@/components/dashboard/ReceiptModal";
import { QuickActionDock } from "@/components/dashboard/QuickActionDock";
import { NumberTicker } from "@/components/ui/number-ticker";
import { BorderBeam } from "@/components/ui/border-beam";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  PlusIcon,
  ArrowUpRightIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  DocumentTextIcon,
  SparklesIcon,
  XMarkIcon,
  CheckIcon,
  BuildingOffice2Icon,
  ChatBubbleLeftRightIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useSidebar } from "@/components/ui/sidebar";

// Revenue area chart mock data (FCFA)
const revenueMonthlyData = [
  { month: "Jan", gross: 3400000, commission: 340000, tfu: 408000 },
  { month: "Fév", gross: 3800000, commission: 380000, tfu: 456000 },
  { month: "Mar", gross: 4200000, commission: 420000, tfu: 504000 },
  { month: "Avr", gross: 4100000, commission: 410000, tfu: 492000 },
  { month: "Mai", gross: 4650000, commission: 465000, tfu: 558000 },
  { month: "Juin", gross: 4850000, commission: 485000, tfu: 582000 },
];

const defaultActivity = [
  {
    id: 1,
    tenant: "Koudjo Dossou",
    avatar: "https://i.pravatar.cc/40?img=12",
    property: "Villa 4P — Fidjrossè Plage",
    city: "Cotonou",
    rent: 350000,
    channel: "mtn",
    channelLabel: "MTN MoMo",
    status: "Vérifié",
    statusType: "success",
    date: "Aujourd'hui, 09:42",
    receiptNo: "LOK-2026-0891",
  },
  {
    id: 2,
    tenant: "Bérénice Agossou",
    avatar: "https://i.pravatar.cc/40?img=68",
    property: "Studio Meublé — Haie Vive",
    city: "Cotonou",
    rent: 120000,
    channel: "moov",
    channelLabel: "Moov Money",
    status: "Vérifié",
    statusType: "success",
    date: "Hier, 16:15",
    receiptNo: "LOK-2026-0890",
  },
  {
    id: 3,
    tenant: "Rachidi Saka",
    avatar: "https://i.pravatar.cc/40?img=47",
    property: "Appartement F3 — Arconville",
    city: "Calavi",
    rent: 180000,
    channel: "mtn",
    channelLabel: "MTN MoMo",
    status: "En retard (+5j)",
    statusType: "danger",
    date: "19 Aoû 2026",
    receiptNo: "LOK-2026-0872",
  },
  {
    id: 4,
    tenant: "Estelle Houndété",
    avatar: "https://i.pravatar.cc/40?img=33",
    property: "Duplex Standing — Cadjehoun",
    city: "Cotonou",
    rent: 450000,
    channel: "virement",
    channelLabel: "Virement BOA",
    status: "Vérifié",
    statusType: "success",
    date: "15 Aoû 2026",
    receiptNo: "LOK-2026-0865",
  },
];

export default function DashboardOverviewPage() {
  const { currency } = useSidebar();
  const [selectedRange, setSelectedRange] = useState("30D");
  const [activeMetric, setActiveMetric] = useState<"gross" | "commission" | "tfu">("gross");
  const [channelFilter, setChannelFilter] = useState<"all" | "mtn" | "moov" | "virement" | "especes">("all");
  const [transactions, setTransactions] = useState(defaultActivity);

  // Dynamic user and onboarding profile
  const [userProfile, setUserProfile] = useState<any>(null);
  const [onboardingData, setOnboardingData] = useState<any>(null);

  // Quick Action Modals & Toasts
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [whatsAppRecipient, setWhatsAppRecipient] = useState<any>(null);
  const [showReceiptToast, setShowReceiptToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Receipt Modal State
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Checklist State
  const [checklist, setChecklist] = useState({
    step1: true,
    step2: false,
    step3: false,
  });

  // Payment form state
  const [paymentForm, setPaymentForm] = useState({
    tenant: "Koudjo Dossou",
    property: "Villa Fidjrossè Plage, Cotonou",
    amount: "250000",
    channel: "mtn",
  });

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("lokka_user_profile");
      if (savedUser) setUserProfile(JSON.parse(savedUser));

      const savedOnboarding = localStorage.getItem("lokka_onboarding_data");
      if (savedOnboarding) {
        const ob = JSON.parse(savedOnboarding);
        setOnboardingData(ob);

        if (ob.profileType === "agence") {
          setActiveMetric("commission");
        }

        if (ob.tenant?.name && ob.property?.title) {
          const channelName =
            ob.paymentChannel === "moov"
              ? "Moov Money"
              : ob.paymentChannel === "banque"
              ? ob.bankName || "Virement BOA"
              : ob.paymentChannel === "especes"
              ? "Espèces"
              : "MTN MoMo";

          const onboardedItem = {
            id: 999,
            tenant: ob.tenant.name,
            avatar: "https://i.pravatar.cc/40?img=12",
            property: `${ob.property.title}`,
            city: ob.city || "Cotonou",
            rent: Number(ob.property.rent) || 250000,
            channel: ob.paymentChannel || "mtn",
            channelLabel: channelName,
            status: "Vérifié",
            statusType: "success",
            date: "Aujourd'hui, 08:30",
            receiptNo: "LOK-2026-0902",
          };
          setTransactions([onboardedItem, ...defaultActivity]);

          setPaymentForm({
            tenant: ob.tenant.name,
            property: `${ob.property.title}, ${ob.city || "Cotonou"}`,
            amount: String(ob.property.rent || 250000),
            channel: ob.paymentChannel || "mtn",
          });
        }
      }
    } catch (_) {}

    const loadSupabaseData = async () => {
      if (!isSupabaseConfigured()) return;
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (profile) {
            setUserProfile((prev: any) => ({
              ...prev,
              name: profile.full_name,
              email: profile.email,
              accountType: profile.role,
              phone: profile.phone_number,
            }));
          }
        }
      } catch (err) {
        console.warn("Supabase fetch notice:", err);
      }
    };

    loadSupabaseData();
  }, []);

  const ranges = ["Aujourd'hui", "7D", "30D", "3M", "6M", "12M"];

  // Dynamic values depending on profile
  const accountType = onboardingData?.profileType || userProfile?.accountType || "bailleur";
  const userName = onboardingData?.userName || userProfile?.name || "Bailleur Lokka";

  const getRoleBadge = () => {
    if (accountType === "agence" || accountType === "gestionnaire") {
      return "Cabinet Immobilier Agréé · Honoraires 10% Loi n° 2022-30";
    }
    if (accountType === "diaspora") {
      const country = onboardingData?.diasporaCountry || "International";
      return `Investisseur Diaspora · Suivi à distance (${country}) 🌍`;
    }
    return "Propriétaire Bailleur · République du Bénin 🇧🇯";
  };

  const getDashboardTitle = () => {
    if (accountType === "agence") return "Portefeuille Mandats & Honoraires";
    if (accountType === "diaspora") return "Patrimoine au Pays & Rentes";
    return "Patrimoine & Encaissements";
  };

  const getDashboardSubtitle = () => {
    if (accountType === "agence") {
      return `Bonjour ${userName}. Pilotage de vos mandats de gestion, quittances certifiées et vitrine d'agence.`;
    }
    if (accountType === "diaspora") {
      const city = onboardingData?.city || "Cotonou";
      return `Bonjour ${userName}. Contrôle en direct de vos logements à ${city} et suivi multi-devises FCFA / Euros.`;
    }
    return `Bonjour ${userName}. Suivi en temps réel de vos loyers, quittances et flux Mobile Money.`;
  };

  const handleOpenReceiptModal = (tx: any) => {
    setSelectedReceipt({
      receiptNo: tx.receiptNo,
      date: tx.date,
      month: "Septembre 2026",
      tenantName: tx.tenant,
      propertyTitle: tx.property,
      propertyAddress: `${tx.property}, ${tx.city || "Cotonou"}`,
      amountFcfa: tx.rent,
      amountEuros: Math.round(tx.rent / 655.957),
      channel: tx.channelLabel,
      ownerName: userName,
    });
    setIsReceiptModalOpen(true);
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const receiptNo = `LOK-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTx = {
      id: Date.now(),
      tenant: paymentForm.tenant,
      avatar: "https://i.pravatar.cc/40?img=14",
      property: paymentForm.property,
      city: onboardingData?.city || "Cotonou",
      rent: Number(paymentForm.amount),
      channel: paymentForm.channel,
      channelLabel:
        paymentForm.channel === "moov"
          ? "Moov Money"
          : paymentForm.channel === "banque"
          ? "Virement"
          : paymentForm.channel === "especes"
          ? "Espèces"
          : "MTN MoMo",
      status: "Vérifié",
      statusType: "success",
      date: "À l'instant",
      receiptNo,
    };

    setTransactions([newTx, ...transactions]);
    setShowPaymentModal(false);
    setChecklist((prev) => ({ ...prev, step2: true }));
    setToastMessage(`Quittance ${newTx.receiptNo} générée avec succès !`);
    setShowReceiptToast(true);
    setTimeout(() => setShowReceiptToast(false), 5000);
  };

  const handleOpenWhatsAppReminder = (tenantName = "Rachidi Saka") => {
    setWhatsAppRecipient({
      name: tenantName,
      property: "Appartement F3 — Arconville",
      dueAmount: "180 000 FCFA",
      phone: "+229 97 00 00 00",
    });
    setShowWhatsAppModal(true);
  };

  const filteredTransactions = transactions.filter((t) => {
    if (channelFilter === "all") return true;
    return t.channel === channelFilter;
  });

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto pb-10">
      {/* Toast Notification */}
      <AnimatePresence>
        {showReceiptToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-[var(--color-brand-primary)] text-[var(--text-inverse)] px-4 py-3 rounded-[8px] shadow-2xl border border-white/10 flex items-center gap-3"
          >
            <CheckCircleIcon className="h-5 w-5 text-[var(--text-inverse)]" />
            <span className="text-[13px] font-medium">{toastMessage}</span>
            <button
              onClick={() => setShowReceiptToast(false)}
              className="text-[var(--text-inverse)]/60 hover:text-[var(--text-inverse)] ml-2 cursor-pointer"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── HEADER ÉPURÉ (Style Shakuro ACRU Finance) ─── */}
      <Header
        title="Vue d'ensemble"
        subtitle={`Suivi de vos encaissements et patrimoine à ${onboardingData?.city || "Cotonou"} · Bénin`}
      />

      {/* ========================================================================= */}
      {/* CHECKLIST DE DÉMARRAGE INTERACTIVE AVEC BORDER BEAM                       */}
      {/* ========================================================================= */}
      <div className="relative bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[12px] p-5 shadow-xs overflow-hidden">
        <BorderBeam size={180} duration={14} colorFrom="#C5A880" colorTo="#FAF9F6" />
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-5 w-5 text-[var(--text-primary)]" />
            <h3 className="text-[14px] font-bold text-[var(--text-primary)]">
              Checklist de démarrage Lokka
            </h3>
          </div>
          <span className="text-[11px] font-bold text-[var(--text-primary)] bg-[var(--bg-subtle)] border border-[var(--border-default)] px-2.5 py-0.5 rounded-full">
            {Object.values(checklist).filter(Boolean).length} / 3 terminées
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[12px]">
          <div className="p-3 bg-[var(--bg-subtle)] border border-[var(--border-default)] rounded-[8px] flex items-center gap-2.5">
            <CheckCircleIcon className="h-5 w-5 text-[var(--text-primary)] shrink-0" />
            <div>
              <span className="font-bold text-[var(--text-primary)] block">1. 1er bien &amp; locataire</span>
              <span className="text-[11px] text-[var(--text-secondary)]">
                {onboardingData?.property?.title || "Configuré avec succès"}
              </span>
            </div>
          </div>

          <div
            onClick={() => setShowPaymentModal(true)}
            className={`p-3 rounded-[8px] border flex items-center gap-2.5 cursor-pointer transition ${
              checklist.step2
                ? "bg-[var(--bg-subtle)] border-[var(--border-default)]"
                : "bg-[var(--bg-canvas)] border-[var(--border-default)] hover:border-[#1C1C1C]"
            }`}
          >
            {checklist.step2 ? (
              <CheckCircleIcon className="h-5 w-5 text-[var(--text-primary)] shrink-0" />
            ) : (
              <div className="h-5 w-5 rounded-full border border-[#9C9A95] flex items-center justify-center text-[11px] font-bold shrink-0">
                2
              </div>
            )}
            <div>
              <span className="font-bold text-[var(--text-primary)] block">2. Enregistrer un loyer</span>
              <span className="text-[11px] text-[var(--text-secondary)]">Émettre une quittance PDF</span>
            </div>
          </div>

          <div
            onClick={() => {
              setChecklist((prev) => ({ ...prev, step3: true }));
              alert(
                `Votre site vitrine est activé et accessible sur : ${
                  userName.toLowerCase().replace(/[^a-z0-9]/g, "") || "agence"
                }.lokka.bj !`
              );
            }}
            className={`p-3 rounded-[8px] border flex items-center gap-2.5 cursor-pointer transition ${
              checklist.step3
                ? "bg-[var(--bg-subtle)] border-[var(--border-default)]"
                : "bg-[var(--bg-canvas)] border-[var(--border-default)] hover:border-[#1C1C1C]"
            }`}
          >
            {checklist.step3 ? (
              <CheckCircleIcon className="h-5 w-5 text-[var(--text-primary)] shrink-0" />
            ) : (
              <div className="h-5 w-5 rounded-full border border-[#9C9A95] flex items-center justify-center text-[11px] font-bold shrink-0">
                3
              </div>
            )}
            <div>
              <span className="font-bold text-[var(--text-primary)] block">3. Activer mon Site Vitrine</span>
              <span className="text-[11px] text-[var(--text-secondary)]">Partager mon lien public</span>
            </div>
          </div>
        </div>
      </div>

      {/* Date Filter Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-[var(--border-default)]">
        <div className="inline-flex items-center bg-[#F0EFEA] p-1 rounded-[8px] border border-[var(--border-default)]">
          {ranges.map((range) => {
            const isActive = selectedRange === range;
            return (
              <button
                key={range}
                type="button"
                onClick={() => setSelectedRange(range)}
                className={`px-3 py-1 text-[12px] rounded-[6px] font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs font-bold"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {range}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-[12px] text-[var(--text-secondary)]">
          <span className="h-2 w-2 rounded-full bg-[#22C55E] animate-pulse" />
          <ClockIcon className="h-4 w-4 text-[var(--text-primary)]" />
          <span>
            Synchronisation MTN MoMo &amp; Moov : <strong>Active</strong>
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4 BENTO KPI CARDS AVEC NUMBER TICKER & BORDER BEAM                         */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 : Loyers ou Commissions avec BorderBeam */}
        <div className="relative bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[12px] p-5 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between">
          <BorderBeam size={160} duration={10} colorFrom="#C5A880" colorTo="#1C1C1C" />
          <div>
            <div className="flex items-center justify-between text-[12px] text-[var(--text-secondary)] font-medium mb-1">
              <span>{accountType === "agence" ? "Commissions Agence (10%)" : "Loyers Encaissés (Ce mois)"}</span>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[var(--bg-subtle)] text-[var(--text-primary)] text-[11px] font-bold border border-[var(--border-default)]">
                ↑ +14%
              </span>
            </div>
            <div className="text-[26px] font-extrabold text-[var(--text-primary)] tracking-tight mb-1 flex items-baseline gap-1">
              <NumberTicker
                value={
                  currency === "eur"
                    ? Math.round((accountType === "agence" ? 485000 : 4850000) / 655.957)
                    : accountType === "agence"
                    ? 485000
                    : 4850000
                }
                className="font-extrabold"
              />
              <span className="text-[14px] font-semibold text-[var(--text-secondary)]">
                {currency === "eur" ? "€" : "FCFA"}
              </span>
            </div>
            {currency === "fcfa" && accountType === "diaspora" && (
              <div className="text-[12px] font-bold text-[var(--text-primary)] mb-2">
                ≈ 7 393 € / mois
              </div>
            )}
          </div>
          <div className="pt-2 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)]">
            {accountType === "agence"
              ? "Honoraires plafonnés Loi 2022-30"
              : currency === "eur"
              ? "Sur un total attendu de 7 668 €"
              : "Sur un total attendu de 5 030 000 FCFA"}
          </div>
        </div>

        {/* KPI 2 : Taux d'Occupation */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[12px] p-5 shadow-xs hover:border-[#1C1C1C] transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[12px] text-[var(--text-secondary)] font-medium mb-1">
              <span>Taux d&apos;Occupation</span>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[var(--bg-subtle)] text-[var(--text-primary)] text-[11px] font-bold border border-[var(--border-default)]">
                96.5%
              </span>
            </div>
            <div className="text-[26px] font-extrabold text-[var(--text-primary)] tracking-tight mb-1">
              12 / 12 <span className="text-[14px] font-semibold text-[var(--text-secondary)]">Lots loués</span>
            </div>
          </div>
          <div className="pt-2 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)]">
            Zéro vacance locative constatée à {onboardingData?.city || "Cotonou"}
          </div>
        </div>

        {/* KPI 3 : Loyers en Retard */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[12px] p-5 shadow-xs hover:border-[#1C1C1C] transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[12px] text-[var(--text-secondary)] font-medium mb-1">
              <span>Loyers en Attente / Retard</span>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#FFF5F5] text-[#C92A2A] border border-red-200 text-[11px] font-bold">
                1 retard
              </span>
            </div>
            <div className="text-[26px] font-extrabold text-[var(--text-primary)] tracking-tight mb-1 flex items-baseline gap-1">
              <NumberTicker
                value={currency === "eur" ? Math.round(180000 / 655.957) : 180000}
                className="font-extrabold text-[#C92A2A]"
              />
              <span className="text-[14px] font-semibold text-[var(--text-secondary)]">
                {currency === "eur" ? "€" : "FCFA"}
              </span>
            </div>
          </div>
          <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between">
            <span className="text-[11px] text-[var(--text-muted)]">Rachidi Saka (+5j)</span>
            <button
              type="button"
              onClick={() => handleOpenWhatsAppReminder("Rachidi Saka")}
              className="text-[11px] font-bold text-[var(--text-primary)] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ChatBubbleLeftRightIcon className="w-3 h-3 text-[#25D366]" />
              Relancer
            </button>
          </div>
        </div>

        {/* KPI 4 : Conformité Loi 2022-30 */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[12px] p-5 shadow-xs hover:border-[#1C1C1C] transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[12px] text-[var(--text-secondary)] font-medium mb-1">
              <span>Conformité Baux &amp; Cautions</span>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[var(--bg-subtle)] text-[var(--text-primary)] text-[11px] font-bold border border-[var(--border-default)]">
                100% Légal
              </span>
            </div>
            <div className="text-[26px] font-extrabold text-[var(--text-primary)] tracking-tight mb-1">
              12 <span className="text-[14px] font-semibold text-[var(--text-secondary)]">Quittances actives</span>
            </div>
          </div>
          <div className="pt-2 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)]">
            Plafond de 3 mois de caution respecté au Bénin
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION PRINCIPALE : Graphique Financier & Flux des Règlements             */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Financial Overview Chart */}
        <div className="lg:col-span-7 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[12px] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="text-[18px] font-bold text-[var(--text-primary)] tracking-tight">
                  Revenus &amp; Flux Financiers
                </h2>
                <p className="text-[13px] text-[var(--text-secondary)]">
                  Progression mensuelle en FCFA et synthèse comptable
                </p>
              </div>

              {/* Metric Switcher */}
              <div className="inline-flex rounded-[8px] bg-[var(--bg-canvas)] border border-[var(--border-default)] p-1">
                <button
                  type="button"
                  onClick={() => setActiveMetric("gross")}
                  className={`px-3 py-1 text-[11px] font-semibold rounded-[6px] transition cursor-pointer ${
                    activeMetric === "gross"
                      ? "bg-[var(--color-brand-primary)] text-[var(--text-inverse)] shadow-xs"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  Loyers Bruts
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMetric("commission")}
                  className={`px-3 py-1 text-[11px] font-semibold rounded-[6px] transition cursor-pointer ${
                    activeMetric === "commission"
                      ? "bg-[var(--color-brand-primary)] text-[var(--text-inverse)] shadow-xs"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  Commissions 10%
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMetric("tfu")}
                  className={`px-3 py-1 text-[11px] font-semibold rounded-[6px] transition cursor-pointer ${
                    activeMetric === "tfu"
                      ? "bg-[var(--color-brand-primary)] text-[var(--text-inverse)] shadow-xs"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  TFU DGI
                </button>
              </div>
            </div>

            {/* Recharts Area Chart */}
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueMonthlyData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1C1C1C" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#1C1C1C" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    axisLine={{ stroke: "#E8E5E0" }}
                    tickLine={false}
                    tick={{ fill: "#9C9A95", fontSize: 12, fontWeight: 500 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9C9A95", fontSize: 11 }}
                    tickFormatter={(val) => `${(val / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#1C1C1C",
                      border: "none",
                      borderRadius: 8,
                      color: "#FFFFFF",
                      fontSize: 12,
                      padding: "8px 12px",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                    }}
                    formatter={(val: any) => [
                      `${Number(val).toLocaleString("fr-FR")} FCFA`,
                      activeMetric === "gross"
                        ? "Loyers Bruts"
                        : activeMetric === "commission"
                        ? "Commission 10%"
                        : "TFU DGI",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey={activeMetric}
                    stroke="#1C1C1C"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border-default)] grid grid-cols-3 gap-4 text-center mt-2">
            <div>
              <div className="text-[11px] text-[var(--text-muted)] font-medium">Moyenne Mensuelle</div>
              <div className="text-[15px] font-bold text-[var(--text-primary)]">4 166 000 FCFA</div>
            </div>
            <div>
              <div className="text-[11px] text-[var(--text-muted)] font-medium">Prévision Mois Prochain</div>
              <div className="text-[15px] font-bold text-[var(--text-primary)]">+5 100 000 FCFA</div>
            </div>
            <div>
              <div className="text-[11px] text-[var(--text-muted)] font-medium">Frais Mobile Money (1%)</div>
              <div className="text-[15px] font-bold text-[var(--text-secondary)]">48 500 FCFA</div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Recent Payments Stream */}
        <div className="lg:col-span-5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[12px] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[17px] font-bold text-[var(--text-primary)] tracking-tight">
                  Derniers Règlements
                </h3>
                <p className="text-[12px] text-[var(--text-secondary)]">
                  Encaissements &amp; Quittances PDF certifiées
                </p>
              </div>
              <span className="text-[11px] font-bold text-[var(--text-primary)] bg-[var(--bg-subtle)] border border-[var(--border-default)] px-2.5 py-1 rounded-full">
                Temps Réel 🇧🇯
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3">
              {[
                { id: "all", label: "Tous" },
                { id: "mtn", label: "MTN MoMo" },
                { id: "moov", label: "Moov" },
                { id: "virement", label: "Virement" },
                { id: "especes", label: "Espèces" },
              ].map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setChannelFilter(pill.id as any)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-full border transition whitespace-nowrap cursor-pointer ${
                    channelFilter === pill.id
                      ? "bg-[var(--color-brand-primary)] text-[var(--text-inverse)] border-[#1C1C1C]"
                      : "bg-[var(--bg-canvas)] text-[var(--text-secondary)] border-[var(--border-default)] hover:border-[#1C1C1C]"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Transaction Items */}
            <div className="space-y-3 divide-y divide-[#E8E5E0]/60 max-h-[340px] overflow-y-auto pr-1">
              {filteredTransactions.map((tx) => (
                <div key={tx.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={tx.avatar}
                      alt={tx.tenant}
                      className="h-9 w-9 rounded-full object-cover border border-[var(--border-default)] shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-[13px] font-bold text-[var(--text-primary)] truncate flex items-center gap-1.5">
                        <span>{tx.tenant}</span>
                        {tx.statusType === "success" && (
                          <span className="text-[11px] text-[var(--text-primary)] bg-[var(--bg-subtle)] border border-[var(--border-default)] px-1.5 py-0.2 rounded font-semibold">
                            Reçu ✓
                          </span>
                        )}
                        {tx.statusType === "danger" && (
                          <span className="text-[11px] text-[#C92A2A] bg-[#FFE3E3] px-1.5 py-0.2 rounded font-semibold">
                            Retard
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[var(--text-secondary)] truncate">
                        {tx.property} · <span className="font-medium text-[var(--text-primary)]">{tx.channelLabel}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[14px] font-bold text-[var(--text-primary)]">
                      {tx.rent.toLocaleString("fr-FR")}{" "}
                      <span className="text-[11px] font-normal text-[var(--text-secondary)]">FCFA</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenReceiptModal(tx)}
                      className="text-[11px] text-[var(--text-primary)] hover:underline font-bold inline-flex items-center gap-0.5 cursor-pointer"
                    >
                      <DocumentTextIcon className="h-3 w-3" />
                      <span>Quittance PDF</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border-default)] mt-3 flex items-center justify-between text-[12px]">
            <span className="text-[var(--text-secondary)]">Besoin de relancer un locataire ?</span>
            <button
              type="button"
              onClick={() => handleOpenWhatsAppReminder()}
              className="text-[var(--text-primary)] font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <ChatBubbleLeftRightIcon className="h-3.5 w-3.5 text-[#25D366]" />
              <span>Rappel WhatsApp →</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL : Enregistrer un Paiement Mobile Money & Quittance                   */}
      {/* ========================================================================= */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[12px] max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-default)] mb-4">
              <h4 className="text-[16px] font-bold text-[var(--text-primary)]">
                Enregistrer un paiement de loyer
              </h4>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddPayment} className="space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-[var(--text-primary)] mb-1">Locataire</label>
                <input
                  type="text"
                  value={paymentForm.tenant}
                  onChange={(e) => setPaymentForm({ ...paymentForm, tenant: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[6px] text-[13px] text-[var(--text-primary)] focus:outline-none focus:border-[#1C1C1C]"
                  required
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[var(--text-primary)] mb-1">Logement</label>
                <input
                  type="text"
                  value={paymentForm.property}
                  onChange={(e) => setPaymentForm({ ...paymentForm, property: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[6px] text-[13px] text-[var(--text-primary)] focus:outline-none focus:border-[#1C1C1C]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-[var(--text-primary)] mb-1">Montant (FCFA)</label>
                  <input
                    type="number"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[6px] text-[14px] font-bold text-[var(--text-primary)] focus:outline-none focus:border-[#1C1C1C]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[var(--text-primary)] mb-1">Canal</label>
                  <select
                    value={paymentForm.channel}
                    onChange={(e) => setPaymentForm({ ...paymentForm, channel: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[6px] text-[13px] text-[var(--text-primary)] focus:outline-none focus:border-[#1C1C1C]"
                  >
                    <option value="mtn">MTN MoMo</option>
                    <option value="moov">Moov Money</option>
                    <option value="banque">Virement Bancaire</option>
                    <option value="especes">Espèces</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--border-default)] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 bg-[var(--bg-canvas)] border border-[var(--border-default)] text-[var(--text-primary)] text-[12px] font-semibold rounded-[6px] hover:bg-[var(--bg-subtle)] cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[var(--color-brand-primary)] hover:bg-[#F5F5DC] hover:text-[var(--text-primary)] hover:border-[var(--border-default)] border border-transparent text-[var(--text-inverse)] text-[12px] font-semibold rounded-[6px] transition cursor-pointer"
                >
                  Valider &amp; Émettre Quittance PDF
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL : Relance WhatsApp Courtoise Automatique                             */}
      {/* ========================================================================= */}
      {showWhatsAppModal && whatsAppRecipient && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[12px] max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-default)] mb-4">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-[#E6F8ED] text-[#25D366] flex items-center justify-center">
                  <ChatBubbleLeftRightIcon className="h-4 w-4" />
                </div>
                <h4 className="text-[16px] font-bold text-[var(--text-primary)]">
                  Relance WhatsApp Courtoise
                </h4>
              </div>
              <button
                onClick={() => setShowWhatsAppModal(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-[13px]">
              <div className="p-3 bg-[var(--bg-canvas)] border border-[var(--border-default)] rounded-[8px]">
                <div className="font-bold text-[var(--text-primary)]">{whatsAppRecipient.name}</div>
                <div className="text-[12px] text-[var(--text-secondary)]">
                  Bien : {whatsAppRecipient.property} · Montant :{" "}
                  <strong>{whatsAppRecipient.dueAmount}</strong>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[var(--text-primary)] mb-1">
                  Message pré-rédigé (Conforme usages Bénin) :
                </label>
                <textarea
                  readOnly
                  rows={4}
                  className="w-full p-3 bg-[var(--bg-canvas)] border border-[var(--border-default)] rounded-[6px] text-[12px] text-[var(--text-primary)] font-mono leading-relaxed resize-none focus:outline-none"
                  value={`Bonjour M. ${whatsAppRecipient.name},\nNous espérons que vous allez bien. Sauf erreur de notre part, le loyer de ce mois (${whatsAppRecipient.dueAmount}) pour le logement ${whatsAppRecipient.property} est en attente de règlement.\nMerci de procéder au règlement via MTN MoMo ou Moov Money dès que possible.\nBien cordialement,\n${userName}`}
                />
              </div>

              <div className="pt-2 border-t border-[var(--border-default)] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowWhatsAppModal(false)}
                  className="px-4 py-2 bg-[var(--bg-canvas)] border border-[var(--border-default)] text-[var(--text-primary)] text-[12px] font-semibold rounded-[6px] hover:bg-[var(--bg-subtle)] cursor-pointer"
                >
                  Fermer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const text = encodeURIComponent(
                      `Bonjour M. ${whatsAppRecipient.name},\nNous espérons que vous allez bien. Sauf erreur de notre part, le loyer de ce mois (${whatsAppRecipient.dueAmount}) pour le logement ${whatsAppRecipient.property} est en attente de règlement.\nMerci de procéder au règlement via MTN MoMo ou Moov Money dès que possible.\nBien cordialement,\n${userName}`
                    );
                    window.open(`https://wa.me/?text=${text}`, "_blank");
                    setShowWhatsAppModal(false);
                  }}
                  className="px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-[var(--text-inverse)] text-[12px] font-semibold rounded-[6px] shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <ChatBubbleLeftRightIcon className="h-4 w-4" />
                  <span>Ouvrir WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official Certified Receipt Modal */}
      {selectedReceipt && (
        <ReceiptModal
          isOpen={isReceiptModalOpen}
          onClose={() => setIsReceiptModalOpen(false)}
          receiptData={selectedReceipt}
        />
      )}
    </div>
  );
}
