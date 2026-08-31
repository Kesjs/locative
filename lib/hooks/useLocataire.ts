import { useQuery } from "@tanstack/react-query";

// Types
export interface Quittance {
  id: string;
  mois: string;
  montant: number;
  statut: "Payé" | "En attente" | "En retard";
  datePaiement?: string;
  methodePaiement?: "MTN MoMo" | "Virement" | "Espèces";
  url?: string;
}

export interface DocumentLocataire {
  id: string;
  nom: string;
  type: "Bail" | "État des lieux" | "Assurance";
  dateAjout: string;
  url: string;
}

export interface TicketMaintenance {
  id: string;
  titre: string;
  categorie: "Plomberie" | "Électricité" | "Serrurerie" | "Autre";
  statut: "Nouveau" | "En cours" | "Résolu";
  dateCreation: string;
  priorite: "Basse" | "Moyenne" | "Haute" | "Urgente";
}

export interface ContratLocataire {
  bienId: string;
  bienNom: string;
  adresse: string;
  loyerMensuel: number;
  chargesMensuelles: number;
  dateDebut: string;
  dateFin?: string;
  proprietaireNom: string;
  prochainPaiement: string;
}

// Mock Data
const MOCK_CONTRAT: ContratLocataire = {
  bienId: "B-001",
  bienNom: "Villa Les Cocotiers - Apt 2B",
  adresse: "Quartier Haie Vive, Cotonou",
  loyerMensuel: 350000,
  chargesMensuelles: 25000,
  dateDebut: "2024-01-01",
  proprietaireNom: "Patrimoine Lokka (M. Koudjo)",
  prochainPaiement: "2026-09-05",
};

const MOCK_QUITTANCES: Quittance[] = [
  { id: "Q-2026-08", mois: "Août 2026", montant: 375000, statut: "Payé", datePaiement: "2026-08-04", methodePaiement: "MTN MoMo" },
  { id: "Q-2026-07", mois: "Juillet 2026", montant: 375000, statut: "Payé", datePaiement: "2026-07-05", methodePaiement: "MTN MoMo" },
  { id: "Q-2026-06", mois: "Juin 2026", montant: 375000, statut: "Payé", datePaiement: "2026-06-03", methodePaiement: "Virement" },
];

const MOCK_DOCUMENTS: DocumentLocataire[] = [
  { id: "DOC-1", nom: "Bail de Location Signé", type: "Bail", dateAjout: "2024-01-01", url: "#" },
  { id: "DOC-2", nom: "État des lieux (Entrée)", type: "État des lieux", dateAjout: "2024-01-02", url: "#" },
  { id: "DOC-3", nom: "Attestation Assurance 2026", type: "Assurance", dateAjout: "2026-01-15", url: "#" },
];

const MOCK_TICKETS: TicketMaintenance[] = [
  { id: "T-892", titre: "Fuite d'eau sous l'évier", categorie: "Plomberie", statut: "En cours", dateCreation: "2026-08-28", priorite: "Moyenne" },
];

// Hooks
export function useContratLocataire() {
  return useQuery({
    queryKey: ["locataire", "contrat"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return MOCK_CONTRAT;
    },
  });
}

export function useQuittances() {
  return useQuery({
    queryKey: ["locataire", "quittances"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return MOCK_QUITTANCES;
    },
  });
}

export function useDocumentsLocataire() {
  return useQuery({
    queryKey: ["locataire", "documents"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return MOCK_DOCUMENTS;
    },
  });
}

export function useTicketsMaintenance() {
  return useQuery({
    queryKey: ["locataire", "tickets"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return MOCK_TICKETS;
    },
  });
}
