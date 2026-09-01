"use client";

import * as React from "react";
import { SidebarProvider, SidebarInset, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import Header from "@/components/dashboard/Header";
import { DevPlanSwitcher } from "@/components/dashboard/DevPlanSwitcher";

function DashboardContent({ children }: { children: React.ReactNode }) {
  return (
    <SidebarInset className="min-h-screen bg-[var(--bg-canvas)] transition-all duration-300 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <Header />
        {children}
      </div>
      <DevPlanSwitcher />
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
