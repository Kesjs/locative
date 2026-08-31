import { useQuery } from "@tanstack/react-query";

export interface AdminStatistiques {
  totalAgences: number;
  totalBailleurs: number;
  totalLocataires: number;
  transactionsMois: number;
  revenusLokka: number;
}

export interface Utilisateur {
  id: string;
  nom: string;
  email: string;
  role: "Agence" | "Bailleur" | "Locataire";
  statut: "Actif" | "Inactif" | "Bloqué";
  dateInscription: string;
}

export interface Abonnement {
  id: string;
  agence: string;
  plan: "Pro" | "Entreprise" | "Diaspora";
  statut: "Actif" | "Expiré" | "Impayé";
  dateFin: string;
  montant: number;
}

const MOCK_STATS: AdminStatistiques = {
  totalAgences: 145,
  totalBailleurs: 890,
  totalLocataires: 4289,
  transactionsMois: 124500000,
  revenusLokka: 1245000,
};

const MOCK_UTILISATEURS: Utilisateur[] = [
  { id: "U-01", nom: "Agence Immo Plus", email: "contact@immoplus.bj", role: "Agence", statut: "Actif", dateInscription: "2024-01-10" },
  { id: "U-02", nom: "Patrimoine Lokka", email: "koudjo@lokka.bj", role: "Bailleur", statut: "Actif", dateInscription: "2024-02-15" },
  { id: "U-03", nom: "Marc Dossou", email: "marc@example.com", role: "Locataire", statut: "Actif", dateInscription: "2025-05-20" },
  { id: "U-04", nom: "Global Estate", email: "contact@globalestate.bj", role: "Agence", statut: "Bloqué", dateInscription: "2023-11-05" },
];

const MOCK_ABONNEMENTS: Abonnement[] = [
  { id: "SUB-01", agence: "Agence Immo Plus", plan: "Pro", statut: "Actif", dateFin: "2026-12-31", montant: 25000 },
  { id: "SUB-02", agence: "Century 21 Bénin", plan: "Entreprise", statut: "Actif", dateFin: "2026-10-15", montant: 50000 },
  { id: "SUB-03", agence: "Global Estate", plan: "Pro", statut: "Impayé", dateFin: "2026-07-01", montant: 25000 },
];

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return MOCK_STATS;
    },
  });
}

export function useAdminUtilisateurs() {
  return useQuery({
    queryKey: ["admin", "utilisateurs"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return MOCK_UTILISATEURS;
    },
  });
}

export function useAdminAbonnements() {
  return useQuery({
    queryKey: ["admin", "abonnements"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return MOCK_ABONNEMENTS;
    },
  });
}
