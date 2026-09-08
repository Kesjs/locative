"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebar } from "@/components/ui/sidebar";
import { useUserProfile } from "@/hooks/useUserProfile";
import { getNavItems, type NavItem } from "@/components/dashboard/AppSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { XMarkIcon, ArrowLeftOnRectangleIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import { useBiens } from "@/lib/hooks/useBiens";
import { useMandats } from "@/lib/hooks/useMandats";
import { useResidences } from "@/lib/hooks/useResidences";
import { CreateResidenceModal } from "@/components/dashboard/CreateResidenceModal";
import { usePatrimoineFilter } from "@/lib/patrimoineFilterContext";
import { Sparkles, ArrowRight, Building, Building2, Briefcase, ChevronDown, Plus } from "lucide-react";
import { clearLocalAccountCache } from "@/lib/clearLocalCache";

export function MobileNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { openMobile, setOpenMobile, devRole } = useSidebar();
  const userProfile = useUserProfile();
  const [showLogoutDialog, setShowLogoutDialog] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const currentRole = devRole || userProfile.role || "bailleur";
  // On retire "Paramètres" de la nav mobile — accessible via "Réglages" en bas
  const navItems: NavItem[] = getNavItems(currentRole).filter(
    (item: NavItem) => item.title !== "Paramètres"
  );

  const { data: biens = [] } = useBiens();
  const isNormalizedAdminOrLocataire =
    currentRole.toLowerCase().includes("admin") || currentRole.toLowerCase().includes("locataire");
  const isAgency = currentRole.toLowerCase().includes("agence");

  const { data: mandats = [] } = useMandats();
  const { data: residences = [] } = useResidences();
  const { activeGroup, setActiveGroup } = usePatrimoineFilter();
  const [isSwitcherOpen, setIsSwitcherOpen] = React.useState(false);
  const [isCreateResidenceOpen, setIsCreateResidenceOpen] = React.useState(false);
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

  const handleClose = React.useCallback(() => {
    setOpenMobile(false);
  }, [setOpenMobile]);

  // Lock body scroll when mobile menu is open
  React.useEffect(() => {
    if (openMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [openMobile]);

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        await supabase.auth.signOut();
      }
      clearLocalAccountCache();
      setShowLogoutDialog(false);
      handleClose();
      router.push("/auth/login");
    } catch (err) {
      console.error("Logout error:", err);
      router.push("/auth/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const isLinkActive = (url: string) => {
    if (url === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(url);
  };

  return (
    <>
      <AnimatePresence>
        {openMobile && (
          <div className="fixed inset-0 z-[100] flex md:hidden">
            {/* 1. Dark Backdrop Overlay - Click to close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
              aria-label="Fermer le menu de navigation"
            />

            {/* 2. Drawer Sidebar Panel (Classic slide from left) */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="relative z-10 w-[280px] max-w-[85vw] h-full bg-card text-card-foreground border-r border-border shadow-2xl flex flex-col justify-between overflow-hidden select-none"
            >
              {/* ── HEADER: Logo & Close Button ── */}
              <div className="p-4 border-b border-border flex items-center justify-between bg-card shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex aspect-square h-8 w-8 items-center justify-center rounded-lg bg-white border border-border shrink-0 shadow-xs overflow-hidden">
                    <img
                      src={userProfile.customLogo || "/logo.png"}
                      alt="Lokka Logo"
                      className="w-full h-full object-contain p-0.5"
                    />
                  </div>
                  <div className="flex flex-col leading-tight min-w-0">
                    <span className="font-extrabold text-[15px] tracking-tight text-foreground truncate max-w-[150px]">
                      {isNormalizedAdminOrLocataire ? "Lokka" : userProfile.organizationName || "Lokka"}
                    </span>
                    <span className="text-[10.5px] font-bold text-primary uppercase tracking-wider truncate max-w-[150px]">
                      {isNormalizedAdminOrLocataire
                        ? currentRole.toLowerCase().includes("admin")
                          ? "Admin HQ"
                          : "Espace Locataire"
                        : activeGroup || "Tout le patrimoine"}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                  title="Fermer"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              {/* ── SÉLECTEUR PATRIMOINE / MANDATS (bailleur & agence uniquement) ── */}
              {!isNormalizedAdminOrLocataire && (
                <div className="border-b border-border shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsSwitcherOpen((v) => !v)}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-[12px] font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      {isAgency ? <Briefcase className="w-3.5 h-3.5" /> : <Building2 className="w-3.5 h-3.5" />}
                      {isAgency ? "Cabinet & Mandats" : "Groupes de patrimoine"}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isSwitcherOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {isSwitcherOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 pb-2.5 space-y-1">
                          {isAgency ? (
                            mandats.length > 0 ? (
                              mandats.map((mandat) => (
                                <div
                                  key={mandat.id}
                                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-foreground"
                                >
                                  <Briefcase className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                  <span className="truncate flex-1">{mandat.proprietaire}</span>
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-semibold shrink-0">
                                    {mandat.biens} bien{mandat.biens > 1 ? "s" : ""}
                                  </span>
                                </div>
                              ))
                            ) : (
                              <p className="px-2.5 py-1.5 text-[11.5px] text-muted-foreground">Aucun mandat pour l'instant.</p>
                            )
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => setActiveGroup(null)}
                                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] font-medium cursor-pointer ${
                                  !activeGroup ? "bg-muted text-[var(--primary)] font-semibold" : "text-foreground hover:bg-muted"
                                }`}
                              >
                                <Building2 className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate flex-1 text-left">Tout le patrimoine</span>
                              </button>
                              {patrimoineGroups.length > 0 ? (
                                patrimoineGroups.map((group) => (
                                  <button
                                    key={group}
                                    type="button"
                                    onClick={() => setActiveGroup(group)}
                                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] font-medium cursor-pointer ${
                                      activeGroup === group
                                        ? "bg-muted text-[var(--primary)] font-semibold"
                                        : "text-foreground hover:bg-muted"
                                    }`}
                                  >
                                    <Building className="w-3.5 h-3.5 shrink-0" />
                                    <span className="truncate flex-1 text-left">{group}</span>
                                  </button>
                                ))
                              ) : (
                                <p className="px-2.5 py-1.5 text-[11.5px] text-muted-foreground">
                                  Aucun groupe défini pour l'instant.
                                </p>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  setIsSwitcherOpen(false);
                                  setIsCreateResidenceOpen(true);
                                }}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11.5px] font-medium text-muted-foreground hover:bg-muted cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate flex-1 text-left">Créer une résidence</span>
                              </button>
                            </>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* ── NAVIGATION LIST: Matching Desktop Items ── */}
              <div className="flex-1 overflow-y-auto px-3 py-4 sidebar-scrollbar">
                <div>
                  <nav className="space-y-1">
                    {navItems.map((item: NavItem) => {
                      const active = isLinkActive(item.url);
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.title}
                          href={item.url}
                          onClick={handleClose}
                          className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] font-medium transition-all ${
                            active
                              ? "bg-[var(--primary-subtle)] text-[var(--primary)] font-semibold before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-[var(--primary)] before:rounded-r-sm shadow-2xs"
                              : "text-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          <Icon className={`h-4.5 w-4.5 shrink-0 transition-colors ${active ? "text-[var(--primary)]" : "text-muted-foreground"}`} />
                          <span className="truncate flex-1">{item.title}</span>
                          {item.badge && (
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                                item.badgeType === "danger"
                                  ? "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400"
                                  : item.badgeType === "warning" || item.badgeType === "soon"
                                  ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700"
                                  : "bg-muted text-foreground border border-border"
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              </div>

              {/* ── FOOTER: User Profile & Quick Logout ── */}
              <div className="border-t border-border p-3 bg-card shrink-0 space-y-2">
                {/* Profil utilisateur */}
                <div className="flex items-center gap-3 p-2 rounded-xl bg-muted/40 border border-border">
                  <Avatar className="h-9 w-9 rounded-full border border-border shrink-0">
                    <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                    <AvatarFallback className="bg-[#087F5B] text-white text-[12px] font-bold">
                      {(userProfile.name || "AK").slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 leading-tight">
                    <div className="text-[13px] font-bold text-foreground truncate">
                      {userProfile.name}
                    </div>
                    <div className="text-[11px] text-muted-foreground truncate">
                      {userProfile.role}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <Link
                    href="/dashboard/parametres"
                    onClick={handleClose}
                    className="flex items-center justify-center gap-1.5 py-2 px-1.5 rounded-lg border border-border bg-card hover:bg-muted text-foreground text-[11.5px] font-semibold transition"
                  >
                    <Cog6ToothIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Réglages</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setShowLogoutDialog(true)}
                    className="flex items-center justify-center gap-1.5 py-2 px-1.5 rounded-lg bg-destructive/10 hover:bg-destructive/15 text-destructive text-[11.5px] font-semibold transition cursor-pointer"
                  >
                    <ArrowLeftOnRectangleIcon className="h-3.5 w-3.5" />
                    <span>Quitter</span>
                  </button>
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation de Déconnexion Mobile */}
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
              Êtes-vous sûr de vouloir vous déconnecter de votre espace Lokka ?
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

      <CreateResidenceModal isOpen={isCreateResidenceOpen} onClose={() => setIsCreateResidenceOpen(false)} />
    </>
  );
}
