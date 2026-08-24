"use client";

import Header from "@/components/dashboard/Header";
import { ArrowDownTrayIcon, CalculatorIcon } from "@heroicons/react/24/outline";

export default function AccountingPage() {
  return (
    <div>
      <Header
        breadcrumbs={["Tableau de bord", "Comptabilité"]}
        title="Comptabilité & Fiscalité Foncière"
        subtitle="Bilan annuel des revenus locatifs, charges d'entretien, commissions de gestion et estimation de la Taxe Foncière Unique (TFU Bénin)."
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        <div style={{ background: "var(--color-surface-secondary)", border: "1px solid var(--color-border-primary)", borderRadius: 8, padding: 20 }}>
          <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", fontWeight: 500, marginBottom: 6 }}>Revenus bruts perçus (YTD)</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "var(--color-text-primary)" }}>58 200 000 FCFA</div>
        </div>

        <div style={{ background: "var(--color-surface-secondary)", border: "1px solid var(--color-border-primary)", borderRadius: 8, padding: 20 }}>
          <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", fontWeight: 500, marginBottom: 6 }}>Charges & Réparations</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "var(--color-text-primary)" }}>6 250 000 FCFA</div>
        </div>

        <div style={{ background: "var(--color-surface-secondary)", border: "1px solid var(--color-border-primary)", borderRadius: 8, padding: 20 }}>
          <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", fontWeight: 500, marginBottom: 6 }}>Revenu net foncier estimé</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "var(--color-accent)" }}>51 950 000 FCFA</div>
        </div>
      </div>

      <div style={{ background: "var(--color-surface-secondary)", border: "1px solid var(--color-border-primary)", borderRadius: 8, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--color-text-primary)" }}>Synthèse Comptable & Déclaration TFU 2026</h3>
          <button className="btn-primary" style={{ padding: "6px 14px", fontSize: 13, gap: 6 }}>
            <ArrowDownTrayIcon style={{ width: 14, height: 14 }} /> Exporter le bilan annuel (PDF)
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { label: "Loyers bruts encaissés (Total annuel)", val: "58 200 000 FCFA" },
            { label: "Dépenses d'entretien, plomberie et réfection", val: "3 450 000 FCFA" },
            { label: "Charges de gardiennage et entretien parties communes", val: "2 800 000 FCFA" },
            { label: "Commissions de gestion d'agence (Plafonné à 10% — Loi 2022-30)", val: "5 820 000 FCFA" },
            { label: "Taxe Foncière Unique estimée (TFU Bénin)", val: "2 910 000 FCFA" },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 16px",
                borderRadius: 6,
                background: "var(--color-surface-tertiary)",
                fontSize: 14,
              }}
            >
              <span style={{ fontWeight: 500, color: "var(--color-text-primary)" }}>{item.label}</span>
              <span style={{ fontWeight: 700, color: "var(--color-text-primary)" }}>{item.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
