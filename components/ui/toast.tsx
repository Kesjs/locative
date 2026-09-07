"use client";

import React from "react";
import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner";
import { AlertCircle, CheckCircle2, AlertTriangle, Info, Loader2 } from "lucide-react";

export interface ToasterProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center";
}

/**
 * Toaster Sonner configuré en bas à droite (bottom-right)
 * Design Promax : carte blanche neutre, ombre soyeuse, icônes statutaires
 * et bouton de fermeture croix (sans fond rouge agressif).
 */
export function Toaster({ position = "bottom-right" }: ToasterProps) {
  return (
    <SonnerToaster
      position={position}
      closeButton
      expand={false}
      className="toaster group"
      icons={{
        error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
        success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
        warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
        info: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
        loading: <Loader2 className="w-5 h-5 text-emerald-600 animate-spin shrink-0" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-slate-900 group-[.toaster]:border group-[.toaster]:border-slate-200/90 group-[.toaster]:shadow-xl group-[.toaster]:rounded-2xl group-[.toaster]:p-4 group-[.toaster]:text-[13px] group-[.toaster]:font-sans",
          title: "group-[.toast]:font-bold group-[.toast]:text-slate-900 group-[.toast]:text-[13px]",
          description: "group-[.toast]:text-slate-500 group-[.toast]:text-[12px] group-[.toast]:mt-0.5",
          actionButton:
            "group-[.toast]:bg-emerald-600 group-[.toast]:text-white group-[.toast]:font-bold group-[.toast]:rounded-xl group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:text-[12px]",
          cancelButton:
            "group-[.toast]:bg-slate-100 group-[.toast]:text-slate-700 group-[.toast]:rounded-xl",
          closeButton:
            "group-[.toast]:border group-[.toast]:border-slate-200 group-[.toast]:bg-white group-[.toast]:hover:bg-slate-100 group-[.toast]:text-slate-400 group-[.toast]:hover:text-slate-800 group-[.toast]:rounded-lg group-[.toast]:transition-colors",
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
