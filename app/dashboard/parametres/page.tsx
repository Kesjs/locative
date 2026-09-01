"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { useUserProfile } from "@/hooks/useUserProfile";
import {
  UserCircleIcon,
  CreditCardIcon,
  BellAlertIcon,
  BuildingLibraryIcon,
  SparklesIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";

type Tab = "profil" | "encaissement" | "notifications" | "fiscalite" | "abonnement";

export default function ParametresPage() {
  const { role, customLogo, updateCustomLogo } = useUserProfile();
  const [activeTab, setActiveTab] = useState<Tab>("profil");
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [profile, setProfile] = useState({
    fullName: "Alexandre Koudjo",
    email: "alexandre.k@lokka.bj",
    phone: "+229 97 00 11 22",
    city: "Cotonou",
    address: "Fidjrossè Calvaire",
    roleType: "Bailleur Résident",
    ifuNumber: "3201948572910",
  });

  const [paymentSettings, setPaymentSettings] = useState({
    mtnMomo: "+229 97 00 11 22",
    moovMoney: "+229 95 11 22 33",
    bankName: "BOA Bénin (Bank of Africa)",
    iban: "BJ061 01001 001234567890 45",
    preferredChannel: "mtn_momo",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    whatsappRentReminder: true,
    whatsappTicketAlert: true,
    emailReceiptNotification: true,
    autoQuittanceGeneration: true,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Paramètres enregistrés avec succès !");
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-5xl pb-16">
      {/* Header */}
      <div>
        <h1 className="text-[20px] font-extrabold text-foreground">Paramètres du Compte &amp; Configuration</h1>
        <p className="text-[13px] text-muted-foreground mt-0.5">
          Gérez votre profil, vos canaux d&apos;encaissement Mobile Money, vos alertes WhatsApp et votre abonnement.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-1 border-b border-border overflow-x-auto pb-px">
        {[
          { id: "profil", label: "Profil & Identité", icon: UserCircleIcon },
          { id: "encaissement", label: "Encaissement MoMo & Banques", icon: CreditCardIcon },
          { id: "notifications", label: "Alertes WhatsApp & Email", icon: BellAlertIcon },
          { id: "fiscalite", label: "Fiscalité TFU & IFU", icon: BuildingLibraryIcon },
          { id: "abonnement", label: "Abonnement & Quotas", icon: SparklesIcon },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as Tab)}
              className={`flex items-center gap-2 px-4 py-3 text-[13px] font-bold border-b-2 transition whitespace-nowrap cursor-pointer ${
                isActive
                  ? "text-primary border-primary bg-card"
                  : "text-muted-foreground border-transparent hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* ========================================================================= */}
        {/* TAB 1: PROFIL & LOGO                                                      */}
        {/* ========================================================================= */}
        {activeTab === "profil" && (
          <div className="bg-card border border-border rounded-xl p-6 shadow-xs space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-white border border-border flex items-center justify-center overflow-hidden shadow-xs shrink-0">
                  <img
                    src={customLogo || "/logo.png"}
                    alt="Logo"
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <div>
                  <h2 className="text-[16px] font-bold text-card-foreground">{profile.fullName}</h2>
                  <p className="text-[12px] text-muted-foreground">Profil vérifié · République du Bénin 🇧🇯</p>
                </div>
              </div>

              {/* Logo customizer button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const sampleLogo = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&q=80";
                    updateCustomLogo(sampleLogo);
                    toast.success("Logo personnalisé appliqué à la Sidebar !");
                  }}
                  className="px-3.5 py-2 bg-muted hover:bg-muted/80 text-foreground border border-border rounded-lg text-[12px] font-bold transition cursor-pointer"
                >
                  Tester un Logo SCI
                </button>
                {customLogo && (
                  <button
                    type="button"
                    onClick={() => {
                      updateCustomLogo("");
                      toast.info("Logo Lokka réinitialisé par défaut");
                    }}
                    className="px-3 py-2 text-muted-foreground hover:text-destructive text-[12px] font-semibold transition cursor-pointer"
                  >
                    Réinitialiser
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 p-4 bg-muted/30 border border-border rounded-xl space-y-2">
                <span className="text-[12.5px] font-bold text-foreground block">
                  🎨 Logo Personnalisé du Dashboard (Sidebar &amp; Quittances)
                </span>
                <p className="text-[11.5px] text-muted-foreground">
                  Personnalisez votre espace en affichant le logo de votre Résidence, SCI ou Agence dans la barre latérale.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="url"
                    value={customLogo || ""}
                    onChange={(e) => updateCustomLogo(e.target.value)}
                    placeholder="URL de votre image logo (ex: https://.../mon-logo.png)"
                    className="flex-1 px-3.5 py-2 bg-background border border-border rounded-lg text-[12.5px] font-mono text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-muted-foreground uppercase mb-1.5">
                  Nom complet
                </label>
                <input
                  type="text"
                  required
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-[13px] text-foreground outline-none focus:border-primary transition"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-muted-foreground uppercase mb-1.5">
                  Adresse Email
                </label>
                <input
                  type="email"
                  required
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-[13px] text-foreground outline-none focus:border-primary transition"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-muted-foreground uppercase mb-1.5">
                  Numéro de téléphone principal (+229)
                </label>
                <input
                  type="text"
                  required
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-[13px] text-foreground outline-none focus:border-primary transition"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-muted-foreground uppercase mb-1.5">
                  Ville de résidence
                </label>
                <select
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-[13px] text-foreground outline-none focus:border-primary transition"
                >
                  <option value="Cotonou">Cotonou</option>
                  <option value="Abomey-Calavi">Abomey-Calavi</option>
                  <option value="Porto-Novo">Porto-Novo</option>
                  <option value="Parakou">Parakou</option>
                  <option value="Ouidah">Ouidah</option>
                  <option value="Diaspora (France / International)">Diaspora (France / International)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ENCAISSEMENT MOBILE MONEY & BANQUES                                */}
        {/* ========================================================================= */}
        {activeTab === "encaissement" && (
          <div className="bg-card border border-border rounded-xl p-6 shadow-xs space-y-6 animate-in fade-in duration-150">
            <div className="space-y-1 border-b border-border pb-4">
              <h2 className="text-[16px] font-bold text-card-foreground">Coordonnées de Réception des Loyers</h2>
              <p className="text-[13px] text-muted-foreground">
                Configurez vos comptes de paiement pour que vos locataires puissent régler directement leurs loyers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* MTN MoMo */}
              <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-amber-700 dark:text-amber-400">
                    🟡 MTN Mobile Money Bénin
                  </span>
                  <span className="text-[10px] font-bold uppercase bg-amber-500/15 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded">
                    Recommandé
                  </span>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">
                    Numéro Marchand / Réception
                  </label>
                  <input
                    type="text"
                    value={paymentSettings.mtnMomo}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, mtnMomo: e.target.value })}
                    className="w-full px-3.5 py-2 bg-background border border-border rounded-lg text-[13px] font-mono text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Moov Money */}
              <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-blue-700 dark:text-blue-400">
                    🔵 Moov Money Bénin
                  </span>
                  <span className="text-[10px] font-bold uppercase bg-blue-500/15 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded">
                    Actif
                  </span>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">
                    Numéro Marchand / Réception
                  </label>
                  <input
                    type="text"
                    value={paymentSettings.moovMoney}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, moovMoney: e.target.value })}
                    className="w-full px-3.5 py-2 bg-background border border-border rounded-lg text-[13px] font-mono text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Virement Bancaire */}
              <div className="sm:col-span-2 p-4 bg-muted/40 border border-border rounded-xl space-y-3">
                <span className="text-[13px] font-bold text-card-foreground">
                  🏦 Compte Bancaire Local (Virement BOA, Ecobank, UBA)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">
                      Banque
                    </label>
                    <input
                      type="text"
                      value={paymentSettings.bankName}
                      onChange={(e) => setPaymentSettings({ ...paymentSettings, bankName: e.target.value })}
                      className="w-full px-3.5 py-2 bg-background border border-border rounded-lg text-[13px] text-foreground outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">
                      RIB / IBAN
                    </label>
                    <input
                      type="text"
                      value={paymentSettings.iban}
                      onChange={(e) => setPaymentSettings({ ...paymentSettings, iban: e.target.value })}
                      className="w-full px-3.5 py-2 bg-background border border-border rounded-lg text-[13px] font-mono text-foreground outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: NOTIFICATIONS & WHATSAPP                                           */}
        {/* ========================================================================= */}
        {activeTab === "notifications" && (
          <div className="bg-card border border-border rounded-xl p-6 shadow-xs space-y-6 animate-in fade-in duration-150">
            <div className="space-y-1 border-b border-border pb-4">
              <h2 className="text-[16px] font-bold text-card-foreground">Automatisations &amp; Alertes</h2>
              <p className="text-[13px] text-muted-foreground">
                Gagnez du temps en automatisant les rappels d&apos;échéances et l&apos;émission des quittances.
              </p>
            </div>

            <div className="space-y-4">
              <label className="flex items-start gap-3 p-4 bg-muted/30 border border-border rounded-xl cursor-pointer hover:bg-muted/50 transition">
                <input
                  type="checkbox"
                  checked={notificationSettings.whatsappRentReminder}
                  onChange={(e) =>
                    setNotificationSettings({ ...notificationSettings, whatsappRentReminder: e.target.checked })
                  }
                  className="mt-1 w-4 h-4 rounded text-primary border-border focus:ring-primary"
                />
                <div>
                  <span className="text-[13.5px] font-bold text-card-foreground block">
                    Rappels d&apos;échéances WhatsApp automatiques
                  </span>
                  <span className="text-[12px] text-muted-foreground">
                    Envoyer une relance courtoise au locataire 3 jours avant le 5 du mois et le jour de l&apos;échéance.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 bg-muted/30 border border-border rounded-xl cursor-pointer hover:bg-muted/50 transition">
                <input
                  type="checkbox"
                  checked={notificationSettings.autoQuittanceGeneration}
                  onChange={(e) =>
                    setNotificationSettings({ ...notificationSettings, autoQuittanceGeneration: e.target.checked })
                  }
                  className="mt-1 w-4 h-4 rounded text-primary border-border focus:ring-primary"
                />
                <div>
                  <span className="text-[13.5px] font-bold text-card-foreground block">
                    Génération instantanée de la Quittance PDF certifiée
                  </span>
                  <span className="text-[12px] text-muted-foreground">
                    Créer automatiquement la quittance officielle avec QR Code dès validation du paiement.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 bg-muted/30 border border-border rounded-xl cursor-pointer hover:bg-muted/50 transition">
                <input
                  type="checkbox"
                  checked={notificationSettings.whatsappTicketAlert}
                  onChange={(e) =>
                    setNotificationSettings({ ...notificationSettings, whatsappTicketAlert: e.target.checked })
                  }
                  className="mt-1 w-4 h-4 rounded text-primary border-border focus:ring-primary"
                />
                <div>
                  <span className="text-[13.5px] font-bold text-card-foreground block">
                    Alertes de pannes &amp; maintenance sur WhatsApp
                  </span>
                  <span className="text-[12px] text-muted-foreground">
                    Recevoir une notification dès qu&apos;un locataire signale une panne depuis son portail web.
                  </span>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: FISCALITÉ TFU & DGI                                                */}
        {/* ========================================================================= */}
        {activeTab === "fiscalite" && (
          <div className="bg-card border border-border rounded-xl p-6 shadow-xs space-y-6 animate-in fade-in duration-150">
            <div className="space-y-1 border-b border-border pb-4">
              <h2 className="text-[16px] font-bold text-card-foreground">Fiscalité Foncière Béninoise (TFU)</h2>
              <p className="text-[13px] text-muted-foreground">
                Informations pour votre déclaration de Taxe Foncière Unique auprès de la Direction Générale des Impôts.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-bold text-muted-foreground uppercase mb-1.5">
                  Numéro IFU (Identifiant Fiscal Unique)
                </label>
                <input
                  type="text"
                  value={profile.ifuNumber}
                  onChange={(e) => setProfile({ ...profile, ifuNumber: e.target.value })}
                  placeholder="ex: 3201948572910"
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-[13px] font-mono text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 text-[12px] font-bold text-emerald-700 dark:text-emerald-400">
                  <ShieldCheckIcon className="w-4 h-4" />
                  Conformité Loi n° 2022-30
                </div>
                <p className="text-[12px] text-muted-foreground leading-relaxed">
                  Lokka calcule automatiquement vos rentes locatives imposables et vos déductions de charges d&apos;entretien pour simplifier votre bilan annuel DGI Bénin.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: ABONNEMENT & QUOTAS                                                */}
        {/* ========================================================================= */}
        {activeTab === "abonnement" && (
          <div className="bg-card border border-border rounded-xl p-6 shadow-xs space-y-6 animate-in fade-in duration-150">
            <div className="space-y-1 border-b border-border pb-4">
              <h2 className="text-[16px] font-bold text-card-foreground">Plan &amp; Abonnement Lokka</h2>
              <p className="text-[13px] text-muted-foreground">
                Gérez votre formule, votre capacité de logements et vos options.
              </p>
            </div>

            <div className="p-5 bg-muted/40 border border-border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[16px] font-extrabold text-card-foreground">
                    {role === "Agence" ? "Plan Agence & SCI" : "Plan Pro Bailleur"}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-primary/10 text-primary border border-primary/20">
                    Actif
                  </span>
                </div>
                <p className="text-[13px] text-muted-foreground mt-1">
                  {role === "Agence" ? "35 000 FCFA / mois · Mandats illimités" : "15 000 FCFA / mois · Jusqu'à 10 logements"}
                </p>
                <div className="mt-3 flex items-center gap-2 text-[12px] text-muted-foreground">
                  <div className="w-40 bg-muted h-2 rounded-full overflow-hidden border border-border">
                    <div className="bg-primary h-full w-[40%]" />
                  </div>
                  <span className="font-semibold text-foreground">4 / 10 biens gérés</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toast.info("Facturation gérée via MTN MoMo / Carte bancaire.")}
                className="px-4 py-2.5 bg-primary text-primary-foreground font-bold text-[13px] rounded-lg hover:bg-primary/90 transition shadow-xs self-start md:self-auto cursor-pointer"
              >
                Gérer mon abonnement
              </button>
            </div>
          </div>
        )}

        {/* Submit Actions Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-[13px] font-bold rounded-lg transition shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
        </div>
      </form>
    </div>
  );
}
