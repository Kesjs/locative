"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import {
  MegaphoneIcon,
  PlusIcon,
  ShareIcon,
  EyeIcon,
  CalendarDaysIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
  ArrowTopRightOnSquareIcon,
  PaintBrushIcon,
  BuildingOffice2Icon,
} from "@heroicons/react/24/outline";
import { KpiCard } from "@/components/dashboard/shared/KpiCard";
import { useAnnonces, useToggleAnnonceStatut, type Annonce } from "@/lib/hooks/useAnnonces";
import { AddAnnonceModal } from "./_components/AddAnnonceModal";
import { ShowcaseEmailModal } from "@/components/dashboard/ShowcaseEmailModal";
import { VitrineStudio } from "./_components/VitrineStudio";

export default function AnnoncesPage() {
  const { data: annonces = [], isLoading } = useAnnonces();
  const { mutateAsync: toggleStatut } = useToggleAnnonceStatut();

  const [activeTab, setActiveTab] = useState<"annonces" | "studio">("annonces");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedShowcase, setSelectedShowcase] = useState<any>(null);

  // Statistics
  const totalVues = annonces.reduce((acc, a) => acc + (a.vues || 0), 0);
  const totalDemandes = annonces.reduce((acc, a) => acc + (a.demandes || 0), 0);
  const annoncesActives = annonces.filter((a) => a.statut === "Active").length;

  const publicVitrineUrl = "lokka.bj/p/patrimoine-lokka";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://${publicVitrineUrl}`);
    toast.success("Lien de votre vitrine copié dans le presse-papiers !");
  };

  const handleOpenEmailModal = (annonce: Annonce) => {
    setSelectedShowcase({
      title: annonce.bien,
      address: "Cotonou, Bénin",
      type: "Appartement de standing",
      rentAmount: 350000,
      chargesAmount: 25000,
      photoUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      features: ["Climatisation", "Compteur SBEE à carte", "Forage / Surpresseur", "Gardiennage"],
      visitFee: 3000,
      showcaseSlug: "patrimoine-lokka",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-20 bg-muted/60 animate-pulse rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="h-28 bg-muted/60 animate-pulse rounded-xl" />
          <div className="h-28 bg-muted/60 animate-pulse rounded-xl" />
          <div className="h-28 bg-muted/60 animate-pulse rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-extrabold text-foreground">Annonces &amp; Vitrine Publique</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            Publiez vos logements vacants, personnalisez votre mini-site et partagez vos fiches par Email / WhatsApp.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <a
            href="/p/patrimoine-lokka"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-card hover:bg-muted border border-border rounded-lg text-[12.5px] font-bold text-foreground transition shadow-2xs"
          >
            <span>Voir mon mini-site</span>
            <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
          </a>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-[13px] font-bold hover:bg-primary/90 transition shadow-xs cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" /> Créer une annonce
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border">
        <button
          type="button"
          onClick={() => setActiveTab("annonces")}
          className={`pb-3 px-3 text-[13.5px] font-bold border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeTab === "annonces"
              ? "text-primary border-primary"
              : "text-muted-foreground border-transparent hover:text-foreground"
          }`}
        >
          <MegaphoneIcon className="w-4 h-4" />
          <span>Mes Annonces &amp; Demandes ({annonces.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("studio")}
          className={`pb-3 px-3 text-[13.5px] font-bold border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeTab === "studio"
              ? "text-primary border-primary"
              : "text-muted-foreground border-transparent hover:text-foreground"
          }`}
        >
          <PaintBrushIcon className="w-4 h-4" />
          <span>Studio &amp; Personnalisation de ma Vitrine</span>
        </button>
      </div>

      {/* TAB 1: ANNONCES & DEMANDES */}
      {activeTab === "annonces" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <KpiCard
              title="Annonces en ligne"
              value={annoncesActives}
              subtitle={`${annonces.length} annonce${annonces.length > 1 ? "s" : ""} au total`}
              icon={MegaphoneIcon}
              iconColor="blue"
            />
            <KpiCard
              title="Vues totales générées"
              value={totalVues}
              subtitle="Visiteurs uniques sur vos fiches"
              icon={EyeIcon}
              iconColor="emerald"
            />
            <KpiCard
              title="Demandes de visites"
              value={totalDemandes}
              subtitle="Prospects qualifiés enregistrés"
              icon={CalendarDaysIcon}
              iconColor="amber"
            />
          </div>

          {/* Bloc Vitrine Publique */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-[14.5px] font-bold text-card-foreground">Votre Mini-Site Vitrine Public</h3>
                <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-success/10 text-success">
                  En ligne 🟢
                </span>
              </div>
              <p className="text-[12.5px] text-muted-foreground">
                Partagez ce lien unique avec vos prospects sur WhatsApp, Facebook ou par email pour recevoir des réservations de visite.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <code className="px-3.5 py-2 bg-muted border border-border rounded-lg text-[12.5px] text-foreground font-mono select-all">
                {publicVitrineUrl}
              </code>
              <button
                type="button"
                onClick={handleCopyLink}
                className="p-2 bg-card border border-border rounded-lg hover:bg-muted text-foreground transition cursor-pointer shadow-2xs"
                title="Copier le lien"
              >
                <ShareIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Liste des Annonces */}
          <div className="bg-card border border-border rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between">
              <h2 className="text-[15px] font-bold text-card-foreground">Logements en Vitrine</h2>
              <span className="text-[12px] text-muted-foreground font-medium">{annonces.length} annonce(s)</span>
            </div>

            {annonces.length === 0 ? (
              <div className="text-center py-12 px-4">
                <MegaphoneIcon className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                <h3 className="text-[14px] font-bold text-card-foreground mb-1">Aucune annonce publiée</h3>
                <p className="text-[13px] text-muted-foreground mb-4">Créez votre première annonce pour commencer à recevoir des locataires.</p>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-[13px] font-bold"
                >
                  Créer une annonce
                </button>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {annonces.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <MegaphoneIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-[14.5px] text-card-foreground">{item.bien}</h3>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              item.statut === "Active"
                                ? "bg-success/10 text-success"
                                : item.statut === "Brouillon"
                                ? "bg-warning/10 text-warning"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {item.statut}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-[12px] text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <EyeIcon className="w-3.5 h-3.5" /> {item.vues} vues
                          </span>
                          <span className="flex items-center gap-1">
                            <CalendarDaysIcon className="w-3.5 h-3.5" /> {item.demandes} demandes de visite
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => handleOpenEmailModal(item)}
                        className="px-3 py-1.5 bg-card hover:bg-muted text-card-foreground border border-border rounded-lg text-[12px] font-bold flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                      >
                        <EnvelopeIcon className="w-3.5 h-3.5 text-primary" />
                        <span>Envoyer la fiche (Email / Resend)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          toggleStatut({
                            id: item.id,
                            statut: item.statut === "Active" ? "Suspendue" : "Active",
                          })
                        }
                        className="px-3 py-1.5 text-muted-foreground hover:text-foreground text-[12px] font-semibold transition"
                      >
                        {item.statut === "Active" ? "Suspendre" : "Activer"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: STUDIO & PERSONNALISATION */}
      {activeTab === "studio" && (
        <div className="animate-in fade-in duration-150">
          <VitrineStudio />
        </div>
      )}

      {/* Modals */}
      <AddAnnonceModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      
      {selectedShowcase && (
        <ShowcaseEmailModal
          isOpen={Boolean(selectedShowcase)}
          onClose={() => setSelectedShowcase(null)}
          propertyData={selectedShowcase}
        />
      )}
    </div>
  );
}
