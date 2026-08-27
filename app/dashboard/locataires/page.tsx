"use client";

import { useState, useEffect } from "react";
import Header from "@/components/dashboard/Header";
import TenantInvitationModal from "@/components/dashboard/TenantInvitationModal";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  PlusIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MagnifyingGlassIcon,
  DocumentCheckIcon,
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  XMarkIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

const defaultTenants = [
  {
    id: "1",
    name: "Koudjo Dossou",
    email: "koudjo.dossou@gmail.com",
    phone: "+229 97 45 12 89",
    property: "Villa 4P — Fidjrossè Plage",
    propertyAddress: "Fidjrossè Calvaire, Cotonou",
    rent: "350 000 FCFA",
    rentNumber: 350000,
    depositMonths: 3,
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
    propertyAddress: "Haie Vive Cocotiers, Cotonou",
    rent: "120 000 FCFA",
    rentNumber: 120000,
    depositMonths: 3,
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
    propertyAddress: "Arconville, Calavi",
    rent: "180 000 FCFA",
    rentNumber: 180000,
    depositMonths: 2,
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
    propertyAddress: "Cadjehoun, Cotonou",
    rent: "450 000 FCFA",
    rentNumber: 450000,
    depositMonths: 3,
    entryDate: "10 Oct 2022",
    status: "À jour",
    avatar: "https://i.pravatar.cc/40?img=33",
  },
];

