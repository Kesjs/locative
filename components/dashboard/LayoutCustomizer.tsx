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
  DensityMode,
  COLOR_THEMES,
} from "@/components/ui/sidebar";
import {
  XMarkIcon,
  ArrowPathIcon,
  CheckIcon,
  EyeIcon,
  EyeSlashIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

interface LayoutCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LayoutCustomizer({ isOpen, onClose }: LayoutCustomizerProps) {
  const {
    setOpen,
    variant: sidebarVariant,
    setVariant,
    layoutMode,
    setLayoutMode,
    theme,
    setTheme,
    currency,
    setCurrency,
    colorTheme,
    setColorTheme,
    isPrivacyMode,
    togglePrivacyMode,
    density,
    setDensity,
    devRole,
    setDevRole,
  } = useSidebar();

  // Récupère la couleur hex du thème actif pour l'utiliser dans les previews
  const accentHex = COLOR_THEMES[colorTheme]?.hex ?? "#087F5B";

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
  };

  const handleSidebarChange = (variant: SidebarVariant) => {
    setVariant(variant);
  };

  const handleLayoutChange = (layout: LayoutMode) => {
    setLayoutMode(layout);
  };

  const handleReset = () => {
    setTheme("light");
    setVariant("sidebar");
    setLayoutMode("push");
    setCurrency("fcfa");
    setColorTheme("emerald");
    setDensity("comfort");
    setOpen(true);
  };

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  // Helpers styles réutilisables basés sur l'accent dynamique
  const selectedRingStyle = {
    outline: `2px solid ${accentHex}`,
    outlineOffset: "1px",
  };

  const checkBadgeStyle = {
    backgroundColor: accentHex,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/20 transition-opacity flex justify-end">
          {/* Backdrop Click */}
          <div className="flex-1 cursor-pointer" onClick={onClose} />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 240 }}
            className="w-full max-w-[400px] bg-white dark:bg-[#18181B] text-slate-900 dark:text-zinc-100 border-l border-slate-200 dark:border-zinc-800 shadow-2xl h-full flex flex-col justify-between overflow-hidden select-none"
          >
            {/* ─── 1. HEADER ─── */}
            <div className="p-4 pb-3 border-b border-slate-200 dark:border-zinc-800 flex items-start justify-between">
              <div>
                <h2 className="text-[16px] font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                  <SparklesIcon className="h-4 w-4" style={{ color: accentHex }} />
                  Personnalisation de l&apos;espace
                </h2>
                <p className="text-[12px] text-slate-500 dark:text-zinc-400 mt-0.5 leading-snug">
                  Ajustez les couleurs, la confidentialité et l&apos;ergonomie.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition cursor-pointer shrink-0"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* ─── 2. SECTIONS LIST ─── */}
            <div className="p-4 space-y-5 flex-1 overflow-y-auto">

              {/* SECTION 1: COULEURS D'ACCENT */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12.5px] font-bold text-slate-900 dark:text-white">
                    Couleur d&apos;Accent Dynamique
                  </span>
                  <button
                    type="button"
                    onClick={() => setColorTheme("emerald")}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 cursor-pointer"
                    title="Réinitialiser à Émeraude"
                  >
                    <ArrowPathIcon className="h-3 w-3" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(Object.keys(COLOR_THEMES) as ColorTheme[]).map((key) => {
                    const pal = COLOR_THEMES[key];
                    const isSelected = colorTheme === key;

                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setColorTheme(key)}
                        className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? "border-slate-900 dark:border-white ring-2 ring-slate-900/10 dark:ring-white/20 bg-slate-50 dark:bg-zinc-800/80 font-bold"
                            : "border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800"
                        }`}
                      >
                        <span
                          className="h-3.5 w-3.5 rounded-full shrink-0 shadow-xs flex items-center justify-center"
                          style={{ backgroundColor: pal.hex }}
                        >
                          {isSelected && <CheckIcon className="h-2.5 w-2.5 text-white stroke-[3]" />}
                        </span>
                        <span className="text-[11px] truncate text-slate-800 dark:text-zinc-200 font-medium">
                          {pal.name.split(" ")[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 2: MODE CONFIDENTIALITÉ */}
              <div className="p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-900/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-1.5 rounded-lg ${
                        isPrivacyMode
                          ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400"
                          : "bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300"
                      }`}
                    >
                      {isPrivacyMode ? (
                        <EyeSlashIcon className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <span className="text-[12.5px] font-bold text-slate-900 dark:text-white block">
                        Mode Masquage / Discret
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                        {isPrivacyMode ? "Montants financiers masqués (••••••)" : "Montants visibles en clair"}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={togglePrivacyMode}
                    className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                    style={{ backgroundColor: isPrivacyMode ? accentHex : undefined }}
                    data-state={isPrivacyMode ? "on" : "off"}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out ${
                        isPrivacyMode ? "translate-x-4 bg-white" : "translate-x-0 bg-white"
                      } ${!isPrivacyMode ? "bg-slate-300 dark:bg-zinc-700" : ""}`}
                      style={!isPrivacyMode ? { backgroundColor: "#CBD5E1" } : undefined}
                    />
                  </button>
                </div>
              </div>

              {/* SECTION 3: MODE DE THÈME */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12.5px] font-bold text-slate-900 dark:text-white">Mode de thème</span>
                  <button
                    type="button"
                    onClick={() => handleThemeChange("light")}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 cursor-pointer"
                    title="Réinitialiser le thème"
                  >
                    <ArrowPathIcon className="h-3 w-3" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {/* System */}
                  <div onClick={() => handleThemeChange("system")} className="cursor-pointer group flex flex-col items-center">
                    <div
                      className={`relative w-full h-[58px] rounded-lg overflow-hidden p-1.5 transition-all flex flex-col justify-between border ${
                        theme === "system" ? "border-transparent" : "border-slate-200 dark:border-zinc-700 hover:border-slate-400"
                      }`}
                      style={{
                        background: "linear-gradient(135deg, #FFFFFF 50%, #0F172A 50%)",
                        ...(theme === "system" ? selectedRingStyle : {}),
                      }}
                    >
                      {theme === "system" && (
                        <div className="absolute top-1 right-1 h-4 w-4 rounded-full text-white flex items-center justify-center text-[10px] shadow-xs z-20" style={checkBadgeStyle}>
                          <CheckIcon className="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                      )}
                      <div className="flex items-center gap-1 z-10">
                        <div className="w-2.5 h-1 rounded bg-[#0F172A]" />
                        <div className="w-5 h-1 rounded bg-slate-300" />
                      </div>
                      <div className="flex items-end justify-between px-0.5 z-10">
                        <div className="flex items-end gap-0.5">
                          <div className="w-1.5 h-3 bg-[#0F172A] rounded-xs" />
                          <div className="w-1.5 h-4 bg-slate-400 rounded-xs" />
                        </div>
                        <div className="flex items-end gap-0.5">
                          <div className="w-1.5 h-2 bg-white/40 rounded-xs" />
                          <div className="w-1.5 h-3.5 bg-white rounded-xs" />
                        </div>
                      </div>
                    </div>
                    <span className="text-[11.5px] font-medium mt-1.5 text-slate-800 dark:text-zinc-200">Système</span>
                  </div>

                  {/* Light */}
                  <div onClick={() => handleThemeChange("light")} className="cursor-pointer group flex flex-col items-center">
                    <div
                      className={`relative w-full h-[58px] rounded-lg overflow-hidden p-1.5 transition-all flex flex-col justify-between border ${
                        theme === "light" ? "border-transparent" : "border-slate-200 dark:border-zinc-700 hover:border-slate-400"
                      }`}
                      style={{
                        backgroundColor: "#FFFFFF",
                        ...(theme === "light" ? selectedRingStyle : {}),
                      }}
                    >
                      {theme === "light" && (
                        <div className="absolute top-1 right-1 h-4 w-4 rounded-full text-white flex items-center justify-center text-[10px] shadow-xs z-20" style={checkBadgeStyle}>
                          <CheckIcon className="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <div className="w-2.5 h-1 rounded bg-[#0F172A]" />
                        <div className="w-5 h-1 rounded bg-slate-200" />
                      </div>
                      <div className="flex items-end gap-0.5 px-0.5">
                        <div className="w-1.5 h-3 bg-[#0F172A] rounded-xs" />
                        <div className="w-1.5 h-4.5 bg-slate-300 rounded-xs" />
                        <div className="w-1.5 h-2.5 bg-slate-200 rounded-xs" />
                      </div>
                    </div>
                    <span className="text-[11.5px] font-medium mt-1.5 text-slate-800 dark:text-zinc-200">Clair</span>
                  </div>

                  {/* Dark */}
                  <div onClick={() => handleThemeChange("dark")} className="cursor-pointer group flex flex-col items-center">
                    <div
                      className={`relative w-full h-[58px] rounded-lg overflow-hidden p-1.5 transition-all flex flex-col justify-between border ${
                        theme === "dark" ? "border-transparent" : "border-slate-200 dark:border-zinc-700 hover:border-slate-400"
                      }`}
                      style={{
                        backgroundColor: "#0A0A0A",
                        ...(theme === "dark" ? selectedRingStyle : {}),
                      }}
                    >
                      {theme === "dark" && (
                        <div className="absolute top-1 right-1 h-4 w-4 rounded-full text-white flex items-center justify-center text-[10px] shadow-xs z-20" style={checkBadgeStyle}>
                          <CheckIcon className="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <div className="w-2.5 h-1 rounded bg-white" />
                        <div className="w-5 h-1 rounded bg-zinc-800" />
                      </div>
                      <div className="flex items-end gap-0.5 px-0.5">
                        <div className="w-1.5 h-3 bg-zinc-600 rounded-xs" />
                        <div className="w-1.5 h-4.5 bg-zinc-700 rounded-xs" />
                        <div className="w-1.5 h-2.5 bg-zinc-800 rounded-xs" />
                      </div>
                    </div>
                    <span className="text-[11.5px] font-medium mt-1.5 text-slate-800 dark:text-zinc-200">Sombre</span>
                  </div>
                </div>
              </div>

              {/* SECTION 4: STYLE DU MENU */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12.5px] font-bold text-slate-900 dark:text-white">Style du Menu</span>
                  <button
                    type="button"
                    onClick={() => handleSidebarChange("sidebar")}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 cursor-pointer"
                    title="Réinitialiser"
                  >
                    <ArrowPathIcon className="h-3 w-3" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {/* Classique */}
                  <div onClick={() => handleSidebarChange("sidebar")} className="cursor-pointer group flex flex-col items-center">
                    <div
                      className={`relative w-full h-[54px] rounded-lg overflow-hidden transition-all flex border ${
                        sidebarVariant === "sidebar" ? "border-transparent" : "border-slate-200 dark:border-zinc-700 hover:border-slate-400"
                      }`}
                      style={{
                        backgroundColor: isDark ? "#121215" : "#FFFFFF",
                        ...(sidebarVariant === "sidebar" ? selectedRingStyle : {}),
                      }}
                    >
                      {sidebarVariant === "sidebar" && (
                        <div className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full text-white flex items-center justify-center text-[8px] shadow-xs z-20" style={checkBadgeStyle}>
                          <CheckIcon className="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                      )}
                      {/* Sidebar preview — couleur accent */}
                      <div className="w-5 h-full shrink-0" style={{ backgroundColor: `${accentHex}E6` }} />
                      <div className="flex-1 p-1 flex flex-col gap-1 bg-slate-50 dark:bg-zinc-900">
                        <div className="w-full h-1.5 rounded-xs bg-slate-200 dark:bg-zinc-800" />
                        <div className="flex-1 border border-slate-200 dark:border-zinc-800 rounded-xs bg-white dark:bg-zinc-950" />
                      </div>
                    </div>
                    <span className="text-[11.5px] font-medium mt-1.5 text-slate-800 dark:text-zinc-200">Classique</span>
                  </div>

                  {/* Flottante */}
                  <div onClick={() => handleSidebarChange("floating")} className="cursor-pointer group flex flex-col items-center">
                    <div
                      className={`relative w-full h-[54px] rounded-lg p-1 transition-all flex gap-1 border ${
                        sidebarVariant === "floating" ? "border-transparent" : "border-slate-200 dark:border-zinc-700 hover:border-slate-400"
                      }`}
                      style={{
                        backgroundColor: isDark ? "#0A0A0A" : "#F4F4F5",
                        ...(sidebarVariant === "floating" ? selectedRingStyle : {}),
                      }}
                    >
                      {sidebarVariant === "floating" && (
                        <div className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full text-white flex items-center justify-center text-[8px] shadow-xs z-20" style={checkBadgeStyle}>
                          <CheckIcon className="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                      )}
                      <div className="w-5 h-full rounded-md" style={{ backgroundColor: `${accentHex}E6` }} />
                      <div className="flex-1 h-full rounded-md border border-slate-200 dark:border-zinc-800 p-1 flex flex-col gap-1 bg-white dark:bg-zinc-900">
                        <div className="w-full h-1.5 rounded-xs bg-slate-200 dark:bg-zinc-800" />
                        <div className="flex-1 rounded-xs bg-slate-50 dark:bg-zinc-950" />
                      </div>
                    </div>
                    <span className="text-[11.5px] font-medium mt-1.5 text-slate-800 dark:text-zinc-200">Flottante</span>
                  </div>

                  {/* Encadrée */}
                  <div onClick={() => handleSidebarChange("inset")} className="cursor-pointer group flex flex-col items-center">
                    <div
                      className={`relative w-full h-[54px] rounded-lg p-1 transition-all flex gap-1 border ${
                        sidebarVariant === "inset" ? "border-transparent" : "border-slate-200 dark:border-zinc-700 hover:border-slate-400"
                      }`}
                      style={{
                        backgroundColor: isDark ? "#0A0A0A" : "#F4F4F5",
                        ...(sidebarVariant === "inset" ? selectedRingStyle : {}),
                      }}
                    >
                      {sidebarVariant === "inset" && (
                        <div className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full text-white flex items-center justify-center text-[8px] shadow-xs z-20" style={checkBadgeStyle}>
                          <CheckIcon className="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                      )}
                      <div className="w-5 h-full rounded-md" style={{ backgroundColor: `${accentHex}E6` }} />
                      <div className="flex-1 h-full rounded-md border border-slate-200 dark:border-zinc-800 p-1 flex flex-col gap-1 bg-white dark:bg-zinc-900 shadow-xs">
                        <div className="w-full h-1.5 rounded-xs bg-slate-200 dark:bg-zinc-800" />
                        <div className="flex-1 rounded-xs bg-slate-50 dark:bg-zinc-950" />
                      </div>
                    </div>
                    <span className="text-[11.5px] font-medium mt-1.5 text-slate-800 dark:text-zinc-200">Encadrée</span>
                  </div>
                </div>
              </div>

              {/* SECTION 5: MODE D'AFFICHAGE */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12.5px] font-bold text-slate-900 dark:text-white">Mode d&apos;affichage</span>
                  <button
                    type="button"
                    onClick={() => handleLayoutChange("push")}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 cursor-pointer"
                    title="Réinitialiser l'affichage"
                  >
                    <ArrowPathIcon className="h-3 w-3" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {/* Overlay */}
                  <div onClick={() => handleLayoutChange("overlay")} className="cursor-pointer group flex flex-col items-center">
                    <div
                      className={`relative w-full h-[50px] rounded-lg overflow-hidden transition-all flex items-center justify-center p-1 border ${
                        layoutMode === "overlay" ? "border-transparent" : "border-slate-200 dark:border-zinc-700 hover:border-slate-400"
                      }`}
                      style={{
                        backgroundColor: isDark ? "#0A0A0A" : "#F4F4F5",
                        ...(layoutMode === "overlay" ? selectedRingStyle : {}),
                      }}
                    >
                      {layoutMode === "overlay" && (
                        <div className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full text-white flex items-center justify-center text-[8px] shadow-xs z-20" style={checkBadgeStyle}>
                          <CheckIcon className="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                      )}
                      <div className="flex w-full h-full gap-1">
                        <div className="w-1/3 h-full rounded shadow-md z-10" style={{ backgroundColor: `${accentHex}E6` }} />
                        <div className="w-2/3 h-full rounded border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 opacity-60" />
                      </div>
                    </div>
                    <span className="text-[11.5px] font-medium mt-1.5 text-slate-800 dark:text-zinc-200">Overlay</span>
                  </div>

                  {/* Push */}
                  <div onClick={() => handleLayoutChange("push")} className="cursor-pointer group flex flex-col items-center">
                    <div
                      className={`relative w-full h-[50px] rounded-lg overflow-hidden transition-all flex items-center justify-center p-1 border ${
                        layoutMode === "push" || layoutMode === "default" ? "border-transparent" : "border-slate-200 dark:border-zinc-700 hover:border-slate-400"
                      }`}
                      style={{
                        backgroundColor: isDark ? "#0A0A0A" : "#F4F4F5",
                        ...((layoutMode === "push" || layoutMode === "default") ? selectedRingStyle : {}),
                      }}
                    >
                      {(layoutMode === "push" || layoutMode === "default") && (
                        <div className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full text-white flex items-center justify-center text-[8px] shadow-xs z-20" style={checkBadgeStyle}>
                          <CheckIcon className="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                      )}
                      <div className="flex w-full h-full gap-1">
                        <div className="w-1/3 h-full rounded" style={{ backgroundColor: `${accentHex}E6` }} />
                        <div className="w-2/3 h-full rounded border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900" />
                      </div>
                    </div>
                    <span className="text-[11.5px] font-medium mt-1.5 text-slate-800 dark:text-zinc-200">Push</span>
                  </div>

                  {/* Full */}
                  <div onClick={() => handleLayoutChange("full")} className="cursor-pointer group flex flex-col items-center">
                    <div
                      className={`relative w-full h-[50px] rounded-lg overflow-hidden transition-all flex items-center justify-center p-1 border ${
                        layoutMode === "full" ? "border-transparent" : "border-slate-200 dark:border-zinc-700 hover:border-slate-400"
                      }`}
                      style={{
                        backgroundColor: isDark ? "#0A0A0A" : "#F4F4F5",
                        ...(layoutMode === "full" ? selectedRingStyle : {}),
                      }}
                    >
                      {layoutMode === "full" && (
                        <div className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full text-white flex items-center justify-center text-[8px] shadow-xs z-20" style={checkBadgeStyle}>
                          <CheckIcon className="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                      )}
                      <div className="w-full h-full rounded border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center">
                        <div className="w-3/4 h-2 rounded opacity-60" style={{ backgroundColor: accentHex }} />
                      </div>
                    </div>
                    <span className="text-[11.5px] font-medium mt-1.5 text-slate-800 dark:text-zinc-200">Full</span>
                  </div>
                </div>
              </div>

              {/* SECTION 6: DEVISE & CONTEXTE RÉGIONAL */}
              <div>
                <span className="text-[12.5px] font-bold text-slate-900 dark:text-white block mb-2">
                  Devise &amp; Contexte Régional
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "fcfa", label: "FCFA", sub: "Bénin / UEMOA" },
                    { id: "eur", label: "Euros (€)", sub: "Diaspora Europe" },
                    { id: "usd", label: "Dollars ($)", sub: "International" },
                  ].map((curr) => (
                    <button
                      key={curr.id}
                      type="button"
                      onClick={() => setCurrency(curr.id as CurrencyMode)}
                      className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                        currency === curr.id
                          ? "font-bold"
                          : "border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300"
                      }`}
                      style={
                        currency === curr.id
                          ? {
                              borderColor: accentHex,
                              backgroundColor: `${accentHex}12`,
                              color: accentHex,
                              boxShadow: `0 0 0 1px ${accentHex}`,
                            }
                          : {}
                      }
                    >
                      <span className="text-[12px] block font-semibold">{curr.label}</span>
                      <span className="text-[9.5px] text-slate-500 dark:text-zinc-400 leading-none">{curr.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTION 7: SIMULATEUR DE PROFIL DEV */}
              <div className="pt-2 border-t border-slate-200 dark:border-zinc-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-2">
                  Mode Simulateur : Rôle Actif
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "bailleur", label: "Bailleur" },
                    { id: "agence", label: "Agence Immobilière" },
                    { id: "locataire", label: "Locataire" },
                    { id: "admin", label: "Admin HQ" },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setDevRole(r.id as any)}
                      className={`p-2 rounded-lg border text-left text-[12px] font-semibold transition-all cursor-pointer ${
                        devRole === r.id
                          ? "border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200"
                          : "border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ─── 3. FOOTER : RESET TOTAL ─── */}
            <div className="p-4 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 flex items-center justify-between">
              <button
                type="button"
                onClick={handleReset}
                className="text-[12px] font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
              >
                Réinitialiser tout
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[12.5px] font-semibold rounded-lg hover:opacity-90 transition shadow-xs cursor-pointer"
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
