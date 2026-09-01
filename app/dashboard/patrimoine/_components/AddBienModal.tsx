"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { XMarkIcon, CheckIcon, ExclamationTriangleIcon, StarIcon, TrashIcon, ArrowUpTrayIcon, PlusIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { useAddBien, useUpdateBien, uploadBienPhoto, EQUIPEMENTS_PREDEFINIS, plafondCaution, type Bien } from "@/lib/hooks/useBiens";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const STEPS = ["Identité", "Financier", "Photos", "Équipements"] as const;
type StepIndex = 0 | 1 | 2 | 3;

const TYPES_BIEN = ["Studio", "Appartement 2P", "Appartement 3P", "Appartement 4P", "Villa", "Duplex", "Chambre", "Autre"];

interface FormState {
  nom: string;
  type: string;
  adresse: string;
  ville: string;
  surface_m2: string;
  nb_pieces: string;
  loyer_mensuel: string;
  charges: string;
  caution_montant: string;
  statut: Bien["statut"];
  photos: string[];
  photo_principale: string | null;
  equipements: string[];
}

const EMPTY_FORM: FormState = {
  nom: "",
  type: "Appartement 3P",
  adresse: "",
  ville: "",
  surface_m2: "",
  nb_pieces: "",
  loyer_mensuel: "",
  charges: "",
  caution_montant: "",
  statut: "vacant",
  photos: [],
  photo_principale: null,
  equipements: [],
};

