"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight, Circle } from "lucide-react";

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, style, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      style={{
        zIndex: 100,
        minWidth: 220,
        overflow: "hidden",
        borderRadius: 8,
        border: "1px solid var(--color-border-primary)",
        background: "var(--color-surface-secondary)",
        padding: 6,
        color: "var(--color-text-primary)",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
        ...style,
      }}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, style, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    style={{
      position: "relative",
      display: "flex",
      cursor: "pointer",
      userSelect: "none",
      alignItems: "center",
      gap: 8,
      borderRadius: 4,
      padding: "8px 10px",
      fontSize: 13,
      fontWeight: 500,
      color: "var(--color-text-primary)",
      outline: "none",
      transition: "background 0.15s ease",
      ...style,
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "var(--color-surface-tertiary)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "transparent";
    }}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, style, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    style={{
      padding: "6px 10px",
      fontSize: 11,
      fontWeight: 600,
      color: "var(--color-text-tertiary)",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      ...style,
    }}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, style, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    style={{
      height: 1,
      margin: "4px -6px",
      background: "var(--color-border-primary)",
      ...style,
    }}
    {...props}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({
  className,
  style,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      style={{
        marginLeft: "auto",
        fontSize: 11,
        letterSpacing: "0.05em",
        color: "var(--color-text-tertiary)",
        ...style,
      }}
      {...props}
    />
  );
};

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
};
