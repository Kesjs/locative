"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Home,
  Building2,
  Users,
  CreditCard,
  Calculator,
  Wrench,
  FileText,
  Megaphone,
  Settings,
  ChevronRight,
  ChevronsUpDown,
  Sparkles,
  BadgeCheck,
  Bell,
  LogOut,
  Plus,
  Building,
} from "lucide-react";

const DATA = {
  user: {
    name: "Alexandre K.",
    email: "alexandre@lokka.fr",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  teams: [
    {
      name: "Patrimoine Lokka",
      logo: Building,
      plan: "12 Biens · Pro",
    },
    {
      name: "SCI Paris Haussmann",
      logo: Building2,
      plan: "4 Biens",
    },
  ],
  navMain: [
    {
      title: "Vue d'ensemble",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Mes Biens",
      url: "/dashboard/biens",
      icon: Building2,
      items: [
        { title: "Tous les biens", url: "/dashboard/biens" },
        { title: "Nouveau bien", url: "/dashboard/biens" },
      ],
    },
    {
      title: "Locataires",
      url: "/dashboard/locataires",
      icon: Users,
      items: [
        { title: "Liste locataires", url: "/dashboard/locataires" },
        { title: "Contrats & Baux", url: "/dashboard/locataires" },
      ],
    },
    {
      title: "Loyers & Paiements",
      url: "/dashboard/loyers",
      icon: CreditCard,
    },
  ],
  navManagement: [
    {
      title: "Comptabilité",
      url: "/dashboard/comptabilite",
      icon: Calculator,
    },
    {
      title: "Maintenance",
      url: "/dashboard/maintenance",
      icon: Wrench,
    },
    {
      title: "Documents",
      url: "/dashboard/documents",
      icon: FileText,
    },
  ],
  navSecondary: [
    {
      title: "Annonces",
      url: "/dashboard/annonces",
      icon: Megaphone,
    },
    {
      title: "Paramètres",
      url: "/dashboard/parametres",
      icon: Settings,
    },
  ],
};

export function AppSidebar() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  
  const [userProfile, setUserProfile] = React.useState({
    name: "Alexandre K.",
    email: "bailleur@lokka.bj",
    role: "Propriétaire Bailleur",
    avatar: "https://i.pravatar.cc/150?img=12",
  });

  const [activeTeam, setActiveTeam] = React.useState(DATA.teams[0]);

  React.useEffect(() => {
    try {
      const savedUser = localStorage.getItem("lokka_user_profile");
      const savedOnboarding = localStorage.getItem("lokka_onboarding_data");
      
      if (savedUser || savedOnboarding) {
        const u = savedUser ? JSON.parse(savedUser) : {};
        const o = savedOnboarding ? JSON.parse(savedOnboarding) : {};
        
        const name = o.userName || u.name || "Bailleur Lokka";
        const email = u.email || "contact@lokka.bj";
        const role = o.profileType === "gestionnaire" ? "Gestionnaire Agréé" : o.profileType === "agence" ? "Agence Immobilière" : "Propriétaire Bailleur";
        
        setUserProfile({
          name,
          email,
          role,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=1c1c1c&textColor=ffffff`,
        });

        if (o.property?.title) {
          setActiveTeam({
            name: o.property.title,
            logo: Building,
            plan: `${o.city || "Cotonou"} · Actif`,
          });
        }
      }
    } catch (_) {}
  }, []);

  const isLinkActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <Sidebar collapsible="icon">
      {/* Sidebar Header: Team / Property Switcher */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  tooltip={activeTeam.name}
                  style={{
                    padding: "0 10px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      height: 30,
                      width: 30,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 7,
                      background: "var(--color-text-primary)",
                      color: "#FFFFFF",
                      flexShrink: 0,
                    }}
                  >
                    <activeTeam.logo style={{ width: 15, height: 15 }} />
                  </div>

                  <div
                    style={{
                      display: "grid",
                      flex: 1,
                      textAlign: "left",
                      lineHeight: 1.2,
                      opacity: isCollapsed ? 0 : 1,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      transition: "opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-primary)" }}>
                      {activeTeam.name}
                    </span>
                    <span style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>
                      {activeTeam.plan}
                    </span>
                  </div>

                  {!isCollapsed && (
                    <ChevronsUpDown style={{ marginLeft: "auto", width: 14, height: 14, color: "var(--color-text-tertiary)", flexShrink: 0 }} />
                  )}
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                style={{ width: 220, borderRadius: 8 }}
                align="start"
                side={isMobile ? "bottom" : "right"}
                sideOffset={4}
              >
                <DropdownMenuLabel>Patrimoines</DropdownMenuLabel>
                {DATA.teams.map((team, index) => (
                  <DropdownMenuItem
                    key={team.name}
                    onClick={() => setActiveTeam(team)}
                    style={{ gap: 8, padding: 8 }}
                  >
                    <div
                      style={{
                        display: "flex",
                        height: 24,
                        width: 24,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 4,
                        border: "1px solid var(--color-border-primary)",
                      }}
                    >
                      <team.logo style={{ width: 14, height: 14 }} />
                    </div>
                    {team.name}
                    <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem style={{ gap: 8, padding: 8 }}>
                  <div
                    style={{
                      display: "flex",
                      height: 24,
                      width: 24,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 4,
                      border: "1px solid var(--color-border-primary)",
                      background: "var(--color-surface-tertiary)",
                    }}
                  >
                    <Plus style={{ width: 14, height: 14 }} />
                  </div>
                  <div style={{ fontWeight: 500, color: "var(--color-text-secondary)" }}>
                    Ajouter un bien / SCI
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent>
        {/* Nav Main */}
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarMenu>
            {DATA.navMain.map((item) => {
              const active = isLinkActive(item.url);

              if (item.items && item.items.length > 0 && !isCollapsed) {
                return (
                  <Collapsible key={item.title} asChild defaultOpen={active}>
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.title} isActive={active}>
                          <item.icon style={{ width: 18, height: 18, flexShrink: 0 }} />
                          <span
                            style={{
                              fontSize: 13,
                              whiteSpace: "nowrap",
                              opacity: isCollapsed ? 0 : 1,
                              transition: "opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                            }}
                          >
                            {item.title}
                          </span>
                          {!isCollapsed && (
                            <ChevronRight
                              style={{
                                marginLeft: "auto",
                                width: 14,
                                height: 14,
                                transition: "transform 0.2s ease",
                                flexShrink: 0,
                              }}
                            />
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <Link href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              }

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title} isActive={active}>
                    <Link href={item.url} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", textDecoration: "none" }}>
                      <item.icon style={{ width: 18, height: 18, flexShrink: 0 }} />
                      <span
                        style={{
                          fontSize: 13,
                          whiteSpace: "nowrap",
                          opacity: isCollapsed ? 0 : 1,
                          transition: "opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                      >
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* Nav Management */}
        <SidebarGroup>
          <SidebarGroupLabel>Gestion</SidebarGroupLabel>
          <SidebarMenu>
            {DATA.navManagement.map((item) => {
              const active = isLinkActive(item.url);
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title} isActive={active}>
                    <Link href={item.url} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", textDecoration: "none" }}>
                      <item.icon style={{ width: 18, height: 18, flexShrink: 0 }} />
                      <span
                        style={{
                          fontSize: 13,
                          whiteSpace: "nowrap",
                          opacity: isCollapsed ? 0 : 1,
                          transition: "opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                      >
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* Nav Secondary */}
        <SidebarGroup>
          <SidebarGroupLabel>Outils</SidebarGroupLabel>
          <SidebarMenu>
            {DATA.navSecondary.map((item) => {
              const active = isLinkActive(item.url);
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title} isActive={active}>
                    <Link href={item.url} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", textDecoration: "none" }}>
                      <item.icon style={{ width: 18, height: 18, flexShrink: 0 }} />
                      <span
                        style={{
                          fontSize: 13,
                          whiteSpace: "nowrap",
                          opacity: isCollapsed ? 0 : 1,
                          transition: "opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                      >
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer: User Profile & Dropdown Menu */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  tooltip={userProfile.name}
                  style={{
                    padding: "0 10px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Avatar style={{ height: 32, width: 32, flexShrink: 0 }}>
                    <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                    <AvatarFallback>{userProfile.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>

                  <div
                    style={{
                      display: "grid",
                      flex: 1,
                      textAlign: "left",
                      lineHeight: 1.2,
                      opacity: isCollapsed ? 0 : 1,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      transition: "opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)" }}>
                      {userProfile.name}
                    </span>
                    <span style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>
                      {userProfile.role}
                    </span>
                  </div>

                  {!isCollapsed && (
                    <ChevronsUpDown style={{ marginLeft: "auto", width: 14, height: 14, color: "var(--color-text-tertiary)", flexShrink: 0 }} />
                  )}
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                style={{ width: 230, borderRadius: 8 }}
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel style={{ padding: "8px 10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Avatar style={{ height: 32, width: 32 }}>
                      <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                      <AvatarFallback>{userProfile.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)" }} className="truncate">
                        {userProfile.name}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }} className="truncate">
                        {userProfile.email}
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem style={{ gap: 8 }}>
                    <Sparkles style={{ width: 14, height: 14, color: "var(--color-accent)" }} />
                    Passer à Lokka Pro
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem style={{ gap: 8 }}>
                    <BadgeCheck style={{ width: 14, height: 14 }} />
                    Mon compte
                  </DropdownMenuItem>
                  <DropdownMenuItem style={{ gap: 8 }}>
                    <CreditCard style={{ width: 14, height: 14 }} />
                    Abonnement
                  </DropdownMenuItem>
                  <DropdownMenuItem style={{ gap: 8 }}>
                    <Bell style={{ width: 14, height: 14 }} />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem style={{ gap: 8, color: "var(--color-negative)" }}>
                  <LogOut style={{ width: 14, height: 14 }} />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
