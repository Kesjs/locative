"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const SIDEBAR_WIDTH = "240px";
const SIDEBAR_WIDTH_ICON = "68px";

import {
  applyAccentColor,
  applyThemeMode,
} from "@/lib/theme/color-utils";

export type SidebarVariant = "sidebar" | "floating" | "inset";
export type LayoutMode = "overlay" | "push" | "full" | "default";
export type ThemeMode = "system" | "light" | "dark";
export type CurrencyMode = "fcfa" | "eur" | "usd";
export type DensityMode = "comfort" | "compact";
export type NavLayoutMode = "sidebar" | "topnav";
export type DevRole = "agence" | "bailleur" | "locataire" | "admin";
export const SIDEBAR_COOKIE_NAME = "lokka:sidebar";
export type ColorTheme =
  | "amber"
  | "blue"
  | "indigo"
  | "violet"
  | "emerald"
  | "cyan"
  | "custom";
export type MobileNavVariant = "island" | "dynamic" | "fullscreen";

export const COLOR_THEMES: Record<
  ColorTheme,
  { name: string; hex: string }
> = {
  amber: {
    name: "Ambre Lokka",
    hex: "#F59E0B",
  },
  blue: {
    name: "Bleu",
    hex: "#3B82F6",
  },
  indigo: {
    name: "Indigo",
    hex: "#6366F1",
  },
  violet: {
    name: "Violet",
    hex: "#8B5CF6",
  },
  emerald: {
    name: "Émeraude",
    hex: "#10B981",
  },
  cyan: {
    name: "Cyan",
    hex: "#06B6D4",
  },
  custom: {
    name: "Personnalisée",
    hex: "#F59E0B",
  },
};

