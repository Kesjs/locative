import React, { useRef, useState } from "react";
import { type ProfilStepData } from "../_types";
import { ProfileCard } from "./ProfileCard";
import { cn } from "@/lib/utils";
import {
  Home,
  Building2,
  Smartphone,
  Landmark,
  ShieldCheck,
  Check,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Trash2,
  Link as LinkIcon,
  Briefcase,
} from "lucide-react";
import { toast } from "sonner";

const PRESET_LOGOS = [
  {
    id: "blue-modern",
    name: "Bleu Cobalt",
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%231E40AF'/><path d='M25 72V38l25-18 25 18v34H60V52H40v20H25z' fill='white'/><circle cx='50' cy='32' r='5' fill='%2360A5FA'/></svg>",
  },
  {
    id: "emerald-prestige",
    name: "Émeraude Prestige",
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%23065F46'/><path d='M30 75h40V35l-20-15-20 15v40z' fill='none' stroke='white' stroke-width='6'/><path d='M42 75V55h16v20' fill='%2334D399'/><circle cx='50' cy='42' r='4' fill='white'/></svg>",
  },
  {
    id: "gold-luxury",
    name: "Or & Carbone",
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%230F172A'/><polygon points='50,20 80,45 80,80 20,80 20,45' fill='none' stroke='%23F59E0B' stroke-width='6'/><path d='M42 80V56h16v24' fill='%23F59E0B'/><path d='M50 20v60' stroke='%23F59E0B' stroke-width='2' stroke-dasharray='4'/></svg>",
  },
  {
    id: "purple-horizon",
    name: "Violet Royal",
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%234C1D95'/><rect x='28' y='32' width='44' height='48' rx='4' fill='none' stroke='white' stroke-width='5'/><rect x='36' y='40' width='8' height='10' rx='1' fill='%23C084FC'/><rect x='56' y='40' width='8' height='10' rx='1' fill='%23C084FC'/><rect x='36' y='56' width='8' height='10' rx='1' fill='%23C084FC'/><rect x='56' y='56' width='8' height='10' rx='1' fill='%23C084FC'/><polygon points='24,32 50,15 76,32' fill='%23A855F7'/></svg>",
  },
];

interface StepProfilProps {
  data: ProfilStepData;
  onChange: (data: ProfilStepData) => void;
  error?: string;
}

