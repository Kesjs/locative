"use client";

import * as React from "react";
import { ChevronRight, MoreHorizontal } from "lucide-react";

const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav"> & {
    separator?: React.ReactNode;
  }
>(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />);
Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<"ol">
>(({ style, ...props }, ref) => (
  <ol
    ref={ref}
    style={{
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: 6,
      fontSize: 13,
      color: "var(--color-text-tertiary)",
      listStyle: "none",
      margin: 0,
      padding: 0,
      ...style,
    }}
    {...props}
  />
));
BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(({ style, ...props }, ref) => (
  <li
    ref={ref}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      ...style,
    }}
    {...props}
  />
));
BreadcrumbItem.displayName = "BreadcrumbItem";

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a">
>(({ style, ...props }, ref) => (
  <a
    ref={ref}
    style={{
      color: "var(--color-text-tertiary)",
      textDecoration: "none",
      transition: "color 0.15s ease",
      cursor: "pointer",
      ...style,
    }}
    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-primary)")}
    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-tertiary)")}
    {...props}
  />
));
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(({ style, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    style={{
      fontWeight: 600,
      color: "var(--color-text-primary)",
      ...style,
    }}
    {...props}
  />
));
BreadcrumbPage.displayName = "BreadcrumbPage";

const BreadcrumbSeparator = ({
  children,
  style,
  ...props
}: React.ComponentProps<"li">) => (
  <li
    role="presentation"
    aria-hidden="true"
    style={{
      display: "flex",
      alignItems: "center",
      fontSize: 12,
      color: "var(--color-text-tertiary)",
      ...style,
    }}
    {...props}
  >
    {children ?? <ChevronRight style={{ width: 14, height: 14 }} />}
  </li>
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
};
