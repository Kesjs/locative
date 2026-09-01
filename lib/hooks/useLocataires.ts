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

const JOUR_MS = 1000 * 60 * 60 * 24;

// ─── Baux (avec locataire + bien joints) ─────────────────────────

export function useLeases() {
  return useQuery({
    queryKey: ["leases"],
    queryFn: async (): Promise<LeaseWithDetails[]> => {
      if (!isSupabaseConfigured()) {
        return [];
      }
      const supabase = createClient();
      const { data, error } = await supabase
        .from("leases")
        .select("*, tenant:tenants(*), bien:biens(*)")
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Supabase fetch error (leases):", error.message);
        return [];
      }
      return (data as LeaseWithDetails[]) || [];
    },
  });
}

// Crée le locataire + le bail en une opération, et synchronise le statut du bien
export function useAddTenantWithLease() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      tenant: Omit<Tenant, "id">;
      lease: Omit<Lease, "id" | "tenant_id" | "is_active" | "balance_due">;
    }) => {
      if (!isSupabaseConfigured()) {
        return { id: Date.now().toString() };
      }
      const supabase = createClient();

      const { data: tenant, error: tenantError } = await supabase
        .from("tenants")
        .insert([payload.tenant])
        .select()
        .single();
      if (tenantError) throw tenantError;

      const { data: lease, error: leaseError } = await supabase
        .from("leases")
        .insert([{ ...payload.lease, tenant_id: tenant.id, is_active: true }])
        .select()
        .single();
      if (leaseError) throw leaseError;

      // Synchronise le bien : passe en "loué" avec le nom du locataire
      await supabase
        .from("biens")
        .update({ statut: "loué", locataire_nom: tenant.full_name })
        .eq("id", payload.lease.bien_id);

      return lease;
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
      if (!isSupabaseConfigured()) {
        return { id: leaseId };
      }
      const supabase = createClient();
      const { error: leaseError } = await supabase
        .from("leases")
        .update({ is_active: false, end_date: new Date().toISOString().split("T")[0] })
        .eq("id", leaseId);
      if (leaseError) throw leaseError;

      await supabase.from("biens").update({ statut: "vacant", locataire_nom: null }).eq("id", bienId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leases"] });
      queryClient.invalidateQueries({ queryKey: ["biens"] });
    },
  });
}

// Renouvelle un bail (nouvelle date de fin)
export function useRenewLease() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ leaseId, endDate }: { leaseId: string; endDate: string }) => {
      if (!isSupabaseConfigured()) {
        return { id: leaseId };
      }
      const supabase = createClient();
      const { error } = await supabase.from("leases").update({ end_date: endDate, is_active: true }).eq("id", leaseId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leases"] });
    },
  });
}

// ─── Grand livre (paiements) ──────────────────────────────────────

export function useRentLedger(leaseId?: string) {
  return useQuery({
    queryKey: ["rent_ledger", leaseId],
    enabled: !!leaseId,
    queryFn: async (): Promise<RentLedgerEntry[]> => {
      if (!isSupabaseConfigured() || !leaseId) return [];
      const supabase = createClient();
      const { data, error } = await supabase
        .from("rent_ledger")
        .select("*")
        .eq("lease_id", leaseId)
        .order("created_at", { ascending: false });
      if (error) {
        console.warn("Supabase fetch error:", error);
        return [];
      }
      return (data as RentLedgerEntry[]) || [];
    },
  });
}

// Enregistre un paiement : insère une ligne "paiement" dans le grand livre,
// recalcule le solde du bail, et génère une quittance.
export function useRecordPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      lease,
      amount,
      period,
    }: {
      lease: Lease;
      amount: number;
      period: string;
    }) => {
      if (!isSupabaseConfigured()) {
        return { id: Date.now().toString() };
      }
      const supabase = createClient();
      const newBalance = (lease.balance_due || 0) - amount;

      const { error: ledgerError } = await supabase.from("rent_ledger").insert([
        {
          lease_id: lease.id,
          bien_id: lease.bien_id,
          type: "paiement",
          amount,
          balance_after: newBalance,
        },
      ]);
      if (ledgerError) throw ledgerError;

      const { error: leaseError } = await supabase.from("leases").update({ balance_due: newBalance }).eq("id", lease.id);
      if (leaseError) throw leaseError;

      const { error: receiptError } = await supabase.from("receipts").insert([
        {
          lease_id: lease.id,
          tenant_id: lease.tenant_id,
          period,
          amount,
          issued_at: new Date().toISOString(),
          reference: `QT-${Date.now().toString().slice(-8)}`,
        },
      ]);
      if (receiptError) throw receiptError;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["rent_ledger", variables.lease.id] });
      queryClient.invalidateQueries({ queryKey: ["leases"] });
      queryClient.invalidateQueries({ queryKey: ["receipts", variables.lease.id] });
    },
  });
}

export function useReceipts(leaseId?: string) {
  return useQuery({
    queryKey: ["receipts", leaseId],
    enabled: !!leaseId,
    queryFn: async (): Promise<Receipt[]> => {
      if (!isSupabaseConfigured() || !leaseId) return [];
      const supabase = createClient();
      const { data, error } = await supabase
        .from("receipts")
        .select("*")
        .eq("lease_id", leaseId)
        .order("issued_at", { ascending: false });
      if (error) {
        console.warn("Supabase fetch error:", error);
        return [];
      }
      return (data as Receipt[]) || [];
    },
  });
}

// ─── Helpers ───────────────────────────────────────────────────────

export function joursAvantEcheanceBail(lease: Lease): number | null {
  if (!lease.end_date) return null;
  return Math.round((new Date(lease.end_date).getTime() - Date.now()) / JOUR_MS);
}

export function statutPaiement(lease: Lease): "à jour" | "retard" {
  return (lease.balance_due || 0) > 0 ? "retard" : "à jour";
}
