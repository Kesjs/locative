"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/ui/Logo";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  BuildingOffice2Icon,
  HomeModernIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  BanknotesIcon,
  CheckIcon,
  SparklesIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

// =========================================================================
// COMPOSANT DRAPEAUX SVG VECTORIELS PURS (100% VISUELS SUR WINDOWS & MAC)
// =========================================================================
function CountryFlagSvg({ code }: { code: string }) {
  switch (code) {
    case "BJ":
      return (
        <svg viewBox="0 0 45 30" className="w-5 h-3.5 rounded-[2px] shadow-2xs border border-black/15 shrink-0 inline-block">
          <rect width="18" height="30" fill="#008751" />
          <rect x="18" width="27" height="15" fill="#FCD116" />
          <rect x="18" y="15" width="27" height="15" fill="#E8112D" />
        </svg>
      );
    case "FR":
      return (
        <svg viewBox="0 0 45 30" className="w-5 h-3.5 rounded-[2px] shadow-2xs border border-black/15 shrink-0 inline-block">
          <rect width="15" height="30" fill="#002395" />
          <rect x="15" width="15" height="30" fill="#FFFFFF" />
          <rect x="30" width="15" height="30" fill="#ED2939" />
        </svg>
      );
    case "CI":
      return (
        <svg viewBox="0 0 45 30" className="w-5 h-3.5 rounded-[2px] shadow-2xs border border-black/15 shrink-0 inline-block">
          <rect width="15" height="30" fill="#FF8200" />
          <rect x="15" width="15" height="30" fill="#FFFFFF" />
          <rect x="30" width="15" height="30" fill="#009E60" />
        </svg>
      );
    case "TG":
      return (
        <svg viewBox="0 0 45 30" className="w-5 h-3.5 rounded-[2px] shadow-2xs border border-black/15 shrink-0 inline-block">
          <rect width="45" height="6" fill="#006A4E" />
          <rect y="6" width="45" height="6" fill="#FFCE00" />
          <rect y="12" width="45" height="6" fill="#006A4E" />
          <rect y="18" width="45" height="6" fill="#FFCE00" />
          <rect y="24" width="45" height="6" fill="#006A4E" />
          <rect width="18" height="18" fill="#D21034" />
          <polygon points="9,3 11,8 16,8 12,12 14,17 9,13 4,17 6,12 2,8 7,8" fill="#FFFFFF" />
        </svg>
      );
    case "SN":
      return (
        <svg viewBox="0 0 45 30" className="w-5 h-3.5 rounded-[2px] shadow-2xs border border-black/15 shrink-0 inline-block">
          <rect width="15" height="30" fill="#00853F" />
          <rect x="15" width="15" height="30" fill="#FDEF42" />
          <rect x="30" width="15" height="30" fill="#E31B23" />
          <polygon points="22.5,9 24.5,15 30.5,15 25.5,19 27.5,25 22.5,21 17.5,25 19.5,19 14.5,15 20.5,15" fill="#00853F" />
        </svg>
      );
    case "US":
      return (
        <svg viewBox="0 0 45 30" className="w-5 h-3.5 rounded-[2px] shadow-2xs border border-black/15 shrink-0 inline-block">
          <rect width="45" height="30" fill="#B22234" />
          <path d="M0,4.6h45 M0,9.2h45 M0,13.8h45 M0,18.4h45 M0,23h45 M0,27.6h45" stroke="#FFFFFF" strokeWidth="2.3" />
          <rect width="18" height="16" fill="#3C3B6E" />
        </svg>
      );
    case "CA":
      return (
        <svg viewBox="0 0 45 30" className="w-5 h-3.5 rounded-[2px] shadow-2xs border border-black/15 shrink-0 inline-block">
          <rect width="11" height="30" fill="#FF0000" />
          <rect x="11" width="23" height="30" fill="#FFFFFF" />
          <rect x="34" width="11" height="30" fill="#FF0000" />
          <polygon points="22.5,8 24,13 27,11 25,16 29,17 25,20 27,22 22.5,21 18,22 20,20 16,17 20,16 18,11 21,13" fill="#FF0000" />
        </svg>
      );
    case "BE":
      return (
        <svg viewBox="0 0 45 30" className="w-5 h-3.5 rounded-[2px] shadow-2xs border border-black/15 shrink-0 inline-block">
          <rect width="15" height="30" fill="#000000" />
          <rect x="15" width="15" height="30" fill="#FDDA24" />
          <rect x="30" width="15" height="30" fill="#EF3340" />
        </svg>
      );
    case "GB":
      return (
        <svg viewBox="0 0 45 30" className="w-5 h-3.5 rounded-[2px] shadow-2xs border border-black/15 shrink-0 inline-block">
          <rect width="45" height="30" fill="#012169" />
          <path d="M0,0 L45,30 M45,0 L0,30" stroke="#FFFFFF" strokeWidth="6" />
          <path d="M0,0 L45,30 M45,0 L0,30" stroke="#C8102E" strokeWidth="3" />
          <path d="M22.5,0 V30 M0,15 H45" stroke="#FFFFFF" strokeWidth="10" />
          <path d="M22.5,0 V30 M0,15 H45" stroke="#C8102E" strokeWidth="6" />
        </svg>
      );
    case "GA":
      return (
        <svg viewBox="0 0 45 30" className="w-5 h-3.5 rounded-[2px] shadow-2xs border border-black/15 shrink-0 inline-block">
          <rect width="45" height="10" fill="#009E60" />
          <rect y="10" width="45" height="10" fill="#FCD116" />
          <rect y="20" width="45" height="10" fill="#3A75C4" />
        </svg>
      );
    case "CG":
      return (
        <svg viewBox="0 0 45 30" className="w-5 h-3.5 rounded-[2px] shadow-2xs border border-black/15 shrink-0 inline-block">
          <rect width="45" height="30" fill="#009543" />
          <polygon points="0,30 45,0 45,30" fill="#DC241F" />
          <polygon points="0,30 18,30 45,10 45,0 27,0 0,20" fill="#FBDE4A" />
        </svg>
      );
    case "CM":
      return (
        <svg viewBox="0 0 45 30" className="w-5 h-3.5 rounded-[2px] shadow-2xs border border-black/15 shrink-0 inline-block">
          <rect width="15" height="30" fill="#007A5E" />
          <rect x="15" width="15" height="30" fill="#CE1126" />
          <rect x="30" width="15" height="30" fill="#FCD116" />
          <polygon points="22.5,10 24,15 29,15 25,18 26.5,23 22.5,20 18.5,23 20,18 16,15 21,15" fill="#FCD116" />
        </svg>
      );
    case "NG":
      return (
        <svg viewBox="0 0 45 30" className="w-5 h-3.5 rounded-[2px] shadow-2xs border border-black/15 shrink-0 inline-block">
          <rect width="15" height="30" fill="#008751" />
          <rect x="15" width="15" height="30" fill="#FFFFFF" />
          <rect x="30" width="15" height="30" fill="#008751" />
        </svg>
      );
    case "ML":
      return (
        <svg viewBox="0 0 45 30" className="w-5 h-3.5 rounded-[2px] shadow-2xs border border-black/15 shrink-0 inline-block">
          <rect width="15" height="30" fill="#14B53A" />
          <rect x="15" width="15" height="30" fill="#FCD116" />
          <rect x="30" width="15" height="30" fill="#CE1126" />
        </svg>
      );
    case "DE":
      return (
        <svg viewBox="0 0 45 30" className="w-5 h-3.5 rounded-[2px] shadow-2xs border border-black/15 shrink-0 inline-block">
          <rect width="45" height="10" fill="#000000" />
          <rect y="10" width="45" height="10" fill="#DD0000" />
          <rect y="20" width="45" height="10" fill="#FFCE00" />
        </svg>
      );
    case "CH":
      return (
        <svg viewBox="0 0 45 30" className="w-5 h-3.5 rounded-[2px] shadow-2xs border border-black/15 shrink-0 inline-block">
          <rect width="45" height="30" fill="#D52B1E" />
          <rect x="19" y="6" width="7" height="18" fill="#FFFFFF" />
          <rect x="13.5" y="11.5" width="18" height="7" fill="#FFFFFF" />
        </svg>
      );
    case "IT":
      return (
        <svg viewBox="0 0 45 30" className="w-5 h-3.5 rounded-[2px] shadow-2xs border border-black/15 shrink-0 inline-block">
          <rect width="15" height="30" fill="#009246" />
          <rect x="15" width="15" height="30" fill="#FFFFFF" />
          <rect x="30" width="15" height="30" fill="#CE2B37" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 45 30" className="w-5 h-3.5 rounded-[2px] shadow-2xs border border-black/15 shrink-0 inline-block bg-[#1C1C1C]">
          <circle cx="22.5" cy="15" r="8" fill="#FFFFFF" />
        </svg>
      );
  }
}

interface CountryOption {
  code: string;
  name: string;
  dialCode: string;
}

const COUNTRIES: CountryOption[] = [
  { code: "BJ", name: "Bénin", dialCode: "+229" },
  { code: "FR", name: "France", dialCode: "+33" },
  { code: "CI", name: "Côte d'Ivoire", dialCode: "+225" },
  { code: "TG", name: "Togo", dialCode: "+228" },
  { code: "SN", name: "Sénégal", dialCode: "+221" },
  { code: "US", name: "États-Unis", dialCode: "+1" },
  { code: "CA", name: "Canada", dialCode: "+1" },
  { code: "BE", name: "Belgique", dialCode: "+32" },
  { code: "GB", name: "Royaume-Uni", dialCode: "+44" },
  { code: "GA", name: "Gabon", dialCode: "+241" },
  { code: "CG", name: "Congo", dialCode: "+242" },
  { code: "CM", name: "Cameroun", dialCode: "+237" },
  { code: "ML", name: "Mali", dialCode: "+223" },
  { code: "NG", name: "Nigeria", dialCode: "+234" },
  { code: "DE", name: "Allemagne", dialCode: "+49" },
  { code: "CH", name: "Suisse", dialCode: "+41" },
  { code: "IT", name: "Italie", dialCode: "+39" },
];

// Composant Sélecteur de Téléphone avec Vrais Drapeaux SVG Graphiques
function CountryPhoneInput({
  selectedCountry,
  onSelectCountry,
  phoneNumber,
  onChangePhone,
  placeholder = "97 45 12 89",
  label,
}: {
  selectedCountry: CountryOption;
  onSelectCountry: (c: CountryOption) => void;
  phoneNumber: string;
  onChangePhone: (val: string) => void;
  placeholder?: string;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dialCode.includes(search) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full relative" ref={dropdownRef}>
      {label && (
        <label className="block text-[12px] font-semibold text-[#1C1C1C] mb-1.5">
          {label}
        </label>
      )}

      <div className="relative flex items-center bg-white border border-[#E8E5E0] rounded-[8px] focus-within:border-[#1C1C1C] focus-within:ring-2 focus-within:ring-[#1C1C1C]/5 transition-all shadow-xs overflow-visible">
        {/* Country Flag Dropdown Trigger with crisp SVG */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="h-full px-3 py-2.5 bg-[#FAF9F6] border-r border-[#E8E5E0] rounded-l-[8px] flex items-center gap-2 text-[13px] font-bold text-[#1C1C1C] hover:bg-[#F5F5DC] transition-colors cursor-pointer shrink-0"
        >
          <CountryFlagSvg code={selectedCountry.code} />
          <span className="font-mono text-[13px]">{selectedCountry.dialCode}</span>
          <ChevronDownIcon className="h-3 w-3 text-[#64635F]" />
        </button>

        {/* Phone Input */}
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => onChangePhone(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3.5 py-2.5 bg-transparent text-[14px] text-[#1C1C1C] placeholder-[#9C9A95] font-medium outline-none"
        />
      </div>

      {/* Floating Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-72 bg-white border border-[#E8E5E0] rounded-[10px] shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Search Box */}
          <div className="p-2 border-b border-[#E8E5E0] bg-[#FAF9F6]">
            <div className="relative flex items-center">
              <MagnifyingGlassIcon className="h-3.5 w-3.5 absolute left-2.5 text-[#9C9A95]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un pays ou indicatif..."
                className="w-full pl-8 pr-2.5 py-1.5 text-[12px] bg-white border border-[#E8E5E0] rounded-[6px] outline-none text-[#1C1C1C]"
                autoFocus
              />
            </div>
          </div>

          {/* Country List with SVG Flags */}
          <div className="max-h-56 overflow-y-auto divide-y divide-[#E8E5E0]/40">
            {filteredCountries.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => {
                  onSelectCountry(c);
                  setIsOpen(false);
                  setSearch("");
                }}
                className={`w-full px-3 py-2.5 text-left flex items-center justify-between text-[12px] transition-colors cursor-pointer ${
                  selectedCountry.code === c.code
                    ? "bg-[#F5F5DC] text-[#1C1C1C] font-bold"
                    : "hover:bg-[#FAF9F6] text-[#1C1C1C]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CountryFlagSvg code={c.code} />
                  <span>{c.name}</span>
                </div>
                <span className="font-mono text-[11px] text-[#64635F] font-semibold">{c.dialCode}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const STEPS = [
  { id: "profil", label: "Profil & Encaissement", icon: BanknotesIcon },
  { id: "logement", label: "Votre 1er Logement", icon: HomeModernIcon },
  { id: "locataire", label: "Locataire & Loi 2022-30", icon: ShieldCheckIcon },
  { id: "finalisation", label: "Activation & Vitrine", icon: SparklesIcon },
];

const PROFILES = [
  {
    id: "bailleur",
    title: "Propriétaire Bailleur",
    subtitle: "Je gère personnellement mes propres biens immobiliers",
    icon: HomeModernIcon,
    badge: "Indépendant 🇧🇯",
  },
  {
    id: "agence",
    title: "Cabinet ou Agence",
    subtitle: "Je gère des mandats locatifs pour des tiers ou propriétaires",
    icon: BuildingOffice2Icon,
    badge: "Honoraires 10%",
  },
  {
    id: "diaspora",
    title: "Investisseur Diaspora",
    subtitle: "Je vis à l'étranger et je pilote mes biens au pays à distance",
    icon: GlobeAltIcon,
    badge: "FCFA / EUR (€)",
  },
];

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Profile selection
  const [profileType, setProfileType] = useState<"bailleur" | "agence" | "diaspora">("bailleur");
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const qProfile = searchParams?.get("profile");
    const qName = searchParams?.get("name");
    const qEmail = searchParams?.get("email");
    if (qProfile && (qProfile === "bailleur" || qProfile === "agence" || qProfile === "diaspora")) {
      setProfileType(qProfile as any);
    }
    if (qName) setUserName(qName);
    if (qEmail) setUserEmail(qEmail);

    try {
      const saved = localStorage.getItem("lokka_user_profile");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.accountType && !qProfile) setProfileType(parsed.accountType);
        if (parsed.name && !qName) setUserName(parsed.name);
        if (parsed.email && !qEmail) setUserEmail(parsed.email);
      }
    } catch (_) {}
  }, [searchParams]);

  const [currentStep, setCurrentStep] = useState(0);

  // Form State - Step 1: Profil, Localisation & Encaissement
  const [agencyName, setAgencyName] = useState("Cabinet Immobilier du Golfe");
  const [diasporaCountry, setDiasporaCountry] = useState("France");
  const [city, setCity] = useState("Cotonou");
  const [isOtherCity, setIsOtherCity] = useState(false);
  
  // Canaux : "mobile" (MTN/Moov), "banque", "especes"
  const [paymentChannel, setPaymentChannel] = useState<"mobile" | "banque" | "especes">("mobile");
  const [mobileProvider, setMobileProvider] = useState<"mtn" | "moov">("mtn");
  const [ownerCountry, setOwnerCountry] = useState<CountryOption>(COUNTRIES[0]); // Bénin par défaut
  const [momoNumber, setMomoNumber] = useState("97 45 12 89");
  const [bankName, setBankName] = useState("BOA Bénin");
  const [bankIban, setBankIban] = useState("BJ66 BJ06 1010 0123 4567 8901 23");

  // Form State - Step 2: Logement
  const [propertyTitle, setPropertyTitle] = useState("Villa Fidjrossè Plage");
  const [propertyOwnerMandant, setPropertyOwnerMandant] = useState("M. Dossou Mensah");
  const [propertyType, setPropertyType] = useState("villa");
  const [propertyAddress, setPropertyAddress] = useState("Lot 450 Fidjrossè Calvaire, Cotonou");
  const [rentAmount, setRentAmount] = useState(250000);
  const [chargesAmount, setChargesAmount] = useState(15000);

  // Form State - Step 3: Locataire & Loi 2022-30
  const [tenantFirstName, setTenantFirstName] = useState("Koudjo");
  const [tenantLastName, setTenantLastName] = useState("Dossou");
  const [tenantCountry, setTenantCountry] = useState<CountryOption>(COUNTRIES[0]); // Bénin par défaut
  const [tenantWhatsApp, setTenantWhatsApp] = useState("97 11 22 33");
  const [depositMonths, setDepositMonths] = useState(3);
  const [paymentDay, setPaymentDay] = useState(5);

  // Form State - Step 4: Automatisations & Vitrine
  const [whatsappReminders, setWhatsappReminders] = useState(true);
  const [autoReceipts, setAutoReceipts] = useState(true);
  const [enableShowcase, setEnableShowcase] = useState(true);
  const [tfuTracking, setTfuTracking] = useState(true);
  const [isFinalizing, setIsFinalizing] = useState(false);

  // Deposit calculation based on Loi 2022-30
  const depositAmount = rentAmount * depositMonths;
  const isDepositCompliant = depositMonths <= 3;

  // Multi-devises preview — suit le pays de résidence choisi, pas toujours l'euro.
  // CI et Sénégal partagent le FCFA (UEMOA) avec le Bénin, donc pas de conversion à faire.
  const DIASPORA_CURRENCY: Record<string, { code: string; symbol: string; rate: number } | "XOF" | null> = {
    France: { code: "EUR", symbol: "€", rate: 655.957 },
    Belgique: { code: "EUR", symbol: "€", rate: 655.957 },
    "États-Unis": { code: "USD", symbol: "$", rate: 590 },
    Canada: { code: "CAD", symbol: "CA$", rate: 430 },
    "Royaume-Uni": { code: "GBP", symbol: "£", rate: 760 },
    "Côte d'Ivoire": "XOF",
    Sénégal: "XOF",
    "Autre pays": null,
  };
  const diasporaCurrency = DIASPORA_CURRENCY[diasporaCountry] ?? null;
  const rentInDiasporaCurrency =
    diasporaCurrency && diasporaCurrency !== "XOF"
      ? Math.round(rentAmount / diasporaCurrency.rate)
      : null;

  const handleFinishOnboarding = async () => {
    setIsFinalizing(true);

    const displayName =
      profileType === "agence"
        ? agencyName
        : userName || (profileType === "diaspora" ? "Investisseur Diaspora" : "Bailleur Lokka");

    const fullTenantName = `${tenantFirstName} ${tenantLastName}`.trim();
    const fullTenantPhone = `${tenantCountry.dialCode} ${tenantWhatsApp}`;
    const fullOwnerPhone = `${ownerCountry.dialCode} ${momoNumber}`;

    const onboardingPayload = {
      profileType,
      userName: displayName,
      diasporaCountry: profileType === "diaspora" ? diasporaCountry : null,
      city,
      paymentChannel,
      mobileProvider: paymentChannel === "mobile" ? mobileProvider : null,
      momoNumber: fullOwnerPhone,
      bankName: paymentChannel === "banque" ? bankName : null,
      bankIban: paymentChannel === "banque" ? bankIban : null,
      property: {
        title: propertyTitle,
        type: propertyType,
        address: propertyAddress,
        city,
        rent: rentAmount,
        charges: chargesAmount,
        ownerMandant: profileType === "agence" ? propertyOwnerMandant : null,
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
        enableShowcase,
        tfuTracking,
      },
      completedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem("lokka_onboarding_data", JSON.stringify(onboardingPayload));
      localStorage.setItem(
        "lokka_user_profile",
        JSON.stringify({
          name: displayName,
          email: userEmail || "contact@lokka.bj",
          accountType: profileType,
          city,
        })
      );
    } catch (_) {}

    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          await supabase
            .from("profiles")
            .update({
              full_name: displayName,
              city,
              phone_number: fullOwnerPhone,
              role: profileType === "diaspora" ? "bailleur" : profileType,
              onboarding_completed: true,
            })
            .eq("id", user.id);

          if (userEmail) {
            await supabase
              .from("leads_waitlist")
              .update({
                full_name: displayName,
                phone: fullOwnerPhone,
                profile_type: profileType,
                city,
              })
              .eq("email", userEmail);
          }

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
    }, 900);
  };

  return (
    <div className="min-h-screen w-full lg:h-screen lg:overflow-hidden grid grid-cols-1 lg:grid-cols-12 bg-[#FAF9F6]">
      {/* ========================================================================= */}
      {/* COLONNE GAUCHE : Scroll Indépendant & Formulaire d'Onboarding             */}
      {/* ========================================================================= */}
      <div className="lg:col-span-7 xl:col-span-7 2xl:col-span-6 h-full lg:h-screen lg:overflow-y-auto flex flex-col justify-between p-6 sm:p-8 lg:p-10 z-10 bg-[#FAF9F6]">
        {/* Header */}
        <div className="w-full flex items-center justify-between pb-4 border-b border-[#E8E5E0]">
          <Logo size="sm" variant="dark" />
          <span className="text-[12px] font-bold text-[#64635F]">
            Configuration Lokka Bénin 🇧🇯
          </span>
        </div>

        {/* Stepper Progress Bar */}
        <div className="w-full max-w-xl mx-auto my-3">
          <div className="flex items-center justify-between px-2">
            {STEPS.map((s, index) => {
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;

              return (
                <div key={index} className="flex-1 flex flex-col items-center relative">
                  {index > 0 && (
                    <div
                      className={`absolute top-4 -left-1/2 w-full h-[2px] -z-0 transition-colors duration-300 ${
                        index <= currentStep ? "bg-[#1C1C1C]" : "bg-[#E8E5E0]"
                      }`}
                    />
                  )}

                  <div
                    className={`relative z-10 h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300 ${
                      isCompleted
                        ? "bg-[#1C1C1C] text-white shadow-xs"
                        : isCurrent
                        ? "bg-[#1C1C1C] text-white ring-4 ring-[#1C1C1C]/10 shadow-xs"
                        : "bg-[#FAF9F6] text-[#9C9A95] border border-[#E8E5E0]"
                    }`}
                  >
                    {isCompleted ? <CheckIcon className="h-3.5 w-3.5 stroke-[2.5]" /> : index + 1}
                  </div>

                  <span
                    className={`mt-1.5 text-[10.5px] font-medium hidden sm:block ${
                      isCurrent
                        ? "text-[#1C1C1C] font-semibold"
                        : isCompleted
                        ? "text-[#1C1C1C]"
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

        {/* Card Content Form */}
        <div className="w-full max-w-xl mx-auto bg-white border border-[#E8E5E0] rounded-[12px] p-5 sm:p-7 shadow-xs my-2">
          <AnimatePresence mode="wait">
            {/* ========================================================================= */}
            {/* STEP 1: PROFIL & ENCAISSEMENT DES FONDS                                   */}
            {/* ========================================================================= */}
            {currentStep === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF9F6] border border-[#E8E5E0] text-[#1C1C1C] text-[11px] font-bold uppercase tracking-wider mb-2">
                    <BanknotesIcon className="h-3.5 w-3.5" />
                    <span>Étape 1 / 4 · Profil &amp; Encaissement</span>
                  </div>
                  <h1 className="text-[22px] sm:text-[26px] font-extrabold text-[#1C1C1C] tracking-tight">
                    Quel est votre profil de gestion ?
                  </h1>
                  <p className="text-[13px] text-[#64635F]">
                    Lokka configure automatiquement vos règles selon votre activité.
                  </p>
                </div>

                {/* Sélection du Profil (3 Cartes) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {PROFILES.map((p) => {
                    const Icon = p.icon;
                    const isSelected = profileType === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setProfileType(p.id as any)}
                        className={`p-3 text-left rounded-[8px] border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? "bg-[#1C1C1C] text-white border-[#1C1C1C] shadow-xs"
                            : "bg-[#FAF9F6] text-[#1C1C1C] border-[#E8E5E0] hover:bg-white hover:border-[#1C1C1C]"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <Icon className={`h-4 w-4 ${isSelected ? "text-white" : "text-[#1C1C1C]"}`} />
                            <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                              isSelected ? "bg-white/20 text-white" : "bg-[#E8E5E0] text-[#64635F]"
                            }`}>
                              {p.badge}
                            </span>
                          </div>
                          <div className="text-[12px] font-bold mb-0.5">{p.title}</div>
                        </div>
                        <div className={`text-[10.5px] leading-tight ${isSelected ? "text-white/70" : "text-[#64635F]"}`}>
                          {p.subtitle}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Champs conditionnels selon profil */}
                {profileType === "agence" && (
                  <div>
                    <label className="block text-[12px] font-semibold text-[#1C1C1C] mb-1">
                      Nom de l&apos;agence ou raison sociale
                    </label>
                    <input
                      type="text"
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-[#E8E5E0] rounded-[6px] text-[13px] text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C] shadow-xs"
                      placeholder="Ex: Agence Immobilière du Golfe"
                    />
                  </div>
                )}

                {profileType === "diaspora" && (
                  <div>
                    <label className="block text-[12px] font-semibold text-[#1C1C1C] mb-1">
                      Votre pays de résidence actuel
                    </label>
                    <select
                      value={diasporaCountry}
                      onChange={(e) => setDiasporaCountry(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#E8E5E0] rounded-[6px] text-[13px] text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                    >
                      <option value="France">🇫🇷 France</option>
                      <option value="États-Unis">🇺🇸 États-Unis</option>
                      <option value="Canada">🇨🇦 Canada</option>
                      <option value="Côte d'Ivoire">🇨🇮 Côte d&apos;Ivoire</option>
                      <option value="Belgique">🇧🇪 Belgique</option>
                      <option value="Royaume-Uni">🇬🇧 Royaume-Uni</option>
                      <option value="Sénégal">🇸🇳 Sénégal</option>
                      <option value="Autre pays">🌍 Autre pays</option>
                    </select>
                  </div>
                )}

                {/* Ville principale au Bénin */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#1C1C1C] mb-1">
                    Ville principale de vos biens au Bénin
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                    {["Cotonou", "Calavi", "Porto-Novo", "Parakou", "Ouidah"].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => {
                          setCity(v);
                          setIsOtherCity(false);
                        }}
                        className={`py-1.5 px-1 text-center text-[11.5px] font-semibold rounded-[6px] border transition-all cursor-pointer ${
                          city === v && !isOtherCity
                            ? "bg-[#1C1C1C] text-white border-[#1C1C1C] shadow-xs"
                            : "bg-white text-[#64635F] border-[#E8E5E0] hover:border-[#1C1C1C]"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setIsOtherCity(true);
                        setCity("");
                      }}
                      className={`py-1.5 px-1 text-center text-[11.5px] font-semibold rounded-[6px] border transition-all cursor-pointer ${
                        isOtherCity
                          ? "bg-[#1C1C1C] text-white border-[#1C1C1C] shadow-xs"
                          : "bg-white text-[#64635F] border-[#E8E5E0] hover:border-[#1C1C1C]"
                      }`}
                    >
                      Autre
                    </button>
                  </div>
                  {isOtherCity && (
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      autoFocus
                      className="w-full mt-1.5 px-3 py-2 bg-white border border-[#E8E5E0] rounded-[6px] text-[12.5px] text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C] shadow-xs"
                      placeholder="Ex: Abomey, Djougou, Natitingou, Lokossa..."
                    />
                  )}
                </div>

                {/* ================================================================= */}
                {/* CANAUX D'ENCAISSEMENT UNIFIÉS : MOBILE MONEY, BANQUE, ESPÈCES     */}
                {/* ================================================================= */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[12px] font-semibold text-[#1C1C1C]">
                      Canal d&apos;encaissement principal
                    </label>
                    <span className="text-[11px] text-[#64635F]">Quittances certifiées</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {/* 1. Mobile Money */}
                    <div
                      onClick={() => setPaymentChannel("mobile")}
                      className={`p-3 rounded-[8px] border transition-all cursor-pointer flex flex-col justify-between ${
                        paymentChannel === "mobile"
                          ? "bg-white border-[#1C1C1C] ring-2 ring-[#1C1C1C] shadow-xs"
                          : "bg-[#FAF9F6] border-[#E8E5E0] hover:bg-white hover:border-[#1C1C1C]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1">
                          <div className="h-6 px-1.5 rounded-[4px] bg-[#FFCC00] flex items-center justify-center font-black text-black text-[9px] shadow-2xs border border-black/10">
                            MoMo
                          </div>
                          <div className="h-6 px-1.5 rounded-[4px] bg-gradient-to-r from-[#005BAA] to-[#FF7900] flex items-center justify-center font-black text-white text-[9px] shadow-2xs">
                            Moov
                          </div>
                        </div>
                        <div className={`h-3.5 w-3.5 rounded-full border flex items-center justify-center ${
                          paymentChannel === "mobile" ? "border-[#1C1C1C] bg-[#1C1C1C]" : "border-[#E8E5E0]"
                        }`}>
                          {paymentChannel === "mobile" && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                      <div>
                        <div className="text-[12px] font-extrabold text-[#1C1C1C]">Mobile Money</div>
                        <div className="text-[10px] text-[#64635F]">MTN &amp; Moov</div>
                      </div>
                    </div>

                    {/* 2. Virement Bancaire */}
                    <div
                      onClick={() => setPaymentChannel("banque")}
                      className={`p-3 rounded-[8px] border transition-all cursor-pointer flex flex-col justify-between ${
                        paymentChannel === "banque"
                          ? "bg-white border-[#1C1C1C] ring-2 ring-[#1C1C1C] shadow-xs"
                          : "bg-[#FAF9F6] border-[#E8E5E0] hover:bg-white hover:border-[#1C1C1C]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="h-6 w-6 rounded-[4px] bg-[#1C1C1C] flex items-center justify-center text-white shadow-2xs">
                          <BuildingOffice2Icon className="h-3.5 w-3.5" />
                        </div>
                        <div className={`h-3.5 w-3.5 rounded-full border flex items-center justify-center ${
                          paymentChannel === "banque" ? "border-[#1C1C1C] bg-[#1C1C1C]" : "border-[#E8E5E0]"
                        }`}>
                          {paymentChannel === "banque" && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                      <div>
                        <div className="text-[12px] font-extrabold text-[#1C1C1C]">Virement</div>
                        <div className="text-[10px] text-[#64635F]">BOA, Ecobank...</div>
                      </div>
                    </div>

                    {/* 3. Espèces */}
                    <div
                      onClick={() => setPaymentChannel("especes")}
                      className={`p-3 rounded-[8px] border transition-all cursor-pointer flex flex-col justify-between ${
                        paymentChannel === "especes"
                          ? "bg-white border-[#1C1C1C] ring-2 ring-[#1C1C1C] shadow-xs"
                          : "bg-[#FAF9F6] border-[#E8E5E0] hover:bg-white hover:border-[#1C1C1C]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="h-6 w-6 rounded-[4px] bg-[#FAF9F6] border border-[#E8E5E0] flex items-center justify-center text-[#1C1C1C] shadow-2xs">
                          <BanknotesIcon className="h-3.5 w-3.5" />
                        </div>
                        <div className={`h-3.5 w-3.5 rounded-full border flex items-center justify-center ${
                          paymentChannel === "especes" ? "border-[#1C1C1C] bg-[#1C1C1C]" : "border-[#E8E5E0]"
                        }`}>
                          {paymentChannel === "especes" && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                      <div>
                        <div className="text-[12px] font-extrabold text-[#1C1C1C]">Espèces</div>
                        <div className="text-[10px] text-[#64635F]">Reçu de décharge</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ================================================================= */}
                {/* CONFIGURATION DU MOBILE MONEY (MTN / MOOV) AVEC SÉLECTEUR SVG     */}
                {/* ================================================================= */}
                {paymentChannel === "mobile" && (
                  <div className="p-3.5 bg-[#FAF9F6] border border-[#E8E5E0] rounded-[8px] space-y-3">
                    {/* Choix du réseau Mobile Money */}
                    <div>
                      <label className="block text-[11.5px] font-semibold text-[#1C1C1C] mb-1">
                        Réseau Mobile Money utilisé
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setMobileProvider("mtn")}
                          className={`p-2 rounded-[6px] border text-left flex items-center gap-2 transition-all cursor-pointer ${
                            mobileProvider === "mtn"
                              ? "bg-white border-[#1C1C1C] ring-2 ring-[#1C1C1C] shadow-2xs"
                              : "bg-white/60 border-[#E8E5E0] hover:bg-white"
                          }`}
                        >
                          <div className="h-5 px-1.5 rounded bg-[#FFCC00] text-black font-black text-[8.5px] flex items-center justify-center">
                            MoMo
                          </div>
                          <div>
                            <div className="text-[11.5px] font-bold text-[#1C1C1C]">MTN MoMo</div>
                            <div className="text-[9.5px] text-[#64635F]">Mobile Money Bénin</div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setMobileProvider("moov")}
                          className={`p-2 rounded-[6px] border text-left flex items-center gap-2 transition-all cursor-pointer ${
                            mobileProvider === "moov"
                              ? "bg-white border-[#1C1C1C] ring-2 ring-[#1C1C1C] shadow-2xs"
                              : "bg-white/60 border-[#E8E5E0] hover:bg-white"
                          }`}
                        >
                          <div className="h-5 px-1.5 rounded bg-gradient-to-r from-[#005BAA] to-[#FF7900] text-white font-black text-[8.5px] flex items-center justify-center">
                            Moov
                          </div>
                          <div>
                            <div className="text-[11.5px] font-bold text-[#1C1C1C]">Moov Money</div>
                            <div className="text-[9.5px] text-[#64635F]">Flooz Bénin</div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Numéro avec sélecteur international SVG */}
                    <CountryPhoneInput
                      label={`Numéro de compte ${mobileProvider === "mtn" ? "MTN MoMo" : "Moov Money"}`}
                      selectedCountry={ownerCountry}
                      onSelectCountry={setOwnerCountry}
                      phoneNumber={momoNumber}
                      onChangePhone={setMomoNumber}
                      placeholder="97 45 12 89"
                    />
                  </div>
                )}

                {paymentChannel === "banque" && (
                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[12px] font-semibold text-[#1C1C1C] mb-1">
                        Établissement bancaire au Bénin / International
                      </label>
                      <select
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#E8E5E0] rounded-[6px] text-[12.5px] text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                      >
                        <option value="BOA Bénin">BOA Bénin (Bank of Africa)</option>
                        <option value="Ecobank Bénin">Ecobank Bénin</option>
                        <option value="UBA Bénin">UBA Bénin (United Bank for Africa)</option>
                        <option value="Société Générale Bénin">Société Générale Bénin (SGB)</option>
                        <option value="BGFI Bank Bénin">BGFI Bank Bénin</option>
                        <option value="Orabank Bénin">Orabank Bénin</option>
                        <option value="Coris Bank Bénin">Coris Bank International</option>
                        <option value="Banque Internationale / Diaspora">Autre Banque (France, USA, Zone SEPA...)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[12px] font-semibold text-[#1C1C1C] mb-1">
                        Numéro de compte / IBAN / RIB
                      </label>
                      <input
                        type="text"
                        value={bankIban}
                        onChange={(e) => setBankIban(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#E8E5E0] rounded-[6px] text-[12.5px] font-mono text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                        placeholder="BJ66 BJ06 1010 0123 4567 8901 23"
                      />
                    </div>
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="btn-primary py-2 px-5 text-[12.5px] flex items-center gap-1.5 cursor-pointer hover:bg-[#F5F5DC] hover:text-[#1C1C1C] hover:border-[#E8E5E0]"
                  >
                    <span>Continuer vers le logement</span>
                    <ArrowRightIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ========================================================================= */}
            {/* STEP 2: VOTRE 1ER LOGEMENT                                               */}
            {/* ========================================================================= */}
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF9F6] border border-[#E8E5E0] text-[#1C1C1C] text-[11px] font-bold uppercase tracking-wider mb-2">
                    <HomeModernIcon className="h-3.5 w-3.5" />
                    <span>Étape 2 / 4 · Logement</span>
                  </div>
                  <h2 className="text-[22px] sm:text-[26px] font-extrabold text-[#1C1C1C] tracking-tight">
                    Enregistrez votre 1er bien
                  </h2>
                  <p className="text-[13px] text-[#64635F]">
                    Dénomination, loyer mensuel et localisation à {city}.
                  </p>
                </div>

                {profileType === "agence" && (
                  <div>
                    <label className="block text-[12px] font-semibold text-[#1C1C1C] mb-1">
                      Nom du Propriétaire Mandant
                    </label>
                    <input
                      type="text"
                      value={propertyOwnerMandant}
                      onChange={(e) => setPropertyOwnerMandant(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-[#E8E5E0] rounded-[6px] text-[13px] text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C] shadow-xs"
                      placeholder="Ex: M. Dossou Mensah"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[12px] font-semibold text-[#1C1C1C] mb-1">
                    Titre du bien / Résidence
                  </label>
                  <input
                    type="text"
                    value={propertyTitle}
                    onChange={(e) => setPropertyTitle(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-[#E8E5E0] rounded-[6px] text-[13px] text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C] shadow-xs font-semibold"
                    placeholder="Ex: Villa Fidjrossè Plage ou Studio Haie Vive"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "chambre", label: "Chambre" },
                    { id: "maison", label: "Maison" },
                    { id: "appartement", label: "Appartement" },
                    { id: "studio", label: "Studio" },
                    { id: "villa", label: "Villa" },
                    { id: "commercial", label: "Local / Bureau" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setPropertyType(t.id)}
                      className={`py-1.5 px-1 text-center text-[11.5px] font-semibold rounded-[6px] border transition-all cursor-pointer ${
                        propertyType === t.id
                          ? "bg-[#1C1C1C] text-white border-[#1C1C1C] shadow-xs"
                          : "bg-[#FAF9F6] text-[#64635F] border-[#E8E5E0] hover:bg-white"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-[#1C1C1C] mb-1">
                    Adresse ou Quartier à {city}
                  </label>
                  <input
                    type="text"
                    value={propertyAddress}
                    onChange={(e) => setPropertyAddress(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-[#E8E5E0] rounded-[6px] text-[13px] text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C] shadow-xs"
                    placeholder="Ex: Lot 450 Fidjrossè Calvaire, Cotonou"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-[#1C1C1C] mb-1">
                    Loyer mensuel hors charges (FCFA)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={rentAmount}
                      onChange={(e) => setRentAmount(Number(e.target.value))}
                      className="w-full px-3.5 py-2 bg-white border border-[#E8E5E0] rounded-[6px] text-[14px] font-extrabold text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C] shadow-xs"
                    />
                    {profileType === "diaspora" && rentInDiasporaCurrency !== null && (
                      <span className="text-[11px] text-[#1C1C1C] font-semibold mt-1 block">
                        ≈ {rentInDiasporaCurrency.toLocaleString("fr-FR")} {(diasporaCurrency as { symbol: string }).symbol} / mois
                      </span>
                    )}
                    {profileType === "diaspora" && diasporaCurrency === "XOF" && (
                      <span className="text-[11px] text-[#64635F] mt-1 block">
                        Même devise (FCFA) que votre pays de résidence.
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(0)}
                    className="btn-secondary py-2 px-3.5 text-[12px] cursor-pointer"
                  >
                    Retour
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="btn-primary py-2 px-5 text-[12.5px] flex items-center gap-1.5 cursor-pointer hover:bg-[#F5F5DC] hover:text-[#1C1C1C] hover:border-[#E8E5E0]"
                  >
                    <span>Continuer</span>
                    <ArrowRightIcon className="h-3.5 w-3.5" />
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
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF9F6] border border-[#E8E5E0] text-[#1C1C1C] text-[11px] font-bold uppercase tracking-wider mb-2">
                    <ShieldCheckIcon className="h-3.5 w-3.5" />
                    <span>Étape 3 / 4 · Loi n° 2022-30</span>
                  </div>
                  <h2 className="text-[22px] sm:text-[26px] font-extrabold text-[#1C1C1C] tracking-tight">
                    Le locataire &amp; son espace dédié
                  </h2>
                  <p className="text-[13px] text-[#64635F]">
                    Sécurisez la relation locative et activez le portail web du locataire.
                  </p>
                </div>

                {/* Noms */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[12px] font-semibold text-[#1C1C1C] mb-1">
                      Prénom du locataire
                    </label>
                    <input
                      type="text"
                      value={tenantFirstName}
                      onChange={(e) => setTenantFirstName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#E8E5E0] rounded-[6px] text-[12.5px] text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C] shadow-xs"
                      placeholder="Koudjo"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-[#1C1C1C] mb-1">
                      Nom du locataire
                    </label>
                    <input
                      type="text"
                      value={tenantLastName}
                      onChange={(e) => setTenantLastName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#E8E5E0] rounded-[6px] text-[12.5px] text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C] shadow-xs"
                      placeholder="Dossou"
                    />
                  </div>
                </div>

                {/* WhatsApp avec sélecteur de pays SVG */}
                <CountryPhoneInput
                  label="Numéro WhatsApp du locataire (quittances & rappels)"
                  selectedCountry={tenantCountry}
                  onSelectCountry={setTenantCountry}
                  phoneNumber={tenantWhatsApp}
                  onChangePhone={setTenantWhatsApp}
                  placeholder="97 11 22 33"
                />

                {/* Caution légale */}
                <div className="p-3 bg-[#FAF9F6] border border-[#E8E5E0] rounded-[8px] space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11.5px] font-bold text-[#1C1C1C]">
                      Caution légale (Dépôt de garantie) :
                    </label>
                    <span className="text-[12px] font-bold text-[#1C1C1C]">
                      {depositAmount.toLocaleString("fr-FR")} FCFA ({depositMonths} mois)
                    </span>
                  </div>

                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setDepositMonths(m)}
                        className={`flex-1 py-1 text-[11px] font-bold rounded-[4px] border transition-all cursor-pointer ${
                          depositMonths === m
                            ? m <= 3
                              ? "bg-[#1C1C1C] text-white border-[#1C1C1C]"
                              : "bg-red-600 text-white border-red-600"
                            : "bg-white text-[#64635F] border-[#E8E5E0]"
                        }`}
                      >
                        {m} {m === 1 ? "mois" : "mois"} {m === 3 && "(Max)"}
                      </button>
                    ))}
                  </div>

                  {isDepositCompliant ? (
                    <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-[#1C1C1C]">
                      <CheckCircleIcon className="h-3.5 w-3.5 shrink-0" />
                      <span>Conforme Loi n° 2022-30 (3 mois max).</span>
                    </div>
                  ) : (
                    <div className="text-[10.5px] text-red-600 font-semibold">
                      ⚠️ La Loi n° 2022-30 limite la caution à 3 mois max.
                    </div>
                  )}
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="btn-secondary py-2 px-3.5 text-[12px] cursor-pointer"
                  >
                    Retour
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="btn-primary py-2 px-5 text-[12.5px] flex items-center gap-1.5 cursor-pointer hover:bg-[#F5F5DC] hover:text-[#1C1C1C] hover:border-[#E8E5E0]"
                  >
                    <span>Continuer</span>
                    <ArrowRightIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ========================================================================= */}
            {/* STEP 4: FINALISATION & PRÊT POUR LE DASHBOARD                             */}
            {/* ========================================================================= */}
            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF9F6] border border-[#E8E5E0] text-[#1C1C1C] text-[11px] font-bold uppercase tracking-wider mb-2">
                    <SparklesIcon className="h-3.5 w-3.5" />
                    <span>Étape 4 / 4 · Prêt pour le Dashboard</span>
                  </div>
                  <h2 className="text-[22px] sm:text-[26px] font-extrabold text-[#1C1C1C] tracking-tight">
                    Vos services sont activés !
                  </h2>
                  <p className="text-[13px] text-[#64635F]">
                    Modules automatiques prêts pour votre tranquillité.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="p-3 bg-[#FAF9F6] border border-[#E8E5E0] rounded-[6px] flex items-center justify-between">
                    <div>
                      <div className="text-[12.5px] font-bold text-[#1C1C1C]">Quittances PDF automatiques</div>
                      <div className="text-[10.5px] text-[#64635F]">Dès encaissement MoMo / Moov</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={autoReceipts}
                      onChange={(e) => setAutoReceipts(e.target.checked)}
                      className="h-4 w-4 rounded border-[#E8E5E0] text-[#1C1C1C] focus:ring-0 cursor-pointer"
                    />
                  </div>

                  <div className="p-3 bg-[#FAF9F6] border border-[#E8E5E0] rounded-[6px] flex items-center justify-between">
                    <div>
                      <div className="text-[12.5px] font-bold text-[#1C1C1C]">Site Vitrine Public</div>
                      <div className="text-[10.5px] text-[#64635F]">Lien d&apos;agence ou bailleur actif</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={enableShowcase}
                      onChange={(e) => setEnableShowcase(e.target.checked)}
                      className="h-4 w-4 rounded border-[#E8E5E0] text-[#1C1C1C] focus:ring-0 cursor-pointer"
                    />
                  </div>

                  <div className="p-3 bg-[#FAF9F6] border border-[#E8E5E0] rounded-[6px] flex items-center justify-between">
                    <div>
                      <div className="text-[12.5px] font-bold text-[#1C1C1C]">Rappels WhatsApp automatiques</div>
                      <div className="text-[10.5px] text-[#64635F]">Rappel poli à J+5 si retard</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={whatsappReminders}
                      onChange={(e) => setWhatsappReminders(e.target.checked)}
                      className="h-4 w-4 rounded border-[#E8E5E0] text-[#1C1C1C] focus:ring-0 cursor-pointer"
                    />
                  </div>

                  <div className="p-3 bg-[#FAF9F6] border border-[#E8E5E0] rounded-[6px] flex items-center justify-between">
                    <div>
                      <div className="text-[12.5px] font-bold text-[#1C1C1C]">Calculateur fiscal TFU Bénin</div>
                      <div className="text-[10.5px] text-[#64635F]">Bilan annuel pour la DGI</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={tfuTracking}
                      onChange={(e) => setTfuTracking(e.target.checked)}
                      className="h-4 w-4 rounded border-[#E8E5E0] text-[#1C1C1C] focus:ring-0 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="btn-secondary py-2 px-3.5 text-[12px] cursor-pointer"
                  >
                    Retour
                  </button>
                  <button
                    type="button"
                    disabled={isFinalizing}
                    onClick={handleFinishOnboarding}
                    className="btn-primary py-2.5 px-6 text-[13px] flex items-center gap-1.5 cursor-pointer shadow-md hover:bg-[#F5F5DC] hover:text-[#1C1C1C] hover:border-[#E8E5E0]"
                  >
                    <span>{isFinalizing ? "Accès au tableau de bord..." : "Ouvrir mon Tableau de Bord 🚀"}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="pt-4 border-t border-[#E8E5E0]/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#9C9A95]">
          <span>© 2026 Lokka. Fait pour le Bénin 🇧🇯</span>
          <span>Conforme à la Loi n° 2022-30 sur les baux</span>
        </footer>
      </div>

      {/* ========================================================================= */}
      {/* COLONNE DROITE : Vidéo Immersive Fixée (Comme sur les pages de connexion) */}
      {/* ========================================================================= */}
      <div className="hidden lg:block lg:col-span-5 xl:col-span-5 2xl:col-span-6 h-screen sticky top-0 relative bg-[#1C1C1C] overflow-hidden">
        {/* Full-Bleed Sticky Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-90 scale-[1.02]"
          src="/videos/login.mp4"
        />

        {/* Subtle Bottom Vignette with Elegant Caption */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none flex flex-col justify-end p-10 xl:p-12 text-white">
          <div className="max-w-md">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold uppercase tracking-wider mb-3">
              <SparklesIcon className="h-3.5 w-3.5" />
              <span>Patrimoine &amp; Gestion Sécurisée</span>
            </div>
            <h3 className="text-[22px] xl:text-[26px] font-extrabold tracking-tight leading-snug mb-2 font-serif italic text-white">
              « Votre patrimoine immobilier, enfin sous contrôle et certifié. »
            </h3>
            <p className="text-[12.5px] text-white/70 leading-relaxed">
              Rejoignez plus de 100 bailleurs et gestionnaires au Bénin et dans la diaspora qui automatisent leurs encaissements MoMo et quittances légales.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center text-sm font-semibold">Chargement de votre espace...</div>}>
      <OnboardingContent />
    </Suspense>
  );
}
