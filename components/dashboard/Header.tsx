"use client";

import * as React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PlusIcon, ArrowPathIcon, PencilIcon } from "@heroicons/react/24/outline";

export default function Header({
  breadcrumbs = ["Tableau de bord", "Vue d'ensemble"],
  title = "Vue d'ensemble",
  subtitle = "Suivi en temps réel de vos encaissements, taux d'occupation et performance locative.",
}: {
  breadcrumbs?: string[];
  title?: string;
  subtitle?: string;
}) {
  return (
    <header style={{ marginBottom: 28 }}>
      {/* Top action / Breadcrumbs bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        {/* Left: Radix Sidebar Trigger + Breadcrumbs */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <SidebarTrigger />
          <Separator orientation="vertical" style={{ height: 16 }} />

          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, i) => {
                const isLast = i === breadcrumbs.length - 1;
                return (
                  <React.Fragment key={i}>
                    {i > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage>{crumb}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href="/dashboard">{crumb}</BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--color-text-tertiary)" }}>
            <ArrowPathIcon style={{ width: 14, height: 14 }} />
            Actualisé il y a 4 min
          </div>

          <button
            className="btn-secondary"
            style={{ padding: "6px 14px", fontSize: 13, gap: 6, height: 34 }}
          >
            <PencilIcon style={{ width: 14, height: 14 }} /> Modifier la vue
          </button>

          <button
            className="btn-primary"
            style={{ padding: "6px 16px", fontSize: 13, gap: 6, height: 34 }}
          >
            <PlusIcon style={{ width: 14, height: 14 }} /> Ajouter un bien
          </button>
        </div>
      </div>

      {/* Main Title section */}
      <div>
        <h1
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "var(--color-text-primary)",
            marginBottom: 4,
          }}
        >
          {title}
        </h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)" }}>
          {subtitle}
        </p>
      </div>
    </header>
  );
}
