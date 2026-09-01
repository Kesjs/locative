"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

interface FormFieldProps {
  /** Texte du label */
  label: string
  /** htmlFor liant le label à l'input enfant */
  htmlFor?: string
  /** Message d'erreur — affiche la couleur destructive */
  error?: string
  /** Message d'aide sous le champ */
  hint?: string
  /** Requis : ajoute un astérisque rouge */
  required?: boolean
  /** Classes CSS additionnelles sur le wrapper */
  className?: string
  children: React.ReactNode
}

/**
 * FormField — wrapper de champ de formulaire sémantique.
 *
 * Usage :
 * ```tsx
 * <FormField label="Loyer mensuel" htmlFor="loyer" required hint="En FCFA">
 *   <Input id="loyer" type="number" />
 * </FormField>
 * ```
 */
export function FormField({
  label,
  htmlFor,
  error,
  hint,
  required,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={htmlFor} className={cn(error && "text-destructive")}>
        {label}
        {required && (
          <span className="ml-0.5 text-destructive" aria-hidden>*</span>
        )}
      </Label>
      {children}
      {error && (
        <p className="text-[11.5px] font-medium text-destructive flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-3.5 h-3.5 shrink-0"
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
      {!error && hint && (
        <p className="text-[11.5px] text-muted-foreground">{hint}</p>
      )}
    </div>
  )
}
