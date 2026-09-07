"use client";

import React from "react";
import { type ProfileType } from "../_types";
import { Check, Sparkles, Building2, User } from "lucide-react";

interface ProfileCardProps {
  id: ProfileType;
  title: string;
  subtitle: string;
  badge?: string;
  icon: React.ElementType;
  isSelected: boolean;
  onSelect: (id: ProfileType) => void;
}

export function ProfileCard({
  id,
  title,
  subtitle,
  badge,
  icon: Icon,
  isSelected,
  onSelect,
}: ProfileCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={`relative p-4 sm:p-5 text-left rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 group ${
        isSelected
          ? "bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-emerald-500/40"
          : "bg-card text-foreground border-border hover:border-slate-400 hover:shadow-xs"
      }`}
    >
      {/* Upper row: Icon + Checkmark */}
      <div className="flex items-start justify-between w-full">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
            isSelected
              ? "bg-emerald-500 text-slate-950 font-bold"
              : "bg-emerald-50 text-emerald-700 border border-emerald-500/20 group-hover:bg-emerald-100/70"
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>

        {/* Selected check circle */}
        <div
          className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
            isSelected
              ? "bg-emerald-400 text-slate-950"
              : "border border-border opacity-0 group-hover:opacity-100"
          }`}
        >
          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-[15px] sm:text-[16px] tracking-tight">
            {title}
          </span>
          {badge && (
            <span
              className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                isSelected
                  ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30"
                  : "bg-emerald-50 text-emerald-800 border border-emerald-200"
              }`}
            >
              {badge}
            </span>
          )}
        </div>
        <p
          className={`text-[12.5px] leading-relaxed ${
            isSelected ? "text-slate-300" : "text-muted-foreground"
          }`}
        >
          {subtitle}
        </p>
      </div>
    </button>
  );
}
