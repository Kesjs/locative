"use client";

import * as React from "react";
import { SidebarProvider, SidebarInset, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import Header from "@/components/dashboard/Header";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { layoutMode } = useSidebar();

  // Plafonds gardés, mais fluides : le contenu suit la largeur d'écran (peu/pas de
  // vide sur laptop/desktop courant) et ne se bloque au plafond que sur très grand écran.
  const maxWidth =
    layoutMode === "compact"
      ? "clamp(768px, 94vw, 1350px)"
      : layoutMode === "full"
      ? "none"
      : "clamp(768px, 96vw, 1500px)";

  return (
    <SidebarInset className="min-h-screen bg-[var(--bg-canvas)] transition-all duration-300 w-full">
      <div
        style={{ maxWidth }}
        className={`w-full mx-auto ${
          layoutMode === "compact"
            ? "p-3 sm:p-4 lg:p-5"
            : "p-4 sm:p-6 lg:p-8"
        }`}
      >
        <Header />
        {children}
      </div>
    </SidebarInset>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  );
}
