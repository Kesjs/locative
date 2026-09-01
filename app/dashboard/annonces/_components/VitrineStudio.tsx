"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import {
  PaintBrushIcon,
  GlobeAltIcon,
  PhoneIcon,
  CheckCircleIcon,
  DevicePhoneMobileIcon,
  DeviceTabletIcon,
  ComputerDesktopIcon,
  MapPinIcon,
  EyeIcon,
  ShieldCheckIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";

type DeviceViewport = "mobile" | "tablet" | "desktop";

export function VitrineStudio() {
  const [isSaving, setIsSaving] = useState(false);
  const [viewport, setViewport] = useState<DeviceViewport>("mobile");

  // Studio Customizer state
  const [studioState, setStudioState] = useState({
    siteName: "Résidences Alexandre K.",
    slug: "alexandre-patrimoine",
    slogan: "Trouvez votre prochain logement de standing à Cotonou & Calavi",
    accentColor: "emerald",
    themeArchetype: "standing",
    whatsappContact: "+229 97 00 11 22",
    visitFee: 3000,
    showLawBadge: true,
    showVisitFee: true,
  });

  const ACCENT_COLORS = [
    { id: "emerald", label: "Émeraude Lokka", hex: "#087F5B", bgClass: "bg-[#087F5B]" },
    { id: "gold", label: "Or & Champagne", hex: "#C5A880", bgClass: "bg-[#C5A880]" },
    { id: "blue", label: "Bleu Océan", hex: "#2563EB", bgClass: "bg-[#2563EB]" },
    { id: "dark", label: "Noir Élégance", hex: "#0F172A", bgClass: "bg-[#0F172A]" },
  ];

  const THEMES = [
    {
      id: "standing",
      name: "Standing & Villas",
      desc: "Idéal pour villas Fidjrossè et résidences haut standing",
      badge: "Recommandé",
    },
    {
      id: "modern",
      name: "Urbain & Meublés",
      desc: "Accent sur la technologie, fibre optique et compteurs SBEE",
      badge: "Populaire",
    },
    {
      id: "minimal",
      name: "Épuré & Transparent",
      desc: "Focus sur la clarté des prix FCFA et la Loi 2022-30",
      badge: "Minimal",
    },
  ];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Personnalisation de la vitrine enregistrée !");
    }, 700);
  };

  const activeColor = ACCENT_COLORS.find((c) => c.id === studioState.accentColor) || ACCENT_COLORS[0];

  return (
    <div className="space-y-8">
      {/* Viewport Switcher Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-3.5 rounded-xl shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-[12.5px] font-bold text-foreground">Format de Prévisualisation :</span>
          <div className="inline-flex bg-muted p-1 rounded-lg border border-border gap-1">
            <button
              type="button"
              onClick={() => setViewport("mobile")}
              className={`px-3 py-1.5 text-[12px] font-bold rounded-md transition flex items-center gap-1.5 cursor-pointer ${
                viewport === "mobile"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <DevicePhoneMobileIcon className="w-4 h-4" />
              <span>Mobile (360px)</span>
            </button>
            <button
              type="button"
              onClick={() => setViewport("tablet")}
              className={`px-3 py-1.5 text-[12px] font-bold rounded-md transition flex items-center gap-1.5 cursor-pointer ${
                viewport === "tablet"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <DeviceTabletIcon className="w-4 h-4" />
              <span>Tablette (640px)</span>
            </button>
            <button
              type="button"
              onClick={() => setViewport("desktop")}
              className={`px-3 py-1.5 text-[12px] font-bold rounded-md transition flex items-center gap-1.5 cursor-pointer ${
                viewport === "desktop"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ComputerDesktopIcon className="w-4 h-4" />
              <span>Desktop (Grand écran)</span>
            </button>
          </div>
        </div>

        <a
          href="/p/patrimoine-lokka"
          target="_blank"
          rel="noreferrer"
          className="text-[12px] text-primary font-bold hover:underline inline-flex items-center gap-1 self-end sm:self-auto"
        >
          <span>Ouvrir dans un nouvel onglet</span>
          <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className={`grid gap-8 ${viewport === "desktop" ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-12"}`}>
        
        {/* Colonne Formulaire Studio */}
        <div className={viewport === "desktop" ? "w-full space-y-6" : "lg:col-span-6 space-y-6"}>
          
          {/* Section 1 : Thème & Ambiance */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-foreground font-bold text-[14.5px]">
              <PaintBrushIcon className="w-4 h-4 text-primary" />
              <span>1. Thème &amp; Ambiance Visuelle</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {THEMES.map((th) => (
                <div
                  key={th.id}
                  onClick={() => setStudioState({ ...studioState, themeArchetype: th.id })}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                    studioState.themeArchetype === th.id
                      ? "border-primary bg-primary/5 shadow-xs"
                      : "border-border bg-muted/30 hover:bg-muted/60"
                  }`}
                >
                  <div>
                    <span className="font-bold text-[13px] text-foreground block mb-1">{th.name}</span>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{th.desc}</p>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="text-[9.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-card border border-border text-foreground">
                      {th.badge}
                    </span>
                    {studioState.themeArchetype === th.id && (
                      <CheckCircleIcon className="w-4 h-4 text-primary" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2 : Identité & Couleurs */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-foreground font-bold text-[14.5px]">
              <GlobeAltIcon className="w-4 h-4 text-primary" />
              <span>2. Identité &amp; Adresse Web</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">
                  Nom commercial de la vitrine
                </label>
                <input
                  type="text"
                  value={studioState.siteName}
                  onChange={(e) => setStudioState({ ...studioState, siteName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-[13px] text-foreground outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">
                  Lien court fourni (lokka.bj/p/...)
                </label>
                <div className="flex items-center border border-border rounded-lg overflow-hidden bg-background">
                  <span className="px-2.5 py-2 bg-muted text-[11px] font-mono text-muted-foreground border-r border-border">
                    lokka.bj/p/
                  </span>
                  <input
                    type="text"
                    value={studioState.slug}
                    onChange={(e) => setStudioState({ ...studioState, slug: e.target.value })}
                    className="flex-1 px-3 py-2 text-[13px] font-medium outline-none"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">
                  Slogan / Titre d&apos;accueil
                </label>
                <input
                  type="text"
                  value={studioState.slogan}
                  onChange={(e) => setStudioState({ ...studioState, slogan: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-[13px] text-foreground outline-none focus:border-primary"
                />
              </div>

              {/* Accent Color Palette */}
              <div className="sm:col-span-2 space-y-2">
                <label className="block text-[11px] font-bold text-muted-foreground uppercase">
                  Couleur d&apos;accentuation principale
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  {ACCENT_COLORS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setStudioState({ ...studioState, accentColor: c.id })}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[12px] font-bold transition cursor-pointer ${
                        studioState.accentColor === c.id
                          ? "border-primary bg-primary/10 text-foreground ring-2 ring-primary/20"
                          : "border-border bg-card text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full ${c.bgClass}`} />
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3 : Contact & Visites */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-foreground font-bold text-[14.5px]">
              <PhoneIcon className="w-4 h-4 text-primary" />
              <span>3. Contact WhatsApp &amp; Frais de Visite</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">
                  Numéro WhatsApp (+229)
                </label>
                <input
                  type="text"
                  value={studioState.whatsappContact}
                  onChange={(e) => setStudioState({ ...studioState, whatsappContact: e.target.value })}
                  className="w-full px-3.5 py-2 bg-background border border-border rounded-lg text-[13px] font-mono text-foreground outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">
                  Frais de visite (FCFA)
                </label>
                <input
                  type="number"
                  step="500"
                  value={studioState.visitFee}
                  onChange={(e) => setStudioState({ ...studioState, visitFee: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 bg-background border border-border rounded-lg text-[13px] font-mono text-foreground outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                disabled={isSaving}
                onClick={handleSave}
                className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-[13px] font-bold rounded-lg transition shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? "Enregistrement..." : "Enregistrer la personnalisation"}
              </button>
            </div>
          </div>
        </div>

        {/* Colonne Mockup Preview Multi-Viewport */}
        <div className={viewport === "desktop" ? "w-full flex flex-col items-center" : "lg:col-span-6 flex flex-col items-center"}>
          
          {/* Container dynamically sizing according to viewport */}
          <div
            className={`border-[6px] border-[#0F172A] bg-white shadow-2xl overflow-hidden flex flex-col text-[12px] transition-all duration-300 ${
              viewport === "mobile"
                ? "w-[330px] rounded-[36px]"
                : viewport === "tablet"
                ? "w-[540px] rounded-[28px]"
                : "w-full max-w-4xl rounded-2xl"
            }`}
          >
            {/* Top Bar for Mobile/Tablet or Browser Tab for Desktop */}
            {viewport === "desktop" ? (
              <div className="h-8 bg-[#0F172A] flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <span className="text-[11px] text-white/70 font-mono ml-3">
                  https://lokka.bj/p/{studioState.slug}
                </span>
              </div>
            ) : (
              <div className="h-5 bg-[#0F172A] flex items-center justify-center">
                <div className="w-16 h-2.5 bg-[#1C1C1C] rounded-full" />
              </div>
            )}

            {/* Inner Showcase Render */}
            <div className="flex-1 overflow-y-auto max-h-[580px] p-4 space-y-4 bg-[#FAF9F6]">
              
              {/* Header */}
              <div className="bg-white p-3.5 rounded-xl border border-[#E8E5E0] shadow-2xs flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-full text-white font-extrabold text-[12px] flex items-center justify-center shadow-xs"
                    style={{ backgroundColor: activeColor.hex }}
                  >
                    AK
                  </div>
                  <div>
                    <span className="font-extrabold text-[13px] block leading-tight text-[#0F172A]">
                      {studioState.siteName}
                    </span>
                    <span className="text-[9.5px] font-bold text-[#087F5B]">Loi 2022-30 🇧🇯</span>
                  </div>
                </div>
                <span className="text-[10px] bg-[#25D366] text-white px-2.5 py-1 rounded-full font-bold">
                  WhatsApp Direct
                </span>
              </div>

              {/* Slogan Banner */}
              <div className="text-center py-3 space-y-1 bg-white rounded-xl border border-[#E8E5E0] p-4">
                <span className="text-[10px] font-bold uppercase bg-[#E6F5EF] text-[#087F5B] px-2.5 py-0.5 rounded-full">
                  Catalogue Officiel · Cotonou
                </span>
                <h4 className="font-extrabold text-[15px] text-[#0F172A] leading-snug">
                  {studioState.slogan}
                </h4>
              </div>

              {/* Properties Grid in Preview */}
              <div className={`grid gap-3.5 ${viewport === "desktop" ? "grid-cols-3" : viewport === "tablet" ? "grid-cols-2" : "grid-cols-1"}`}>
                
                {/* Card 1 */}
                <div className="bg-white rounded-xl border border-[#E8E5E0] overflow-hidden shadow-2xs space-y-2 pb-3">
                  <div className="h-32 bg-muted relative">
                    <img
                      src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&q=80"
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <span
                      className="absolute top-2 left-2 text-white text-[9.5px] font-bold px-2 py-0.5 rounded-full shadow-xs"
                      style={{ backgroundColor: activeColor.hex }}
                    >
                      Villa 5P
                    </span>
                  </div>
                  <div className="px-3 space-y-1">
                    <p className="font-bold text-[12.5px] text-[#0F172A] m-0 truncate">
                      Villa Standing Fidjrossè
                    </p>
                    <p className="text-[10.5px] text-[#64635F] m-0">📍 Fidjrossè Calvaire, Cotonou</p>
                    <div className="flex items-center justify-between pt-1.5 border-t border-[#F0EDE8]">
                      <span className="font-extrabold text-[13px]" style={{ color: activeColor.hex }}>
                        350 000 F <span className="text-[9px] font-normal text-[#64635F]">/ mois</span>
                      </span>
                      <span className="text-[10px] bg-[#0F172A] text-white px-2.5 py-1 rounded font-bold">
                        Visiter
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white rounded-xl border border-[#E8E5E0] overflow-hidden shadow-2xs space-y-2 pb-3">
                  <div className="h-32 bg-muted relative">
                    <img
                      src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&q=80"
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <span
                      className="absolute top-2 left-2 text-white text-[9.5px] font-bold px-2 py-0.5 rounded-full shadow-xs"
                      style={{ backgroundColor: activeColor.hex }}
                    >
                      Studio Meublé
                    </span>
                  </div>
                  <div className="px-3 space-y-1">
                    <p className="font-bold text-[12.5px] text-[#0F172A] m-0 truncate">
                      Studio Moderne Haie Vive
                    </p>
                    <p className="text-[10.5px] text-[#64635F] m-0">📍 Haie Vive, Cotonou</p>
                    <div className="flex items-center justify-between pt-1.5 border-t border-[#F0EDE8]">
                      <span className="font-extrabold text-[13px]" style={{ color: activeColor.hex }}>
                        120 000 F <span className="text-[9px] font-normal text-[#64635F]">/ mois</span>
                      </span>
                      <span className="text-[10px] bg-[#0F172A] text-white px-2.5 py-1 rounded font-bold">
                        Visiter
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card 3 (visible on desktop) */}
                <div className="bg-white rounded-xl border border-[#E8E5E0] overflow-hidden shadow-2xs space-y-2 pb-3">
                  <div className="h-32 bg-muted relative">
                    <img
                      src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&q=80"
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <span
                      className="absolute top-2 left-2 text-white text-[9.5px] font-bold px-2 py-0.5 rounded-full shadow-xs"
                      style={{ backgroundColor: activeColor.hex }}
                    >
                      Appartement 3P
                    </span>
                  </div>
                  <div className="px-3 space-y-1">
                    <p className="font-bold text-[12.5px] text-[#0F172A] m-0 truncate">
                      Appartement Standing Ganhi
                    </p>
                    <p className="text-[10.5px] text-[#64635F] m-0">📍 Boulevard de la Marina</p>
                    <div className="flex items-center justify-between pt-1.5 border-t border-[#F0EDE8]">
                      <span className="font-extrabold text-[13px]" style={{ color: activeColor.hex }}>
                        220 000 F <span className="text-[9px] font-normal text-[#64635F]">/ mois</span>
                      </span>
                      <span className="text-[10px] bg-[#0F172A] text-white px-2.5 py-1 rounded font-bold">
                        Visiter
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Bar */}
            {viewport !== "desktop" && (
              <div className="h-4 bg-[#0F172A] flex items-center justify-center">
                <div className="w-24 h-1 bg-white/40 rounded-full" />
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
