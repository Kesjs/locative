import React from "react";
import { PlusIcon } from "@heroicons/react/24/outline";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ElementType;
}

export function EmptyState({ title, description, actionLabel, onAction, icon: Icon }: EmptyStateProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center p-8 sm:p-12 border-2 border-dashed border-[#E8E5E0] rounded-[12px] bg-[#FAF9F6] text-center">
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-white border border-[#E8E5E0] flex items-center justify-center mb-4 shadow-sm text-[#9C9A95]">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <h3 className="text-[16px] font-bold text-[#1C1C1C] mb-2">{title}</h3>
      <p className="text-[13px] text-[#64635F] max-w-sm mx-auto mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="min-h-[44px] px-6 py-2.5 bg-[#1C1C1C] text-white rounded-[6px] text-[14px] font-bold hover:bg-black hover:shadow-md transition-all flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}
