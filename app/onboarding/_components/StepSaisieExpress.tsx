"use client";

import React from "react";
import { type ProfileType, type Objectif, type SaisieExpressData, type LotItem } from "../_types";
import { AgencyCalculatorPreview } from "./AgencyCalculatorPreview";
import { Building2, Home, KeyRound, AlertCircle, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepSaisieExpressProps {
  profileType: ProfileType;
  objectifs: Objectif[];
  data: SaisieExpressData;
  onChange: (data: SaisieExpressData) => void;
  errors?: Record<string, string>;
}

export function StepSaisieExpress({
  profileType,
  objectifs,
  data,
  onChange,
  errors = {},
}: StepSaisieExpressProps) {
  const isAgency = profileType === "agence";

  // Initialisation par défaut avec au moins 1 lot
  const lots: LotItem[] = (data.lots && data.lots.length > 0)
    ? data.lots
    : [
        {
          id: "1",
          nom: data.typeLot || "Chambre 1",
          loyer: data.loyerMensuel || 75000,
          statut: data.statutOccupation || "loue",
          locataireNom: data.locataireEnPlaceNom || "",
        },
      ];

  // Synchronisation immédiate si les lots ne sont pas encore définis
  React.useEffect(() => {
    if (!isAgency && (!data.lots || data.lots.length === 0)) {
      onChange({
        ...data,
        lots,
        nombreLots: lots.length,
        typeLot: lots[0].nom,
        loyerMensuel: lots[0].loyer,
        statutOccupation: lots[0].statut,
        locataireEnPlaceNom: lots[0].locataireNom,
      });
    }
  }, []);

  const updateLots = (newLots: LotItem[]) => {
    const premier = newLots[0];
    onChange({
      ...data,
      lots: newLots,
      nombreLots: newLots.length,
      // Maintien rétrocompatible des champs du premier lot
      typeLot: premier?.nom,
      loyerMensuel: premier?.loyer,
      statutOccupation: premier?.statut,
      locataireEnPlaceNom: premier?.locataireNom,
    });
  };

  const handleUpdateLot = (id: string, patch: Partial<LotItem>) => {
    const updated = lots.map((l) => (l.id === id ? { ...l, ...patch } : l));
    updateLots(updated);
  };

  const handleAddLot = () => {
    const nextIndex = lots.length + 1;
    const newLot: LotItem = {
      id: String(Date.now()),
      nom: `Chambre ${nextIndex}`,
      loyer: 75000,
      statut: "vacant",
      locataireNom: "",
    };
    updateLots([...lots, newLot]);
  };

  const handleRemoveLot = (id: string) => {
    if (lots.length <= 1) return;
    updateLots(lots.filter((l) => l.id !== id));
  };

  const handleSetCount = (count: number) => {
    if (count <= 0 || count === lots.length) return;
    if (count < lots.length) {
      updateLots(lots.slice(0, count));
    } else {
      const diff = count - lots.length;
      const created: LotItem[] = Array.from({ length: diff }, (_, i) => ({
        id: String(Date.now() + i),
        nom: `Chambre ${lots.length + i + 1}`,
        loyer: 75000,
        statut: "vacant",
        locataireNom: "",
      }));
      updateLots([...lots, ...created]);
    }
  };

  // Statistiques en direct de la résidence
  const totalLoyer = lots.reduce((acc, l) => acc + (Number(l.loyer) || 0), 0);
  const louesCount = lots.filter((l) => l.statut === "loue").length;
  const vacantsCount = lots.length - louesCount;
  const tauxOccupation = Math.round((louesCount / lots.length) * 100);

  const agencyLoyer = Number(data.loyerActuelMandat || 250000);

  return (
    <div className="space-y-6">
      {/* En-tête synthétique */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Étape 3 sur 3
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            Configuration initiale
          </span>
        </div>
        <h2 className="text-[22px] sm:text-[25px] font-extrabold text-slate-900 tracking-tight leading-tight">
          {isAgency ? "Premier mandat de gestion" : "Votre résidence & ses logements"}
        </h2>
        <p className="text-[13px] text-slate-600 mt-1">
          {isAgency
            ? "Renseignez le propriétaire mandant et le lot confié à votre cabinet."
            : "Nommez votre résidence et configurez ses chambres ou appartements (loués ou vacants)."}
        </p>
      </div>

      {/* ========================================================================= */}
      {/* FORMULAIRE BAILLEUR : Résidence Multi-Lots (Chambres / Appartements)     */}
      {/* ========================================================================= */}
      {!isAgency ? (
        <div className="space-y-5">
          {/* 1. Nom de l'Ensemble ou Résidence */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-bold text-slate-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>Nom de la résidence ou ensemble</span>
                <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">Patrimoine parent</span>
            </div>
            <input
              type="text"
              value={data.nomPatrimoine || ""}
              onChange={(e) => onChange({ ...data, nomPatrimoine: e.target.value })}
              placeholder="Ex: Résidence Haie-Vive, Villa Les Cocotiers, Concession Akpakpa"
              className={cn(
                "w-full px-3.5 py-2.5 bg-white border rounded-xl text-[13.5px] text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all shadow-2xs",
                errors.nomPatrimoine
                  ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15"
                  : "border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
              )}
            />
            {errors.nomPatrimoine ? (
              <p className="flex items-center gap-1 text-[11.5px] text-rose-600 font-medium">
                <AlertCircle className="w-3 h-3" />
                {errors.nomPatrimoine}
              </p>
            ) : (
              <p className="text-[11.5px] text-slate-500">
                L'immeuble, la villa ou la concession qui regroupe vos logements.
              </p>
            )}
          </div>

          {/* 1 bis. Type d'Ensemble / Patrimoine */}
          <div className="space-y-1.5 pt-0.5">
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
                const isSelected = (data.typePatrimoine || "concession") === tp.id;
                return (
                  <button
                    key={tp.id}
                    type="button"
                    onClick={() => {
                      const updatedLots = lots.map((l, i) => ({
                        ...l,
                        nom: l.nom.startsWith("Chambre") || l.nom.startsWith("Appartement") || l.nom.startsWith("Boutique") || l.nom.startsWith("Lot")
                          ? `${tp.defaultPrefix} ${i + 1}`
                          : l.nom,
                      }));
                      onChange({ ...data, typePatrimoine: tp.id as any, lots: updatedLots });
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

          {/* 2. Nombre de lots / chambres dans cette résidence */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-bold text-slate-900">
                Nombre de logements / chambres dans cette résidence
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
                    "px-3.5 py-1.5 text-[12.5px] font-bold rounded-lg border transition-all cursor-pointer",
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
                className="inline-flex items-center gap-1 px-3 py-1.5 text-[12px] font-bold rounded-lg border border-dashed border-emerald-600/40 text-emerald-700 hover:bg-emerald-50 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter</span>
              </button>
            </div>
          </div>

          {/* 3. Liste des lots configurables individuellement */}
          <div className="space-y-3.5 pt-1">
            <label className="text-[13px] font-bold text-slate-900 block">
              Détail des logements de la résidence
            </label>

            <div className="space-y-3">
              {lots.map((lot, idx) => {
                const isLotVacant = lot.statut === "vacant";
                return (
                  <div
                    key={lot.id}
                    className="p-3.5 sm:p-4 bg-slate-50/80 border border-slate-200/90 rounded-2xl space-y-3 transition-all"
                  >
                    {/* En-tête du Lot */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200 shrink-0">
                          Lot #{idx + 1}
                        </span>
                        <input
                          type="text"
                          value={lot.nom}
                          onChange={(e) => handleUpdateLot(lot.id, { nom: e.target.value })}
                          placeholder={`Ex: Chambre ${idx + 1}, Appartement A...`}
                          className={cn(
                            "px-2.5 py-1 text-[13px] font-semibold text-slate-900 bg-white border rounded-lg focus:outline-none transition-all w-full max-w-[220px]",
                            errors[`lot_${lot.id}_nom`]
                              ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20"
                              : "border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500/20"
                          )}
                        />
                      </div>

                      {lots.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveLot(lot.id)}
                          title="Supprimer ce lot"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Loyer et Statut du Lot */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                      {/* Loyer mensuel */}
                      <div className="sm:col-span-6 relative">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={lot.loyer ? Number(lot.loyer).toLocaleString("fr-FR") : ""}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            handleUpdateLot(lot.id, { loyer: val ? parseInt(val, 10) : 0 });
                          }}
                          placeholder="Loyer"
                          className={cn(
                            "w-full px-3 py-2 pr-20 bg-white border rounded-xl text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all shadow-2xs",
                            errors[`lot_${lot.id}_loyer`]
                              ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15"
                              : "border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
                          )}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
                          <span className="text-[10.5px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                            FCFA
                          </span>
                        </div>
                      </div>

                      {/* Sélecteur Loué / Vacant */}
                      <div className="sm:col-span-6 grid grid-cols-2 gap-1 p-0.5 bg-slate-200/70 rounded-xl border border-slate-200">
                        <button
                          type="button"
                          onClick={() => handleUpdateLot(lot.id, { statut: "loue" })}
                          className={cn(
                            "flex items-center justify-center gap-1.5 py-1.5 px-2 text-[11.5px] font-bold rounded-lg transition-all cursor-pointer",
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
                            "flex items-center justify-center gap-1.5 py-1.5 px-2 text-[11.5px] font-bold rounded-lg transition-all cursor-pointer",
                            isLotVacant
                              ? "bg-white text-slate-900 shadow-2xs"
                              : "text-slate-600 hover:text-slate-900"
                          )}
                        >
                          <span>Vacant</span>
                        </button>
                      </div>
                    </div>

                    {/* Saisie du Locataire si Loué */}
                    {!isLotVacant && (
                      <div className="animate-in fade-in duration-150 pt-0.5">
                        <input
                          type="text"
                          value={lot.locataireNom || ""}
                          onChange={(e) => handleUpdateLot(lot.id, { locataireNom: e.target.value })}
                          placeholder="Nom complet du locataire en place (ex: M. Koffi Mensah)"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-[12.5px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 shadow-2xs"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Bandeau de Synthèse en direct de la Résidence */}
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/90 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-[12px]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold text-slate-900">
                {lots.length} {lots.length > 1 ? "logements configurés" : "logement configuré"} :
              </span>
              <span className="text-emerald-800 font-medium">
                {louesCount} loué{louesCount > 1 ? "s" : ""}, {vacantsCount} vacant{vacantsCount > 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-3 self-end sm:self-auto font-mono">
              <span className="text-slate-500 text-[11.5px]">Taux d'occupation : <strong className="text-slate-800">{tauxOccupation}%</strong></span>
              <span className="text-emerald-700 font-bold bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                {totalLoyer.toLocaleString("fr-FR")} FCFA/m
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* FORMULAIRE AGENCE : Mandant -> Immeuble -> Lot -> Honoraires              */
        /* ========================================================================= */
        <div className="space-y-4">
          {/* 1. Mandant */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-bold text-slate-900 flex items-center gap-1">
                <span>Propriétaire mandant</span>
                <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">Bailleur sous mandat</span>
            </div>
            <input
              type="text"
              value={data.proprietaireMandantNom || ""}
              onChange={(e) => onChange({ ...data, proprietaireMandantNom: e.target.value })}
              placeholder="Ex: M. Mensah, Dr. Akakpo, SCI Les Palmiers"
              className={cn(
                "w-full px-3.5 py-2.5 bg-white border rounded-xl text-[13.5px] text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all shadow-2xs",
                errors.proprietaireMandantNom
                  ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15"
                  : "border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
              )}
            />
            {errors.proprietaireMandantNom && (
              <p className="flex items-center gap-1 text-[11.5px] text-rose-600 font-medium">
                <AlertCircle className="w-3 h-3" />
                {errors.proprietaireMandantNom}
              </p>
            )}
          </div>

          {/* 2. Nom Immeuble / Résidence */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-bold text-slate-900 flex items-center gap-1">
                <span>Immeuble ou résidence sous mandat</span>
                <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">Patrimoine confié</span>
            </div>
            <input
              type="text"
              value={data.nomPatrimoine || ""}
              onChange={(e) => onChange({ ...data, nomPatrimoine: e.target.value })}
              placeholder="Ex: Résidence Marina, Immeuble Ganhi"
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

          {/* 3. Premier Lot sous mandat */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-bold text-slate-900 flex items-center gap-1">
                <span>Désignation du lot sous mandat</span>
                <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">Premier lot</span>
            </div>
            <input
              type="text"
              value={data.typeLot || ""}
              onChange={(e) => onChange({ ...data, typeLot: e.target.value })}
              placeholder="Ex: Appartement B2 (Lot 101), Bureau 80m²"
              className={cn(
                "w-full px-3.5 py-2.5 bg-white border rounded-xl text-[13.5px] text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all shadow-2xs",
                errors.typeLot
                  ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15"
                  : "border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
              )}
            />
            {errors.typeLot && (
              <p className="flex items-center gap-1 text-[11.5px] text-rose-600 font-medium">
                <AlertCircle className="w-3 h-3" />
                {errors.typeLot}
              </p>
            )}
          </div>

          {/* 4. Loyer mensuel sous mandat */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-900 flex items-center gap-1">
              <span>Loyer mensuel du lot</span>
              <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={data.loyerActuelMandat ? Number(data.loyerActuelMandat).toLocaleString("fr-FR") : ""}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  onChange({ ...data, loyerActuelMandat: val ? parseInt(val, 10) : undefined });
                }}
                placeholder="Ex: 350 000"
                className={cn(
                  "w-full px-3.5 py-2.5 pr-24 bg-white border rounded-xl text-[13.5px] text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all shadow-2xs",
                  errors.loyerActuelMandat
                    ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15"
                    : "border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
                )}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
                <span className="text-[11px] font-bold tracking-wider text-slate-600 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                  FCFA / mois
                </span>
              </div>
            </div>
            {errors.loyerActuelMandat && (
              <p className="flex items-center gap-1 text-[11.5px] text-rose-600 font-medium">
                <AlertCircle className="w-3 h-3" />
                {errors.loyerActuelMandat}
              </p>
            )}
          </div>

          {/* Prévisualisation barème légal 10% / 90% */}
          <AgencyCalculatorPreview
            loyer={agencyLoyer}
            mandantNom={data.proprietaireMandantNom || "Propriétaire mandant"}
          />
        </div>
      )}
    </div>
  );
}
