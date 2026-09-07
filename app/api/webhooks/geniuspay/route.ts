import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyGeniusPaySignature } from "@/lib/geniuspay";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-geniuspay-signature") || "";

    if (!verifyGeniusPaySignature(rawBody, signature)) {
      return NextResponse.json({ error: "Signature invalide." }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const { transaction_id, status } = payload;

    if (status === "success" || status === "completed" || status === "PAID") {
      const adminClient = createAdminClient();
      if (adminClient) {
        await adminClient
          .from("loyers_transactions")
          .update({
            statut: "payé",
            date_reglement: new Date().toISOString(),
          })
          .eq("reference_paiement", transaction_id);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Genius Pay webhook error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
