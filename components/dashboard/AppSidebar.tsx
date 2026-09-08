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
import { useBiens } from "@/lib/hooks/useBiens";
import { useMandats } from "@/lib/hooks/useMandats";
import { useResidences } from "@/lib/hooks/useResidences";
import { CreateResidenceModal } from "@/components/dashboard/CreateResidenceModal";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { clearLocalAccountCache } from "@/lib/clearLocalCache";
import { usePatrimoineFilter } from "@/lib/patrimoineFilterContext";
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

export interface NavItem {
  title: string;
  url: string;
  icon: any;
  badge?: string;
  badgeType?: "default" | "danger" | "warning" | "soon";
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

export interface NavGroup {
  groupLabel?: string;
  items: NavItem[];
}

export function getNavGroups(profileType: string): NavGroup[] {
  const norm = (profileType || "").toLowerCase();

  if (norm.includes("agence")) {
    return [
      {
        groupLabel: "Activité & Lots",
        items: [
          { title: "Aperçu Cockpit", url: "/dashboard", icon: LayoutDashboard },
          { title: "Lots sous Gestion", url: "/dashboard/patrimoine", icon: Building2 },
          { title: "Locataires", url: "/dashboard/locataires", icon: Users },
        ],
      },
      {
        groupLabel: "Gérance & Mandats",
        items: [
          { title: "Mandats de Gérance", url: "/dashboard/mandats", icon: Briefcase },
          { title: "Reversements Mandants", url: "/dashboard/comptabilite", icon: Wallet },
          { title: "Baux & Contrats", url: "/dashboard/baux", icon: ShieldCheck },
        ],
      },
      {
        groupLabel: "Opérations",
        items: [
          { title: "Loyers & Encaissements", url: "/dashboard/loyers", icon: CreditCard },
          { title: "Maintenance & Pannes", url: "/dashboard/maintenance", icon: Wrench },
          { title: "Vitrine Publique", url: "/dashboard/annonces", icon: Globe, badge: "Bientôt", badgeType: "warning" },
        ],
      },
      {
        groupLabel: "Cabinet",
        items: [
          { title: "Équipe & Gestionnaires", url: "/dashboard/equipe", icon: Users2 },
          { title: "Paramètres du Cabinet", url: "/dashboard/parametres", icon: Settings },
        ],
      },
    ];
  }

  if (norm.includes("admin")) {
    return [
      {
        groupLabel: "Administration Centrale",
        items: [
          { title: "Global", url: "/dashboard/admin", icon: LayoutDashboard },
          { title: "Utilisateurs", url: "/dashboard/admin/utilisateurs", icon: Users },
          { title: "Abonnements", url: "/dashboard/admin/abonnements", icon: CreditCard },
          { title: "Système", url: "/dashboard/admin/systeme", icon: Settings },
        ],
      },
    ];
  }

  if (norm.includes("locataire")) {
    return [
      {
        groupLabel: "Mon Logement",
        items: [
          { title: "Espace Locataire", url: "/dashboard/locataire", icon: LayoutDashboard },
          { title: "Loyers & Quittances", url: "/dashboard/locataire/loyers", icon: CreditCard },
          { title: "Documents & Bail", url: "/dashboard/locataire/documents", icon: Globe },
          { title: "Pannes & Signalements", url: "/dashboard/locataire/maintenance", icon: Wrench },
          { title: "Paramètres", url: "/dashboard/locataire/parametres", icon: Settings },
        ],
      },
    ];
  }

  // Profil Par Défaut : Propriétaire Bailleur
  return [
    {
      groupLabel: "Mon Patrimoine",
      items: [
        { title: "Vue d'ensemble", url: "/dashboard", icon: LayoutDashboard },
        { title: "Mes Logements", url: "/dashboard/patrimoine", icon: Building2 },
        { title: "Mes Locataires", url: "/dashboard/locataires", icon: Users },
      ],
    },
    {
      groupLabel: "Finances & Loyers",
      items: [
        { title: "Échéancier & Loyers", url: "/dashboard/loyers", icon: CreditCard },
        { title: "Comptabilité & Bilan", url: "/dashboard/comptabilite", icon: Wallet },
      ],
    },
    {
      groupLabel: "Gestion Locative",
      items: [
        { title: "Baux & Quittances", url: "/dashboard/baux", icon: ShieldCheck },
        { title: "Travaux & Dépannages", url: "/dashboard/maintenance", icon: Wrench },
        { title: "Annonces & Vitrine", url: "/dashboard/annonces", icon: Megaphone, badge: "Bientôt", badgeType: "warning" },
      ],
    },
    {
      groupLabel: "Mon Compte",
      items: [
        { title: "Paramètres", url: "/dashboard/parametres", icon: Settings },
      ],
    },
  ];
}

export function getNavItems(profileType: string): NavItem[] {
  return getNavGroups(profileType).flatMap((g) => g.items);
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
                : item.badgeType === "warning" || item.badgeType === "soon"
                ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700"
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
  const {
    state,
    setOpenMobile,
    devRole,
    navLayout,
  } = useSidebar();
  const isCollapsed = state === "collapsed";
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const router = useRouter();

  const { data: biens = [] } = useBiens();
  const activeBiensCount = biens.filter((b) => !b.archive).length;
  const { data: mandats = [] } = useMandats();
  const { data: residences = [] } = useResidences();
  const { activeGroup, setActiveGroup } = usePatrimoineFilter();
  const [isCreateResidenceOpen, setIsCreateResidenceOpen] = React.useState(false);

  // Groupes réels de patrimoine : union des noms de résidences créées explicitement et des
  // valeurs libres encore présentes sur biens.groupe_patrimoine (compat avec l'existant), sans doublon.
  const patrimoineGroups = React.useMemo(() => {
    const set = new Set<string>();
    residences.forEach((r) => {
      if (r.nom && r.nom.trim()) set.add(r.nom.trim());
    });
    biens.forEach((b) => {
      if (b.groupe_patrimoine && b.groupe_patrimoine.trim()) set.add(b.groupe_patrimoine.trim());
    });
    return Array.from(set);
  }, [biens, residences]);

  const [showLogoutDialog, setShowLogoutDialog] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const userProfile = useUserProfile();
  // Le rôle réel du profil (base de données) doit toujours primer sur
  // "devRole", qui est un résidu localStorage d'un ancien sélecteur de
  // rôle de test jamais nettoyé (clé "lokka:sidebar_devRole") — sinon un
  // compte fraîchement créé en bailleur pouvait hériter du menu Agence
  // laissé par un test précédent sur le même navigateur.
  const currentRole = userProfile.role || devRole || "bailleur";
  const isAgency = currentRole.toLowerCase().includes("agence");
  const navGroups = getNavGroups(currentRole);
  const isNormalizedAdminOrLocataire =
    currentRole.toLowerCase().includes("admin") || currentRole.toLowerCase().includes("locataire");

  const workspaceName = isAgency
    ? userProfile.organizationName || "Cabinet Immobilier"
    : userProfile.organizationName || "Mon Patrimoine";

  const workspaceSubtitle = isAgency
    ? `${activeBiensCount} lot${activeBiensCount > 1 ? "s" : ""} · Cabinet Agréé 🇧🇯`
    : activeGroup
    ? `Filtré · ${activeGroup}`
    : `${activeBiensCount} bien${activeBiensCount > 1 ? "s" : ""} · Patrimoine Privé`;

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
      clearLocalAccountCache();
      setShowLogoutDialog(false);
      router.push("/auth/login");
    } catch (err) {
      console.error("Logout error:", err);
      router.push("/auth/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (navLayout === "topnav" && !isMobile) {
    return null;
  }

  return (
    <>
      <Sidebar
        collapsible="icon"
        className="border-r border-[var(--sidebar-border)] bg-[var(--sidebar)] text-[var(--foreground)] z-30"
      >
        {/* ─── 1. HEADER : LOGO & SÉLECTEUR PATRIMOINE / CABINET ─── */}
        <SidebarHeader className="border-b border-[var(--sidebar-border)] p-2">
          {isNormalizedAdminOrLocataire ? (
            <div className="flex items-center gap-2.5 px-2.5 py-1.5 h-[44px] rounded-lg">
              <div className="flex aspect-square size-7 items-center justify-center rounded-md bg-white border border-[var(--border)] shrink-0 shadow-2xs overflow-hidden">
                <img src="/logo.png" alt="Lokka" className="w-full h-full object-contain p-0.5" />
              </div>
              {!isCollapsed && (
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-extrabold text-[var(--foreground)] text-[14px]">
                    Lokka
                  </span>
                  <span className="truncate text-[10.5px] font-bold uppercase tracking-wider text-[var(--primary)]">
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
                      } rounded-lg hover:bg-[var(--surface-hover)] transition-colors cursor-pointer`}
                    >
                      <div
                        className="flex aspect-square size-7 items-center justify-center rounded-md border border-[var(--border)] shrink-0 shadow-2xs overflow-hidden"
                        style={{
                          backgroundColor: userProfile.customLogo ? "transparent" : isAgency ? "rgba(37, 99, 235, 0.12)" : "var(--primary-subtle)",
                          color: isAgency ? "#2563EB" : "var(--primary)",
                        }}
                      >
                        {userProfile.customLogo ? (
                          <img src={userProfile.customLogo} alt="Logo" className="w-full h-full object-contain p-0.5" />
                        ) : isAgency ? (
                          <Briefcase className="size-4" />
                        ) : (
                          <Building2 className="size-4" />
                        )}
                      </div>
                      {!isCollapsed && (
                        <>
                          <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-bold text-[var(--foreground)] text-[13px]">
                              {workspaceName}
                            </span>
                            <span className="truncate text-[10.5px] text-[var(--text-secondary)] font-medium">
                              {workspaceSubtitle}
                            </span>
                          </div>
                          <ChevronsUpDown className="ml-auto size-4 text-[var(--text-secondary)]" />
                        </>
                      )}
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    className="w-64 rounded-xl p-1.5 shadow-xl border border-border bg-card text-foreground z-50 animate-in fade-in-50 zoom-in-95"
                    align="start"
                    side={isMobile ? "bottom" : "right"}
                    sideOffset={6}
                  >
                    <DropdownMenuLabel className="text-[10px] text-muted-foreground px-2 py-1 font-bold uppercase tracking-wider">
                      {isAgency ? "Votre Cabinet & Mandats" : "Vos Groupes de Patrimoine"}
                    </DropdownMenuLabel>
                    {isAgency ? (
                      mandats.length > 0 ? (
                        mandats.map((mandat) => (
                          <DropdownMenuItem
                            key={mandat.id}
                            className="gap-2.5 p-2 rounded-lg text-[12.5px] font-medium cursor-pointer text-foreground hover:bg-muted"
                          >
                            <Briefcase className="size-4 text-blue-600" />
                            <span className="truncate flex-1">{mandat.proprietaire}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-semibold">
                              {mandat.biens} bien{mandat.biens > 1 ? "s" : ""}
                            </span>
                          </DropdownMenuItem>
                        ))
                      ) : (
                        <div className="px-2 py-2 text-[11.5px] text-muted-foreground">
                          Aucun mandat pour l'instant.
                        </div>
                      )
                    ) : (
                      <>
                        <DropdownMenuItem
                          onClick={() => setActiveGroup(null)}
                          className={`gap-2 p-1.5 rounded-md text-[12px] font-medium cursor-pointer ${
                            !activeGroup
                              ? "bg-muted text-[var(--primary)] font-semibold"
                              : "text-foreground hover:bg-muted"
                          }`}
                        >
                          <div
                            className="flex size-5 items-center justify-center rounded border border-border"
                            style={{ backgroundColor: "var(--primary-subtle)", color: "var(--primary)" }}
                          >
                            <Building2 className="size-3" />
                          </div>
                          <span className="truncate flex-1">Tout le patrimoine</span>
                        </DropdownMenuItem>
                        {patrimoineGroups.length > 0 ? (
                          patrimoineGroups.map((group, index) => (
                            <DropdownMenuItem
                              key={group}
                              onClick={() => setActiveGroup(group)}
                              className={`gap-2 p-1.5 rounded-md text-[12px] font-medium cursor-pointer ${
                                activeGroup === group
                                  ? "bg-muted text-[var(--primary)] font-semibold"
                                  : "text-foreground hover:bg-muted"
                              }`}
                            >
                              <div
                                className="flex size-5 items-center justify-center rounded border border-border"
                                style={{ backgroundColor: "var(--primary-subtle)", color: "var(--primary)" }}
                              >
                                <Building className="size-3" />
                              </div>
                              <span className="truncate flex-1">{group}</span>
                              <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                            </DropdownMenuItem>
                          ))
                        ) : (
                          <div className="px-2 py-2 text-[11.5px] text-muted-foreground">
                            Aucun groupe défini — étiquette tes biens depuis "Mon Patrimoine".
                          </div>
                        )}
                      </>
                    )}
                    <DropdownMenuSeparator className="bg-border my-1" />
                    <DropdownMenuItem
                      onClick={() => {
                        if (isAgency) {
                          router.push("/dashboard/parametres");
                        } else {
                          setIsCreateResidenceOpen(true);
                        }
                      }}
                      className="gap-2 p-2 rounded-lg text-[11.5px] font-medium text-muted-foreground hover:bg-muted cursor-pointer"
                    >
                      <Plus className="size-3.5 text-muted-foreground" />
                      <span>{isAgency ? "Paramétrer une nouvelle antenne" : "Créer une résidence"}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          )}
        </SidebarHeader>

        {/* ─── 2. GROUPES DE NAVIGATION HIÉRARCHISÉS ─── */}
        <SidebarContent className="sidebar-scrollbar flex-1 overflow-y-auto px-2 py-3 space-y-3">
          {navGroups.map((group, gIdx) => (
            <SidebarGroup key={group.groupLabel || gIdx} className="p-0">
              {!isCollapsed && group.groupLabel && (
                <SidebarGroupLabel className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/80 px-3 py-1 mb-1 select-none">
                  {group.groupLabel}
                </SidebarGroupLabel>
              )}
              <SidebarMenu className="gap-0.5">
                {group.items.map((item) => {
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
                        } rounded-xl text-[13px] font-medium transition-colors cursor-pointer ${
                          active
                            ? "bg-[var(--primary-subtle)] text-[var(--primary)] font-semibold before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-[var(--primary)] before:rounded-r-sm shadow-2xs"
                            : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                        }`}
                      >
                        <Link
                          href={item.url}
                          className={isCollapsed ? "flex items-center justify-center w-full h-full cursor-pointer" : "cursor-pointer"}
                          onClick={() => isMobile && setOpenMobile(false)}
                        >
                          <item.icon
                            className="size-4 shrink-0 transition-colors"
                            style={{ color: active ? "var(--primary)" : undefined }}
                          />
                          {!isCollapsed && <span className="truncate flex-1 font-medium">{item.title}</span>}
                          {!isCollapsed && item.badge && (
                            <span
                              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                                item.badgeType === "danger"
                                  ? "bg-red-500/15 text-red-500"
                                  : item.badgeType === "warning" || item.badgeType === "soon"
                                  ? "bg-amber-500/15 text-amber-500 border border-amber-500/30"
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
          ))}
        </SidebarContent>

        {/* ─── 3. FOOTER : PROFIL UTILISATEUR ─── */}
        <SidebarFooter className="border-t border-[var(--sidebar-border)] p-2 space-y-2">
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

      {/* Modale de création de résidence */}
      <CreateResidenceModal isOpen={isCreateResidenceOpen} onClose={() => setIsCreateResidenceOpen(false)} />
    </>
  );
}
