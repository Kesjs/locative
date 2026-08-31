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
  // Bailleur + digitaliser
  locataireEnPlaceNom?: string;
  loyerActuel?: number;
  prochaineEcheance?: string;     // ISO date

  // Bailleur + trouver_locataires
  typeBienVacant?: string;
  loyerSouhaite?: number;
  fraisVisiteEnLigne?: number;

  // Agence + digitaliser
  proprietaireMandantNom?: string;
  tauxCommission?: number;        // %
  loyerActuelMandat?: number;

  // Agence + trouver_locataires
  nomDomainePersonnalise?: string;
  fraisVisiteEnLigneAgence?: number;
}

export interface OnboardingState {
  profil: ProfilStepData;
  objectifs: Objectif[];
  saisieExpress: SaisieExpressData;
}
