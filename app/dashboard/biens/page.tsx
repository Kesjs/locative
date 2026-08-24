"use client";

import { useState } from "react";
import Header from "@/components/dashboard/Header";
import {
  PlusIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  UserIcon,
  CurrencyEuroIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";

const propertiesMock = [
  {
    id: "1",
    name: "Villa Fidjrossè Plage",
    type: "Villa 4 Pièces",
    address: "Fidjrossè Calvaire, Cotonou",
    surface: "180 m²",
    rent: "350 000 FCFA",
    charges: "25 000 FCFA",
    status: "Occupé",
    tenant: "Koudjo Dossou",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: "2",
    name: "Studio Moderne Haie Vive",
    type: "Studio Meublé",
    address: "Haie Vive Cocotiers, Cotonou",
    surface: "35 m²",
    rent: "120 000 FCFA",
    charges: "15 000 FCFA",
    status: "Occupé",
    tenant: "Bérénice Agossou",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: "3",
    name: "Appartement Standing Arconville",
    type: "Appartement F3",
    address: "Arconville, Abomey-Calavi",
    surface: "95 m²",
    rent: "180 000 FCFA",
    charges: "10 000 FCFA",
    status: "Occupé",
    tenant: "Rachidi Saka",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: "4",
    name: "Boutique Commerciale Ganhi",
    type: "Local Commercial",
    address: "Avenue Clozel, Ganhi, Cotonou",
    surface: "50 m²",
    rent: "250 000 FCFA",
    charges: "0 FCFA",
    status: "Vacant",
    tenant: "—",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&auto=format&fit=crop&q=60",
  },
];

export default function PropertiesPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredProperties = propertiesMock.filter((p) => {
    if (filter === "occupied" && p.status !== "Occupé") return false;
    if (filter === "vacant" && p.status !== "Vacant") return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.address.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <Header
        breadcrumbs={["Tableau de bord", "Mes Biens"]}
        title="Gestion des Biens"
        subtitle="Gérez l'ensemble de votre parc immobilier, loyers et états d'occupation."
      />

      {/* Filter & Action bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Search Input */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "var(--color-surface-secondary)",
              border: "1px solid var(--color-border-primary)",
              borderRadius: 6,
              padding: "6px 12px",
              width: 280,
            }}
          >
            <MagnifyingGlassIcon style={{ width: 16, height: 16, color: "var(--color-text-tertiary)" }} />
            <input
              type="text"
              placeholder="Rechercher un bien ou adresse..."
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

          {/* Status Tabs */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: "var(--color-surface-secondary)",
              border: "1px solid var(--color-border-primary)",
              borderRadius: 6,
              padding: 4,
            }}
          >
            {[
              { id: "all", label: "Tous (4)" },
              { id: "occupied", label: "Occupés (3)" },
              { id: "vacant", label: "Vacants (1)" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                style={{
                  fontSize: 13,
                  fontWeight: filter === tab.id ? 600 : 500,
                  color: filter === tab.id ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                  background: filter === tab.id ? "var(--color-surface-tertiary)" : "transparent",
                  border: filter === tab.id ? "1px solid var(--color-border-primary)" : "none",
                  borderRadius: 4,
                  padding: "4px 12px",
                  cursor: "pointer",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <button className="btn-primary" style={{ padding: "8px 18px", fontSize: 13, gap: 6 }}>
          <PlusIcon style={{ width: 16, height: 16 }} /> Nouveau bien
        </button>
      </div>

      {/* Grid of properties */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
        }}
      >
        {filteredProperties.map((prop) => (
          <div
            key={prop.id}
            style={{
              background: "var(--color-surface-secondary)",
              border: "1px solid var(--color-border-primary)",
              borderRadius: 8,
              overflow: "hidden",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
          >
            {/* Image banner */}
            <div style={{ position: "relative", height: 160, width: "100%", background: "#e5e5e5" }}>
              <img src={prop.image} alt={prop.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <span
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "3px 10px",
                  borderRadius: 100,
                  background: prop.status === "Occupé" ? "var(--color-accent-light)" : "rgba(230, 119, 0, 0.15)",
                  color: prop.status === "Occupé" ? "var(--color-accent)" : "var(--color-warning)",
                  backdropFilter: "blur(4px)",
                }}
              >
                ● {prop.status}
              </span>
            </div>

            {/* Content */}
            <div style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--color-text-primary)" }}>
                  {prop.name}
                </h3>
                <span style={{ fontSize: 12, color: "var(--color-text-tertiary)", fontWeight: 500 }}>
                  {prop.surface}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 16 }}>
                <MapPinIcon style={{ width: 14, height: 14, color: "var(--color-text-tertiary)" }} />
                <span style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{prop.address}</span>
              </div>

              <div
                style={{
                  borderTop: "1px solid var(--color-border-primary)",
                  paddingTop: 14,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", textTransform: "uppercase", fontWeight: 500 }}>Loyer mensuel</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "var(--color-text-primary)" }}>{prop.rent} <span style={{ fontSize: 12, fontWeight: 400, color: "var(--color-text-tertiary)" }}>+ {prop.charges}</span></div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", textTransform: "uppercase", fontWeight: 500 }}>Locataire</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)" }}>{prop.tenant}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
