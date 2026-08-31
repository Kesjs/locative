"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUserProfile } from "@/hooks/useUserProfile";
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
  Users2
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
  if (profileType === "agence") {
    return [
      { title: "Tableau de bord", url: "/dashboard", icon: LayoutDashboard },
      { title: "Mandats & Propriétaires", url: "/dashboard/mandats", icon: Briefcase },
      { title: "Portefeuille Biens", url: "/dashboard/patrimoine", icon: Building2 },
      { title: "Baux & Locataires", url: "/dashboard/baux", icon: Users },
      { title: "Trésorerie & Reversements", url: "/dashboard/tresorerie", icon: Wallet },
      { title: "Vitrine & Acquisition", url: "/dashboard/vitrine", icon: Globe },
      { title: "Maintenance & Artisans", url: "/dashboard/maintenance", icon: Wrench },
      { title: "Équipe", url: "/dashboard/equipe", icon: Users2 },
      { title: "Paramètres", url: "/dashboard/parametres", icon: Settings },
    ];
  }
  if (profileType === "admin") {
    return [
      { title: "Vue Globale", url: "/dashboard/admin", icon: LayoutDashboard },
      { title: "Utilisateurs", url: "/dashboard/admin/utilisateurs", icon: Users },
      { title: "Abonnements", url: "/dashboard/admin/abonnements", icon: CreditCard },
      { title: "Système & Logs", url: "/dashboard/admin/systeme", icon: Settings },
    ];
  }
  
  if (profileType === "locataire") {
    return [
      { title: "Mon Résumé", url: "/dashboard/locataire", icon: LayoutDashboard },
      { title: "Loyers & Paiements", url: "/dashboard/locataire/loyers", icon: CreditCard },
      { title: "Documents", url: "/dashboard/locataire/documents", icon: Globe }, // Reusing an icon for now or DocumentText
      { title: "Maintenance", url: "/dashboard/locataire/maintenance", icon: Wrench },
      { title: "Paramètres", url: "/dashboard/locataire/parametres", icon: Settings },
    ];
  }

  // Default to Bailleur
  return [
    { title: "Tableau de bord", url: "/dashboard", icon: LayoutDashboard },
    { title: "Mon Patrimoine", url: "/dashboard/patrimoine", icon: Building2 },
    { title: "Locataires & Baux", url: "/dashboard/locataires", icon: Users },
    { title: "Loyers & Quittances", url: "/dashboard/loyers", icon: CreditCard },
    { title: "Annonces & Visites", url: "/dashboard/annonces", icon: Megaphone },
    { title: "Maintenance", url: "/dashboard/maintenance", icon: Wrench },
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

  // Synchronise l'ouverture si la route change
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
                  backgroundColor: "var(--color-brand-primary, #18181B)",
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
                backgroundColor: "var(--color-brand-primary, #18181B)",
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

      {/* Submenu collapsible animation */}
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
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { state, setOpenMobile, devRole } = useSidebar();
  const isCollapsed = state === "collapsed";

  const [activeTeam, setActiveTeam] = React.useState(SIDEBAR_DATA.teams[0]);
  const userProfile = useUserProfile();
  
  const currentRole = devRole || userProfile.role || "bailleur";
  // Here we derive the nav items based on the user's actual profileType or devRole
  const navItems = getNavItems(currentRole);

  const isLinkActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-[var(--border-default)] bg-[var(--bg-sidebar)] text-[var(--text-primary)]">
      {/* ─── 1. HEADER : TEAM SWITCHER OU LOGO SIMPLE ─── */}
      <SidebarHeader className="border-b border-[var(--border-subtle)] p-2">
        {(currentRole === "admin" || currentRole === "locataire") ? (
          <div className="flex items-center gap-3 px-3 py-2 h-[48px] rounded-[8px]">
            <div className="flex aspect-square size-8 items-center justify-center rounded-[8px] bg-[var(--color-brand-primary, #18181B)] text-white shrink-0 shadow-xs">
              <Building className="size-4" />
            </div>
            {!isCollapsed && (
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-bold text-[var(--text-primary)] text-[15px]">
                  Lokka
                </span>
                <span className="truncate text-[11px] text-[var(--text-muted)] uppercase tracking-wider">
                  {currentRole === "admin" ? "Administration HQ" : "Espace Locataire"}
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
                    } rounded-[8px] data-[state=open]:bg-[var(--hover-bg)] transition-colors`}
                  >
                    <div
                      style={{
                        backgroundColor: "var(--color-brand-primary, #18181B)",
                        color: "var(--color-brand-text, #FFFFFF)",
                      }}
                      className="flex aspect-square size-8 items-center justify-center rounded-[8px] text-white shrink-0 shadow-xs"
                    >
                      <activeTeam.logo className="size-4" />
                    </div>
                    {!isCollapsed && (
                      <>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-bold text-[var(--text-primary)] text-[13px]">
                            {activeTeam.name}
                          </span>
                          <span className="truncate text-[11px] text-[var(--text-muted)]">
                            {activeTeam.plan}
                          </span>
                        </div>
                        <ChevronsUpDown className="ml-auto size-4 text-[var(--text-muted)]" />
                      </>
                    )}
                  </SidebarMenuButton>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-56 rounded-[10px] p-1.5 shadow-xl border-[var(--border-default)] bg-[var(--bg-surface-elevated)]"
                  align="start"
                  side={isMobile ? "bottom" : "right"}
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="text-xs text-[var(--text-muted)] px-2 py-1.5 font-bold uppercase tracking-wider">
                    {currentRole === "agence" ? "Agences & Filiales" : "Patrimoines & SCI"}
                  </DropdownMenuLabel>
                  {SIDEBAR_DATA.teams.map((team, index) => (
                    <DropdownMenuItem
                      key={team.name}
                      onClick={() => setActiveTeam(team)}
                      className="gap-2.5 p-2 rounded-[6px] text-[12px] font-medium cursor-pointer text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
                    >
                      <div className="flex size-6 items-center justify-center rounded-[4px] border border-[var(--border-default)] bg-[var(--bg-subtle)]">
                        <team.logo className="size-3.5" />
                      </div>
                      <span className="truncate flex-1 font-semibold">{team.name}</span>
                      <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator className="bg-[var(--border-default)]" />
                  <DropdownMenuItem
                    onClick={() => alert(currentRole === "agence" ? "Ajout d'une filiale..." : "Ajout d'un nouveau patrimoine / SCI...")}
                    className="gap-2 p-2 rounded-[6px] text-[12px] font-medium text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] cursor-pointer"
                  >
                    <div className="flex size-6 items-center justify-center rounded-[4px] border border-dashed border-[var(--border-default)] bg-[var(--bg-subtle)]">
                      <Plus className="size-3.5" />
                    </div>
                    <span>{currentRole === "agence" ? "Ajouter une filiale" : "Ajouter une SCI / Bien"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarHeader>

      {/* ─── 2. NAV GROUPS (WITH DISCREET SCROLLBAR & WORKING COLLAPSIBLE SUBMENUS) ─── */}
      <SidebarContent className="sidebar-scrollbar flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {/* Navigation */}
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] px-2 py-1">
              Menu Principal
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
                            backgroundColor: "var(--color-brand-primary, #18181B)",
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

      {/* ─── 3. NAV USER FOOTER (PERFECT CONTRAST IN LIGHT & DARK MODE) ─── */}
      <SidebarFooter className="border-t border-[var(--border-subtle)] p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className={`w-full flex items-center ${
                    isCollapsed ? "justify-center p-0" : "gap-3 px-3 py-2"
                  } rounded-[8px] data-[state=open]:bg-[var(--hover-bg)] transition-colors`}
                >
                  <Avatar className="h-8 w-8 rounded-full border border-[var(--border-default)] shrink-0">
                    <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                    <AvatarFallback className="bg-[var(--color-brand-primary)] text-white text-[11px] font-bold">
                      {userProfile.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {!isCollapsed && (
                    <>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-bold text-[var(--text-primary)] text-[13px]">
                          {userProfile.name}
                        </span>
                        <span className="truncate text-[11px] text-[var(--text-muted)]">
                          {userProfile.role}
                        </span>
                      </div>
                      <ChevronsUpDown className="ml-auto size-4 text-[var(--text-muted)]" />
                    </>
                  )}
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-56 rounded-[10px] p-1.5 shadow-xl border-[var(--border-default)] bg-[var(--bg-surface-elevated)]"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-2">
                  <div className="text-[13px] font-bold text-[var(--text-primary)]">{userProfile.name}</div>
                  <div className="text-[11px] text-[var(--text-muted)] font-normal">{userProfile.role}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[var(--border-default)]" />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => alert("Offre Lokka Pro : Gestion illimitée et baux certifiés.")}
                    className="gap-2 p-2 rounded-[6px] text-[12px] font-medium cursor-pointer text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
                  >
                    <Sparkles className="size-4 text-[#C5A880]" />
                    <span>Passer à Lokka Pro</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => (window.location.href = "/dashboard/parametres")}
                    className="gap-2 p-2 rounded-[6px] text-[12px] font-medium cursor-pointer text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
                  >
                    <BadgeCheck className="size-4 text-[var(--text-secondary)]" />
                    <span>Paramètres du compte</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => (window.location.href = "/dashboard/comptabilite")}
                    className="gap-2 p-2 rounded-[6px] text-[12px] font-medium cursor-pointer text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
                  >
                    <ShieldCheck className="size-4 text-[var(--text-secondary)]" />
                    <span>Fiscalité TFU Bénin</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-[var(--border-default)]" />
                <DropdownMenuItem
                  onClick={() => {
                    window.location.href = "/auth/login";
                  }}
                  className="gap-2 p-2 rounded-[6px] text-[12px] font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                >
                  <LogOut className="size-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
