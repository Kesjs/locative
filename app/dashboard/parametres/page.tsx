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
  Percent,
  Briefcase,
  FileCheck2,
} from "lucide-react";

type Tab = "profil" | "encaissement" | "notifications" | "fiscalite" | "abonnement";

export default function ParametresPage() {
  const { role, plan, quotaBiens, customLogo, updateCustomLogo } = useUserProfile();
  const isAgency = role === "Agence" || plan === "agence";

  const [activeTab, setActiveTab] = useState<Tab>("profil");
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [profile, setProfile] = useState({
    fullName: "",
    gerantNom: "",
    email: "",
    phone: "",
    city: "Cotonou",
    address: "",
    ifuNumber: "",
    rccmNumber: "",
    cachetUrl: "",
  });

  const [paymentSettings, setPaymentSettings] = useState({
    mtnMomo: "",
    moovMoney: "",
    bankName: "BOA Bénin (Bank of Africa)",
    iban: "",
    preferredChannel: "mtn_momo",
    tauxCommission: 10, // 10% Loi 2022-30
  });

  const [notificationSettings, setNotificationSettings] = useState({
    whatsappRentReminder: true,
    whatsappTicketAlert: true,
    emailReceiptNotification: true,
    autoQuittanceGeneration: true,
    whatsappMandantReport: true,
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
          .select("full_name, email, phone_number, city, address, ifu_number, logo_url, preferred_payment_channel, payment_details, organization_id")
          .eq("id", user.id)
          .single();

        if (error) {
          console.warn("Could not fetch full profile from Supabase:", error.message);
        }

        let orgName = "";
        if (dbProfile?.organization_id) {
          const { data: orgData } = await supabase
            .from("organizations")
            .select("name")
            .eq("id", dbProfile.organization_id)
            .single();
          if (orgData?.name) orgName = orgData.name;
        }

        if (isMounted) {
          const savedPayments = localStorage.getItem("lokka_payment_settings");
          const parsedPayments = savedPayments ? JSON.parse(savedPayments) : null;
          const savedAgency = localStorage.getItem("lokka_agency_settings");
          const parsedAgency = savedAgency ? JSON.parse(savedAgency) : null;

          let paymentDetailsParsed: any = {};
          if (dbProfile?.payment_details) {
            try {
              paymentDetailsParsed =
                typeof dbProfile.payment_details === "object"
                  ? dbProfile.payment_details
                  : JSON.parse(dbProfile.payment_details);
            } catch (_) {}
          }

          setProfile({
            fullName: orgName || dbProfile?.full_name || user.user_metadata?.full_name || (isAgency ? "Cabinet Immobilier" : "Propriétaire Lokka"),
            gerantNom: paymentDetailsParsed?.gerantNom || parsedAgency?.gerantNom || user.user_metadata?.full_name || "",
            email: dbProfile?.email || user.email || "",
            phone: dbProfile?.phone_number || user.user_metadata?.phone_number || "+229 ",
            city: dbProfile?.city || "Cotonou",
            address: dbProfile?.address || "",
            ifuNumber: dbProfile?.ifu_number || "",
            rccmNumber: paymentDetailsParsed?.rccmNumber || parsedAgency?.rccmNumber || "",
            cachetUrl: paymentDetailsParsed?.cachetUrl || parsedAgency?.cachetUrl || "",
          });

          if (dbProfile?.logo_url) {
            updateCustomLogo(dbProfile.logo_url);
          }

          if (Object.keys(paymentDetailsParsed).length > 0) {
            setPaymentSettings((prev) => ({
              ...prev,
              ...paymentDetailsParsed,
            }));
          } else if (parsedPayments) {
            setPaymentSettings(parsedPayments);
          }
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        if (isMounted) setIsLoadingProfile(false);
      }
    }

    fetchUserData();
  }, [isAgency]);

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
          const paymentPayload = {
            ...paymentSettings,
            gerantNom: profile.gerantNom,
            rccmNumber: profile.rccmNumber,
            cachetUrl: profile.cachetUrl,
          };

          const updatePayload: Record<string, any> = {
            full_name: profile.fullName,
            phone_number: profile.phone,
            city: profile.city,
            address: profile.address,
            ifu_number: profile.ifuNumber || null,
            logo_url: customLogo || null,
            preferred_payment_channel: paymentSettings.preferredChannel,
            payment_details: paymentPayload,
            updated_at: new Date().toISOString(),
          };

          const { error: profileError } = await supabase
            .from("profiles")
            .update(updatePayload)
            .eq("id", user.id);

          if (profileError) {
            throw profileError;
          }

          // Si organisation associée et nom modifié, mettre à jour l'organisation
          const { data: currentProfile } = await supabase
            .from("profiles")
            .select("organization_id")
            .eq("id", user.id)
            .single();

          if (currentProfile?.organization_id) {
            await supabase
              .from("organizations")
              .update({
                name: profile.fullName,
                updated_at: new Date().toISOString(),
              })
              .eq("id", currentProfile.organization_id);
          }
        }
      }

      // Sauvegarde miroir pour l'accès local instantané
      localStorage.setItem("lokka_payment_settings", JSON.stringify(paymentSettings));
      localStorage.setItem("lokka_notification_settings", JSON.stringify(notificationSettings));
      localStorage.setItem(
        "lokka_agency_settings",
        JSON.stringify({
          gerantNom: profile.gerantNom,
          rccmNumber: profile.rccmNumber,
          cachetUrl: profile.cachetUrl,
        })
      );

      toast.success("Paramètres enregistrés avec succès !", {
        description: isAgency
          ? "La fiche cabinet, les honoraires et les coordonnées légales ont été mis à jour."
          : "Vos coordonnées et préférences ont été mises à jour.",
      });
    } catch (error: any) {
      console.error("Erreur mise à jour profil:", error);
      toast.error("Erreur lors de l'enregistrement des paramètres", {
        description: error?.message || "Veuillez vérifier votre connexion et réessayer.",
      });
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
      {/* Header Éditorial Dynamique selon Profil */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-card border border-border rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {isAgency ? (
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                Cabinet Agréé · Loi n° 2022-30 🇧🇯
              </span>
            ) : (
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                Propriétaire Bailleur · Bénin &amp; Diaspora
              </span>
            )}
            <span className="text-[11px] text-muted-foreground font-medium">République du Bénin</span>
          </div>
          <h1 className="font-serif text-2xl font-normal text-foreground">
            {isAgency ? "Paramètres du Cabinet & Gérance" : "Paramètres du Compte Bailleur"}
          </h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            {isAgency
              ? "Gérez l'identité légale de votre agence, vos coordonnées RCCM/IFU, votre barème d'honoraires et vos comptes de reversement mandants."
              : "Gérez votre identité, vos comptes de réception Mobile Money, vos déclarations IFU et vos alertes locataires."}
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[13px] font-bold transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer disabled:opacity-50 shrink-0"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>

      {/* Tabs Switcher Contextuel */}
      <div className="flex items-center gap-1 border-b border-border overflow-x-auto pb-px">
        {[
          {
            id: "profil",
            label: isAgency ? "Fiche Cabinet & Juridique" : "Profil & Identité",
            icon: isAgency ? Briefcase : UserCircle,
          },
          {
            id: "encaissement",
            label: isAgency ? "Honoraires & Reversements" : "Mobile Money & Banques",
            icon: isAgency ? Percent : CreditCard,
          },
          {
            id: "notifications",
            label: isAgency ? "Comptes-rendus & Alertes" : "Alertes WhatsApp & Email",
            icon: Bell,
          },
          {
            id: "fiscalite",
            label: isAgency ? "Fiscalité RCCM & IFU DGI" : "Fiscalité & IFU DGI",
            icon: Landmark,
          },
          {
            id: "abonnement",
            label: isAgency ? "Formule Cabinet Partenaire" : "Abonnement & Quotas",
            icon: Sparkles,
          },
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
        {/* TAB 1: PROFIL & FICHE CABINET                                             */}
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
                    <h2 className="text-[16px] font-bold text-card-foreground">
                      {profile.fullName || (isAgency ? "Cabinet Immobilier" : "Utilisateur")}
                    </h2>
                    <BadgeCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-[12px] text-muted-foreground">
                    {isAgency ? "Cabinet Agréé · Direction Générale de l'Habitat" : "Profil certifié · République du Bénin"}
                  </p>
                </div>
              </div>

              {/* Logo customizer button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const sampleLogo = isAgency
                      ? "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&q=80"
                      : "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&q=80";
                    updateCustomLogo(sampleLogo);
                    toast.success(isAgency ? "Logo Cabinet appliqué !" : "Logo SCI appliqué !");
                  }}
                  className="px-3.5 py-2 bg-muted hover:bg-muted/80 text-foreground border border-border rounded-xl text-[12px] font-bold transition cursor-pointer"
                >
                  {isAgency ? "Exemple Logo Cabinet" : "Tester un Logo SCI"}
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

            {/* Logo URL & Cachet pour Quittances */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/30 border border-border rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-[12.5px] font-bold text-foreground">
                  <Building className="w-4 h-4 text-emerald-600" />
                  Logo Officiel (Dashboard &amp; En-tête des Quittances)
                </div>
                <p className="text-[11.5px] text-muted-foreground">
                  {isAgency
                    ? "Affichez l'emblème de votre cabinet sur l'ensemble des quittances certifiées et avis d'échéance."
                    : "Affichez le logo de votre SCI ou résidence sur les quittances transmises aux locataires."}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="url"
                    value={customLogo || ""}
                    onChange={(e) => updateCustomLogo(e.target.value)}
                    placeholder="URL du logo (ex: https://.../mon-logo.png)"
                    className="flex-1 px-3.5 py-2 bg-background border border-border rounded-xl text-[12.5px] font-mono text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>

              {isAgency ? (
                <div className="p-4 bg-muted/30 border border-border rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-[12.5px] font-bold text-foreground">
                    <FileCheck2 className="w-4 h-4 text-blue-600" />
                    Cachet &amp; Signature Numérique du Cabinet
                  </div>
                  <p className="text-[11.5px] text-muted-foreground">
                    Apposé automatiquement au bas des quittances certifiées pour valider la délivrance officielle.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="url"
                      value={profile.cachetUrl}
                      onChange={(e) => setProfile({ ...profile, cachetUrl: e.target.value })}
                      placeholder="URL du cachet (tampon transparent PNG)"
                      className="flex-1 px-3.5 py-2 bg-background border border-border rounded-xl text-[12.5px] font-mono text-foreground outline-none focus:border-primary"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-[12.5px] font-bold text-emerald-700 dark:text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                    Garantie de Valeur Probante
                  </div>
                  <p className="text-[11.5px] text-muted-foreground">
                    Toutes les quittances émises sous Lokka respectent les mentions obligatoires de la Loi 2022-30 du Bénin et font foi en justice.
                  </p>
                </div>
              )}
            </div>

            {/* Champs d'identité */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-bold text-muted-foreground uppercase mb-1.5">
                  {isAgency ? "Raison Sociale de l'Agence / Cabinet" : "Nom complet du bailleur"}
                </label>
                <input
                  type="text"
                  required
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  placeholder={isAgency ? "Ex: Cabinet Immobilier du Golfe SARL" : "Ex: Alexandre Koudjo"}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-[13px] text-foreground outline-none focus:border-primary transition"
                />
              </div>

              {isAgency && (
                <div>
                  <label className="block text-[12px] font-bold text-muted-foreground uppercase mb-1.5">
                    Nom &amp; Prénom du Gérant / Directeur
                  </label>
                  <input
                    type="text"
                    value={profile.gerantNom}
                    onChange={(e) => setProfile({ ...profile, gerantNom: e.target.value })}
                    placeholder="Ex: Claudine Mensah (Gérante Agréée)"
                    className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-[13px] text-foreground outline-none focus:border-primary transition"
                  />
                </div>
              )}

              <div>
                <label className="block text-[12px] font-bold text-muted-foreground uppercase mb-1.5">
                  Adresse Email de gestion &amp; connexion
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
                  {isAgency ? "Téléphone Professionnel & WhatsApp Cabinet" : "Numéro WhatsApp Principal"}
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
                  {isAgency ? "Ville du Siège Social" : "Ville Principale de Gestion"}
                </label>
                <select
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-[13px] text-foreground outline-none focus:border-primary transition"
                >
                  <option value="Cotonou">Cotonou (Littoral)</option>
                  <option value="Abomey-Calavi">Abomey-Calavi (Atlantique)</option>
                  <option value="Porto-Novo">Porto-Novo (Ouémé)</option>
                  <option value="Parakou">Parakou (Borgou)</option>
                  <option value="Ouidah">Ouidah (Atlantique)</option>
                  <option value="Diaspora (France / International)">Diaspora (France / International)</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-muted-foreground uppercase mb-1.5">
                  {isAgency ? "Adresse Physique du Siège" : "Adresse Géographique"}
                </label>
                <input
                  type="text"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  placeholder={isAgency ? "Ex: Haie Vive, Rue 380, Immeuble Horizon" : "Ex: Quartier Cadjèhoun, Carré 112"}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-[13px] text-foreground outline-none focus:border-primary transition"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ENCAISSEMENT & REVERSEMENTS MANDANTS                               */}
        {/* ========================================================================= */}
        {activeTab === "encaissement" && (
          <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-6 animate-in fade-in duration-150">
            <div className="space-y-1 border-b border-border pb-4">
              <h2 className="text-[16px] font-bold text-card-foreground">
                {isAgency ? "Honoraires de Gestion & Modalités de Reversement" : "Coordonnées de Réception des Loyers"}
              </h2>
              <p className="text-[13px] text-muted-foreground">
                {isAgency
                  ? "Conformément à la Loi 2022-30, vos honoraires sont déduits à la source avant reversement au propriétaire mandant."
                  : "Ces coordonnées apparaîtront sur les avis d'échéance et rappels WhatsApp envoyés à vos locataires."}
              </p>
            </div>

            {/* Bloc Réglementaire Loi 2022-30 pour les Agences */}
            {isAgency && (
              <div className="p-4.5 bg-blue-500/5 border border-blue-500/20 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Percent className="w-4 h-4 text-blue-600" />
                    <span className="text-[13px] font-bold text-blue-900 dark:text-blue-300">
                      Régime Légal des Honoraires de Gérance (Loi n° 2022-30)
                    </span>
                  </div>
                  <span className="text-[10.5px] font-bold uppercase tracking-wider bg-blue-500/15 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-full">
                    Plafonné à 10%
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px] text-muted-foreground leading-relaxed">
                  <div className="p-3 bg-card rounded-xl border border-border">
                    <span className="font-bold text-foreground block mb-0.5">Part Agence (Commission légale)</span>
                    <div className="text-xl font-mono font-bold text-blue-600 dark:text-blue-400">10% du loyer nu</div>
                    <span className="text-[11px] text-muted-foreground">Retenue automatique sur les encaissements locataires.</span>
                  </div>
                  <div className="p-3 bg-card rounded-xl border border-border">
                    <span className="font-bold text-foreground block mb-0.5">Reversement Propriétaire Mandant</span>
                    <div className="text-xl font-mono font-bold text-emerald-600 dark:text-emerald-400">90% net reversé</div>
                    <span className="text-[11px] text-muted-foreground">Virement bancaire ou Mobile Money au propriétaire du bien.</span>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Compte Bancaire Pro */}
              <div className="sm:col-span-2 p-5 bg-muted/30 border border-border rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-emerald-600" />
                  <span className="text-[13px] font-bold text-card-foreground">
                    {isAgency
                      ? "Compte Bancaire Professionnel du Cabinet (Virements Mandants)"
                      : "Compte Bancaire Bénin (Virement BOA, Ecobank, SGB, UBA, NSIA)"}
                  </span>
                </div>
                <p className="text-[11.5px] text-muted-foreground">
                  {isAgency
                    ? "Compte officiel utilisé pour émettre les reversements nets mensuels vers les propriétaires mandants."
                    : "Coordonnées bancaires facultatives communiquées aux locataires qui règlent par virement."}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">
                      Établissement Bancaire
                    </label>
                    <input
                      type="text"
                      value={paymentSettings.bankName}
                      onChange={(e) => setPaymentSettings({ ...paymentSettings, bankName: e.target.value })}
                      placeholder="Ex: BOA Bénin, Ecobank Bénin, SGB"
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

              {/* MTN MoMo */}
              <div className="p-5 bg-amber-500/5 border border-amber-500/20 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-amber-600" />
                    <span className="text-[13px] font-bold text-amber-800 dark:text-amber-400">
                      {isAgency ? "MTN MoMo Marchand Cabinet" : "MTN Mobile Money Bénin"}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase bg-amber-500/15 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full">
                    Actif
                  </span>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">
                    {isAgency ? "Code Marchand ou Numéro MoMo Pro" : "Numéro Marchand / Téléphone MoMo"}
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
                      {isAgency ? "Moov Money Marchand Cabinet" : "Moov Money Bénin (Flooz)"}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase bg-blue-500/15 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full">
                    Actif
                  </span>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">
                    {isAgency ? "Code Marchand ou Numéro Flooz Pro" : "Numéro Marchand / Téléphone Flooz"}
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
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: NOTIFICATIONS & COMPTES-RENDUS                                     */}
        {/* ========================================================================= */}
        {activeTab === "notifications" && (
          <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-6 animate-in fade-in duration-150">
            <div className="space-y-1 border-b border-border pb-4">
              <h2 className="text-[16px] font-bold text-card-foreground">
                {isAgency ? "Comptes-Rendus Mandants & Relances Automatisées" : "Préférences d'Alertes et Relances Automatisées"}
              </h2>
              <p className="text-[13px] text-muted-foreground">
                {isAgency
                  ? "Configurez l'envoi transparent des rapports de gérance mensuels aux mandants et les relances locataires."
                  : "Contrôlez les notifications automatiques générées par Lokka pour vous et vos locataires."}
              </p>
            </div>

            <div className="space-y-4">
              {isAgency && (
                <div className="flex items-start justify-between p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                  <div>
                    <div className="text-[13px] font-bold text-blue-950 dark:text-blue-300 flex items-center gap-2">
                      <span>Rapport mensuel automatique aux propriétaires mandants</span>
                      <span className="text-[10px] bg-blue-500/20 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded font-bold">
                        Mandats
                      </span>
                    </div>
                    <div className="text-[12px] text-muted-foreground mt-0.5">
                      Génération et envoi WhatsApp du compte de gérance récapitulant les encaissements, la déduction des 10% d'honoraires et le net reversé.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.whatsappMandantReport}
                    onChange={(e) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        whatsappMandantReport: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-emerald-600 rounded border-border focus:ring-emerald-500 cursor-pointer mt-1"
                  />
                </div>
              )}

              {[
                {
                  id: "whatsappRentReminder",
                  title: "Rappels de loyer cordiaux par WhatsApp aux locataires",
                  desc: "Envoi automatique d'une alerte avec lien de paiement à J-3 de l'échéance légale fixée par le bail.",
                },
                {
                  id: "whatsappTicketAlert",
                  title: "Alertes immédiates en cas d'incident ou de panne",
                  desc: "Notification instantanée dès qu'un locataire signale une fuite d'eau, panne SBEE ou demande d'intervention artisan.",
                },
                {
                  id: "autoQuittanceGeneration",
                  title: "Génération automatique des quittances certifiées Loi 2022-30",
                  desc: "Délivrance immédiate de la quittance PDF avec signature et cachet dès confirmation du règlement.",
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
        {/* TAB 4: FISCALITÉ, RCCM & IFU DGI BÉNIN                                     */}
        {/* ========================================================================= */}
        {activeTab === "fiscalite" && (
          <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-6 animate-in fade-in duration-150">
            <div className="space-y-1 border-b border-border pb-4">
              <h2 className="text-[16px] font-bold text-card-foreground">
                {isAgency ? "Immatriculation RCCM & IFU Officiel DGI" : "Déclarations Fiscales & TFU Bénin"}
              </h2>
              <p className="text-[13px] text-muted-foreground">
                {isAgency
                  ? "Renseignez le numéro RCCM et l'IFU de votre cabinet pour conférer pleine valeur juridique aux quittances et conventions de mandat."
                  : "Renseignez votre IFU pour certifier la conformité de vos baux auprès de la Direction Générale des Impôts (DGI)."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {isAgency && (
                <div>
                  <label className="block text-[12px] font-bold text-muted-foreground uppercase mb-1.5">
                    Numéro RCCM (Registre du Commerce et du Crédit Mobilier)
                  </label>
                  <input
                    type="text"
                    placeholder="RB/COT/21 B 12345"
                    value={profile.rccmNumber}
                    onChange={(e) => setProfile({ ...profile, rccmNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-[13px] font-mono text-foreground outline-none focus:border-primary transition"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Mention légale obligatoire pour toute agence immobilière immatriculée au Bénin.
                  </p>
                </div>
              )}

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
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-[13px] font-mono text-foreground outline-none focus:border-primary transition"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Apparaît sur toutes les quittances et avis fiscaux TFU.
                </p>
              </div>

              <div className="sm:col-span-2 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-[12.5px] font-bold text-emerald-800 dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  Rappel Réglementaire Loi n° 2022-30 du 20 décembre 2022
                </div>
                <p className="text-[12px] text-muted-foreground leading-relaxed">
                  En République du Bénin, la délivrance de quittances de loyer numérotées, datées et comportant l'IFU du bailleur ou du mandataire est une obligation légale impérative. Les cautionnements sont limités à 3 mois de loyer maximum.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: ABONNEMENT & CAPACITÉ                                              */}
        {/* ========================================================================= */}
        {activeTab === "abonnement" && (
          <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-6 animate-in fade-in duration-150">
            <div className="space-y-1 border-b border-border pb-4">
              <h2 className="text-[16px] font-bold text-card-foreground">Formule Active &amp; Capacité</h2>
              <p className="text-[13px] text-muted-foreground">
                Visualisez les capacités de votre compte et vos fonctionnalités actives.
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
                  {isAgency ? "Cabinet Partenaire Immobilière" : plan === "pro" ? "Propriétaire Pro" : "Starter"}
                </div>
                <p className="text-[12px] text-muted-foreground">
                  {isAgency
                    ? "Gestion illimitée de mandats, 10% d'honoraires déduits à la source, multi-agents et comptes-rendus de gérance automatiques."
                    : "Suivi jusqu'à 10 biens, quittances PDF certifiées illimitées et relances WhatsApp directes."}
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-border bg-card space-y-3">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                  {isAgency ? "Capacité de Mandats & Lots" : "Utilisation du quota"}
                </span>
                <div className="text-2xl font-bold text-foreground">
                  {quotaBiens.current} / {quotaBiens.max === 999 ? "Illimités" : `${quotaBiens.max} biens`}
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${quotaBiens.max === 999 ? 18 : Math.min(100, (quotaBiens.current / quotaBiens.max) * 100)}%`,
                    }}
                  />
                </div>
                <p className="text-[11.5px] text-muted-foreground">
                  {isAgency ? "Pas de plafond de lots sous gestion en formule Cabinet." : "Passez à la formule Pro ou Agence pour gérer des lots illimités."}
                </p>
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
