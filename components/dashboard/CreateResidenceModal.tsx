"use client";

import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { Building2, Home } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useBiens } from "@/lib/hooks/useBiens";
import { useCreateResidence, type Residence } from "@/lib/hooks/useResidences";
import { usePatrimoineFilter } from "@/lib/patrimoineFilterContext";

const TYPES: NonNullable<Residence["type"]>[] = ["Personnel", "SCI", "Copropriété", "Autre"];

export function CreateResidenceModal({
  isOpen,
  onClose,
  onCreated,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (nom: string) => void;
}) {
  const { data: biens = [] } = useBiens();
  const { mutateAsync: createResidence, isPending } = useCreateResidence();
  const { setActiveGroup } = usePatrimoineFilter();

  const [nom, setNom] = useState("");
  const [type, setType] = useState<Residence["type"] | "">("");
  const [selectedBienIds, setSelectedBienIds] = useState<string[]>([]);

  // Biens pas encore rattachés à un groupe de patrimoine — proposés à l'assignation.
  const unassignedBiens = useMemo(
    () => biens.filter((b) => !b.groupe_patrimoine || !b.groupe_patrimoine.trim()),
    [biens]
  );

  const reset = () => {
    setNom("");
    setType("");
    setSelectedBienIds([]);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      onClose();
    }
  };

  const toggleBien = (id: string) => {
    setSelectedBienIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim()) return;
    try {
      const created = await createResidence({
        nom: nom.trim(),
        type: type || undefined,
        bienIdsToAttach: selectedBienIds,
      });
      toast.success(`Résidence « ${created.nom} » créée`, {
        description: selectedBienIds.length > 0 ? `${selectedBienIds.length} bien${selectedBienIds.length > 1 ? "s" : ""} rattaché${selectedBienIds.length > 1 ? "s" : ""}.` : undefined,
      });
      setActiveGroup(created.nom);
      onCreated?.(created.nom);
      handleOpenChange(false);
    } catch (error: any) {
      toast.error(error?.message || "Erreur lors de la création de la résidence.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-4.5 h-4.5 text-[var(--primary)]" />
            Créer une résidence
          </DialogTitle>
          <DialogDescription>
            Une résidence regroupe vos biens (ex. un immeuble, une SCI, un portefeuille) pour filtrer vos pages en un clic.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="residence-nom">Nom de la résidence</Label>
            <Input
              id="residence-nom"
              required
              autoFocus
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Ex. Résidence Les Cocotiers, SCI Familiale du Golfe..."
            />
          </div>

          <div className="space-y-1.5">
            <Label>Type (optionnel)</Label>
            <div className="flex flex-wrap gap-2">
              {TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType((prev) => (prev === t ? "" : t))}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-bold border transition cursor-pointer ${
                    type === t
                      ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                      : "bg-muted/60 text-foreground border-border hover:bg-muted"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {unassignedBiens.length > 0 && (
            <div className="space-y-1.5">
              <Label>Rattacher des biens existants (optionnel)</Label>
              <div className="max-h-44 overflow-y-auto rounded-xl border border-border divide-y divide-border">
                {unassignedBiens.map((b) => (
                  <label
                    key={b.id}
                    className="flex items-center gap-2.5 px-3 py-2 text-[12.5px] cursor-pointer hover:bg-muted/60 transition"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBienIds.includes(b.id)}
                      onChange={() => toggleBien(b.id)}
                      className="size-4 rounded border-border accent-[var(--primary)] cursor-pointer"
                    />
                    <Home className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="font-medium text-card-foreground truncate flex-1">{b.nom}</span>
                    <span className="text-[11px] text-muted-foreground shrink-0">{b.ville}</span>
                  </label>
                ))}
              </div>
              <span className="text-[11px] text-muted-foreground block">
                Tu peux valider sans rien cocher et rattacher des biens plus tard depuis leur fiche.
              </span>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isPending || !nom.trim()}>
              {isPending ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Création...
                </>
              ) : (
                "Créer la résidence"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
