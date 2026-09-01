"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Squares2X2Icon,
  UsersIcon,
  CreditCardIcon,
  ShoppingBagIcon,
  GlobeAltIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const NAV_ITEMS = [
  { name: "Vue d'ensemble", href: "/admin", icon: Squares2X2Icon },
  { name: "Gestion Comptes", href: "/admin/utilisateurs", icon: UsersIcon },
  { name: "Facturation", href: "/admin/facturation", icon: CreditCardIcon },
  { name: "Marketplace", href: "/admin/marketplace", icon: ShoppingBagIcon },
  { name: "Domaines & Infra", href: "/admin/domaines", icon: GlobeAltIcon },
  { name: "Paramètres", href: "/admin/parametres", icon: Cog6ToothIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex">
      {/* Sidebar Admin */}
      <aside className="hidden md:flex w-64 flex-col bg-[#0F172A] text-white min-h-screen sticky top-0">
        <div className="p-6">
          <div className="font-extrabold text-[20px]">Lokka Admin</div>
          <div className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mt-1">Superviseur</div>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-[6px] text-[13px] font-bold transition-colors ${
                  isActive ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-[#0F172A] text-white">
          <div className="font-extrabold text-[18px]">Lokka Admin</div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
