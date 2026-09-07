import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

/**
 * Convertit une data URL base64 (issue de FileReader) en Blob exploitable
 * pour un upload Supabase Storage.
 */
function dataUrlToBlob(dataUrl: string): { blob: Blob; ext: string } {
  const [header, base64] = dataUrl.split(",");
  const mimeMatch = header.match(/data:(.*);base64/);
  const mime = mimeMatch?.[1] || "image/png";
  const ext = mime.split("/")[1]?.split("+")[0] || "png";

  const byteString = atob(base64);
  const bytes = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    bytes[i] = byteString.charCodeAt(i);
  }

  return { blob: new Blob([bytes], { type: mime }), ext };
}

/**
 * Prend le logo saisi dans l'onboarding (data URL base64, URL externe déjà
 * hébergée, ou preset) et retourne une URL exploitable stockée dans
 * profiles.logo_url :
 * - si c'est déjà une URL (http/https), on la garde telle quelle
 * - si c'est une data URL base64, on l'upload sur le bucket "org-logos"
 *   et on retourne l'URL publique (évite d'alourdir la table profiles
 *   et les requêtes de mise à jour du profil)
 */
export async function resolveOrgLogoUrl(
  logoValue: string,
  userId: string
): Promise<string> {
  if (!logoValue) return "";

  // URL déjà hébergée (preset ou saisie manuelle) : rien à faire
  if (!logoValue.startsWith("data:")) {
    return logoValue;
  }

  if (!isSupabaseConfigured()) {
    return logoValue;
  }

  try {
    const supabase = createClient();
    const { blob, ext } = dataUrlToBlob(logoValue);
    const path = `${userId}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("org-logos")
      .upload(path, blob, { contentType: blob.type, upsert: true });

    if (uploadError) {
      console.warn("Upload logo échoué, conservation du base64 en repli:", uploadError.message);
      return logoValue;
    }

    const { data } = supabase.storage.from("org-logos").getPublicUrl(path);
    return data.publicUrl;
  } catch (err) {
    console.warn("Erreur upload logo, conservation du base64 en repli:", err);
    return logoValue;
  }
}
