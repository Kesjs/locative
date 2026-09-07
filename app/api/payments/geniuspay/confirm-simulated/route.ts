import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const { transactionId } = await req.json();

    const adminClient = createAdminClient();
    if (adminClient) {
      if (transactionId) {
        await adminClient
          .from("loyers_transactions")
          .update({
            statut: "payé",
            date_reglement: new Date().toISOString(),
          })
          .eq("reference_paiement", transactionId);
      } else {
        const { data: lastTx } = await adminClient
          .from("loyers_transactions")
          .select("id")
          .eq("statut", "en_attente")
          .order("id", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (lastTx) {
          await adminClient
            .from("loyers_transactions")
            .update({
              statut: "payé",
              date_reglement: new Date().toISOString(),
            })
            .eq("id", lastTx.id);
        }
      }
    }

    return NextResponse.json({ success: true, status: "payé" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
