"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebar } from "@/components/ui/sidebar";
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
    mobileNavVariant,
    setMobileNavVariant,
    devRole,
    setDevRole,
  } = useSidebar();

  const handleThemeChange = (newTheme: "system" | "light" | "dark") => {
    setTheme(newTheme);
  };

  const handleSidebarChange = (variant: "inset" | "floating" | "sidebar") => {
    setVariant(variant);
  };

  const handleLayoutChange = (layout: "default" | "compact" | "full" | "push") => {
    setLayoutMode(layout);
  };

  const handleCurrencyChange = (curr: "fcfa" | "eur") => {
    setCurrency(curr);
  };

  const handleReset = () => {
    setTheme("light");
    setVariant("floating");
    setLayoutMode("default");
    setCurrency("fcfa");
    setColorTheme("zinc");
    setMobileNavVariant("dynamic");
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
        <div className="fixed inset-0 z-50 bg-black/15 transition-opacity flex justify-end">
          {/* Backdrop Click */}
          <div className="flex-1 cursor-pointer" onClick={onClose} />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 240 }}
            style={{
              backgroundColor: isDark ? "#18181B" : "#FFFFFF",
              borderColor: isDark ? "#27272A" : "#E8E5E0",
              color: isDark ? "#FAFAFA" : "#1C1C1C",
            }}
            className="w-full max-w-[380px] border-l shadow-2xl h-full flex flex-col justify-between overflow-hidden select-none"
          >
            {/* ─── 1. HEADER ─── */}
            <div
              style={{
                borderColor: isDark ? "#27272A" : "#E8E5E0",
                backgroundColor: isDark ? "#18181B" : "#FFFFFF",
              }}
              className="p-5 pb-4 border-b flex items-start justify-between"
            >
              <div>
                <h2
                  style={{ color: isDark ? "#FAFAFA" : "#1C1C1C" }}
                  className="text-[17px] font-bold tracking-tight"
                >
                  Theme Settings
                </h2>
                <p
                  style={{ color: isDark ? "#A1A1AA" : "#64635F" }}
                  className="text-[12px] mt-0.5 leading-snug"
                >
                  Adjust the appearance and layout to suit your preferences.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                style={{ color: isDark ? "#A1A1AA" : "#9C9A95" }}
                className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition cursor-pointer shrink-0"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* ─── 2. SECTIONS LIST ─── */}
            <div className="p-5 space-y-6 flex-1 overflow-y-auto">
              {/* SECTION 1: THEME */}
              <div>
                <div className="flex items-center gap-1.5 mb-2.5">
                  <span style={{ color: isDark ? "#FAFAFA" : "#1C1C1C" }} className="text-[13px] font-bold">Theme</span>
                  <button
                    type="button"
                    onClick={() => handleThemeChange("light")}
                    className="text-[#9C9A95] hover:text-[#1C1C1C] dark:hover:text-[#FAFAFA] cursor-pointer"
                    title="Réinitialiser le thème"
                  >
                    <ArrowPathIcon className="h-3 w-3" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {/* A. System (Split Oblique / Diagonal Light & Dark) */}
                  <div
                    onClick={() => handleThemeChange("system")}
                    className="cursor-pointer group flex flex-col items-center"
                  >
                    <div
                      className={`relative w-full h-[66px] rounded-[8px] overflow-hidden p-1.5 transition-all flex flex-col justify-between ${
                        theme === "system"
                          ? "ring-2 ring-[#1C1C1C] dark:ring-white border-2 border-transparent"
                          : "border border-[#E4E4E7] dark:border-[#3F3F46] hover:border-[#1C1C1C]/40"
                      }`}
                      style={{
                        background: "linear-gradient(135deg, #FFFFFF 50%, #18181B 50%)",
                      }}
                    >
                      {theme === "system" && (
                        <div className="absolute top-1 right-1 h-4 w-4 rounded-full bg-[#1C1C1C] dark:bg-white text-white dark:text-black flex items-center justify-center text-[10px] shadow-xs z-20">
                          <CheckIcon className="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                      )}
                      {/* Top Left (Light Side) */}
                      <div className="flex items-center gap-1 z-10">
                        <div className="w-2.5 h-1 rounded bg-[#18181B]" />
                        <div className="w-6 h-1 rounded bg-[#E4E4E7]" />
                      </div>
                      {/* Bottom Split Visuals */}
                      <div className="flex items-end justify-between px-0.5 z-10">
                        <div className="flex items-end gap-0.5">
                          <div className="w-1.5 h-4 bg-[#18181B] rounded-xs" />
                          <div className="w-1.5 h-6 bg-[#A1A1AA] rounded-xs" />
                        </div>
                        <div className="flex items-end gap-0.5">
                          <div className="w-1.5 h-3 bg-white/40 rounded-xs" />
                          <div className="w-1.5 h-5 bg-white rounded-xs" />
                        </div>
                      </div>
                    </div>
                    <span style={{ color: isDark ? "#FAFAFA" : "#1C1C1C" }} className="text-[11px] font-medium mt-1.5">System</span>
                  </div>

                  {/* B. Light (Always Pure White Card Preview) */}
                  <div
                    onClick={() => handleThemeChange("light")}
                    className="cursor-pointer group flex flex-col items-center"
                  >
                    <div
                      className={`relative w-full h-[66px] rounded-[8px] p-1.5 transition-all flex flex-col justify-between ${
                        theme === "light"
                          ? "ring-2 ring-[#1C1C1C] dark:ring-white border-2 border-transparent shadow-xs"
                          : "border border-[#E4E4E7] dark:border-[#3F3F46] hover:border-[#1C1C1C]/40"
                      }`}
                      style={{ backgroundColor: "#FFFFFF" }}
                    >
                      {theme === "light" && (
                        <div className="absolute top-1 right-1 h-4 w-4 rounded-full bg-[#1C1C1C] text-white flex items-center justify-center text-[10px] shadow-xs z-20">
                          <CheckIcon className="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <div className="w-2.5 h-1 rounded" style={{ backgroundColor: "#18181B" }} />
                        <div className="flex-1 h-1 rounded" style={{ backgroundColor: "#E4E4E7" }} />
                      </div>
                      <div className="flex items-end justify-between px-1">
                        <div className="flex items-end gap-0.5">
                          <div className="w-1.5 h-5 rounded-xs" style={{ backgroundColor: "#52525B" }} />
                          <div className="w-1.5 h-7 rounded-xs" style={{ backgroundColor: "#18181B" }} />
                          <div className="w-1.5 h-3 rounded-xs" style={{ backgroundColor: "#E4E4E7" }} />
                        </div>
                        <div className="h-6 w-6 rounded-full border flex items-center justify-center" style={{ borderColor: "#E4E4E7", backgroundColor: "#FAFAFA" }}>
                          <div className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: "#18181B" }} />
                        </div>
                      </div>
                    </div>
                    <span style={{ color: isDark ? "#FAFAFA" : "#1C1C1C" }} className="text-[11px] font-medium mt-1.5">Light</span>
                  </div>

                  {/* C. Dark (Always Pure Dark Navy/Black Card Preview) */}
                  <div
                    onClick={() => handleThemeChange("dark")}
                    className="cursor-pointer group flex flex-col items-center"
                  >
                    <div
                      className={`relative w-full h-[66px] rounded-[8px] p-1.5 transition-all flex flex-col justify-between ${
                        theme === "dark"
                          ? "ring-2 ring-[#1C1C1C] dark:ring-white border-2 border-transparent shadow-xs"
                          : "border border-[#E4E4E7] dark:border-[#3F3F46] hover:border-white/50"
                      }`}
                      style={{ backgroundColor: "#18181B" }}
                    >
                      {theme === "dark" && (
                        <div className="absolute top-1 right-1 h-4 w-4 rounded-full bg-white text-black flex items-center justify-center text-[10px] shadow-xs z-20">
                          <CheckIcon className="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <div className="w-2.5 h-1 rounded" style={{ backgroundColor: "#FFFFFF" }} />
                        <div className="flex-1 h-1 rounded" style={{ backgroundColor: "#3F3F46" }} />
                      </div>
                      <div className="flex items-end justify-between px-1">
                        <div className="flex items-end gap-0.5">
                          <div className="w-1.5 h-5 rounded-xs" style={{ backgroundColor: "#71717A" }} />
                          <div className="w-1.5 h-7 rounded-xs" style={{ backgroundColor: "#FFFFFF" }} />
                          <div className="w-1.5 h-3 rounded-xs" style={{ backgroundColor: "#3F3F46" }} />
                        </div>
                        <div className="h-6 w-6 rounded-full border flex items-center justify-center" style={{ borderColor: "#3F3F46", backgroundColor: "#27272A" }}>
                          <div className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: "#FFFFFF" }} />
                        </div>
                      </div>
                    </div>
                    <span style={{ color: isDark ? "#FAFAFA" : "#1C1C1C" }} className="text-[11px] font-medium mt-1.5">Dark</span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: SIDEBAR */}
              <div>
                <div className="flex items-center gap-1.5 mb-2.5">
                  <span style={{ color: isDark ? "#FAFAFA" : "#1C1C1C" }} className="text-[13px] font-bold">Sidebar</span>
                  <button
                    type="button"
                    onClick={() => handleSidebarChange("floating")}
                    className="text-[#9C9A95] hover:text-[#1C1C1C] dark:hover:text-[#FAFAFA] cursor-pointer"
                    title="Réinitialiser la sidebar"
                  >
                    <ArrowPathIcon className="h-3 w-3" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {/* Inset */}
                  <div
                    onClick={() => handleSidebarChange("inset")}
                    className="cursor-pointer group flex flex-col items-center"
                  >
                    <div
                      className={`relative w-full h-[66px] rounded-[8px] p-1.5 transition-all flex gap-1.5 ${
                        sidebarVariant === "inset"
                          ? "ring-2 ring-[#1C1C1C] dark:ring-white border-2 border-transparent"
                          : "border border-[#E4E4E7] dark:border-[#3F3F46] hover:border-[#1C1C1C]/40"
                      }`}
                      style={{ backgroundColor: "#F4F4F5" }}
                    >
                      {sidebarVariant === "inset" && (
                        <div className="absolute top-1 right-1 h-4 w-4 rounded-full bg-[#1C1C1C] dark:bg-white text-white dark:text-black flex items-center justify-center text-[10px] shadow-xs z-20">
                          <CheckIcon className="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                      )}
                      <div className="w-5 h-full rounded-[4px]" style={{ backgroundColor: "#18181B" }} />
                      <div className="flex-1 h-full rounded-[4px] border p-1 flex flex-col gap-1" style={{ backgroundColor: "#FFFFFF", borderColor: "#E4E4E7" }}>
                        <div className="w-full h-2 rounded-xs" style={{ backgroundColor: "#E4E4E7" }} />
                        <div className="flex-1 rounded-xs" style={{ backgroundColor: "#F4F4F5" }} />
                      </div>
                    </div>
                    <span style={{ color: isDark ? "#FAFAFA" : "#1C1C1C" }} className="text-[11px] font-medium mt-1.5">Inset</span>
                  </div>

                  {/* Floating */}
                  <div
                    onClick={() => handleSidebarChange("floating")}
                    className="cursor-pointer group flex flex-col items-center"
                  >
                    <div
                      className={`relative w-full h-[66px] rounded-[8px] p-1.5 transition-all flex gap-1.5 ${
                        sidebarVariant === "floating"
                          ? "ring-2 ring-[#1C1C1C] dark:ring-white border-2 border-transparent"
                          : "border border-[#E4E4E7] dark:border-[#3F3F46] hover:border-[#1C1C1C]/40"
                      }`}
                      style={{ backgroundColor: "#F4F4F5" }}
                    >
                      {sidebarVariant === "floating" && (
                        <div className="absolute top-1 right-1 h-4 w-4 rounded-full bg-[#1C1C1C] dark:bg-white text-white dark:text-black flex items-center justify-center text-[10px] shadow-xs z-20">
                          <CheckIcon className="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                      )}
                      <div className="w-5 my-0.5 h-[calc(100%-4px)] rounded-[4px] shadow-xs" style={{ backgroundColor: "#18181B" }} />
                      <div className="flex-1 h-full rounded-[4px] border p-1 flex flex-col gap-1" style={{ backgroundColor: "#FFFFFF", borderColor: "#E4E4E7" }}>
                        <div className="w-full h-2 rounded-xs" style={{ backgroundColor: "#E4E4E7" }} />
                        <div className="flex-1 rounded-xs" style={{ backgroundColor: "#F4F4F5" }} />
                      </div>
                    </div>
                    <span style={{ color: isDark ? "#FAFAFA" : "#1C1C1C" }} className="text-[11px] font-medium mt-1.5">Floating</span>
                  </div>

                  {/* Sidebar */}
                  <div
                    onClick={() => handleSidebarChange("sidebar")}
                    className="cursor-pointer group flex flex-col items-center"
                  >
                    <div
                      className={`relative w-full h-[66px] rounded-[8px] overflow-hidden transition-all flex ${
                        sidebarVariant === "sidebar"
                          ? "ring-2 ring-[#1C1C1C] dark:ring-white border-2 border-transparent"
                          : "border border-[#E4E4E7] dark:border-[#3F3F46] hover:border-[#1C1C1C]/40"
                      }`}
                      style={{ backgroundColor: "#FFFFFF" }}
                    >
                      {sidebarVariant === "sidebar" && (
                        <div className="absolute top-1 right-1 h-4 w-4 rounded-full bg-[#1C1C1C] dark:bg-white text-white dark:text-black flex items-center justify-center text-[10px] shadow-xs z-20">
                          <CheckIcon className="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                      )}
                      <div className="w-5 h-full shrink-0" style={{ backgroundColor: "#18181B" }} />
                      <div className="flex-1 p-1.5 flex flex-col gap-1" style={{ backgroundColor: "#F4F4F5" }}>
                        <div className="w-full h-2 rounded-xs" style={{ backgroundColor: "#E4E4E7" }} />
                        <div className="flex-1 border rounded-xs" style={{ backgroundColor: "#FFFFFF", borderColor: "#E4E4E7" }} />
                      </div>
                    </div>
                    <span style={{ color: isDark ? "#FAFAFA" : "#1C1C1C" }} className="text-[11px] font-medium mt-1.5">Sidebar</span>
                  </div>
                </div>
              </div>

              {/* SECTION 3: MODE D'AFFICHAGE (DEFAULT / PUSH / FULL) */}
              <div>
                <div className="flex items-center gap-1.5 mb-2.5">
                  <span style={{ color: isDark ? "#FAFAFA" : "#1C1C1C" }} className="text-[13px] font-bold">Mode d'affichage</span>
                  <button
                    type="button"
                    onClick={() => setLayoutMode("default")}
                    className="text-[#9C9A95] hover:text-[#1C1C1C] dark:hover:text-[#FAFAFA] cursor-pointer"
                    title="Réinitialiser l'affichage"
                  >
                    <ArrowPathIcon className="h-3 w-3" />
                  </button>
                </div>
                
                <div className="grid grid-cols-3 gap-2.5">
                  {/* Default (Overlay) */}
                  <div
                    onClick={() => handleLayoutChange("default")}
                    className="cursor-pointer group flex flex-col items-center"
                  >
                    <div
                      className={`relative w-full h-[54px] rounded-[8px] overflow-hidden transition-all flex items-center justify-center ${
                        layoutMode === "default"
                          ? "ring-2 ring-[#1C1C1C] dark:ring-white border-2 border-transparent"
                          : "border border-[#E4E4E7] dark:border-[#3F3F46] hover:border-[#1C1C1C]/40"
                      }`}
                      style={{ backgroundColor: isDark ? "#18181B" : "#F4F4F5" }}
                    >
                      {layoutMode === "default" && (
                        <div className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full bg-[#1C1C1C] dark:bg-white text-white dark:text-black flex items-center justify-center text-[8px] shadow-xs z-20">
                          <CheckIcon className="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                      )}
                      <div className="flex w-full h-full p-1 gap-1">
                        <div className="w-1/3 h-full rounded shadow-sm border z-10" style={{ backgroundColor: isDark ? "#27272A" : "#FFFFFF", borderColor: isDark ? "#3F3F46" : "#E4E4E7" }} />
                        <div className="w-2/3 h-full rounded opacity-30" style={{ backgroundColor: isDark ? "#3F3F46" : "#D4D4D8" }} />
                      </div>
                    </div>
                    <span style={{ color: isDark ? "#FAFAFA" : "#1C1C1C" }} className="text-[11px] font-medium mt-1.5 text-center">Overlay</span>
                  </div>

                  {/* Push Layout */}
                  <div
                    onClick={() => handleLayoutChange("push")}
                    className="cursor-pointer group flex flex-col items-center"
                  >
                    <div
                      className={`relative w-full h-[54px] rounded-[8px] overflow-hidden transition-all flex items-center justify-center ${
                        layoutMode === "push"
                          ? "ring-2 ring-[#1C1C1C] dark:ring-white border-2 border-transparent"
                          : "border border-[#E4E4E7] dark:border-[#3F3F46] hover:border-[#1C1C1C]/40"
                      }`}
                      style={{ backgroundColor: isDark ? "#18181B" : "#F4F4F5" }}
                    >
                      {layoutMode === "push" && (
                        <div className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full bg-[#1C1C1C] dark:bg-white text-white dark:text-black flex items-center justify-center text-[8px] shadow-xs z-20">
                          <CheckIcon className="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                      )}
                      <div className="flex w-full h-full p-1 gap-1">
                        <div className="w-1/3 h-full rounded shadow-sm border z-10 translate-x-1" style={{ backgroundColor: isDark ? "#27272A" : "#FFFFFF", borderColor: isDark ? "#3F3F46" : "#E4E4E7" }} />
                        <div className="w-2/3 h-full rounded opacity-30 translate-x-1" style={{ backgroundColor: isDark ? "#3F3F46" : "#D4D4D8" }} />
                      </div>
                    </div>
                    <span style={{ color: isDark ? "#FAFAFA" : "#1C1C1C" }} className="text-[11px] font-medium mt-1.5 text-center">Push</span>
                  </div>

                  {/* Full Layout */}
                  <div
                    onClick={() => handleLayoutChange("full")}
                    className="cursor-pointer group flex flex-col items-center"
                  >
                    <div
                      className={`relative w-full h-[54px] rounded-[8px] overflow-hidden transition-all flex items-center justify-center ${
                        layoutMode === "full"
                          ? "ring-2 ring-[#1C1C1C] dark:ring-white border-2 border-transparent"
                          : "border border-[#E4E4E7] dark:border-[#3F3F46] hover:border-[#1C1C1C]/40"
                      }`}
                      style={{ backgroundColor: isDark ? "#18181B" : "#F4F4F5" }}
                    >
                      {layoutMode === "full" && (
                        <div className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full bg-[#1C1C1C] dark:bg-white text-white dark:text-black flex items-center justify-center text-[8px] shadow-xs z-20">
                          <CheckIcon className="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                      )}
                      <div className="flex w-full h-full p-1 gap-1">
                        <div className="w-0 h-full rounded opacity-0" />
                        <div className="w-full h-full rounded opacity-100 shadow-sm border" style={{ backgroundColor: isDark ? "#27272A" : "#FFFFFF", borderColor: isDark ? "#3F3F46" : "#E4E4E7" }} />
                      </div>
                    </div>
                    <span style={{ color: isDark ? "#FAFAFA" : "#1C1C1C" }} className="text-[11px] font-medium mt-1.5 text-center">Full</span>
                  </div>
                </div>
              </div>

              {/* SECTION 3.5: MOBILE NAVIGATION */}
              <div className="md:hidden">
                <div className="flex items-center gap-1.5 mb-2.5">
                  <span style={{ color: isDark ? "#FAFAFA" : "#1C1C1C" }} className="text-[13px] font-bold">Mobile Nav</span>
                  <button
                    type="button"
                    onClick={() => setMobileNavVariant("dynamic")}
                    className="text-[#9C9A95] hover:text-[#1C1C1C] dark:hover:text-[#FAFAFA] cursor-pointer"
                    title="Réinitialiser la navigation mobile"
                  >
                    <ArrowPathIcon className="h-3 w-3" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {/* Island */}
                  <div
                    onClick={() => setMobileNavVariant("island")}
                    className="cursor-pointer group flex flex-col items-center"
                  >
                    <div
                      className={`relative w-full h-[66px] rounded-[8px] p-1.5 transition-all flex items-end justify-start ${
                        mobileNavVariant === "island"
                          ? "ring-2 ring-[#1C1C1C] dark:ring-white border-2 border-transparent"
                          : "border border-[#E4E4E7] dark:border-[#3F3F46] hover:border-[#1C1C1C]/40"
                      }`}
                      style={{ backgroundColor: "#F4F4F5" }}
                    >
                      {mobileNavVariant === "island" && (
                        <div className="absolute top-1 right-1 h-4 w-4 rounded-full bg-[#1C1C1C] dark:bg-white text-white dark:text-black flex items-center justify-center text-[10px] shadow-xs z-20">
                          <CheckIcon className="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                      )}
                      <div className="w-8 h-10 rounded-[6px] shadow-sm ml-1 mb-1 border" style={{ backgroundColor: "#FFFFFF", borderColor: "#E4E4E7" }} />
                    </div>
                    <span style={{ color: isDark ? "#FAFAFA" : "#1C1C1C" }} className="text-[11px] font-medium mt-1.5">Island</span>
                  </div>

                  {/* Dynamic */}
                  <div
                    onClick={() => setMobileNavVariant("dynamic")}
                    className="cursor-pointer group flex flex-col items-center"
                  >
                    <div
                      className={`relative w-full h-[66px] rounded-[8px] p-1.5 transition-all flex flex-col items-center justify-start ${
                        mobileNavVariant === "dynamic"
                          ? "ring-2 ring-[#1C1C1C] dark:ring-white border-2 border-transparent"
                          : "border border-[#E4E4E7] dark:border-[#3F3F46] hover:border-[#1C1C1C]/40"
                      }`}
                      style={{ backgroundColor: "#F4F4F5" }}
                    >
                      {mobileNavVariant === "dynamic" && (
                        <div className="absolute top-1 right-1 h-4 w-4 rounded-full bg-[#1C1C1C] dark:bg-white text-white dark:text-black flex items-center justify-center text-[10px] shadow-xs z-20">
                          <CheckIcon className="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                      )}
                      <div className="w-[80%] h-4 rounded-full shadow-sm mt-1 border" style={{ backgroundColor: "#FFFFFF", borderColor: "#E4E4E7" }} />
                    </div>
                    <span style={{ color: isDark ? "#FAFAFA" : "#1C1C1C" }} className="text-[11px] font-medium mt-1.5">Dynamic</span>
                  </div>

                  {/* Fullscreen */}
                  <div
                    onClick={() => setMobileNavVariant("fullscreen")}
                    className="cursor-pointer group flex flex-col items-center"
                  >
                    <div
                      className={`relative w-full h-[66px] rounded-[8px] overflow-hidden p-1.5 transition-all flex flex-col items-center justify-center gap-1 ${
                        mobileNavVariant === "fullscreen"
                          ? "ring-2 ring-[#1C1C1C] dark:ring-white border-2 border-transparent"
                          : "border border-[#E4E4E7] dark:border-[#3F3F46] hover:border-[#1C1C1C]/40"
                      }`}
                      style={{ backgroundColor: "#18181B" }}
                    >
                      {mobileNavVariant === "fullscreen" && (
                        <div className="absolute top-1 right-1 h-4 w-4 rounded-full bg-white text-black flex items-center justify-center text-[10px] shadow-xs z-20">
                          <CheckIcon className="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                      )}
                      <div className="w-10 h-1.5 rounded-full bg-white/50" />
                      <div className="w-14 h-1.5 rounded-full bg-white/50" />
                      <div className="w-12 h-1.5 rounded-full bg-white/50" />
                    </div>
                    <span style={{ color: isDark ? "#FAFAFA" : "#1C1C1C" }} className="text-[11px] font-medium mt-1.5">Fullscreen</span>
                  </div>
                </div>
              </div>

              {/* SECTION 4: COULEUR D'ACCENT (ACCENT COLOR PALETTE) */}
              <div>
                <div className="flex items-center gap-1.5 mb-2.5">
                  <span style={{ color: isDark ? "#FAFAFA" : "#1C1C1C" }} className="text-[13px] font-bold">Couleur d&apos;Accent</span>
                  <button
                    type="button"
                    onClick={() => setColorTheme("zinc")}
                    className="text-[#9C9A95] hover:text-[#1C1C1C] dark:hover:text-[#FAFAFA] cursor-pointer"
                    title="Réinitialiser la couleur"
                  >
                    <ArrowPathIcon className="h-3 w-3" />
                  </button>
                </div>

                <div className="grid grid-cols-6 gap-2">
                  {[
                    { id: "zinc", name: "Zinc", hex: "#18181B" },
                    { id: "emerald", name: "Émeraude", hex: "#059669" },
                    { id: "amber", name: "Or / Gold", hex: "#D97706" },
                    { id: "blue", name: "Saphir", hex: "#2563EB" },
                    { id: "violet", name: "Violet", hex: "#7C3AED" },
                    { id: "rose", name: "Rubis", hex: "#E11D48" },
                  ].map((col) => {
                    const isSelected = colorTheme === col.id;
                    return (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => setColorTheme(col.id as any)}
                        title={col.name}
                        className={`group relative h-9 w-full rounded-[8px] flex items-center justify-center transition-all cursor-pointer ${
                          isSelected
                            ? "ring-2 ring-[#1C1C1C] dark:ring-white ring-offset-2 scale-105"
                            : "hover:scale-105 opacity-85 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: col.hex }}
                      >
                        {isSelected && (
                          <CheckIcon className="h-4 w-4 text-white stroke-[3]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* DEV MODE PROFILE SWITCHER */}
              <div className="pt-4 border-t" style={{ borderColor: isDark ? "#27272A" : "#E8E5E0" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500">
                    Mode Dev : Changer de profil
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {(["agence", "bailleur", "locataire", "admin"] as const).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => {
                        setDevRole(role);
                        window.location.href = role === "locataire" 
                          ? "/dashboard/locataire" 
                          : role === "admin" 
                          ? "/dashboard/admin" 
                          : "/dashboard";
                      }}
                      className={`px-3 py-2 rounded-[8px] text-[12px] font-bold border transition-colors cursor-pointer ${
                        devRole === role
                          ? "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700"
                          : "bg-transparent text-[inherit] border-[#E4E4E7] dark:border-[#3F3F46] hover:border-amber-400"
                      }`}
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTION 5: DEVISE & CONTEXTE LOKKA */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <span style={{ color: isDark ? "#FAFAFA" : "#1C1C1C" }} className="text-[13px] font-bold">Devise &amp; Contexte</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleCurrencyChange("fcfa")}
                    style={{
                      backgroundColor:
                        currency === "fcfa"
                          ? isDark
                            ? "#FFFFFF"
                            : "#1C1C1C"
                          : isDark
                          ? "#27272A"
                          : "#FFFFFF",
                      borderColor:
                        currency === "fcfa"
                          ? isDark
                            ? "#FFFFFF"
                            : "#1C1C1C"
                          : isDark
                          ? "#3F3F46"
                          : "#E8E5E0",
                      color:
                        currency === "fcfa"
                          ? isDark
                            ? "#000000"
                            : "#FFFFFF"
                          : isDark
                          ? "#A1A1AA"
                          : "#64635F",
                    }}
                    className="py-2 px-3 rounded-[6px] border text-center font-bold text-[12px] transition cursor-pointer"
                  >
                    FCFA (Bénin 🇧🇯)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCurrencyChange("eur")}
                    style={{
                      backgroundColor:
                        currency === "eur"
                          ? isDark
                            ? "#FFFFFF"
                            : "#1C1C1C"
                          : isDark
                          ? "#27272A"
                          : "#FFFFFF",
                      borderColor:
                        currency === "eur"
                          ? isDark
                            ? "#FFFFFF"
                            : "#1C1C1C"
                          : isDark
                          ? "#3F3F46"
                          : "#E8E5E0",
                      color:
                        currency === "eur"
                          ? isDark
                            ? "#000000"
                            : "#FFFFFF"
                          : isDark
                          ? "#A1A1AA"
                          : "#64635F",
                    }}
                    className="py-2 px-3 rounded-[6px] border text-center font-bold text-[12px] transition cursor-pointer"
                  >
                    Euros (€ Diaspora)
                  </button>
                </div>
              </div>
            </div>

            {/* ─── 3. FOOTER (BIG RED RESET BUTTON) ─── */}
            <div
              style={{
                backgroundColor: isDark ? "#18181B" : "#FFFFFF",
                borderColor: isDark ? "#27272A" : "#E8E5E0",
              }}
              className="p-4 border-t"
            >
              <button
                type="button"
                onClick={handleReset}
                className="w-full py-2.5 px-4 bg-[#E03131] hover:bg-[#C92A2A] text-white text-[13px] font-bold rounded-[8px] transition-colors shadow-xs active:scale-[0.99] cursor-pointer text-center"
              >
                Reset
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
