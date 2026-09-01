"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebar, SidebarVariant, LayoutMode, ColorTheme, ThemeMode } from "@/components/ui/sidebar";
import {
  XMarkIcon,
  ArrowPathIcon,
  CheckIcon,
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
    devRole,
    setDevRole,
  } = useSidebar();

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
    setOpen(true);
  };

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/20 transition-opacity flex justify-end">
          {/* Backdrop Click (sans aucun flou pour voir le dashboard en direct) */}
          <div className="flex-1 cursor-pointer" onClick={onClose} />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 240 }}
            className="w-full max-w-[380px] bg-white dark:bg-[#18181B] text-slate-900 dark:text-zinc-100 border-l border-slate-200 dark:border-zinc-800 shadow-2xl h-full flex flex-col justify-between overflow-hidden select-none"
          >
            {/* ─── 1. HEADER ─── */}
            <div className="p-4 pb-3 border-b border-slate-200 dark:border-zinc-800 flex items-start justify-between">
              <div>
                <h2 className="text-[16px] font-bold tracking-tight text-slate-900 dark:text-white">
                  Personnalisation de l&apos;affichage
                </h2>
                <p className="text-[12px] text-slate-500 dark:text-zinc-400 mt-0.5 leading-snug">
                  Ajustez l&apos;apparence, les couleurs et la disposition selon vos préférences.
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
              {/* SECTION 1: MODE DE THÈME AVEC MINIATURES GRAPHIQUES */}
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
                  {/* System (Miniature Diagonale) */}
                  <div
                    onClick={() => handleThemeChange("system")}
                    className="cursor-pointer group flex flex-col items-center"
                  >
                    <div
                      className={`relative w-full h-[62px] rounded-lg overflow-hidden p-1.5 transition-all flex flex-col justify-between ${
                        theme === "system"
                          ? "ring-2 ring-emerald-600 border-2 border-transparent"
                          : "border border-slate-200 dark:border-zinc-700 hover:border-slate-400"
                      }`}
                      style={{
                        background: "linear-gradient(135deg, #FFFFFF 50%, #0F172A 50%)",
                      }}
                    >
                      {theme === "system" && (
                        <div className="absolute top-1 right-1 h-4 w-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] shadow-xs z-20">
                          <CheckIcon className="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                      )}
                      <div className="flex items-center gap-1 z-10">
                        <div className="w-2.5 h-1 rounded bg-[#0F172A]" />
                        <div className="w-5 h-1 rounded bg-slate-300" />
                      </div>
                      <div className="flex items-end justify-between px-0.5 z-10">
                        <div className="flex items-end gap-0.5">
                          <div className="w-1.5 h-3.5 bg-[#0F172A] rounded-xs" />
                          <div className="w-1.5 h-5 bg-slate-400 rounded-xs" />
                        </div>
                        <div className="flex items-end gap-0.5">
                          <div className="w-1.5 h-2.5 bg-white/40 rounded-xs" />
                          <div className="w-1.5 h-4 bg-white rounded-xs" />
                        </div>
                      </div>
                    </div>
                    <span className="text-[11.5px] font-medium mt-1.5 text-slate-800 dark:text-zinc-200">Système</span>
                  </div>

                  {/* Light (Miniature Pure White) */}
                  <div
                    onClick={() => handleThemeChange("light")}
                    className="cursor-pointer group flex flex-col items-center"
                  >
                    <div
                      className={`relative w-full h-[62px] rounded-lg overflow-hidden p-1.5 transition-all flex flex-col justify-between ${
                        theme === "light"
                          ? "ring-2 ring-emerald-600 border-2 border-transparent"
                          : "border border-slate-200 dark:border-zinc-700 hover:border-slate-400"
                      }`}
                      style={{ backgroundColor: "#FFFFFF" }}
                    >
                      {theme === "light" && (
                        <div className="absolute top-1 right-1 h-4 w-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] shadow-xs z-20">
                          <CheckIcon className="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <div className="w-2.5 h-1 rounded bg-[#0F172A]" />
                        <div className="w-5 h-1 rounded bg-slate-200" />
                      </div>
                      <div className="flex items-end gap-0.5 px-0.5">
                        <div className="w-1.5 h-3.5 bg-[#0F172A] rounded-xs" />
                        <div className="w-1.5 h-5 bg-slate-300 rounded-xs" />
                        <div className="w-1.5 h-3 bg-slate-200 rounded-xs" />
                      </div>
                    </div>
                    <span className="text-[11.5px] font-medium mt-1.5 text-slate-800 dark:text-zinc-200">Clair</span>
                  </div>

                  {/* Dark (Miniature Pure Black) */}
                  <div
                    onClick={() => handleThemeChange("dark")}
                    className="cursor-pointer group flex flex-col items-center"
                  >
                    <div
                      className={`relative w-full h-[62px] rounded-lg overflow-hidden p-1.5 transition-all flex flex-col justify-between ${
                        theme === "dark"
                          ? "ring-2 ring-emerald-600 border-2 border-transparent"
                          : "border border-slate-200 dark:border-zinc-700 hover:border-slate-400"
                      }`}
                      style={{ backgroundColor: "#0A0A0A" }}
                    >
                      {theme === "dark" && (
                        <div className="absolute top-1 right-1 h-4 w-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] shadow-xs z-20">
                          <CheckIcon className="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <div className="w-2.5 h-1 rounded bg-white" />
                        <div className="w-5 h-1 rounded bg-zinc-800" />
                      </div>
                      <div className="flex items-end gap-0.5 px-0.5">
                        <div className="w-1.5 h-3.5 bg-zinc-600 rounded-xs" />
                        <div className="w-1.5 h-5 bg-zinc-700 rounded-xs" />
                        <div className="w-1.5 h-3 bg-zinc-800 rounded-xs" />
                      </div>
                    </div>
                    <span className="text-[11.5px] font-medium mt-1.5 text-slate-800 dark:text-zinc-200">Sombre</span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: DISPOSITION DU MENU (SIDEBAR) AVEC MINIATURES */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12.5px] font-bold text-slate-900 dark:text-white">Style du Menu</span>
                  <button
                    type="button"
                    onClick={() => handleSidebarChange("sidebar")}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 cursor-pointer"
                    title="Réinitialiser la sidebar"
                  >
                    <ArrowPathIcon className="h-3 w-3" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {/* Classique (Ancrée) */}
                  <div
                    onClick={() => handleSidebarChange("sidebar")}
                    className="cursor-pointer group flex flex-col items-center"
                  >
                    <div
                      className={`relative w-full h-[62px] rounded-lg overflow-hidden transition-all flex ${
                        sidebarVariant === "sidebar"
                          ? "ring-2 ring-emerald-600 border-2 border-transparent"
                          : "border border-slate-200 dark:border-zinc-700 hover:border-slate-400"
                      }`}
                      style={{ backgroundColor: isDark ? "#121215" : "#FFFFFF" }}
                    >
                      {sidebarVariant === "sidebar" && (
                        <div className="absolute top-1 right-1 h-4 w-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] shadow-xs z-20">
                          <CheckIcon className="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                      )}
                      <div className="w-5 h-full shrink-0 bg-emerald-600/90" />
                      <div className="flex-1 p-1 flex flex-col gap-1 bg-slate-50 dark:bg-zinc-900">
                        <div className="w-full h-1.5 rounded-xs bg-slate-200 dark:bg-zinc-800" />
                        <div className="flex-1 border border-slate-200 dark:border-zinc-800 rounded-xs bg-white dark:bg-zinc-950" />
                      </div>
                    </div>
                    <span className="text-[11.5px] font-medium mt-1.5 text-slate-800 dark:text-zinc-200">Classique</span>
                  </div>

                  {/* Flottante */}
                  <div
                    onClick={() => handleSidebarChange("floating")}
                    className="cursor-pointer group flex flex-col items-center"
                  >
                    <div
                      className={`relative w-full h-[62px] rounded-lg p-1 transition-all flex gap-1 ${
                        sidebarVariant === "floating"
                          ? "ring-2 ring-emerald-600 border-2 border-transparent"
                          : "border border-slate-200 dark:border-zinc-700 hover:border-slate-400"
                      }`}
                      style={{ backgroundColor: isDark ? "#0A0A0A" : "#F4F4F5" }}
                    >
                      {sidebarVariant === "floating" && (
                        <div className="absolute top-1 right-1 h-4 w-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] shadow-xs z-20">
                          <CheckIcon className="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                      )}
                      <div className="w-5 h-full rounded-md bg-emerald-600/90 shadow-2xs" />
                      <div className="flex-1 h-full rounded-md border border-slate-200 dark:border-zinc-800 p-1 flex flex-col gap-1 bg-white dark:bg-zinc-900">
                        <div className="w-full h-1.5 rounded-xs bg-slate-200 dark:bg-zinc-800" />
                        <div className="flex-1 rounded-xs bg-slate-50 dark:bg-zinc-950" />
                      </div>
                    </div>
                    <span className="text-[11.5px] font-medium mt-1.5 text-slate-800 dark:text-zinc-200">Flottante</span>
                  </div>

                  {/* Encadrée (Inset) */}
                  <div
                    onClick={() => handleSidebarChange("inset")}
                    className="cursor-pointer group flex flex-col items-center"
                  >
                    <div
                      className={`relative w-full h-[62px] rounded-lg p-1 transition-all flex gap-1 ${
                        sidebarVariant === "inset"
                          ? "ring-2 ring-emerald-600 border-2 border-transparent"
                          : "border border-slate-200 dark:border-zinc-700 hover:border-slate-400"
                      }`}
                      style={{ backgroundColor: isDark ? "#0A0A0A" : "#F4F4F5" }}
                    >
                      {sidebarVariant === "inset" && (
                        <div className="absolute top-1 right-1 h-4 w-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] shadow-xs z-20">
                          <CheckIcon className="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                      )}
                      <div className="w-5 h-full rounded-md bg-emerald-600/90" />
                      <div className="flex-1 h-full rounded-md border border-slate-200 dark:border-zinc-800 p-1 flex flex-col gap-1 bg-white dark:bg-zinc-900 shadow-xs">
                        <div className="w-full h-1.5 rounded-xs bg-slate-200 dark:bg-zinc-800" />
                        <div className="flex-1 rounded-xs bg-slate-50 dark:bg-zinc-950" />
                      </div>
                    </div>
                    <span className="text-[11.5px] font-medium mt-1.5 text-slate-800 dark:text-zinc-200">Encadrée</span>
                  </div>
                </div>
              </div>

              {/* SECTION 3: MODE D'AFFICHAGE (OVERLAY / PUSH / FULL) */}
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
                  <div
                    onClick={() => handleLayoutChange("overlay")}
                    className="cursor-pointer group flex flex-col items-center"
                  >
                    <div
                      className={`relative w-full h-[52px] rounded-lg overflow-hidden transition-all flex items-center justify-center p-1 ${
                        layoutMode === "overlay"
                          ? "ring-2 ring-emerald-600 border-2 border-transparent"
                          : "border border-slate-200 dark:border-zinc-700 hover:border-slate-400"
                      }`}
                      style={{ backgroundColor: isDark ? "#0A0A0A" : "#F4F4F5" }}
                    >
                      {layoutMode === "overlay" && (
                        <div className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[8px] shadow-xs z-20">
                          <CheckIcon className="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                      )}
                      <div className="flex w-full h-full gap-1">
                        <div className="w-1/3 h-full rounded bg-emerald-600/90 shadow-md z-10" />
                        <div className="w-2/3 h-full rounded border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 opacity-60" />
                      </div>
                    </div>
                    <span className="text-[11.5px] font-medium mt-1.5 text-slate-800 dark:text-zinc-200">Overlay</span>
                  </div>

                  {/* Push */}
                  <div
                    onClick={() => handleLayoutChange("push")}
                    className="cursor-pointer group flex flex-col items-center"
                  >
                    <div
                      className={`relative w-full h-[52px] rounded-lg overflow-hidden transition-all flex items-center justify-center p-1 ${
                        layoutMode === "push" || layoutMode === "default"
                          ? "ring-2 ring-emerald-600 border-2 border-transparent"
                          : "border border-slate-200 dark:border-zinc-700 hover:border-slate-400"
                      }`}
                      style={{ backgroundColor: isDark ? "#0A0A0A" : "#F4F4F5" }}
                    >
                      {(layoutMode === "push" || layoutMode === "default") && (
                        <div className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[8px] shadow-xs z-20">
                          <CheckIcon className="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                      )}
                      <div className="flex w-full h-full gap-1">
                        <div className="w-1/3 h-full rounded bg-emerald-600/90" />
                        <div className="w-2/3 h-full rounded border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900" />
                      </div>
                    </div>
                    <span className="text-[11.5px] font-medium mt-1.5 text-slate-800 dark:text-zinc-200">Push</span>
                  </div>

                  {/* Full */}
                  <div
                    onClick={() => handleLayoutChange("full")}
                    className="cursor-pointer group flex flex-col items-center"
                  >
                    <div
                      className={`relative w-full h-[52px] rounded-lg overflow-hidden transition-all flex items-center justify-center p-1 ${
                        layoutMode === "full"
                          ? "ring-2 ring-emerald-600 border-2 border-transparent"
                          : "border border-slate-200 dark:border-zinc-700 hover:border-slate-400"
                      }`}
                      style={{ backgroundColor: isDark ? "#0A0A0A" : "#F4F4F5" }}
                    >
                      {layoutMode === "full" && (
                        <div className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[8px] shadow-xs z-20">
                          <CheckIcon className="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                      )}
                      <div className="w-full h-full rounded border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center">
                        <div className="w-3/4 h-2 rounded bg-emerald-600/60" />
                      </div>
                    </div>
                    <span className="text-[11.5px] font-medium mt-1.5 text-slate-800 dark:text-zinc-200">Full</span>
                  </div>
                </div>
              </div>

              {/* SECTION 4: COULEUR D'ACCENT */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12.5px] font-bold text-slate-900 dark:text-white">Couleur d&apos;Accent</span>
                  <button
                    type="button"
                    onClick={() => setColorTheme("emerald")}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 cursor-pointer"
                    title="Réinitialiser la couleur"
                  >
                    <ArrowPathIcon className="h-3 w-3" />
                  </button>
                </div>

                <div className="grid grid-cols-6 gap-2">
                  {[
                    { id: "emerald", name: "Émeraude", hex: "#059669" },
                    { id: "zinc", name: "Zinc", hex: "#0F172A" },
                    { id: "amber", name: "Or", hex: "#D97706" },
                    { id: "blue", name: "Saphir", hex: "#2563EB" },
                    { id: "violet", name: "Violet", hex: "#7C3AED" },
                    { id: "rose", name: "Rubis", hex: "#E11D48" },
                  ].map((col) => {
                    const isSelected = colorTheme === col.id;
                    return (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => setColorTheme(col.id as ColorTheme)}
                        className={`h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer relative ${
                          isSelected
                            ? "ring-2 ring-slate-900 dark:ring-white scale-105 shadow-sm"
                            : "hover:scale-105 border border-slate-200 dark:border-zinc-700"
                        }`}
                        style={{ backgroundColor: col.hex }}
                        title={col.name}
                      >
                        {isSelected && <CheckIcon className="h-4 w-4 text-white stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 5: SIMULATEUR DE PROFIL DEV */}
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
                Réinitialiser par défaut
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
