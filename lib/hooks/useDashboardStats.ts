import { useQuery } from "@tanstack/react-query";
import { useBiens } from "./useBiens";
import { useLeases } from "./useLocataires";
import { useLoyers } from "./useLoyers";

export interface DashboardStats {
  totalRevenusMois: number;
  tauxRecouvrement: number;
  tauxOccupation: number;
  totalBiens: number;
  biensOccupes: number;
  totalLocataires: number;
  loyersEnAttente: number;
}

export function useDashboardStats() {
  const { data: biens = [] } = useBiens();
  const { data: leases = [] } = useLeases();
  const { data: loyers = [] } = useLoyers();
  const locatairesActifs = leases.filter((l) => l.is_active);

  return useQuery({
    queryKey: ["dashboard_stats", biens.length, locatairesActifs.length, loyers.length],
    queryFn: async (): Promise<DashboardStats> => {
      const totalBiens = biens.length;
      const biensOccupes = biens.filter((b) => b.statut === "loué").length;
      const tauxOccupation = totalBiens > 0 ? Math.round((biensOccupes / totalBiens) * 100) : 100;

      const loyersPayes = loyers.filter((l) => l.statut === "payé");
      const totalRevenusMois = loyersPayes.reduce((acc, curr) => acc + curr.montant, 0);

      const totalAttendu = loyers.reduce((acc, curr) => acc + curr.montant, 0);
      const tauxRecouvrement = totalAttendu > 0 ? Math.round((totalRevenusMois / totalAttendu) * 100) : 98;

      const loyersEnAttente = loyers
        .filter((l) => l.statut === "en_attente" || l.statut === "retard")
        .reduce((acc, curr) => acc + curr.montant, 0);

      return {
        totalRevenusMois,
        tauxRecouvrement,
        tauxOccupation,
        totalBiens,
        biensOccupes,
        totalLocataires: locatairesActifs.length,
        loyersEnAttente,
      };
    },
    staleTime: 1000 * 60 * 2, // 2 mins
  });
}
