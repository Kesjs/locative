"use client";

import React from "react";
import { type Objectif } from "../_types";
import { Check } from "lucide-react";

interface ObjectiveCardProps {
  id: Objectif;
  title: string;
  subtitle: string;
  icon?: React.ElementType;
  isChecked: boolean;
  onToggle: (id: Objectif) => void;
}

export function ObjectiveCard({
  id,
  title,
  subtitle,
  icon: Icon,
  isChecked,
  onToggle,
}: ObjectiveCardProps) {
  return (
    <div
      onClick={() => onToggle(id)}
      className={`relative flex items-start gap-4 p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all duration-200 ${
        isChecked
          ? "bg-emerald-500/10 dark:bg-emerald-950/40 border-emerald-600 ring-1 ring-emerald-500/30 shadow-xs"
          : "bg-card border-border hover:border-emerald-500/30 hover:shadow-2xs"
      }`}
    >
      {/* Icon optional */}
      {Icon && (
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
            isChecked
              ? "bg-emerald-600 text-white shadow-2xs"
              : "bg-muted text-foreground border border-border"
          }`}
        >
          <Icon className="w-5 h-5" />
        </div>
      )}

      {/* Main Text */}
      <div className="flex-1 min-w-0 pr-2">
        <div className="font-bold text-[14.5px] sm:text-[15.5px] mb-1 leading-tight text-foreground">
          {title}
        </div>
        <div className="text-[12.5px] text-muted-foreground leading-relaxed">
          {subtitle}
        </div>
      </div>

      {/* Checkbox badge */}
      <div
        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all ${
          isChecked
            ? "bg-emerald-600 text-white shadow-2xs ring-2 ring-emerald-500/20"
            : "bg-muted border border-border text-transparent"
        }`}
      >
        <Check className={`w-3.5 h-3.5 stroke-[3] ${isChecked ? "opacity-100" : "opacity-0"}`} />
      </div>
    </div>
  );
}
