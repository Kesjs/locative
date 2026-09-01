"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useBiens } from "@/lib/hooks/useBiens";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  Settings,
  ChevronRight,
  ChevronsUpDown,
  Sparkles,
  BadgeCheck,
  LogOut,
  Plus,
  Building,
  ShieldCheck,
  Megaphone,
  Wrench,
  Briefcase,
  Wallet,
  Globe,
  Users2,
  ArrowRight,
} from "lucide-react";

interface SubItem {
  title: string;
  url: string;
}

interface NavItem {
  title: string;
  url: string;
  icon: any;
  badge?: string;
  badgeType?: "default" | "danger";
  items?: SubItem[];
}

export const SIDEBAR_DATA = {
  teams: [
    {
      name: "Mon Patrimoine Personnel",
      logo: Building,
      plan: "Starter",
      type: "personnel",
    },
    {
      name: "SCI Familiale du Golfe",
      logo: Building2,
      plan: "SCI / Société",
      type: "sci",
    },
  ],
};

export function getNavItems(profileType: string): NavItem[] {
  const norm = (profileType || "").toLowerCase();

  if (norm.includes("agence")) {
    return [
      { title: "Tableau de bord", url: "/dashboard", icon: LayoutDashboard },
      { title: "Mandats & Propriétaires", url: "/dashboard/mandats", icon: Briefcase },
      { title: "Portefeuille Biens", url: "/dashboard/patrimoine", icon: Building2 },
      { title: "Baux & Locataires", url: "/dashboard/locataires", icon: Users },
      { title: "Comptabilité & Reversements", url: "/dashboard/comptabilite", icon: Wallet },
      { title: "Annonces & Vitrine", url: "/dashboard/annonces", icon: Globe },
      { title: "Maintenance & Artisans", url: "/dashboard/maintenance", icon: Wrench },
      { title: "Équipe & Agents", url: "/dashboard/equipe", icon: Users2 },
      { title: "Paramètres", url: "/dashboard/parametres", icon: Settings },
    ];
  }

  if (norm.includes("admin")) {
    return [
      { title: "Vue Globale", url: "/dashboard/admin", icon: LayoutDashboard },
      { title: "Utilisateurs", url: "/dashboard/admin/utilisateurs", icon: Users },
      { title: "Abonnements", url: "/dashboard/admin/abonnements", icon: CreditCard },
      { title: "Système & Logs", url: "/dashboard/admin/systeme", icon: Settings },
    ];
  }

  if (norm.includes("locataire")) {
    return [
      { title: "Mon Espace", url: "/dashboard/locataire", icon: LayoutDashboard },
      { title: "Loyers & Quittances", url: "/dashboard/locataire/loyers", icon: CreditCard },
      { title: "Mes Documents", url: "/dashboard/locataire/documents", icon: Globe },
      { title: "Maintenance & Pannes", url: "/dashboard/locataire/maintenance", icon: Wrench },
      { title: "Paramètres", url: "/dashboard/locataire/parametres", icon: Settings },
    ];
  }

  // Profil Par Défaut : Propriétaire Bailleur
  return [
    { title: "Tableau de bord", url: "/dashboard", icon: LayoutDashboard },
    { title: "Logements & Locaux", url: "/dashboard/patrimoine", icon: Building2 },
    { title: "Locataires & Baux", url: "/dashboard/locataires", icon: Users },
    { title: "Loyers & Quittances", url: "/dashboard/loyers", icon: CreditCard },
    { title: "Annonces & Vitrine", url: "/dashboard/annonces", icon: Megaphone },
    { title: "Maintenance & Artisans", url: "/dashboard/maintenance", icon: Wrench },
    { title: "Paramètres", url: "/dashboard/parametres", icon: Settings },
  ];
}

/**
 * Composant de sous-menu rétractable
 */
