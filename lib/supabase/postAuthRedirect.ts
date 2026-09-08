import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { clearLocalAccountCache } from "@/lib/clearLocalCache";

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

  // Nouvelle session confirmée : on purge le cache local laissé par un
  // éventuel compte précédent utilisé sur cet appareil, pour ne jamais
  // mélanger ses données avec celles du compte qui vient de se connecter.
  clearLocalAccountCache();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, onboarding_completed")
    .eq("id", user.id)
    .single();

  if (profile?.onboarding_completed) {
    if (profile.role === "tenant") return "/locataire";
    if (profile.role === "super_admin") return "/admin";
    return "/dashboard";
  }

  const email = fallbackEmail || user.email || "";
  return `/onboarding?email=${encodeURIComponent(email)}`;
}
