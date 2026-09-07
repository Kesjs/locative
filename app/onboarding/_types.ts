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

export interface LotItem {
  id: string;
  nom: string;                 // ex: "Chambre 1", "Appartement A", "Studio 1"
  type?: string;               // ex: "Chambre salon", "Appartement 3P", "Studio"
  loyer: number;               // ex: 75000
  statut: "loue" | "vacant";   // "loue" ou "vacant"
  locataireNom?: string;       // ex: "Koffi Mensah" (si loue)
}

export interface SaisieExpressData {
  // Hiérarchie Patrimoine & Multi-Lots (Bailleur & Agence)
  nomPatrimoine?: string;         // Ex: "Résidence Les Cocotiers", "Villa Haie Vive"
  typePatrimoine?: "concession" | "immeuble" | "villa" | "commercial"; // Type d'ensemble
  nombreLots?: number;            // Nombre de lots/chambres dans l'ensemble
  lots?: LotItem[];               // Liste des lots configurés avec statut et locataire

  // Bailleur (mono-lot ou synthèse)
  typeLot?: string;               // Ex: "Appartement 3 pièces", "Villa complète", "Studio"
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
