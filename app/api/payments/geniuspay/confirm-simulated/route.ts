import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const { transactionId } = await req.json();
    if (!transactionId) {
      return NextResponse.json({ error: "transactionId requis." }, { status: 400 });
    }

    const adminClient = createAdminClient();
    if (adminClient) {
      await adminClient
        .from("loyers_transactions")
        .update({
          statut: "paye",
          date_reglement: new Date().toISOString().split("T")[0],
        })
        .eq("reference_transaction", transactionId);
    }

    return NextResponse.json({ success: true, status: "paye" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
