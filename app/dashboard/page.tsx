"use client";

import { useState, useEffect } from "react";
import Header from "@/components/dashboard/Header";
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
} from "@heroicons/react/24/outline";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
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

// Distribution chart mock data
const typologyData = [
  { type: "Studio / Chambre", count: 8, fill: "#1C1C1C", pct: "30%" },
  { type: "Appartement F2/F3", count: 12, fill: "#087F5B", pct: "45%" },
  { type: "Villa / Duplex", count: 4, fill: "#64635F", pct: "15%" },
  { type: "Local Commercial", count: 3, fill: "#D97706", pct: "10%" },
];

// Initial recent activity list
const initialActivity = [
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
  {
    id: 5,
    tenant: "Jean-Baptiste Mensah",
    avatar: "https://i.pravatar.cc/40?img=25",
    property: "Local Commercial — Ganhi",
    city: "Cotonou",
    rent: 250000,
    channel: "especes",
    channelLabel: "Espèces",
    status: "En traitement",
    statusType: "warning",
    date: "12 Aoû 2026",
    receiptNo: "LOK-2026-0849",
  },
];

export default function DashboardOverviewPage() {
  const [selectedRange, setSelectedRange] = useState("30D");
  const [activeMetric, setActiveMetric] = useState<"gross" | "commission" | "tfu">("gross");
  const [channelFilter, setChannelFilter] = useState<"all" | "mtn" | "moov" | "virement" | "especes">("all");
  const [transactions, setTransactions] = useState(initialActivity);
  
  // Dynamic user and onboarding profile
  const [userProfile, setUserProfile] = useState<any>(null);
  const [onboardingData, setOnboardingData] = useState<any>(null);

  // Quick Action Modals
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceiptToast, setShowReceiptToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Payment form state
  const [paymentForm, setPaymentForm] = useState({
    tenant: "Koudjo Dossou",
    property: "Villa Fidjrossè Plage, Cotonou",
    amount: "250000",
    channel: "mtn",
  });

  useEffect(() => {
    // 1. Check local storage
    try {
      const savedUser = localStorage.getItem("lokka_user_profile");
      if (savedUser) setUserProfile(JSON.parse(savedUser));

      const savedOnboarding = localStorage.getItem("lokka_onboarding_data");
      if (savedOnboarding) {
        const ob = JSON.parse(savedOnboarding);
        setOnboardingData(ob);

        // Prepend onboarding tenant if available
        if (ob.tenant?.name && ob.property?.title) {
          const onboardedItem = {
            id: 999,
            tenant: ob.tenant.name,
            avatar: "https://i.pravatar.cc/40?img=12",
            property: `${ob.property.title}`,
            city: ob.city || "Cotonou",
            rent: Number(ob.property.rent) || 250000,
            channel: ob.paymentChannel || "mtn",
            channelLabel: ob.paymentChannel === "moov" ? "Moov Money" : ob.paymentChannel === "virement" ? "Virement" : ob.paymentChannel === "especes" ? "Espèces" : "MTN MoMo",
            status: "Vérifié",
            statusType: "success",
            date: "Aujourd'hui, 08:30",
            receiptNo: "LOK-2026-0902",
          };
          setTransactions([onboardedItem, ...initialActivity]);
        }
      }
    } catch (_) {}

    // 2. Fetch Supabase data if connected
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

  // Dynamic titles and subtitles based on Profile
  const accountType = onboardingData?.profileType || userProfile?.accountType || "bailleur";
  const userName = onboardingData?.userName || userProfile?.name || "Bailleur Lokka";

  const getRoleBadge = () => {
    if (accountType === "gestionnaire") return "Gestionnaire Agréé · Commission 10% Loi 2022-30";
    if (accountType === "agence") return "Agence Immobilière & SCI · Multi-utilisateurs";
    return "Propriétaire Bailleur · Bénin";
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const receiptNo = `LOK-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTx = {
      id: Date.now(),
      tenant: paymentForm.tenant,
      avatar: "https://i.pravatar.cc/40?img=14",
      property: paymentForm.property,
      city: "Cotonou",
      rent: Number(paymentForm.amount),
      channel: paymentForm.channel,
      channelLabel: paymentForm.channel === "moov" ? "Moov Money" : paymentForm.channel === "virement" ? "Virement" : paymentForm.channel === "especes" ? "Espèces" : "MTN MoMo",
      status: "Vérifié",
      statusType: "success",
      date: "À l'instant",
      receiptNo,
    };

    setTransactions([newTx, ...transactions]);
    setShowPaymentModal(false);
    setToastMessage(`Quittance ${newTx.receiptNo} émise et enregistrée avec succès !`);
    setShowReceiptToast(true);
    setTimeout(() => setShowReceiptToast(false), 5000);
  };

  // Filtered transactions
  const filteredTransactions = transactions.filter((t) => {
    if (channelFilter === "all") return true;
    return t.channel === channelFilter;
  });

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto">
      {/* Toast Notification */}
      {showReceiptToast && (
        <div className="fixed top-6 right-6 z-50 bg-[#1C1C1C] text-white px-4 py-3 rounded-[8px] shadow-2xl border border-white/10 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircleIcon className="h-5 w-5 text-[#087F5B]" />
          <span className="text-[13px] font-medium">{toastMessage}</span>
          <button onClick={() => setShowReceiptToast(false)} className="text-white/60 hover:text-white ml-2">
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Top Banner & Header Bar */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F5EF] border border-[#087F5B]/20 text-[#087F5B] text-[11px] font-bold uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-[#087F5B]" />
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
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#087F5B] hover:bg-[#076b4d] text-white text-[12px] font-bold rounded-[6px] transition shadow-xs active:scale-95"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Enregistrer un loyer</span>
            </button>

            <button
              type="button"
              onClick={() => {
                alert("Génération du relevé fiscal certifié conforme TFU (Taxe Foncière Unique - Direction Générale des Impôts Bénin).");
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#FAF9F6] border border-[#E8E5E0] text-[12px] font-semibold text-[#1C1C1C] rounded-[6px] shadow-xs transition active:scale-95"
            >
              <ArrowDownTrayIcon className="h-3.5 w-3.5 text-[#64635F]" />
              <span>Export TFU</span>
            </button>
          </div>
        </div>

        <Header
          breadcrumbs={["Tableau de bord", "Vue d'ensemble"]}
          title="Patrimoine & Encaissements"
          subtitle={`Bonjour ${userName}. Suivi en temps réel de vos loyers, quittances et flux Mobile Money.`}
        />
      </div>

      {/* Date Filter & Quick Range Selector */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-[#E8E5E0]">
        <div className="inline-flex items-center bg-[#F0EFEA] p-1 rounded-[6px] border border-[#E8E5E0]">
          {ranges.map((range) => {
            const isActive = selectedRange === range;
            return (
              <button
                key={range}
                type="button"
                onClick={() => setSelectedRange(range)}
                className={`px-3 py-1 text-[12px] rounded-[4px] font-medium transition-all ${
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
          <ClockIcon className="h-4 w-4 text-[#087F5B]" />
          <span>Synchronisation automatique MTN &amp; Moov : <strong>Active</strong></span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4 SPARKLINE KPI CARDS (Variante 1 Éditorial Luxury)                         */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Loyers Encaissés */}
        <div className="bg-white border border-[#E8E5E0] rounded-[10px] p-5 shadow-xs hover:border-[#1C1C1C] transition-all group">
          <div className="flex items-center justify-between text-[12px] text-[#64635F] font-medium mb-1">
            <span>Loyers Encaissés (Ce mois)</span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#E6F5EF] text-[#087F5B] text-[11px] font-bold">
              ↑ +14%
            </span>
          </div>
          <div className="text-[26px] font-extrabold text-[#1C1C1C] tracking-tight mb-2">
            4.85M <span className="text-[14px] font-semibold text-[#64635F]">FCFA</span>
          </div>
          {/* Micro Sparkline Curve SVG */}
          <div className="h-8 w-full">
            <svg className="w-full h-full" viewBox="0 0 100 25" preserveAspectRatio="none">
              <path
                d="M0,20 Q20,15 40,18 T70,8 T100,2"
                fill="none"
                stroke="#087F5B"
                strokeWidth="2"
              />
              <path
                d="M0,20 Q20,15 40,18 T70,8 T100,2 L100,25 L0,25 Z"
                fill="url(#sparkline-grad)"
                opacity="0.15"
              />
              <defs>
                <linearGradient id="sparkline-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#087F5B" />
                  <stop offset="100%" stopColor="#087F5B" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="text-[11px] text-[#9C9A95] mt-1">
            4 850 000 FCFA vs 4 250 000 FCFA le mois dernier
          </div>
        </div>

        {/* KPI 2: Taux d'Occupation */}
        <div className="bg-white border border-[#E8E5E0] rounded-[10px] p-5 shadow-xs hover:border-[#1C1C1C] transition-all group">
          <div className="flex items-center justify-between text-[12px] text-[#64635F] font-medium mb-1">
            <span>Taux d&apos;Occupation</span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#E6F5EF] text-[#087F5B] text-[11px] font-bold">
              96.5%
            </span>
          </div>
          <div className="text-[26px] font-extrabold text-[#1C1C1C] tracking-tight mb-2">
            12 / 12 <span className="text-[14px] font-semibold text-[#64635F]">Lots loués</span>
          </div>
          {/* Micro Sparkline Curve SVG */}
          <div className="h-8 w-full">
            <svg className="w-full h-full" viewBox="0 0 100 25" preserveAspectRatio="none">
              <path
                d="M0,18 Q30,12 60,14 T100,4"
                fill="none"
                stroke="#087F5B"
                strokeWidth="2"
              />
              <path
                d="M0,18 Q30,12 60,14 T100,4 L100,25 L0,25 Z"
                fill="#087F5B"
                opacity="0.1"
              />
            </svg>
          </div>
          <div className="text-[11px] text-[#9C9A95] mt-1">
            Zéro vacance locative constatée à Cotonou &amp; Calavi
          </div>
        </div>

        {/* KPI 3: Loyers en Retard */}
        <div className="bg-white border border-[#E8E5E0] rounded-[10px] p-5 shadow-xs hover:border-[#1C1C1C] transition-all group">
          <div className="flex items-center justify-between text-[12px] text-[#64635F] font-medium mb-1">
            <span>Loyers en Attente / Retard</span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#FFE3E3] text-[#C92A2A] text-[11px] font-bold">
              1 retard
            </span>
          </div>
          <div className="text-[26px] font-extrabold text-[#1C1C1C] tracking-tight mb-2">
            180k <span className="text-[14px] font-semibold text-[#64635F]">FCFA</span>
          </div>
          {/* Micro Sparkline Curve SVG */}
          <div className="h-8 w-full">
            <svg className="w-full h-full" viewBox="0 0 100 25" preserveAspectRatio="none">
              <path
                d="M0,5 Q30,10 60,8 T100,20"
                fill="none"
                stroke="#C92A2A"
                strokeWidth="2"
              />
              <path
                d="M0,5 Q30,10 60,8 T100,20 L100,25 L0,25 Z"
                fill="#C92A2A"
                opacity="0.1"
              />
            </svg>
          </div>
          <div className="text-[11px] text-[#9C9A95] mt-1">
            Relance WhatsApp automatique programmée à J+5
          </div>
        </div>

        {/* KPI 4: Baux & Loi 2022-30 */}
        <div className="bg-white border border-[#E8E5E0] rounded-[10px] p-5 shadow-xs hover:border-[#1C1C1C] transition-all group">
          <div className="flex items-center justify-between text-[12px] text-[#64635F] font-medium mb-1">
            <span>Baux &amp; Quittances Émises</span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#E6F5EF] text-[#087F5B] text-[11px] font-bold">
              100% Conforme
            </span>
          </div>
          <div className="text-[26px] font-extrabold text-[#1C1C1C] tracking-tight mb-2">
            12 <span className="text-[14px] font-semibold text-[#64635F]">Quittances actives</span>
          </div>
          {/* Micro Sparkline Curve SVG */}
          <div className="h-8 w-full">
            <svg className="w-full h-full" viewBox="0 0 100 25" preserveAspectRatio="none">
              <path
                d="M0,22 Q25,8 50,15 T100,3"
                fill="none"
                stroke="#087F5B"
                strokeWidth="2"
              />
              <path
                d="M0,22 Q25,8 50,15 T100,3 L100,25 L0,25 Z"
                fill="#087F5B"
                opacity="0.12"
              />
            </svg>
          </div>
          <div className="text-[11px] text-[#9C9A95] mt-1">
            Cautions plafonnées à 3 mois (Loi n° 2022-30 Bénin)
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION PRINCIPALE : Graphique Financier + Flux des Derniers Règlements   */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Financial Overview Chart */}
        <div className="lg:col-span-7 bg-white border border-[#E8E5E0] rounded-[12px] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="text-[18px] font-bold text-[#1C1C1C] tracking-tight">
                  Aperçu des Revenus &amp; Flux Financiers
                </h2>
                <p className="text-[13px] text-[#64635F]">
                  Progression mensuelle en FCFA et synthèse prévisionnelle
                </p>
              </div>

              {/* Metric Switcher */}
              <div className="inline-flex rounded-[6px] bg-[#FAF9F6] border border-[#E8E5E0] p-0.5">
                <button
                  type="button"
                  onClick={() => setActiveMetric("gross")}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-[4px] transition ${
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
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-[4px] transition ${
                    activeMetric === "commission"
                      ? "bg-[#1C1C1C] text-white shadow-xs"
                      : "text-[#64635F] hover:text-[#1C1C1C]"
                  }`}
                >
                  Commissions (10%)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMetric("tfu")}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-[4px] transition ${
                    activeMetric === "tfu"
                      ? "bg-[#1C1C1C] text-white shadow-xs"
                      : "text-[#64635F] hover:text-[#1C1C1C]"
                  }`}
                >
                  TFU DGI (12%)
                </button>
              </div>
            </div>

            {/* Recharts Area Chart */}
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueMonthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#087F5B" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#087F5B" stopOpacity={0.0} />
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
                    formatter={(val: any) => [`${Number(val).toLocaleString("fr-FR")} FCFA`, activeMetric === "gross" ? "Loyers Bruts" : activeMetric === "commission" ? "Commission 10%" : "TFU DGI"]}
                  />
                  <Area
                    type="monotone"
                    dataKey={activeMetric}
                    stroke="#087F5B"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Chart Footer Stats */}
          <div className="pt-4 border-t border-[#E8E5E0] grid grid-cols-3 gap-4 text-center mt-2">
            <div>
              <div className="text-[11px] text-[#9C9A95] font-medium">Moyenne Mensuelle</div>
              <div className="text-[15px] font-bold text-[#1C1C1C]">4 166 000 FCFA</div>
            </div>
            <div>
              <div className="text-[11px] text-[#9C9A95] font-medium">Prévision Mois Prochain</div>
              <div className="text-[15px] font-bold text-[#087F5B]">+5 100 000 FCFA</div>
            </div>
            <div>
              <div className="text-[11px] text-[#9C9A95] font-medium">Frais Mobile Money (1%)</div>
              <div className="text-[15px] font-bold text-[#64635F]">48 500 FCFA</div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Recent Payments Stream & MoMo/Moov Actions */}
        <div className="lg:col-span-5 bg-white border border-[#E8E5E0] rounded-[12px] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[17px] font-bold text-[#1C1C1C] tracking-tight">
                  Derniers Règlements
                </h3>
                <p className="text-[12px] text-[#64635F]">
                  Encaissements Mobile Money &amp; Quittances PDF
                </p>
              </div>

              <span className="text-[11px] font-bold text-[#087F5B] bg-[#E6F5EF] px-2.5 py-1 rounded-full">
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
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-full border transition whitespace-nowrap ${
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
                          <span className="text-[10px] text-[#087F5B] bg-[#E6F5EF] px-1.5 py-0.2 rounded font-semibold">
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
                      onClick={() => {
                        alert(`Téléchargement de la quittance certifiée : ${tx.receiptNo}\nLocataire : ${tx.tenant}\nMontant : ${tx.rent.toLocaleString("fr-FR")} FCFA`);
                      }}
                      className="text-[11px] text-[#087F5B] hover:underline font-medium inline-flex items-center gap-0.5"
                    >
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
              className="text-[#087F5B] font-bold hover:underline"
            >
              Rappel WhatsApp →
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION SECONDAIRE : Répartition du Parc & Conformité Loi 2022-30          */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Typologie du Parc */}
        <div className="bg-white border border-[#E8E5E0] rounded-[12px] p-5 shadow-xs">
          <h4 className="text-[15px] font-bold text-[#1C1C1C] mb-1">
            Répartition du Patrimoine
          </h4>
          <p className="text-[12px] text-[#64635F] mb-4">
            Total : 27 lots sous gestion au Bénin
          </p>

          <div className="space-y-2.5">
            {typologyData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-[#1C1C1C] font-medium">{item.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#1C1C1C]">{item.count} lots</span>
                  <span className="text-[11px] text-[#9C9A95]">({item.pct})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Conformité Loi n° 2022-30 */}
        <div className="bg-white border border-[#E8E5E0] rounded-[12px] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#087F5B] mb-2">
              <CheckCircleIcon className="h-5 w-5" />
              <h4 className="text-[15px] font-bold text-[#1C1C1C]">
                Conformité Légale Loi 2022-30
              </h4>
            </div>
            <p className="text-[12px] text-[#64635F] leading-relaxed mb-3">
              Vos baux et encaissements respectent scrupuleusement la réglementation locative béninoise :
            </p>
            <ul className="text-[12px] text-[#1C1C1C] space-y-1.5">
              <li className="flex items-center gap-1.5">
                <CheckIcon className="h-3.5 w-3.5 text-[#087F5B]" />
                <span>Plafond de caution limité à 3 mois maximum</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckIcon className="h-3.5 w-3.5 text-[#087F5B]" />
                <span>Quittances numériques à valeur probante</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckIcon className="h-3.5 w-3.5 text-[#087F5B]" />
                <span>Commissions de gestion plafonnées à 10%</span>
              </li>
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E8E5E0] text-[11px] text-[#64635F]">
            Mise à jour légale 2026 active
          </div>
        </div>

        {/* Card 3: Assistance Rapide & Support Bénin */}
        <div className="bg-[#FAF9F6] border border-[#E8E5E0] rounded-[12px] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#087F5B] mb-2 block">
              Support Lokka Bénin
            </span>
            <h4 className="text-[15px] font-bold text-[#1C1C1C] mb-2">
              Besoin d&apos;assistance ou d&apos;un conseil juridique ?
            </h4>
            <p className="text-[12px] text-[#64635F] leading-relaxed">
              Notre équipe d&apos;experts en droit immobilier à Cotonou vous répond en direct sur WhatsApp.
            </p>
          </div>

          <a
            href="https://wa.me/22997000000"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 w-full py-2 px-3 bg-[#1C1C1C] hover:bg-[#333333] text-white text-[12px] font-semibold rounded-[6px] text-center transition block shadow-xs"
          >
            Contacter un juriste WhatsApp
          </a>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL : Enregistrer un Paiement Mobile Money & Quittance                   */}
      {/* ========================================================================= */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8E5E0] rounded-[12px] max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E8E5E0]">
              <div className="flex items-center gap-2">
                <BanknotesIcon className="h-5 w-5 text-[#087F5B]" />
                <h3 className="text-[16px] font-bold text-[#1C1C1C]">
                  Enregistrer un Encaissement
                </h3>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-[#9C9A95] hover:text-[#1C1C1C]"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddPayment} className="space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#1C1C1C] mb-1">
                  Nom du Locataire
                </label>
                <input
                  type="text"
                  required
                  value={paymentForm.tenant}
                  onChange={(e) => setPaymentForm({ ...paymentForm, tenant: e.target.value })}
                  className="w-full px-3.5 py-2 bg-white border border-[#E8E5E0] rounded-[6px] text-[13px] text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#1C1C1C] mb-1">
                  Bien Immobilier Concerné
                </label>
                <input
                  type="text"
                  required
                  value={paymentForm.property}
                  onChange={(e) => setPaymentForm({ ...paymentForm, property: e.target.value })}
                  className="w-full px-3.5 py-2 bg-white border border-[#E8E5E0] rounded-[6px] text-[13px] text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#1C1C1C] mb-1">
                  Montant Reçu (FCFA)
                </label>
                <input
                  type="number"
                  required
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                  className="w-full px-3.5 py-2 bg-white border border-[#E8E5E0] rounded-[6px] text-[14px] font-bold text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#1C1C1C] mb-1">
                  Canal de Paiement
                </label>
                <select
                  value={paymentForm.channel}
                  onChange={(e) => setPaymentForm({ ...paymentForm, channel: e.target.value })}
                  className="w-full px-3.5 py-2 bg-white border border-[#E8E5E0] rounded-[6px] text-[13px] text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                >
                  <option value="mtn">MTN Mobile Money (+229)</option>
                  <option value="moov">Moov Money (+229)</option>
                  <option value="virement">Virement Bancaire (BOA, Ecobank, etc.)</option>
                  <option value="especes">Espèces / Remise directe</option>
                </select>
              </div>

              {/* TFU calculation preview */}
              <div className="bg-[#FAF9F6] p-3 rounded-[6px] border border-[#E8E5E0] text-[11px] text-[#64635F] space-y-1">
                <div className="flex justify-between">
                  <span>Montant brut :</span>
                  <strong className="text-[#1C1C1C]">
                    {Number(paymentForm.amount || 0).toLocaleString("fr-FR")} FCFA
                  </strong>
                </div>
                <div className="flex justify-between text-[#087F5B]">
                  <span>Quittance PDF &amp; Envoi WhatsApp :</span>
                  <strong>Automatique Gratuit</strong>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 py-2 px-3 border border-[#E8E5E0] text-[#64635F] text-[12px] font-semibold rounded-[6px] hover:bg-[#FAF9F6]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 bg-[#087F5B] hover:bg-[#076b4d] text-white text-[12px] font-bold rounded-[6px] shadow-xs"
                >
                  Valider l&apos;encaissement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
