"use client";

import { useState } from "react";
import Header from "@/components/dashboard/Header";
import {
  PlusIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  DocumentCheckIcon,
} from "@heroicons/react/24/outline";

const tenantsMock = [
  {
    id: "1",
    name: "Koudjo Dossou",
    email: "koudjo.dossou@gmail.com",
    phone: "+229 97 45 12 89",
    property: "Villa 4P — Fidjrossè Plage",
    rent: "350 000 FCFA",
    entryDate: "15 Jan 2024",
    status: "À jour",
    avatar: "https://i.pravatar.cc/40?img=12",
  },
  {
    id: "2",
    name: "Bérénice Agossou",
    email: "berenice.agossou@yahoo.fr",
    phone: "+229 95 23 88 01",
    property: "Studio Meublé — Haie Vive",
    rent: "120 000 FCFA",
    entryDate: "01 Mar 2024",
    status: "À jour",
    avatar: "https://i.pravatar.cc/40?img=68",
  },
  {
    id: "3",
    name: "Rachidi Saka",
    email: "rachidi.saka@gmail.com",
    phone: "+229 96 14 77 30",
    property: "Appartement F3 — Arconville",
    rent: "180 000 FCFA",
    entryDate: "01 Sep 2023",
    status: "Retard 5j",
    avatar: "https://i.pravatar.cc/40?img=47",
  },
  {
    id: "4",
    name: "Estelle Houndété",
    email: "estelle.houndete@outlook.com",
    phone: "+229 90 66 33 22",
    property: "Duplex Standing — Cadjehoun",
    rent: "450 000 FCFA",
    entryDate: "10 Oct 2022",
    status: "À jour",
    avatar: "https://i.pravatar.cc/40?img=33",
  },
];

export default function TenantsPage() {
  const [search, setSearch] = useState("");

  const filteredTenants = tenantsMock.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.property.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Header
        breadcrumbs={["Tableau de bord", "Locataires"]}
        title="Gestion des Locataires"
        subtitle="Historique des locataires, contrats d'occupation et statut des quittances."
      />

      {/* Filter & Action bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "var(--color-surface-secondary)",
            border: "1px solid var(--color-border-primary)",
            borderRadius: 6,
            padding: "6px 12px",
            width: 320,
          }}
        >
          <MagnifyingGlassIcon style={{ width: 16, height: 16, color: "var(--color-text-tertiary)" }} />
          <input
            type="text"
            placeholder="Rechercher par nom ou appartement..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              border: "none",
              outline: "none",
              fontSize: 13,
              color: "var(--color-text-primary)",
              background: "transparent",
              width: "100%",
            }}
          />
        </div>

        <button className="btn-primary" style={{ padding: "8px 18px", fontSize: 13, gap: 6 }}>
          <PlusIcon style={{ width: 16, height: 16 }} /> Nouveau locataire
        </button>
      </div>

      {/* Table */}
      <div
        style={{
          background: "var(--color-surface-secondary)",
          border: "1px solid var(--color-border-primary)",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "var(--color-surface-tertiary)", borderBottom: "1px solid var(--color-border-primary)" }}>
              <th style={{ padding: "12px 24px", fontSize: 12, fontWeight: 600, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Locataire</th>
              <th style={{ padding: "12px 24px", fontSize: 12, fontWeight: 600, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Bien sous bail</th>
              <th style={{ padding: "12px 24px", fontSize: 12, fontWeight: 600, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Loyer mensuel</th>
              <th style={{ padding: "12px 24px", fontSize: 12, fontWeight: 600, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Date d&apos;entrée</th>
              <th style={{ padding: "12px 24px", fontSize: 12, fontWeight: 600, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Statut bail</th>
              <th style={{ padding: "12px 24px", fontSize: 12, fontWeight: 600, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTenants.map((t, i) => (
              <tr key={t.id} style={{ borderBottom: i < filteredTenants.length - 1 ? "1px solid var(--color-border-secondary)" : "none" }}>
                <td style={{ padding: "16px 24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <img src={t.avatar} alt="" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)" }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>{t.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "16px 24px", fontSize: 13, color: "var(--color-text-secondary)" }}>
                  {t.property}
                </td>
                <td style={{ padding: "16px 24px", fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)" }}>
                  {t.rent}
                </td>
                <td style={{ padding: "16px 24px", fontSize: 13, color: "var(--color-text-tertiary)" }}>
                  {t.entryDate}
                </td>
                <td style={{ padding: "16px 24px" }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      padding: "3px 10px",
                      borderRadius: 100,
                      background: t.status === "À jour" ? "var(--color-accent-light)" : "rgba(201, 42, 42, 0.1)",
                      color: t.status === "À jour" ? "var(--color-accent)" : "var(--color-negative)",
                    }}
                  >
                    ● {t.status}
                  </span>
                </td>
                <td style={{ padding: "16px 24px", textAlign: "right" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
                    <button className="btn-secondary" style={{ padding: "4px 10px", fontSize: 12 }}>
                      Quittance PDF
                    </button>
                    <button style={{ background: "none", border: "none", color: "var(--color-text-tertiary)", cursor: "pointer", padding: 4 }}>
                      <EllipsisVerticalIcon style={{ width: 18, height: 18 }} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
