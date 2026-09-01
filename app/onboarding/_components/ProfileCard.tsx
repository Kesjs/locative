import React from "react";
import { type ProfileType } from "../_types";

interface ProfileCardProps {
  id: ProfileType;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  isSelected: boolean;
  onSelect: (id: ProfileType) => void;
}

export function ProfileCard({
  id,
  title,
  subtitle,
  icon: Icon,
  isSelected,
  onSelect,
}: ProfileCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={`p-4 text-left rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
        isSelected
          ? "bg-[#0F172A] text-white border-[#0F172A] shadow-md ring-2 ring-[#0F172A]/20"
          : "bg-white text-[#0F172A] border-[#E8E5E0] hover:border-[#0F172A] shadow-sm hover:shadow-md"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-lg ${
            isSelected ? "bg-white/10 text-white" : "bg-[#FAF9F6] text-[#0F172A]"
          }`}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div className="font-bold text-[15px]">{title}</div>
      </div>
      <div
        className={`text-[13px] leading-relaxed ${
          isSelected ? "text-white/80" : "text-[#64635F]"
        }`}
      >
        {subtitle}
      </div>
    </button>
  );
}
