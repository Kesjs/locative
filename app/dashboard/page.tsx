"use client";

import { useState, useEffect } from "react";
import Header from "@/components/dashboard/Header";
import ReceiptModal from "@/components/dashboard/ReceiptModal";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  CalendarIcon,
  PlusIcon,
  ArrowUpRightIcon,
  ArrowDownRightIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  BanknotesIcon,
  DocumentTextIcon,
  SparklesIcon,
  FunnelIcon,
  XMarkIcon,
  CheckIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  BuildingOffice2Icon,
  HomeModernIcon,
} from "@heroicons/react/24/outline";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

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
  const [selectedRange, setSelectedRange] = useState("30D");
  const [activeMetric, setActiveMetric] = useState<"gross" | "commission" | "tfu">("gross");
  const [channelFilter, setChannelFilter] = useState<"all" | "mtn" | "moov" | "virement" | "especes">("all");
  const [transactions, setTransactions] = useState(defaultActivity);

  // Dynamic user and onboarding profile
  const [userProfile, setUserProfile] = useState<any>(null);
  const [onboardingData, setOnboardingData] = useState<any>(null);

  // Quick Action Modals & Toasts
  const [showPaymentModal, setShowPaymentModal] = useState(false);
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
        const { data: { user } } = await supabase.auth.getUser();
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

  const filteredTransactions = transactions.filter((t) => {
    if (channelFilter === "all") return true;
    return t.channel === channelFilter;
  });

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto">
      {/* Toast Notification */}
      {showReceiptToast && (
        <div className="fixed top-6 right-6 z-50 bg-[#1C1C1C] text-white px-4 py-3 rounded-[8px] shadow-2xl border border-white/10 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircleIcon className="h-5 w-5 text-white" />
          <span className="text-[13px] font-medium">{toastMessage}</span>
          <button onClick={() => setShowReceiptToast(false)} className="text-white/60 hover:text-white ml-2 cursor-pointer">
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Top Banner & Header Bar */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3F2EE] border border-[#E8E5E0] text-[#1C1C1C] text-[11px] font-bold uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1C1C1C]" />
              {getRoleBadge()}
            </span>
            {onboardingData?.city && (
              <span className="text-[12px] text-[#64635F]">
                📍 {onboardingData.city}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPaymentModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#1C1C1C] hover:bg-[#333333] text-white text-[12px] font-bold rounded-[6px] transition shadow-xs active:scale-95 cursor-pointer"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Enregistrer un loyer</span>
            </button>

            {accountType === "agence" ? (
              <button
                type="button"
                onClick={() => {
                  alert(`Génération du Compte-Rendu de Gestion (CRG) officiel pour votre mandant (${onboardingData?.property?.ownerMandant || "M. Dossou Mensah"}) avec honoraires 10% Loi 2022-30.`);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#FAF9F6] border border-[#E8E5E0] text-[12px] font-semibold text-[#1C1C1C] rounded-[6px] shadow-xs transition active:scale-95 cursor-pointer"
              >
                <DocumentTextIcon className="h-3.5 w-3.5 text-[#64635F]" />
                <span>Relevé CRG Mandant</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  alert("Génération du relevé fiscal certifié conforme TFU (Taxe Foncière Unique - Direction Générale des Impôts Bénin).");
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#FAF9F6] border border-[#E8E5E0] text-[12px] font-semibold text-[#1C1C1C] rounded-[6px] shadow-xs transition active:scale-95 cursor-pointer"
              >
                <ArrowDownTrayIcon className="h-3.5 w-3.5 text-[#64635F]" />
                <span>Export TFU DGI</span>
              </button>
            )}
          </div>
        </div>

        <Header
          breadcrumbs={["Tableau de bord", "Vue d'ensemble"]}
          title={getDashboardTitle()}
          subtitle={getDashboardSubtitle()}
        />
      </div>

      {/* ========================================================================= */}
      {/* CHECKLIST DE DÉMARRAGE INTERACTIVE (3 ÉTAPES)                             */}
      {/* ========================================================================= */}
      <div className="bg-white border border-[#E8E5E0] rounded-[10px] p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-5 w-5 text-[#1C1C1C]" />
            <h3 className="text-[14px] font-bold text-[#1C1C1C]">
              Checklist de démarrage Lokka
            </h3>
          </div>
          <span className="text-[11px] font-bold text-[#1C1C1C] bg-[#F3F2EE] border border-[#E8E5E0] px-2.5 py-0.5 rounded-full">
            {Object.values(checklist).filter(Boolean).length} / 3 terminées
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[12px]">
          <div className="p-3 bg-[#F3F2EE] border border-[#E8E5E0] rounded-[6px] flex items-center gap-2.5">
            <CheckCircleIcon className="h-5 w-5 text-[#1C1C1C] shrink-0" />
            <div>
              <span className="font-bold text-[#1C1C1C] block">1. 1er bien &amp; locataire</span>
              <span className="text-[11px] text-[#64635F]">
                {onboardingData?.property?.title || "Configuré avec succès"}
              </span>
            </div>
          </div>

          <div
            onClick={() => setShowPaymentModal(true)}
            className={`p-3 rounded-[6px] border flex items-center gap-2.5 cursor-pointer transition ${
              checklist.step2
                ? "bg-[#F3F2EE] border-[#E8E5E0]"
                : "bg-[#FAF9F6] border-[#E8E5E0] hover:border-[#1C1C1C]"
            }`}
          >
            {checklist.step2 ? (
              <CheckCircleIcon className="h-5 w-5 text-[#1C1C1C] shrink-0" />
            ) : (
              <div className="h-5 w-5 rounded-full border border-[#9C9A95] flex items-center justify-center text-[10px] font-bold shrink-0">
                2
              </div>
            )}
            <div>
              <span className="font-bold text-[#1C1C1C] block">2. Enregistrer un loyer</span>
              <span className="text-[11px] text-[#64635F]">Émettre une quittance PDF</span>
            </div>
          </div>

          <div
            onClick={() => {
              setChecklist((prev) => ({ ...prev, step3: true }));
              alert(`Votre site vitrine est activé et accessible sur : ${userName.toLowerCase().replace(/[^a-z0-9]/g, "") || "agence"}.lokka.bj !`);
            }}
            className={`p-3 rounded-[6px] border flex items-center gap-2.5 cursor-pointer transition ${
              checklist.step3
                ? "bg-[#F3F2EE] border-[#E8E5E0]"
                : "bg-[#FAF9F6] border-[#E8E5E0] hover:border-[#1C1C1C]"
            }`}
          >
            {checklist.step3 ? (
              <CheckCircleIcon className="h-5 w-5 text-[#1C1C1C] shrink-0" />
            ) : (
              <div className="h-5 w-5 rounded-full border border-[#9C9A95] flex items-center justify-center text-[10px] font-bold shrink-0">
                3
              </div>
            )}
            <div>
              <span className="font-bold text-[#1C1C1C] block">3. Activer mon Site Vitrine</span>
              <span className="text-[11px] text-[#64635F]">Partager mon lien public</span>
            </div>
          </div>
        </div>
      </div>

      {/* Date Filter Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-[#E8E5E0]">
        <div className="inline-flex items-center bg-[#F0EFEA] p-1 rounded-[6px] border border-[#E8E5E0]">
          {ranges.map((range) => {
            const isActive = selectedRange === range;
            return (
              <button
                key={range}
                type="button"
                onClick={() => setSelectedRange(range)}
                className={`px-3 py-1 text-[12px] rounded-[4px] font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-white text-[#1C1C1C] shadow-xs font-bold"
                    : "text-[#64635F] hover:text-[#1C1C1C]"
                }`}
              >
                {range}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-[12px] text-[#64635F]">
          <ClockIcon className="h-4 w-4 text-[#1C1C1C]" />
          <span>Synchronisation MTN MoMo &amp; Moov : <strong>Active</strong></span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4 SPARKLINE KPI CARDS (DYNAMIQUES SELON LE PROFIL)                         */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 : Loyers ou Commissions */}
        <div className="bg-white border border-[#E8E5E0] rounded-[10px] p-5 shadow-xs hover:border-[#1C1C1C] transition-all">
          <div className="flex items-center justify-between text-[12px] text-[#64635F] font-medium mb-1">
            <span>{accountType === "agence" ? "Commissions Agence (10%)" : "Loyers Encaissés (Ce mois)"}</span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#F3F2EE] text-[#1C1C1C] text-[11px] font-bold border border-[#E8E5E0]">
              ↑ +14%
            </span>
          </div>
          <div className="text-[26px] font-extrabold text-[#1C1C1C] tracking-tight mb-1">
            {accountType === "agence" ? "485 000" : "4.85M"}{" "}
            <span className="text-[14px] font-semibold text-[#64635F]">FCFA</span>
          </div>
          {accountType === "diaspora" && (
            <div className="text-[12px] font-bold text-[#1C1C1C] mb-2">
              ≈ 7 393 € / mois
            </div>
          )}
          <div className="text-[11px] text-[#9C9A95]">
            {accountType === "agence" ? "Honoraires plafonnés Loi 2022-30" : "Sur un total attendu de 5.03M FCFA"}
          </div>
        </div>

        {/* KPI 2 : Taux d'Occupation */}
        <div className="bg-white border border-[#E8E5E0] rounded-[10px] p-5 shadow-xs hover:border-[#1C1C1C] transition-all">
          <div className="flex items-center justify-between text-[12px] text-[#64635F] font-medium mb-1">
            <span>Taux d&apos;Occupation</span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#F3F2EE] text-[#1C1C1C] text-[11px] font-bold border border-[#E8E5E0]">
              96.5%
            </span>
          </div>
          <div className="text-[26px] font-extrabold text-[#1C1C1C] tracking-tight mb-1">
            12 / 12 <span className="text-[14px] font-semibold text-[#64635F]">Lots loués</span>
          </div>
          <div className="text-[11px] text-[#9C9A95]">
            Zéro vacance locative constatée à {onboardingData?.city || "Cotonou"}
          </div>
        </div>

        {/* KPI 3 : Loyers en Retard */}
        <div className="bg-white border border-[#E8E5E0] rounded-[10px] p-5 shadow-xs hover:border-[#1C1C1C] transition-all">
          <div className="flex items-center justify-between text-[12px] text-[#64635F] font-medium mb-1">
            <span>Loyers en Attente / Retard</span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#FAF9F6] text-[#64635F] border border-[#E8E5E0] text-[11px] font-bold">
              1 retard
            </span>
          </div>
          <div className="text-[26px] font-extrabold text-[#1C1C1C] tracking-tight mb-1">
            180 000 <span className="text-[14px] font-semibold text-[#64635F]">FCFA</span>
          </div>
          <div className="text-[11px] text-[#9C9A95]">
            Relance WhatsApp automatique programmée à J+5
          </div>
        </div>

        {/* KPI 4 : Conformité Loi 2022-30 */}
        <div className="bg-white border border-[#E8E5E0] rounded-[10px] p-5 shadow-xs hover:border-[#1C1C1C] transition-all">
          <div className="flex items-center justify-between text-[12px] text-[#64635F] font-medium mb-1">
            <span>Conformité Baux &amp; Cautions</span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#F3F2EE] text-[#1C1C1C] text-[11px] font-bold border border-[#E8E5E0]">
              100% Légal
            </span>
          </div>
          <div className="text-[26px] font-extrabold text-[#1C1C1C] tracking-tight mb-1">
            12 <span className="text-[14px] font-semibold text-[#64635F]">Quittances actives</span>
          </div>
          <div className="text-[11px] text-[#9C9A95]">
            Plafond de 3 mois de caution respecté au Bénin
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION PRINCIPALE : Graphique Financier & Flux des Règlements             */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Financial Overview Chart */}
        <div className="lg:col-span-7 bg-white border border-[#E8E5E0] rounded-[12px] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="text-[18px] font-bold text-[#1C1C1C] tracking-tight">
                  Revenus &amp; Flux Financiers
                </h2>
                <p className="text-[13px] text-[#64635F]">
                  Progression mensuelle en FCFA et synthèse comptable
                </p>
              </div>

              {/* Metric Switcher */}
              <div className="inline-flex rounded-[6px] bg-[#FAF9F6] border border-[#E8E5E0] p-0.5">
                <button
                  type="button"
                  onClick={() => setActiveMetric("gross")}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-[4px] transition cursor-pointer ${
                    activeMetric === "gross"
                      ? "bg-[#1C1C1C] text-white shadow-xs"
                      : "text-[#64635F] hover:text-[#1C1C1C]"
                  }`}
                >
                  Loyers Bruts
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMetric("commission")}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-[4px] transition cursor-pointer ${
                    activeMetric === "commission"
                      ? "bg-[#1C1C1C] text-white shadow-xs"
                      : "text-[#64635F] hover:text-[#1C1C1C]"
                  }`}
                >
                  Commissions 10%
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMetric("tfu")}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-[4px] transition cursor-pointer ${
                    activeMetric === "tfu"
                      ? "bg-[#1C1C1C] text-white shadow-xs"
                      : "text-[#64635F] hover:text-[#1C1C1C]"
                  }`}
                >
                  TFU DGI
                </button>
              </div>
            </div>

            {/* Recharts Area Chart */}
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueMonthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1C1C1C" stopOpacity={0.2} />
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
                      borderRadius: 6,
                      color: "#FFFFFF",
                      fontSize: 12,
                      padding: "8px 12px",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                    }}
                    formatter={(val: any) => [
                      `${Number(val).toLocaleString("fr-FR")} FCFA`,
                      activeMetric === "gross" ? "Loyers Bruts" : activeMetric === "commission" ? "Commission 10%" : "TFU DGI",
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

          <div className="pt-4 border-t border-[#E8E5E0] grid grid-cols-3 gap-4 text-center mt-2">
            <div>
              <div className="text-[11px] text-[#9C9A95] font-medium">Moyenne Mensuelle</div>
              <div className="text-[15px] font-bold text-[#1C1C1C]">4 166 000 FCFA</div>
            </div>
            <div>
              <div className="text-[11px] text-[#9C9A95] font-medium">Prévision Mois Prochain</div>
              <div className="text-[15px] font-bold text-[#1C1C1C]">+5 100 000 FCFA</div>
            </div>
            <div>
              <div className="text-[11px] text-[#9C9A95] font-medium">Frais Mobile Money (1%)</div>
              <div className="text-[15px] font-bold text-[#64635F]">48 500 FCFA</div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Recent Payments Stream */}
        <div className="lg:col-span-5 bg-white border border-[#E8E5E0] rounded-[12px] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[17px] font-bold text-[#1C1C1C] tracking-tight">
                  Derniers Règlements
                </h3>
                <p className="text-[12px] text-[#64635F]">
                  Encaissements &amp; Quittances PDF certifiées
                </p>
              </div>
              <span className="text-[11px] font-bold text-[#1C1C1C] bg-[#F3F2EE] border border-[#E8E5E0] px-2.5 py-1 rounded-full">
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
                      ? "bg-[#1C1C1C] text-white border-[#1C1C1C]"
                      : "bg-[#FAF9F6] text-[#64635F] border-[#E8E5E0] hover:border-[#1C1C1C]"
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
                      className="h-9 w-9 rounded-full object-cover border border-[#E8E5E0] shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-[13px] font-bold text-[#1C1C1C] truncate flex items-center gap-1.5">
                        <span>{tx.tenant}</span>
                        {tx.statusType === "success" && (
                          <span className="text-[10px] text-[#1C1C1C] bg-[#F3F2EE] border border-[#E8E5E0] px-1.5 py-0.2 rounded font-semibold">
                            Reçu ✓
                          </span>
                        )}
                        {tx.statusType === "danger" && (
                          <span className="text-[10px] text-[#C92A2A] bg-[#FFE3E3] px-1.5 py-0.2 rounded font-semibold">
                            Retard
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#64635F] truncate">
                        {tx.property} · <span className="font-medium text-[#1C1C1C]">{tx.channelLabel}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[14px] font-bold text-[#1C1C1C]">
                      {tx.rent.toLocaleString("fr-FR")} <span className="text-[10px] font-normal text-[#64635F]">FCFA</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenReceiptModal(tx)}
                      className="text-[11px] text-[#1C1C1C] hover:underline font-bold inline-flex items-center gap-0.5 cursor-pointer"
                    >
                      <DocumentTextIcon className="h-3 w-3" />
                      <span>Quittance PDF</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#E8E5E0] mt-3 flex items-center justify-between text-[12px]">
            <span className="text-[#64635F]">Besoin de relancer un locataire ?</span>
            <button
              type="button"
              onClick={() => {
                alert("Envoi d'un rappel automatique poli avec lien de paiement MoMo / Moov sur le compte WhatsApp du locataire.");
              }}
              className="text-[#1C1C1C] font-bold hover:underline cursor-pointer"
            >
              Rappel WhatsApp →
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL : Enregistrer un Paiement Mobile Money & Quittance                   */}
      {/* ========================================================================= */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8E5E0] rounded-[12px] max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E5E0] mb-4">
              <h4 className="text-[16px] font-bold text-[#1C1C1C]">
                Enregistrer un paiement de loyer
              </h4>
              <button onClick={() => setShowPaymentModal(false)} className="text-[#9C9A95] hover:text-[#1C1C1C] cursor-pointer">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddPayment} className="space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#1C1C1C] mb-1">Locataire</label>
                <input
                  type="text"
                  value={paymentForm.tenant}
                  onChange={(e) => setPaymentForm({ ...paymentForm, tenant: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#E8E5E0] rounded-[6px] text-[13px] text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                  required
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#1C1C1C] mb-1">Logement</label>
                <input
                  type="text"
                  value={paymentForm.property}
                  onChange={(e) => setPaymentForm({ ...paymentForm, property: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#E8E5E0] rounded-[6px] text-[13px] text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-[#1C1C1C] mb-1">Montant (FCFA)</label>
                  <input
                    type="number"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#E8E5E0] rounded-[6px] text-[14px] font-bold text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#1C1C1C] mb-1">Canal</label>
                  <select
                    value={paymentForm.channel}
                    onChange={(e) => setPaymentForm({ ...paymentForm, channel: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#E8E5E0] rounded-[6px] text-[13px] text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                  >
                    <option value="mtn">MTN MoMo</option>
                    <option value="moov">Moov Money</option>
                    <option value="banque">Virement Bancaire</option>
                    <option value="especes">Espèces</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E8E5E0] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="btn-secondary py-2 px-4 text-[12px] cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-primary py-2 px-5 text-[12px] cursor-pointer"
                >
                  Valider &amp; Émettre Quittance PDF
                </button>
              </div>
            </form>
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
