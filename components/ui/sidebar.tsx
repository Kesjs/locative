"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const SIDEBAR_WIDTH = "240px";
const SIDEBAR_WIDTH_ICON = "68px";

type SidebarContext = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContext | null>(null);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}

export const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile();
    const [openMobile, setOpenMobile] = React.useState(false);

    const [_open, _setOpen] = React.useState(defaultOpen);
    const open = openProp ?? _open;
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value;
        if (setOpenProp) {
          setOpenProp(openState);
        } else {
          _setOpen(openState);
        }
      },
      [setOpenProp, open]
    );

    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((open) => !open)
        : setOpen((open) => !open);
    }, [isMobile, setOpen, setOpenMobile]);

    const state = open ? "expanded" : "collapsed";

    const contextValue = React.useMemo<SidebarContext>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    );

    return (
      <SidebarContext.Provider value={contextValue}>
        <div
          ref={ref}
          style={{
            display: "flex",
            minHeight: "100vh",
            width: "100%",
            background: "var(--color-surface-primary)",
            ...style,
          }}
          className={cn("group/sidebar-wrapper", className)}
          {...props}
        >
          {children}
        </div>
      </SidebarContext.Provider>
    );
  }
);
SidebarProvider.displayName = "SidebarProvider";

export const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right";
    variant?: "sidebar" | "floating" | "inset";
    collapsible?: "offcanvas" | "icon" | "none";
  }
>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "icon",
      className,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";

    return (
      <aside
        ref={ref}
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        style={{
          width: isCollapsed ? SIDEBAR_WIDTH_ICON : SIDEBAR_WIDTH,
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 40,
          background: "var(--color-surface-secondary)",
          borderRight: "1px solid var(--color-border-primary)",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: isCollapsed ? "visible" : "hidden",
          boxSizing: "border-box",
          padding: "16px 12px",
          ...style,
        }}
        className={cn("sidebar-container group/sidebar", className)}
        {...props}
      >
        {children}
      </aside>
    );
  }
);
Sidebar.displayName = "Sidebar";

export const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, onClick, style, ...props }, ref) => {
  const { toggleSidebar, state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <button
      ref={ref}
      data-sidebar="trigger"
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      style={{
        background: "var(--color-surface-secondary)",
        border: "1px solid var(--color-border-primary)",
        borderRadius: 6,
        padding: "6px 8px",
        cursor: "pointer",
        color: "var(--color-text-primary)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s ease",
        ...style,
      }}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeWidth="2"
        fill="none"
        stroke="currentColor"
        style={{
          width: 18,
          height: 18,
          transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
        <path d="M9 4v16" />
        <path d="M14 10l2 2l-2 2" />
      </svg>
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";

export const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();
  return (
    <button
      ref={ref}
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      style={{
        position: "absolute",
        right: -4,
        top: 0,
        bottom: 0,
        width: 8,
        cursor: "col-resize",
        background: "transparent",
        border: "none",
        zIndex: 50,
      }}
      {...props}
    />
  );
});
SidebarRail.displayName = "SidebarRail";

export const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main">
>(({ className, style, ...props }, ref) => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <main
      ref={ref}
      style={{
        marginLeft: isCollapsed ? SIDEBAR_WIDTH_ICON : SIDEBAR_WIDTH,
        width: "100%",
        minHeight: "100vh",
        transition: "margin-left 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        ...style,
      }}
      className={cn("sidebar-inset", className)}
      {...props}
    />
  );
});
SidebarInset.displayName = "SidebarInset";

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="header"
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 8,
      marginBottom: 16,
      ...style,
    }}
    {...props}
  />
));
SidebarHeader.displayName = "SidebarHeader";

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="footer"
    style={{
      marginTop: "auto",
      paddingTop: 12,
      borderTop: "1px solid var(--color-border-primary)",
      ...style,
    }}
    {...props}
  />
));
SidebarFooter.displayName = "SidebarFooter";

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, style, ...props }, ref) => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <div
      ref={ref}
      data-sidebar="content"
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        gap: 16,
        overflowY: isCollapsed ? "visible" : "auto",
        overflowX: isCollapsed ? "visible" : "hidden",
        ...style,
      }}
      {...props}
    />
  );
});
SidebarContent.displayName = "SidebarContent";

export const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="group"
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 4,
      ...style,
    }}
    {...props}
  />
));
SidebarGroup.displayName = "SidebarGroup";

export const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { asChild?: boolean }
>(({ className, asChild = false, style, ...props }, ref) => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      ref={ref}
      data-sidebar="group-label"
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: "var(--color-text-tertiary)",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        padding: "4px 10px",
        opacity: isCollapsed ? 0 : 1,
        transition: "opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        whiteSpace: "nowrap",
        overflow: "hidden",
        ...style,
      }}
      {...props}
    />
  );
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";

export const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, style, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu"
    style={{
      display: "flex",
      width: "100%",
      flexDirection: "column",
      gap: 4,
      listStyle: "none",
      margin: 0,
      padding: 0,
      ...style,
    }}
    {...props}
  />
));
SidebarMenu.displayName = "SidebarMenu";

export const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, style, ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    style={{
      position: "relative",
      listStyle: "none",
      ...style,
    }}
    {...props}
  />
));
SidebarMenuItem.displayName = "SidebarMenuItem";

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean;
    isActive?: boolean;
    tooltip?: string;
    size?: "default" | "sm" | "lg";
  }
>(
  (
    {
      asChild = false,
      isActive = false,
      tooltip,
      size = "default",
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-active={isActive}
        data-tip={isCollapsed ? tooltip : undefined}
        className={cn(className)}
        style={{
          width: "100%",
          height: size === "lg" ? 48 : size === "sm" ? 32 : 38,
          padding: "0 11px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          boxSizing: "border-box",
          ...style,
        }}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
SidebarMenuButton.displayName = "SidebarMenuButton";

export const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, style, ...props }, ref) => {
  const { state } = useSidebar();
  if (state === "collapsed") return null;

  return (
    <ul
      ref={ref}
      data-sidebar="menu-sub"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        paddingLeft: 24,
        marginTop: 4,
        listStyle: "none",
        borderLeft: "1px solid var(--color-border-primary)",
        marginLeft: 16,
        ...style,
      }}
      {...props}
    />
  );
});
SidebarMenuSub.displayName = "SidebarMenuSub";

export const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ ...props }, ref) => <li ref={ref} {...props} />);
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";

export const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a"> & {
    asChild?: boolean;
    size?: "sm" | "md";
    isActive?: boolean;
  }
>(({ asChild = false, size = "md", isActive, className, style, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-sub-button"
      data-active={isActive}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        borderRadius: 4,
        padding: "6px 10px",
        fontSize: 13,
        fontWeight: isActive ? 600 : 400,
        color: isActive ? "var(--color-text-primary)" : "var(--color-text-secondary)",
        textDecoration: "none",
        transition: "background 0.15s ease",
        ...style,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-surface-tertiary)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      {...props}
    />
  );
});
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";
