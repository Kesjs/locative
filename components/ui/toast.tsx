"use client";

import * as React from "react";
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  Loader2,
  X,
} from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info" | "loading";

export interface ToastActionProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}

export interface ToastOptions {
  id?: string;
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
  actionProps?: ToastActionProps;
}

interface ToastItem extends ToastOptions {
  id: string;
  createdAt: number;
}

type Listener = (toasts: ToastItem[]) => void;

class ToastManager {
  private toasts: ToastItem[] = [];
  private listeners: Listener[] = [];

  subscribe(listener: Listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l([...this.toasts]));
  }

  add(options: ToastOptions): string {
    const id = options.id || Math.random().toString(36).substring(2, 9);
    const item: ToastItem = {
      ...options,
      id,
      createdAt: Date.now(),
      duration: options.duration ?? (options.type === "loading" ? Infinity : 4000),
    };

    // Remplace si même ID, sinon ajoute en tête
    const existingIndex = this.toasts.findIndex((t) => t.id === id);
    if (existingIndex > -1) {
      this.toasts[existingIndex] = item;
    } else {
      this.toasts = [item, ...this.toasts.slice(0, 4)]; // Max 5 toasts empilés
    }

    this.notify();

    if (item.duration !== Infinity) {
      setTimeout(() => {
        this.close(id);
      }, item.duration);
    }

    return id;
  }

  close(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  success(title: string, description?: string, options?: Partial<ToastOptions>) {
    return this.add({ title, description, type: "success", ...options });
  }

  error(title: string, description?: string, options?: Partial<ToastOptions>) {
    return this.add({ title, description, type: "error", ...options });
  }

  warning(title: string, description?: string, options?: Partial<ToastOptions>) {
    return this.add({ title, description, type: "warning", ...options });
  }

  info(title: string, description?: string, options?: Partial<ToastOptions>) {
    return this.add({ title, description, type: "info", ...options });
  }

  loading(title: string, description?: string, options?: Partial<ToastOptions>) {
    return this.add({ title, description, type: "loading", duration: Infinity, ...options });
  }

  async promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    }
  ): Promise<T> {
    const id = this.loading(messages.loading);
    try {
      const data = await promise;
      const successMsg =
        typeof messages.success === "function"
          ? messages.success(data)
          : messages.success;
      this.add({ id, title: successMsg, type: "success", duration: 3500 });
      return data;
    } catch (err) {
      const errorMsg =
        typeof messages.error === "function"
          ? messages.error(err)
          : messages.error;
      this.add({ id, title: errorMsg, type: "error", duration: 4500 });
      throw err;
    }
  }
}

export const toast = new ToastManager();

/**
 * Composant Toaster à intégrer dans layout.tsx
 */
export function Toaster() {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  React.useEffect(() => {
    return toast.subscribe((updated) => setToasts(updated));
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="Notifications"
      className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-[420px] w-full pointer-events-none p-2 sm:p-0"
    >
      {toasts.map((t) => {
        const Icon =
          t.type === "success"
            ? CheckCircle2
            : t.type === "error"
            ? AlertCircle
            : t.type === "warning"
            ? AlertTriangle
            : t.type === "loading"
            ? Loader2
            : Info;

        const iconColor =
          t.type === "success"
            ? "text-emerald-500 dark:text-emerald-400"
            : t.type === "error"
            ? "text-red-500 dark:text-red-400"
            : t.type === "warning"
            ? "text-amber-500 dark:text-amber-400"
            : t.type === "loading"
            ? "text-primary animate-spin"
            : "text-blue-500 dark:text-blue-400";

        return (
          <div
            key={t.id}
            className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border shadow-lg transition-all duration-200 bg-[var(--surface-elevated)] border-[var(--border)] text-[var(--foreground)]"
            style={{
              animation: "toast-in 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${iconColor}`} />

            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-[var(--foreground)] leading-snug">
                {t.title}
              </p>
              {t.description && (
                <p className="text-[12px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                  {t.description}
                </p>
              )}

              {t.actionProps && (
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={t.actionProps.onClick}
                    className="text-[11px] font-semibold px-2 py-1 rounded bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 transition"
                  >
                    {t.actionProps.children}
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => toast.close(t.id)}
              className="p-1 -mr-1 -mt-1 rounded text-[var(--text-secondary)] hover:text-[var(--foreground)] transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
