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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LayoutCustomizer } from "@/components/dashboard/LayoutCustomizer";
import { MobileNavigation } from "@/components/dashboard/MobileNavigation";
import { useUserProfile } from "@/hooks/useUserProfile";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
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
  EyeIcon,
  EyeSlashIcon,
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
  const { theme, setTheme, isPrivacyMode, togglePrivacyMode, navLayout } = useSidebar();

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
  const [showLogoutDialog, setShowLogoutDialog] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

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
    if (pathname.startsWith("/dashboard/patrimoine") || pathname.startsWith("/dashboard/biens"))
      return ["Tableau de bord", "Mon Patrimoine"];
    if (pathname.startsWith("/dashboard/locataires")) return ["Tableau de bord", "Locataires & Baux"];
    if (pathname.startsWith("/dashboard/loyers")) return ["Tableau de bord", "Loyers & Quittances"];
    if (pathname.startsWith("/dashboard/annonces")) return ["Tableau de bord", "Annonces & Vitrine"];
    if (pathname.startsWith("/dashboard/maintenance")) return ["Tableau de bord", "Maintenance & Artisans"];
    if (pathname.startsWith("/dashboard/parametres")) return ["Tableau de bord", "Paramètres"];
    return ["Tableau de bord", "Vue d'ensemble"];
  };

  const currentCrumbs = getBreadcrumbs();

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        await supabase.auth.signOut();
      }
      if (typeof window !== "undefined") {
        localStorage.removeItem("lokka_dev_plan");
        localStorage.removeItem("lokka_dev_role");
      }
      setShowLogoutDialog(false);
      router.push("/auth/login");
    } catch (err) {
      console.error("Logout error:", err);
      router.push("/auth/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const searchableItems = [
    {
      category: "Biens",
      title: "Villa Les Cocotiers",
      subtitle: "Haie Vive · 450 000 FCFA/mois (3 unités)",
      url: "/dashboard/patrimoine",
      icon: BuildingOffice2Icon,
    },
    {
      category: "Biens",
      title: "Résidence Le Manguier",
      subtitle: "Akpakpa · 180 000 FCFA/mois (6 unités)",
      url: "/dashboard/patrimoine",
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
    <>
      <header className="mb-6">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
          
          {/* Left: TopNav Links OU (SidebarTrigger + Separator + Breadcrumb) */}
          <div className="flex items-center gap-3 min-w-0">
            {navLayout === "topnav" ? (
              <div className="flex items-center gap-5">
                <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
                  <div className="size-7 rounded-md bg-white border border-[var(--border)] shrink-0 shadow-2xs overflow-hidden">
                    <img src="/logo.png" alt="Lokka" className="w-full h-full object-contain p-0.5" />
                  </div>
                  <span className="font-extrabold text-[15px] tracking-tight text-[var(--foreground)]">
                    Lokka
                  </span>
                </Link>
                <nav className="hidden md:flex items-center gap-1">
                  {[
                    { label: "Vue d'ensemble", href: "/dashboard" },
                    { label: "Patrimoine", href: "/dashboard/patrimoine" },
                    { label: "Locataires", href: "/dashboard/locataires" },
                    { label: "Loyers", href: "/dashboard/loyers" },
                    { label: "Maintenance", href: "/dashboard/maintenance" },
                    { label: "Paramètres", href: "/dashboard/parametres" },
                  ].map((tab) => {
                    const active = tab.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(tab.href);
                    return (
                      <Link
                        key={tab.href}
                        href={tab.href}
                        className={`px-3 py-1.5 rounded-md text-[12.5px] font-medium transition-all ${
                          active
                            ? "bg-[var(--primary-subtle)] text-[var(--primary)] font-semibold"
                            : "text-[var(--text-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
                        }`}
                      >
                        {tab.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ) : (
              <>
                <SidebarTrigger className="h-8.5 w-8.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors shrink-0 text-[var(--foreground)] shadow-2xs cursor-pointer" />
                <Separator orientation="vertical" className="h-4 bg-[var(--border)] shrink-0" />

                <Breadcrumb className="hidden sm:block">
                  <BreadcrumbList className="text-[13px] font-medium text-[var(--text-secondary)]">
                    {currentCrumbs.map((crumb, i) => {
                      const isLast = i === currentCrumbs.length - 1;
                      return (
                        <React.Fragment key={i}>
                          {i > 0 && <BreadcrumbSeparator className="text-[var(--text-tertiary)]" />}
                          <BreadcrumbItem>
                            {isLast ? (
                              <BreadcrumbPage className="font-bold text-[var(--foreground)]">
                                {crumb}
                              </BreadcrumbPage>
                            ) : (
                              <BreadcrumbLink
                                href="/dashboard"
                                className="hover:text-[var(--foreground)] transition-colors cursor-pointer"
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
              </>
            )}
          </div>

          {/* Right: Search + Notifications + Theme Toggler + Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* 1. Global Search — icône seule sur mobile (< sm), barre complète sur sm+ */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="h-8.5 w-8.5 flex sm:hidden items-center justify-center bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] rounded-lg text-[var(--foreground)] transition-all shadow-2xs cursor-pointer"
              title="Rechercher (⌘K)"
            >
              <MagnifyingGlassIcon className="h-4 w-4" />
            </button>

            {/* Barre complète desktop */}
            <div
              onClick={() => setIsSearchOpen(true)}
              className="group relative hidden sm:flex items-center h-8.5 w-[190px] md:w-[240px] px-2.5 bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] rounded-lg transition-all shadow-2xs cursor-pointer"
            >
              <MagnifyingGlassIcon className="h-4 w-4 text-[var(--text-secondary)] transition-colors shrink-0" />
              <span className="ml-2 text-[12.5px] text-[var(--text-secondary)] select-none truncate flex-1 font-medium">
                Rechercher...
              </span>
              <kbd className="inline-flex items-center px-1.5 py-0.5 bg-[var(--surface-secondary)] border border-[var(--border)] text-[10px] font-mono text-[var(--text-secondary)] rounded">
                ⌘K
              </kbd>
            </div>

            {/* 2. Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="h-8.5 w-8.5 flex items-center justify-center bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] rounded-lg text-[var(--foreground)] transition-all shadow-2xs cursor-pointer"
                title="Notifications"
              >
                <BellIcon className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
              </button>

              {/* Notifications Popover */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    className="absolute right-0 mt-2 w-80 bg-[var(--surface-elevated)] border border-[var(--border)] rounded-xl shadow-2xl p-3 z-50 text-[12px] text-[var(--foreground)] animate-in fade-in-50"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-[var(--border)] font-bold text-[var(--foreground)]">
                      <span>Notifications récentes</span>
                      <span className="text-[10px] text-[var(--success)] font-bold bg-[var(--success-subtle)] px-2 py-0.5 rounded border border-[var(--success)]/20">
                        ● MoMo Live
                      </span>
                    </div>
                    <div className="py-2 space-y-2">
                      <div className="p-2.5 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border)]">
                        <div className="font-bold text-[var(--foreground)] flex items-center justify-between">
                          <span>Loyer reçu (MTN MoMo)</span>
                          <span className="text-[10px] text-[var(--text-secondary)]">09:42</span>
                        </div>
                        <p className="text-[11.5px] text-[var(--text-secondary)] mt-0.5">
                          Koudjo Dossou a réglé 350 000 FCFA avec succès.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 3. Privacy Mode Toggle (Mode Masquage) */}
            <button
              type="button"
              onClick={togglePrivacyMode}
              className={`h-8.5 w-8.5 flex items-center justify-center border rounded-lg transition-all shadow-2xs cursor-pointer ${
                isPrivacyMode
                  ? "bg-[var(--primary-subtle)] border-[var(--primary)] text-[var(--primary)] ring-2 ring-[var(--primary-subtle)]"
                  : "bg-[var(--surface)] hover:bg-[var(--surface-hover)] border-[var(--border)] text-[var(--foreground)]"
              }`}
              title={isPrivacyMode ? "Désactiver le mode masquage (Montants masqués)" : "Activer le mode masquage"}
            >
              {isPrivacyMode ? (
                <EyeSlashIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </button>

            {/* 4. Theme Toggler */}
            <AnimatedThemeToggler
              theme={currentTheme}
              onThemeChange={(newTheme) => setTheme(newTheme)}
              variant="circle"
              duration={450}
              className="h-8.5 w-8.5 border border-[var(--border)] rounded-lg bg-[var(--surface)] cursor-pointer text-[var(--foreground)]"
            />

            {/* 5. Layout Customizer Button (Desktop uniquement - masqué sur mobile) */}
            <button
              type="button"
              onClick={() => setIsCustomizerOpen(true)}
              className="hidden sm:flex h-8.5 w-8.5 items-center justify-center bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] rounded-lg text-[var(--foreground)] transition-all shadow-2xs cursor-pointer"
              title="Personnaliser l'affichage"
            >
              <AdjustmentsHorizontalIcon className="h-4 w-4" />
            </button>

            {/* 6. User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] rounded-lg transition-all shadow-2xs cursor-pointer outline-none"
                  aria-label="Menu utilisateur"
                >
                  <Avatar className="h-6.5 w-6.5 rounded-full border border-[var(--border)] shrink-0">
                    <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                    <AvatarFallback className="bg-[var(--primary)] text-[var(--primary-foreground)] text-[10.5px] font-bold">
                      {(userProfile.name || "AK").slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:flex flex-col text-left leading-tight">
                    <span className="text-[12px] font-bold text-[var(--foreground)] truncate max-w-[110px]">
                      {userProfile.name || "Alexandre K."}
                    </span>
                    <span className="text-[10px] text-[var(--text-secondary)] truncate max-w-[110px] font-semibold">
                      {userProfile.role || "Bailleur"}
                    </span>
                  </div>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                side="bottom"
                sideOffset={6}
                className="w-60 rounded-lg p-1.5 shadow-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#18181B] text-slate-900 dark:text-zinc-100 z-50 animate-in fade-in-50 zoom-in-95"
              >
                <DropdownMenuLabel className="p-2 space-y-1">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7 rounded-full border border-slate-200 dark:border-zinc-700 shrink-0">
                      <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                      <AvatarFallback className="bg-emerald-600 text-white text-[10.5px] font-bold">
                        {(userProfile.name || "AK").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-bold text-slate-900 dark:text-white truncate">
                        {userProfile.name || "Alexandre K."}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-normal truncate">
                        {userProfile.email || "alexandre@lokka.bj"}
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-100 dark:bg-zinc-800 my-1" />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => router.push("/dashboard/parametres")}
                    className="gap-2 p-1.5 rounded-md text-[12px] cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800"
                  >
                    <UserCircleIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Mon Profil Bailleur</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/dashboard/parametres")}
                    className="gap-2 p-1.5 rounded-md text-[12px] cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800"
                  >
                    <ShieldCheckIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Sécurité &amp; Données</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-slate-100 dark:bg-zinc-800 my-1" />
                <DropdownMenuItem
                  className="gap-2 p-1.5 rounded-md text-[12px] cursor-pointer text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                  onClick={() => setShowLogoutDialog(true)}
                >
                  <ArrowLeftOnRectangleIcon className="h-4 w-4" />
                  <span>Se déconnecter</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* ─── COMMAND PALETTE SEARCH MODAL (⌘K) ─── */}
        <AnimatePresence>
          {isSearchOpen && (
            <div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 p-4"
              onClick={() => setIsSearchOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.97, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: -10 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-xl bg-white dark:bg-[#18181B] rounded-xl shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden text-slate-900 dark:text-zinc-100"
              >
                {/* Search Bar Input */}
                <div className="flex items-center px-4 py-3 border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#18181B]">
                  <MagnifyingGlassIcon className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Rechercher un bien, un locataire, un contrat..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full ml-3 text-[13.5px] bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 rounded-md transition cursor-pointer"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>

                {/* Search Results */}
                <div className="max-h-[340px] overflow-y-auto p-2 bg-white dark:bg-[#18181B]">
                  {filteredItems.length === 0 ? (
                    <div className="py-8 text-center text-[13px] text-slate-500 dark:text-zinc-400">
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
                            className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer group transition"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="p-2 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-[13px] font-bold text-slate-900 dark:text-white truncate">
                                  {item.title}
                                </div>
                                <div className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                                  {item.subtitle}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800">
                                {item.category}
                              </span>
                              <ArrowRightIcon className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Command Palette Footer */}
                <div className="px-4 py-2 bg-slate-50 dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400">
                  <div className="flex items-center gap-3">
                    <span>
                      <kbd className="px-1.5 py-0.5 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded font-mono text-[10px] text-slate-700 dark:text-zinc-300 shadow-2xs">
                        ↑↓
                      </kbd>{" "}
                      Naviguer
                    </span>
                    <span>
                      <kbd className="px-1.5 py-0.5 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded font-mono text-[10px] text-slate-700 dark:text-zinc-300 shadow-2xs">
                        ↵
                      </kbd>{" "}
                      Ouvrir
                    </span>
                  </div>
                  <span className="font-semibold text-slate-700 dark:text-zinc-300">Lokka Search 2.0</span>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Layout Customizer Drawer */}
        <LayoutCustomizer
          isOpen={isCustomizerOpen}
          onClose={() => setIsCustomizerOpen(false)}
        />

        {/* Mobile Navigation */}
        <MobileNavigation />
      </header>

      {/* ─── MODAL DE CONFIRMATION DE DÉCONNEXION (HEADER) ─── */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="bg-white dark:bg-[#18181B] border border-slate-200 dark:border-zinc-800 rounded-xl p-6 max-w-md shadow-2xl text-slate-900 dark:text-zinc-100">
          <AlertDialogHeader>
            <div className="w-11 h-11 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-2">
              <ArrowLeftOnRectangleIcon className="w-5 h-5" />
            </div>
            <AlertDialogTitle className="text-[16px] font-bold text-slate-900 dark:text-white">
              Confirmer la déconnexion
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[13px] text-slate-600 dark:text-zinc-400 leading-relaxed mt-1">
              Êtes-vous sûr de vouloir vous déconnecter de votre espace Lokka ? Vos données de gestion sont enregistrées en toute sécurité.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-6 flex items-center justify-end gap-2.5">
            <AlertDialogCancel
              disabled={isLoggingOut}
              className="px-3.5 py-2 text-[12.5px] font-semibold rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 cursor-pointer transition"
            >
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmLogout}
              disabled={isLoggingOut}
              className="px-4 py-2 text-[12.5px] font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white cursor-pointer transition shadow-xs"
            >
              {isLoggingOut ? "Déconnexion..." : "Se déconnecter"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
