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
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-border">
          
          {/* Left: SidebarTrigger + Separator + Breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            <SidebarTrigger className="h-8.5 w-8.5 rounded-lg border border-border bg-card hover:bg-muted transition-colors shrink-0 text-foreground" />
            <Separator orientation="vertical" className="h-4 bg-border shrink-0" />

            <Breadcrumb className="hidden sm:block">
              <BreadcrumbList className="text-[13px] font-medium text-muted-foreground">
                {currentCrumbs.map((crumb, i) => {
                  const isLast = i === currentCrumbs.length - 1;
                  return (
                    <React.Fragment key={i}>
                      {i > 0 && <BreadcrumbSeparator className="text-muted-foreground" />}
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage className="font-bold text-foreground">
                            {crumb}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink
                            href="/dashboard"
                            className="hover:text-foreground transition-colors"
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

          {/* Right: Search + Notifications + Theme Toggler + Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* 1. Global Search Box ⌘K */}
            <div
              onClick={() => setIsSearchOpen(true)}
              className="group relative flex items-center h-8.5 w-[140px] sm:w-[220px] md:w-[260px] px-2.5 bg-card hover:bg-muted border border-border hover:border-foreground/30 rounded-lg transition-all shadow-2xs cursor-pointer"
            >
              <MagnifyingGlassIcon className="h-4 w-4 text-muted-foreground transition-colors shrink-0" />
              <span className="ml-2 text-[12.5px] text-muted-foreground select-none truncate flex-1 font-medium">
                Rechercher...
              </span>
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 bg-muted border border-border text-[10px] font-mono text-muted-foreground rounded">
                ⌘K
              </kbd>
            </div>

            {/* 2. Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="h-8.5 w-8.5 flex items-center justify-center bg-card hover:bg-muted border border-border rounded-lg text-foreground transition-all shadow-2xs cursor-pointer"
                title="Notifications"
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
                    className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-2xl shadow-2xl p-3 z-50 text-[12px] text-card-foreground animate-in fade-in-50"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-border font-bold text-foreground">
                      <span>Notifications récentes</span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        ● MoMo Live
                      </span>
                    </div>
                    <div className="py-2 space-y-2">
                      <div className="p-2.5 rounded-lg bg-muted/40 border border-border">
                        <div className="font-bold text-foreground flex items-center justify-between">
                          <span>Loyer reçu (MTN MoMo)</span>
                          <span className="text-[10px] text-muted-foreground">09:42</span>
                        </div>
                        <p className="text-[11.5px] text-muted-foreground mt-0.5">
                          Koudjo Dossou a réglé 350 000 FCFA avec succès.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 3. Theme Toggler */}
            <AnimatedThemeToggler
              theme={currentTheme}
              onThemeChange={(newTheme) => setTheme(newTheme)}
              variant="circle"
              duration={450}
              className="h-8.5 w-8.5"
            />

            {/* 4. Layout Customizer Button */}
            <button
              type="button"
              onClick={() => setIsCustomizerOpen(true)}
              className="h-8.5 w-8.5 flex items-center justify-center bg-card hover:bg-muted border border-border rounded-lg text-foreground transition-all shadow-2xs cursor-pointer"
              title="Personnaliser l'affichage"
            >
              <AdjustmentsHorizontalIcon className="h-4.5 w-4.5" />
            </button>

            {/* 5. User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 bg-card hover:bg-muted border border-border rounded-xl transition-all shadow-2xs cursor-pointer outline-none"
                  aria-label="Menu utilisateur"
                >
                  <Avatar className="h-7 w-7 rounded-full border border-border shrink-0">
                    <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                    <AvatarFallback className="bg-[#087F5B] text-white text-[11px] font-bold">
                      {(userProfile.name || "AK").slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:flex flex-col text-left leading-tight">
                    <span className="text-[12.5px] font-bold text-foreground truncate max-w-[110px]">
                      {userProfile.name || "Alexandre K."}
                    </span>
                    <span className="text-[10px] text-muted-foreground truncate max-w-[110px] font-semibold">
                      {userProfile.role || "Bailleur"}
                    </span>
                  </div>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                side="bottom"
                sideOffset={8}
                className="w-64 rounded-2xl p-2 shadow-2xl border border-border bg-card text-card-foreground z-50 animate-in fade-in-50 zoom-in-95"
              >
                <DropdownMenuLabel className="p-2 space-y-1">
                  <div className="flex items-center gap-2.5">
                    <Avatar className="h-8 w-8 rounded-full border border-border shrink-0">
                      <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                      <AvatarFallback className="bg-[#087F5B] text-white text-[11px] font-bold">
                        {(userProfile.name || "AK").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13.5px] font-bold text-foreground truncate">
                        {userProfile.name || "Alexandre K."}
                      </div>
                      <div className="text-[11.5px] text-muted-foreground font-normal truncate">
                        {userProfile.email || "alexandre@lokka.bj"}
                      </div>
                    </div>
                  </div>
                  <div className="pt-1.5">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {userProfile.role || "Bailleur"}
                    </span>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-border my-1.5" />

                <DropdownMenuGroup className="space-y-0.5">
                  <DropdownMenuItem
                    className="text-[12.5px] gap-2.5 p-2 rounded-lg cursor-pointer text-foreground hover:bg-muted font-medium"
                    onClick={() => router.push("/dashboard/parametres")}
                  >
                    <UserCircleIcon className="h-4 w-4 text-primary" />
                    <span>Mon Profil &amp; Paramètres</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-[12.5px] gap-2.5 p-2 rounded-lg cursor-pointer text-foreground hover:bg-muted font-medium"
                    onClick={() => router.push("/dashboard/parametres")}
                  >
                    <ShieldCheckIcon className="h-4 w-4 text-emerald-600" />
                    <span>Fiscalité &amp; IFU Bénin</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="bg-border my-1.5" />

                <DropdownMenuItem
                  className="text-[12.5px] gap-2.5 p-2 rounded-lg text-destructive hover:bg-destructive/10 cursor-pointer font-semibold transition-colors"
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
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-start justify-center pt-20 p-4"
              onClick={() => setIsSearchOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.97, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: -10 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-xl bg-card rounded-2xl shadow-2xl border border-border overflow-hidden text-card-foreground"
              >
                {/* Search Bar Input */}
                <div className="flex items-center px-4 py-3.5 border-b border-border bg-card">
                  <MagnifyingGlassIcon className="h-5 w-5 text-muted-foreground shrink-0" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Rechercher un bien, un locataire, un contrat..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full ml-3 text-[14px] bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                  />
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="p-1 text-muted-foreground hover:text-foreground rounded-md transition cursor-pointer"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>

                {/* Search Results */}
                <div className="max-h-[340px] overflow-y-auto p-2 bg-card">
                  {filteredItems.length === 0 ? (
                    <div className="py-8 text-center text-[13px] text-muted-foreground">
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
                            className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted cursor-pointer group transition"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="p-2 rounded-lg bg-muted text-foreground">
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-[13px] font-bold text-foreground truncate">
                                  {item.title}
                                </div>
                                <div className="text-[11px] text-muted-foreground truncate">
                                  {item.subtitle}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                                {item.category}
                              </span>
                              <ArrowRightIcon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Command Palette Footer */}
                <div className="px-4 py-2.5 bg-muted/40 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span>
                      <kbd className="px-1.5 py-0.5 bg-card border border-border rounded font-mono text-[10px] text-foreground">
                        ↑↓
                      </kbd>{" "}
                      Naviguer
                    </span>
                    <span>
                      <kbd className="px-1.5 py-0.5 bg-card border border-border rounded font-mono text-[10px] text-foreground">
                        ↵
                      </kbd>{" "}
                      Ouvrir
                    </span>
                  </div>
                  <span className="font-semibold text-foreground">Lokka Search 2.0</span>
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
        <AlertDialogContent className="bg-card border border-border rounded-2xl p-6 max-w-md shadow-2xl text-card-foreground">
          <AlertDialogHeader>
            <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-2">
              <ArrowLeftOnRectangleIcon className="w-6 h-6" />
            </div>
            <AlertDialogTitle className="text-[17px] font-bold text-foreground">
              Confirmer la déconnexion
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[13px] text-muted-foreground leading-relaxed mt-1">
              Êtes-vous sûr de vouloir vous déconnecter de votre espace Lokka ? Vos données de gestion sont enregistrées en toute sécurité.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-6 flex items-center justify-end gap-3">
            <AlertDialogCancel
              disabled={isLoggingOut}
              className="px-4 py-2 text-[13px] font-bold rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition"
            >
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmLogout}
              disabled={isLoggingOut}
              className="px-5 py-2 text-[13px] font-bold rounded-lg bg-destructive hover:bg-destructive/90 text-white cursor-pointer transition shadow-xs"
            >
              {isLoggingOut ? "Déconnexion..." : "Se déconnecter"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
