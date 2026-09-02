"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Wallet,
  Building2,
  Receipt,
  Wrench,
  User,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
  { name: "Mon Loyer", href: "/locataire", icon: Wallet },
  { name: "Logement", href: "/locataire/logement", icon: Building2 },
  { name: "Quittances", href: "/locataire/quittances", icon: Receipt },
  { name: "Assistance", href: "/locataire/assistance", icon: Wrench },
  { name: "Compte", href: "/locataire/compte", icon: User },
];

export default function LocataireLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-[#F4F9F6] text-foreground flex flex-col md:flex-row">
      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden md:flex w-64 flex-col bg-card border-r border-border min-h-screen sticky top-0 shrink-0 select-none">
        {/* Header avec Logo & Trait fin */}
        <div className="p-5 border-b border-border/80 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-serif font-bold text-lg shadow-2xs">
            L
          </div>
          <div>
            <div className="font-serif text-lg font-bold tracking-tight text-foreground leading-none">
              Lokka
            </div>
            <div className="text-[10.5px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mt-1">
              Espace Locataire
            </div>
          </div>
        </div>

        {/* Navigation principale */}
        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] font-medium transition-all group",
                  isActive
                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-500/20 shadow-2xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon
                  className={cn(
                    "w-4.5 h-4.5 transition-colors",
                    isActive
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer avec Trait fin et Déconnexion */}
        <div className="p-3 border-t border-border/80 bg-card">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-muted/40 border border-border/60 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-[11px] text-muted-foreground font-medium">Bail certifié Loi 2022-30</span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-[12.5px] font-medium text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Se déconnecter</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 pb-24 md:pb-8">
        <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full">
          {children}
        </div>
      </main>

      {/* ── MOBILE BOTTOM BAR (md:hidden) ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card/95 backdrop-blur-md border-t border-border/80 flex items-center justify-around z-50 px-2 shadow-lg">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors relative",
                isActive
                  ? "text-emerald-700 dark:text-emerald-400 font-bold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-1 tracking-tight">
                {item.name}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-emerald-600" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
