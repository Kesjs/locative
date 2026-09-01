"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  LifebuoyIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  BuildingOfficeIcon as BuildingOfficeIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  LifebuoyIcon as LifebuoyIconSolid,
  UserCircleIcon as UserCircleIconSolid,
} from "@heroicons/react/24/solid";

const NAV_ITEMS = [
  { name: "Mon Loyer", href: "/locataire", IconOutline: HomeIcon, IconSolid: HomeIconSolid },
  { name: "Logement", href: "/locataire/logement", IconOutline: BuildingOfficeIcon, IconSolid: BuildingOfficeIconSolid },
  { name: "Quittances", href: "/locataire/quittances", IconOutline: DocumentTextIcon, IconSolid: DocumentTextIconSolid },
  { name: "Assistance", href: "/locataire/assistance", IconOutline: LifebuoyIcon, IconSolid: LifebuoyIconSolid },
  { name: "Compte", href: "/locataire/compte", IconOutline: UserCircleIcon, IconSolid: UserCircleIconSolid },
];

export default function LocataireLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-[#E8E5E0] min-h-screen sticky top-0">
        <div className="p-6 font-extrabold text-[20px] text-[#0F172A]">Lokka Locataire</div>
        <nav className="flex-1 px-4 space-y-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = isActive ? item.IconSolid : item.IconOutline;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-[8px] text-[14px] font-bold transition-colors ${
                  isActive ? "bg-[#0F172A] text-white" : "text-[#64635F] hover:bg-gray-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto w-full">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-[#E8E5E0] flex items-center justify-around z-50">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = isActive ? item.IconSolid : item.IconOutline;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? "text-[#0F172A]" : "text-[#9C9A95]"
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className={`text-[10px] ${isActive ? "font-bold" : "font-medium"}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
