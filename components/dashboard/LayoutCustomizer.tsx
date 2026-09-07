"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useSidebar,
  SidebarVariant,
  LayoutMode,
  ColorTheme,
  ThemeMode,
  COLOR_THEMES,
} from "@/components/ui/sidebar";
import {
  X,
  Sun,
  Moon,
  Laptop,
  Check,
  RotateCcw,
  Eye,
  EyeOff,
  Sliders,
  Palette,
  Layout,
  Layers,
  Building2,
  ShieldCheck,
  Coins,
  Monitor,
  Maximize2,
  Minimize2,
  PanelLeftClose,
  PanelLeft,
  Sparkles,
} from "lucide-react";
import { ACCENT_PRESETS } from "@/lib/theme/color-utils";
import { toast } from "@/components/ui/toast";

interface LayoutCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LayoutCustomizer({ isOpen, onClose }: LayoutCustomizerProps) {
  const {
    open: isSidebarOpen,
    setOpen: setSidebarOpen,
    state: sidebarState,
    variant: sidebarVariant,
    setVariant,
    layoutMode,
    setLayoutMode,
    navLayout,
    setNavLayout,
    theme,
    setTheme,
    colorTheme,
    setColorTheme,
    customColorHex,
    setCustomColorHex,
    isPrivacyMode,
    togglePrivacyMode,
    density,
    setDensity,
  } = useSidebar();

  // Onglet actif pour navigation rapide
  const [activeTab, setActiveTab] = React.useState<"all" | "modes" | "theme" | "display">("all");

  const activeHex =
    colorTheme === "custom"
      ? customColorHex
      : COLOR_THEMES[colorTheme]?.hex ?? "#10B981";

  // Déterminer le mode actuel de la barre latérale parmi les 3 modes phares
  const currentSidebarMode = React.useMemo<"full" | "compact" | "floating">(() => {
    if (sidebarVariant === "floating") return "floating";
    if (sidebarState === "collapsed" || !isSidebarOpen) return "compact";
    return "full";
  }, [sidebarVariant, sidebarState, isSidebarOpen]);

  const handleSelectSidebarMode = (mode: "full" | "compact" | "floating") => {
    if (mode === "full") {
      setVariant("sidebar");
      setLayoutMode("push");
      setSidebarOpen(true);
      toast.success("Mode Plein activé", { description: "Barre latérale complète dépliée." });
    } else if (mode === "compact") {
      setVariant("sidebar");
      setLayoutMode("push");
      setSidebarOpen(false);
      toast.success("Mode Compact activé", { description: "Barre latérale réduite aux icônes." });
    } else if (mode === "floating") {
      setVariant("floating");
      setLayoutMode("push");
      setSidebarOpen(true);
      toast.success("Mode Flottant activé", { description: "Barre latérale aérée et décollée." });
    }
  };

