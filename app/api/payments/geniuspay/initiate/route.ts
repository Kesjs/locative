import { NextResponse } from "next/server";
import { initiateGeniusPayPayment } from "@/lib/geniuspay";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      amount,
      customerPhone,
      customerName,
      customerEmail,
      leaseId,
      bienId,
      period,
      operator = "mtn",
      description,
    } = body;

    if (!amount || !customerPhone) {
      return NextResponse.json(
        { error: "Montant et numéro de téléphone obligatoires." },
        { status: 400 }
      );
    }

    const session = await initiateGeniusPayPayment({
      amount: Number(amount),
      description: description || `Règlement Loyer - ${period || "Échéance courante"}`,
      customer: {
        name: customerName || "Locataire Lokka",
        phone: customerPhone,
        email: customerEmail,
      },
      metadata: {
        lease_id: leaseId,
        bien_id: bienId,
        period: period || new Date().toISOString().slice(0, 7),
        operator,
      },
    });

    // Enregistrement en base de données Supabase dans loyers_transactions
    try {
      const adminClient = createAdminClient();
      if (adminClient) {
        await adminClient.from("loyers_transactions").insert({
          lease_id: leaseId || null,
          montant: Number(amount),
          date_reglement: new Date().toISOString().split("T")[0],
          periode: period || new Date().toISOString().slice(0, 7),
          methode_paiement: `Genius Pay (${operator.toUpperCase()})`,
          statut: "en_attente",
          reference_transaction: session.transactionId,
        });
      }
    } catch (dbErr) {
      console.warn("Notice insertion loyers_transactions:", dbErr);
    }

    return NextResponse.json(session);
  } catch (err: any) {
    console.error("Genius Pay initiate error:", err);
    return NextResponse.json(
      { error: err?.message || "Erreur lors de l'initialisation Genius Pay." },
      { status: 500 }
    );
  }
}
