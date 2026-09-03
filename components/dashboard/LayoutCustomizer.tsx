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
  Building2,
  Users,
  Shield,
  Coins,
  Globe,
  Monitor,
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

  // Onglet actif pour une ergonomie optimale sur mobile et compacte
  const [activeTab, setActiveTab] = React.useState<"all" | "theme" | "layout" | "region">("all");

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
    toast.success("Préférences réinitialisées", {
      description: "Configuration par défaut Lokka appliquée.",
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 pointer-events-none flex justify-end">
          {/* Backdrop 100% transparent SANS AUCUN FLOU pour voir le dashboard changer en direct */}
          <div
            className="flex-1 pointer-events-auto cursor-pointer bg-black/10 transition-opacity"
            onClick={onClose}
            title="Cliquer pour fermer"
          />

          {/* Drawer Panel interactif avec ombrage profond */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="pointer-events-auto w-full max-w-[430px] h-full flex flex-col justify-between overflow-hidden select-none border-l shadow-2xl bg-[var(--surface)] border-[var(--border)] text-[var(--foreground)]"
          >
            {/* ─── 1. HEADER ─── */}
            <div className="px-5 py-3.5 border-b border-[var(--border)] bg-[var(--surface-elevated)] shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[14.5px] font-bold tracking-tight text-[var(--foreground)] flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-[var(--primary)]" />
                    Affichage &amp; Préférences
                  </h2>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                    Modifications appliquées en temps réel sur l&apos;écran.
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleReset}
                    title="Réinitialiser tous les paramètres"
                    className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--surface-secondary)] transition cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    title="Fermer la barre latérale"
                    className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--surface-secondary)] transition cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Onglets tactiles supérieurs pour navigation rapide */}
              <div className="flex items-center gap-1 mt-3 p-1 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)]">
                {[
                  { id: "all", label: "Tout voir" },
                  { id: "theme", label: "Thème & Couleurs" },
                  { id: "layout", label: "Layout & Menu" },
                  { id: "region", label: "Devises & Rôles" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer truncate ${
                      activeTab === tab.id
                        ? "bg-[var(--surface)] text-[var(--primary)] shadow-2xs border border-[var(--border)]"
                        : "text-[var(--text-secondary)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ─── 2. SECTIONS LIST ─── */}
            <div className="p-5 space-y-6 flex-1 overflow-y-auto sidebar-scrollbar">

              {/* SECTION 1: COULEURS D'ACCENT */}
              {(activeTab === "all" || activeTab === "theme") && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[12.5px] font-bold text-[var(--foreground)] flex items-center gap-1.5">
                      <Palette className="h-3.5 w-3.5 text-[var(--primary)]" />
                      Couleur d&apos;Accent Dynamique
                    </span>
                    <span className="text-[11px] font-mono font-bold text-[var(--primary)] uppercase">
                      {activeHex}
                    </span>
                  </div>

                  {/* Swatches presets */}
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
                              ? "border-[var(--primary)] bg-[var(--primary-subtle)] ring-2 ring-[var(--primary-subtle)] shadow-2xs"
                              : "border-[var(--border)] bg-[var(--surface-secondary)] hover:border-[var(--border-subtle)] hover:bg-[var(--surface-hover)]"
                          }`}
                        >
                          <span
                            className="w-5 h-5 rounded-full flex items-center justify-center text-white shadow-2xs mb-1"
                            style={{ backgroundColor: preset.hex }}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" style={{ color: preset.hex === "#F59E0B" || preset.hex === "#06B6D4" ? "#000" : "#FFF" }} />}
                          </span>
                          <span className="text-[10.5px] font-semibold text-[var(--foreground)] truncate w-full text-center">
                            {preset.name}
                          </span>
                        </button>
                      );
                    })}

                    {/* Sélecteur personnalisé libre */}
                    <label
                      className={`relative flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
                        colorTheme === "custom"
                          ? "border-[var(--primary)] bg-[var(--primary-subtle)] ring-2 ring-[var(--primary-subtle)] shadow-2xs"
                          : "border-[var(--border)] bg-[var(--surface-secondary)] hover:border-[var(--border-subtle)] hover:bg-[var(--surface-hover)]"
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
                      <span className="text-[10.5px] font-semibold text-[var(--foreground)]">
                        Libre
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* SECTION 2: MODE DE THÈME AVEC MINIATURES ILLUSTRÉES D'ORIGINE */}
              {(activeTab === "all" || activeTab === "theme") && (
                <div className="space-y-3 pt-2 border-t border-[var(--border)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[12.5px] font-bold text-[var(--foreground)] flex items-center gap-1.5">
                      <Sun className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
                      Mode de Thème
                    </span>
                    <span className="text-[11px] text-[var(--text-secondary)] capitalize">
                      {theme === "dark" ? "Sombre" : theme === "light" ? "Clair" : "Automatique"}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {/* Thème Clair */}
                    <div
                      onClick={() => setTheme("light")}
                      className={`cursor-pointer group flex flex-col items-center p-1 rounded-xl border transition-all ${
                        theme === "light"
                          ? "border-[var(--primary)] bg-[var(--primary-subtle)] ring-2 ring-[var(--primary-subtle)] shadow-2xs"
                          : "border-[var(--border)] bg-[var(--surface-secondary)] hover:border-[var(--text-tertiary)]"
                      }`}
                    >
                      <div className="relative w-full h-[54px] rounded-lg overflow-hidden flex items-center justify-center p-1.5 bg-[#F4F4F5] border border-[#E4E4E7]">
                        {theme === "light" && (
                          <div className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full text-black flex items-center justify-center text-[8px] shadow-xs z-20 bg-[var(--primary)]">
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          </div>
                        )}
                        <div className="flex w-full h-full gap-1">
                          <div className="w-1/4 h-full bg-white rounded-xs border border-[#E4E4E7]" />
                          <div className="w-3/4 h-full bg-white rounded-xs border border-[#E4E4E7] p-1 flex flex-col justify-between">
                            <div className="w-2/3 h-1 bg-slate-300 rounded-xs" />
                            <div className="flex gap-1">
                              <div className="w-1.5 h-3.5 rounded-xs" style={{ backgroundColor: "var(--primary)" }} />
                              <div className="w-1.5 h-2.5 bg-slate-300 rounded-xs" />
                              <div className="w-1.5 h-4.5 bg-slate-400 rounded-xs" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold mt-1.5 text-[var(--foreground)]">Clair</span>
                    </div>

                    {/* Thème Sombre */}
                    <div
                      onClick={() => setTheme("dark")}
                      className={`cursor-pointer group flex flex-col items-center p-1 rounded-xl border transition-all ${
                        theme === "dark"
                          ? "border-[var(--primary)] bg-[var(--primary-subtle)] ring-2 ring-[var(--primary-subtle)] shadow-2xs"
                          : "border-[var(--border)] bg-[var(--surface-secondary)] hover:border-[var(--text-tertiary)]"
                      }`}
                    >
                      <div className="relative w-full h-[54px] rounded-lg overflow-hidden flex items-center justify-center p-1.5 bg-[#0B0B0D] border border-[#27272A]">
                        {theme === "dark" && (
                          <div className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full text-black flex items-center justify-center text-[8px] shadow-xs z-20 bg-[var(--primary)]">
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          </div>
                        )}
                        <div className="flex w-full h-full gap-1">
                          <div className="w-1/4 h-full bg-[#111113] rounded-xs border border-[#27272A]" />
                          <div className="w-3/4 h-full bg-[#18181B] rounded-xs border border-[#27272A] p-1 flex flex-col justify-between">
                            <div className="w-2/3 h-1 bg-zinc-700 rounded-xs" />
                            <div className="flex gap-1">
                              <div className="w-1.5 h-3.5 rounded-xs" style={{ backgroundColor: "var(--primary)" }} />
                              <div className="w-1.5 h-2.5 bg-zinc-700 rounded-xs" />
                              <div className="w-1.5 h-4.5 bg-zinc-600 rounded-xs" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold mt-1.5 text-[var(--foreground)]">Sombre</span>
                    </div>

                    {/* Thème Système Partagé */}
                    <div
                      onClick={() => setTheme("system")}
                      className={`cursor-pointer group flex flex-col items-center p-1 rounded-xl border transition-all ${
                        theme === "system"
                          ? "border-[var(--primary)] bg-[var(--primary-subtle)] ring-2 ring-[var(--primary-subtle)] shadow-2xs"
                          : "border-[var(--border)] bg-[var(--surface-secondary)] hover:border-[var(--text-tertiary)]"
                      }`}
                    >
                      <div className="relative w-full h-[54px] rounded-lg overflow-hidden flex items-center justify-center p-1.5 bg-gradient-to-r from-[#F4F4F5] to-[#0B0B0D] border border-[var(--border)]">
                        {theme === "system" && (
                          <div className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full text-black flex items-center justify-center text-[8px] shadow-xs z-20 bg-[var(--primary)]">
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          </div>
                        )}
                        <div className="flex w-full h-full gap-1">
                          <div className="w-1/2 h-full bg-white/90 rounded-xs border border-slate-300 p-0.5 flex flex-col justify-between">
                            <div className="w-3 h-1 bg-slate-400 rounded-xs" />
                            <div className="w-1.5 h-3" style={{ backgroundColor: "var(--primary)" }} />
                          </div>
                          <div className="w-1/2 h-full bg-[#18181B] rounded-xs border border-zinc-700 p-0.5 flex flex-col justify-between">
                            <div className="w-3 h-1 bg-zinc-600 rounded-xs" />
                            <div className="w-1.5 h-3" style={{ backgroundColor: "var(--primary)" }} />
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold mt-1.5 text-[var(--foreground)]">Système</span>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 3: DISPOSITION PRINCIPALE (TOP NAV vs BARRE LATÉRALE) */}
              {(activeTab === "all" || activeTab === "layout") && (
                <div className="space-y-3 pt-2 border-t border-[var(--border)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[12.5px] font-bold text-[var(--foreground)] flex items-center gap-1.5">
                      <Layout className="h-3.5 w-3.5 text-[var(--primary)]" />
                      Structure de Navigation
                    </span>
                    <span className="text-[11px] text-[var(--text-secondary)]">
                      {navLayout === "topnav" ? "Top Navigation Haute" : "Barre Latérale Standard"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Option 1 : Barre latérale */}
                    <div
                      onClick={() => setNavLayout("sidebar")}
                      className={`cursor-pointer group flex flex-col items-center p-2 rounded-xl border transition-all ${
                        navLayout === "sidebar"
                          ? "border-[var(--primary)] bg-[var(--primary-subtle)] ring-2 ring-[var(--primary-subtle)] shadow-2xs"
                          : "border-[var(--border)] bg-[var(--surface-secondary)] hover:border-[var(--text-tertiary)]"
                      }`}
                    >
                      <div className="relative w-full h-[60px] rounded-lg overflow-hidden flex items-center justify-center p-1.5 bg-[var(--surface-elevated)] border border-[var(--border)]">
                        {navLayout === "sidebar" && (
                          <div className="absolute top-1.5 right-1.5 h-3.5 w-3.5 rounded-full text-black flex items-center justify-center text-[8px] shadow-xs z-20 bg-[var(--primary)]">
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          </div>
                        )}
                        <div className="flex w-full h-full gap-1.5">
                          <div className="w-1/3 h-full rounded-xs flex flex-col justify-between p-1 bg-[var(--primary-subtle)] border border-[var(--primary-border)]">
                            <div className="w-full h-1.5 rounded-xs" style={{ backgroundColor: "var(--primary)" }} />
                            <div className="w-3/4 h-1 bg-[var(--text-secondary)] opacity-50 rounded-xs" />
                            <div className="w-full h-1 bg-[var(--text-secondary)] opacity-50 rounded-xs" />
                          </div>
                          <div className="flex-1 h-full rounded-xs bg-[var(--surface)] border border-[var(--border)] p-1 flex flex-col gap-1">
                            <div className="w-full h-2 rounded-xs bg-[var(--surface-secondary)]" />
                            <div className="w-1/2 h-2 rounded-xs bg-[var(--surface-secondary)]" />
                          </div>
                        </div>
                      </div>
                      <span className="text-[11.5px] font-bold mt-2 text-[var(--foreground)]">
                        Barre Latérale
                      </span>
                    </div>

                    {/* Option 2 : Top Nav */}
                    <div
                      onClick={() => setNavLayout("topnav")}
                      className={`cursor-pointer group flex flex-col items-center p-2 rounded-xl border transition-all ${
                        navLayout === "topnav"
                          ? "border-[var(--primary)] bg-[var(--primary-subtle)] ring-2 ring-[var(--primary-subtle)] shadow-2xs"
                          : "border-[var(--border)] bg-[var(--surface-secondary)] hover:border-[var(--text-tertiary)]"
                      }`}
                    >
                      <div className="relative w-full h-[60px] rounded-lg overflow-hidden flex items-center justify-center p-1.5 bg-[var(--surface-elevated)] border border-[var(--border)]">
                        {navLayout === "topnav" && (
                          <div className="absolute top-1.5 right-1.5 h-3.5 w-3.5 rounded-full text-black flex items-center justify-center text-[8px] shadow-xs z-20 bg-[var(--primary)]">
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          </div>
                        )}
                        <div className="flex flex-col w-full h-full gap-1.5">
                          <div className="w-full h-3 rounded-xs flex items-center justify-between px-1 bg-[var(--primary-subtle)] border border-[var(--primary-border)]">
                            <div className="w-2.5 h-1.5 rounded-xs" style={{ backgroundColor: "var(--primary)" }} />
                            <div className="flex gap-1">
                              <div className="w-3 h-1 bg-[var(--text-secondary)] opacity-60 rounded-xs" />
                              <div className="w-3 h-1 bg-[var(--text-secondary)] opacity-60 rounded-xs" />
                            </div>
                          </div>
                          <div className="flex-1 rounded-xs bg-[var(--surface)] border border-[var(--border)] p-1 flex flex-col gap-1">
                            <div className="w-full h-2 rounded-xs bg-[var(--surface-secondary)]" />
                            <div className="w-2/3 h-2 rounded-xs bg-[var(--surface-secondary)]" />
                          </div>
                        </div>
                      </div>
                      <span className="text-[11.5px] font-bold mt-2 text-[var(--foreground)]">
                        Top Nav (Plein Écran)
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 4: STYLE DU MENU LATÉRAL D'ORIGINE AVEC MINIATURES ILLUSTRÉES */}
              {(activeTab === "all" || activeTab === "layout") && navLayout === "sidebar" && (
                <div className="space-y-3 pt-2 border-t border-[var(--border)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[12.5px] font-bold text-[var(--foreground)] flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
                      Style du Menu Latéral
                    </span>
                    <span className="text-[11px] text-[var(--text-secondary)] capitalize">
                      {sidebarVariant === "sidebar" ? "Classique" : sidebarVariant === "floating" ? "Flottante" : "Encadrée"}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {/* Classique */}
                    <div
                      onClick={() => setVariant("sidebar")}
                      className={`cursor-pointer group flex flex-col items-center p-1 rounded-xl border transition-all ${
                        sidebarVariant === "sidebar"
                          ? "border-[var(--primary)] bg-[var(--primary-subtle)] ring-2 ring-[var(--primary-subtle)] shadow-2xs"
                          : "border-[var(--border)] bg-[var(--surface-secondary)] hover:border-[var(--text-tertiary)]"
                      }`}
                    >
                      <div className="relative w-full h-[52px] rounded-lg overflow-hidden flex items-center justify-center p-1 bg-[var(--surface-elevated)] border border-[var(--border)]">
                        {sidebarVariant === "sidebar" && (
                          <div className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full text-black flex items-center justify-center text-[8px] shadow-xs z-20 bg-[var(--primary)]">
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          </div>
                        )}
                        <div className="flex w-full h-full gap-1">
                          <div className="w-1/3 h-full rounded-xs" style={{ backgroundColor: "var(--primary)" }} />
                          <div className="w-2/3 h-full rounded-xs border border-[var(--border)] bg-[var(--surface)]" />
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold mt-1.5 text-[var(--foreground)]">Classique</span>
                    </div>

                    {/* Flottante */}
                    <div
                      onClick={() => setVariant("floating")}
                      className={`cursor-pointer group flex flex-col items-center p-1 rounded-xl border transition-all ${
                        sidebarVariant === "floating"
                          ? "border-[var(--primary)] bg-[var(--primary-subtle)] ring-2 ring-[var(--primary-subtle)] shadow-2xs"
                          : "border-[var(--border)] bg-[var(--surface-secondary)] hover:border-[var(--text-tertiary)]"
                      }`}
                    >
                      <div className="relative w-full h-[52px] rounded-lg overflow-hidden flex items-center justify-center p-1 bg-[var(--surface-elevated)] border border-[var(--border)]">
                        {sidebarVariant === "floating" && (
                          <div className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full text-black flex items-center justify-center text-[8px] shadow-xs z-20 bg-[var(--primary)]">
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          </div>
                        )}
                        <div className="flex w-full h-full gap-1 p-0.5">
                          <div className="w-1/3 h-full rounded-md shadow-xs" style={{ backgroundColor: "var(--primary)" }} />
                          <div className="w-2/3 h-full rounded-md border border-[var(--border)] bg-[var(--surface)]" />
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold mt-1.5 text-[var(--foreground)]">Flottante</span>
                    </div>

                    {/* Encadrée / Inset */}
                    <div
                      onClick={() => setVariant("inset")}
                      className={`cursor-pointer group flex flex-col items-center p-1 rounded-xl border transition-all ${
                        sidebarVariant === "inset"
                          ? "border-[var(--primary)] bg-[var(--primary-subtle)] ring-2 ring-[var(--primary-subtle)] shadow-2xs"
                          : "border-[var(--border)] bg-[var(--surface-secondary)] hover:border-[var(--text-tertiary)]"
                      }`}
                    >
                      <div className="relative w-full h-[52px] rounded-lg overflow-hidden flex items-center justify-center p-1 bg-[var(--surface-elevated)] border border-[var(--border)]">
                        {sidebarVariant === "inset" && (
                          <div className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full text-black flex items-center justify-center text-[8px] shadow-xs z-20 bg-[var(--primary)]">
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          </div>
                        )}
                        <div className="flex w-full h-full gap-1 p-0.5">
                          <div className="w-1/4 h-full rounded-xs opacity-75" style={{ backgroundColor: "var(--primary)" }} />
                          <div className="flex-1 h-full rounded-md border-2 border-[var(--primary)] p-0.5 bg-[var(--surface)]" />
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold mt-1.5 text-[var(--foreground)]">Encadrée</span>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 5: MODE D'AFFICHAGE D'ORIGINE AVEC MINIATURES ILLUSTRÉES */}
              {(activeTab === "all" || activeTab === "layout") && navLayout === "sidebar" && (
                <div className="space-y-3 pt-2 border-t border-[var(--border)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[12.5px] font-bold text-[var(--foreground)] flex items-center gap-1.5">
                      <Monitor className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
                      Mode d&apos;Affichage
                    </span>
                    <span className="text-[11px] text-[var(--text-secondary)] capitalize">
                      {layoutMode === "push" ? "Pousser (Push)" : layoutMode === "overlay" ? "Superposition" : "Plein Écran"}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {/* Push */}
                    <div
                      onClick={() => setLayoutMode("push")}
                      className={`cursor-pointer group flex flex-col items-center p-1 rounded-xl border transition-all ${
                        layoutMode === "push" || layoutMode === "default"
                          ? "border-[var(--primary)] bg-[var(--primary-subtle)] ring-2 ring-[var(--primary-subtle)] shadow-2xs"
                          : "border-[var(--border)] bg-[var(--surface-secondary)] hover:border-[var(--text-tertiary)]"
                      }`}
                    >
                      <div className="relative w-full h-[52px] rounded-lg overflow-hidden flex items-center justify-center p-1 bg-[var(--surface-elevated)] border border-[var(--border)]">
                        {(layoutMode === "push" || layoutMode === "default") && (
                          <div className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full text-black flex items-center justify-center text-[8px] shadow-xs z-20 bg-[var(--primary)]">
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          </div>
                        )}
                        <div className="flex w-full h-full gap-1">
                          <div className="w-1/3 h-full rounded-xs" style={{ backgroundColor: "var(--primary)" }} />
                          <div className="w-2/3 h-full rounded-xs border border-[var(--border)] bg-[var(--surface)]" />
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold mt-1.5 text-[var(--foreground)]">Pousser</span>
                    </div>

                    {/* Overlay */}
                    <div
                      onClick={() => setLayoutMode("overlay")}
                      className={`cursor-pointer group flex flex-col items-center p-1 rounded-xl border transition-all ${
                        layoutMode === "overlay"
                          ? "border-[var(--primary)] bg-[var(--primary-subtle)] ring-2 ring-[var(--primary-subtle)] shadow-2xs"
                          : "border-[var(--border)] bg-[var(--surface-secondary)] hover:border-[var(--text-tertiary)]"
                      }`}
                    >
                      <div className="relative w-full h-[52px] rounded-lg overflow-hidden flex items-center justify-center p-1 bg-[var(--surface-elevated)] border border-[var(--border)]">
                        {layoutMode === "overlay" && (
                          <div className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full text-black flex items-center justify-center text-[8px] shadow-xs z-20 bg-[var(--primary)]">
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          </div>
                        )}
                        <div className="relative flex w-full h-full">
                          <div className="w-2/5 h-full rounded-xs z-10 shadow-md" style={{ backgroundColor: "var(--primary)" }} />
                          <div className="w-full h-full rounded-xs border border-[var(--border)] bg-[var(--surface)] opacity-50 absolute inset-0" />
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold mt-1.5 text-[var(--foreground)]">Superposer</span>
                    </div>

                    {/* Full */}
                    <div
                      onClick={() => setLayoutMode("full")}
                      className={`cursor-pointer group flex flex-col items-center p-1 rounded-xl border transition-all ${
                        layoutMode === "full"
                          ? "border-[var(--primary)] bg-[var(--primary-subtle)] ring-2 ring-[var(--primary-subtle)] shadow-2xs"
                          : "border-[var(--border)] bg-[var(--surface-secondary)] hover:border-[var(--text-tertiary)]"
                      }`}
                    >
                      <div className="relative w-full h-[52px] rounded-lg overflow-hidden flex items-center justify-center p-1 bg-[var(--surface-elevated)] border border-[var(--border)]">
                        {layoutMode === "full" && (
                          <div className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full text-black flex items-center justify-center text-[8px] shadow-xs z-20 bg-[var(--primary)]">
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          </div>
                        )}
                        <div className="w-full h-full rounded-xs border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center">
                          <div className="w-3/4 h-2 rounded-xs opacity-75" style={{ backgroundColor: "var(--primary)" }} />
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold mt-1.5 text-[var(--foreground)]">Complet</span>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 6: DEVISES & CONTEXTE RÉGIONAL D'ORIGINE */}
              {(activeTab === "all" || activeTab === "region") && (
                <div className="space-y-3 pt-2 border-t border-[var(--border)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[12.5px] font-bold text-[var(--foreground)] flex items-center gap-1.5">
                      <Coins className="h-3.5 w-3.5 text-[var(--primary)]" />
                      Devise &amp; Contexte Régional
                    </span>
                    <span className="text-[11px] font-bold text-[var(--primary)] uppercase">
                      {currency}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "fcfa", label: "FCFA", sub: "Bénin / UEMOA" },
                      { id: "eur", label: "Euros (€)", sub: "Diaspora Europe" },
                      { id: "usd", label: "Dollars ($)", sub: "International" },
                    ].map((curr) => {
                      const isSelected = currency === curr.id;
                      return (
                        <button
                          key={curr.id}
                          type="button"
                          onClick={() => setCurrency(curr.id as CurrencyMode)}
                          className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? "border-[var(--primary)] bg-[var(--primary-subtle)] ring-2 ring-[var(--primary-subtle)] shadow-2xs"
                              : "border-[var(--border)] bg-[var(--surface-secondary)] hover:bg-[var(--surface-hover)] text-[var(--foreground)]"
                          }`}
                        >
                          <span className="text-[12px] block font-bold text-[var(--foreground)]">{curr.label}</span>
                          <span className="text-[9.5px] text-[var(--text-secondary)] leading-tight block">{curr.sub}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SECTION 7: MODE CONFIDENTIALITÉ */}
              {(activeTab === "all" || activeTab === "region") && (
                <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--primary)]">
                        {isPrivacyMode ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4 text-[var(--text-secondary)]" />
                        )}
                      </div>
                      <div>
                        <p className="text-[12px] font-bold text-[var(--foreground)]">
                          Mode Confidentialité
                        </p>
                        <p className="text-[10.5px] text-[var(--text-secondary)]">
                          Masque les montants de loyers en public
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={togglePrivacyMode}
                      className={`relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isPrivacyMode ? "bg-[var(--primary)]" : "bg-[var(--border)]"
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
                    <div className="p-2 rounded-lg bg-[var(--primary-subtle)] border border-[var(--primary-border)] text-[11px] font-mono font-bold text-[var(--primary)] text-center">
                      Aperçu : •••••••• {currency.toUpperCase()}
                    </div>
                  )}
                </div>
              )}

              {/* SECTION 8: SIMULATEUR DE RÔLE DEV D'ORIGINE */}
              {(activeTab === "all" || activeTab === "region") && (
                <div className="space-y-2.5 pt-2 border-t border-[var(--border)]">
                  <span className="text-[11.5px] font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5" />
                    Simulateur de Rôle (Environnement Dev)
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "bailleur", label: "Bailleur" },
                      { id: "agence", label: "Agence Immobilière" },
                      { id: "locataire", label: "Locataire" },
                      { id: "admin", label: "Admin HQ" },
                    ].map((r) => {
                      const isSelected = devRole === r.id;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setDevRole(r.id as any)}
                          className={`p-2 rounded-xl border text-left text-[11.5px] font-bold transition-all cursor-pointer ${
                            isSelected
                              ? "border-amber-500 bg-amber-500/15 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/30"
                              : "border-[var(--border)] bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                          }`}
                        >
                          {r.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>

            {/* ─── 3. FOOTER ─── */}
            <div className="p-4 border-t border-[var(--border)] bg-[var(--surface-elevated)] flex items-center justify-between shrink-0">
              <span className="text-[11px] font-medium text-[var(--text-secondary)]">
                Lokka Design System v2.1
              </span>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-[12px] font-bold transition cursor-pointer bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 shadow-xs active:scale-95"
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
