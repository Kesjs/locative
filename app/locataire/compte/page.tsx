"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Phone,
  Mail,
  ShieldCheck,
  Save,
  LogOut,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  KeyRound,
  Smartphone,
  Bell,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { clearLocalAccountCache } from "@/lib/clearLocalCache";

export default function ComptePage() {
  const router = useRouter();
  const [nom, setNom] = useState("Locataire Lokka");
  const [telephone, setTelephone] = useState("+229 97 00 00 00");
  const [email, setEmail] = useState("");
  const [preferredOperator, setPreferredOperator] = useState<"mtn" | "moov">("mtn");
  const [whatsappReminders, setWhatsappReminders] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // État Sécurité / Mot de passe
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          setEmail(user.email || "");
          if (user.user_metadata?.full_name) {
            setNom(user.user_metadata.full_name);
          }
          if (user.user_metadata?.phone_number) {
            setTelephone(user.user_metadata.phone_number);
          }
          if (user.user_metadata?.preferred_operator) {
            setPreferredOperator(user.user_metadata.preferred_operator);
          }
        }
      });
    }
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        await supabase.auth.updateUser({
          data: {
            full_name: nom,
            phone_number: telephone,
            preferred_operator: preferredOperator,
            whatsapp_reminders: whatsappReminders,
          },
        });
      }
      toast.success("Vos paramètres ont été enregistrés avec succès !");
    } catch (err) {
      toast.error("Erreur lors de la mise à jour des coordonnées.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error("Le mot de passe doit comporter au moins 6 caractères.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      if (!isSupabaseConfigured()) {
        throw new Error("Configuration Supabase manquante.");
      }
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast.success("Votre mot de passe a été personnalisé et sécurisé avec succès !");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message || "Impossible de mettre à jour le mot de passe.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    clearLocalAccountCache();
    router.push("/auth/locataire");
  };

  const isPasswordStrong = newPassword.length >= 8;
  const isPasswordValid = newPassword.length >= 6;

  return (
    <div className="space-y-6">
      {/* ── HEADER ÉDITORIAL ── */}
      <div className="p-5 sm:p-6 bg-card border border-border rounded-2xl shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            Paramètres &amp; Sécurité
          </span>
          <span className="text-[11px] text-muted-foreground font-medium">Bailleur notifié</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-normal text-foreground tracking-tight">
          Mon Compte &amp; Préférences
        </h1>
        <p className="text-[13px] text-muted-foreground mt-0.5">
          Gérez vos coordonnées personnelles, vos options de paiement Genius Pay et personnalisez votre mot de passe d'accès.
        </p>
      </div>

      {/* ── COORDONNÉES PRINCIPALES ── */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-5">
          <h3 className="text-[15px] font-bold text-foreground">Profil &amp; Coordonnées</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-muted-foreground mb-1">
                Nom complet
              </label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="w-full border border-border rounded-xl px-3 py-2.5 text-[13px] bg-card text-foreground outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold text-muted-foreground mb-1">
                Numéro Mobile Money (+229)
              </label>
              <input
                type="tel"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                className="w-full border border-border rounded-xl px-3 py-2.5 text-[13px] bg-card text-foreground outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 shadow-2xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[12px] font-bold text-muted-foreground mb-1">
                Adresse email (Identifiant de connexion)
              </label>
              <input
                type="email"
                readOnly
                value={email}
                className="w-full border border-border rounded-xl px-3 py-2.5 text-[13px] bg-muted/40 text-muted-foreground outline-none cursor-not-allowed"
              />
            </div>
          </div>

          {/* ── PRÉFÉRENCES DE PAIEMENT GENIUS PAY ── */}
          <div className="pt-2 border-t border-border space-y-3">
            <label className="block text-[12px] font-bold text-muted-foreground uppercase tracking-wider">
              Opérateur favori pour vos règlements Genius Pay
            </label>
            <div className="grid grid-cols-2 gap-3 max-w-md">
              <button
                type="button"
                onClick={() => setPreferredOperator("mtn")}
                className={cn(
                  "p-3 rounded-xl border text-left transition cursor-pointer",
                  preferredOperator === "mtn"
                    ? "bg-amber-500/10 border-amber-500 text-amber-950 dark:text-amber-200 shadow-2xs"
                    : "bg-muted/30 border-border text-muted-foreground"
                )}
              >
                <div className="text-[12px] font-bold">MTN Mobile Money</div>
                <div className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">*880# Bénin</div>
              </button>

              <button
                type="button"
                onClick={() => setPreferredOperator("moov")}
                className={cn(
                  "p-3 rounded-xl border text-left transition cursor-pointer",
                  preferredOperator === "moov"
                    ? "bg-blue-500/10 border-blue-500 text-blue-950 dark:text-blue-200 shadow-2xs"
                    : "bg-muted/30 border-border text-muted-foreground"
                )}
              >
                <div className="text-[12px] font-bold">Moov Money</div>
                <div className="text-[11px] text-blue-700 dark:text-blue-400 mt-0.5">*855# Bénin (Flooz)</div>
              </button>
            </div>
          </div>

          {/* ── NOTIFICATIONS WHATSAPP ── */}
          <div className="pt-2 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Bell className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
              <div>
                <span className="text-[13px] font-bold text-foreground block">
                  Rappels d'échéances sur WhatsApp
                </span>
                <span className="text-[11.5px] text-muted-foreground">
                  Recevoir une notification bienveillante 5 jours avant le 5 du mois
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={whatsappReminders}
              onChange={(e) => setWhatsappReminders(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[13px] font-bold transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Enregistrement..." : "Enregistrer mes préférences"}</span>
            </button>
          </div>
        </div>
      </form>

      {/* ── SÉCURITÉ & MOT DE PASSE ── */}
      <form id="securite" onSubmit={handleUpdatePassword} className="space-y-6">
        <div className="bg-card border border-emerald-300/80 dark:border-emerald-700/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[15px] font-bold text-foreground flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>Sécurité &amp; Mot de Passe</span>
              </h3>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                Personnalisez le mot de passe temporaire reçu par courriel pour sécuriser vos données.
              </p>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Recommandé
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-muted-foreground mb-1">
                Nouveau mot de passe personnel
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  required
                  placeholder="Min. 6 caractères"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-border rounded-xl px-3 py-2.5 pr-10 text-[13px] bg-card text-foreground outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {newPassword && (
                <div className="mt-1.5 flex items-center gap-1.5 text-[11px]">
                  <div
                    className={cn(
                      "h-1 rounded-full flex-1 transition-all",
                      isPasswordStrong ? "bg-emerald-500" : isPasswordValid ? "bg-amber-500" : "bg-rose-400"
                    )}
                  />
                  <span className="font-semibold text-muted-foreground">
                    {isPasswordStrong ? "Fort" : isPasswordValid ? "Moyen" : "Trop court"}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[12px] font-bold text-muted-foreground mb-1">
                Confirmer le nouveau mot de passe
              </label>
              <input
                type="password"
                required
                placeholder="Retapez votre mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-border rounded-xl px-3 py-2.5 text-[13px] bg-card text-foreground outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 shadow-2xs"
              />
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between">
            <button
              type="submit"
              disabled={isUpdatingPassword || !newPassword}
              className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[13px] font-bold transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isUpdatingPassword ? "Mise à jour..." : "Mettre à jour mon mot de passe"}</span>
            </button>
          </div>
        </div>
      </form>

      {/* ── PIÈCE D'IDENTITÉ DÉPOSÉE ── */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-[15px] font-bold text-foreground">Pièce d'Identité Déposée</h3>
          <p className="text-[12px] text-muted-foreground">
            Certificat d'Identification Personnelle (CIP / ANIP) ou Passeport conforme Loi 2022-30.
          </p>
        </div>

        <div className="p-4 bg-muted/30 border border-border rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-[13.5px] text-foreground">CIP Bénin (Vérifié)</span>
              <span className="text-[11.5px] text-muted-foreground block">Enregistré lors de l'établissement du bail</span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            Conforme
          </span>
        </div>
      </div>

      {/* ── DÉCONNEXION ── */}
      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={handleLogout}
          className="py-2.5 px-4 text-rose-600 hover:bg-rose-500/10 border border-rose-200 dark:border-rose-900/40 rounded-xl text-[13px] font-bold transition-all flex items-center gap-2 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Se déconnecter de mon espace</span>
        </button>
      </div>
    </div>
  );
}
