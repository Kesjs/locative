export type ProfileType = "bailleur" | "agence";

export type Objectif = "digitaliser" | "trouver_locataires";

export interface ProfilStepData {
  profileType: ProfileType;
  nom: string;                    // Nom (bailleur) ou Raison sociale (agence)
  moyenReception: "mobile_money" | "banque";
  mobileProvider?: "mtn" | "moov" | "celtiis";
  zoneGeo: "benin" | "diaspora";
  paysDiaspora?: string;          // si zoneGeo === "diaspora"
}

export interface SaisieExpressData {
  // Hiérarchie Patrimoine & Lot (Bailleur & Agence)
  nomPatrimoine?: string;         // Ex: "Résidence Les Cocotiers", "Villa Haie Vive"
  typeLot?: string;               // Ex: "Appartement 3 pièces", "Villa complète", "Studio"

  // Bailleur
  loyerMensuel?: number;          // Montant du loyer en FCFA
  statutOccupation?: "loue" | "vacant";
  locataireEnPlaceNom?: string;   // Nom du locataire si loué
  prochaineEcheance?: string;     // Date de prochaine échéance

  // Agence
  proprietaireMandantNom?: string; // Nom du mandant
  loyerActuelMandat?: number;      // Loyer mensuel sous mandat

  // Rétrocompatibilité
  loyerActuel?: number;
  loyerSouhaite?: number;
  typeBienVacant?: string;
  nomDomainePersonnalise?: string;
}

export interface OnboardingState {
  profil: ProfilStepData;
  objectifs: Objectif[];
  saisieExpress: SaisieExpressData;
}
