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
  SidebarGroupLabel,
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
      name: "Patrimoine Lokka",
      logo: Building,
      plan: "12 Biens · Pro",
    },
    {
      name: "SCI Paris Haussmann",
      logo: Building2,
      plan: "4 Biens · Diaspora",
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
    { title: "Mon Patrimoine", url: "/dashboard/patrimoine", icon: Building2 },
    { title: "Locataires & Baux", url: "/dashboard/locataires", icon: Users },
    { title: "Loyers & Quittances", url: "/dashboard/loyers", icon: CreditCard },
    { title: "Annonces & Vitrine", url: "/dashboard/annonces", icon: Megaphone },
    { title: "Maintenance & Artisans", url: "/dashboard/maintenance", icon: Wrench },
    { title: "Paramètres", url: "/dashboard/parametres", icon: Settings },
  ];
}

/**
 * Composant de sous-menu rétractable pour économiser l'espace et clarifier la navigation
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

  if (isCollapsed) {
    return (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton
          asChild
          tooltip={item.title}
          isActive={isActive}
          style={
            isActive
              ? {
                  backgroundColor: "var(--color-brand-primary, #0F172A)",
                  color: "var(--color-brand-text, #FFFFFF)",
                }
              : undefined
          }
          className="w-full flex items-center justify-center p-0 h-9 rounded-[8px] transition-colors"
        >
          <Link
            href={item.url}
            className="flex items-center justify-center w-full h-full"
            onClick={() => isMobile && setOpenMobile(false)}
          >
            <item.icon className="size-4 shrink-0" />
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem key={item.title} className="space-y-1">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={
          isActive
            ? {
                backgroundColor: "var(--color-brand-primary, #0F172A)",
                color: "var(--color-brand-text, #FFFFFF)",
              }
            : undefined
        }
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-[8px] text-[13px] font-medium transition-all cursor-pointer select-none ${
          isActive
            ? "text-white font-semibold shadow-xs"
            : "text-[var(--text-primary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]"
        }`}
      >
        <item.icon className="size-4 shrink-0 text-[var(--text-secondary)]" />
        <span className="truncate flex-1 text-left font-medium">{item.title}</span>
        {item.badge && (
          <span
            className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
              item.badgeType === "danger"
                ? "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400"
                : "bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-default)]"
            }`}
          >
            {item.badge}
          </span>
        )}
        <ChevronRight
          className={`size-4 text-[var(--text-muted)] transition-transform duration-200 ${
            isOpen ? "rotate-90 text-[var(--text-primary)]" : ""
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
            className="overflow-hidden ml-5 pl-2.5 border-l border-[var(--border-default)] space-y-0.5"
          >
            {item.items.map((subItem) => {
              const isSubActive = pathname === subItem.url;
              return (
                <Link
                  key={subItem.title}
                  href={subItem.url}
                  onClick={() => isMobile && setOpenMobile(false)}
                  className={`block text-[12px] py-1.5 px-2 rounded-[6px] transition-colors ${
                    isSubActive
                      ? "font-semibold text-[var(--text-primary)] bg-[var(--hover-bg)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
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

  return (
    <>
      <Sidebar
        collapsible="icon"
        className="border-r border-[var(--border-default)] bg-[var(--bg-sidebar)] text-[var(--text-primary)] z-30"
      >
        {/* ─── 1. HEADER : LOGO & SÉLECTEUR PATRIMOINE ─── */}
        <SidebarHeader className="border-b border-[var(--border-subtle)] p-2">
          {isNormalizedAdminOrLocataire ? (
            <div className="flex items-center gap-3 px-3 py-2 h-[48px] rounded-[8px]">
              <div className="flex aspect-square size-8 items-center justify-center rounded-[8px] bg-white border border-border shrink-0 shadow-xs overflow-hidden">
                <img src="/logo.png" alt="Lokka" className="w-full h-full object-contain p-0.5" />
              </div>
              {!isCollapsed && (
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-extrabold text-[var(--text-primary)] text-[15px]">
                    Lokka
                  </span>
                  <span className="truncate text-[11px] text-[#087F5B] font-bold uppercase tracking-wider">
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
                        isCollapsed ? "justify-center p-0" : "gap-3 px-3 py-2"
                      } rounded-[8px] data-[state=open]:bg-[var(--hover-bg)] transition-colors cursor-pointer`}
                    >
                      <div className="flex aspect-square size-8 items-center justify-center rounded-[8px] bg-white border border-border shrink-0 shadow-xs overflow-hidden">
                        <img src={userProfile.customLogo || "/logo.png"} alt="Logo" className="w-full h-full object-contain p-0.5" />
                      </div>
                      {!isCollapsed && (
                        <>
                          <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-bold text-[var(--text-primary)] text-[13.5px]">
                              {activeTeam.name}
                            </span>
                            <span className="truncate text-[11px] text-[var(--text-muted)] font-medium">
                              {activeTeam.plan}
                            </span>
                          </div>
                          <ChevronsUpDown className="ml-auto size-4 text-[var(--text-muted)]" />
                        </>
                      )}
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    className="w-60 rounded-xl p-1.5 shadow-2xl border border-[var(--border-default)] bg-[var(--bg-surface-elevated)] z-50 animate-in fade-in-50 zoom-in-95"
                    align="start"
                    side={isMobile ? "bottom" : "right"}
                    sideOffset={8}
                  >
                    <DropdownMenuLabel className="text-[10.5px] text-[var(--text-muted)] px-2.5 py-1.5 font-bold uppercase tracking-wider">
                      {currentRole.toLowerCase().includes("agence") ? "Agences & Filiales" : "Patrimoines & Portefeuilles"}
                    </DropdownMenuLabel>
                    {SIDEBAR_DATA.teams.map((team, index) => (
                      <DropdownMenuItem
                        key={team.name}
                        onClick={() => setActiveTeam(team)}
                        className="gap-2.5 p-2 rounded-lg text-[12.5px] font-medium cursor-pointer text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
                      >
                        <div className="flex size-6 items-center justify-center rounded-[6px] border border-[var(--border-default)] bg-[var(--bg-subtle)]">
                          <team.logo className="size-3.5 text-primary" />
                        </div>
                        <span className="truncate flex-1 font-semibold">{team.name}</span>
                        <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator className="bg-[var(--border-default)] my-1" />
                    <DropdownMenuItem
                      onClick={() =>
                        alert(
                          currentRole.toLowerCase().includes("agence")
                            ? "Ajout d'une filiale..."
                            : "Ajout d'un nouveau patrimoine / SCI..."
                        )
                      }
                      className="gap-2 p-2 rounded-lg text-[12px] font-medium text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] cursor-pointer"
                    >
                      <div className="flex size-6 items-center justify-center rounded-[6px] border border-dashed border-[var(--border-default)] bg-[var(--bg-subtle)]">
                        <Plus className="size-3.5" />
                      </div>
                      <span>
                        {currentRole.toLowerCase().includes("agence")
                          ? "Ajouter une filiale"
                          : "Ajouter une SCI / Portefeuille"}
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          )}
        </SidebarHeader>

        {/* ─── 2. NAV GROUPS ─── */}
        <SidebarContent className="sidebar-scrollbar flex-1 overflow-y-auto px-2 py-3 space-y-4">
          <SidebarGroup>
            {!isCollapsed && (
              <SidebarGroupLabel className="text-[10.5px] font-bold uppercase tracking-wider text-[var(--text-muted)] px-2 py-1">
                Navigation Principale
              </SidebarGroupLabel>
            )}
            <SidebarMenu className="gap-1 mt-1">
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
                      style={
                        active
                          ? {
                              backgroundColor: "var(--color-brand-primary, #0F172A)",
                              color: "var(--color-brand-text, #FFFFFF)",
                            }
                          : undefined
                      }
                      className={`w-full flex items-center ${
                        isCollapsed ? "justify-center p-0 h-9" : "gap-3 px-3 py-2"
                      } rounded-[8px] text-[13px] font-medium transition-colors ${
                        active
                          ? "text-white font-semibold shadow-xs"
                          : "text-[var(--text-primary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]"
                      }`}
                    >
                      <Link
                        href={item.url}
                        className={isCollapsed ? "flex items-center justify-center w-full h-full" : undefined}
                        onClick={() => isMobile && setOpenMobile(false)}
                      >
                        <item.icon className="size-4 shrink-0 text-[var(--text-secondary)]" />
                        {!isCollapsed && <span className="truncate flex-1">{item.title}</span>}
                        {item.badge && !isCollapsed && (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                              item.badgeType === "danger"
                                ? "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400"
                                : "bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-default)]"
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

        {/* ─── 3. USER FOOTER PROFIL & DROPDOWN ─── */}
        <SidebarFooter className="border-t border-[var(--border-subtle)] p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className={`w-full flex items-center ${
                      isCollapsed ? "justify-center p-0" : "gap-3 px-3 py-2"
                    } rounded-xl data-[state=open]:bg-[var(--hover-bg)] transition-all cursor-pointer`}
                  >
                    <Avatar className="h-8 w-8 rounded-full border border-[var(--border-default)] shrink-0">
                      <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                      <AvatarFallback className="bg-[#087F5B] text-white text-[11px] font-bold">
                        {(userProfile.name || "AK").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {!isCollapsed && (
                      <>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-bold text-[var(--text-primary)] text-[13px]">
                            {userProfile.name}
                          </span>
                          <span className="truncate text-[11px] text-[var(--text-muted)] font-medium">
                            {userProfile.role}
                          </span>
                        </div>
                        <ChevronsUpDown className="ml-auto size-4 text-[var(--text-muted)]" />
                      </>
                    )}
                  </SidebarMenuButton>
                </DropdownMenuTrigger>

                {/* Dropdown Positioned Above Sidebar Footer to prevent overlap */}
                <DropdownMenuContent
                  className="w-64 rounded-2xl p-2 shadow-2xl border border-[var(--border-default)] bg-card text-card-foreground z-50 animate-in fade-in-50 zoom-in-95"
                  side={isMobile ? "top" : isCollapsed ? "right" : "top"}
                  align="start"
                  sideOffset={12}
                >
                  <DropdownMenuLabel className="p-2 space-y-1">
                    <div className="text-[13.5px] font-bold text-foreground">{userProfile.name}</div>
                    <div className="text-[11.5px] text-muted-foreground font-normal truncate">
                      {userProfile.email || "alexandre@lokka.bj"}
                    </div>
                    <div className="pt-1 flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {userProfile.role}
                      </span>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="bg-border my-1.5" />

                  <DropdownMenuGroup className="space-y-0.5">
                    <DropdownMenuItem
                      onClick={() => router.push("/dashboard/parametres")}
                      className="gap-2.5 p-2 rounded-lg text-[12.5px] font-medium cursor-pointer text-foreground hover:bg-muted"
                    >
                      <BadgeCheck className="size-4 text-primary" />
                      <span>Paramètres du compte</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => router.push("/dashboard/parametres")}
                      className="gap-2.5 p-2 rounded-lg text-[12.5px] font-medium cursor-pointer text-foreground hover:bg-muted"
                    >
                      <ShieldCheck className="size-4 text-emerald-600" />
                      <span>Fiscalité &amp; IFU Bénin</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator className="bg-border my-1.5" />

                  {/* Bouton de Déconnexion qui ouvre l'AlertDialog */}
                  <DropdownMenuItem
                    onClick={() => setShowLogoutDialog(true)}
                    className="gap-2.5 p-2 rounded-lg text-[12.5px] font-semibold text-destructive hover:bg-destructive/10 cursor-pointer transition-colors"
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

      {/* ─── 4. MODAL DE CONFIRMATION DE DÉCONNEXION (ALERT DIALOG) ─── */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="bg-card border border-border rounded-2xl p-6 max-w-md shadow-2xl text-card-foreground">
          <AlertDialogHeader>
            <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-2">
              <LogOut className="w-6 h-6" />
            </div>
            <AlertDialogTitle className="text-[17px] font-bold text-foreground">
              Confirmer la déconnexion
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[13px] text-muted-foreground leading-relaxed mt-1">
              Êtes-vous sûr de vouloir vous déconnecter de votre espace Lokka ? Vos données de gestion sont synchronisées en toute sécurité.
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
