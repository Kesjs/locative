import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

/**
 * Upload une capture d'écran / photo de preuve de paiement (ticket MoMo,
 * reçu espèces, etc.) sur le bucket "payment-proofs" et retourne l'URL
 * publique à stocker dans loyers_transactions.preuve_url.
 *
 * Suit le même principe que resolveOrgLogoUrl (lib/upload-org-logo.ts) :
 * échec d'upload = repli silencieux (on ne bloque jamais l'enregistrement
 * du paiement à cause d'un souci d'upload de justificatif).
 */
export async function uploadPaymentProof(file: File, userId: string): Promise<string> {
  if (!file) return "";

  if (!isSupabaseConfigured()) {
    return "";
  }

  try {
    const supabase = createClient();
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${userId}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("payment-proofs")
      .upload(path, file, { contentType: file.type || "image/jpeg", upsert: true });

    if (uploadError) {
      console.warn("Upload preuve de paiement échoué, paiement enregistré sans justificatif:", uploadError.message);
      return "";
    }

    const { data } = supabase.storage.from("payment-proofs").getPublicUrl(path);
    return data.publicUrl;
  } catch (err) {
    console.warn("Erreur upload preuve de paiement:", err);
    return "";
  }
}
