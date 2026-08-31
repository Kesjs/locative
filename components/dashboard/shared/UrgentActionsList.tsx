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
          className="bg-white border border-[#E8E5E0] rounded-[8px] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs hover:border-[#1C1C1C] transition-all"
        >
          <div>
            <div className="text-[14px] font-bold text-[#1C1C1C]">{item.name}</div>
            <div className="text-[12px] text-[#C92A2A] font-semibold mt-0.5">
              Retard de {item.daysLate} jours · {item.amountDue.toLocaleString("fr-FR")} {currency}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onRelance(item)}
            className="w-full sm:w-auto min-h-[44px] sm:min-h-0 px-4 py-2 bg-[#25D366] text-white rounded-[6px] text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-[#1EBE5A] transition-colors shadow-sm"
          >
            <ChatBubbleLeftRightIcon className="w-4 h-4" />
            <span>Relancer</span>
          </button>
        </div>
      ))}
    </div>
  );
}
