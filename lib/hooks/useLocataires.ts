import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { Bien } from "@/lib/hooks/useBiens";

export interface Tenant {
  id: string;
  full_name: string;
  phone_number: string;
  whatsapp_number?: string | null;
  email?: string | null;
  id_card_type?: string | null;
  id_card_number?: string | null;
  profession?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  created_at?: string;
}

export interface Lease {
  id: string;
  bien_id: string;
  tenant_id: string;
  start_date: string;
  end_date?: string | null;
  rent_amount: number;
  charges_amount?: number | null;
  deposit_months: number;
  deposit_amount: number;
  due_day: number;
  is_active: boolean;
  lease_contract_url?: string | null;
  balance_due: number;
  created_at?: string;
}

// Vue combinée utilisée par la liste et le drawer
export interface LeaseWithDetails extends Lease {
  tenant: Tenant;
  bien: Bien | null;
}

export interface RentLedgerEntry {
  id: string;
  lease_id: string;
  bien_id: string;
  type: "loyer_du" | "charges_dues" | "paiement" | "ajustement";
  amount: number;
  balance_after?: number | null;
  created_at?: string;
}

export interface Receipt {
  id: string;
  lease_id: string;
  tenant_id: string;
  period: string;
  amount: number;
  issued_at?: string | null;
  reference?: string | null;
}

const LOCAL_LEASES_KEY = "lokka_leases_cache";
const LOCAL_LEDGER_KEY = "lokka_ledger_cache";
const LOCAL_RECEIPTS_KEY = "lokka_receipts_cache";

const JOUR_MS = 1000 * 60 * 60 * 24;

// ─── Calculs utilitaires ─────────────────────────────────────────

export function joursAvantEcheanceBail(endDate?: string | null): number | null {
  if (!endDate) return null;
  const end = new Date(endDate).getTime();
  const now = Date.now();
  return Math.ceil((end - now) / JOUR_MS);
}

export function statutPaiement(balanceDue: number): "a_jour" | "retard" | "avance" {
  if (balanceDue > 0) return "retard";
  if (balanceDue < 0) return "avance";
  return "a_jour";
}

function getLocalLeases(): LeaseWithDetails[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_LEASES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalLeases(leases: LeaseWithDetails[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_LEASES_KEY, JSON.stringify(leases));
  } catch {}
}

export function useLeases() {
  return useQuery({
    queryKey: ["leases"],
    queryFn: async (): Promise<LeaseWithDetails[]> => {
      if (!isSupabaseConfigured()) {
        return getLocalLeases();
      }
      const supabase = createClient();
      try {
        const { data, error } = await supabase
          .from("leases")
          .select("*, tenant:tenants(*), bien:biens(*)")
          .order("created_at", { ascending: false });

        // Le cache local (lokka_leases_cache) est un filet de secours pour
        // le mode hors-ligne uniquement. On ne le fusionne JAMAIS avec une
        // réponse serveur réussie : ce cache n'est pas lié au compte
        // connecté, et le fusionner mélangeait les données d'un compte
        // précédemment utilisé sur cet appareil avec celles du compte
        // réellement connecté.
        if (error) {
          return getLocalLeases();
        }

        return (data as LeaseWithDetails[]) || [];
      } catch {
        return getLocalLeases();
      }
    },
  });
}

