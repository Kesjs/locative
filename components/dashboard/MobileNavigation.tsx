"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebar } from "@/components/ui/sidebar";
import { useUserProfile } from "@/hooks/useUserProfile";
import { getNavItems } from "@/components/dashboard/AppSidebar";
import { XMarkIcon } from "@heroicons/react/24/outline";

export function MobileNavigation() {
  const { openMobile, setOpenMobile, mobileNavVariant, theme, devRole } = useSidebar();
  const pathname = usePathname();
  const userProfile = useUserProfile();
  const navItems = getNavItems(devRole || userProfile.role || "bailleur");

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  if (!openMobile) return null;

  const handleClose = () => setOpenMobile(false);

  // === VARIANT 1: ISLAND ===
  if (mobileNavVariant === "island") {
    return (
      <AnimatePresence>
        {openMobile && (
          <div className="fixed inset-0 z-[100] flex justify-start">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative z-10 m-3 w-[280px] h-[calc(100vh-24px)] rounded-[20px] overflow-hidden flex flex-col shadow-2xl border"
              style={{
                backgroundColor: isDark ? "#18181B" : "#FFFFFF",
                borderColor: isDark ? "#27272A" : "#E8E5E0",
              }}
            >
              <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: isDark ? "#27272A" : "#E8E5E0" }}>
                <span className="font-extrabold text-[18px] tracking-tight text-[var(--text-primary)]">Lokka</span>
                <button onClick={handleClose} className="p-1.5 bg-black/5 dark:bg-white/10 rounded-full text-[var(--text-secondary)]">
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.url || pathname.startsWith(item.url + "/");
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.title}
                      href={item.url}
                      onClick={handleClose}
                      className={`flex items-center gap-3 px-4 py-3 rounded-[12px] transition-colors ${
                        isActive
                          ? "bg-[var(--color-brand-primary)] text-white font-bold shadow-md"
                          : "text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)] font-medium"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-[14px]">{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  }

  // === VARIANT 2: DYNAMIC HEADER ===
  if (mobileNavVariant === "dynamic") {
    return (
      <AnimatePresence>
        {openMobile && (
          <div className="fixed inset-0 z-[100]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-black/20 backdrop-blur-md"
            />
            <motion.div
              initial={{ y: -20, opacity: 0, scale: 0.95 }}
              animate={{ y: 8, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 22, stiffness: 200 }}
              className="absolute top-0 left-2 right-2 rounded-[24px] shadow-2xl border overflow-hidden"
              style={{
                backgroundColor: isDark ? "#18181B" : "#FFFFFF",
                borderColor: isDark ? "#27272A" : "#E8E5E0",
              }}
            >
              <div className="p-4 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-[var(--color-brand-primary)] text-white flex items-center justify-center font-bold text-[12px]">
                      {userProfile.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="font-bold text-[15px] text-[var(--text-primary)]">{userProfile.name}</span>
                  </div>
                  <button onClick={handleClose} className="p-1.5 bg-black/5 dark:bg-white/10 rounded-full text-[var(--text-secondary)]">
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {navItems.map((item) => {
                    const isActive = pathname === item.url || pathname.startsWith(item.url + "/");
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.title}
                        href={item.url}
                        onClick={handleClose}
                        className={`flex flex-col items-center justify-center gap-2 p-3 rounded-[16px] transition-colors border ${
                          isActive
                            ? "bg-[var(--color-brand-primary)] border-[var(--color-brand-primary)] text-white shadow-md"
                            : "bg-[var(--bg-subtle)] border-transparent text-[var(--text-primary)] hover:border-[var(--border-default)]"
                        }`}
                      >
                        <Icon className="h-6 w-6" />
                        <span className="text-[11px] font-bold text-center">{item.title}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  }

  // === VARIANT 3: FULLSCREEN CASCADE ===
  if (mobileNavVariant === "fullscreen") {
    return (
      <AnimatePresence>
        {openMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col bg-black/60 backdrop-blur-xl"
          >
            <div className="p-6 flex justify-end">
              <button onClick={handleClose} className="p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition shadow-lg border border-white/20">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 flex flex-col justify-center px-8 space-y-6">
              {navItems.map((item, i) => {
                const isActive = pathname === item.url || pathname.startsWith(item.url + "/");
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ x: -40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -40, opacity: 0 }}
                    transition={{ delay: i * 0.05, type: "spring", damping: 20, stiffness: 100 }}
                  >
                    <Link
                      href={item.url}
                      onClick={handleClose}
                      className={`flex items-center gap-4 group ${isActive ? "opacity-100" : "opacity-60 hover:opacity-100"}`}
                    >
                      <div className={`p-3 rounded-2xl shadow-lg border ${isActive ? "bg-white text-black border-transparent" : "bg-white/10 text-white border-white/20 group-hover:bg-white/20"}`}>
                        <Icon className="h-7 w-7" />
                      </div>
                      <span className={`text-[24px] font-bold tracking-tight text-white`}>
                        {item.title}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return null;
}
