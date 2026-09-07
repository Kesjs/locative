"use client";

import React, { useState, useEffect } from "react";
import {
  Wrench,
  Camera,
  AlertCircle,
  CheckCircle2,
  Clock,
  Send,
  Plus,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "lokka_locataire_tickets";

interface Ticket {
  id: string;
  type: string;
  description: string;
  date: string;
  statut: "Nouveau" | "En cours" | "Résolu";
  urgence: "Normale" | "Moyenne" | "Haute";
}

const DEFAULT_TICKETS: Ticket[] = [
  {
    id: "T-2026-01",
    type: "Plomberie (Robinet cuisine)",
    description: "Léger suintement sous le siphon de l'évier.",
    date: "12 Août 2026",
    statut: "Résolu",
    urgence: "Normale",
  },
];

export default function AssistancePage() {
  const [signalements, setSignalements] = useState<Ticket[]>(DEFAULT_TICKETS);
  const [typePanne, setTypePanne] = useState("Plomberie (Fuite, robinet, canalisation)");
  const [urgence, setUrgence] = useState<"Normale" | "Moyenne" | "Haute">("Normale");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmitted, setLastSubmitted] = useState<Ticket | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSignalements(parsed);
        }
      }
    } catch (_) {}
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error("Veuillez décrire brièvement le problème.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newTicket: Ticket = {
        id: "T-" + new Date().getFullYear() + "-" + String(signalements.length + 1).padStart(2, "0"),
        type: typePanne,
        description: description.trim(),
        date: new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }),
        statut: "Nouveau",
        urgence,
      };

      const updated = [newTicket, ...signalements];
      setSignalements(updated);
      setLastSubmitted(newTicket);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (_) {}

      setDescription("");
      setIsSubmitting(false);
      toast.success("Incident enregistré ! Vous pouvez également le notifier sur WhatsApp.");
    }, 300);
  };

  const handleSendToLandlordWhatsapp = (t: Ticket) => {
    const msg = encodeURIComponent(
      "Bonjour,\nJe vous signale un incident dans mon logement :\n- Type : " + t.type + "\n- Urgence : " + t.urgence + "\n- Détail : " + t.description + "\n- Référence Lokka : " + t.id + "\nMerci de m'indiquer la démarche à suivre.\nCordialement."
    );
    window.open("https://wa.me/22997001122?text=" + msg, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* ── HEADER ÉDITORIAL ── */}
      <div className="p-5 sm:p-6 bg-card border border-border rounded-2xl shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
            Maintenance &amp; SAV
          </span>
          <span className="text-[11px] text-muted-foreground font-medium">Interventions 24/7</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-normal text-foreground tracking-tight">
          Assistance &amp; Signalements
        </h1>
        <p className="text-[13px] text-muted-foreground mt-0.5">
          Signalez une panne ou un incident dans votre logement. Votre propriétaire recevra immédiatement l'alerte.
        </p>
      </div>

      {/* ── FORMULAIRE DE SIGNALEMENT ── */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-[15px] font-bold text-foreground">Déclarer un Incident</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-muted-foreground mb-1">
                Catégorie de la panne
              </label>
              <select
                value={typePanne}
                onChange={(e) => setTypePanne(e.target.value)}
                className="w-full border border-border rounded-xl px-3.5 py-2.5 text-[13px] bg-card text-foreground outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 cursor-pointer shadow-2xs"
              >
                <option value="Plomberie (Fuite, robinet, canalisation)">Plomberie (Fuite, robinet, canalisation)</option>
                <option value="Électricité SBEE (Disjoncteur, prise, coupure)">Électricité SBEE (Disjoncteur, prise, coupure)</option>
                <option value="Climatisation / Froid">Climatisation &amp; Froid</option>
                <option value="Serrurerie / Porte bloquée">Serrurerie &amp; Accès</option>
                <option value="Autre demande">Autre intervention technique</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-muted-foreground mb-1">
                Degré d'urgence
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["Normale", "Moyenne", "Haute"] as const).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUrgence(u)}
                    className={cn(
                      "py-2 text-[12px] font-bold rounded-xl border transition-all cursor-pointer",
                      urgence === u
                        ? u === "Haute"
                          ? "bg-rose-500/10 border-rose-500 text-rose-700 dark:text-rose-400 shadow-2xs"
                          : u === "Moyenne"
                          ? "bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-400 shadow-2xs"
                          : "bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-400 shadow-2xs"
                        : "bg-muted/30 border-border text-muted-foreground"
                    )}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-muted-foreground mb-1">
              Description de la panne
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Expliquez brièvement les symptômes de la panne..."
              className="w-full border border-border rounded-xl p-3 text-[13px] bg-card text-foreground outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 resize-none shadow-2xs"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <label className="inline-flex items-center gap-2 px-3.5 py-2.5 border border-border rounded-xl text-[12.5px] font-bold text-foreground bg-muted/40 hover:bg-muted cursor-pointer transition-colors">
              <Camera className="w-4 h-4 text-emerald-600" />
              <span>Joindre une photo</span>
              <input type="file" accept="image/*" capture="environment" className="hidden" />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2.5 px-5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[13px] font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? "Transmission en cours..." : "Enregistrer le signalement"}</span>
            </button>
          </div>
        </form>

        {/* Bannière de notification WhatsApp du dernier incident */}
        {lastSubmitted && (
          <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-emerald-950 animate-in fade-in duration-150">
            <div>
              <p className="text-[13px] font-bold">
                Incident enregistré sous la référence {lastSubmitted.id}
              </p>
              <p className="text-[12px] text-emerald-800">
                Vous pouvez envoyer immédiatement ce diagnostic à votre propriétaire sur WhatsApp pour une prise en charge rapide.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleSendToLandlordWhatsapp(lastSubmitted)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[12.5px] font-bold transition flex items-center justify-center gap-1.5 shrink-0 shadow-2xs cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Notifier sur WhatsApp</span>
            </button>
          </div>
        )}
      </div>

      {/* ── HISTORIQUE DES SIGNALEMENTS ── */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-[15px] font-bold text-foreground">Suivi de vos Demandes</h3>

        <div className="space-y-3">
          {signalements.map((s) => {
            let badgeClass = "bg-muted text-muted-foreground border-border";
            if (s.statut === "Résolu") badgeClass = "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20";
            if (s.statut === "En cours") badgeClass = "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20";
            if (s.statut === "Nouveau") badgeClass = "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";

            return (
              <div
                key={s.id}
                className="p-4 bg-muted/30 border border-border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[14px] text-foreground">{s.type}</span>
                    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border", badgeClass)}>
                      {s.statut}
                    </span>
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      Urgence : {s.urgence}
                    </span>
                  </div>
                  <p className="text-[12.5px] text-muted-foreground mt-1">{s.description}</p>
                  <span className="text-[11px] text-muted-foreground mt-1 block">Déclaré le {s.date} · Réf: {s.id}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleSendToLandlordWhatsapp(s)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-muted/80 text-foreground border border-border rounded-lg text-[12px] font-bold transition self-end sm:self-auto cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Rappeler sur WhatsApp</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
