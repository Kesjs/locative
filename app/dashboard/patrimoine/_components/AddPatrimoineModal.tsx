"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  X,
  Building2,
  Plus,
  Trash2,
  KeyRound,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { VILLES_BENIN } from "@/lib/hooks/useBiens";

interface LotEntry {
  id: string;
  nom: string;
  loyer: number;
  statut: "loue" | "vacant";
  locataireNom?: string;
}

interface AddPatrimoineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddPatrimoineModal({ isOpen, onClose }: AddPatrimoineModalProps) {
  const queryClient = useQueryClient();

  const [nomPatrimoine, setNomPatrimoine] = useState("");
  const [typePatrimoine, setTypePatrimoine] = useState<"concession" | "immeuble" | "villa" | "commercial">("concession");
  const [ville, setVille] = useState("Cotonou");
  const [quartier, setQuartier] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [lots, setLots] = useState<LotEntry[]>([
    { id: "1", nom: "Chambre 1", loyer: 0, statut: "loue", locataireNom: "" },
    { id: "2", nom: "Chambre 2", loyer: 0, statut: "vacant" },
  ]);

  if (!isOpen) return null;

  const handleUpdateLot = (id: string, patch: Partial<LotEntry>) => {
    setLots((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  };

  const handleAddLot = () => {
    const nextIdx = lots.length + 1;
    const prefix =
      typePatrimoine === "concession"
        ? "Chambre"
        : typePatrimoine === "immeuble"
        ? "Appartement"
        : typePatrimoine === "commercial"
        ? "Boutique"
        : "Pièce";

    setLots((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        nom: prefix + " " + nextIdx,
        loyer: 0,
        statut: "vacant",
      },
    ]);
  };

  const handleRemoveLot = (id: string) => {
    if (lots.length <= 1) return;
    setLots((prev) => prev.filter((l) => l.id !== id));
  };

  const handleSetCount = (count: number) => {
    if (count <= 0 || count === lots.length) return;
    if (count < lots.length) {
      setLots(lots.slice(0, count));
    } else {
      const diff = count - lots.length;
      const prefix =
        typePatrimoine === "concession"
          ? "Chambre"
          : typePatrimoine === "immeuble"
          ? "Appartement"
          : typePatrimoine === "commercial"
          ? "Boutique"
          : "Pièce";

      const created: LotEntry[] = Array.from({ length: diff }, (_, i) => ({
        id: String(Date.now() + i),
        nom: prefix + " " + (lots.length + i + 1),
        loyer: 0,
        statut: "vacant",
      }));
      setLots([...lots, ...created]);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!nomPatrimoine.trim()) {
      errs.nomPatrimoine = "Le nom de l'ensemble / résidence est obligatoire.";
    }
    lots.forEach((lot, i) => {
      if (!lot.nom.trim()) errs["lot_" + lot.id + "_nom"] = "Nom du lot #" + (i + 1) + " requis.";
      if (!lot.loyer || lot.loyer <= 0) errs["lot_" + lot.id + "_loyer"] = "Loyer invalide (#" + (i + 1) + ").";
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Veuillez renseigner les informations obligatoires.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        let orgId: string | null = null;
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("organization_id")
            .eq("id", user.id)
            .maybeSingle();
          orgId = profile?.organization_id || null;
        }

        const baseAdresse = quartier ? (quartier + ", " + ville) : (nomPatrimoine.trim() + ", " + ville);

        // Ce formulaire ne fait que déclarer la structure (résidence + lots + statut
        // approximatif). Il n'invente plus de nom de locataire et ne crée plus de
        // transaction fantôme : un lot "loué" sans fiche locataire réelle apparaîtra
        // dans le Dashboard avec un badge "à compléter" (création via useAddTenantWithLease).
        for (const lot of lots) {
          const bienNom = nomPatrimoine.trim() + " - " + lot.nom.trim();
          const lotStatut = lot.statut === "loue" ? "loué" : "vacant";
          const locataireIndicatif = lotStatut === "loué" ? (lot.locataireNom?.trim() || null) : null;

          const { error } = await supabase
            .from("biens")
            .insert({
              nom: bienNom,
              adresse: baseAdresse,
              ville,
              quartier: quartier.trim() || undefined,
              type: lot.nom.trim(),
              loyer_mensuel: Number(lot.loyer) || 0,
              charges: 0,
              statut: lotStatut,
              locataire_nom: locataireIndicatif,
              photos: [],
              archive: false,
              organization_id: orgId,
            })
            .select()
            .maybeSingle();

          if (error) {
            console.warn("Notice insertion lot:", error.message);
          }
        }
      }

      queryClient.invalidateQueries({ queryKey: ["biens"] });
      queryClient.invalidateQueries({ queryKey: ["loyers"] });

      toast.success('Patrimoine "' + nomPatrimoine.trim() + '" créé avec ' + lots.length + ' lot(s) !');
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error("Erreur lors de la création du patrimoine");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalLoyer = lots.reduce((acc, l) => acc + (Number(l.loyer) || 0), 0);
  const louesCount = lots.filter((l) => l.statut === "loue").length;
  const vacantsCount = lots.length - louesCount;
  const tauxOccupation = Math.round((louesCount / lots.length) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-white border border-slate-200/90 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto text-slate-900"
      >
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-200 shrink-0 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[17px] font-extrabold text-slate-900 tracking-tight leading-snug">
                Nouveau Patrimoine & Unités
              </h2>
              <p className="text-[12px] text-slate-500">
                Créez une résidence, concession ou immeuble avec l'ensemble de ses chambres ou lots.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-900 flex items-center gap-1.5">
              <span>Nom du patrimoine / résidence</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={nomPatrimoine}
              onChange={(e) => {
                setNomPatrimoine(e.target.value);
                if (errors.nomPatrimoine) setErrors((prev) => ({ ...prev, nomPatrimoine: "" }));
              }}
              placeholder="Ex: Concession Akpakpa, Résidence Les Cocotiers, Villa Haie-Vive"
              className={cn(
                "w-full px-3.5 py-2.5 bg-white border rounded-xl text-[13.5px] text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all shadow-2xs",
                errors.nomPatrimoine
                  ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15"
                  : "border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
              )}
            />
            {errors.nomPatrimoine && (
              <p className="flex items-center gap-1 text-[11.5px] text-rose-600 font-medium">
                <AlertCircle className="w-3 h-3" />
                {errors.nomPatrimoine}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[12.5px] font-bold text-slate-800">
              Type d'ensemble immobilier
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "concession", label: "Concession", sub: "Chambres / Boutiques", defaultPrefix: "Chambre" },
                { id: "immeuble", label: "Immeuble", sub: "Appartements / Studios", defaultPrefix: "Appartement" },
                { id: "villa", label: "Villa", sub: "Maison & Dépendance", defaultPrefix: "Pièce / Dépendance" },
                { id: "commercial", label: "Commercial", sub: "Boutiques / Bureaux", defaultPrefix: "Boutique" },
              ].map((tp) => {
                const isSelected = typePatrimoine === tp.id;
                return (
                  <button
                    key={tp.id}
                    type="button"
                    onClick={() => {
                      setTypePatrimoine(tp.id as any);
                      setLots((prev) =>
                        prev.map((l, i) => ({
                          ...l,
                          nom: l.nom.startsWith("Chambre") || l.nom.startsWith("Appartement") || l.nom.startsWith("Boutique") || l.nom.startsWith("Pièce")
                            ? (tp.defaultPrefix + " " + (i + 1))
                            : l.nom,
                        }))
                      );
                    }}
                    className={cn(
                      "p-2.5 rounded-xl border text-left transition-all cursor-pointer",
                      isSelected
                        ? "bg-emerald-50/80 border-emerald-500 text-emerald-950 ring-1 ring-emerald-500/25"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    <div className="text-[12px] font-bold">{tp.label}</div>
                    <div className="text-[10px] text-slate-500 line-clamp-1">{tp.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[12.5px] font-bold text-slate-900">Ville (Bénin)</label>
              <select
                value={ville}
                onChange={(e) => setVille(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-[13px] text-slate-900 focus:outline-none focus:border-emerald-600 shadow-2xs"
              >
                {VILLES_BENIN.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[12.5px] font-bold text-slate-900">Quartier / Repère</label>
              <input
                type="text"
                value={quartier}
                onChange={(e) => setQuartier(e.target.value)}
                placeholder="Ex: Haie-Vive, Cadjehoun, Houéyiho..."
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-[13px] text-slate-900 focus:outline-none focus:border-emerald-600 shadow-2xs"
              />
            </div>
          </div>

          <div className="space-y-2 pt-1 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-bold text-slate-900">
                Logements & unités dans ce patrimoine
              </label>
              <span className="text-[11.5px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {lots.length} {lots.length > 1 ? "unités" : "unité"}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {[1, 2, 3, 4, 6].map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => handleSetCount(cnt)}
                  className={cn(
                    "px-3.5 py-1 text-[12.5px] font-bold rounded-lg border transition-all cursor-pointer",
                    lots.length === cnt
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  )}
                >
                  {cnt} {cnt === 1 ? "lot" : "lots"}
                </button>
              ))}
              <button
                type="button"
                onClick={handleAddLot}
                className="inline-flex items-center gap-1 px-3 py-1 text-[12px] font-bold rounded-lg border border-dashed border-emerald-600/40 text-emerald-700 hover:bg-emerald-50 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter</span>
              </button>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
              {lots.map((lot, idx) => {
                const isLotVacant = lot.statut === "vacant";
                return (
                  <div
                    key={lot.id}
                    className="p-3 bg-slate-50/80 border border-slate-200/90 rounded-2xl space-y-2.5 transition-all"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200 shrink-0">
                          #{idx + 1}
                        </span>
                        <input
                          type="text"
                          value={lot.nom}
                          onChange={(e) => handleUpdateLot(lot.id, { nom: e.target.value })}
                          placeholder="Nom de l'unité"
                          className="px-2.5 py-1 text-[13px] font-semibold text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 w-full max-w-[200px]"
                        />
                      </div>
                      {lots.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveLot(lot.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                      <div className="sm:col-span-6 relative">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={lot.loyer ? Number(lot.loyer).toLocaleString("fr-FR") : ""}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            handleUpdateLot(lot.id, { loyer: val ? parseInt(val, 10) : 0 });
                          }}
                          placeholder="Ex: 50 000"
                          className="w-full px-3 py-1.5 pr-16 bg-white border border-slate-200 rounded-xl text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 shadow-2xs"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                            FCFA
                          </span>
                        </div>
                      </div>

                      <div className="sm:col-span-6 grid grid-cols-2 gap-1 p-0.5 bg-slate-200/70 rounded-xl border border-slate-200">
                        <button
                          type="button"
                          onClick={() => handleUpdateLot(lot.id, { statut: "loue" })}
                          className={cn(
                            "flex items-center justify-center gap-1 py-1 px-2 text-[11.5px] font-bold rounded-lg transition-all cursor-pointer",
                            !isLotVacant
                              ? "bg-white text-slate-900 shadow-2xs"
                              : "text-slate-600 hover:text-slate-900"
                          )}
                        >
                          <KeyRound className="w-3 h-3 text-emerald-600" />
                          <span>Loué</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateLot(lot.id, { statut: "vacant" })}
                          className={cn(
                            "flex items-center justify-center gap-1 py-1 px-2 text-[11.5px] font-bold rounded-lg transition-all cursor-pointer",
                            isLotVacant
                              ? "bg-white text-slate-900 shadow-2xs"
                              : "text-slate-600 hover:text-slate-900"
                          )}
                        >
                          <span>Vacant</span>
                        </button>
                      </div>
                    </div>

                    {!isLotVacant && (
                      <div className="pt-0.5">
                        <input
                          type="text"
                          value={lot.locataireNom || ""}
                          onChange={(e) => handleUpdateLot(lot.id, { locataireNom: e.target.value })}
                          placeholder="Nom du locataire (optionnel, à titre indicatif)"
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[12.5px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 shadow-2xs"
                        />
                        <p className="text-[10.5px] text-slate-500 mt-1 px-0.5">
                          La fiche complète du locataire (téléphone, bail, caution...) se crée ensuite depuis la fiche du bien.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 bg-emerald-50/70 border border-emerald-200/90 rounded-2xl flex items-center justify-between text-[12px]">
            <div className="flex items-center gap-1.5 text-emerald-900 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {lots.length} lots : <strong>{louesCount} loué(s)</strong>, <strong>{vacantsCount} vacant(s)</strong> ({tauxOccupation}%)
              </span>
            </div>
            <div className="font-mono text-emerald-800 font-bold bg-white px-2 py-0.5 rounded-md border border-emerald-200">
              {totalLoyer.toLocaleString("fr-FR")} FCFA/m
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-10 px-4 rounded-xl border-slate-200 text-slate-700 font-bold text-[13px] cursor-pointer"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[13px] shadow-xs cursor-pointer"
            >
              {isSubmitting ? "Création en cours..." : "Créer le patrimoine & ses lots"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