// Crée le locataire + le bail en une opération, ou le locataire seul si pas de logement immédiat
export function useAddTenantWithLease() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      tenant: Omit<Tenant, "id">;
      lease?: Partial<Omit<Lease, "id" | "tenant_id" | "is_active" | "balance_due">> & { bien_id?: string };
    }) => {
      const tenantId = "ten_" + Date.now().toString(36);
      const createdTenant: Tenant = {
        ...payload.tenant,
        id: tenantId,
        created_at: new Date().toISOString(),
      };

      const hasBien = Boolean(payload.lease?.bien_id);
      const leaseId = "lease_" + Date.now().toString(36);

      const createdLeaseWithDetails: LeaseWithDetails = {
        id: leaseId,
        bien_id: payload.lease?.bien_id || "",
        tenant_id: tenantId,
        start_date: payload.lease?.start_date || new Date().toISOString().split("T")[0],
        end_date: payload.lease?.end_date || null,
        rent_amount: Number(payload.lease?.rent_amount) || 0,
        charges_amount: Number(payload.lease?.charges_amount) || 0,
        deposit_months: Number(payload.lease?.deposit_months) || 3,
        deposit_amount: Number(payload.lease?.deposit_amount) || (Number(payload.lease?.rent_amount) || 0) * 3,
        due_day: Number(payload.lease?.due_day) || 5,
        is_active: hasBien,
        lease_contract_url: payload.lease?.lease_contract_url || null,
        balance_due: 0,
        created_at: new Date().toISOString(),
        tenant: createdTenant,
        bien: null,
      };

      if (!isSupabaseConfigured()) {
        const local = getLocalLeases();
        saveLocalLeases([createdLeaseWithDetails, ...local]);
        return createdLeaseWithDetails;
      }

      const supabase = createClient();
      try {
        const { data: tenant, error: tenantError } = await supabase
          .from("tenants")
          .insert([payload.tenant])
          .select()
          .single();

        if (tenantError) {
          throw new Error(`Erreur lors de la création du locataire: ${tenantError.message}`);
        }

        if (hasBien) {
          const { data: lease, error: leaseError } = await supabase
            .from("leases")
            .insert([{ ...payload.lease, tenant_id: tenant.id, is_active: true }])
            .select()
            .single();

          if (leaseError) {
            throw new Error(`Erreur lors de la création du bail: ${leaseError.message}`);
          }

          // Synchronise le statut du bien
          await supabase
            .from("biens")
            .update({ statut: "loué", locataire_nom: tenant.full_name })
            .eq("id", payload.lease!.bien_id);

          const fullLease = { ...lease, tenant, bien: null };
          const local = getLocalLeases();
          saveLocalLeases([fullLease, ...local]);
          return fullLease;
        }

        const fullLeaseWithoutBien = { ...createdLeaseWithDetails, tenant };
        const local = getLocalLeases();
        saveLocalLeases([fullLeaseWithoutBien, ...local]);
        return fullLeaseWithoutBien;
      } catch (err: any) {
        throw new Error(err?.message || "Impossible de créer le bail et le locataire.");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leases"] });
      queryClient.invalidateQueries({ queryKey: ["biens"] });
    },
  });
}

// Met à jour la fiche d'un locataire existant (complétion post-onboarding : téléphone, pièce d'identité...)
export function useUpdateTenant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...patch }: Partial<Tenant> & { id: string }) => {
      if (!isSupabaseConfigured()) {
        const local = getLocalLeases();
        const updated = local.map((l) =>
          l.tenant?.id === id ? { ...l, tenant: { ...l.tenant, ...patch } } : l
        );
        saveLocalLeases(updated as LeaseWithDetails[]);
        return { id, ...patch } as Tenant;
      }

      const supabase = createClient();
      const { data, error } = await supabase.from("tenants").update(patch).eq("id", id).select().single();
      if (error) {
        throw new Error(`Erreur lors de la mise à jour du locataire: ${error.message}`);
      }

      // Si le nom change, on resynchronise le cache d'affichage sur le(s) bien(s) de son bail actif
      if (patch.full_name) {
        const { data: activeLeases } = await supabase
          .from("leases")
          .select("bien_id")
          .eq("tenant_id", id)
          .eq("is_active", true);
        const bienIds = (activeLeases || []).map((l) => l.bien_id).filter(Boolean);
        if (bienIds.length > 0) {
          await supabase.from("biens").update({ locataire_nom: patch.full_name }).in("id", bienIds);
        }
      }

      return data as Tenant;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leases"] });
      queryClient.invalidateQueries({ queryKey: ["biens"] });
    },
  });
}

