"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutCustomizer } from "@/components/dashboard/LayoutCustomizer";
import { MobileNavigation } from "@/components/dashboard/MobileNavigation";
import { useUserProfile } from "@/hooks/useUserProfile";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import {
  MagnifyingGlassIcon,
  BellIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  BuildingOffice2Icon,
  UsersIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  ArrowLeftOnRectangleIcon,
  UserCircleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  breadcrumbs?: string[];
}

export default function Header({
  title,
  subtitle,
  breadcrumbs,
}: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useSidebar();

  const currentTheme =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
      ? "dark"
      : "light";

  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = React.useState(false);

  const userProfile = useUserProfile();

  // Keyboard shortcut for ⌘K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen]);

  // Dynamic breadcrumb paths
  const getBreadcrumbs = () => {
    if (breadcrumbs && breadcrumbs.length > 0) return breadcrumbs;
    if (pathname === "/dashboard") return ["Tableau de bord", "Vue d'ensemble"];
    if (pathname.startsWith("/dashboard/biens")) return ["Tableau de bord", "Mes Biens"];
    if (pathname.startsWith("/dashboard/locataires")) return ["Tableau de bord", "Locataires"];
    if (pathname.startsWith("/dashboard/loyers")) return ["Tableau de bord", "Loyers & MoMo"];
    if (pathname.startsWith("/dashboard/comptabilite")) return ["Tableau de bord", "Fiscalité TFU"];
    if (pathname.startsWith("/dashboard/interventions")) return ["Tableau de bord", "Interventions"];
    if (pathname.startsWith("/dashboard/documents")) return ["Tableau de bord", "Documents"];
    if (pathname.startsWith("/dashboard/parametres")) return ["Tableau de bord", "Paramètres"];
    return ["Tableau de bord", "Vue d'ensemble"];
  };

  const currentCrumbs = getBreadcrumbs();

  const searchableItems = [
    {
      category: "Biens",
      title: "Villa Les Cocotiers",
      subtitle: "Haie Vive · 450 000 FCFA/mois (3 unités)",
      url: "/dashboard/biens",
      icon: BuildingOffice2Icon,
    },
    {
      category: "Biens",
      title: "Résidence Le Manguier",
      subtitle: "Akpakpa · 180 000 FCFA/mois (6 unités)",
      url: "/dashboard/biens",
      icon: BuildingOffice2Icon,
    },
    {
      category: "Locataires",
      title: "Koudjo Dossou",
      subtitle: "Villa Cocotiers Apt 2B · À jour (+229 97 00 11 22)",
      url: "/dashboard/locataires",
      icon: UsersIcon,
    },
    {
      category: "Locataires",
      title: "Rachidi Saka",
      subtitle: "Arconville · Retard 5j (+229 96 14 77 30)",
      url: "/dashboard/locataires",
      icon: UsersIcon,
    },
    {
      category: "Quittances",
      title: "Quittance LOK-2026-0891",
      subtitle: "Koudjo Dossou · Septembre 2026 · MTN MoMo",
      url: "/dashboard/loyers",
      icon: DocumentTextIcon,
    },
  ];

  const filteredItems = searchableItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="mb-6">
      {/* ─── EXACT SHADCN-ADMIN TOP HEADER BAR ─── */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        
        {/* Left: SidebarTrigger + Separator + Clean Breadcrumb / Title */}
        <div className="flex items-center gap-3 min-w-0">
          <SidebarTrigger className="h-8.5 w-8.5 rounded-[8px] border border-[var(--border-default)] bg-[var(--bg-surface)] hover:bg-[var(--hover-bg)] transition-colors shrink-0 text-[var(--text-primary)]" />
          <Separator orientation="vertical" className="h-4 bg-[var(--border-default)] shrink-0" />

          <Breadcrumb className="hidden sm:block">
            <BreadcrumbList className="text-[13px] font-medium text-[var(--text-secondary)]">
              {currentCrumbs.map((crumb, i) => {
                const isLast = i === currentCrumbs.length - 1;
                return (
                  <React.Fragment key={i}>
                    {i > 0 && <BreadcrumbSeparator className="text-[var(--text-muted)]" />}
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage className="font-semibold text-[var(--text-primary)]">
                          {crumb}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          href="/dashboard"
                          className="hover:text-[var(--text-primary)] transition-colors"
                        >
                          {crumb}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Right: Search ⌘K + Notifications + Theme Toggler + Customizer + Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* 1. Global Search Box ⌘K */}
          <div
            onClick={() => setIsSearchOpen(true)}
            className="group relative flex items-center h-8.5 w-[160px] sm:w-[220px] md:w-[260px] px-2.5 bg-[var(--bg-surface)] hover:bg-[var(--hover-bg)] border border-[var(--border-default)] hover:border-[var(--border-strong)] rounded-[var(--radius-md)] transition-all shadow-2xs cursor-pointer"
          >
            <MagnifyingGlassIcon className="h-4 w-4 text-[var(--text-primary)] transition-colors shrink-0" />
            <span className="ml-2 text-[13px] text-[var(--text-secondary)] select-none truncate flex-1 font-medium">
              Rechercher...
            </span>
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.2 bg-[var(--bg-subtle)] border border-[var(--border-default)] text-[10px] font-mono text-[var(--text-secondary)] rounded">
              ⌘K
            </kbd>
          </div>

          {/* 2. Notification Bell with Pulse Dot */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="h-8.5 w-8.5 flex items-center justify-center bg-[var(--bg-surface)] hover:bg-[var(--hover-bg)] border border-[var(--border-default)] rounded-[8px] text-[var(--text-primary)] hover:text-[var(--text-primary)] transition-all shadow-2xs cursor-pointer"
              title="Notifications & MoMo Live"
            >
              <BellIcon className="h-4 w-4" />
              <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </button>

            {/* Notifications Popover */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  className="absolute right-0 mt-2 w-80 bg-[var(--bg-surface-elevated)] border border-[var(--border-default)] rounded-[10px] shadow-xl p-3 z-50 text-[12px]"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[var(--border-default)] font-bold text-[var(--text-primary)]">
                    <span>Activité &amp; Flux Réseau</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      ● MoMo Live
                    </span>
                  </div>
                  <div className="py-2 space-y-2">
                    <div className="p-2 rounded-[6px] bg-[var(--bg-subtle)] border border-[var(--border-default)]">
                      <div className="font-semibold text-[var(--text-primary)] flex items-center justify-between">
                        <span>Loyer reçu (MTN MoMo)</span>
                        <span className="text-[10px] text-[var(--text-muted)]">09:42</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                        Koudjo Dossou a réglé 350 000 FCFA.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 3. MAGIC UI ANIMATED THEME TOGGLER */}
          <AnimatedThemeToggler
            theme={currentTheme}
            onThemeChange={(newTheme) => setTheme(newTheme)}
            variant="circle"
            duration={450}
            className="h-8.5 w-8.5 bg-[var(--bg-surface)] border-[var(--border-default)]"
          />

          {/* 4. LAYOUT & SIDEBAR CUSTOMIZER BUTTON */}
          <button
            type="button"
            onClick={() => setIsCustomizerOpen(true)}
            className="h-8.5 w-8.5 flex items-center justify-center bg-[var(--bg-surface)] hover:bg-[var(--hover-bg)] border border-[var(--border-default)] rounded-[var(--radius-sm)] text-[var(--text-primary)] transition-all shadow-2xs cursor-pointer"
            title="Personnaliser la sidebar & l'affichage"
          >
            <AdjustmentsHorizontalIcon className="h-4.5 w-4.5" />
          </button>

          {/* 5. User Profile Avatar & Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 p-0.5 sm:px-2 sm:py-1 bg-[var(--bg-surface)] hover:bg-[var(--hover-bg)] border border-[var(--border-default)] rounded-[var(--radius-md)] transition-all shadow-2xs cursor-pointer outline-none"
              >
                <Avatar className="h-7 w-7 rounded-full border border-[var(--border-default)]">
                  <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                  <AvatarFallback className="bg-[var(--color-brand-primary)] text-white text-[11px] font-bold">
                    {userProfile.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-col text-left leading-tight">
                  <span className="text-[12px] font-bold text-[var(--text-primary)] truncate max-w-[100px]">
                    {userProfile.name}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] truncate max-w-[100px]">
                    {userProfile.role}
                  </span>
                </div>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 rounded-[10px] p-1.5 shadow-xl border-[var(--border-default)] bg-[var(--bg-surface-elevated)]">
              <DropdownMenuLabel className="p-2">
                <div className="text-[13px] font-bold text-[var(--text-primary)]">{userProfile.name}</div>
                <div className="text-[11px] text-[var(--text-muted)] font-normal">{userProfile.email}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[var(--border-default)]" />
              <DropdownMenuGroup>
                <DropdownMenuItem className="text-[12px] gap-2 cursor-pointer text-[var(--text-primary)] hover:bg-[var(--hover-bg)]" onClick={() => router.push("/dashboard/parametres")}>
                  <UserCircleIcon className="h-4 w-4 text-[var(--text-secondary)]" />
                  <span>Mon Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-[12px] gap-2 cursor-pointer text-[var(--text-primary)] hover:bg-[var(--hover-bg)]" onClick={() => router.push("/dashboard/comptabilite")}>
                  <ShieldCheckIcon className="h-4 w-4 text-[var(--text-secondary)]" />
                  <span>Fiscalité TFU Bénin</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-[var(--border-default)]" />
              <DropdownMenuItem
                className="text-[12px] gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                onClick={() => {
                  window.location.href = "/auth/login";
                }}
              >
                <ArrowLeftOnRectangleIcon className="h-4 w-4" />
                <span>Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* ─── COMMAND PALETTE SEARCH MODAL (⌘K) ─── */}
      <AnimatePresence>
        {isSearchOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-center pt-20 p-4"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl bg-[var(--bg-surface-elevated)] rounded-[14px] shadow-2xl border border-[var(--border-default)] overflow-hidden"
            >
              {/* Search Bar Input */}
              <div className="flex items-center px-4 py-3.5 border-b border-[var(--border-default)] bg-[var(--bg-surface)]">
                <MagnifyingGlassIcon className="h-5 w-5 text-[var(--text-primary)] shrink-0" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Rechercher un bien, un locataire, un contrat..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full ml-3 text-[14px] bg-transparent border-none outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1 text-[var(--text-primary)] hover:bg-[var(--hover-bg)] rounded-md transition cursor-pointer"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>

              {/* Search Results */}
              <div className="max-h-[340px] overflow-y-auto p-2 bg-[var(--bg-surface)]">
                {filteredItems.length === 0 ? (
                  <div className="py-8 text-center text-[13px] text-[var(--text-secondary)]">
                    Aucun résultat trouvé pour « {searchQuery} »
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredItems.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={index}
                          onClick={() => {
                            router.push(item.url);
                            setIsSearchOpen(false);
                          }}
                          className="flex items-center justify-between p-2.5 rounded-[8px] hover:bg-[var(--hover-bg)] cursor-pointer group transition"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 rounded-[6px] bg-[var(--bg-subtle)] text-[var(--text-primary)] group-hover:bg-[var(--bg-surface)] transition">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-[13px] font-semibold text-[var(--text-primary)] truncate">
                                {item.title}
                              </div>
                              <div className="text-[11px] text-[var(--text-muted)] truncate">
                                {item.subtitle}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] font-medium uppercase px-1.5 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-default)]">
                              {item.category}
                            </span>
                            <ArrowRightIcon className="h-3.5 w-3.5 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Command Palette Footer */}
              <div className="px-4 py-2.5 bg-[var(--bg-subtle)] border-t border-[var(--border-default)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                <div className="flex items-center gap-3">
                  <span>
                    <kbd className="px-1.5 py-0.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded font-mono text-[10px] text-[var(--text-primary)]">
                      ↑↓
                    </kbd>{" "}
                    Naviguer
                  </span>
                  <span>
                    <kbd className="px-1.5 py-0.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded font-mono text-[10px] text-[var(--text-primary)]">
                      ↵
                    </kbd>{" "}
                    Ouvrir
                  </span>
                </div>
                <span>Lokka Search 2.0</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── THEME & LAYOUT CUSTOMIZER DRAWER ─── */}
      <LayoutCustomizer
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
      />

      {/* ─── MOBILE NAVIGATION (3 VARIANTS) ─── */}
      <MobileNavigation />
    </header>
  );
}
