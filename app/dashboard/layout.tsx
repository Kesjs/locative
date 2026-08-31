"use client";

import * as React from "react";
import { SidebarProvider, SidebarInset, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import Header from "@/components/dashboard/Header";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { layoutMode } = useSidebar();

  return (
    <SidebarInset className="min-h-screen bg-[var(--bg-canvas)] transition-all duration-300 w-full">
      <div
        className={`w-full mx-auto ${
          layoutMode === "compact"
            ? "p-3 sm:p-4 lg:p-5 max-w-[1350px]"
            : layoutMode === "full"
            ? "p-4 sm:p-6 lg:p-8 max-w-none"
            : "p-4 sm:p-6 lg:p-8 max-w-[1500px]"
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
