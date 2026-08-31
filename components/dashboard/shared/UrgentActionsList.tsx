import React from "react";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

export interface UrgentActionItem {
  id: string | number;
  name: string;
  amountDue: number;
  daysLate: number;
  phone: string;
}

interface UrgentActionsListProps {
  items: UrgentActionItem[];
  onRelance: (item: UrgentActionItem) => void;
  currency?: "FCFA" | "€";
}

export function UrgentActionsList({ items, onRelance, currency = "FCFA" }: UrgentActionsListProps) {
  if (items.length === 0) {
    return (
      <div className="p-4 text-center text-[13px] text-[#64635F] italic border border-[#E8E5E0] rounded-[8px] bg-[#FAF9F6]">
        Aucune action urgente pour le moment.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[12px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs hover:border-[var(--border-strong)] transition-all group"
        >
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                Loyer en retard
              </span>
            </div>
            <div className="text-[14px] font-bold text-[var(--text-primary)]">{item.name}</div>
            <div className="text-[13px] text-[var(--text-secondary)] mt-0.5">
              <span className="font-semibold text-rose-600 dark:text-rose-400">{item.amountDue.toLocaleString("fr-FR")} {currency}</span> · Retard de {item.daysLate} jours
            </div>
          </div>
          <button
            type="button"
            onClick={() => onRelance(item)}
            className="w-full sm:w-auto px-3 py-1.5 bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-default)] rounded-[6px] text-[12px] font-bold flex items-center justify-center gap-2 hover:bg-[var(--hover-bg)] hover:text-blue-600 transition-colors shadow-sm group-hover:border-blue-200"
          >
            <ChatBubbleLeftRightIcon className="w-4 h-4" />
            <span>Relancer</span>
          </button>
        </div>
      ))}
    </div>
  );
}