type SidebarContext = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean | ((prev: boolean) => boolean)) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
  variant: SidebarVariant;
  setVariant: (v: SidebarVariant) => void;
  layoutMode: LayoutMode;
  setLayoutMode: (l: LayoutMode) => void;
  navLayout: NavLayoutMode;
  setNavLayout: (n: NavLayoutMode) => void;
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  currency: CurrencyMode;
  setCurrency: (c: CurrencyMode) => void;
  colorTheme: ColorTheme;
  setColorTheme: (c: ColorTheme) => void;
  customColorHex: string;
  setCustomColorHex: (hex: string) => void;
  isPrivacyMode: boolean;
  setIsPrivacyMode: (v: boolean | ((prev: boolean) => boolean)) => void;
  togglePrivacyMode: () => void;
  density: DensityMode;
  setDensity: (d: DensityMode) => void;
  mobileNavVariant: MobileNavVariant;
  setMobileNavVariant: (v: MobileNavVariant) => void;
  devRole: DevRole;
  setDevRole: (role: DevRole) => void;
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

    const isControlled = openProp !== undefined;
    const [_open, _setOpen] = React.useState(defaultOpen);
    const open = isControlled ? openProp : _open;

    const setOpen = React.useCallback(
      (value: boolean | ((prev: boolean) => boolean)) => {
        if (isControlled) {
          const next = typeof value === "function" ? value(open) : value;
          setOpenProp?.(next);
        } else {
          _setOpen(value);
        }
      },
      [isControlled, open, setOpenProp]
    );

    // Dynamic preferences
    const [variant, setVariantState] = React.useState<SidebarVariant>("sidebar");
    const [layoutMode, setLayoutModeState] = React.useState<LayoutMode>("push");
    const [navLayout, setNavLayoutState] = React.useState<NavLayoutMode>("sidebar");
    const [theme, setThemeState] = React.useState<ThemeMode>("dark");
    const [currency, setCurrencyState] = React.useState<CurrencyMode>("fcfa");
    const [colorTheme, _setColorTheme] = React.useState<ColorTheme>("amber");
    const [customColorHex, setCustomColorHexState] = React.useState<string>("#F59E0B");
    const [isPrivacyMode, setIsPrivacyMode] = React.useState<boolean>(false);
    const [density, setDensityState] = React.useState<DensityMode>("comfort");
    const [mobileNavVariant, _setMobileNavVariant] = React.useState<MobileNavVariant>("dynamic");
    const [devRole, _setDevRole] = React.useState<DevRole>("bailleur");

    const applyColor = (c: ColorTheme, customHex?: string) => {
      let hex = COLOR_THEMES[c]?.hex || COLOR_THEMES.amber.hex;
      if (c === "custom" && customHex) {
        hex = customHex;
      }
      applyAccentColor(hex);
    };

    React.useEffect(() => {
      try {
        const sv = localStorage.getItem("lokka_pref_sidebar") as SidebarVariant;
        if (sv === "sidebar" || sv === "floating" || sv === "inset") setVariantState(sv);

        const lm = localStorage.getItem("lokka_pref_layout") as LayoutMode;
        if (lm === "overlay" || lm === "push" || lm === "full" || lm === "default") {
          setLayoutModeState(lm);
          if (lm === "full") {
            _setOpen(false);
          }
        }

        const nl = localStorage.getItem("lokka_pref_nav_layout") as NavLayoutMode;
        if (nl === "sidebar" || nl === "topnav") setNavLayoutState(nl);

        const th = localStorage.getItem("lokka_pref_theme") as ThemeMode;
        if (th === "system" || th === "light" || th === "dark") {
          setThemeState(th);
          applyThemeMode(th);
        } else {
          setThemeState("dark");
          applyThemeMode("dark");
        }

        const cu = localStorage.getItem("lokka_pref_currency") as CurrencyMode;
        if (cu === "fcfa" || cu === "eur" || cu === "usd") setCurrencyState(cu);

        const custHex = localStorage.getItem("lokka_pref_custom_hex");
        if (custHex) setCustomColorHexState(custHex);

        const co = localStorage.getItem("lokka_pref_color") as ColorTheme;
        if (co && COLOR_THEMES[co]) {
          _setColorTheme(co);
          applyColor(co, custHex || undefined);
        } else {
          _setColorTheme("amber");
          applyColor("amber");
        }

        const pm = localStorage.getItem("lokka_pref_privacy");
        if (pm === "true") setIsPrivacyMode(true);

        const den = localStorage.getItem("lokka_pref_density") as DensityMode;
        if (den === "comfort" || den === "compact") setDensityState(den);

        const mnv = localStorage.getItem(`${SIDEBAR_COOKIE_NAME}_mobileNavVariant`) as MobileNavVariant;
        if (mnv === "island" || mnv === "dynamic" || mnv === "fullscreen") {
          _setMobileNavVariant(mnv);
        }

        const dr = localStorage.getItem(`${SIDEBAR_COOKIE_NAME}_devRole`) as DevRole;
        if (dr) {
          _setDevRole(dr);
        }
      } catch (_) {}
    }, []);

    React.useEffect(() => {
      if (theme === "system") {
        const mq = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = (e: MediaQueryListEvent) => {
          applyThemeMode("system");
        };
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
      }
    }, [theme]);

    const setVariant = (v: SidebarVariant) => {
      setVariantState(v);
      try {
        localStorage.setItem("lokka_pref_sidebar", v);
      } catch (_) {}
    };

    const setLayoutMode = (l: LayoutMode) => {
      setLayoutModeState(l);
      try {
        localStorage.setItem("lokka_pref_layout", l);
      } catch (_) {}
      if (l === "full") {
        _setOpen(false);
      } else if (l === "push") {
        _setOpen(true);
      } else if (l === "overlay") {
        _setOpen(false);
      }
    };

    const setNavLayout = (n: NavLayoutMode) => {
      setNavLayoutState(n);
      try {
        localStorage.setItem("lokka_pref_nav_layout", n);
      } catch (_) {}
    };

    const setTheme = (t: ThemeMode) => {
      setThemeState(t);
      try {
        localStorage.setItem("lokka_pref_theme", t);
        applyThemeMode(t);
      } catch (_) {}
    };

    const setCurrency = (c: CurrencyMode) => {
      setCurrencyState(c);
      try {
        localStorage.setItem("lokka_pref_currency", c);
      } catch (_) {}
    };

    const setColorTheme = (c: ColorTheme) => {
      _setColorTheme(c);
      try {
        localStorage.setItem("lokka_pref_color", c);
        applyColor(c, customColorHex);
      } catch (_) {}
    };

    const setCustomColorHex = (hex: string) => {
      setCustomColorHexState(hex);
      _setColorTheme("custom");
      try {
        localStorage.setItem("lokka_pref_custom_hex", hex);
        localStorage.setItem("lokka_pref_color", "custom");
        applyAccentColor(hex);
      } catch (_) {}
    };

    const togglePrivacyMode = () => {
      setIsPrivacyMode((prev) => {
        const next = !prev;
        try {
          localStorage.setItem("lokka_pref_privacy", String(next));
        } catch (_) {}
        return next;
      });
    };

    const setDensity = (d: DensityMode) => {
      setDensityState(d);
      try {
        localStorage.setItem("lokka_pref_density", d);
      } catch (_) {}
    };

    const setMobileNavVariant = (v: MobileNavVariant) => {
      _setMobileNavVariant(v);
      try {
        localStorage.setItem(`${SIDEBAR_COOKIE_NAME}_mobileNavVariant`, v);
      } catch (_) {}
    };

    const setDevRole = (r: DevRole) => {
      _setDevRole(r);
      try {
        localStorage.setItem(`${SIDEBAR_COOKIE_NAME}_devRole`, r);
      } catch (_) {}
    };

    const state = open ? "expanded" : "collapsed";

    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((open) => !open)
        : setOpen((open) => !open);
    }, [isMobile, setOpen, setOpenMobile]);

    const contextValue = React.useMemo<SidebarContext>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
        variant,
        setVariant,
        layoutMode,
        setLayoutMode,
        navLayout,
        setNavLayout,
        theme,
        setTheme,
        currency,
        setCurrency,
        colorTheme,
        setColorTheme,
        customColorHex,
        setCustomColorHex,
        isPrivacyMode,
        setIsPrivacyMode,
        togglePrivacyMode,
        density,
        setDensity,
        mobileNavVariant,
        setMobileNavVariant,
        devRole,
        setDevRole,
      }),
      [
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
        variant,
        layoutMode,
        navLayout,
        theme,
        currency,
        colorTheme,
        customColorHex,
        isPrivacyMode,
        density,
        mobileNavVariant,
        devRole,
      ]
    );

    return (
      <SidebarContext.Provider value={contextValue}>
        <div
          ref={ref}
          style={{
            display: "flex",
            minHeight: "100vh",
            width: "100%",
            background: "hsl(var(--background))",
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
  React.ComponentProps<"aside"> & {
    side?: "left" | "right";
    variant?: "sidebar" | "floating" | "inset";
    collapsible?: "offcanvas" | "icon" | "none";
  }
>(
  (
    {
      side = "left",
      variant: variantProp,
      collapsible = "icon",
      className,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const { state, setOpen, variant: ctxVariant, layoutMode, isMobile } = useSidebar();
    const isCollapsed = state === "collapsed";
    const variant = variantProp || ctxVariant;
    const isFloating = variant === "floating";

    // En mode Full, la sidebar se replie complètement hors champ
    const isFullHidden = layoutMode === "full" && isCollapsed;

    if (isMobile) {
      return null;
    }

    return (
      <>
        {/* Backdrop pour fermer le volet Overlay en 1 clic dehors sans piège d'écran */}
        {layoutMode === "overlay" && !isCollapsed && (
          <div
            className="fixed inset-0 bg-black/20 z-45 transition-opacity cursor-pointer"
            onClick={() => setOpen(false)}
          />
        )}

        <aside
          ref={ref}
          data-state={state}
          data-variant={variant}
          data-layout={layoutMode}
          data-collapsible={state === "collapsed" ? collapsible : ""}
          style={{
            width: isCollapsed ? SIDEBAR_WIDTH_ICON : SIDEBAR_WIDTH,
            height: isFloating ? "calc(100vh - 24px)" : "100vh",
            position: "fixed",
            top: isFloating ? 12 : 0,
            left: isFloating ? 12 : 0,
            zIndex: layoutMode === "overlay" && !isCollapsed ? 50 : 40,
            transform: isFullHidden ? "translateX(-130%)" : "translateX(0)",
            opacity: isFullHidden ? 0 : 1,
            pointerEvents: isFullHidden ? "none" : "auto",
            background: "hsl(var(--card))",
            border: isFloating ? "1px solid hsl(var(--border))" : undefined,
            borderRight: !isFloating ? "1px solid hsl(var(--border))" : undefined,
            borderRadius: isFloating ? 12 : 0,
            boxShadow: isFloating || (layoutMode === "overlay" && !isCollapsed)
              ? "var(--shadow-modal)"
              : "none",
            display: "flex",
            flexDirection: "column",
            transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
            overflow: isCollapsed ? "visible" : "hidden",
            boxSizing: "border-box",
            padding: "12px 8px",
            ...style,
          }}
          className={cn("sidebar-container group/sidebar text-foreground bg-card border-border", className)}
          {...props}
        >
          {children}
        </aside>
      </>
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
      aria-label="Toggle Sidebar"
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          toggleSidebar();
        }
      }}
      style={{
        background: "hsl(var(--card))",
        border: "1px solid hsl(var(--border))",
        borderRadius: 8,
        padding: "6px 8px",
        cursor: "pointer",
        color: "hsl(var(--foreground))",
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
  const { state, variant, layoutMode, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed";
  const isFloating = variant === "floating";
  const isInset = variant === "inset";

  // Calcul mathématique précis
  let marginLeft = "0px";

  if (isMobile) {
    marginLeft = "0px";
  } else if (layoutMode === "full") {
    marginLeft = isCollapsed ? "0px" : (isFloating ? "264px" : isInset ? "252px" : SIDEBAR_WIDTH);
  } else if (layoutMode === "overlay") {
    marginLeft = isFloating ? "92px" : isInset ? "80px" : SIDEBAR_WIDTH_ICON;
  } else if (isFloating) {
    marginLeft = isCollapsed ? "92px" : "264px";
  } else if (isInset) {
    marginLeft = isCollapsed ? "80px" : "252px";
  } else {
    marginLeft = isCollapsed ? SIDEBAR_WIDTH_ICON : SIDEBAR_WIDTH;
  }

  const isFullHidden = layoutMode === "full" && isCollapsed;

  return (
    <main
      ref={ref}
      data-variant={variant}
      data-layout={layoutMode}
      style={{
        marginLeft,
        width: isMobile || isFullHidden ? "100%" : `calc(100% - ${marginLeft})`,
        flex: 1,
        minHeight: isInset ? "calc(100vh - 24px)" : "100vh",
        marginRight: isInset ? 12 : isFloating ? 12 : 0,
        marginTop: isInset ? 12 : isFloating ? 12 : 0,
        marginBottom: isInset ? 12 : isFloating ? 12 : 0,
        borderRadius: isInset ? 12 : 0,
        border: isInset ? "1px solid hsl(var(--border))" : "none",
        backgroundColor: isInset ? "hsl(var(--card))" : undefined,
        boxShadow: isInset ? "var(--shadow-card)" : "none",
        transition: "margin-left 0.25s cubic-bezier(0.16, 1, 0.3, 1), width 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        ...style,
      }}
      className={cn("sidebar-inset w-full", className)}
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
    className={cn("border-b border-border/80", className)}
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 4,
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
    className={cn("border-t border-border/80", className)}
    style={{
      marginTop: "auto",
      display: "flex",
      flexDirection: "column",
      gap: 6,
      ...style,
    }}
    {...props}
  />
));
SidebarFooter.displayName = "SidebarFooter";

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="content"
    className={className}
    style={{
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      ...style,
    }}
    {...props}
  />
));
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
      gap: 2,
      ...style,
    }}
    {...props}
  />
));
SidebarGroup.displayName = "SidebarGroup";

