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
    <div className="w-full flex flex-col items-center justify-center p-8 sm:p-12 border-2 border-dashed border-border rounded-xl bg-card text-center">
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-muted/50 border border-border flex items-center justify-center mb-4 shadow-xs text-muted-foreground">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <h3 className="text-[16px] font-bold text-card-foreground mb-2">{title}</h3>
      <p className="text-[13px] text-muted-foreground max-w-sm mx-auto mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="min-h-[44px] px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-[14px] font-bold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <PlusIcon className="w-4 h-4" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}
