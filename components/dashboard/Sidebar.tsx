"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "./SidebarContext";
import {
  HomeIcon,
  BuildingOfficeIcon,
  UsersIcon,
  CreditCardIcon,
  CalculatorIcon,
  WrenchScrewdriverIcon,
  DocumentDuplicateIcon,
  MegaphoneIcon,
  Cog6ToothIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";

const mainNav = [
  { name: "Vue d'ensemble", href: "/dashboard", icon: HomeIcon },
  { name: "Mes Biens", href: "/dashboard/biens", icon: BuildingOfficeIcon },
  { name: "Locataires", href: "/dashboard/locataires", icon: UsersIcon },
  { name: "Loyers & Paiements", href: "/dashboard/loyers", icon: CreditCardIcon },
];

const managementNav = [
  { name: "Comptabilité", href: "/dashboard/comptabilite", icon: CalculatorIcon },
  { name: "Maintenance", href: "/dashboard/maintenance", icon: WrenchScrewdriverIcon },
  { name: "Documents", href: "/dashboard/documents", icon: DocumentDuplicateIcon },
];

const secondaryNav = [
  { name: "Annonces", href: "/dashboard/annonces", icon: MegaphoneIcon },
  { name: "Paramètres", href: "/dashboard/parametres", icon: Cog6ToothIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed } = useSidebar();

  const isLinkActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside
      style={{
        width: isCollapsed ? 68 : 240,
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        background: "var(--color-surface-secondary)",
        borderRight: "1px solid var(--color-border-primary)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "20px 12px",
        zIndex: 50,
        transition: "width 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: isCollapsed ? "visible" : "hidden",
        boxSizing: "border-box",
      }}
    >
      <div>
        {/* Header / Logo (Icon stays fixed at left: 13px) */}
        <div
          style={{
            padding: "0 7px",
            marginBottom: 28,
            display: "flex",
            alignItems: "center",
            height: 32,
          }}
        >
          <Link
            href="/dashboard"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              textDecoration: "none",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                background: "var(--color-text-primary)",
                borderRadius: 7,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: "var(--color-text-primary)",
                letterSpacing: "-0.02em",
                whiteSpace: "nowrap",
                opacity: isCollapsed ? 0 : 1,
                transition: "opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              Lokka
            </span>
          </Link>
        </div>

        {/* Navigation Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Main Section */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {mainNav.map((item) => {
              const active = isLinkActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-tip={isCollapsed ? item.name : undefined}
                  className={`sidebar-nav-item ${active ? "active" : ""}`}
                  style={{
                    width: "100%",
                    height: 38,
                    padding: "0 13px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    boxSizing: "border-box",
                  }}
                >
                  <item.icon style={{ width: 18, height: 18, strokeWidth: active ? 2 : 1.7, flexShrink: 0 }} />
                  <span
                    style={{
                      whiteSpace: "nowrap",
                      opacity: isCollapsed ? 0 : 1,
                      transition: "opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Management Section */}
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--color-text-tertiary)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                padding: "0 13px",
                marginBottom: 6,
                opacity: isCollapsed ? 0 : 1,
                whiteSpace: "nowrap",
                transition: "opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              Gestion
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {managementNav.map((item) => {
                const active = isLinkActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    data-tip={isCollapsed ? item.name : undefined}
                    className={`sidebar-nav-item ${active ? "active" : ""}`}
                    style={{
                      width: "100%",
                      height: 38,
                      padding: "0 13px",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      boxSizing: "border-box",
                    }}
                  >
                    <item.icon style={{ width: 18, height: 18, strokeWidth: active ? 2 : 1.7, flexShrink: 0 }} />
                    <span
                      style={{
                        whiteSpace: "nowrap",
                        opacity: isCollapsed ? 0 : 1,
                        transition: "opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    >
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Secondary Section */}
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--color-text-tertiary)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                padding: "0 13px",
                marginBottom: 6,
                opacity: isCollapsed ? 0 : 1,
                whiteSpace: "nowrap",
                transition: "opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              Outils
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {secondaryNav.map((item) => {
                const active = isLinkActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    data-tip={isCollapsed ? item.name : undefined}
                    className={`sidebar-nav-item ${active ? "active" : ""}`}
                    style={{
                      width: "100%",
                      height: 38,
                      padding: "0 13px",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      boxSizing: "border-box",
                    }}
                  >
                    <item.icon style={{ width: 18, height: 18, strokeWidth: active ? 2 : 1.7, flexShrink: 0 }} />
                    <span
                      style={{
                        whiteSpace: "nowrap",
                        opacity: isCollapsed ? 0 : 1,
                        transition: "opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    >
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* User profile section at bottom */}
      <div
        data-tip={isCollapsed ? "Alexandre K. — 12 biens" : undefined}
        style={{
          borderTop: "1px solid var(--color-border-primary)",
          paddingTop: 14,
          paddingLeft: 6,
          paddingRight: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "var(--color-accent-light)",
              border: "1px solid rgba(8,127,91,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 600,
              color: "var(--color-accent)",
              flexShrink: 0,
            }}
          >
            AK
          </div>
          <div
            style={{
              opacity: isCollapsed ? 0 : 1,
              whiteSpace: "nowrap",
              transition: "opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)", lineHeight: 1.2 }}>Alexandre K.</div>
            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>12 biens gérés</div>
          </div>
        </div>

        {!isCollapsed && (
          <button
            style={{
              background: "none",
              border: "none",
              color: "var(--color-text-tertiary)",
              cursor: "pointer",
              padding: 4,
            }}
          >
            <EllipsisVerticalIcon style={{ width: 18, height: 18 }} />
          </button>
        )}
      </div>
    </aside>
  );
}
