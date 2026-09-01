"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  StarIcon,
  TrashIcon,
  ArrowUpTrayIcon,
  PlusIcon,
  MapPinIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import {
  useAddBien,
  useUpdateBien,
  uploadBienPhoto,
  EQUIPEMENTS_PREDEFINIS,
  CATEGORIES_BIEN,
  VILLES_BENIN,
  plafondCaution,
  type Bien,
} from "@/lib/hooks/useBiens";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Home,
  Store,
  Briefcase,
  Warehouse,
  Sparkles,
  MapPinned,
  Zap,
  Droplets,
  RotateCcw,
} from "lucide-react";

const STEPS = ["Identité & Localisation", "Finances & Compteurs", "Photos", "Équipements"] as const;
type StepIndex = 0 | 1 | 2 | 3;

const DRAFT_STORAGE_KEY = "lokka_add_bien_draft";

interface FormState {
  nom: string;
  type: string;
  adresse: string;
  ville: string;
  quartier: string;
  repere: string;
  surface_m2: string;
  nb_pieces: string;
  loyer_mensuel: string;
  charges: string;
  caution_montant: string;
  compteur_sbee: string;
  compteur_soneb: string;
  statut: Bien["statut"];
  photos: string[];
  photo_principale: string | null;
  equipements: string[];
}

const EMPTY_FORM: FormState = {
  nom: "",
  type: "Appartement 3P (2 chambres)",
  adresse: "",
  ville: "Cotonou",
  quartier: "",
  repere: "",
  surface_m2: "",
  nb_pieces: "",
  loyer_mensuel: "",
  charges: "",
  caution_montant: "",
  compteur_sbee: "",
  compteur_soneb: "",
  statut: "vacant",
  photos: [],
  photo_principale: null,
  equipements: [],
};

function bienToForm(bien: Bien): FormState {
  return {
    nom: bien.nom,
    type: bien.type || "Appartement 3P (2 chambres)",
    adresse: bien.adresse || "",
    ville: bien.ville || "Cotonou",
    quartier: bien.quartier || "",
    repere: bien.repere || "",
    surface_m2: bien.surface_m2 ? String(bien.surface_m2) : "",
    nb_pieces: bien.nb_pieces ? String(bien.nb_pieces) : "",
    loyer_mensuel: String(bien.loyer_mensuel || ""),
    charges: String(bien.charges || ""),
    caution_montant: bien.caution_montant ? String(bien.caution_montant) : "",
    compteur_sbee: bien.compteur_sbee || "",
    compteur_soneb: bien.compteur_soneb || "",
    statut: bien.statut,
    photos: bien.photos || [],
    photo_principale: bien.photo_principale || bien.photos?.[0] || null,
    equipements: bien.equipements || [],
  };
}

