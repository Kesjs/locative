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

  return (
    <SidebarMenuItem>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all cursor-pointer select-none ${
          isActive
            ? "bg-emerald-600 text-white font-semibold shadow-xs"
            : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
        }`}
      >
        <item.icon className={`size-4.5 shrink-0 ${isActive ? "text-white" : "text-slate-500 dark:text-slate-400"}`} />
        <span className="truncate flex-1 text-left font-medium">{item.title}</span>
        {item.badge && (
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              item.badgeType === "danger"
                ? "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400"
                : isActive
                ? "bg-white/20 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
            }`}
          >
            {item.badge}
          </span>
        )}
        <ChevronRight
          className={`size-4 ${isActive ? "text-white" : "text-slate-400"} transition-transform duration-200 ${
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
            className="overflow-hidden ml-5 pl-2.5 border-l border-slate-200 dark:border-slate-800 space-y-1 mt-1"
          >
            {item.items.map((subItem) => {
              const isSubActive = pathname === subItem.url;
              return (
                <Link
                  key={subItem.title}
                  href={subItem.url}
                  onClick={() => isMobile && setOpenMobile(false)}
                  className={`block text-[12.5px] py-1.5 px-2.5 rounded-lg transition-colors ${
                    isSubActive
                      ? "font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
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
        className="border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101B17] text-slate-900 dark:text-slate-100 z-30"
      >
        {/* ─── 1. HEADER : LOGO & SÉLECTEUR PATRIMOINE ─── */}
        <SidebarHeader className="border-b border-slate-200/80 dark:border-slate-800/80 p-2.5">
          {isNormalizedAdminOrLocataire ? (
            <div className="flex items-center gap-3 px-3 py-2 h-[48px] rounded-xl">
              <div className="flex aspect-square size-8 items-center justify-center rounded-xl bg-white border border-slate-200 dark:border-slate-700 shrink-0 shadow-xs overflow-hidden">
                <img src="/logo.png" alt="Lokka" className="w-full h-full object-contain p-0.5" />
              </div>
              {!isCollapsed && (
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-extrabold text-slate-900 dark:text-white text-[15px]">
                    Lokka
                  </span>
                  <span className="truncate text-[11px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
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
                      } rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer`}
                    >
                      <div className="flex aspect-square size-8 items-center justify-center rounded-xl bg-white border border-slate-200 dark:border-slate-700 shrink-0 shadow-xs overflow-hidden">
                        <img src={userProfile.customLogo || "/logo.png"} alt="Logo" className="w-full h-full object-contain p-0.5" />
                      </div>
                      {!isCollapsed && (
                        <>
                          <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-bold text-slate-900 dark:text-white text-[13.5px]">
                              {activeTeam.name}
                            </span>
                            <span className="truncate text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                              {activeTeam.plan}
                            </span>
                          </div>
                          <ChevronsUpDown className="ml-auto size-4 text-slate-400" />
                        </>
                      )}
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    className="w-60 rounded-2xl p-1.5 shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101B17] text-slate-900 dark:text-slate-100 z-50 animate-in fade-in-50 zoom-in-95"
                    align="start"
                    side={isMobile ? "bottom" : "right"}
                    sideOffset={8}
                  >
                    <DropdownMenuLabel className="text-[10.5px] text-slate-400 dark:text-slate-500 px-2.5 py-1.5 font-bold uppercase tracking-wider">
                      {currentRole.toLowerCase().includes("agence") ? "Agences & Filiales" : "Patrimoines & Portefeuilles"}
                    </DropdownMenuLabel>
                    {SIDEBAR_DATA.teams.map((team, index) => (
                      <DropdownMenuItem
                        key={team.name}
                        onClick={() => setActiveTeam(team)}
                        className="gap-2.5 p-2 rounded-xl text-[12.5px] font-medium cursor-pointer text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <div className="flex size-6 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-emerald-50 dark:bg-emerald-950/50">
                          <team.logo className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="truncate flex-1 font-semibold">{team.name}</span>
                        <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800 my-1" />
                    <DropdownMenuItem
                      onClick={() =>
                        alert(
                          currentRole.toLowerCase().includes("agence")
                            ? "Ajout d'une filiale..."
                            : "Ajout d'un nouveau patrimoine / SCI..."
                        )
                      }
                      className="gap-2 p-2 rounded-xl text-[12px] font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <div className="flex size-6 items-center justify-center rounded-lg border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                        <Plus className="size-3.5 text-slate-600 dark:text-slate-300" />
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
              <SidebarGroupLabel className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 py-1">
                Navigation Principale
              </SidebarGroupLabel>
            )}
            <SidebarMenu className="gap-1.5 mt-1">
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
                      className={`w-full flex items-center ${
                        isCollapsed ? "justify-center p-0 h-10" : "gap-3 px-3 py-2.5"
                      } rounded-xl text-[13.5px] font-medium transition-all ${
                        active
                          ? "bg-emerald-600 dark:bg-emerald-600 text-white font-semibold shadow-xs"
                          : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <Link
                        href={item.url}
                        className={isCollapsed ? "flex items-center justify-center w-full h-full" : undefined}
                        onClick={() => isMobile && setOpenMobile(false)}
                      >
                        <item.icon className={`size-4.5 shrink-0 ${active ? "text-white" : "text-slate-500 dark:text-slate-400"}`} />
                        {!isCollapsed && <span className="truncate flex-1 font-medium">{item.title}</span>}
                        {!isCollapsed && item.badge && (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                              item.badgeType === "danger"
                                ? "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400"
                                : active
                                ? "bg-white/20 text-white"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
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

        {/* ─── 3. FOOTER : PROFIL UTILISATEUR ─── */}
        <SidebarFooter className="border-t border-slate-200/80 dark:border-slate-800/80 p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className={`w-full flex items-center ${
                      isCollapsed ? "justify-center p-0" : "gap-3 px-3 py-2"
                    } rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer`}
                  >
                    <Avatar className="h-8 w-8 rounded-full border border-slate-200 dark:border-slate-700 shrink-0">
                      <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                      <AvatarFallback className="bg-emerald-600 text-white text-[11px] font-bold">
                        {(userProfile.name || "AK").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {!isCollapsed && (
                      <>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-bold text-slate-900 dark:text-white text-[13.5px]">
                            {userProfile.name || "Alexandre Koudjo"}
                          </span>
                          <span className="truncate text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                            {userProfile.role || "Propriétaire Bailleur"}
                          </span>
                        </div>
                        <ChevronsUpDown className="ml-auto size-4 text-slate-400" />
                      </>
                    )}
                  </SidebarMenuButton>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-56 rounded-2xl p-1.5 shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101B17] text-slate-900 dark:text-slate-100 z-50 animate-in fade-in-50 zoom-in-95"
                  side={isMobile ? "bottom" : "right"}
                  align="end"
                  sideOffset={8}
                >
                  <DropdownMenuLabel className="p-2 font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-[13px] font-bold text-slate-900 dark:text-white leading-none">
                        {userProfile.name || "Alexandre Koudjo"}
                      </p>
                      <p className="text-[11px] leading-none text-slate-500 dark:text-slate-400">
                        {userProfile.email || "alexandre@lokka.bj"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800 my-1" />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => router.push("/dashboard/parametres")}
                      className="gap-2 p-2 rounded-xl text-[12.5px] cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <BadgeCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Mon Compte &amp; Sécurité</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => router.push("/dashboard/parametres")}
                      className="gap-2 p-2 rounded-xl text-[12.5px] cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Sparkles className="size-4 text-amber-500" />
                      <span>Abonnement Pro</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800 my-1" />
                  <DropdownMenuItem
                    onClick={() => setShowLogoutDialog(true)}
                    className="gap-2 p-2 rounded-xl text-[12.5px] cursor-pointer text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50"
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
        <AlertDialogContent className="bg-white dark:bg-[#101B17] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md shadow-2xl text-slate-900 dark:text-slate-100">
          <AlertDialogHeader>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-2">
              <LogOut className="w-6 h-6" />
            </div>
            <AlertDialogTitle className="text-[17px] font-bold text-slate-900 dark:text-white">
              Confirmer la déconnexion
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
              Êtes-vous sûr de vouloir vous déconnecter de votre espace Lokka ? Vos données de gestion sont enregistrées en toute sécurité.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-6 flex items-center justify-end gap-3">
            <AlertDialogCancel
              disabled={isLoggingOut}
              className="px-4 py-2 text-[13px] font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer transition"
            >
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmLogout}
              disabled={isLoggingOut}
              className="px-5 py-2 text-[13px] font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white cursor-pointer transition shadow-xs"
            >
              {isLoggingOut ? "Déconnexion..." : "Se déconnecter"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
