"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  BanknotesIcon,
  HomeModernIcon,
  UserGroupIcon,
  SparklesIcon,
  CheckIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
  DocumentCheckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

/* ─── Stepper Definition ─── */
const STEPS = [
  { label: "Réception Loyers", icon: BanknotesIcon },
  { label: "Premier Logement", icon: HomeModernIcon },
  { label: "Locataire & Caution", icon: UserGroupIcon },
  { label: "Automatisation", icon: SparklesIcon },
];

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Profile from query or storage
  const [profileType, setProfileType] = useState<string>("bailleur");
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const qProfile = searchParams?.get("profile");
    const qName = searchParams?.get("name");
    if (qProfile) setProfileType(qProfile);
    if (qName) setUserName(qName);

    try {
      const saved = localStorage.getItem("lokka_user_profile");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.accountType && !qProfile) setProfileType(parsed.accountType);
        if (parsed.name && !qName) setUserName(parsed.name);
      }
    } catch (_) {}
  }, [searchParams]);

  const [currentStep, setCurrentStep] = useState(0);

  // Form State - Step 1: Réception Loyers
  const [city, setCity] = useState("Cotonou");
  const [paymentChannel, setPaymentChannel] = useState<"mtn" | "moov" | "banque" | "especes">("mtn");
  const [momoNumber, setMomoNumber] = useState("97 45 12 89");
  const [bankName, setBankName] = useState("BOA Bénin");

  // Form State - Step 2: Logement
  const [propertyTitle, setPropertyTitle] = useState("Villa Fidjrossè Plage");
  const [propertyType, setPropertyType] = useState("villa");
  const [propertyAddress, setPropertyAddress] = useState("Lot 450 Fidjrossè Calvaire, Cotonou");
  const [rentAmount, setRentAmount] = useState(250000);
  const [chargesAmount, setChargesAmount] = useState(15000);

  // Form State - Step 3: Locataire & Loi 2022-30
  const [tenantFirstName, setTenantFirstName] = useState("Koudjo");
  const [tenantLastName, setTenantLastName] = useState("Dossou");
  const [tenantWhatsApp, setTenantWhatsApp] = useState("97 11 22 33");
  const [depositMonths, setDepositMonths] = useState(3);
  const [paymentDay, setPaymentDay] = useState(5);

  // Form State - Step 4: Automations
  const [whatsappReminders, setWhatsappReminders] = useState(true);
  const [autoReceipts, setAutoReceipts] = useState(true);
  const [tfuTracking, setTfuTracking] = useState(true);
  const [isFinalizing, setIsFinalizing] = useState(false);

  // Deposit calculation based on Loi 2022-30
  const depositAmount = rentAmount * depositMonths;
  const isDepositCompliant = depositMonths <= 3;

  const handleFinish = async () => {
    setIsFinalizing(true);

    const fullTenantName = `${tenantFirstName} ${tenantLastName}`.trim() || "Locataire Principal";
    const fullTenantPhone = `+229 ${tenantWhatsApp}`;

    const onboardingPayload = {
      profileType,
      userName: userName || "Bailleur Lokka",
      city,
      paymentChannel,
      momoNumber: `+229 ${momoNumber}`,
      bankName,
      property: {
        title: propertyTitle || "Appartement Standing",
        type: propertyType,
        address: propertyAddress,
        rent: rentAmount,
        charges: chargesAmount,
      },
      tenant: {
        name: fullTenantName,
        phone: fullTenantPhone,
        depositAmount,
        depositMonths,
        paymentDay,
      },
      preferences: {
        whatsappReminders,
        autoReceipts,
        tfuTracking,
      },
      completedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem("lokka_onboarding_data", JSON.stringify(onboardingPayload));
    } catch (_) {}

    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          // 1. Update Profile with city and phone
          await supabase
            .from("profiles")
            .update({
              city,
              phone_number: `+229 ${momoNumber}`,
              role: profileType,
            })
            .eq("id", user.id);

          // 2. Insert Property
          const { data: propData } = await supabase
            .from("properties")
            .insert([
              {
                owner_id: user.id,
                title: propertyTitle || "Appartement Standing",
                type: propertyType,
                address: propertyAddress,
                city,
                rent_amount_fcfa: rentAmount,
                charges_amount_fcfa: chargesAmount,
                status: "occupe",
              },
            ])
            .select()
            .single();

          // 3. Insert Tenant
          const { data: tenantData } = await supabase
            .from("tenants")
            .insert([
              {
                owner_id: user.id,
                full_name: fullTenantName,
                phone_number: fullTenantPhone,
                whatsapp_number: fullTenantPhone,
              },
            ])
            .select()
            .single();

          // 4. Insert Lease
          if (propData && tenantData) {
            await supabase.from("leases").insert([
              {
                property_id: propData.id,
                tenant_id: tenantData.id,
                start_date: new Date().toISOString().split("T")[0],
                rent_amount_fcfa: rentAmount,
                charges_amount_fcfa: chargesAmount,
                deposit_months: depositMonths,
                deposit_amount_fcfa: depositAmount,
                due_day: paymentDay,
                is_active: true,
              },
            ]);
          }
        }
      }
    } catch (err) {
      console.warn("Supabase onboarding sync notice:", err);
    }

    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1C1C1C] flex flex-col justify-between py-8 px-4 sm:px-6">
      {/* Header with Official Logo */}
      <div className="container mx-auto max-w-2xl text-center mb-8">
        <div className="flex justify-center mb-4">
          <Logo size="md" variant="dark" />
        </div>

        {/* Stepper Progress Bar */}
        <div className="flex items-center justify-between max-w-xl mx-auto mt-2 px-2">
          {STEPS.map((s, index) => {
            const Icon = s.icon;
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <div key={index} className="flex-1 flex flex-col items-center relative">
                {/* Connecting Line */}
                {index > 0 && (
                  <div
                    className={`absolute top-4 -left-1/2 w-full h-[2px] -z-0 transition-colors duration-300 ${
                      index <= currentStep ? "bg-[#087F5B]" : "bg-[#E8E5E0]"
                    }`}
                  />
                )}

                {/* Step Circle */}
                <div
                  className={`relative z-10 h-8 w-8 rounded-full flex items-center justify-center text-[12px] font-bold transition-all duration-300 ${
                    isCompleted
                      ? "bg-[#087F5B] text-white shadow-xs"
                      : isCurrent
                      ? "bg-[#1C1C1C] text-white ring-4 ring-[#1C1C1C]/10 shadow-xs"
                      : "bg-[#FAF9F6] text-[#9C9A95] border border-[#E8E5E0]"
                  }`}
                >
                  {isCompleted ? <CheckIcon className="h-4 w-4 stroke-[2.5]" /> : index + 1}
                </div>

                {/* Step Label */}
                <span
                  className={`mt-2 text-[11px] font-medium hidden sm:block ${
                    isCurrent
                      ? "text-[#1C1C1C] font-semibold"
                      : isCompleted
                      ? "text-[#087F5B]"
                      : "text-[#9C9A95]"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Step Container */}
      <div className="w-full max-w-xl mx-auto bg-white border border-[#E8E5E0] rounded-[12px] p-6 sm:p-10 shadow-sm relative">
        <AnimatePresence mode="wait">
          {/* ========================================================================= */}
          {/* STEP 1: RÉCEPTION DES FONDS & VILLE                                      */}
          {/* ========================================================================= */}
          {currentStep === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF9F6] border border-[#E8E5E0] text-[#087F5B] text-[11px] font-bold uppercase tracking-wider mb-2">
                  <span>🇧🇯</span> Étape 1 / 4
                </div>
                <h1 className="text-[24px] sm:text-[28px] font-extrabold text-[#1C1C1C] tracking-tight">
                  Où et comment encaissez-vous vos loyers ?
                </h1>
                <p className="text-[14px] text-[#64635F]">
                  Lokka configure automatiquement vos comptes pour centraliser vos règlements.
                </p>
              </div>

              {/* Ville de Gestion */}
              <div>
                <label className="block text-[12px] font-semibold text-[#1C1C1C] mb-1.5">
                  Ville principale de vos biens
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {["Cotonou", "Calavi", "Porto-Novo", "Parakou", "Ouidah"].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setCity(v)}
                      className={`py-2 px-1 text-center text-[12px] font-semibold rounded-[6px] border transition-all ${
                        city === v
                          ? "bg-[#1C1C1C] text-white border-[#1C1C1C] shadow-xs"
                          : "bg-white text-[#64635F] border-[#E8E5E0] hover:border-[#1C1C1C]"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Canal de Réception Mobile Money / Banque */}
              <div>
                <label className="block text-[12px] font-semibold text-[#1C1C1C] mb-1.5">
                  Mode de réception principal des loyers
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "mtn", label: "MTN MoMo", badge: "Populaire", icon: "🟡" },
                    { id: "moov", label: "Moov Money", badge: "Direct", icon: "🔵" },
                    { id: "banque", label: "Virement", badge: "Banque", icon: "🏦" },
                    { id: "especes", label: "Espèces", badge: "Reçu papier", icon: "💵" },
                  ].map((chan) => (
                    <button
                      key={chan.id}
                      type="button"
                      onClick={() => setPaymentChannel(chan.id as any)}
                      className={`p-3 text-left rounded-[6px] border transition-all flex flex-col justify-between ${
                        paymentChannel === chan.id
                          ? "bg-[#1C1C1C] text-white border-[#1C1C1C] shadow-xs"
                          : "bg-[#FAF9F6] text-[#1C1C1C] border-[#E8E5E0] hover:bg-white"
                      }`}
                    >
                      <div className="text-lg mb-1">{chan.icon}</div>
                      <div className="text-[13px] font-bold">{chan.label}</div>
                      <div
                        className={`text-[10px] ${
                          paymentChannel === chan.id ? "text-white/70" : "text-[#9C9A95]"
                        }`}
                      >
                        {chan.badge}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Input for Mobile Money Number or Bank */}
              {(paymentChannel === "mtn" || paymentChannel === "moov") && (
                <div>
                  <label className="block text-[12px] font-semibold text-[#1C1C1C] mb-1.5">
                    Numéro de réception {paymentChannel === "mtn" ? "MTN MoMo" : "Moov Money"}
                  </label>
                  <div className="relative flex">
                    <span className="inline-flex items-center px-3 rounded-l-[6px] border border-r-0 border-[#E8E5E0] bg-[#FAF9F6] text-[13px] font-bold text-[#1C1C1C]">
                      🇧🇯 +229
                    </span>
                    <input
                      type="tel"
                      value={momoNumber}
                      onChange={(e) => setMomoNumber(e.target.value)}
                      className="w-full pl-3 pr-3 py-2 bg-white border border-[#E8E5E0] rounded-r-[6px] text-[14px] text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C] transition shadow-xs"
                      placeholder="97 45 12 89"
                    />
                  </div>
                </div>
              )}

              {paymentChannel === "banque" && (
                <div>
                  <label className="block text-[12px] font-semibold text-[#1C1C1C] mb-1.5">
                    Établissement bancaire béninois
                  </label>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E8E5E0] rounded-[6px] text-[13px] text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                  >
                    <option value="BOA Bénin">BOA Bénin (Bank of Africa)</option>
                    <option value="Ecobank Bénin">Ecobank Bénin</option>
                    <option value="UBA Bénin">UBA Bénin</option>
                    <option value="Société Générale Bénin">Société Générale Bénin</option>
                    <option value="BGFI Bank Bénin">BGFI Bank Bénin</option>
                  </select>
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="btn-primary py-2.5 px-6 text-[13px] flex items-center gap-2"
                >
                  Continuer
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: PREMIER LOGEMENT                                                 */}
          {/* ========================================================================= */}
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF9F6] border border-[#E8E5E0] text-[#087F5B] text-[11px] font-bold uppercase tracking-wider mb-2">
                  <span>🏠</span> Étape 2 / 4
                </div>
                <h2 className="text-[24px] sm:text-[28px] font-extrabold text-[#1C1C1C] tracking-tight">
                  Ajoutons votre premier bien immobilier
                </h2>
                <p className="text-[14px] text-[#64635F]">
                  Renseignez les détails du logement pour initialiser votre inventaire.
                </p>
              </div>

              {/* Property Title */}
              <div>
                <label className="block text-[12px] font-semibold text-[#1C1C1C] mb-1.5">
                  Nom ou désignation du bien
                </label>
                <input
                  type="text"
                  value={propertyTitle}
                  onChange={(e) => setPropertyTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-[#E8E5E0] rounded-[6px] text-[14px] text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C] shadow-xs"
                  placeholder="Ex: Villa Fidjrossè Plage ou Studio Haie Vive"
                />
              </div>

              {/* Property Type Grid */}
              <div>
                <label className="block text-[12px] font-semibold text-[#1C1C1C] mb-1.5">
                  Typologie du bien
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: "studio", label: "Chambre / Studio" },
                    { id: "appartement", label: "Appartement F2/F3" },
                    { id: "villa", label: "Villa / Maison" },
                    { id: "commercial", label: "Boutique / Local" },
                    { id: "immeuble", label: "Immeuble complet" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setPropertyType(t.id)}
                      className={`py-2 px-2 text-center text-[12px] font-semibold rounded-[6px] border transition-all ${
                        propertyType === t.id
                          ? "bg-[#1C1C1C] text-white border-[#1C1C1C] shadow-xs"
                          : "bg-white text-[#64635F] border-[#E8E5E0] hover:border-[#1C1C1C]"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-[12px] font-semibold text-[#1C1C1C] mb-1.5">
                  Adresse &amp; Quartier
                </label>
                <input
                  type="text"
                  value={propertyAddress}
                  onChange={(e) => setPropertyAddress(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-[#E8E5E0] rounded-[6px] text-[13px] text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C] shadow-xs"
                  placeholder="Ex: Lot 450 Fidjrossè Calvaire, Cotonou"
                />
              </div>

              {/* Rent & Charges Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-[#1C1C1C] mb-1.5">
                    Loyer mensuel (FCFA)
                  </label>
                  <input
                    type="number"
                    value={rentAmount}
                    onChange={(e) => setRentAmount(Number(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 bg-white border border-[#E8E5E0] rounded-[6px] text-[14px] font-bold text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C] shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#1C1C1C] mb-1.5">
                    Charges estimées (FCFA)
                  </label>
                  <input
                    type="number"
                    value={chargesAmount}
                    onChange={(e) => setChargesAmount(Number(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 bg-white border border-[#E8E5E0] rounded-[6px] text-[14px] text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C] shadow-xs"
                    placeholder="15000"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-[#E8E5E0]">
                <button
                  type="button"
                  onClick={() => setCurrentStep(0)}
                  className="btn-secondary py-2 px-4 text-[13px] flex items-center gap-1.5"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  Retour
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="btn-primary py-2 px-6 text-[13px] flex items-center gap-2"
                >
                  Continuer
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: LOCATAIRE & CAUTION LOI 2022-30                                  */}
          {/* ========================================================================= */}
          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF9F6] border border-[#E8E5E0] text-[#087F5B] text-[11px] font-bold uppercase tracking-wider mb-2">
                  <span>⚖️</span> Étape 3 / 4 · Loi n° 2022-30
                </div>
                <h2 className="text-[24px] sm:text-[28px] font-extrabold text-[#1C1C1C] tracking-tight">
                  Le locataire &amp; le contrat de bail
                </h2>
                <p className="text-[14px] text-[#64635F]">
                  Sécurisez votre relation locative en conformité avec la réglementation béninoise.
                </p>
              </div>

              {/* Tenant Name Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-[#1C1C1C] mb-1.5">
                    Prénom du locataire
                  </label>
                  <input
                    type="text"
                    value={tenantFirstName}
                    onChange={(e) => setTenantFirstName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-[#E8E5E0] rounded-[6px] text-[13px] text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C] shadow-xs"
                    placeholder="Koudjo"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#1C1C1C] mb-1.5">
                    Nom du locataire
                  </label>
                  <input
                    type="text"
                    value={tenantLastName}
                    onChange={(e) => setTenantLastName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-[#E8E5E0] rounded-[6px] text-[13px] text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C] shadow-xs"
                    placeholder="Dossou"
                  />
                </div>
              </div>

              {/* WhatsApp Phone Number */}
              <div>
                <label className="block text-[12px] font-semibold text-[#1C1C1C] mb-1.5">
                  Numéro WhatsApp du locataire (+229)
                </label>
                <div className="relative flex">
                  <span className="inline-flex items-center px-3 rounded-l-[6px] border border-r-0 border-[#E8E5E0] bg-[#FAF9F6] text-[13px] font-bold text-[#1C1C1C]">
                    🇧🇯 +229
                  </span>
                  <input
                    type="tel"
                    value={tenantWhatsApp}
                    onChange={(e) => setTenantWhatsApp(e.target.value)}
                    className="w-full pl-3 pr-3 py-2 bg-white border border-[#E8E5E0] rounded-r-[6px] text-[13px] text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C] shadow-xs"
                    placeholder="97 11 22 33"
                  />
                </div>
                <span className="text-[11px] text-[#9C9A95] mt-1 block">
                  Il recevra ses quittances certifiées et rappels d&apos;échéances sur ce numéro.
                </span>
              </div>

              {/* Caution / Dépôt de Garantie - Loi 2022-30 Check */}
              <div className="p-4 rounded-[8px] bg-[#FAF9F6] border border-[#E8E5E0] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[12px] font-bold text-[#1C1C1C]">
                    Caution / Dépôt de garantie exigé :
                  </label>
                  <span className="text-[13px] font-bold text-[#087F5B]">
                    {depositAmount.toLocaleString("fr-FR")} FCFA ({depositMonths} mois)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setDepositMonths(m)}
                      className={`flex-1 py-1.5 text-[12px] font-bold rounded-[4px] border transition-all ${
                        depositMonths === m
                          ? m <= 3
                            ? "bg-[#087F5B] text-white border-[#087F5B]"
                            : "bg-red-600 text-white border-red-600"
                          : "bg-white text-[#64635F] border-[#E8E5E0]"
                      }`}
                    >
                      {m} {m === 1 ? "mois" : "mois"}
                    </button>
                  ))}
                </div>

                {/* Compliance badge */}
                {isDepositCompliant ? (
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-[#087F5B]">
                    <CheckCircleIcon className="h-4 w-4 shrink-0" />
                    <span>Conforme à la Loi 2022-30 (Plafond de 3 mois max respecté).</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-red-600 bg-red-50 p-2 rounded">
                    <ExclamationTriangleIcon className="h-4 w-4 shrink-0" />
                    <span>
                      Attention : L&apos;Article 10 de la Loi 2022-30 interdit plus de 3 mois de caution au Bénin.
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-[#E8E5E0]">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="btn-secondary py-2 px-4 text-[13px] flex items-center gap-1.5"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  Retour
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="btn-primary py-2 px-6 text-[13px] flex items-center gap-2"
                >
                  Continuer
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* STEP 4: AUTOMATISATION & FINALISATION                                     */}
          {/* ========================================================================= */}
          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF9F6] border border-[#E8E5E0] text-[#087F5B] text-[11px] font-bold uppercase tracking-wider mb-2">
                  <span>✨</span> Étape 4 / 4 · Prêt pour le Dashboard
                </div>
                <h2 className="text-[24px] sm:text-[28px] font-extrabold text-[#1C1C1C] tracking-tight">
                  Vos automatisations sont prêtes !
                </h2>
                <p className="text-[14px] text-[#64635F]">
                  Voici ce que Lokka prend en charge automatiquement pour vous chaque mois.
                </p>
              </div>

              {/* Automations Toggles */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 rounded-[8px] bg-[#FAF9F6] border border-[#E8E5E0]">
                  <div>
                    <div className="text-[13px] font-bold text-[#1C1C1C]">
                      Rappels WhatsApp automatiques à J-3
                    </div>
                    <div className="text-[11px] text-[#64635F]">
                      Notification courtoise envoyée au locataire avant le {paymentDay} du mois.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={whatsappReminders}
                    onChange={(e) => setWhatsappReminders(e.target.checked)}
                    className="h-4 w-4 rounded border-[#E8E5E0] text-[#087F5B] focus:ring-0 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-[8px] bg-[#FAF9F6] border border-[#E8E5E0]">
                  <div>
                    <div className="text-[13px] font-bold text-[#1C1C1C]">
                      Génération instantanée de la Quittance PDF
                    </div>
                    <div className="text-[11px] text-[#64635F]">
                      Émise dès confirmation du règlement ({rentAmount.toLocaleString("fr-FR")} FCFA).
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoReceipts}
                    onChange={(e) => setAutoReceipts(e.target.checked)}
                    className="h-4 w-4 rounded border-[#E8E5E0] text-[#087F5B] focus:ring-0 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-[8px] bg-[#FAF9F6] border border-[#E8E5E0]">
                  <div>
                    <div className="text-[13px] font-bold text-[#1C1C1C]">
                      Suivi fiscal Taxe Foncière Unique (TFU)
                    </div>
                    <div className="text-[11px] text-[#64635F]">
                      Estimation de la fiscalité immobilière annuelle au Bénin.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={tfuTracking}
                    onChange={(e) => setTfuTracking(e.target.checked)}
                    className="h-4 w-4 rounded border-[#E8E5E0] text-[#087F5B] focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Summary Recap Box */}
              <div className="bg-[#1C1C1C] text-white rounded-[10px] p-5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#E6F5EF] mb-3">
                  Récapitulatif de votre espace Lokka :
                </div>
                <div className="grid grid-cols-2 gap-3 text-[12px]">
                  <div>
                    <span className="text-white/60 block">Logement :</span>
                    <span className="font-semibold">{propertyTitle}</span>
                  </div>
                  <div>
                    <span className="text-white/60 block">Loyer mensuel :</span>
                    <span className="font-bold text-[#E6F5EF]">
                      {rentAmount.toLocaleString("fr-FR")} FCFA
                    </span>
                  </div>
                  <div>
                    <span className="text-white/60 block">Locataire :</span>
                    <span className="font-semibold">
                      {tenantFirstName} {tenantLastName}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/60 block">Encaissement :</span>
                    <span className="font-semibold capitalize">
                      {paymentChannel === "mtn" ? "MTN MoMo" : paymentChannel === "moov" ? "Moov Money" : "Virement"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="btn-secondary py-2 px-4 text-[13px] flex items-center gap-1.5"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  Retour
                </button>
                <button
                  type="button"
                  disabled={isFinalizing}
                  onClick={handleFinish}
                  className="btn-primary py-2.5 px-6 text-[13px] flex items-center gap-2"
                >
                  {isFinalizing ? (
                    <span>Chargement...</span>
                  ) : (
                    <>
                      <span>Continuer</span>
                      <ArrowRightIcon className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="text-center text-[12px] text-[#9C9A95] mt-6">
        © 2026 Lokka. Plateforme de gestion locative conforme à la Loi n° 2022-30 au Bénin.
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF9F6]" />}>
      <OnboardingContent />
    </Suspense>
  );
}
