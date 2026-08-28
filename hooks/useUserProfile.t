"use client";

import { useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  role: string;
}

const DEFAULT_PROFILE: UserProfile = {
  name: "Utilisateur",
  email: "",
  avatar: "",
  role: "Propriétaire Bailleur",
};

const ROLE_LABELS: Record<string, string> = {
  bailleur: "Propriétaire Bailleur",
  gestionnaire: "Gestionnaire",
  agence: "Agence",
};

/**
 * Remplace l'ancienne lecture de localStorage["lokka_session"], qui n'était
 * écrite nulle part dans l'app — le header/la sidebar affichaient donc
 * toujours "Alexandre K." pour tout le monde. Ici on va chercher le vrai
 * profil connecté dans Supabase.
 */
export function useUserProfile(): UserProfile {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);

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
        .select("full_name, email, avatar_url, role")
        .eq("id", user.id)
        .single();

      if (data && isMounted) {
        setProfile({
          name: data.full_name || "Utilisateur",
          email: data.email || user.email || "",
          avatar: data.avatar_url || "",
          role: ROLE_LABELS[data.role as string] || "Propriétaire Bailleur",
        });
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return profile;
}
