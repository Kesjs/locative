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
      <div className="p-4 text-center text-[13px] text-muted-foreground italic border border-border rounded-lg bg-card">
        Aucune action urgente pour le moment.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs hover:border-primary/30 transition-all group"
        >
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider bg-destructive/10 text-destructive border border-destructive/20">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                Loyer en retard
              </span>
            </div>
            <div className="text-[14px] font-bold text-card-foreground">{item.name}</div>
            <div className="text-[13px] text-muted-foreground mt-0.5">
              <span className="font-semibold text-destructive">{item.amountDue.toLocaleString("fr-FR")} {currency}</span> · Retard de {item.daysLate} jours
            </div>
          </div>
          <button
            type="button"
            onClick={() => onRelance(item)}
            className="w-full sm:w-auto px-3.5 py-2 bg-card hover:bg-muted text-card-foreground border border-border rounded-lg text-[12px] font-bold flex items-center justify-center gap-2 transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <ChatBubbleLeftRightIcon className="w-4 h-4 text-muted-foreground" />
            <span>Relancer</span>
          </button>
        </div>
      ))}
    </div>
  );
}
