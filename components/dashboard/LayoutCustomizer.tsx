"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebar, SidebarVariant, LayoutMode, ColorTheme } from "@/components/ui/sidebar";
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

  const handleThemeChange = (newTheme: "system" | "light" | "dark") => {
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
    setLayoutMode("full");
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
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity flex justify-end">
          {/* Backdrop Click */}
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
                  Ajustez le style, la largeur et le thème de votre espace.
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
              {/* SECTION 1: THEME */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12.5px] font-bold text-slate-900 dark:text-white">Thème d&apos;apparence</span>
                  <button
                    type="button"
                    onClick={() => handleThemeChange("light")}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 cursor-pointer"
                    title="Réinitialiser"
                  >
                    <ArrowPathIcon className="h-3 w-3" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {/* System */}
                  <button
                    type="button"
                    onClick={() => handleThemeChange("system")}
                    className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                      theme === "system"
                        ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 font-bold ring-1 ring-emerald-600"
                        : "border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300"
                    }`}
                  >
                    <span className="text-[11.5px] block font-semibold">Automatique</span>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500">Système</span>
                  </button>

                  {/* Light */}
                  <button
                    type="button"
                    onClick={() => handleThemeChange("light")}
                    className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                      theme === "light"
                        ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 font-bold ring-1 ring-emerald-600"
                        : "border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300"
                    }`}
                  >
                    <span className="text-[11.5px] block font-semibold">Clair</span>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500">Jour</span>
                  </button>

                  {/* Dark */}
                  <button
                    type="button"
                    onClick={() => handleThemeChange("dark")}
                    className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                      theme === "dark"
                        ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 font-bold ring-1 ring-emerald-600"
                        : "border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300"
                    }`}
                  >
                    <span className="text-[11.5px] block font-semibold">Sombre</span>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500">Nuit</span>
                  </button>
                </div>
              </div>

              {/* SECTION 2: STYLE DU MENU (SIDEBAR) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12.5px] font-bold text-slate-900 dark:text-white">Disposition du Menu</span>
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
                  <button
                    type="button"
                    onClick={() => handleSidebarChange("sidebar")}
                    className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                      sidebarVariant === "sidebar"
                        ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 font-bold ring-1 ring-emerald-600"
                        : "border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300"
                    }`}
                  >
                    <span className="text-[11.5px] block font-semibold">Classique</span>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500">Ancrée</span>
                  </button>

                  {/* Flottante */}
                  <button
                    type="button"
                    onClick={() => handleSidebarChange("floating")}
                    className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                      sidebarVariant === "floating"
                        ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 font-bold ring-1 ring-emerald-600"
                        : "border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300"
                    }`}
                  >
                    <span className="text-[11.5px] block font-semibold">Flottante</span>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500">Îlot</span>
                  </button>

                  {/* Encadrée */}
                  <button
                    type="button"
                    onClick={() => handleSidebarChange("inset")}
                    className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                      sidebarVariant === "inset"
                        ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 font-bold ring-1 ring-emerald-600"
                        : "border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300"
                    }`}
                  >
                    <span className="text-[11.5px] block font-semibold">Encadrée</span>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500">Carte</span>
                  </button>
                </div>
              </div>

              {/* SECTION 3: LARGEUR DU TABLEAU DE BORD */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12.5px] font-bold text-slate-900 dark:text-white">Largeur de l&apos;Écran</span>
                  <button
                    type="button"
                    onClick={() => handleLayoutChange("full")}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 cursor-pointer"
                    title="Réinitialiser"
                  >
                    <ArrowPathIcon className="h-3 w-3" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {/* Pleine Largeur */}
                  <button
                    type="button"
                    onClick={() => handleLayoutChange("full")}
                    className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                      layoutMode === "full"
                        ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 font-bold ring-1 ring-emerald-600"
                        : "border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300"
                    }`}
                  >
                    <span className="text-[11.5px] block font-semibold">Pleine page</span>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500">Fluide 100%</span>
                  </button>

                  {/* Compact Centré */}
                  <button
                    type="button"
                    onClick={() => handleLayoutChange("compact")}
                    className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                      layoutMode === "compact"
                        ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 font-bold ring-1 ring-emerald-600"
                        : "border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300"
                    }`}
                  >
                    <span className="text-[11.5px] block font-semibold">Compacte</span>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500">Centrée</span>
                  </button>

                  {/* Focus */}
                  <button
                    type="button"
                    onClick={() => handleLayoutChange("push")}
                    className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                      layoutMode === "push"
                        ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 font-bold ring-1 ring-emerald-600"
                        : "border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300"
                    }`}
                  >
                    <span className="text-[11.5px] block font-semibold">Mode Focus</span>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500">Menu réduit</span>
                  </button>
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
                    title="Réinitialiser"
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
