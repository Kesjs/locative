import React from "react";
import { NumberTicker } from "@/components/ui/number-ticker";

interface KpiCardProps {
  title: string;
  value: number | string;
  currency?: "FCFA" | "€";
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
  currency,
  valueSuffix,
  delta,
  trend,
  trendUp,
  subtitle,
  icon: Icon,
  iconColor = "default",
}: KpiCardProps) {
  const resolvedDelta = delta ?? (trend ? { value: trend, trend: trendUp ? ("up" as const) : ("down" as const) } : undefined);
  
  const iconColorStyles = {
    emerald: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
    amber: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
    rose: "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400",
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
    default: "bg-[var(--bg-subtle)] text-[var(--text-primary)]",
  };

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[12px] p-5 shadow-xs hover:border-[var(--border-strong)] transition-all flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between text-[13px] text-[var(--text-secondary)] font-medium mb-3">
          <div className="flex items-center gap-2">
            {Icon && (
              <div className={`p-2 rounded-[8px] ${iconColorStyles[iconColor]} transition-colors`}>
                <Icon className="w-4 h-4" />
              </div>
            )}
            <span className="font-semibold">{title}</span>
          </div>
          {resolvedDelta && (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11.5px] font-bold ${
                resolvedDelta.trend === "up"
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                  : resolvedDelta.trend === "down"
                  ? "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400"
                  : "bg-[var(--bg-subtle)] text-[var(--text-primary)]"
              }`}
            >
              {resolvedDelta.trend === "up" ? "↑" : resolvedDelta.trend === "down" ? "↓" : ""}
              {resolvedDelta.value}
            </span>
          )}
        </div>
        <div className="text-[28px] font-extrabold text-[var(--text-primary)] tracking-tight mb-1 flex items-baseline gap-1.5">
          {currency ? (
            <>
              <NumberTicker value={typeof value === "number" ? value : Number(value) || 0} className="font-extrabold" />
              <span className="text-[14px] font-semibold text-[var(--text-secondary)]">
                {currency}
              </span>
            </>
          ) : (
            <>
              {value}
              {valueSuffix && <span className="text-[14px] font-semibold text-[var(--text-secondary)] ml-1">{valueSuffix}</span>}
            </>
          )}
        </div>
      </div>
      {subtitle && (
        <div className="pt-2 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)]">
          {subtitle}
        </div>
      )}
    </div>
  );
}
