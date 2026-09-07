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
    { key: "nomPatrimoine", label: "Nom du patrimoine ou ensemble", type: "text", placeholder: "Ex: Résidence Les Cocotiers, Immeuble Haie Vive" },
    { key: "typeLot", label: "Premier lot / Type de bien", type: "text", placeholder: "Ex: Appartement 3 pièces (Lot 12), Villa" },
    { key: "loyerMensuel", label: "Loyer mensuel du lot", type: "number", suffix: "FCFA", placeholder: "Ex: 250 000" },
    { key: "locataireEnPlaceNom", label: "Nom du locataire en place", type: "text", placeholder: "Ex: Claudine Mensah" },
  ],
  "bailleur:trouver_locataires": [
    { key: "nomPatrimoine", label: "Nom du patrimoine ou ensemble", type: "text", placeholder: "Ex: Résidence Les Cocotiers, Villa Cadjèhoun" },
    { key: "typeLot", label: "Premier lot vacant à louer", type: "text", placeholder: "Ex: Appartement 3 pièces, Studio meublé" },
    { key: "loyerMensuel", label: "Loyer mensuel souhaité", type: "number", suffix: "FCFA", placeholder: "Ex: 200 000" },
  ],
  "agence:digitaliser": [
    { key: "proprietaireMandantNom", label: "Propriétaire mandant", type: "text", placeholder: "Ex: M. Mensah, Dr. Akakpo" },
    { key: "nomPatrimoine", label: "Immeuble ou résidence sous mandat", type: "text", placeholder: "Ex: Résidence Marina, Immeuble Ganhi" },
    { key: "typeLot", label: "Premier lot sous mandat", type: "text", placeholder: "Ex: Appartement B2 (3 pièces)" },
    { key: "loyerActuelMandat", label: "Loyer mensuel du lot", type: "number", suffix: "FCFA", placeholder: "Ex: 350 000" },
  ],
  "agence:trouver_locataires": [
    { key: "proprietaireMandantNom", label: "Propriétaire mandant", type: "text", placeholder: "Ex: M. Mensah" },
    { key: "nomPatrimoine", label: "Immeuble ou lot sous mandat", type: "text", placeholder: "Ex: Résidence Les Palmiers" },
    { key: "typeLot", label: "Désignation du lot vacant", type: "text", placeholder: "Ex: Bureau 80m²" },
    { key: "loyerActuelMandat", label: "Loyer mensuel demandé", type: "number", suffix: "FCFA", placeholder: "Ex: 400 000" },
  ],
};

export function getExpressFields(profileType: ProfileType, objectifs: Objectif[]): ExpressField[] {
  const seen = new Set<string>();
  const fields: ExpressField[] = [];
  const effectiveObjs = objectifs.length > 0 ? objectifs : ["digitaliser" as Objectif];
  for (const obj of effectiveObjs) {
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