export function AddBienModal({
  isOpen,
  onClose,
  editBien,
}: {
  isOpen: boolean;
  onClose: () => void;
  editBien?: Bien | null;
}) {
  const { mutateAsync: addBien, isPending: isAdding } = useAddBien();
  const { mutateAsync: updateBien, isPending: isUpdating } = useUpdateBien();
  const isPending = isAdding || isUpdating;

  const [step, setStep] = useState<StepIndex>(0);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [hasDraftRestored, setHasDraftRestored] = useState(false);
  const [customEquipement, setCustomEquipement] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragFromIndex = useRef<number | null>(null);

  // Initialisation du formulaire & Restauration automatique du brouillon
  useEffect(() => {
    if (isOpen) {
      if (editBien) {
        setForm(bienToForm(editBien));
        setHasDraftRestored(false);
      } else {
        try {
          const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
          if (savedDraft) {
            const parsed = JSON.parse(savedDraft);
            setForm(parsed);
            setHasDraftRestored(true);
          } else {
            setForm(EMPTY_FORM);
            setHasDraftRestored(false);
          }
        } catch (_) {
          setForm(EMPTY_FORM);
          setHasDraftRestored(false);
        }
      }
      setStep(0);
    }
  }, [isOpen, editBien]);

  // Sauvegarde automatique du brouillon lors de la saisie (hors mode édition)
  useEffect(() => {
    if (!isOpen || editBien) return;
    try {
      const isDirty =
        form.nom !== "" ||
        form.quartier !== "" ||
        form.loyer_mensuel !== "" ||
        form.repere !== "" ||
        form.photos.length > 0 ||
        form.equipements.length > 0;

      if (isDirty) {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(form));
      }
    } catch (_) {}
  }, [form, isOpen, editBien]);

  if (!isOpen) return null;

  const update = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }));

  const clearDraft = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch (_) {}
    setForm(EMPTY_FORM);
    setHasDraftRestored(false);
    toast.info("Brouillon effacé");
  };

  const loyerNum = Number(form.loyer_mensuel) || 0;
  const plafond = plafondCaution(loyerNum);
  const cautionNum = Number(form.caution_montant) || 0;
  const cautionDepasse = cautionNum > plafond && plafond > 0;

  const canAdvance = (): boolean => {
    if (step === 0) return form.nom.trim() !== "" && form.ville.trim() !== "";
    if (step === 1) return form.loyer_mensuel.trim() !== "" && !cautionDepasse;
    return true;
  };

  // Géolocalisation robuste avec Reverse-Geocoding OpenStreetMap
  const handleDetectLocation = async () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      toast.error("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }

    setIsGeolocating(true);

    const getPosition = (options: PositionOptions) =>
      new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });

    try {
      // Tentative avec haute précision puis standard
      let position: GeolocationPosition;
      try {
        position = await getPosition({ enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 });
      } catch {
        position = await getPosition({ enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 });
      }

      const { latitude, longitude } = position.coords;

      // Reverse geocoding via OpenStreetMap Nominatim
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=fr`,
          { headers: { "User-Agent": "LokkaApp/1.0" } }
        );

        if (res.ok) {
          const data = await res.json();
          const addr = data.address || {};

          // Détection de la ville béninoise la plus proche
          const detectedCity = addr.city || addr.town || addr.municipality || addr.county || "";
          const matchedVille = VILLES_BENIN.find(
            (v) => detectedCity.toLowerCase().includes(v.toLowerCase()) || v.toLowerCase().includes(detectedCity.toLowerCase())
          );

          // Détection du quartier / banlieue
          const detectedQuartier =
            addr.suburb || addr.quarter || addr.neighbourhood || addr.residential || addr.road || "";

          update({
            ville: matchedVille || form.ville || "Cotonou",
            quartier: detectedQuartier || form.quartier,
            repere: form.repere
              ? form.repere
              : `Position GPS : ${latitude.toFixed(5)}, ${longitude.toFixed(5)}${addr.road ? ` (${addr.road})` : ""}`,
          });

          toast.success("Position et quartier localisés avec succès !");
          return;
        }
      } catch (geoErr) {
        console.warn("Reverse geocode fallback:", geoErr);
      }

      // Fallback si reverse-geocoding échoue : enregistre les coordonnées
      update({
        repere: `Position GPS : ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
      });
      toast.success("Coordonnées GPS capturées avec succès.");
    } catch (err: any) {
      console.warn("Geolocation failed:", err);
      if (err.code === 1) {
        toast.error("Veuillez autoriser l'accès à votre position dans votre navigateur.");
      } else {
        toast.error("Impossible de détecter la position. Veuillez saisir le quartier manuellement.");
      }
    } finally {
      setIsGeolocating(false);
    }
  };

  const handleFiles = async (files: FileList | File[]) => {
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (arr.length === 0) return;
    setUploading(true);
    try {
      const urls = await Promise.all(arr.map((f) => uploadBienPhoto(f)));
      setForm((f) => ({
        ...f,
        photos: [...f.photos, ...urls],
        photo_principale: f.photo_principale || urls[0],
      }));
      toast.success(`${urls.length} photo${urls.length > 1 ? "s" : ""} ajoutée${urls.length > 1 ? "s" : ""}`);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'upload des photos");
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (url: string) => {
    setForm((f) => {
      const photos = f.photos.filter((p) => p !== url);
      return { ...f, photos, photo_principale: f.photo_principale === url ? photos[0] || null : f.photo_principale };
    });
  };

  const reorderPhotos = (from: number, to: number) => {
    setForm((f) => {
      const photos = [...f.photos];
      const [moved] = photos.splice(from, 1);
      photos.splice(to, 0, moved);
      return { ...f, photos };
    });
  };

  const toggleEquipement = (eq: string) => {
    setForm((f) => ({
      ...f,
      equipements: f.equipements.includes(eq) ? f.equipements.filter((e) => e !== eq) : [...f.equipements, eq],
    }));
  };

  const addCustomEquipement = () => {
    const val = customEquipement.trim();
    if (!val || form.equipements.includes(val)) return;
    setForm((f) => ({ ...f, equipements: [...f.equipements, val] }));
    setCustomEquipement("");
  };

  const handleSubmit = async () => {
    const payload = {
      nom: form.nom.trim(),
      type: form.type,
      adresse: form.adresse.trim() || `${form.quartier ? form.quartier + ", " : ""}${form.ville}`,
      ville: form.ville.trim(),
      quartier: form.quartier.trim(),
      repere: form.repere.trim(),
      loyer_mensuel: Number(form.loyer_mensuel) || 0,
      charges: Number(form.charges) || 0,
      statut: form.statut,
      photos: form.photos,
      photo_principale: form.photo_principale,
      equipements: form.equipements,
      caution_montant: Number(form.caution_montant) || 0,
      surface_m2: form.surface_m2 ? Number(form.surface_m2) : null,
      nb_pieces: form.nb_pieces ? Number(form.nb_pieces) : null,
      compteur_sbee: form.compteur_sbee.trim() || undefined,
      compteur_soneb: form.compteur_soneb.trim() || undefined,
    };

    try {
      if (editBien) {
        await updateBien({ id: editBien.id, ...payload });
        toast.success("Logement / local mis à jour");
      } else {
        await addBien(payload as Omit<Bien, "id">);
        toast.success("Logement / local ajouté avec succès");
        // Nettoyer le brouillon après création réussie
        try {
          localStorage.removeItem(DRAFT_STORAGE_KEY);
        } catch (_) {}
      }
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-card rounded-t-2xl sm:rounded-2xl w-full sm:max-w-xl max-h-[92vh] sm:max-h-[88vh] flex flex-col shadow-2xl border border-border overflow-hidden"
      >
        {/* ─── 1. HEADER ─── */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border shrink-0 bg-card">
          <div>
            <h3 className="text-[16px] font-bold text-card-foreground flex items-center gap-2">
              <Building2 className="w-4.5 h-4.5 text-[var(--brand-accent)]" />
              {editBien ? "Modifier le logement / local" : "Ajouter un logement ou un local"}
            </h3>
            <p className="text-[11.5px] text-muted-foreground mt-0.5">
              Renseignez les détails pour activer le suivi des baux et des loyers.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition cursor-pointer"
            aria-label="Fermer"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* ─── BANNIÈRE RESTAURATION BROUILLON ─── */}
        {hasDraftRestored && !editBien && (
          <div className="px-5 py-2 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between text-[11.5px] text-amber-700 dark:text-amber-300">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              Brouillon de saisie restauré automatiquement
            </span>
            <button
              type="button"
              onClick={clearDraft}
              className="text-amber-800 dark:text-amber-200 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Recommencer à zéro
            </button>
          </div>
        )}

        {/* ─── 2. PROGRESS BAR ─── */}
        <div className="px-5 pt-3.5 shrink-0 bg-card">
          <div className="flex items-center gap-1.5 mb-1.5">
            {STEPS.map((label, i) => (
              <div key={label} className="flex-1">
                <div
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: i <= step ? "var(--brand-accent, #059669)" : "hsl(var(--muted))",
                  }}
                />
              </div>
            ))}
          </div>
          <p className="text-[10.5px] font-bold text-muted-foreground uppercase tracking-wider">
            Étape {step + 1}/{STEPS.length} — {STEPS[step]}
          </p>
        </div>

        {/* ─── 3. CONTENU DES ÉTAPES ─── */}
        <div className="flex-1 overflow-y-auto px-5 py-3.5">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.15 }}
              className="space-y-4"
            >
              {/* ─── ÉTAPE 1 : IDENTITÉ & LOCALISATION ─── */}
              {step === 0 && (
                <>
                  <Field label="Nom ou Référence du bien *">
                    <Input
                      autoFocus
                      type="text"
                      value={form.nom}
                      onChange={(e) => update({ nom: e.target.value })}
                      placeholder="Ex. Villa Fidjrossè Plage ou Boutique N°4"
                      className="rounded-lg"
                    />
                  </Field>

                  <Field label="Type de Logement ou Local *">
                    <Select value={form.type} onValueChange={(v) => update({ type: v })}>
                      <SelectTrigger className="rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-64">
                        {CATEGORIES_BIEN.map((cat) => (
                          <SelectGroup key={cat.categorie}>
                            <SelectLabel className="text-[11px] font-bold uppercase text-muted-foreground px-2 py-1">
                              {cat.categorie}
                            </SelectLabel>
                            {cat.types.map((t) => (
                              <SelectItem key={t} value={t} className="cursor-pointer text-[13px]">
                                {t}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <div className="grid grid-cols-2 gap-2.5">
                    <Field label="Ville *">
                      <Select value={form.ville} onValueChange={(v) => update({ ville: v })}>
                        <SelectTrigger className="rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-56">
                          {VILLES_BENIN.map((v) => (
                            <SelectItem key={v} value={v} className="cursor-pointer text-[13px]">
                              {v}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>

                    <Field label="Quartier / Zone">
                      <Input
                        type="text"
                        value={form.quartier}
                        onChange={(e) => update({ quartier: e.target.value })}
                        placeholder="Ex. Fidjrossè, Cadjêhoun, Tankpè..."
                        className="rounded-lg"
                      />
                    </Field>
                  </div>

                  {/* Bouton Détecter GPS Professionnel */}
                  <Field label="Repère & Indication de localisation">
                    <div className="flex gap-2 mb-2">
                      <button
                        type="button"
                        onClick={handleDetectLocation}
                        disabled={isGeolocating}
                        className="w-full py-2 px-3 rounded-lg border border-border hover:bg-muted/70 text-[12px] font-semibold text-foreground flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs hover:border-[var(--brand-accent)]/50"
                      >
                        {isGeolocating ? (
                          <>
                            <Spinner className="w-3.5 h-3.5 text-[var(--brand-accent)]" />
                            <span>Détection et géolocalisation en cours...</span>
                          </>
                        ) : (
                          <>
                            <MapPinned className="w-4 h-4 text-[var(--brand-accent)]" />
                            <span>Détecter ma position actuelle (GPS)</span>
                          </>
                        )}
                      </button>
                    </div>
                    <Input
                      type="text"
                      value={form.repere}
                      onChange={(e) => update({ repere: e.target.value })}
                      placeholder="Ex. 2ème rue pavée après la pharmacie Concorde"
                      className="rounded-lg text-[13px]"
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-2.5">
                    <Field label="Surface approx. (m²)">
                      <Input
                        type="number"
                        min={0}
                        value={form.surface_m2}
                        onChange={(e) => update({ surface_m2: e.target.value })}
                        placeholder="Ex. 75"
                        className="rounded-lg"
                      />
                    </Field>
                    <Field label="Nombre de pièces">
                      <Input
                        type="number"
                        min={0}
                        value={form.nb_pieces}
                        onChange={(e) => update({ nb_pieces: e.target.value })}
                        placeholder="Ex. 3"
                        className="rounded-lg"
                      />
                    </Field>
                  </div>
                </>
              )}

              {/* ─── ÉTAPE 2 : FINANCES & COMPTEURS ─── */}
              {step === 1 && (
                <>
                  <div className="grid grid-cols-2 gap-2.5">
                    <Field label="Loyer mensuel (FCFA) *">
                      <Input
                        type="number"
                        min={0}
                        value={form.loyer_mensuel}
                        onChange={(e) => update({ loyer_mensuel: e.target.value })}
                        placeholder="Ex. 150000"
                        className="rounded-lg font-semibold"
                      />
                    </Field>
                    <Field label="Charges mensuelles (FCFA)">
                      <Input
                        type="number"
                        min={0}
                        value={form.charges}
                        onChange={(e) => update({ charges: e.target.value })}
                        placeholder="Ex. 10000 (Gardien/Eau)"
                        className="rounded-lg"
                      />
                    </Field>
                  </div>

                  <Field label="Statut initial">
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "vacant", label: "Vacant", dotColor: "bg-slate-400" },
                        { id: "loué", label: "Loué", dotColor: "bg-emerald-500" },
                        { id: "travaux", label: "En travaux", dotColor: "bg-amber-500" },
                      ].map((s) => {
                        const isSelected = form.statut === s.id;
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => update({ statut: s.id as any })}
                            className={`px-3 py-2 rounded-lg text-[12.5px] font-semibold border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                              isSelected
                                ? "bg-card border-slate-900 dark:border-white ring-2 ring-slate-900/10 dark:ring-white/20 text-foreground font-bold shadow-2xs"
                                : "border-border text-muted-foreground hover:bg-muted/40"
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${s.dotColor} shrink-0`} />
                            <span>{s.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </Field>

                  <Field label="Caution exigée (FCFA)">
                    <Input
                      type="number"
                      min={0}
                      value={form.caution_montant}
                      onChange={(e) => update({ caution_montant: e.target.value })}
                      placeholder={`Ex. ${loyerNum * 2 || 300000}`}
                      className="rounded-lg"
                    />
                    <div
                      className={`mt-1.5 rounded-lg p-2 text-[11.5px] flex items-start gap-1.5 ${
                        cautionDepasse
                          ? "bg-destructive/10 text-destructive border border-destructive/20 font-semibold"
                          : "bg-muted/40 text-muted-foreground"
                      }`}
                    >
                      {cautionDepasse ? (
                        <ExclamationTriangleIcon className="w-4 h-4 shrink-0 mt-0.5" />
                      ) : (
                        <CheckIcon className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                      )}
                      <span>
                        Plafond légal Loi 2022-30 (3 mois de loyer max) :{" "}
                        <strong>{plafond.toLocaleString("fr-FR")} FCFA</strong>
                        {cautionDepasse && " — Attention, ce montant dépasse le plafond légal béninois."}
                      </span>
                    </div>
                  </Field>

                  {/* Compteurs SBEE & SONEB */}
                  <div className="pt-2 border-t border-border/80">
                    <span className="text-[11.5px] font-bold text-foreground block mb-2">
                      Compteurs &amp; Références (Optionnel)
                    </span>
                    <div className="grid grid-cols-2 gap-2.5">
                      <Field label="N° Compteur SBEE (Énergie)">
                        <div className="relative">
                          <Input
                            type="text"
                            value={form.compteur_sbee}
                            onChange={(e) => update({ compteur_sbee: e.target.value })}
                            placeholder="Ex. 1428590123"
                            className="rounded-lg text-[12.5px] pl-8 font-mono"
                          />
                          <Zap className="w-3.5 h-3.5 text-amber-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </Field>
                      <Field label="N° Police SONEB (Eau)">
                        <div className="relative">
                          <Input
                            type="text"
                            value={form.compteur_soneb}
                            onChange={(e) => update({ compteur_soneb: e.target.value })}
                            placeholder="Ex. 450982-A"
                            className="rounded-lg text-[12.5px] pl-8 font-mono"
                          />
                          <Droplets className="w-3.5 h-3.5 text-blue-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </Field>
                    </div>
                  </div>
                </>
              )}

              {/* ─── ÉTAPE 3 : PHOTOS ─── */}
              {step === 2 && (
                <>
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOver(false);
                      if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                      dragOver ? "border-[var(--brand-accent)] bg-[var(--brand-accent)]/5" : "border-border hover:bg-muted/30"
                    }`}
                  >
                    <ArrowUpTrayIcon className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
                    <p className="text-[13px] font-semibold text-foreground">
                      {uploading ? "Envoi des photos en cours..." : "Glissez vos photos ici ou cliquez pour parcourir"}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      JPG, PNG — La photo avec l&apos;étoile servira d&apos;image principale
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => e.target.files && handleFiles(e.target.files)}
                    />
                  </div>

                  {form.photos.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {form.photos.map((url, i) => (
                        <div
                          key={url}
                          draggable
                          onDragStart={() => (dragFromIndex.current = i)}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={() => {
                            if (dragFromIndex.current !== null && dragFromIndex.current !== i) {
                              reorderPhotos(dragFromIndex.current, i);
                            }
                            dragFromIndex.current = null;
                          }}
                          className="relative group aspect-square rounded-lg overflow-hidden border border-border cursor-move shadow-2xs"
                        >
                          <img src={url} alt="" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                          <button
                            type="button"
                            onClick={() => update({ photo_principale: url })}
                            className="absolute top-1 left-1 p-1 rounded-full bg-black/60 hover:bg-black/80 cursor-pointer"
                            title="Définir comme photo principale"
                          >
                            {form.photo_principale === url ? (
                              <StarSolid className="w-3.5 h-3.5 text-amber-400" />
                            ) : (
                              <StarIcon className="w-3.5 h-3.5 text-white" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => removePhoto(url)}
                            className="absolute top-1 right-1 p-1 rounded-full bg-black/60 hover:bg-rose-600 text-white cursor-pointer"
                          >
                            <TrashIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* ─── ÉTAPE 4 : ÉQUIPEMENTS & COMMODITÉS ─── */}
              {step === 3 && (
                <>
                  <div>
                    <p className="text-[11px] font-bold text-muted-foreground uppercase mb-2 tracking-wider">
                      Équipements &amp; Prestations
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {EQUIPEMENTS_PREDEFINIS.map((eq) => {
                        const isSelected = form.equipements.includes(eq);
                        return (
                          <button
                            key={eq}
                            type="button"
                            onClick={() => toggleEquipement(eq)}
                            className={`px-2.5 py-1.5 rounded-lg text-[12px] font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
                              isSelected
                                ? "bg-card border-slate-900 dark:border-white ring-1 ring-slate-900/10 dark:ring-white/20 text-foreground font-semibold shadow-2xs"
                                : "border-border text-muted-foreground hover:bg-muted/50"
                            }`}
                          >
                            {isSelected && <CheckIcon className="w-3 h-3 text-[var(--brand-accent)] stroke-[3]" />}
                            <span>{eq}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <Field label="Ajouter un équipement spécifique">
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={customEquipement}
                        onChange={(e) => setCustomEquipement(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addCustomEquipement();
                          }
                        }}
                        placeholder="Ex. Jacuzzi, Ascenseur privatif..."
                        className="rounded-lg text-[13px]"
                      />
                      <button
                        type="button"
                        onClick={addCustomEquipement}
                        className="px-3 py-1.5 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-foreground text-[12.5px] font-semibold rounded-lg shrink-0 border border-border cursor-pointer transition"
                      >
                        <PlusIcon className="w-4 h-4 inline mr-1" />
                        Ajouter
                      </button>
                    </div>
                  </Field>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ─── 4. FOOTER NAVIGATION ─── */}
        <div className="px-5 py-3 border-t border-border flex items-center justify-between shrink-0 bg-muted/20">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as StepIndex)}
              className="px-3.5 py-2 rounded-lg border border-border text-[12.5px] font-semibold hover:bg-muted transition cursor-pointer text-foreground"
            >
              Précédent
            </button>
          ) : (
            <div />
          )}

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              disabled={!canAdvance()}
              onClick={() => setStep((s) => (s + 1) as StepIndex)}
              className="px-4 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[12.5px] font-semibold hover:opacity-90 disabled:opacity-50 transition cursor-pointer shadow-xs"
            >
              Suivant
            </button>
          ) : (
            <button
              type="button"
              disabled={isPending}
              onClick={handleSubmit}
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[12.5px] font-semibold disabled:opacity-50 transition cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              {isPending ? (
                <>
                  <Spinner className="w-4 h-4 text-white" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <CheckIcon className="w-4 h-4 stroke-[2.5]" />
                  <span>{editBien ? "Enregistrer les modifications" : "Créer le bien"}</span>
                </>
              )}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <Label className="text-[12px] font-semibold text-foreground">{label}</Label>
      {children}
    </div>
  );
}
