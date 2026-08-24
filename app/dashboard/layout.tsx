"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset
        style={{
          padding: "32px 40px",
          minHeight: "100vh",
          background: "var(--color-surface-primary)",
        }}
      >
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