// Résilie un bail et repasse le bien en vacant
export function useTerminateLease() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ leaseId, bienId }: { leaseId: string; bienId: string }) => {
      const local = getLocalLeases();
      const updated = local.map((l) =>
        l.id === leaseId ? { ...l, is_active: false, end_date: new Date().toISOString().split("T")[0] } : l
      );
      saveLocalLeases(updated);

      if (!isSupabaseConfigured()) {
        return { id: leaseId };
      }
      const supabase = createClient();
      try {
        await supabase
          .from("leases")
          .update({ is_active: false, end_date: new Date().toISOString().split("T")[0] })
          .eq("id", leaseId);

        if (bienId) {
          await supabase.from("biens").update({ statut: "vacant", locataire_nom: null }).eq("id", bienId);
        }
        return { id: leaseId };
      } catch {
        return { id: leaseId };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leases"] });
      queryClient.invalidateQueries({ queryKey: ["biens"] });
    },
  });
}

// Renouvelle un bail avec une nouvelle date de fin
export function useRenewLease() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ leaseId, newEndDate }: { leaseId: string; newEndDate: string }) => {
      const local = getLocalLeases();
      const updated = local.map((l) => (l.id === leaseId ? { ...l, end_date: newEndDate } : l));
      saveLocalLeases(updated);

      if (!isSupabaseConfigured()) {
        return { id: leaseId, newEndDate };
      }
      const supabase = createClient();
      try {
        const { data, error } = await supabase
          .from("leases")
          .update({ end_date: newEndDate })
          .eq("id", leaseId)
          .select()
          .single();
        if (error) return { id: leaseId, newEndDate };
        return data;
      } catch {
        return { id: leaseId, newEndDate };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leases"] });
    },
  });
}

// Livre des loyers (Ledger)
export function useRentLedger(leaseId?: string) {
  return useQuery({
    queryKey: ["rent_ledger", leaseId],
    enabled: Boolean(leaseId),
    queryFn: async (): Promise<RentLedgerEntry[]> => {
      if (!leaseId) return [];
      if (!isSupabaseConfigured()) {
        return [];
      }
      const supabase = createClient();
      try {
        const { data, error } = await supabase
          .from("rent_ledger")
          .select("*")
          .eq("lease_id", leaseId)
          .order("created_at", { ascending: false });
        if (error) return [];
        return (data as RentLedgerEntry[]) || [];
      } catch {
        return [];
      }
    },
  });
}

// Enregistre un règlement de loyer
export function useRecordPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      lease_id: string;
      bien_id: string;
      amount: number;
      payment_method: string;
      notes?: string;
    }) => {
      if (!isSupabaseConfigured()) {
        return { success: true };
      }
      const supabase = createClient();
      try {
        const { data, error } = await supabase.from("rent_ledger").insert([
          {
            lease_id: payload.lease_id,
            bien_id: payload.bien_id,
            type: "paiement",
            amount: payload.amount,
          },
        ]);
        if (error) return { success: true };
        return data;
      } catch {
        return { success: true };
      }
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["rent_ledger", vars.lease_id] });
      queryClient.invalidateQueries({ queryKey: ["leases"] });
    },
  });
}

// Quittances d'un bail
export function useReceipts(leaseId?: string) {
  return useQuery({
    queryKey: ["receipts", leaseId],
    enabled: Boolean(leaseId),
    queryFn: async (): Promise<Receipt[]> => {
      if (!leaseId) return [];
      if (!isSupabaseConfigured()) {
        return [];
      }
      const supabase = createClient();
      try {
        const { data, error } = await supabase
          .from("receipts")
          .select("*")
          .eq("lease_id", leaseId)
          .order("issued_at", { ascending: false });
        if (error) return [];
        return (data as Receipt[]) || [];
      } catch {
        return [];
      }
    },
  });
}

// Crée une quittance de loyer
export function useCreateReceipt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<Receipt, "id">) => {
      if (!isSupabaseConfigured()) {
        return { ...payload, id: Date.now().toString() };
      }
      const supabase = createClient();
      try {
        const { data, error } = await supabase.from("receipts").insert([payload]).select().single();
        if (error) return { ...payload, id: Date.now().toString() };
        return data;
      } catch {
        return { ...payload, id: Date.now().toString() };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receipts"] });
      queryClient.invalidateQueries({ queryKey: ["loyers"] });
    },
  });
}
