"use client";

import React from "react";
import { NumberTicker } from "@/components/ui/number-ticker";
import { useSidebar } from "@/components/ui/sidebar";

interface KpiCardProps {
  title: string;
  value: number | string;
  currency?: "FCFA" | "€" | "$" | string;
  valueSuffix?: string;
  delta?: { value: string; trend: "up" | "down" | "neutral" };
  /** Raccourci hérité : équivaut à delta={{ value: trend, trend: trendUp ? "up" : "down" }} */
  trend?: string;
  trendUp?: boolean;
  subtitle?: string;
  icon?: React.ElementType;
  iconColor?: "emerald" | "amber" | "rose" | "blue" | "default";
}

export function KpiCard({
  title,
  value,
  currency: currencyProp,
  valueSuffix,
  delta,
  trend,
  trendUp,
  subtitle,
  icon: Icon,
  iconColor = "default",
}: KpiCardProps) {
  const { isPrivacyMode, currency: globalCurrency } = useSidebar();
  const resolvedDelta = delta ?? (trend ? { value: trend, trend: trendUp ? ("up" as const) : ("down" as const) } : undefined);
  
  const iconColorStyles = {
    primary: "bg-[var(--primary-subtle)] text-[var(--primary)]",
    emerald: "bg-[var(--success-subtle)] text-[var(--success)]",
    amber: "bg-[var(--warning-subtle)] text-[var(--warning)]",
    rose: "bg-[var(--danger-subtle)] text-[var(--danger)]",
    blue: "bg-[var(--info-subtle)] text-[var(--info)]",
    default: "bg-[var(--surface-secondary)] text-[var(--foreground)]",
  };

  const isMonetary = Boolean(currencyProp);
  const rawNum = typeof value === "number" ? value : Number(value) || 0;

  // Calcul du montant selon la devise sélectionnée
  let displayValue = rawNum;
  let displayUnit = currencyProp || "FCFA";

  if (isMonetary) {
    if (globalCurrency === "eur") {
      displayValue = Math.round(rawNum / 655.957);
      displayUnit = "€";
    } else if (globalCurrency === "usd") {
      displayValue = Math.round(rawNum / 600);
      displayUnit = "$";
    } else {
      displayValue = rawNum;
      displayUnit = "FCFA";
    }
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-xs hover:border-primary/40 transition-all flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between text-[13px] text-muted-foreground font-medium mb-3">
          <div className="flex items-center gap-2">
            {Icon && (
              <div className={`p-2 rounded-lg ${iconColorStyles[iconColor]} transition-colors`}>
                <Icon className="w-4 h-4" />
              </div>
            )}
            <span className="font-semibold text-card-foreground">{title}</span>
          </div>
          {resolvedDelta && (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11.5px] font-bold border ${
                resolvedDelta.trend === "up"
                  ? "bg-success/10 text-success border-success/20"
                  : resolvedDelta.trend === "down"
                  ? "bg-destructive/10 text-destructive border-destructive/20"
                  : "bg-muted text-muted-foreground border-border"
              }`}
            >
              {resolvedDelta.trend === "up" ? "↑" : resolvedDelta.trend === "down" ? "↓" : ""}
              {resolvedDelta.value}
            </span>
          )}
        </div>

        <div className="text-[28px] font-extrabold text-card-foreground tracking-tight mb-1 flex items-baseline gap-1.5">
          {isPrivacyMode && isMonetary ? (
            <span className="font-extrabold tracking-widest text-slate-400 dark:text-zinc-500 text-[22px] select-none">
              •••••••• <span className="text-[13px] font-bold text-muted-foreground">{displayUnit}</span>
            </span>
          ) : isMonetary ? (
            <>
              <NumberTicker value={displayValue} className="font-extrabold text-card-foreground" />
              <span className="text-[14px] font-semibold text-muted-foreground">
                {displayUnit}
              </span>
            </>
          ) : (
            <>
              {value}
              {valueSuffix && <span className="text-[14px] font-semibold text-muted-foreground ml-1">{valueSuffix}</span>}
            </>
          )}
        </div>
      </div>

      {subtitle && (
        <div className="pt-2 border-t border-border/50 text-[11px] text-muted-foreground">
          {subtitle}
        </div>
      )}
    </div>
  );
}
