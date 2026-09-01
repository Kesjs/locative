"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { User, Phone, Mail, Bell, Shield, CheckCircle2 } from "lucide-react";

export default function LocataireParametresPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [fullName, setFullName] = useState("Koudjo Dossou");
  const [phone, setPhone] = useState("+229 97 00 11 22");
  const [email, setEmail] = useState("koudjo.dossou@gmail.com");
  const [notifyWhatsapp, setNotifyWhatsapp] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsSaving(false);
    toast.success("Paramètres et préférences enregistrés avec succès !");
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      <div className="p-5 bg-card border border-border rounded-xl shadow-xs">
        <h1 className="text-[20px] font-extrabold text-card-foreground tracking-tight">
          Paramètres &amp; Préférences Locataire
        </h1>
        <p className="text-[13px] text-muted-foreground mt-1">
          Gérez vos coordonnées de contact pour la réception automatique de vos quittances officielles.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Coordonnées */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-[16px] font-bold text-card-foreground">Informations Personnelles</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-[12px] font-bold text-card-foreground mb-1.5">
                Nom complet
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-[13.5px] font-medium text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold text-card-foreground mb-1.5">
                Numéro WhatsApp (Réception Quittances)
              </label>
              <div className="flex items-center rounded-lg border border-border bg-background px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
                <Phone className="h-4 w-4 text-muted-foreground mr-2 shrink-0" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-10 bg-transparent text-[13.5px] font-medium text-foreground outline-none"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[12px] font-bold text-card-foreground mb-1.5">
                Adresse Email
              </label>
              <div className="flex items-center rounded-lg border border-border bg-background px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
                <Mail className="h-4 w-4 text-muted-foreground mr-2 shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 bg-transparent text-[13.5px] font-medium text-foreground outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="text-[16px] font-bold text-card-foreground">Rappels &amp; Notifications</h2>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20 hover:bg-muted/30 cursor-pointer transition-colors">
              <div>
                <p className="text-[13.5px] font-bold text-card-foreground">Rappels d&apos;échéance WhatsApp</p>
                <p className="text-[12px] text-muted-foreground">Recevoir un rappel amical 5 jours avant la date limite du loyer.</p>
              </div>
              <input
                type="checkbox"
                checked={notifyWhatsapp}
                onChange={(e) => setNotifyWhatsapp(e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20 hover:bg-muted/30 cursor-pointer transition-colors">
              <div>
                <p className="text-[13.5px] font-bold text-card-foreground">Envoi automatique de la quittance PDF</p>
                <p className="text-[12px] text-muted-foreground">Dès validation du paiement MTN/Moov MoMo, recevoir le PDF certifié par email.</p>
              </div>
              <input
                type="checkbox"
                checked={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-[13.5px] font-bold transition-all shadow-xs cursor-pointer disabled:opacity-75"
          >
            <CheckCircle2 className="h-4 w-4" />
            {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
        </div>
      </form>
    </div>
  );
}
