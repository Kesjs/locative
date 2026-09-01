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
}

const DEFAULT_PROFILE: UserProfile = {
  name: "Alexandre Koudjo",
  email: "alexandre@lokka.bj",
  avatar: "",
  customLogo: "",
  role: "Propriétaire Bailleur",
  plan: "pro",
  quotaBiens: { current: 4, max: 10 },
};

const ROLE_LABELS: Record<string, string> = {
  bailleur: "Propriétaire Bailleur",
  gestionnaire: "Gestionnaire",
  agence: "Agence",
  locataire: "Locataire",
  admin: "Administrateur",
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
      const savedPlan = localStorage.getItem("lokka_dev_plan") as LokkaPlan;
      const savedRole = localStorage.getItem("lokka_dev_role");
      const savedLogo = localStorage.getItem("lokka_custom_logo");
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
        .select("full_name, email, avatar_url, role, logo_url")
        .eq("id", user.id)
        .single();

      if (data && isMounted) {
        const role = ROLE_LABELS[data.role as string] || "Propriétaire Bailleur";
        const savedPlan = (localStorage.getItem("lokka_dev_plan") as LokkaPlan) || (data.role === "agence" ? "agence" : "pro");
        const customLogo = data.logo_url || localStorage.getItem("lokka_custom_logo") || "";
        
        setProfile({
          name: data.full_name || "Alexandre K.",
          email: data.email || user.email || "",
          avatar: data.avatar_url || "",
          customLogo,
          role,
          plan: savedPlan,
          quotaBiens: PLAN_QUOTAS[savedPlan] || { current: 4, max: 10 },
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