/** Pill-style toggle buttons */
function BrandedToggleGroup({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string; icon?: React.ElementType }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 border border-slate-200 rounded-2xl">
      {options.map((opt) => {
        const isSelected = value === opt.value;
        const Icon = opt.icon;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex items-center justify-center gap-2 py-2.5 px-3 text-[13px] font-bold rounded-xl transition-all duration-200 cursor-pointer",
              isSelected
                ? "bg-white text-slate-900 shadow-2xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            {Icon && <Icon className="w-4 h-4" />}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function StepProfil({ data, onChange, error }: StepProfilProps) {
  const updateData = (updates: Partial<ProfilStepData>) => {
    onChange({ ...data, ...updates });
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 2 Mo.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        updateData({ logo_url: event.target.result as string });
        toast.success("Logo chargé avec succès !");
      }
    };
    reader.readAsDataURL(file);
  };

  const isAgency = data.profileType === "agence";

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Étape 1 sur 2
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            Profil &amp; Perception
          </span>
        </div>
        <h2 className="text-[22px] sm:text-[25px] font-extrabold text-slate-900 tracking-tight">
          Quel est votre statut d'activité ?
        </h2>
        <p className="text-[13px] text-slate-600 mt-1">
          Lokka adapte son interface, ses calculs de commissions et ses baux légaux à votre métier.
        </p>
      </div>

      {/* Cartes de sélection de Profil */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <ProfileCard
          id="bailleur"
          title="Bailleur Privé"
          subtitle="Je gère mon propre patrimoine immobilier en direct"
          badge="Direct"
          icon={Home}
          isSelected={data.profileType === "bailleur"}
          onSelect={(id) => updateData({ profileType: id })}
        />
        <ProfileCard
          id="agence"
          title="Agence & Cabinet"
          subtitle="Je gère des mandats de location pour le compte de tiers"
          badge="Loi 2022-30 (10%)"
          icon={Building2}
          isSelected={data.profileType === "agence"}
          onSelect={(id) => updateData({ profileType: id })}
        />
      </div>

      {/* Bannière d'encadrement légal pour l'agence */}
      {isAgency && (
        <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-[12px]">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
          <div className="leading-snug">
            <span className="font-bold">Cadre légal Loi n° 2022-30 :</span> Vos mandats et reversements seront automatiquement plafonnés au barème officiel de 10% d'honoraires.
          </div>
        </div>
      )}

      {/* Nom ou Raison Sociale */}
      <div className="space-y-1.5">
        <label htmlFor="onboarding-nom" className="text-[13px] font-bold text-slate-900 block">
          {isAgency ? "Raison sociale du cabinet ou de l'agence" : "Votre nom complet"}
          <span className="text-rose-500 ml-1">*</span>
        </label>
        <input
          id="onboarding-nom"
          type="text"
          autoComplete="name"
          value={data.nom}
          onChange={(e) => updateData({ nom: e.target.value })}
          placeholder={
            isAgency
              ? "Ex: Cabinet Immobilier du Golfe, Agence Bénin Prestige"
              : "Ex: Koudjo Dossou, Claudine Mensah"
          }
          className={cn(
            "w-full px-3.5 py-2.5 bg-white border rounded-xl text-[13.5px] text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all shadow-2xs",
            error
              ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15"
              : "border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
          )}
        />
        {error && (
          <p className="text-[11.5px] text-rose-600 font-medium">{error}</p>
        )}
      </div>

      {/* ─── PERSONNALISATION DU LOGO (BAILLEUR & AGENCE) ─── */}
      <div className="space-y-3 p-4 bg-slate-50/80 border border-slate-200/90 rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5 text-[13px] font-bold text-slate-900">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Logo ou Emblème de marque</span>
              <span className="text-[11px] font-normal text-slate-500">(Optionnel)</span>
            </div>
            <p className="text-[11.5px] text-slate-600 mt-0.5">
              S&apos;affichera automatiquement dans la <strong>barre latérale</strong> de votre cockpit et en tête de vos quittances officielles.
            </p>
          </div>

          {data.logo_url && (
            <button
              type="button"
              onClick={() => {
                updateData({ logo_url: "" });
                toast.info("Logo retiré");
              }}
              className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-rose-600 hover:text-rose-700 cursor-pointer self-start sm:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Supprimer</span>
            </button>
          )}
        </div>

        {/* Aperçu Mockup Barre Latérale & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-1">
          {/* Mockup d'en-tête Sidebar */}
          <div className="flex items-center gap-2.5 p-2.5 bg-white border border-slate-200 rounded-xl shadow-2xs min-w-[220px]">
            <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
              {data.logo_url ? (
                <img src={data.logo_url} alt="Logo" className="w-full h-full object-contain p-0.5" />
              ) : isAgency ? (
                <Briefcase className="w-4 h-4 text-blue-600" />
              ) : (
                <Building2 className="w-4 h-4 text-emerald-600" />
              )}
            </div>
            <div className="overflow-hidden">
              <p className="text-[12.5px] font-bold text-slate-900 truncate leading-tight">
                {data.nom || (isAgency ? "Votre Cabinet" : "Votre Nom")}
              </p>
              <p className="text-[10px] text-slate-500 font-medium truncate">
                {isAgency ? "Cabinet Agréé 🇧🇯" : "Patrimoine Privé"}
              </p>
            </div>
          </div>

          {/* Boutons d'Action Upload / URL */}
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              className="hidden"
              onChange={handleFileChange}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[12px] rounded-xl shadow-2xs transition cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Importer une image</span>
            </button>

            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-[12px] rounded-xl border border-slate-200 shadow-2xs transition cursor-pointer"
            >
              <LinkIcon className="w-3.5 h-3.5 text-slate-500" />
              <span>{showUrlInput ? "Masquer URL" : "Lien URL"}</span>
            </button>
          </div>
        </div>

        {/* Champ URL si activé */}
        {showUrlInput && (
          <div className="pt-2 animate-in fade-in duration-150">
            <input
              type="url"
              value={data.logo_url || ""}
              onChange={(e) => updateData({ logo_url: e.target.value })}
              placeholder="https://votre-domaine.com/logo.png"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-[12px] font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10"
            />
          </div>
        )}

        {/* Bibliothèque d'emblèmes prêts en 1 clic */}
        <div className="pt-2 border-t border-slate-200/60">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-slate-500">
              Ou choisissez un emblème prêt à l&apos;emploi :
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESET_LOGOS.map((preset) => {
              const isSelected = data.logo_url === preset.url;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    updateData({ logo_url: preset.url });
                    toast.success(`Emblème "${preset.name}" appliqué !`);
                  }}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-xl border text-left transition cursor-pointer",
                    isSelected
                      ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  )}
                >
                  <img src={preset.url} alt={preset.name} className="w-7 h-7 rounded-md object-contain shrink-0" />
                  <span className="text-[11px] font-bold text-slate-800 truncate">{preset.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Moyen de réception des fonds privilégié */}
      <div className="space-y-2">
        <label className="text-[13px] font-bold text-slate-900 block">
          Moyen de réception des loyers privilégié
        </label>
        <BrandedToggleGroup
          value={data.moyenReception}
          onChange={(v) =>
            updateData({
              moyenReception: v as "mobile_money" | "banque",
              mobileProvider: v === "mobile_money" ? "mtn" : undefined,
            })
          }
          options={[
            { value: "mobile_money", label: "Mobile Money", icon: Smartphone },
            { value: "banque", label: "Virement Bancaire", icon: Landmark },
          ]}
        />
      </div>

      {/* Opérateur Mobile Money avec design soigné */}
      {data.moyenReception === "mobile_money" && (
        <div className="space-y-2 animate-in fade-in-50 duration-200">
          <label className="text-[12.5px] font-semibold text-slate-900 block">
            Réseau Mobile Money principal
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "mtn", label: "MTN MoMo" },
              { id: "moov", label: "Moov Money" },
              { id: "celtiis", label: "Celtiis Cash" },
            ].map((prov) => {
              const active = data.mobileProvider === prov.id;
              return (
                <button
                  key={prov.id}
                  type="button"
                  onClick={() => updateData({ mobileProvider: prov.id as any })}
                  className={cn(
                    "py-2.5 px-2 text-[12px] font-bold rounded-xl border transition-all text-center cursor-pointer",
                    active
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs ring-1 ring-emerald-500/30"
                      : "bg-white text-slate-700 border-slate-200 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  {prov.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Carte explicative dynamique de la formule choisie */}
      {!isAgency ? (
        <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/90 rounded-xl space-y-1.5 text-[12.5px]">
          <div className="flex items-center gap-2 font-bold text-emerald-800">
            <Check className="w-4 h-4 text-emerald-600 stroke-[3] shrink-0" />
            <span>Spécificités du parcours Bailleur Direct :</span>
          </div>
          <ul className="space-y-1 pl-6 text-[12px] text-slate-600 list-disc">
            <li><strong>100% de vos loyers</strong> encaissés sans commission ni intermédiaire.</li>
            <li><strong>Quittances officielles conformes</strong> à la Loi n° 2022-30 générées en 1 clic.</li>
            <li><strong>Cockpit patrimonial direct</strong> : suivi de vos logements, locataires et impayés.</li>
          </ul>
        </div>
      ) : (
        <div className="p-3.5 bg-blue-50/70 border border-blue-200/90 rounded-xl space-y-1.5 text-[12.5px]">
          <div className="flex items-center gap-2 font-bold text-blue-900">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Spécificités du parcours Agence & Mandats :</span>
          </div>
          <ul className="space-y-1 pl-6 text-[12px] text-slate-600 list-disc">
            <li><strong>Plafonnement légal à 10%</strong> d'honoraires de gestion (Loi 2022-30 Bénin).</li>
            <li><strong>Reversements mandants (90%)</strong> calculés et tracés automatiquement.</li>
            <li><strong>Cockpit multi-propriétaires</strong> : gestion des contrats de mandat et CRG.</li>
          </ul>
        </div>
      )}
    </div>
  );
}