export const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, style, ...props }, ref) => {
  const { state } = useSidebar();
  if (state === "collapsed") return null;

  return (
    <div
      ref={ref}
      data-sidebar="group-label"
      style={{
        fontSize: 10,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        color: "hsl(var(--muted-foreground))",
        padding: "4px 8px",
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
      listStyle: "none",
      display: "flex",
      flexDirection: "column",
      gap: 2,
      padding: 0,
      margin: 0,
      ...style,
    }}
    {...props}
  />
));
SidebarMenu.displayName = "SidebarMenu";

export const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ ...props }, ref) => <li ref={ref} {...props} />);
SidebarMenuItem.displayName = "SidebarMenuItem";

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean;
    isActive?: boolean;
    tooltip?: string;
    size?: "sm" | "md" | "lg";
  }
>(
  (
    {
      asChild = false,
      isActive = false,
      tooltip,
      size = "md",
      className,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";
    const Comp = asChild ? Slot : "button";
    const [isHovered, setIsHovered] = React.useState(false);
    const [tooltipTop, setTooltipTop] = React.useState(0);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const handleMouseEnter = () => {
      if (isCollapsed && tooltip && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setTooltipTop(rect.top + rect.height / 2);
      }
      setIsHovered(true);
    };

    return (
      <div
        ref={containerRef}
        className="relative flex items-center w-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Comp
          ref={ref}
          data-sidebar="menu-button"
          data-active={isActive}
          className={cn(className)}
          style={{
            width: "100%",
            height: size === "lg" ? 44 : size === "sm" ? 32 : 36,
            padding: isCollapsed ? 0 : "0 10px",
            display: "flex",
            alignItems: "center",
            justifyContent: isCollapsed ? "center" : "flex-start",
            gap: 10,
            boxSizing: "border-box",
            ...style,
          }}
          {...props}
        >
          {children}
        </Comp>

        {/* Floating Custom Tooltip */}
        {isCollapsed && tooltip && isHovered && (
          <div
            style={{
              position: "fixed",
              left: 76,
              top: tooltipTop,
              transform: "translateY(-50%)",
              zIndex: 9999999,
              backgroundColor: "#0A0A0A",
              color: "#FAFAFA",
              padding: "4px 8px",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: 500,
              whiteSpace: "nowrap",
              pointerEvents: "none",
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.4)",
              border: "1px solid #27272A",
            }}
          >
            {tooltip}
          </div>
        )}
      </div>
    );
  }
);
SidebarMenuButton.displayName = "SidebarMenuButton";
