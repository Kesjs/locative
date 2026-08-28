import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

/**
 * Après vérification du code OTP (que l'utilisateur soit parti de /auth/login
 * ou /auth/register — les deux créent un compte de la même façon), on décide
 * où l'envoyer en se basant sur son vrai état d'onboarding, pas sur la page
 * de départ.
 */
export async function getPostAuthRedirect(fallbackEmail?: string): Promise<string> {
  if (!isSupabaseConfigured()) return "/dashboard";

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return "/dashboard";

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", user.id)
    .single();

  if (profile?.onboarding_completed) {
    return "/dashboard";
  }

  const email = fallbackEmail || user.email || "";
  return `/onboarding?email=${encodeURIComponent(email)}`;
}
