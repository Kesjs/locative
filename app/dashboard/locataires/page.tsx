"use client";

import React, { useMemo, useState } from "react";
import { UsersIcon, PlusIcon, MagnifyingGlassIcon, EnvelopeIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Building2 } from "lucide-react";
import { DataTable } from "@/components/dashboard/shared/DataTable";
import { EmptyState } from "@/components/dashboard/shared/EmptyState";
import { useLeases, statutPaiement, joursAvantEcheanceBail, type LeaseWithDetails } from "@/lib/hooks/useLocataires";
import { useUserProfile } from "@/hooks/useUserProfile";
import { usePatrimoineFilter, useActiveGroupBienIds } from "@/lib/patrimoineFilterContext";
import { AddLocataireModal } from "./_components/AddLocataireModal";
import { LocatairesKpis } from "./_components/LocatairesKpis";
import { LocataireDetailDrawer } from "./_components/LocataireDetailDrawer";
import TenantInvitationModal from "@/components/dashboard/TenantInvitationModal";

export default function LocatairesPage() {
  const userProfile = useUserProfile();
  const isAgency = userProfile.role === "Agence" || userProfile.plan === "agence";
  const { data: leases = [], isLoading } = useLeases();
  const { activeGroup, setActiveGroup } = usePatrimoineFilter();
  const activeGroupBienIds = useActiveGroupBienIds();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLease, setSelectedLease] = useState<LeaseWithDetails | null>(null);
  const [invitingLease, setInvitingLease] = useState<LeaseWithDetails | null>(null);
  const [search, setSearch] = useState("");

  const leasesResidence = useMemo(() => {
    if (!activeGroupBienIds) return leases;
    return leases.filter((l) => activeGroupBienIds.includes(l.bien_id));
  }, [leases, activeGroupBienIds]);

  const filteredLeases = useMemo(() => {
    const actives = leasesResidence.filter((l) => l.is_active);
    if (!search.trim()) return actives;
    const q = search.trim().toLowerCase();
    return actives.filter(
      (l) =>
        l.tenant.full_name.toLowerCase().includes(q) ||
        l.tenant.phone_number.includes(q) ||
        l.bien?.nom?.toLowerCase().includes(q)
    );
  }, [leasesResidence, search]);

  const handleOpenInvitation = (l: LeaseWithDetails, e: React.MouseEvent) => {
    e.stopPropagation();
    setInvitingLease(l);
  };

  const columns = [
    {
      key: "tenant",
      header: "Locataire",
      renderCell: (l: LeaseWithDetails) => (
        <div>
          <p className="font-bold text-card-foreground flex items-center gap-1.5">
            {l.tenant.full_name}
            {(!l.tenant.phone_number || !l.tenant.id_card_number) && (
              <span
                title="Profil incomplet"
                className="text-[9.5px] font-bold text-amber-700 bg-amber-500/10 border border-amber-500/25 px-1.5 py-0.5 rounded"
              >
                Incomplet
              </span>
            )}
          </p>
          <p className="text-[11.5px] text-muted-foreground">{l.tenant.phone_number || "Téléphone non renseigné"}</p>
        </div>
      ),
    },
    { key: "bien", header: "Logement", renderCell: (l: LeaseWithDetails) => l.bien?.nom || "—" },
    { key: "rent", header: "Loyer", renderCell: (l: LeaseWithDetails) => `${l.rent_amount.toLocaleString("fr-FR")} FCFA` },
    {
      key: "echeance",
      header: "Fin de bail",
      renderCell: (l: LeaseWithDetails) => {
        const j = joursAvantEcheanceBail(l.end_date);
        if (!l.end_date) return <span className="text-muted-foreground">Indéterminée</span>;
        return (
          <span className={j !== null && j <= 60 && j >= 0 ? "text-warning font-semibold" : "text-card-foreground"}>
            {new Date(l.end_date).toLocaleDateString("fr-FR")}
          </span>
        );
      },
    },
    {
      key: "statut",
      header: "Statut",
      renderCell: (l: LeaseWithDetails) => {
        const s = statutPaiement(l.balance_due || 0);
        return (
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase border ${
              s === "a_jour"
                ? "bg-success/10 text-success border-success/20"
                : "bg-destructive/10 text-destructive border-destructive/20"
            }`}
          >
            {s === "retard" ? `Retard · ${(l.balance_due || 0).toLocaleString("fr-FR")} FCFA` : "À jour"}
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      renderCell: (l: LeaseWithDetails) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => handleOpenInvitation(l, e)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary/10 hover:bg-primary/20 text-primary font-bold text-[11.5px] transition cursor-pointer"
            title="Envoyer l'accès portail locataire par email ou WhatsApp"
          >
            <EnvelopeIcon className="w-3.5 h-3.5" />
            <span>Accès Portail</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedLease(l)}
            className="text-muted-foreground hover:text-foreground font-semibold text-[12px] underline px-1 cursor-pointer"
          >
            Fiche
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-extrabold text-foreground">Locataires &amp; Baux</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            Gestion des contrats Loi 2022-30, cautions sécurisées (max 3 mois) et invitations portail locataire.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-[13px] font-bold hover:bg-primary/90 transition shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <PlusIcon className="w-4 h-4" /> Nouveau bail
        </button>
      </div>

      {isLoading ? (
        <div className="animate-pulse h-64 bg-card border border-border rounded-xl" />
      ) : leases.length === 0 ? (
        <EmptyState
          icon={UsersIcon}
          title="Aucun locataire"
          description="Ajoutez votre premier locataire pour commencer à suivre les baux et loyers."
          actionLabel="Ajouter un locataire"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <>
          {activeGroup && (
            <div className="flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl border border-[var(--primary)]/25 bg-[var(--primary-subtle)] text-[12.5px] font-semibold text-[var(--primary)]">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />
                Filtré sur le groupe « {activeGroup} »
              </span>
              <button
                type="button"
                onClick={() => setActiveGroup(null)}
                className="flex items-center gap-1 text-[11.5px] font-bold px-2 py-1 rounded-lg hover:bg-white/60 cursor-pointer"
              >
                <XMarkIcon className="w-3.5 h-3.5" />
                Retirer le filtre
              </button>
            </div>
          )}

          <LocatairesKpis leases={leasesResidence} />

          <div className="relative max-w-md">
            <MagnifyingGlassIcon className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un locataire, un téléphone, un logement..."
              className="w-full pl-9 pr-3 py-2.5 border border-border rounded-lg text-[13px] bg-card text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          {filteredLeases.length === 0 ? (
            <div className="text-center py-12 text-[13px] text-muted-foreground border border-dashed border-border rounded-xl">
              Aucun locataire ne correspond à cette recherche.
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl shadow-xs overflow-hidden">
              <DataTable data={filteredLeases} columns={columns} keyExtractor={(l) => l.id} />
            </div>
          )}
        </>
      )}

      <AddLocataireModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      <LocataireDetailDrawer lease={selectedLease} onClose={() => setSelectedLease(null)} />

      {invitingLease && (
        <TenantInvitationModal
          isOpen={Boolean(invitingLease)}
          onClose={() => setInvitingLease(null)}
          tenantData={{
            tenantName: invitingLease.tenant.full_name,
            tenantEmail: invitingLease.tenant.email || undefined,
            tenantPhone: invitingLease.tenant.phone_number,
            ownerName: userProfile.name || "Bailleur",
            agencyName: isAgency ? (userProfile.name || "Cabinet de Gestion Immobilière") : undefined,
            isAgency,
            propertyTitle: invitingLease.bien?.nom || "Logement Lokka",
            propertyAddress: invitingLease.bien?.adresse || "Cotonou, Bénin",
            rentAmount: invitingLease.rent_amount,
            depositMonths: invitingLease.deposit_months || 3,
          }}
        />
      )}
    </div>
  );
}