function bienToForm(bien: Bien): FormState {
  return {
    nom: bien.nom,
    type: bien.type || "Appartement 3P",
    adresse: bien.adresse || "",
    ville: bien.ville || "",
    surface_m2: bien.surface_m2 ? String(bien.surface_m2) : "",
    nb_pieces: bien.nb_pieces ? String(bien.nb_pieces) : "",
    loyer_mensuel: String(bien.loyer_mensuel || ""),
    charges: String(bien.charges || ""),
    caution_montant: bien.caution_montant ? String(bien.caution_montant) : "",
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
  const [customEquipement, setCustomEquipement] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragFromIndex = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setForm(editBien ? bienToForm(editBien) : EMPTY_FORM);
      setStep(0);
    }
  }, [isOpen, editBien]);

  if (!isOpen) return null;

  const update = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }));

  const plafond = plafondCaution(Number(form.loyer_mensuel) || 0);
  const cautionDepasse = Number(form.caution_montant) > plafond && plafond > 0;

  const canAdvance = (): boolean => {
    if (step === 0) return form.nom.trim() !== "" && form.adresse.trim() !== "" && form.ville.trim() !== "";
    if (step === 1) return form.loyer_mensuel.trim() !== "" && !cautionDepasse;
    return true;
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
      adresse: form.adresse.trim(),
      ville: form.ville.trim(),
      type: form.type,
      loyer_mensuel: Number(form.loyer_mensuel) || 0,
      charges: Number(form.charges) || 0,
      statut: form.statut,
      photos: form.photos,
      photo_principale: form.photo_principale,
      equipements: form.equipements,
      caution_montant: Number(form.caution_montant) || 0,
      surface_m2: form.surface_m2 ? Number(form.surface_m2) : null,
      nb_pieces: form.nb_pieces ? Number(form.nb_pieces) : null,
    };
    try {
      if (editBien) {
        await updateBien({ id: editBien.id, ...payload });
        toast.success("Bien mis à jour");
      } else {
        await addBien(payload as Omit<Bien, "id">);
        toast.success("Bien ajouté au patrimoine");
      }
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-card rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[92vh] sm:max-h-[85vh] flex flex-col shadow-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <h3 className="text-[16px] font-bold text-card-foreground">{editBien ? "Modifier le bien" : "Ajouter un bien"}</h3>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
            <XMarkIcon className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-5 pt-4 shrink-0">
          <div className="flex items-center gap-1.5 mb-2">
            {STEPS.map((label, i) => (
              <div key={label} className="flex-1">
                <div className={`h-1.5 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-muted"}`} />
              </div>
            ))}
          </div>
          <p className="text-[11px] font-bold text-muted-foreground uppercase">
            Étape {step + 1}/{STEPS.length} — {STEPS[step]}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.15 }}
              className="space-y-4"
            >
              {step === 0 && (
                <>
                  <Field label="Nom du bien">
                    <Input
                      autoFocus
                      type="text"
                      value={form.nom}
                      onChange={(e) => update({ nom: e.target.value })}
                      placeholder="Ex. Villa Fidjrossè Plage"
                    />
                  </Field>
                  <Field label="Type de bien">
                    <Select value={form.type} onValueChange={(v) => update({ type: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TYPES_BIEN.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Adresse">
                    <Input
                      type="text"
                      value={form.adresse}
                      onChange={(e) => update({ adresse: e.target.value })}
                      placeholder="Ex. Rue 440, Fidjrossè"
                    />
                  </Field>
                  <div className="grid grid-cols-3 gap-3">
                    <Field label="Ville" className="col-span-1">
                      <Input
                        type="text"
                        value={form.ville}
                        onChange={(e) => update({ ville: e.target.value })}
                        placeholder="Cotonou"
                      />
                    </Field>
                    <Field label="Surface (m²)" className="col-span-1">
                      <Input
                        type="number"
                        min={0}
                        value={form.surface_m2}
                        onChange={(e) => update({ surface_m2: e.target.value })}
                      />
                    </Field>
                    <Field label="Pièces" className="col-span-1">
                      <Input
                        type="number"
                        min={0}
                        value={form.nb_pieces}
                        onChange={(e) => update({ nb_pieces: e.target.value })}
                      />
                    </Field>
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Loyer mensuel (FCFA)">
                      <Input
                        type="number"
                        min={0}
                        value={form.loyer_mensuel}
                        onChange={(e) => update({ loyer_mensuel: e.target.value })}
                      />
                    </Field>
                    <Field label="Charges (FCFA)">
                      <Input
                        type="number"
                        min={0}
                        value={form.charges}
                        onChange={(e) => update({ charges: e.target.value })}
                      />
                    </Field>
                  </div>
                  <Field label="Statut">
                    <div className="flex gap-1.5">
                      {(["vacant", "loué", "travaux"] as Bien["statut"][]).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => update({ statut: s })}
                          className={`flex-1 px-3 py-2 rounded-lg text-[12.5px] font-semibold capitalize border transition-colors ${
                            form.statut === s ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-muted/50"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </Field>
                  <Field label="Caution demandée (FCFA)">
                    <Input
                      type="number"
                      min={0}
                      value={form.caution_montant}
                      onChange={(e) => update({ caution_montant: e.target.value })}
                    />
                    <div className={`mt-2 rounded-lg p-2.5 text-[12px] flex items-start gap-1.5 ${cautionDepasse ? "bg-destructive/10 text-destructive" : "bg-muted/40 text-muted-foreground"}`}>
                      {cautionDepasse && <ExclamationTriangleIcon className="w-4 h-4 shrink-0 mt-0.5" />}
                      <span>
                        Plafond légal (3× loyer) : <strong>{plafond.toLocaleString("fr-FR")} FCFA</strong>
                        {cautionDepasse && " — le montant saisi dépasse ce plafond"}
                      </span>
                    </div>
                  </Field>
                </>
              )}

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
                      dragOver ? "border-primary bg-primary/5" : "border-border hover:bg-muted/30"
                    }`}
                  >
                    <ArrowUpTrayIcon className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
                    <p className="text-[13px] font-semibold text-foreground">
                      {uploading ? "Envoi en cours..." : "Glissez des photos ici ou cliquez pour choisir"}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1">JPG, PNG — plusieurs fichiers acceptés</p>
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
                    <div className="grid grid-cols-3 gap-2.5">
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
                          className="relative group aspect-square rounded-lg overflow-hidden border border-border cursor-move"
                        >
                          <img src={url} alt="" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                          <button
                            type="button"
                            onClick={() => update({ photo_principale: url })}
                            className="absolute top-1 left-1 p-1 rounded-full bg-black/50 hover:bg-black/70"
                            title="Définir comme photo principale"
                          >
                            {form.photo_principale === url ? (
                              <StarSolid className="w-3.5 h-3.5 text-primary" />
                            ) : (
                              <StarIcon className="w-3.5 h-3.5 text-white" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => removePhoto(url)}
                            className="absolute top-1 right-1 p-1 rounded-full bg-black/50 hover:bg-destructive"
                          >
                            <TrashIcon className="w-3.5 h-3.5 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {step === 3 && (
                <>
                  <div>
                    <p className="text-[11px] font-bold text-muted-foreground uppercase mb-2">Équipements prédéfinis</p>
                    <div className="flex flex-wrap gap-1.5">
                      {EQUIPEMENTS_PREDEFINIS.map((eq) => (
                        <button
                          key={eq}
                          type="button"
                          onClick={() => toggleEquipement(eq)}
                          className={`px-2.5 py-1.5 rounded-full text-[12px] font-semibold border transition-colors ${
                            form.equipements.includes(eq)
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-border text-muted-foreground hover:bg-muted/50"
                          }`}
                        >
                          {eq}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Field label="Ajouter un équipement libre">
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
                        placeholder="Ex. Bassine collective"
                        className="flex-1"
                      />
                      <button
                        type="button"
                        onClick={addCustomEquipement}
                        className="px-3 py-2.5 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <PlusIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </Field>
                  {form.equipements.filter((e) => !EQUIPEMENTS_PREDEFINIS.includes(e)).length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {form.equipements
                        .filter((e) => !EQUIPEMENTS_PREDEFINIS.includes(e))
                        .map((eq) => (
                          <span
                            key={eq}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-primary/10 text-primary"
                          >
                            {eq}
                            <button type="button" onClick={() => toggleEquipement(eq)}>
                              <XMarkIcon className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center gap-3 px-5 py-4 border-t border-border shrink-0">
          <button
            type="button"
            onClick={() => (step === 0 ? onClose() : setStep((s) => (s - 1) as StepIndex))}
            className="px-4 py-2.5 text-[13px] font-bold text-muted-foreground hover:bg-muted/50 rounded-lg transition-colors"
          >
            {step === 0 ? "Annuler" : "Précédent"}
          </button>
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              disabled={!canAdvance()}
              onClick={() => setStep((s) => (s + 1) as StepIndex)}
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-[13px] font-bold hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Suivant
            </button>
          ) : (
            <button
              type="button"
              disabled={isPending}
              onClick={handleSubmit}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-[13px] font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              <CheckIcon className="w-4 h-4" />
              {isPending ? "Enregistrement..." : editBien ? "Enregistrer" : "Ajouter le bien"}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-[12px] font-bold text-muted-foreground mb-1.5">{label}</label>
      {children}
    </div>
  );
}
