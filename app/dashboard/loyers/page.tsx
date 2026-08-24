"use client";

import Header from "@/components/dashboard/Header";
import {
  CreditCardIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ClockIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

export default function RentsPage() {
  return (
    <div>
      <Header
        breadcrumbs={["Tableau de bord", "Loyers & Paiements"]}
        title="Encaissement des Loyers"
        subtitle="Suivez l'historique complet des règlements, relances automatiques et génération des quittances."
      />

      {/* Summary Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        <div style={{ background: "var(--color-surface-secondary)", border: "1px solid var(--color-border-primary)", borderRadius: 8, padding: 20 }}>
          <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", fontWeight: 500, marginBottom: 6 }}>Loyers encaissés (Mois en cours)</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "var(--color-text-primary)" }}>4 850 000 FCFA</div>
          <div style={{ fontSize: 12, color: "var(--color-accent)", fontWeight: 600, marginTop: 4 }}>96.5% du total attendu</div>
        </div>

        <div style={{ background: "var(--color-surface-secondary)", border: "1px solid var(--color-border-primary)", borderRadius: 8, padding: 20 }}>
          <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", fontWeight: 500, marginBottom: 6 }}>Règlement en retard</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "var(--color-negative)" }}>180 000 FCFA</div>
          <div style={{ fontSize: 12, color: "var(--color-negative)", fontWeight: 600, marginTop: 4 }}>1 locataire en retard (5 jours)</div>
        </div>

        <div style={{ background: "var(--color-surface-secondary)", border: "1px solid var(--color-border-primary)", borderRadius: 8, padding: 20 }}>
          <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", fontWeight: 500, marginBottom: 6 }}>Prochaine échéance</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "var(--color-text-primary)" }}>01 Oct 2026</div>
          <div style={{ fontSize: 12, color: "var(--color-text-secondary)", fontWeight: 500, marginTop: 4 }}>Rappels WhatsApp programmés (J-3)</div>
        </div>
      </div>

      {/* Rents Status Table */}
      <div style={{ background: "var(--color-surface-secondary)", border: "1px solid var(--color-border-primary)", borderRadius: 8, overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--color-border-primary)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--color-text-primary)" }}>Échéancier de Septembre 2026</h3>
          <button className="btn-secondary" style={{ padding: "6px 12px", fontSize: 13, gap: 6 }}>
            <ArrowDownTrayIcon style={{ width: 14, height: 14 }} /> Télécharger le journal
          </button>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "var(--color-surface-tertiary)", borderBottom: "1px solid var(--color-border-primary)" }}>
              <th style={{ padding: "12px 24px", fontSize: 12, fontWeight: 600, color: "var(--color-text-tertiary)", textTransform: "uppercase" }}>Locataire</th>
              <th style={{ padding: "12px 24px", fontSize: 12, fontWeight: 600, color: "var(--color-text-tertiary)", textTransform: "uppercase" }}>Bien</th>
              <th style={{ padding: "12px 24px", fontSize: 12, fontWeight: 600, color: "var(--color-text-tertiary)", textTransform: "uppercase" }}>Montant</th>
              <th style={{ padding: "12px 24px", fontSize: 12, fontWeight: 600, color: "var(--color-text-tertiary)", textTransform: "uppercase" }}>Mode de paiement</th>
              <th style={{ padding: "12px 24px", fontSize: 12, fontWeight: 600, color: "var(--color-text-tertiary)", textTransform: "uppercase" }}>Statut</th>
              <th style={{ padding: "12px 24px", fontSize: 12, fontWeight: 600, color: "var(--color-text-tertiary)", textTransform: "uppercase", textAlign: "right" }}>Quittance</th>
            </tr>
          </thead>
          <tbody>
            {[
              { tenant: "Koudjo Dossou", property: "Villa 4P — Fidjrossè Plage", amount: "350 000 FCFA", method: "MTN MoMo (Ref #84920)", status: "Payé le 02/09", type: "success" },
              { tenant: "Bérénice Agossou", property: "Studio Meublé — Haie Vive", amount: "120 000 FCFA", method: "Moov Money (Ref #10394)", status: "Payé le 01/09", type: "success" },
              { tenant: "Rachidi Saka", property: "Appartement F3 — Arconville", amount: "180 000 FCFA", method: "Espèces (Reçu en attente)", status: "Retard (+5j)", type: "danger" },
              { tenant: "Estelle Houndété", property: "Duplex Standing — Cadjehoun", amount: "450 000 FCFA", method: "MTN MoMo (Ref #99231)", status: "Payé le 01/09", type: "success" },
            ].map((row, i) => (
              <tr key={i} style={{ borderBottom: i < 3 ? "1px solid var(--color-border-secondary)" : "none" }}>
                <td style={{ padding: "14px 24px", fontWeight: 600, fontSize: 14, color: "var(--color-text-primary)" }}>{row.tenant}</td>
                <td style={{ padding: "14px 24px", fontSize: 13, color: "var(--color-text-secondary)" }}>{row.property}</td>
                <td style={{ padding: "14px 24px", fontWeight: 600, fontSize: 14, color: "var(--color-text-primary)" }}>{row.amount}</td>
                <td style={{ padding: "14px 24px", fontSize: 13, color: "var(--color-text-tertiary)" }}>{row.method}</td>
                <td style={{ padding: "14px 24px" }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      padding: "3px 10px",
                      borderRadius: 100,
                      background: row.type === "success" ? "var(--color-accent-light)" : "rgba(201, 42, 42, 0.1)",
                      color: row.type === "success" ? "var(--color-accent)" : "var(--color-negative)",
                    }}
                  >
                    {row.status}
                  </span>
                </td>
                <td style={{ padding: "14px 24px", textAlign: "right" }}>
                  <button className="btn-secondary" style={{ padding: "4px 10px", fontSize: 12 }}>
                    Télécharger PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
