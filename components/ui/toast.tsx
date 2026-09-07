"use client";

import React from "react";
import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner";

export interface ToasterProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center";
}

/**
 * Toaster Sonner configuré en bas à droite (bottom-right)
 * avec styles riches et bordures douces conformes aux standards SaaS.
 */
export function Toaster({ position = "bottom-right" }: ToasterProps) {
  return (
    <SonnerToaster
      position={position}
      richColors
      closeButton
      expand={false}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-xl group-[.toaster]:rounded-2xl group-[.toaster]:p-4 group-[.toaster]:text-[13px] group-[.toaster]:font-sans",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:text-[12px] group-[.toast]:mt-0.5",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:font-bold group-[.toast]:rounded-xl",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-xl",
          closeButton:
            "group-[.toast]:border group-[.toast]:border-border/70 group-[.toast]:bg-card group-[.toast]:hover:bg-muted group-[.toast]:text-foreground group-[.toast]:rounded-lg",
          error: "group-[.toaster]:!bg-rose-50/95 group-[.toaster]:!text-rose-950 group-[.toaster]:!border-rose-200",
          success: "group-[.toaster]:!bg-emerald-50/95 group-[.toaster]:!text-emerald-950 group-[.toaster]:!border-emerald-200",
          warning: "group-[.toaster]:!bg-amber-50/95 group-[.toaster]:!text-amber-950 group-[.toaster]:!border-amber-200",
          info: "group-[.toaster]:!bg-blue-50/95 group-[.toaster]:!text-blue-950 group-[.toaster]:!border-blue-200",
        },
      }}
    />
  );
}

export type ToastType = "success" | "error" | "warning" | "info" | "loading";

export interface ToastOptions {
  id?: string;
  title?: string;
  description?: string;
  type?: ToastType;
  duration?: number;
  actionProps?: { children: React.ReactNode; onClick: () => void; className?: string };
}

/**
 * Instance universelle de toast connectée à Sonner
 * Compatible avec les appels `toast({ title, description, type })`
 * et les raccourcis `toast.success()`, `toast.error()`, etc.
 */
export const toast = Object.assign(
  (optionsOrMessage: ToastOptions | string, extra?: any) => {
    if (typeof optionsOrMessage === "string") {
      return sonnerToast(optionsOrMessage, extra);
    }
    const { title, description, type = "info", duration } = optionsOrMessage;
    const fn = (sonnerToast as any)[type] || sonnerToast;
    return fn(title || description, {
      description: title ? description : undefined,
      duration,
    });
  },
  {
    success: (message: string, options?: any) => sonnerToast.success(message, options),
    error: (message: string, options?: any) => sonnerToast.error(message, options),
    warning: (message: string, options?: any) => sonnerToast.warning(message, options),
    info: (message: string, options?: any) => sonnerToast.info(message, options),
    loading: (message: string, options?: any) => sonnerToast.loading(message, options),
    dismiss: (toastId?: string | number) => sonnerToast.dismiss(toastId),
    promise: sonnerToast.promise,
    custom: sonnerToast.custom,
  }
);