  const handleReset = () => {
    setTheme("light");
    setColorTheme("emerald");
    setNavLayout("sidebar");
    setVariant("sidebar");
    setLayoutMode("push");
    setSidebarOpen(true);
    setDensity("comfort");
    toast.success("Préférences réinitialisées", { description: "Configuration optimale Lokka appliquée." });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 pointer-events-none flex justify-end">
          {/* Backdrop transparent sans flou gênant */}
          <div
            className="flex-1 pointer-events-auto cursor-pointer bg-black/20 dark:bg-black/40 transition-opacity"
            onClick={onClose}
            title="Cliquer pour fermer"
          />

          {/* Drawer Panel élégant ProMax */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="pointer-events-auto w-full max-w-[420px] h-full flex flex-col justify-between overflow-hidden select-none border-l shadow-2xl bg-card border-border text-card-foreground"
          >
            {/* ─── 1. HEADER ÉDITORIAL ─── */}
            <div className="px-5 py-4 border-b border-border bg-card/95 backdrop-blur-sm shrink-0 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[15px] font-extrabold tracking-tight text-card-foreground flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-primary" />
                    Affichage &amp; Préférences
                  </h2>
                  <p className="text-[11.5px] text-muted-foreground mt-0.5">
                    Personnalisation de votre espace de travail en direct.
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleReset}
                    title="Réinitialiser"
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-card-foreground hover:bg-muted transition cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    title="Fermer"
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-card-foreground hover:bg-muted transition cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Onglets supérieurs de filtrage */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/60 border border-border text-[11px] font-bold">
                {[
                  { id: "all", label: "Tout voir" },
                  { id: "modes", label: "3 Modes Barre" },
                  { id: "theme", label: "Thème & Style" },
                  { id: "display", label: "Densité & Sécurité" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 py-1 px-1.5 rounded-lg transition-all cursor-pointer truncate text-center ${
                      activeTab === tab.id
                        ? "bg-card text-foreground shadow-2xs border border-border"
                        : "text-muted-foreground hover:text-card-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ─── 2. SECTIONS LIST ─── */}
            <div className="p-5 space-y-6 flex-1 overflow-y-auto">

              {/* SECTION 1 : LES 3 MODES MAJEURS DE LA BARRE LATÉRALE */}
              {(activeTab === "all" || activeTab === "modes") && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold text-card-foreground flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-primary" />
                      Mode de la Barre Latérale
                    </span>
                    <span className="text-[11px] font-semibold text-primary capitalize">
                      {currentSidebarMode === "full"
                        ? "Plein (240px)"
                        : currentSidebarMode === "compact"
                        ? "Compact (68px)"
                        : "Flottant"}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    {/* 1. Mode Full / Déplié */}
                    <button
                      type="button"
                      onClick={() => handleSelectSidebarMode("full")}
                      className={`cursor-pointer group flex flex-col items-center p-2 rounded-xl border text-left transition-all ${
                        currentSidebarMode === "full"
                          ? "border-primary bg-primary/10 ring-2 ring-primary/20 shadow-2xs"
                          : "border-border bg-muted/40 hover:border-border/80 hover:bg-muted/70"
                      }`}
                    >
                      <div className="relative w-full h-[54px] rounded-lg overflow-hidden flex items-center justify-center p-1.5 bg-card border border-border">
                        {currentSidebarMode === "full" && (
                          <div className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[8px] shadow-xs z-20">
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          </div>
                        )}
                        <div className="flex w-full h-full gap-1">
                          {/* Sidebar large */}
                          <div className="w-2/5 h-full rounded-xs bg-primary/20 border border-primary/30 p-1 flex flex-col justify-between">
                            <div className="w-3/4 h-1 bg-primary rounded-xs" />
                            <div className="w-full h-0.5 bg-muted-foreground/30 rounded-xs" />
                            <div className="w-2/3 h-0.5 bg-muted-foreground/30 rounded-xs" />
                          </div>
                          {/* Contenu */}
                          <div className="flex-1 h-full rounded-xs bg-muted/20 border border-border/50 p-1 flex flex-col gap-1">
                            <div className="w-full h-1.5 rounded-xs bg-muted" />
                            <div className="w-1/2 h-1.5 rounded-xs bg-muted" />
                          </div>
                        </div>
                      </div>
                      <span className="text-[11.5px] font-bold mt-1.5 text-card-foreground">Plein (Full)</span>
                      <span className="text-[9.5px] text-muted-foreground line-clamp-1">Largeur 240px</span>
                    </button>

                    {/* 2. Mode Compact / Icônes */}
                    <button
                      type="button"
                      onClick={() => handleSelectSidebarMode("compact")}
                      className={`cursor-pointer group flex flex-col items-center p-2 rounded-xl border text-left transition-all ${
                        currentSidebarMode === "compact"
                          ? "border-primary bg-primary/10 ring-2 ring-primary/20 shadow-2xs"
                          : "border-border bg-muted/40 hover:border-border/80 hover:bg-muted/70"
                      }`}
                    >
                      <div className="relative w-full h-[54px] rounded-lg overflow-hidden flex items-center justify-center p-1.5 bg-card border border-border">
                        {currentSidebarMode === "compact" && (
                          <div className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[8px] shadow-xs z-20">
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          </div>
                        )}
                        <div className="flex w-full h-full gap-1">
                          {/* Sidebar mini rail */}
                          <div className="w-1/5 h-full rounded-xs bg-primary/25 border border-primary/30 p-0.5 flex flex-col items-center justify-between">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                          </div>
                          {/* Contenu large */}
                          <div className="flex-1 h-full rounded-xs bg-muted/20 border border-border/50 p-1 flex flex-col gap-1">
                            <div className="w-full h-1.5 rounded-xs bg-muted" />
                            <div className="w-3/4 h-1.5 rounded-xs bg-muted" />
                          </div>
                        </div>
                      </div>
                      <span className="text-[11.5px] font-bold mt-1.5 text-card-foreground">Compact</span>
                      <span className="text-[9.5px] text-muted-foreground line-clamp-1">Icônes seules (68px)</span>
                    </button>

                    {/* 3. Mode Flottant / Détaché */}
                    <button
                      type="button"
                      onClick={() => handleSelectSidebarMode("floating")}
                      className={`cursor-pointer group flex flex-col items-center p-2 rounded-xl border text-left transition-all ${
                        currentSidebarMode === "floating"
                          ? "border-primary bg-primary/10 ring-2 ring-primary/20 shadow-2xs"
                          : "border-border bg-muted/40 hover:border-border/80 hover:bg-muted/70"
                      }`}
                    >
                      <div className="relative w-full h-[54px] rounded-lg overflow-hidden flex items-center justify-center p-1.5 bg-card border border-border">
                        {currentSidebarMode === "floating" && (
                          <div className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[8px] shadow-xs z-20">
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          </div>
                        )}
                        <div className="flex w-full h-full gap-1 p-0.5">
                          {/* Sidebar flottante avec marge */}
                          <div className="w-1/3 h-full rounded-md bg-primary/25 border border-primary shadow-xs p-0.5 flex flex-col justify-between">
                            <div className="w-3/4 h-1 bg-primary rounded-xs" />
                            <div className="w-1/2 h-0.5 bg-muted-foreground/30 rounded-xs" />
                          </div>
                          {/* Contenu */}
                          <div className="flex-1 h-full rounded-md bg-muted/20 border border-border/50 p-1 flex flex-col gap-1">
                            <div className="w-full h-1.5 rounded-xs bg-muted" />
                          </div>
                        </div>
                      </div>
                      <span className="text-[11.5px] font-bold mt-1.5 text-card-foreground">Flottant</span>
                      <span className="text-[9.5px] text-muted-foreground line-clamp-1">Aérien &amp; Décollé</span>
                    </button>
                  </div>
                </div>
              )}

              {/* SECTION 2 : STRUCTURE DE NAVIGATION (SIDEBAR vs TOPNAV) */}
              {(activeTab === "all" || activeTab === "modes") && (
                <div className="space-y-3 pt-2 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold text-card-foreground flex items-center gap-1.5">
                      <Layout className="h-3.5 w-3.5 text-primary" />
                      Position du Menu Principal
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {navLayout === "topnav" ? "Barre Haute (TopNav)" : "Barre Latérale (Standard)"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Option 1 : Barre Latérale */}
                    <button
                      type="button"
                      onClick={() => setNavLayout("sidebar")}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        navLayout === "sidebar"
                          ? "border-primary bg-primary/10 ring-2 ring-primary/20 shadow-2xs"
                          : "border-border bg-muted/40 hover:bg-muted/70"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[12px] font-bold text-card-foreground">Barre Latérale</span>
                        {navLayout === "sidebar" && <Check className="w-3.5 h-3.5 text-primary" />}
                      </div>
                      <p className="text-[10.5px] text-muted-foreground">
                        Navigation à gauche avec arborescence complète.
                      </p>
                    </button>

                    {/* Option 2 : TopNav */}
                    <button
                      type="button"
                      onClick={() => setNavLayout("topnav")}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        navLayout === "topnav"
                          ? "border-primary bg-primary/10 ring-2 ring-primary/20 shadow-2xs"
                          : "border-border bg-muted/40 hover:bg-muted/70"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[12px] font-bold text-card-foreground">Top Navigation</span>
                        {navLayout === "topnav" && <Check className="w-3.5 h-3.5 text-primary" />}
                      </div>
                      <p className="text-[10.5px] text-muted-foreground">
                        Menu horizontal en haut pour un écran 100% plein.
                      </p>
                    </button>
                  </div>
                </div>
              )}

              {/* SECTION 3 : DENSITÉ D'AFFICHAGE (CONFORT vs COMPACT) */}
              {(activeTab === "all" || activeTab === "display") && (
                <div className="space-y-3 pt-2 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold text-card-foreground flex items-center gap-1.5">
                      <Sliders className="h-3.5 w-3.5 text-primary" />
                      Densité des Tableaux &amp; Données
                    </span>
                    <span className="text-[11px] font-semibold text-primary capitalize">
                      {density === "compact" ? "Mode Condensé" : "Mode Confortable"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setDensity("comfort")}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        density === "comfort"
                          ? "border-primary bg-primary/10 ring-2 ring-primary/20 shadow-2xs"
                          : "border-border bg-muted/40 hover:bg-muted/70"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[12px] font-bold text-card-foreground">Confortable</span>
                        {density === "comfort" && <Check className="w-3.5 h-3.5 text-primary" />}
                      </div>
                      <p className="text-[10.5px] text-muted-foreground">
                        Espacements aérés, typographie respirante et grand confort visuel.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDensity("compact")}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        density === "compact"
                          ? "border-primary bg-primary/10 ring-2 ring-primary/20 shadow-2xs"
                          : "border-border bg-muted/40 hover:bg-muted/70"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[12px] font-bold text-card-foreground">Compacte</span>
                        {density === "compact" && <Check className="w-3.5 h-3.5 text-primary" />}
                      </div>
                      <p className="text-[10.5px] text-muted-foreground">
                        Lignes plus denses, idéal pour visualiser un maximum de lots et de baux.
                      </p>
                    </button>
                  </div>
                </div>
              )}

              {/* SECTION 4 : MODE DE THÈME (CLAIR / SOMBRE / SYSTÈME) */}
              {(activeTab === "all" || activeTab === "theme") && (
                <div className="space-y-3 pt-2 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold text-card-foreground flex items-center gap-1.5">
                      <Sun className="h-3.5 w-3.5 text-primary" />
                      Apparence &amp; Thème
                    </span>
                    <span className="text-[11px] text-muted-foreground capitalize">
                      {theme === "dark" ? "Sombre" : theme === "light" ? "Clair" : "Automatique"}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "light", label: "Clair", icon: Sun },
                      { id: "dark", label: "Sombre", icon: Moon },
                      { id: "system", label: "Système", icon: Laptop },
                    ].map((th) => {
                      const Icon = th.icon;
                      const isSelected = theme === th.id;
                      return (
                        <button
                          key={th.id}
                          type="button"
                          onClick={() => setTheme(th.id as ThemeMode)}
                          className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? "border-primary bg-primary/10 ring-2 ring-primary/20 shadow-2xs"
                              : "border-border bg-muted/40 hover:bg-muted/70"
                          }`}
                        >
                          <Icon className={`w-4 h-4 mb-1 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                          <span className="text-[11px] font-bold text-card-foreground">{th.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SECTION 5 : COULEUR D'ACCENT DU COCKPIT */}
              {(activeTab === "all" || activeTab === "theme") && (
                <div className="space-y-3 pt-2 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold text-card-foreground flex items-center gap-1.5">
                      <Palette className="h-3.5 w-3.5 text-primary" />
                      Nuance d'Accent du Dashboard
                    </span>
                    <span className="text-[11px] font-mono font-bold text-primary uppercase">
                      {activeHex}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {ACCENT_PRESETS.map((preset) => {
                      const isSelected = colorTheme === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setColorTheme(preset.id as ColorTheme)}
                          className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? "border-primary bg-primary/10 ring-2 ring-primary/20 shadow-2xs"
                              : "border-border bg-muted/40 hover:bg-muted/70"
                          }`}
                        >
                          <span
                            className="w-5 h-5 rounded-full flex items-center justify-center text-white shadow-2xs mb-1"
                            style={{ backgroundColor: preset.hex }}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </span>
                          <span className="text-[10px] font-semibold text-card-foreground truncate w-full text-center">
                            {preset.name}
                          </span>
                        </button>
                      );
                    })}

                    {/* Sélecteur libre de couleur */}
                    <label
                      className={`relative flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
                        colorTheme === "custom"
                          ? "border-primary bg-primary/10 ring-2 ring-primary/20 shadow-2xs"
                          : "border-border bg-muted/40 hover:bg-muted/70"
                      }`}
                    >
                      <input
                        type="color"
                        value={customColorHex}
                        onChange={(e) => {
                          setCustomColorHex(e.target.value);
                          setColorTheme("custom");
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center shadow-2xs border border-white/40 mb-1"
                        style={{ backgroundColor: customColorHex }}
                      >
                        {colorTheme === "custom" && <Check className="w-3 h-3 stroke-[3] text-white" />}
                      </span>
                      <span className="text-[10px] font-semibold text-card-foreground">
                        Libre
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* SECTION 6 : MODE CONFIDENTIALITÉ (DISCRÉTION EN PUBLIC) */}
              {(activeTab === "all" || activeTab === "display") && (
                <div className="p-3.5 rounded-xl border border-border bg-muted/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-card border border-border text-primary">
                        {isPrivacyMode ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="text-[12px] font-bold text-card-foreground">
                          Mode Confidentialité
                        </p>
                        <p className="text-[10.5px] text-muted-foreground">
                          Masque les chiffres d'encaissements et loyers en public
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={togglePrivacyMode}
                      className={`relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isPrivacyMode ? "bg-primary" : "bg-border"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                          isPrivacyMode ? "translate-x-4.5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                  {isPrivacyMode && (
                    <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-[11px] font-mono font-bold text-primary text-center">
                      Aperçu : •••••••• FCFA
                    </div>
                  )}
                </div>
              )}

              {/* SECTION 7 : CADRE TERRITORIAL RÉEL (BÉNIN / UEMOA) */}
              <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-between text-[11.5px]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-card-foreground">
                    Monnaie légale active : <strong>Franc CFA (FCFA)</strong>
                  </span>
                </div>
                <span className="text-[10.5px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Loi 2022-30 🇧🇯
                </span>
              </div>

            </div>

            {/* ─── 3. FOOTER ─── */}
            <div className="p-4 border-t border-border bg-card flex items-center justify-between shrink-0">
              <span className="text-[11px] font-medium text-muted-foreground">
                Lokka Design System · ProMax
              </span>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-[12px] font-bold transition cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs active:scale-95"
              >
                Fermer
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
