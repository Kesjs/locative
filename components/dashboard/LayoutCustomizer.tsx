"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useSidebar,
  SidebarVariant,
  LayoutMode,
  ColorTheme,
  ThemeMode,
  CurrencyMode,
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
  ChevronDown,
} from "lucide-react";
import { ACCENT_PRESETS } from "@/lib/theme/color-utils";
import { toast } from "@/components/ui/toast";

interface LayoutCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LayoutCustomizer({ isOpen, onClose }: LayoutCustomizerProps) {
  const {
    variant: sidebarVariant,
    setVariant,
    layoutMode,
    setLayoutMode,
    navLayout,
    setNavLayout,
    theme,
    setTheme,
    currency,
    setCurrency,
    colorTheme,
    setColorTheme,
    customColorHex,
    setCustomColorHex,
    isPrivacyMode,
    togglePrivacyMode,
    density,
    setDensity,
    devRole,
    setDevRole,
  } = useSidebar();

  const [devSectionOpen, setDevSectionOpen] = React.useState(false);

  const activeHex =
    colorTheme === "custom"
      ? customColorHex
      : COLOR_THEMES[colorTheme]?.hex ?? "#F59E0B";

  const handleReset = () => {
    setTheme("dark");
    setColorTheme("amber");
    setNavLayout("sidebar");
    setVariant("sidebar");
    setLayoutMode("push");
    setCurrency("fcfa");
    setDensity("comfort");
    toast.success("Préférences réinitialisées", "Configuration par défaut Lokka appliquée.");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] transition-opacity flex justify-end">
          {/* Backdrop */}
          <div className="flex-1 cursor-pointer" onClick={onClose} />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="w-full max-w-[390px] h-full flex flex-col justify-between overflow-hidden select-none border-l shadow-2xl bg-[var(--surface)] border-[var(--border)] text-[var(--foreground)]"
          >
            {/* ─── 1. HEADER ─── */}
            <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface-elevated)]">
              <div>
                <h2 className="text-[14px] font-bold tracking-tight text-[var(--foreground)] flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-[var(--primary)]" />
                  Affichage & Préférences
                </h2>
                <p className="text-[11.5px] text-[var(--text-secondary)] mt-0.5">
                  Personnalisez votre interface et vos outils Lokka.
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleReset}
                  title="Réinitialiser les préférences"
                  className="p-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--surface-secondary)] transition cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--surface-secondary)] transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* ─── 2. SECTIONS LIST ─── */}
            <div className="p-5 space-y-6 flex-1 overflow-y-auto no-scrollbar">

              {/* SECTION A: THÈME D'APPARENCE */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-[var(--foreground)] flex items-center gap-1.5">
                    <Moon className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
                    Thème Visuel
                  </span>
                  <span className="text-[11px] text-[var(--text-secondary)] capitalize">
                    {theme === "dark" ? "Sombre" : theme === "light" ? "Clair" : "Système"}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 p-1 rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)]">
                  <button
                    type="button"
                    onClick={() => setTheme("light")}
                    className={`py-1.5 px-2 rounded-md text-[11.5px] font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      theme === "light"
                        ? "bg-[var(--surface)] text-[var(--foreground)] shadow-xs font-semibold"
                        : "text-[var(--text-secondary)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    <Sun className="h-3.5 w-3.5" />
                    Clair
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    className={`py-1.5 px-2 rounded-md text-[11.5px] font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      theme === "dark"
                        ? "bg-[var(--surface)] text-[var(--foreground)] shadow-xs font-semibold"
                        : "text-[var(--text-secondary)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    <Moon className="h-3.5 w-3.5" />
                    Sombre
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme("system")}
                    className={`py-1.5 px-2 rounded-md text-[11.5px] font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      theme === "system"
                        ? "bg-[var(--surface)] text-[var(--foreground)] shadow-xs font-semibold"
                        : "text-[var(--text-secondary)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    <Laptop className="h-3.5 w-3.5" />
                    Auto
                  </button>
                </div>
              </div>

              {/* SECTION B: COULEUR D'ACCENT PERSONNALISABLE */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-[var(--foreground)] flex items-center gap-1.5">
                    <Palette className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
                    Couleur d&apos;Accent
                  </span>
                  <span className="text-[11px] font-mono text-[var(--text-secondary)] uppercase">
                    {activeHex}
                  </span>
                </div>

                <div className="grid grid-cols-7 gap-2 items-center">
                  {ACCENT_PRESETS.map((preset) => {
                    const isSelected = colorTheme === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setColorTheme(preset.id as ColorTheme)}
                        title={preset.name}
                        className={`h-9 w-full rounded-lg border transition-all flex items-center justify-center cursor-pointer relative ${
                          isSelected
                            ? "border-[var(--foreground)] ring-2 ring-[var(--primary-subtle)] scale-105"
                            : "border-[var(--border)] hover:scale-102 opacity-85 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: preset.hex }}
                      >
                        {isSelected && (
                          <Check
                            className="h-3.5 w-3.5 stroke-[3]"
                            style={{
                              color:
                                preset.id === "amber" || preset.id === "cyan"
                                  ? "#000000"
                                  : "#FFFFFF",
                            }}
                          />
                        )}
                      </button>
                    );
                  })}

                  {/* Sélecteur Personnalisé (Color Picker) */}
                  <label
                    title="Couleur Personnalisée"
                    className={`h-9 w-full rounded-lg border transition-all flex items-center justify-center cursor-pointer relative overflow-hidden ${
                      colorTheme === "custom"
                        ? "border-[var(--foreground)] ring-2 ring-[var(--primary-subtle)] scale-105"
                        : "border-[var(--border)] hover:scale-102 opacity-85 hover:opacity-100"
                    }`}
                    style={{
                      background:
                        colorTheme === "custom"
                          ? customColorHex
                          : "conic-gradient(from 0deg, #f59e0b, #3b82f6, #6366f1, #8b5cf6, #10b981, #06b6d4, #f59e0b)",
                    }}
                  >
                    <input
                      type="color"
                      value={customColorHex}
                      onChange={(e) => setCustomColorHex(e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    {colorTheme === "custom" && (
                      <Check className="h-3.5 w-3.5 text-white stroke-[3] drop-shadow-sm" />
                    )}
                  </label>
                </div>
              </div>

              {/* SECTION C: DISPOSITION GLOBALE (SIDEBAR VS TOP NAV) */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-[var(--foreground)] flex items-center gap-1.5">
                    <Layout className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
                    Navigation Principale
                  </span>
                  <span className="text-[11px] text-[var(--text-secondary)]">
                    {navLayout === "sidebar" ? "Barre latérale" : "Top Nav horizontale"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {/* Miniature Sidebar */}
                  <button
                    type="button"
                    onClick={() => setNavLayout("sidebar")}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-2 ${
                      navLayout === "sidebar"
                        ? "border-[var(--primary)] bg-[var(--primary-subtle)] ring-1 ring-[var(--primary)]"
                        : "border-[var(--border)] hover:bg-[var(--surface-secondary)]"
                    }`}
                  >
                    <div className="h-14 w-full rounded-md border border-[var(--border)] bg-[var(--surface-elevated)] flex overflow-hidden">
                      <div className="w-1/3 h-full border-r border-[var(--border)] bg-[var(--primary-subtle)] p-1 flex flex-col gap-1">
                        <div className="w-full h-1.5 rounded-xs bg-[var(--primary)]" />
                        <div className="w-3/4 h-1 rounded-xs bg-[var(--text-secondary)] opacity-40" />
                        <div className="w-2/3 h-1 rounded-xs bg-[var(--text-secondary)] opacity-40" />
                      </div>
                      <div className="flex-1 p-1.5 flex flex-col gap-1">
                        <div className="w-full h-1.5 rounded-xs bg-[var(--surface-secondary)]" />
                        <div className="w-full h-4 rounded-xs bg-[var(--surface-secondary)]" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11.5px] font-semibold text-[var(--foreground)]">
                        Barre latérale
                      </span>
                      {navLayout === "sidebar" && (
                        <Check className="h-3 w-3 text-[var(--primary)] stroke-[3]" />
                      )}
                    </div>
                  </button>

                  {/* Miniature Top Nav */}
                  <button
                    type="button"
                    onClick={() => setNavLayout("topnav")}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-2 ${
                      navLayout === "topnav"
                        ? "border-[var(--primary)] bg-[var(--primary-subtle)] ring-1 ring-[var(--primary)]"
                        : "border-[var(--border)] hover:bg-[var(--surface-secondary)]"
                    }`}
                  >
                    <div className="h-14 w-full rounded-md border border-[var(--border)] bg-[var(--surface-elevated)] flex flex-col overflow-hidden">
                      <div className="h-3 w-full border-b border-[var(--border)] bg-[var(--primary-subtle)] px-1.5 flex items-center gap-1">
                        <div className="w-2 h-1.5 rounded-xs bg-[var(--primary)]" />
                        <div className="w-4 h-1 rounded-xs bg-[var(--text-secondary)] opacity-40" />
                        <div className="w-4 h-1 rounded-xs bg-[var(--text-secondary)] opacity-40" />
                      </div>
                      <div className="flex-1 p-1.5 flex flex-col gap-1">
                        <div className="w-full h-1.5 rounded-xs bg-[var(--surface-secondary)]" />
                        <div className="w-full h-4 rounded-xs bg-[var(--surface-secondary)]" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11.5px] font-semibold text-[var(--foreground)]">
                        Top Nav
                      </span>
                      {navLayout === "topnav" && (
                        <Check className="h-3 w-3 text-[var(--primary)] stroke-[3]" />
                      )}
                    </div>
                  </button>
                </div>
              </div>

              {/* SECTION D: STYLE DE BARRE LATÉRALE (CONSERVÉ) */}
              {navLayout === "sidebar" && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-[var(--foreground)] flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
                      Style du Menu Latéral
                    </span>
                    <span className="text-[11px] text-[var(--text-secondary)] capitalize">
                      {sidebarVariant === "sidebar"
                        ? "Classique"
                        : sidebarVariant === "floating"
                        ? "Flottant"
                        : "Encadré"}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 p-1 rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)]">
                    <button
                      type="button"
                      onClick={() => setVariant("sidebar")}
                      className={`py-1.5 px-2 rounded-md text-[11.5px] font-medium transition-all cursor-pointer ${
                        sidebarVariant === "sidebar"
                          ? "bg-[var(--surface)] text-[var(--foreground)] shadow-xs font-semibold"
                          : "text-[var(--text-secondary)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      Classique
                    </button>

                    <button
                      type="button"
                      onClick={() => setVariant("floating")}
                      className={`py-1.5 px-2 rounded-md text-[11.5px] font-medium transition-all cursor-pointer ${
                        sidebarVariant === "floating"
                          ? "bg-[var(--surface)] text-[var(--foreground)] shadow-xs font-semibold"
                          : "text-[var(--text-secondary)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      Flottant
                    </button>

                    <button
                      type="button"
                      onClick={() => setVariant("inset")}
                      className={`py-1.5 px-2 rounded-md text-[11.5px] font-medium transition-all cursor-pointer ${
                        sidebarVariant === "inset"
                          ? "bg-[var(--surface)] text-[var(--foreground)] shadow-xs font-semibold"
                          : "text-[var(--text-secondary)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      Encadré
                    </button>
                  </div>
                </div>
              )}

              {/* SECTION E: MODE D'AGENCEMENT (PUSH VS OVERLAY - CONSERVÉ) */}
              {navLayout === "sidebar" && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-[var(--foreground)]">
                      Comportement d&apos;Ouverture
                    </span>
                    <span className="text-[11px] text-[var(--text-secondary)]">
                      {layoutMode === "push" ? "Repousser (Push)" : "Superposer (Overlay)"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 p-1 rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)]">
                    <button
                      type="button"
                      onClick={() => setLayoutMode("push")}
                      className={`py-1.5 px-2 rounded-md text-[11.5px] font-medium transition-all cursor-pointer ${
                        layoutMode === "push"
                          ? "bg-[var(--surface)] text-[var(--foreground)] shadow-xs font-semibold"
                          : "text-[var(--text-secondary)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      Pousser le contenu
                    </button>

                    <button
                      type="button"
                      onClick={() => setLayoutMode("overlay")}
                      className={`py-1.5 px-2 rounded-md text-[11.5px] font-medium transition-all cursor-pointer ${
                        layoutMode === "overlay"
                          ? "bg-[var(--surface)] text-[var(--foreground)] shadow-xs font-semibold"
                          : "text-[var(--text-secondary)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      Superposition
                    </button>
                  </div>
                </div>
              )}

              {/* SECTION F: DEVISES EN PILULES RAPIDES */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-[var(--foreground)]">
                    Devise Principale
                  </span>
                  <span className="text-[11px] font-semibold text-[var(--primary)] uppercase">
                    {currency}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {(["fcfa", "eur", "usd"] as CurrencyMode[]).map((cur) => {
                    const isCur = currency === cur;
                    return (
                      <button
                        key={cur}
                        type="button"
                        onClick={() => setCurrency(cur)}
                        className={`py-1.5 px-3 rounded-full text-[12px] font-semibold border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                          isCur
                            ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] shadow-xs"
                            : "bg-[var(--surface-secondary)] text-[var(--text-secondary)] border-[var(--border)] hover:text-[var(--foreground)]"
                        }`}
                      >
                        {cur.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION G: MODE CONFIDENTIALITÉ (MASQUAGE SOLDES) */}
              <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-md bg-[var(--surface)] border border-[var(--border)] text-[var(--primary)]">
                      {isPrivacyMode ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4 text-[var(--text-secondary)]" />
                      )}
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold text-[var(--foreground)]">
                        Masquer les montants
                      </p>
                      <p className="text-[10.5px] text-[var(--text-secondary)]">
                        Remplace les soldes par ••••••
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={togglePrivacyMode}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                      isPrivacyMode ? "bg-[var(--primary)]" : "bg-[var(--border)]"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        isPrivacyMode ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* SECTION H: OPTIONS DÉVELOPPEUR DISCRÈTES */}
              <div className="border border-[var(--border)] rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setDevSectionOpen(!devSectionOpen)}
                  className="w-full px-3.5 py-2.5 bg-[var(--surface-secondary)] text-left flex items-center justify-between cursor-pointer"
                >
                  <span className="text-[11.5px] font-semibold text-[var(--text-secondary)]">
                    Simulateur de Rôle Dev
                  </span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-[var(--text-secondary)] transition-transform duration-200 ${
                      devSectionOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {devSectionOpen && (
                  <div className="p-3 bg-[var(--surface)] border-t border-[var(--border)] space-y-1.5">
                    <p className="text-[10.5px] text-[var(--text-secondary)] mb-2">
                      Permutez l&apos;interface pour tester les différentes vues métiers :
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {(["bailleur", "gestionnaire", "agence"] as const).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setDevRole(r as any)}
                          className={`py-1 px-2 rounded-md text-[11px] font-medium border capitalize cursor-pointer transition ${
                            devRole === r
                              ? "bg-[var(--primary-subtle)] text-[var(--primary)] border-[var(--primary)]"
                              : "border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--foreground)]"
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* ─── 3. FOOTER ACTIONS ─── */}
            <div className="p-4 border-t border-[var(--border)] bg-[var(--surface-elevated)] flex items-center justify-between">
              <span className="text-[11px] text-[var(--text-secondary)]">
                Lokka Design System v2.1
              </span>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg text-[12px] font-semibold transition cursor-pointer bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90"
              >
                Terminer
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
