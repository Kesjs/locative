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
  onMarkPaid?: (item: UrgentActionItem) => void;
  currency?: "FCFA" | "€";
}

export function UrgentActionsList({ items, onRelance, onMarkPaid, currency = "FCFA" }: UrgentActionsListProps) {
  if (items.length === 0) {
    return (
      <div className="p-6 text-center text-[13px] text-muted-foreground italic border border-border rounded-xl bg-muted/20">
        ✨ Tous vos locataires sont à jour. Aucune relance nécessaire !
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const hasValidPhone = Boolean(item.phone && !item.phone.includes("00000000"));

        return (
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
                <span className="text-[11px] font-semibold text-muted-foreground">
                  +{item.daysLate} jour{item.daysLate > 1 ? "s" : ""}
                </span>
              </div>
              <div className="text-[14px] font-bold text-card-foreground">{item.name}</div>
              <div className="text-[13px] text-muted-foreground mt-0.5">
                <span className="font-semibold text-destructive">{item.amountDue.toLocaleString("fr-FR")} {currency}</span> restant dû
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => onRelance(item)}
                className={`flex-1 sm:flex-initial px-3.5 py-2 bg-card hover:bg-muted text-card-foreground border border-border rounded-lg text-[12px] font-bold flex items-center justify-center gap-2 transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer ${
                  !hasValidPhone ? "opacity-60" : ""
                }`}
                title={!hasValidPhone ? "Numéro WhatsApp non renseigné" : "Ouvrir WhatsApp"}
              >
                <ChatBubbleLeftRightIcon className="w-4 h-4 text-emerald-600" />
                <span>Relancer</span>
              </button>

              {onMarkPaid && (
                <button
                  type="button"
                  onClick={() => onMarkPaid(item)}
                  className="flex-1 sm:flex-initial px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[12px] font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                >
                  <span>Encaisser</span>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
