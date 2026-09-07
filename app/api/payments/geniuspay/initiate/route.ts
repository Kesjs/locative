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
        let orgId = null;
        let bienNom = description || "Appartement / Lot";
        if (bienId) {
          const { data: b } = await adminClient.from("biens").select("nom, organization_id").eq("id", bienId).maybeSingle();
          orgId = b?.organization_id || null;
          if (b?.nom) bienNom = b.nom;
        }
        if (!orgId) {
          const { data: firstOrg } = await adminClient.from("organizations").select("id").limit(1).maybeSingle();
          orgId = firstOrg?.id || "b96b7906-e502-467e-86c6-127ae9873e7e";
        }

        const validMethode = operator === "moov" ? "Moov Money" : "MTN MoMo";

        await adminClient.from("loyers_transactions").insert({
          organization_id: orgId,
          bien_id: bienId || null,
          bien_nom: bienNom,
          locataire_nom: customerName || "Locataire en place",
          montant: Number(amount),
          methode: validMethode,
          statut: "en_attente",
          reference_paiement: session.transactionId,
          echeance: new Date().toISOString().split("T")[0],
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
