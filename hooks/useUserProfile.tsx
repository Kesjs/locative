"use client";

import { useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export type LokkaPlan = "starter" | "pro" | "agence";

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  customLogo?: string;
  role: string;
  plan: LokkaPlan;
  quotaBiens: { current: number; max: number };
  organizationName?: string;
  organizationType?: string;
}

// État affiché brièvement le temps que le vrai profil Supabase soit chargé —
// volontairement vide (pas de nom/plan factice) pour ne jamais afficher une
// fausse identité à la place du vrai propriétaire.
const DEFAULT_PROFILE: UserProfile = {
  name: "",
  email: "",
  avatar: "",
  customLogo: "",
  role: "Propriétaire Bailleur",
  plan: "pro",
  quotaBiens: { current: 0, max: 10 },
  organizationName: "",
  organizationType: "",
};

const ROLE_LABELS: Record<string, string> = {
  bailleur: "Propriétaire Bailleur",
  owner: "Propriétaire Bailleur",
  gestionnaire: "Gestionnaire",
  manager: "Gestionnaire",
  agence: "Agence",
  agency_admin: "Agence",
  locataire: "Locataire",
  tenant: "Locataire",
  admin: "Administrateur",
  super_admin: "Administrateur",
};

const PLAN_QUOTAS: Record<LokkaPlan, { current: number; max: number }> = {
  starter: { current: 2, max: 2 },
  pro: { current: 4, max: 10 },
  agence: { current: 18, max: 999 },
};

export function useUserProfile(): UserProfile & {
  switchDevPlan: (newPlan: LokkaPlan, newRole?: string) => void;
  updateCustomLogo: (logoUrl: string) => void;
} {
  const [profile, setProfile] = useState<UserProfile>(() => {
    if (typeof window !== "undefined") {
      const savedLogo = localStorage.getItem("lokka_custom_logo");
      // lokka_dev_role / lokka_dev_plan sont une bascule réservée au dev local
      // (DevPlanSwitcher, déjà masqué en production) : elles ne doivent jamais
      // déterminer le rôle ou le plan d'un vrai compte. Le rôle réel vient
      // exclusivement de profiles.role en base, chargé juste après par load().
      const isDev = process.env.NODE_ENV !== "production";
      const savedPlan = isDev ? (localStorage.getItem("lokka_dev_plan") as LokkaPlan) : null;
      const savedRole = isDev ? localStorage.getItem("lokka_dev_role") : null;
      if (savedPlan || savedRole || savedLogo) {
        const plan = savedPlan || "pro";
        return {
          ...DEFAULT_PROFILE,
          plan,
          role: savedRole || (plan === "agence" ? "Agence" : "Propriétaire Bailleur"),
          customLogo: savedLogo || "",
          quotaBiens: PLAN_QUOTAS[plan] || DEFAULT_PROFILE.quotaBiens,
        };
      }
    }
    return DEFAULT_PROFILE;
  });

  useEffect(() => {
    let isMounted = true;

    async function load() {
      if (!isSupabaseConfigured()) return;

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("full_name, email, avatar_url, role, logo_url, organization_id")
        .eq("id", user.id)
        .single();

      if (data && isMounted) {
        const role = ROLE_LABELS[data.role as string] || "Propriétaire Bailleur";
        const isAgencyRole = data.role === "agence" || data.role === "agency_admin";
        const isDev = process.env.NODE_ENV !== "production";
        const devPlan = isDev ? (localStorage.getItem("lokka_dev_plan") as LokkaPlan) : null;
        const savedPlan = devPlan || (isAgencyRole ? "agence" : "pro");
        const customLogo = data.logo_url || localStorage.getItem("lokka_custom_logo") || "";

        let organizationName = "";
        let organizationType = "";
        if (data.organization_id) {
          const { data: org } = await supabase
            .from("organizations")
            .select("name, type")
            .eq("id", data.organization_id)
            .maybeSingle();
          organizationName = org?.name || "";
          organizationType = org?.type || "";
        }

        if (!isMounted) return;

        setProfile({
          name: data.full_name || (isAgencyRole ? "Agence Immobilière" : "Propriétaire"),
          email: data.email || user.email || "",
          avatar: data.avatar_url || "",
          customLogo,
          role,
          plan: savedPlan,
          quotaBiens: PLAN_QUOTAS[savedPlan] || { current: 4, max: 10 },
          organizationName,
          organizationType,
        });
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const switchDevPlan = (newPlan: LokkaPlan, newRole?: string) => {
    const role = newRole || (newPlan === "agence" ? "Agence" : "Propriétaire Bailleur");
    const updated: UserProfile = {
      ...profile,
      plan: newPlan,
      role,
      quotaBiens: PLAN_QUOTAS[newPlan] || { current: 4, max: 10 },
    };
    setProfile(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("lokka_dev_plan", newPlan);
      localStorage.setItem("lokka_dev_role", role);
      window.dispatchEvent(new Event("storage"));
    }
  };

  const updateCustomLogo = (logoUrl: string) => {
    setProfile((prev) => ({ ...prev, customLogo: logoUrl }));
    if (typeof window !== "undefined") {
      localStorage.setItem("lokka_custom_logo", logoUrl);
      window.dispatchEvent(new Event("storage"));
    }
  };

  return {
    ...profile,
    switchDevPlan,
    updateCustomLogo,
  };
}
