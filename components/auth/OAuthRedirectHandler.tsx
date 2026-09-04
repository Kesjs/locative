"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

/**
 * Handles edge-case OAuth returns where tokens or codes land on client-side routes
 * (e.g., implicit hash fragments #access_token=... or unprocessed callback params).
 */
export default function OAuthRedirectHandler() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash;
    const search = window.location.search;

    // 1. Si un code OAuth est resté dans l'URL côté client sans passer par /auth/callback
    if (search.includes("code=") && !window.location.pathname.startsWith("/auth/callback")) {
      const params = new URLSearchParams(search);
      const code = params.get("code");
      if (code) {
        const next = params.get("next") || "/dashboard";
        window.location.href = `/auth/callback?code=${encodeURIComponent(code)}&next=${encodeURIComponent(next)}`;
        return;
      }
    }

    // 2. Si un fragment de hash (#access_token=...) est présent (flux implicite Supabase)
    if (hash && (hash.includes("access_token=") || hash.includes("type=recovery"))) {
      if (!isSupabaseConfigured()) return;
      const supabase = createClient();

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
          try {
            const { data: profile } = await supabase
              .from("profiles")
              .select("role, onboarding_completed")
              .eq("id", session.user.id)
              .maybeSingle();

            if (!profile || !profile.onboarding_completed) {
              router.replace("/onboarding");
            } else if (profile.role === "tenant") {
              router.replace("/locataire");
            } else if (profile.role === "super_admin") {
              router.replace("/admin");
            } else {
              router.replace("/dashboard");
            }
          } catch {
            router.replace("/dashboard");
          }
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [router]);

  return null;
}
