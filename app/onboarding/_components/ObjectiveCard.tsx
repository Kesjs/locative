import React from "react";
import { type Objectif } from "../_types";
import { CheckIcon } from "@heroicons/react/24/outline";

interface ObjectiveCardProps {
  id: Objectif;
  title: string;
  subtitle: string;
  isChecked: boolean;
  onToggle: (id: Objectif) => void;
}

export function ObjectiveCard({
  id,
  title,
  subtitle,
  isChecked,
  onToggle,
}: ObjectiveCardProps) {
  return (
    <label
      className={`relative flex flex-col p-5 rounded-xl border cursor-pointer transition-all ${
        isChecked
          ? "bg-[#F5F5DC]/40 border-[#0F172A] ring-1 ring-[#0F172A] shadow-sm"
          : "bg-white border-[#E8E5E0] hover:border-[#0F172A] hover:shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="font-bold text-[15px] text-[#0F172A] mb-1">{title}</div>
          <div className="text-[13px] text-[#64635F] leading-relaxed">{subtitle}</div>
        </div>
        
        <div className="pt-0.5">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={isChecked}
            onChange={() => onToggle(id)}
          />
          <div
            className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
              isChecked
                ? "bg-[#0F172A] text-white"
                : "bg-[#FAF9F6] border border-[#E8E5E0] text-transparent peer-hover:border-[#0F172A]"
            }`}
          >
            <CheckIcon className="w-4 h-4 stroke-[3]" />
          </div>
        </div>
      </div>
    </label>
  );
}
