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
  GlobeAltIcon,
  XMarkIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

const initialProperties = [
  {
    id: "1",
    name: "Villa Fidjrossè Plage",
    type: "Villa 4 Pièces",
    address: "Fidjrossè Calvaire, Cotonou",
    surface: "180 m²",
    rent: "350 000 FCFA",
    rentNumber: 350000,
    charges: "25 000 FCFA",
    status: "Occupé",
    isPublished: true,
    sbeeType: "Compteur personnel à carte",
    waterType: "Forage avec surpresseur",
    generator: true,
    ac: true,
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
    rentNumber: 120000,
    charges: "15 000 FCFA",
    status: "Occupé",
    isPublished: true,
    sbeeType: "Compteur personnel à carte",
    waterType: "Compteur SONEB",
    generator: true,
    ac: true,
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
    rentNumber: 180000,
    charges: "10 000 FCFA",
    status: "Occupé",
    isPublished: false,
    sbeeType: "Décompteur SBEE",
    waterType: "Forage",
    generator: false,
    ac: true,
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
    rentNumber: 250000,
    charges: "0 FCFA",
    status: "Vacant",
    isPublished: true,
    sbeeType: "Compteur SBEE à carte",
    waterType: "SONEB",
    generator: false,
    ac: false,
    tenant: "—",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&auto=format&fit=crop&q=60",
  },
];

