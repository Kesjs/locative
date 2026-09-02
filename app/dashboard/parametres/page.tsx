"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useUserProfile } from "@/hooks/useUserProfile";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  UserCircle,
  CreditCard,
  Bell,
  Building,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Smartphone,
  Landmark,
  Save,
  Loader2,
  FileText,
  BadgeCheck,
} from "lucide-react";

type Tab = "profil" | "encaissement" | "notifications" | "fiscalite" | "abonnement";

export default function ParametresPage() {
  const { role, plan, quotaBiens, customLogo, updateCustomLogo } = useUserProfile();
  const [activeTab, setActiveTab] = useState<Tab>("profil");
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "Cotonou",
    address: "",
    ifuNumber: "",
  });

  const [paymentSettings, setPaymentSettings] = useState({
    mtnMomo: "",
    moovMoney: "",
    bankName: "BOA Bénin (Bank of Africa)",
    iban: "",
    preferredChannel: "mtn_momo",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    whatsappRentReminder: true,
    whatsappTicketAlert: true,
    emailReceiptNotification: true,
    autoQuittanceGeneration: true,
  });

  // Charger les données réelles de Supabase
  useEffect(() => {
    let isMounted = true;

    async function fetchUserData() {
      if (!isSupabaseConfigured()) {
        setIsLoadingProfile(false);
        return;
      }

      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setIsLoadingProfile(false);
          return;
        }

        const { data: dbProfile, error } = await supabase
          .from("profiles")
          .select("full_name, email, phone_number, city, ifu_number, logo_url, preferred_payment_channel, payment_details")
          .eq("id", user.id)
          .single();

        if (error) {
          console.warn("Could not fetch full profile from Supabase:", error.message);
        }

        if (isMounted) {
          // Préremplissage avec les données de la base ou du stockage local
          const savedPayments = localStorage.getItem("lokka_payment_settings");
          const parsedPayments = savedPayments ? JSON.parse(savedPayments) : null;

          setProfile({
            fullName: dbProfile?.full_name || user.user_metadata?.full_name || "Propriétaire Lokka",
            email: dbProfile?.email || user.email || "",
            phone: dbProfile?.phone_number || user.user_metadata?.phone_number || "+229 ",
            city: dbProfile?.city || "Cotonou",
            address: "",
            ifuNumber: dbProfile?.ifu_number || "",
          });

          if (parsedPayments) {
            setPaymentSettings(parsedPayments);
          } else if (dbProfile?.payment_details) {
            try {
              setPaymentSettings({
                ...paymentSettings,
                ...(typeof dbProfile.payment_details === "object" ? dbProfile.payment_details : JSON.parse(dbProfile.payment_details)),
              });
            } catch {
              // ignore
            }
          }
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        if (isMounted) setIsLoadingProfile(false);
      }
    }

    fetchUserData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const updatePayload: Record<string, any> = {
            full_name: profile.fullName,
            phone_number: profile.phone,
            city: profile.city,
            updated_at: new Date().toISOString(),
          };

          if (profile.ifuNumber) {
            updatePayload.ifu_number = profile.ifuNumber;
          }

          const { error } = await supabase
            .from("profiles")
            .update(updatePayload)
            .eq("id", user.id);

          if (error) {
            console.warn("Erreur mise à jour profil:", error.message);
          }
        }
      }

      // Sauvegarde des préférences d'encaissement et de notification en local
      localStorage.setItem("lokka_payment_settings", JSON.stringify(paymentSettings));
      localStorage.setItem("lokka_notification_settings", JSON.stringify(notificationSettings));

      toast.success("Paramètres enregistrés avec succès !");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'enregistrement des paramètres.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="space-y-6 max-w-5xl pb-16">
        <div className="h-20 bg-muted/60 animate-pulse rounded-2xl" />
        <div className="h-12 bg-muted/60 animate-pulse rounded-xl" />
        <div className="h-80 bg-muted/60 animate-pulse rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl pb-16">
      {/* Header Éditorial */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-card border border-border rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Configuration Système
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">Bénin &amp; Diaspora</span>
          </div>
          <h1 className="font-serif text-2xl font-normal text-foreground">Paramètres du Compte</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            Gérez votre identité, vos comptes de réception Mobile Money, vos déclarations IFU et votre plan.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[13px] font-bold transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>

      {/* Tabs Switcher - Zéro Emoji */}
      <div className="flex items-center gap-1 border-b border-border overflow-x-auto pb-px">
        {[
          { id: "profil", label: "Profil & Identité", icon: UserCircle },
          { id: "encaissement", label: "Comptes Mobile Money & Banques", icon: CreditCard },
          { id: "notifications", label: "Alertes WhatsApp & Email", icon: Bell },
          { id: "fiscalite", label: "Fiscalité & IFU DGI", icon: Landmark },
          { id: "abonnement", label: "Abonnement & Quotas", icon: Sparkles },
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
          <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-white border border-border flex items-center justify-center overflow-hidden shadow-xs shrink-0">
                  <img
                    src={customLogo || "/logo.png"}
                    alt="Logo"
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[16px] font-bold text-card-foreground">{profile.fullName || "Utilisateur"}</h2>
                    <BadgeCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-[12px] text-muted-foreground">Profil certifié · République du Bénin</p>
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
                  className="px-3.5 py-2 bg-muted hover:bg-muted/80 text-foreground border border-border rounded-xl text-[12px] font-bold transition cursor-pointer"
                >
                  Tester un Logo SCI
                </button>
                {customLogo && (
                  <button
                    type="button"
                    onClick={() => {
                      updateCustomLogo("");
                      toast.info("Logo réinitialisé par défaut");
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
                <div className="flex items-center gap-2 text-[12.5px] font-bold text-foreground">
                  <Building className="w-4 h-4 text-emerald-600" />
                  Logo Personnalisé du Dashboard &amp; Quittances
                </div>
                <p className="text-[11.5px] text-muted-foreground">
                  Affichez le logo de votre Agence, Résidence ou SCI sur les quittances certifiées transmises aux locataires.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="url"
                    value={customLogo || ""}
                    onChange={(e) => updateCustomLogo(e.target.value)}
                    placeholder="URL de votre logo (ex: https://.../mon-logo.png)"
                    className="flex-1 px-3.5 py-2 bg-background border border-border rounded-xl text-[12.5px] font-mono text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-muted-foreground uppercase mb-1.5">
                  Nom complet / Raison Sociale
                </label>
                <input
                  type="text"
                  required
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-[13px] text-foreground outline-none focus:border-primary transition"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-muted-foreground uppercase mb-1.5">
                  Adresse Email de connexion
                </label>
                <input
                  type="email"
                  disabled
                  value={profile.email}
                  className="w-full px-3.5 py-2.5 bg-muted/60 border border-border rounded-xl text-[13px] text-muted-foreground outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-muted-foreground uppercase mb-1.5">
                  Numéro WhatsApp Principal (+229)
                </label>
                <input
                  type="text"
                  required
                  placeholder="+229 97 00 11 22"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-[13px] text-foreground outline-none focus:border-primary transition"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-muted-foreground uppercase mb-1.5">
                  Ville Principale de Gestion
                </label>
                <select
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-[13px] text-foreground outline-none focus:border-primary transition"
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
          <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-6 animate-in fade-in duration-150">
            <div className="space-y-1 border-b border-border pb-4">
              <h2 className="text-[16px] font-bold text-card-foreground">Coordonnées de Réception des Loyers</h2>
              <p className="text-[13px] text-muted-foreground">
                Ces coordonnées apparaîtront sur les avis d'échéance et rappels WhatsApp envoyés à vos locataires.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* MTN MoMo */}
              <div className="p-5 bg-amber-500/5 border border-amber-500/20 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-amber-600" />
                    <span className="text-[13px] font-bold text-amber-800 dark:text-amber-400">
                      MTN Mobile Money Bénin
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase bg-amber-500/15 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full">
                    Actif
                  </span>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">
                    Numéro Marchand / Téléphone MoMo
                  </label>
                  <input
                    type="text"
                    placeholder="+229 97 00 11 22"
                    value={paymentSettings.mtnMomo}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, mtnMomo: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-[13px] font-mono text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Moov Money */}
              <div className="p-5 bg-blue-500/5 border border-blue-500/20 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-blue-600" />
                    <span className="text-[13px] font-bold text-blue-800 dark:text-blue-400">
                      Moov Money Bénin (Flooz)
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase bg-blue-500/15 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full">
                    Actif
                  </span>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">
                    Numéro Marchand / Téléphone Flooz
                  </label>
                  <input
                    type="text"
                    placeholder="+229 95 11 22 33"
                    value={paymentSettings.moovMoney}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, moovMoney: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-[13px] font-mono text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Virement Bancaire */}
              <div className="sm:col-span-2 p-5 bg-muted/30 border border-border rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-emerald-600" />
                  <span className="text-[13px] font-bold text-card-foreground">
                    Compte Bancaire Bénin (Virement BOA, Ecobank, SGB, UBA)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">
                      Établissement Bancaire
                    </label>
                    <input
                      type="text"
                      value={paymentSettings.bankName}
                      onChange={(e) => setPaymentSettings({ ...paymentSettings, bankName: e.target.value })}
                      className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-[13px] text-foreground outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">
                      RIB / IBAN Bénin
                    </label>
                    <input
                      type="text"
                      placeholder="BJ061 01001 001234567890 45"
                      value={paymentSettings.iban}
                      onChange={(e) => setPaymentSettings({ ...paymentSettings, iban: e.target.value })}
                      className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-[13px] font-mono text-foreground outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: NOTIFICATIONS & ALERTES                                            */}
        {/* ========================================================================= */}
        {activeTab === "notifications" && (
          <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-6 animate-in fade-in duration-150">
            <div className="space-y-1 border-b border-border pb-4">
              <h2 className="text-[16px] font-bold text-card-foreground">Préférences d'Alertes et Relances Automatisées</h2>
              <p className="text-[13px] text-muted-foreground">
                Contrôlez les notifications automatiques générées par Lokka pour vous et vos locataires.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  id: "whatsappRentReminder",
                  title: "Rappels de loyer cordiaux par WhatsApp",
                  desc: "Envoi automatique d'une alerte pré-remplie au locataire à J-3 de l'échéance légale.",
                },
                {
                  id: "whatsappTicketAlert",
                  title: "Alertes immédiates en cas d'incident ou de panne",
                  desc: "Notification instantanée par SMS / WhatsApp dès qu'un locataire signale une fuite ou un problème SBEE.",
                },
                {
                  id: "autoQuittanceGeneration",
                  title: "Génération automatique des quittances certifiées Loi 2022-30",
                  desc: "Délivrance immédiate de la quittance PDF dès confirmation de l'encaissement Mobile Money.",
                },
              ].map((item) => (
                <div key={item.id} className="flex items-start justify-between p-4 bg-muted/20 border border-border rounded-xl">
                  <div>
                    <div className="text-[13px] font-bold text-card-foreground">{item.title}</div>
                    <div className="text-[12px] text-muted-foreground mt-0.5">{item.desc}</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings[item.id as keyof typeof notificationSettings]}
                    onChange={(e) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        [item.id]: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-emerald-600 rounded border-border focus:ring-emerald-500 cursor-pointer mt-1"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: FISCALITÉ & IFU DGI BÉNIN                                          */}
        {/* ========================================================================= */}
        {activeTab === "fiscalite" && (
          <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-6 animate-in fade-in duration-150">
            <div className="space-y-1 border-b border-border pb-4">
              <h2 className="text-[16px] font-bold text-card-foreground">Déclarations Fiscales &amp; TFU Bénin</h2>
              <p className="text-[13px] text-muted-foreground">
                Renseignez votre IFU pour certifier la conformité de vos baux auprès de la Direction Générale des Impôts (DGI).
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-muted-foreground uppercase mb-1.5">
                  Numéro IFU (Identifiant Fiscal Unique DGI Bénin - 13 chiffres)
                </label>
                <input
                  type="text"
                  maxLength={13}
                  placeholder="3201948572910"
                  value={profile.ifuNumber}
                  onChange={(e) => setProfile({ ...profile, ifuNumber: e.target.value })}
                  className="w-full max-w-md px-3.5 py-2.5 bg-background border border-border rounded-xl text-[13px] font-mono text-foreground outline-none focus:border-primary transition"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Ce numéro apparaîtra en mention légale obligatoire sur chaque quittance certifiée.
                </p>
              </div>

              <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl space-y-2 max-w-2xl">
                <div className="flex items-center gap-2 text-[12.5px] font-bold text-emerald-800 dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  Rappel Réglementaire Loi 2022-30
                </div>
                <p className="text-[12px] text-muted-foreground">
                  La délivrance d'une quittance de loyer certifiée comportant l'IFU du bailleur ou de l'agence est obligatoire en République du Bénin pour tout bail d'habitation ou commercial.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: ABONNEMENT & FORMULE                                               */}
        {/* ========================================================================= */}
        {activeTab === "abonnement" && (
          <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-6 animate-in fade-in duration-150">
            <div className="space-y-1 border-b border-border pb-4">
              <h2 className="text-[16px] font-bold text-card-foreground">Formule Active &amp; Capacité</h2>
              <p className="text-[13px] text-muted-foreground">
                Visualisez vos quotas de biens enregistrés et les fonctionnalités incluses.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600">Plan en cours</span>
                  <span className="text-[11px] font-bold bg-emerald-500/20 text-emerald-700 px-2 py-0.5 rounded-full">
                    {role}
                  </span>
                </div>
                <div className="text-2xl font-serif font-normal text-foreground">
                  Formule {plan === "agence" ? "Agence Immobilière" : plan === "pro" ? "Propriétaire Pro" : "Starter"}
                </div>
                <p className="text-[12px] text-muted-foreground">
                  {plan === "agence"
                    ? "Gestion illimitée de mandats, 10% d'honoraires et comptes-rendus de gérance."
                    : "Suivi jusqu'à 10 biens, quittances PDF illimitées et relances WhatsApp."}
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-border bg-card space-y-3">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">Utilisation du quota</span>
                <div className="text-2xl font-bold text-foreground">
                  {quotaBiens.current} / {quotaBiens.max} <span className="text-sm font-normal text-muted-foreground">biens</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (quotaBiens.current / quotaBiens.max) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[13px] font-bold transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
        </div>
      </form>
    </div>
  );
}
