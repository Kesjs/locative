"use client";

import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
export const AlertDialogPortal = AlertDialogPrimitive.Portal;

export const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    ref={ref}
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 100,
      background: "rgba(0, 0, 0, 0.4)",
      backdropFilter: "blur(4px)",
    }}
    {...props}
  />
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

export interface AlertDialogContentProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content> {
  from?: "top" | "bottom" | "left" | "right" | "center";
}

export const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  AlertDialogContentProps
>(({ className, from = "center", style, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      style={{
        position: "fixed",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 101,
        width: "100%",
        maxWidth: 440,
        background: "var(--color-surface-secondary)",
        border: "1px solid var(--color-border-primary)",
        borderRadius: 12,
        padding: 24,
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
        ...style,
      }}
      {...props}
    />
  </AlertDialogPortal>
));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

export const AlertDialogHeader = ({
  className,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 8,
      textAlign: "left",
      marginBottom: 20,
      ...style,
    }}
    {...props}
  />
);

export const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, style, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    style={{
      fontFamily: "var(--font-sans)",
      fontSize: 18,
      fontWeight: 600,
      color: "var(--color-text-primary)",
      margin: 0,
      ...style,
    }}
    {...props}
  />
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

export const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, style, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    style={{
      fontSize: 14,
      color: "var(--color-text-secondary)",
      lineHeight: 1.5,
      margin: 0,
      ...style,
    }}
    {...props}
  />
));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;

export const AlertDialogFooter = ({
  className,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    style={{
      display: "flex",
      justifyContent: "flex-end",
      gap: 12,
      ...style,
    }}
    {...props}
  />
);

export const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, style, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className="btn-primary"
    style={{
      padding: "8px 18px",
      fontSize: 13,
      cursor: "pointer",
      ...style,
    }}
    {...props}
  />
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

export const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, style, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className="btn-secondary"
    style={{
      padding: "8px 18px",
      fontSize: 13,
      cursor: "pointer",
      ...style,
    }}
    {...props}
  />
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;
