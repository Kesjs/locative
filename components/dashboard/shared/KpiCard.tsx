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
    emerald: "bg-success/10 text-success",
    amber: "bg-warning/10 text-warning",
    rose: "bg-destructive/10 text-destructive",
    blue: "bg-primary/10 text-primary",
    default: "bg-muted text-foreground",
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-xs hover:border-primary/30 transition-all flex flex-col justify-between group">
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
          {currency ? (
            <>
              <NumberTicker value={typeof value === "number" ? value : Number(value) || 0} className="font-extrabold text-card-foreground" />
              <span className="text-[14px] font-semibold text-muted-foreground">
                {currency}
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