function CollapsibleNavItem({
  item,
  isActive,
  pathname,
  isCollapsed,
  isMobile,
  setOpenMobile,
}: {
  item: NavItem;
  isActive: boolean;
  pathname: string;
  isCollapsed: boolean;
  isMobile: boolean;
  setOpenMobile: (open: boolean) => void;
}) {
  const [isOpen, setIsOpen] = React.useState(isActive);

  React.useEffect(() => {
    if (isActive) setIsOpen(true);
  }, [isActive]);

  return (
    <SidebarMenuItem>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full relative flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors cursor-pointer select-none ${
          isActive
            ? "bg-slate-100 dark:bg-zinc-800/90 text-slate-950 dark:text-white font-semibold before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-1 before:bg-[var(--brand-accent)] before:rounded-r-sm shadow-2xs"
            : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50 hover:text-slate-900 dark:hover:text-zinc-200"
        }`}
      >
        <item.icon
          className="size-4 shrink-0 transition-colors"
          style={{ color: isActive ? "var(--brand-accent)" : undefined }}
        />
        <span className="truncate flex-1 text-left font-medium">{item.title}</span>
        {item.badge && (
          <span
            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
              item.badgeType === "danger"
                ? "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400"
                : "bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700"
            }`}
          >
            {item.badge}
          </span>
        )}
        <ChevronRight
          className={`size-4 ${isActive ? "text-slate-700 dark:text-zinc-300" : "text-slate-400"} transition-transform duration-200 ${
            isOpen ? "rotate-90" : ""
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && item.items && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden ml-4 pl-2.5 border-l border-slate-200 dark:border-zinc-800 space-y-0.5 mt-1"
          >
            {item.items.map((subItem) => {
              const isSubActive = pathname === subItem.url;
              return (
                <Link
                  key={subItem.title}
                  href={subItem.url}
                  onClick={() => isMobile && setOpenMobile(false)}
                  className={`block text-[12.5px] py-1.5 px-2 rounded-md transition-colors cursor-pointer ${
                    isSubActive
                      ? "font-semibold text-[var(--brand-accent)] bg-[var(--brand-accent)]/10"
                      : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  {subItem.title}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { state, setOpenMobile, devRole } = useSidebar();
  const isCollapsed = state === "collapsed";

  const { data: biens = [] } = useBiens();
  const activeBiensCount = biens.filter((b) => !b.archive).length;

  const [activeTeam, setActiveTeam] = React.useState(SIDEBAR_DATA.teams[0]);
  const [showLogoutDialog, setShowLogoutDialog] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const userProfile = useUserProfile();
  const currentRole = devRole || userProfile.role || "bailleur";
  const navItems = getNavItems(currentRole);
  const isNormalizedAdminOrLocataire =
    currentRole.toLowerCase().includes("admin") || currentRole.toLowerCase().includes("locataire");

  const isLinkActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

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

  // Calcul du quota selon le plan
  const planMaxBiens = 3;
  const planUsagePercent = Math.min(100, Math.round((activeBiensCount / planMaxBiens) * 100));
  const isPlanFull = activeBiensCount >= planMaxBiens;

  return (
    <>
      <Sidebar
        collapsible="icon"
        className="border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121215] text-slate-900 dark:text-zinc-100 z-30"
      >
        {/* ─── 1. HEADER : LOGO & SÉLECTEUR PATRIMOINE ─── */}
        <SidebarHeader className="border-b border-slate-200/80 dark:border-zinc-800/80 p-2">
          {isNormalizedAdminOrLocataire ? (
            <div className="flex items-center gap-2.5 px-2.5 py-1.5 h-[44px] rounded-lg">
              <div className="flex aspect-square size-7 items-center justify-center rounded-md bg-white border border-slate-200 dark:border-zinc-700 shrink-0 shadow-2xs overflow-hidden">
                <img src="/logo.png" alt="Lokka" className="w-full h-full object-contain p-0.5" />
              </div>
              {!isCollapsed && (
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-extrabold text-slate-900 dark:text-white text-[14px]">
                    Lokka
                  </span>
                  <span className="truncate text-[10.5px] font-bold uppercase tracking-wider text-[var(--brand-accent)]">
                    {currentRole.toLowerCase().includes("admin") ? "Admin HQ" : "Espace Locataire"}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      className={`w-full flex items-center ${
                        isCollapsed ? "justify-center p-0" : "gap-2.5 px-2.5 py-1.5"
                      } rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer`}
                    >
                      <div
                        className="flex aspect-square size-7 items-center justify-center rounded-md border border-slate-200 dark:border-zinc-700 shrink-0 shadow-2xs overflow-hidden"
                        style={{
                          backgroundColor: "color-mix(in srgb, var(--brand-accent) 12%, transparent)",
                          color: "var(--brand-accent)",
                        }}
                      >
                        <Building2 className="size-4" />
                      </div>
                      {!isCollapsed && (
                        <>
                          <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-bold text-slate-900 dark:text-white text-[13px]">
                              {activeTeam.name}
                            </span>
                            <span className="truncate text-[10.5px] text-slate-500 dark:text-zinc-400 font-medium">
                              {activeBiensCount} bien{activeBiensCount > 1 ? "s" : ""} · {activeTeam.plan}
                            </span>
                          </div>
                          <ChevronsUpDown className="ml-auto size-4 text-slate-400" />
                        </>
                      )}
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    className="w-60 rounded-lg p-1 shadow-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#18181B] text-slate-900 dark:text-zinc-100 z-50 animate-in fade-in-50 zoom-in-95"
                    align="start"
                    side={isMobile ? "bottom" : "right"}
                    sideOffset={6}
                  >
                    <DropdownMenuLabel className="text-[10px] text-slate-400 dark:text-zinc-500 px-2 py-1 font-bold uppercase tracking-wider">
                      Vos Patrimoines &amp; SCI
                    </DropdownMenuLabel>
                    {SIDEBAR_DATA.teams.map((team, index) => (
                      <DropdownMenuItem
                        key={team.name}
                        onClick={() => setActiveTeam(team)}
                        className={`gap-2 p-1.5 rounded-md text-[12px] font-medium cursor-pointer ${
                          activeTeam.name === team.name
                            ? "bg-slate-100 dark:bg-zinc-800 text-[var(--brand-accent)] font-semibold"
                            : "text-slate-800 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800"
                        }`}
                      >
                        <div
                          className="flex size-5 items-center justify-center rounded border border-slate-200 dark:border-zinc-700"
                          style={{
                            backgroundColor: "color-mix(in srgb, var(--brand-accent) 12%, transparent)",
                            color: "var(--brand-accent)",
                          }}
                        >
                          <team.logo className="size-3" />
                        </div>
                        <span className="truncate flex-1">{team.name}</span>
                        <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator className="bg-slate-100 dark:bg-zinc-800 my-1" />
                    <DropdownMenuItem
                      onClick={() =>
                        alert("Pour ajouter une SCI ou un nouveau portefeuille dédié, rendez-vous dans vos Paramètres Patrimoine.")
                      }
                      className="gap-2 p-1.5 rounded-md text-[11.5px] font-medium text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer"
                    >
                      <div className="flex size-5 items-center justify-center rounded border border-dashed border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800">
                        <Plus className="size-3 text-slate-600 dark:text-zinc-300" />
                      </div>
                      <span>Ajouter une SCI / Portefeuille</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          )}
        </SidebarHeader>

        {/* ─── 2. NAV GROUPS (SANS LABEL NAVIGATION PRINCIPALE) ─── */}
        <SidebarContent className="sidebar-scrollbar flex-1 overflow-y-auto px-2 py-2 space-y-1">
          <SidebarGroup className="p-0">
            <SidebarMenu className="gap-1">
              {navItems.map((item) => {
                const active = isLinkActive(item.url);

                if (item.items && item.items.length > 0) {
                  return (
                    <CollapsibleNavItem
                      key={item.title}
                      item={item}
                      isActive={active}
                      pathname={pathname}
                      isCollapsed={isCollapsed}
                      isMobile={isMobile}
                      setOpenMobile={setOpenMobile}
                    />
                  );
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={active}
                      className={`w-full relative flex items-center ${
                        isCollapsed ? "justify-center p-0 h-9" : "gap-3 px-3 py-2"
                      } rounded-lg text-[13px] font-medium transition-colors cursor-pointer ${
                        active
                          ? "bg-slate-100 dark:bg-zinc-800/90 text-slate-950 dark:text-white font-semibold before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-1 before:bg-[var(--brand-accent)] before:rounded-r-sm shadow-2xs"
                          : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50 hover:text-slate-900 dark:hover:text-zinc-200"
                      }`}
                    >
                      <Link
                        href={item.url}
                        className={isCollapsed ? "flex items-center justify-center w-full h-full cursor-pointer" : "cursor-pointer"}
                        onClick={() => isMobile && setOpenMobile(false)}
                      >
                        <item.icon
                          className="size-4 shrink-0 transition-colors"
                          style={{ color: active ? "var(--brand-accent)" : undefined }}
                        />
                        {!isCollapsed && <span className="truncate flex-1 font-medium">{item.title}</span>}
                        {!isCollapsed && item.badge && (
                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                              item.badgeType === "danger"
                                ? "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400"
                                : "bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        {/* ─── 3. FOOTER : CARTE D'UPGRADE PLAN + PROFIL UTILISATEUR ─── */}
        <SidebarFooter className="border-t border-slate-200/80 dark:border-zinc-800/80 p-2 space-y-2">
          {/* Bloc Upgrade Plan Dynamique */}
          {!isCollapsed ? (
            <div
              className="p-3 rounded-lg border shadow-2xs transition-colors"
              style={{
                borderColor: "color-mix(in srgb, var(--brand-accent) 25%, transparent)",
                backgroundColor: "color-mix(in srgb, var(--brand-accent) 6%, transparent)",
              }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11.5px] font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="size-3.5" style={{ color: "var(--brand-accent)" }} />
                  Plan Gratuit
                </span>
                <span
                  className="text-[10px] font-bold px-1.5 py-0.2 rounded border"
                  style={{
                    color: "var(--brand-accent)",
                    borderColor: "color-mix(in srgb, var(--brand-accent) 30%, transparent)",
                    backgroundColor: "color-mix(in srgb, var(--brand-accent) 12%, transparent)",
                  }}
                >
                  {activeBiensCount} / {planMaxBiens} biens
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden mb-2.5">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${planUsagePercent}%`,
                    backgroundColor: isPlanFull ? "#F59E0B" : "var(--brand-accent)",
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => router.push("/tarifs")}
                className="w-full py-1.5 px-2.5 text-white text-[11.5px] font-semibold rounded-md flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer hover:opacity-90 active:scale-[0.98]"
                style={{ backgroundColor: "var(--brand-accent)" }}
              >
                <span>Passer à Pro</span>
                <ArrowRight className="size-3" />
              </button>
            </div>
          ) : (
            <div className="flex justify-center mb-1">
              <button
                type="button"
                onClick={() => router.push("/tarifs")}
                className="size-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer border hover:opacity-90"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--brand-accent) 10%, transparent)",
                  borderColor: "color-mix(in srgb, var(--brand-accent) 30%, transparent)",
                  color: "var(--brand-accent)",
                }}
                title={`Passer à Pro (${activeBiensCount}/${planMaxBiens} biens)`}
              >
                <Sparkles className="size-4" />
              </button>
            </div>
          )}

          {/* Profil Utilisateur */}
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className={`w-full flex items-center ${
                      isCollapsed ? "justify-center p-0" : "gap-2.5 px-2.5 py-1.5"
                    } rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer`}
                  >
                    <Avatar className="h-7 w-7 rounded-full border border-slate-200 dark:border-zinc-700 shrink-0">
                      <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                      <AvatarFallback
                        className="text-white text-[10.5px] font-bold"
                        style={{ backgroundColor: "var(--brand-accent)" }}
                      >
                        {(userProfile.name || "AK").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {!isCollapsed && (
                      <>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-bold text-slate-900 dark:text-white text-[13px]">
                            {userProfile.name || "Alexandre Koudjo"}
                          </span>
                          <span className="truncate text-[10.5px] text-slate-500 dark:text-zinc-400 font-medium">
                            {userProfile.role || "Propriétaire Bailleur"}
                          </span>
                        </div>
                        <ChevronsUpDown className="ml-auto size-4 text-slate-400" />
                      </>
                    )}
                  </SidebarMenuButton>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-56 rounded-lg p-1 shadow-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#18181B] text-slate-900 dark:text-zinc-100 z-50 animate-in fade-in-50 zoom-in-95"
                  side={isMobile ? "bottom" : "right"}
                  align="end"
                  sideOffset={6}
                >
                  <DropdownMenuLabel className="p-2 font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-[12.5px] font-bold text-slate-900 dark:text-white leading-none">
                        {userProfile.name || "Alexandre Koudjo"}
                      </p>
                      <p className="text-[11px] leading-none text-slate-500 dark:text-zinc-400">
                        {userProfile.email || "alexandre@lokka.bj"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-100 dark:bg-zinc-800 my-1" />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => router.push("/dashboard/parametres")}
                      className="gap-2 p-1.5 rounded-md text-[12px] cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800"
                    >
                      <BadgeCheck className="size-4" style={{ color: "var(--brand-accent)" }} />
                      <span>Mon Compte &amp; Sécurité</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => router.push("/tarifs")}
                      className="gap-2 p-1.5 rounded-md text-[12px] cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800"
                    >
                      <Sparkles className="size-4 text-amber-500" />
                      <span>Abonnement &amp; Facturation</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="bg-slate-100 dark:bg-zinc-800 my-1" />
                  <DropdownMenuItem
                    onClick={() => setShowLogoutDialog(true)}
                    className="gap-2 p-1.5 rounded-md text-[12px] cursor-pointer text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                  >
                    <LogOut className="size-4" />
                    <span>Se déconnecter</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      {/* Modal de Déconnexion */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="bg-white dark:bg-[#18181B] border border-slate-200 dark:border-zinc-800 rounded-xl p-6 max-w-md shadow-2xl text-slate-900 dark:text-zinc-100">
          <AlertDialogHeader>
            <div className="w-11 h-11 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-2">
              <LogOut className="w-5 h-5" />
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
