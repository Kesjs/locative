"use client";

import React, { useState } from "react";
import {
  User,
  Phone,
  Mail,
  ShieldCheck,
  Save,
  LogOut,
  Upload,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function ComptePage() {
  const router = useRouter();
  const [nom, setNom] = useState("Koffi Mensah");
  const [telephone, setTelephone] = useState("+229 97 44 55 66");
  const [email, setEmail] = useState("koffi.mensah@gmail.com");
  const [contactUrgenceNom, setContactUrgenceNom] = useState("Mme Mensah Awa (Épouse)");
  const [contactUrgenceTel, setContactUrgenceTel] = useState("+229 96 11 22 33");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Vos informations ont été mises à jour avec succès !");
    }, 400);
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    router.push("/auth/login");
  };

  return (
    <div className="space-y-6">
      {/* ── HEADER ÉDITORIAL ── */}
      <div className="p-5 sm:p-6 bg-card border border-border rounded-2xl shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            Profil &amp; Identité
          </span>
          <span className="text-[11px] text-muted-foreground font-medium">Bailleur notifié</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-normal text-foreground tracking-tight">
          Mon Compte
        </h1>
        <p className="text-[13px] text-muted-foreground mt-0.5">
          Consultez et mettez à jour vos coordonnées personnelles et contacts d'urgence.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* ── COORDONNÉES PRINCIPALES ── */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-[15px] font-bold text-foreground">Coordonnées du Locataire</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-muted-foreground mb-1">
                Nom complet
              </label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="w-full border border-border rounded-xl px-3 py-2 text-[13px] bg-card text-foreground outline-none"
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold text-muted-foreground mb-1">
                Numéro WhatsApp (+229)
              </label>
              <input
                type="tel"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                className="w-full border border-border rounded-xl px-3 py-2 text-[13px] bg-card text-foreground outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[12px] font-bold text-muted-foreground mb-1">
                Adresse email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-border rounded-xl px-3 py-2 text-[13px] bg-card text-foreground outline-none"
              />
            </div>
          </div>
        </div>

        {/* ── CONTACT D'URGENCE ── */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-[15px] font-bold text-foreground">Contact en cas d'Urgence</h3>
            <p className="text-[12px] text-muted-foreground">
              Personne à joindre en cas d'incident grave ou d'inaccessibilité prolongée.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-muted-foreground mb-1">
                Nom et lien (ex: Parent, Époux)
              </label>
              <input
                type="text"
                value={contactUrgenceNom}
                onChange={(e) => setContactUrgenceNom(e.target.value)}
                className="w-full border border-border rounded-xl px-3 py-2 text-[13px] bg-card text-foreground outline-none"
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold text-muted-foreground mb-1">
                Téléphone d'urgence
              </label>
              <input
                type="tel"
                value={contactUrgenceTel}
                onChange={(e) => setContactUrgenceTel(e.target.value)}
                className="w-full border border-border rounded-xl px-3 py-2 text-[13px] bg-card text-foreground outline-none"
              />
            </div>
          </div>
        </div>

        {/* ── PIÈCE D'IDENTITÉ ── */}
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
                <span className="text-[11.5px] text-muted-foreground block">Numéro NPI : 0192837465012</span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" />
              Validé
            </span>
          </div>
        </div>

        {/* ── BOUTONS D'ACTION ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[14px] font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Enregistrement..." : "Enregistrer les modifications"}</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="py-3 px-4 text-rose-600 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded-xl text-[13px] font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Se déconnecter</span>
          </button>
        </div>
      </form>
    </div>
  );
}