export default function PropertiesPage() {
  const [properties, setProperties] = useState(initialProperties);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [previewProp, setPreviewProp] = useState<any>(null);

  // Form State for new property
  const [newProp, setNewProp] = useState({
    name: "",
    type: "Appartement F3",
    address: "",
    city: "Cotonou",
    rent: "200000",
    charges: "15000",
    surface: "85 m²",
    sbeeType: "Compteur SBEE à carte personnel",
    waterType: "SONEB individuel",
    generator: true,
    ac: true,
    depositMonths: 3,
    isPublished: true,
    visitFee: 3000,
  });

  const handleCreateProperty = (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      id: String(Date.now()),
      name: newProp.name || "Nouveau Logement Standing",
      type: newProp.type,
      address: `${newProp.address}, ${newProp.city}`,
      surface: newProp.surface,
      rent: `${Number(newProp.rent).toLocaleString("fr-FR")} FCFA`,
      rentNumber: Number(newProp.rent),
      charges: `${Number(newProp.charges).toLocaleString("fr-FR")} FCFA`,
      status: "Vacant",
      isPublished: newProp.isPublished,
      sbeeType: newProp.sbeeType,
      waterType: newProp.waterType,
      generator: newProp.generator,
      ac: newProp.ac,
      tenant: "—",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&auto=format&fit=crop&q=60",
    };

    setProperties([created, ...properties]);
    setShowAddModal(false);
  };

  const filteredProperties = properties.filter((p) => {
    if (filter === "occupied" && p.status !== "Occupé") return false;
    if (filter === "vacant" && p.status !== "Vacant") return false;
    if (filter === "published" && !p.isPublished) return false;
    if (
      search &&
      !p.name.toLowerCase().includes(search.toLowerCase()) &&
      !p.address.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto pb-10">
      <Header
        title="Mes Biens & Vitrine"
        subtitle="Gérez votre parc immobilier, l'état d'occupation et la publication sur votre site vitrine public."
      />

      {/* Filter & Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="flex items-center gap-2 bg-white border border-[#E8E5E0] rounded-[8px] px-3 py-2 w-72 shadow-2xs">
            <MagnifyingGlassIcon className="w-4 h-4 text-[#9C9A95]" />
            <input
              type="text"
              placeholder="Rechercher par nom ou quartier..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-[13px] text-[#1C1C1C] w-full"
            />
          </div>

          {/* Status Tabs */}
          <div className="inline-flex bg-[#F0EFEA] border border-[#E8E5E0] rounded-[8px] p-1 gap-1">
            {[
              { id: "all", label: `Tous (${properties.length})` },
              { id: "occupied", label: "Occupés" },
              { id: "vacant", label: "Vacants" },
              { id: "published", label: "En vitrine 🌐" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1 text-[12px] font-semibold rounded-[6px] transition cursor-pointer ${filter === tab.id
                    ? "bg-white text-[#1C1C1C] shadow-xs"
                    : "text-[#64635F] hover:text-[#1C1C1C]"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-hover)] text-[var(--text-inverse)] text-[12px] font-semibold rounded-[var(--radius-md)] transition shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Nouveau bien</span>
        </button>
      </div>

      {/* Grid of properties */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((prop) => (
          <div
            key={prop.id}
            className="bg-white border border-[#E8E5E0] rounded-[10px] overflow-hidden shadow-xs hover:border-[#1C1C1C] transition-all flex flex-col justify-between"
          >
            {/* Top image with badges */}
            <div className="relative h-44 w-full bg-[#FAF9F6]">
              <img
                src={prop.image}
                alt={prop.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 flex gap-1.5">
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${prop.status === "Occupé"
                      ? "bg-[#E6F5EF] text-[var(--text-primary)] border border-[var(--border-strong)]"
                      : "bg-[#FFF3D6] text-[#D97706] border border-[#D97706]/20"
                    }`}
                >
                  ● {prop.status}
                </span>

                {prop.isPublished && (
                  <span className="bg-[var(--color-brand-primary)] text-[var(--text-inverse)] text-[11px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                    <GlobeAltIcon className="w-3 h-3 text-[var(--text-inverse)]" />
                    <span>En Vitrine</span>
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setPreviewProp(prop)}
                className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs hover:bg-white text-[#1C1C1C] text-[11px] font-bold px-2.5 py-1 rounded shadow-xs inline-flex items-center gap-1 cursor-pointer"
              >
                <EyeIcon className="w-3.5 h-3.5" />
                <span>Aperçu Vitrine</span>
              </button>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-[16px] font-bold text-[#1C1C1C]">
                    {prop.name}
                  </h3>
                  <span className="text-[12px] font-semibold text-[#9C9A95]">
                    {prop.surface}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[12px] text-[#64635F]">
                  <MapPinIcon className="w-3.5 h-3.5 text-[#9C9A95] shrink-0" />
                  <span className="truncate">{prop.address}</span>
                </div>

                {/* Spécificités Bénin */}
                <div className="flex flex-wrap gap-1.5 mt-3 text-[11px] font-medium text-[var(--text-secondary)]">
                  <span className="bg-[var(--bg-canvas)] border border-[var(--border-default)] px-2 py-0.5 rounded-[var(--radius-sm)]">
                    ⚡ {prop.sbeeType}
                  </span>
                  <span className="bg-[var(--bg-canvas)] border border-[var(--border-default)] px-2 py-0.5 rounded-[var(--radius-sm)]">
                    💧 {prop.waterType}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[var(--text-muted)] uppercase font-bold block">
                    Loyer Mensuel
                  </span>
                  <span className="text-[15px] font-extrabold text-[var(--text-primary)]">
                    {prop.rent}{" "}
                    <span className="text-[11px] font-normal text-[var(--text-secondary)]">
                      + {prop.charges}
                    </span>
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-[var(--text-muted)] uppercase font-bold block">
                    Locataire
                  </span>
                  <span className="text-[12px] font-semibold text-[var(--text-primary)]">
                    {prop.tenant}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* MODAL : NOUVEAU BIEN IMMOBILIER COMPLET                                    */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#E8E5E0] rounded-[12px] max-w-xl w-full p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E5E0] mb-4">
              <h3 className="text-[17px] font-bold text-[#1C1C1C]">
                Ajouter un nouveau bien immobilier
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#9C9A95] hover:text-[#1C1C1C] cursor-pointer"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProperty} className="space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#1C1C1C] mb-1">
                  Nom ou désignation du bien
                </label>
                <input
                  type="text"
                  required
                  value={newProp.name}
                  onChange={(e) => setNewProp({ ...newProp, name: e.target.value })}
                  placeholder="Ex: Villa Fidjrossè Calvaire ou Studio Haie Vive"
                  className="w-full px-3.5 py-2 bg-white border border-[#E8E5E0] rounded-[6px] text-[13px] text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-[#1C1C1C] mb-1">
                    Typologie
                  </label>
                  <select
                    value={newProp.type}
                    onChange={(e) => setNewProp({ ...newProp, type: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#E8E5E0] rounded-[6px] text-[13px] text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                  >
                    <option value="Chambre / Studio">Chambre / Studio</option>
                    <option value="Appartement F2/F3">Appartement F2/F3</option>
                    <option value="Villa / Maison">Villa / Maison</option>
                    <option value="Local Commercial">Boutique / Local Commercial</option>
                    <option value="Immeuble">Immeuble entier</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#1C1C1C] mb-1">
                    Ville principale
                  </label>
                  <select
                    value={newProp.city}
                    onChange={(e) => setNewProp({ ...newProp, city: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#E8E5E0] rounded-[6px] text-[13px] text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                  >
                    <option value="Cotonou">Cotonou</option>
                    <option value="Calavi">Abomey-Calavi</option>
                    <option value="Porto-Novo">Porto-Novo</option>
                    <option value="Parakou">Parakou</option>
                    <option value="Ouidah">Ouidah</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#1C1C1C] mb-1">
                  Adresse &amp; Quartier / Repère
                </label>
                <input
                  type="text"
                  required
                  value={newProp.address}
                  onChange={(e) => setNewProp({ ...newProp, address: e.target.value })}
                  placeholder="Ex: Lot 450 Fidjrossè Calvaire"
                  className="w-full px-3.5 py-2 bg-white border border-[#E8E5E0] rounded-[6px] text-[13px] text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-[#1C1C1C] mb-1">
                    Loyer Mensuel (FCFA)
                  </label>
                  <input
                    type="number"
                    required
                    value={newProp.rent}
                    onChange={(e) => setNewProp({ ...newProp, rent: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-[#E8E5E0] rounded-[6px] text-[14px] font-bold text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#1C1C1C] mb-1">
                    Charges (FCFA)
                  </label>
                  <input
                    type="number"
                    value={newProp.charges}
                    onChange={(e) => setNewProp({ ...newProp, charges: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-[#E8E5E0] rounded-[6px] text-[13px] text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                  />
                </div>
              </div>

              {/* Spécificités Bénin */}
              <div className="p-3 bg-[#FAF9F6] border border-[#E8E5E0] rounded-[8px] space-y-3">
                <span className="text-[11px] font-bold uppercase text-[#1C1C1C] block">
                  Commodités &amp; Compteurs Bénin
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-[#64635F] mb-1">
                      Électricité SBEE
                    </label>
                    <select
                      value={newProp.sbeeType}
                      onChange={(e) => setNewProp({ ...newProp, sbeeType: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#E8E5E0] rounded-[4px] text-[12px]"
                    >
                      <option value="Compteur SBEE à carte personnel">Compteur à carte personnel</option>
                      <option value="Décompteur SBEE">Décompteur</option>
                      <option value="Compteur conventionnel">Compteur conventionnel</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#64635F] mb-1">
                      Alimentation en Eau
                    </label>
                    <select
                      value={newProp.waterType}
                      onChange={(e) => setNewProp({ ...newProp, waterType: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#E8E5E0] rounded-[4px] text-[12px]"
                    >
                      <option value="SONEB individuel">SONEB individuel</option>
                      <option value="Forage avec surpresseur">Forage avec surpresseur</option>
                      <option value="Forage partagé">Forage partagé</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Publication Vitrine Switch */}
              <div className="p-3 bg-[#E6F5EF] border border-[#1C1C1C]/30 rounded-[8px] flex items-center justify-between">
                <div>
                  <div className="text-[12px] font-bold text-[#1C1C1C]">
                    Publier sur mon Site Vitrine Public
                  </div>
                  <div className="text-[11px] text-[#64635F]">
                    Accessible immédiatement pour les visites et réservations.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={newProp.isPublished}
                  onChange={(e) => setNewProp({ ...newProp, isPublished: e.target.checked })}
                  className="h-4 w-4 rounded border-[#E8E5E0] text-[#1C1C1C] cursor-pointer"
                />
              </div>

              <div className="pt-3 border-t border-[#E8E5E0] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary py-2 px-4 text-[12px] cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-primary py-2 px-5 text-[12px] cursor-pointer"
                >
                  Enregistrer le bien
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL : APERÇU LIVE DU SITE VITRINE PUBLIC                                */}
      {/* ========================================================================= */}
      {previewProp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8E5E0] rounded-[12px] max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E5E0] mb-4">
              <div className="flex items-center gap-2">
                <GlobeAltIcon className="w-4 h-4 text-[#1C1C1C]" />
                <span className="text-[13px] font-bold text-[#1C1C1C]">
                  Aperçu Public · Fiche Vitrine
                </span>
              </div>
              <button
                onClick={() => setPreviewProp(null)}
                className="text-[#9C9A95] hover:text-[#1C1C1C] cursor-pointer"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile preview frame */}
            <div className="border border-[#E8E5E0] rounded-[8px] overflow-hidden space-y-3">
              <img
                src={previewProp.image}
                alt={previewProp.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-[16px] font-bold text-[#1C1C1C]">
                    {previewProp.name}
                  </h4>
                  <span className="text-[14px] font-extrabold text-[#1C1C1C]">
                    {previewProp.rent}
                  </span>
                </div>

                <div className="text-[12px] text-[#64635F]">
                  📍 {previewProp.address}
                </div>

                <div className="p-2.5 bg-[#FAF9F6] border border-[#E8E5E0] rounded text-[11px] space-y-1">
                  <div>⚡ Électricité : <strong>{previewProp.sbeeType}</strong></div>
                  <div>💧 Eau : <strong>{previewProp.waterType}</strong></div>
                  <div>⚖️ Caution : <strong>3 mois max (Loi 2022-30)</strong></div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => alert("Simulation de réservation de visite en ligne avec créneau.")}
                    className="py-2 bg-[#1C1C1C] text-white text-[11px] font-bold rounded cursor-pointer"
                  >
                    Réserver visite (3 000 F)
                  </button>
                  <button
                    type="button"
                    onClick={() => alert("Ouverture du contact direct WhatsApp.")}
                    className="py-2 bg-[#1C1C1C] text-white text-[11px] font-bold rounded cursor-pointer"
                  >
                    WhatsApp direct
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
