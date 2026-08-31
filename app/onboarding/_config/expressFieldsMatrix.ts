import type { ProfileType, Objectif } from "../_types";

export interface ExpressField {
  key: string;              // clé dans SaisieExpressData
  label: string;
  type: "text" | "number" | "date";
  placeholder?: string;
  suffix?: string;          // ex: "FCFA", "%"
}

type MatrixKey = `${ProfileType}:${Objectif}`;

export const EXPRESS_FIELDS_MATRIX: Record<MatrixKey, ExpressField[]> = {
  "bailleur:digitaliser": [
    { key: "locataireEnPlaceNom", label: "Nom du locataire en place", type: "text", placeholder: "Ex: Koudjo Dossou" },
    { key: "loyerActuel", label: "Montant du loyer", type: "number", suffix: "FCFA" },
    { key: "prochaineEcheance", label: "Date de la prochaine échéance", type: "date" },
  ],
  "bailleur:trouver_locataires": [
    { key: "typeBienVacant", label: "Type de bien vacant", type: "text", placeholder: "Ex: Villa 3 chambres" },
    { key: "loyerSouhaite", label: "Loyer souhaité", type: "number", suffix: "FCFA" },
    { key: "fraisVisiteEnLigne", label: "Frais de visite en ligne", type: "number", suffix: "FCFA" },
  ],
  "agence:digitaliser": [
    { key: "proprietaireMandantNom", label: "Nom du propriétaire (mandant)", type: "text" },
    { key: "tauxCommission", label: "Taux de commission prélevé", type: "number", suffix: "%" },
    { key: "loyerActuelMandat", label: "Loyer actuel du locataire", type: "number", suffix: "FCFA" },
  ],
  "agence:trouver_locataires": [
    { key: "nomDomainePersonnalise", label: "Nom de domaine pour votre vitrine", type: "text", placeholder: "Ex: monagence" },
    { key: "fraisVisiteEnLigneAgence", label: "Frais de visite en ligne", type: "number", suffix: "FCFA" },
  ],
};

export function getExpressFields(profileType: ProfileType, objectifs: Objectif[]): ExpressField[] {
  const seen = new Set<string>();
  const fields: ExpressField[] = [];
  for (const obj of objectifs) {
    const key = `${profileType}:${obj}` as MatrixKey;
    for (const f of EXPRESS_FIELDS_MATRIX[key] ?? []) {
      if (!seen.has(f.key)) {
        seen.add(f.key);
        fields.push(f);
      }
    }
  }
  return fields;
}
