"use client";

import React, { useState } from "react";
import {
  Wrench,
  Camera,
  AlertCircle,
  CheckCircle2,
  Clock,
  Send,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

export default function AssistancePage() {
  const [signalements, setSignalements] = useState([
    {
      id: "T-2026-08",
      type: "Plomberie (Robinet cuisine)",
      description: "Léger suintement sous le siphon de l'évier.",
      date: "12 Août 2026",
      statut: "Résolu",
      urgence: "Normale",
    },
    {
      id: "T-2026-09",
      type: "Électricité SBEE",
      description: "Le disjoncteur différentiel du salon saute lors de la mise en marche du chauffe-eau.",
      date: "30 Août 2026",
      statut: "En cours",
      urgence: "Haute",
    },
  ]);

  const [typePanne, setTypePanne] = useState("Plomberie (Fuite, robinet, canalisation)");
  const [urgence, setUrgence] = useState<"Normale" | "Moyenne" | "Haute">("Normale");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error("Veuillez décrire brièvement le problème.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newTicket = {
        id: `T-2026-${String(signalements.length + 10).padStart(2, "0")}`,
        type: typePanne,
        description,
        date: new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }),
        statut: "Nouveau",
        urgence,
      };

      setSignalements([newTicket, ...signalements]);
      setDescription("");
      setIsSubmitting(false);
      toast.success("Signalement transmis à votre propriétaire !");
    }, 400);
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
          Signalez une panne ou un incident dans votre logement. Votre propriétaire recevra immédiatement une alerte.
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
                className="w-full border border-border rounded-xl px-3 py-2 text-[13px] bg-card text-foreground outline-none cursor-pointer"
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
                    className={`py-2 text-[12px] font-bold rounded-xl border transition-all cursor-pointer ${
                      urgence === u
                        ? u === "Haute"
                          ? "bg-rose-500/10 border-rose-500 text-rose-700 dark:text-rose-400 font-bold"
                          : u === "Moyenne"
                          ? "bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-400 font-bold"
                          : "bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-bold"
                        : "bg-muted/30 border-border text-muted-foreground"
                    }`}
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
              className="w-full border border-border rounded-xl p-3 text-[13px] bg-card text-foreground outline-none resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <label className="inline-flex items-center gap-2 px-3.5 py-2 border border-border rounded-xl text-[12.5px] font-bold text-foreground bg-muted/40 hover:bg-muted cursor-pointer transition-colors">
              <Camera className="w-4 h-4 text-emerald-600" />
              <span>Joindre une photo</span>
              <input type="file" accept="image/*" capture="environment" className="hidden" />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2.5 px-5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[13.5px] font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? "Transmission en cours..." : "Envoyer le signalement"}</span>
            </button>
          </div>
        </form>
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
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${badgeClass}`}>
                      {s.statut}
                    </span>
                  </div>
                  <p className="text-[12.5px] text-muted-foreground mt-1">{s.description}</p>
                  <span className="text-[11px] text-muted-foreground mt-1 block">Déclaré le {s.date}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
