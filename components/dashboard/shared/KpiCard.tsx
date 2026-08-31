import React from "react";
import { NumberTicker } from "@/components/ui/number-ticker";

interface KpiCardProps {
  title: string;
  value: number;
  currency?: "FCFA" | "€";
  valueSuffix?: string;
  delta?: { value: string; trend: "up" | "down" | "neutral" };
  subtitle?: string;
  icon?: React.ElementType;
}

export function KpiCard({ title, value, currency, valueSuffix, delta, subtitle, icon: Icon }: KpiCardProps) {
  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[12px] p-5 shadow-xs hover:border-[#1C1C1C] transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between text-[12px] text-[var(--text-secondary)] font-medium mb-1">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4 text-[var(--text-primary)]" />}
            <span>{title}</span>
          </div>
          {delta && (
            <span
              className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                delta.trend === "up"
                  ? "bg-[#F0FDF4] text-[#16A34A] border-green-200"
                  : delta.trend === "down"
                  ? "bg-[#FEF2F2] text-[#DC2626] border-red-200"
                  : "bg-[var(--bg-subtle)] text-[var(--text-primary)] border-[var(--border-default)]"
              }`}
            >
              {delta.trend === "up" ? "↑ " : delta.trend === "down" ? "↓ " : ""}
              {delta.value}
            </span>
          )}
        </div>
        <div className="text-[26px] font-extrabold text-[var(--text-primary)] tracking-tight mb-1 flex items-baseline gap-1">
          {currency ? (
            <>
              <NumberTicker value={value} className="font-extrabold" />
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
