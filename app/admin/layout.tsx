"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { clearLocalAccountCache } from "@/lib/clearLocalCache";
import {
  Squares2X2Icon,
  UsersIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  ArrowLeftOnRectangleIcon,
  ArrowTopRightOnSquareIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const NAV_ITEMS = [
  { name: "Vue d'ensemble", href: "/admin", icon: Squares2X2Icon },
  { name: "Gestion des Comptes", href: "/admin/utilisateurs", icon: UsersIcon },
  { name: "Loyers & Transactions", href: "/admin/facturation", icon: CreditCardIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState<{ email?: string; name?: string } | null>(null);

  useEffect(() => {
    async function checkAdminAuth() {
      if (!isSupabaseConfigured()) {
        setIsAdmin(true);
        setIsLoading(false);
        return;
      }

      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.replace("/auth/login?redirect=/admin");
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("role, full_name, email")
          .eq("id", user.id)
          .maybeSingle();

        const role = profile?.role || user.user_metadata?.role || "";
        const email = user.email || "";

        const hasAdminAccess =
          role === "super_admin" ||
          role === "admin" ||
          user.user_metadata?.is_admin === true ||
          email.toLowerCase() === "kenkenbabatounde@gmail.com";

        if (hasAdminAccess) {
          setIsAdmin(true);
          setAdminUser({
            email,
            name: profile?.full_name || user.user_metadata?.full_name || "Super Admin",
          });
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.error("Erreur vérification admin:", err);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAdminAuth();
  }, [router]);

  const handleLogout = async () => {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    clearLocalAccountCache();
    router.push("/auth/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-white">
          <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-[13px] font-bold text-slate-300">Vérification des privilèges Administrateur...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-4">
        <div className="bg-white border border-border rounded-2xl p-8 max-w-md w-full shadow-xl text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <ExclamationTriangleIcon className="w-6 h-6" />
          </div>
          <h2 className="text-[18px] font-extrabold text-slate-900">Accès Restreint</h2>
          <p className="text-[13px] text-slate-600 leading-relaxed">
            Cet espace de supervision est réservé exclusivement aux administrateurs de la plateforme Lokka.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/dashboard"
              className="w-full py-2.5 px-4 bg-primary text-primary-foreground font-bold rounded-xl text-[13px] text-center"
            >
              Retour à mon Espace Utilisateur
            </Link>
            <button
              onClick={handleLogout}
              className="w-full py-2.5 px-4 text-slate-600 hover:text-slate-900 font-semibold text-[12.5px] text-center cursor-pointer"
            >
              Se connecter avec un autre compte
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar Admin Pro */}
      <aside className="hidden md:flex w-64 flex-col bg-[#0F172A] text-white min-h-screen sticky top-0 border-r border-slate-800">
        {/* Header Marque */}
        <div className="p-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 p-1 flex items-center justify-center border border-white/10 shrink-0">
              <img src="/logo.png" alt="Lokka" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="font-extrabold text-[16px] text-white tracking-tight">Lokka HQ</div>
              <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <ShieldCheckIcon className="w-3.5 h-3.5" />
                Superviseur National
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Principale */}
        <nav className="flex-1 p-3 space-y-1">
          <div className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5">
            Supervision
          </div>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-bold transition cursor-pointer ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                }`}
              >
                <item.icon className={`w-4.5 h-4.5 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Admin & Raccourci Cockpit */}
        <div className="p-3 border-t border-slate-800/80 space-y-2">
          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Compte Actif</div>
            <div className="text-[12px] font-bold text-white truncate mt-0.5">{adminUser?.name || "Administrateur"}</div>
            <div className="text-[11px] text-slate-400 truncate font-mono">{adminUser?.email || "admin@lokka.bj"}</div>
          </div>

          <Link
            href="/dashboard"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-[12px] font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition"
          >
            <span>Accéder au Cockpit Client</span>
            <ArrowTopRightOnSquareIcon className="w-4 h-4 text-slate-400" />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-semibold text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
          >
            <ArrowLeftOnRectangleIcon className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-x-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-[#0F172A] text-white border-b border-slate-800 sticky top-0 z-40">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Lokka" className="w-7 h-7 object-contain" />
            <span className="font-extrabold text-[15px]">Lokka HQ</span>
          </div>
          <Link
            href="/dashboard"
            className="text-[12px] text-emerald-400 font-bold flex items-center gap-1"
          >
            Cockpit &rarr;
          </Link>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