export default function TenantsPage() {
  const [tenants, setTenants] = useState(defaultTenants);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [invitationTenant, setInvitationTenant] = useState<any>(null);
  const [ownerName, setOwnerName] = useState("Bailleur Lokka");

  // Form State for new tenant
  const [newTenant, setNewTenant] = useState({
    name: "",
    email: "",
    phone: "97 11 22 33",
    property: "Villa Fidjrossè Plage",
    propertyAddress: "Fidjrossè Calvaire, Cotonou",
    rent: "250000",
    depositMonths: 3,
  });

  useEffect(() => {
    // 1. Check local onboarding data
    try {
      const savedOnboarding = localStorage.getItem("lokka_onboarding_data");
      if (savedOnboarding) {
        const ob = JSON.parse(savedOnboarding);
        if (ob.userName) setOwnerName(ob.userName);
        if (ob.tenant?.name && ob.property?.title) {
          const onboardedTenant = {
            id: "onboarded-1",
            name: ob.tenant.name,
            email: "locataire@gmail.com",
            phone: ob.tenant.phone || "+229 97 11 22 33",
            property: ob.property.title,
            propertyAddress: ob.property.address || `${ob.city || "Cotonou"}`,
            rent: `${Number(ob.property.rent).toLocaleString("fr-FR")} FCFA`,
            rentNumber: Number(ob.property.rent),
            depositMonths: Number(ob.tenant.depositMonths || 3),
            entryDate: "Aujourd'hui",
            status: "À jour",
            avatar: "https://i.pravatar.cc/40?img=12",
          };
          setTenants([onboardedTenant, ...defaultTenants]);
        }
      }
    } catch (_) {}

    // 2. Fetch real Supabase data if configured
    const loadSupabaseTenants = async () => {
      if (!isSupabaseConfigured()) return;
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", user.id)
            .single();
          if (profile?.full_name) setOwnerName(profile.full_name);

          const { data: dbTenants } = await supabase
            .from("tenants")
            .select("*, leases(*, properties(*))")
            .eq("owner_id", user.id);

          if (dbTenants && dbTenants.length > 0) {
            const mapped = dbTenants.map((t: any) => {
              const lease = t.leases?.[0];
              const prop = lease?.properties;
              return {
                id: t.id,
                name: t.full_name,
                email: t.email || "—",
                phone: t.phone_number || t.whatsapp_number,
                property: prop?.title || "Logement sous bail",
                propertyAddress: prop?.address || "Cotonou",
                rent: `${Number(lease?.rent_amount_fcfa || 250000).toLocaleString("fr-FR")} FCFA`,
                rentNumber: Number(lease?.rent_amount_fcfa || 250000),
                depositMonths: Number(lease?.deposit_months || 3),
                entryDate: lease?.start_date || "Récent",
                status: "À jour",
                avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(t.full_name)}`,
              };
            });
            setTenants(mapped);
          }
        }
      } catch (err) {
        console.warn("Supabase fetch tenants notice:", err);
      }
    };

    loadSupabaseTenants();
  }, []);

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      id: String(Date.now()),
      name: newTenant.name || "Nouveau Locataire",
      email: newTenant.email || "contact@locataire.bj",
      phone: `+229 ${newTenant.phone}`,
      property: newTenant.property,
      propertyAddress: newTenant.propertyAddress,
      rent: `${Number(newTenant.rent).toLocaleString("fr-FR")} FCFA`,
      rentNumber: Number(newTenant.rent),
      depositMonths: Number(newTenant.depositMonths),
      entryDate: "Aujourd'hui",
      status: "À jour",
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(newTenant.name)}`,
    };

    setTenants([created, ...tenants]);
    setShowAddModal(false);

    // Prompt immediate invitation modal
    setInvitationTenant({
      tenantName: created.name,
      tenantEmail: created.email,
      tenantPhone: created.phone,
      ownerName,
      propertyTitle: created.property,
      propertyAddress: created.propertyAddress,
      rentAmount: created.rentNumber,
      depositMonths: created.depositMonths,
    });

    // Sync to Supabase in background if logged in
    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("tenants").insert([
            {
              owner_id: user.id,
              full_name: created.name,
              email: created.email,
              phone_number: created.phone,
              whatsapp_number: created.phone,
            },
          ]);
        }
      }
    } catch (_) {}
  };

  const handleOpenInviteModal = (t: any) => {
    setInvitationTenant({
      tenantName: t.name,
      tenantEmail: t.email !== "—" ? t.email : "",
      tenantPhone: t.phone,
      ownerName,
      propertyTitle: t.property,
      propertyAddress: t.propertyAddress || "Cotonou, Bénin",
      rentAmount: t.rentNumber || 250000,
      depositMonths: t.depositMonths || 3,
    });
  };

  const filteredTenants = tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.property.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto pb-10">
      <Header
        title="Locataires & Baux"
        subtitle="Gestion des locataires, contrats et conformité Loi n° 2022-30."
      />

      {/* Filter & Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-white border border-[#E8E5E0] rounded-[8px] px-3 py-2 w-full sm:w-80 shadow-2xs">
          <MagnifyingGlassIcon className="w-4 h-4 text-[#9C9A95]" />
          <input
            type="text"
            placeholder="Rechercher par nom, email ou bien..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-[13px] text-[#1C1C1C] w-full"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-[#1C1C1C] hover:bg-[#333333] text-white text-[12px] font-semibold rounded-[8px] transition shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Ajouter un locataire</span>
        </button>
      </div>

      {/* Table of Tenants */}
      <div className="bg-white border border-[#E8E5E0] rounded-[10px] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E8E5E0] bg-[#FAF9F6] text-[11px] font-bold text-[#64635F] uppercase tracking-wider">
                <th className="py-3.5 px-5">Locataire</th>
                <th className="py-3.5 px-5">Logement Occupé</th>
                <th className="py-3.5 px-5">Loyer Mensuel</th>
                <th className="py-3.5 px-5">Caution Légale</th>
                <th className="py-3.5 px-5">Statut</th>
                <th className="py-3.5 px-5 text-right">Actions &amp; Accès</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E5E0] text-[13px]">
              {filteredTenants.map((t) => (
                <tr key={t.id} className="hover:bg-[#FAF9F6] transition">
                  {/* Name & Avatar */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-9 h-9 rounded-full object-cover border border-[#E8E5E0]"
                      />
                      <div>
                        <div className="font-bold text-[#1C1C1C]">{t.name}</div>
                        <div className="text-[11px] text-[#64635F] flex items-center gap-2">
                          <span>{t.phone}</span>
                          {t.email && t.email !== "—" && (
                            <>
                              <span>•</span>
                              <span>{t.email}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Property */}
                  <td className="py-4 px-5 text-[#1C1C1C] font-medium">
                    {t.property}
                  </td>

                  {/* Rent */}
                  <td className="py-4 px-5 font-bold text-[#1C1C1C]">
                    {t.rent}
                  </td>

                  {/* Deposit */}
                  <td className="py-4 px-5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1C1C1C] bg-[#F3F2EE] border border-[#E8E5E0] px-2 py-0.5 rounded">
                      <ShieldCheckIcon className="h-3.5 w-3.5 text-[#1C1C1C]" />
                      <span>{t.depositMonths} mois (Loi 2022-30)</span>
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-5">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                        t.status === "À jour"
                          ? "bg-[#F3F2EE] text-[#1C1C1C] border-[#E8E5E0]"
                          : "bg-[#FFE3E3] text-[#C92A2A] border-[#FFC9C9]"
                      }`}
                    >
                      ● {t.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-5 text-right">
                    <button
                      type="button"
                      onClick={() => handleOpenInviteModal(t)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1C1C1C] hover:bg-[#333333] text-white text-[11px] font-bold rounded-[4px] transition shadow-2xs cursor-pointer"
                    >
                      <PaperAirplaneIcon className="h-3 w-3" />
                      <span>Envoyer Accès</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL : AJOUTER UN NOUVEAU LOCATAIRE                                      */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8E5E0] rounded-[12px] max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E5E0] mb-4">
              <h3 className="text-[16px] font-bold text-[#1C1C1C]">
                Nouveau Locataire &amp; Bail
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#9C9A95] hover:text-[#1C1C1C] cursor-pointer"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTenant} className="space-y-3.5">
              <div>
                <label className="block text-[12px] font-semibold text-[#1C1C1C] mb-1">
                  Nom et prénom du locataire
                </label>
                <input
                  type="text"
                  required
                  value={newTenant.name}
                  onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
                  placeholder="Ex: Koudjo Dossou"
                  className="w-full px-3 py-2 bg-white border border-[#E8E5E0] rounded-[6px] text-[13px] text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#1C1C1C] mb-1">
                  Email du locataire (pour envoi des quittances PDF)
                </label>
                <input
                  type="email"
                  value={newTenant.email}
                  onChange={(e) => setNewTenant({ ...newTenant, email: e.target.value })}
                  placeholder="Ex: locataire@gmail.com"
                  className="w-full px-3 py-2 bg-white border border-[#E8E5E0] rounded-[6px] text-[13px] text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#1C1C1C] mb-1">
                  Numéro WhatsApp (+229)
                </label>
                <div className="relative flex">
                  <span className="inline-flex items-center px-3 rounded-l-[6px] border border-r-0 border-[#E8E5E0] bg-[#FAF9F6] text-[12px] font-bold text-[#1C1C1C]">
                    +229
                  </span>
                  <input
                    type="tel"
                    required
                    value={newTenant.phone}
                    onChange={(e) => setNewTenant({ ...newTenant, phone: e.target.value })}
                    className="w-full pl-3 pr-3 py-2 bg-white border border-[#E8E5E0] rounded-r-[6px] text-[13px] text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                    placeholder="97 11 22 33"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#1C1C1C] mb-1">
                  Logement assigné
                </label>
                <input
                  type="text"
                  required
                  value={newTenant.property}
                  onChange={(e) => setNewTenant({ ...newTenant, property: e.target.value })}
                  placeholder="Ex: Villa Fidjrossè Plage"
                  className="w-full px-3 py-2 bg-white border border-[#E8E5E0] rounded-[6px] text-[13px] text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
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
                    value={newTenant.rent}
                    onChange={(e) => setNewTenant({ ...newTenant, rent: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#E8E5E0] rounded-[6px] text-[13px] font-bold text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#1C1C1C] mb-1">
                    Caution (Loi 2022-30)
                  </label>
                  <select
                    value={newTenant.depositMonths}
                    onChange={(e) => setNewTenant({ ...newTenant, depositMonths: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-[#E8E5E0] rounded-[6px] text-[12px] text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                  >
                    <option value={1}>1 mois de caution</option>
                    <option value={2}>2 mois de caution</option>
                    <option value={3}>3 mois max (Loi 2022-30)</option>
                  </select>
                </div>
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
                  Créer &amp; Inviter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL D'INVITATION LOCATAIRE (EMAIL RESEND & WHATSAPP)                     */}
      {/* ========================================================================= */}
      {invitationTenant && (
        <TenantInvitationModal
          isOpen={Boolean(invitationTenant)}
          onClose={() => setInvitationTenant(null)}
          tenantData={invitationTenant}
        />
      )}
    </div>
  );
}
