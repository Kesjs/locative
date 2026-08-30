import { toast } from "sonner";

/**
 * Gestion centralisée des erreurs Supabase / réseau.
 * Objectif : un seul endroit qui décide (a) quel message afficher à
 * l'utilisateur, (b) ce qu'on logue en console pour le debug.
 *
 * Utilisation :
 *   try { ... } catch (err) { handleError(err, "Impossible de charger vos locataires"); }
 */

type SupabaseLikeError = {
  message?: string;
  code?: string;
  status?: number;
};

// Messages Supabase connus -> message FR compréhensible
const KNOWN_MESSAGES: Record<string, string> = {
  "Invalid login credentials": "Identifiants invalides. Vérifiez votre email.",
  "Email not confirmed": "Adresse email non confirmée.",
  "User already registered": "Un compte existe déjà avec cet email.",
  "Token has expired or is invalid": "Le code a expiré. Demandez-en un nouveau.",
  "For security purposes, you can only request this after":
    "Merci de patienter avant de redemander un code.",
};

function isOffline() {
  return typeof navigator !== "undefined" && navigator.onLine === false;
}

/**
 * Transforme une erreur brute (Supabase, fetch, JS générique) en message FR.
 * N'affiche rien — utile quand on a besoin du texte seul (ex: banniere inline).
 */
export function getErrorMessage(err: unknown, fallback: string): string {
  if (isOffline()) {
    return "Pas de connexion internet. Vérifiez votre réseau et réessayez.";
  }

  if (!err) return fallback;

  const e = err as SupabaseLikeError;

  // Config Supabase manquante : message déjà clair, on le laisse passer tel quel
  if (typeof e?.message === "string" && e.message.includes("Configuration Supabase manquante")) {
    return e.message;
  }

  if (typeof e?.message === "string") {
    for (const key of Object.keys(KNOWN_MESSAGES)) {
      if (e.message.includes(key)) return KNOWN_MESSAGES[key];
    }
  }

  // Erreurs réseau fetch classiques
  if (typeof e?.message === "string" && /fetch|network|Failed to fetch/i.test(e.message)) {
    return "Problème de connexion au serveur. Réessayez dans un instant.";
  }

  return fallback;
}

/**
 * Log + toast en un appel. À utiliser dans tous les catch() de l'app
 * à la place de console.warn/console.error silencieux.
 */
export function handleError(err: unknown, fallback: string, context?: string) {
  const message = getErrorMessage(err, fallback);
  console.error(context ? `[${context}]` : "[error]", err);
  toast.error(message);
  return message;
}

/**
 * Variante discrète : logue seulement, pas de toast.
 */
export function logError(err: unknown, context?: string) {
  console.error(context ? `[${context}]` : "[error]", err);
}
