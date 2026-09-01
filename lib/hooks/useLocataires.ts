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
const LOCAL_TENANTS_KEY = "lokka_tenants_cache";

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
      const local = getLocalLeases();

      if (!isSupabaseConfigured()) {
        return local;
      }
      const supabase = createClient();
      try {
        const { data, error } = await supabase
          .from("leases")
          .select("*, tenant:tenants(*), bien:biens(*)")
          .order("created_at", { ascending: false });

        if (error) {
          return local;
        }

        const supaLeases = (data as LeaseWithDetails[]) || [];
        const combined = [...supaLeases];
        for (const loc of local) {
          if (!combined.some((l) => l.id === loc.id)) {
            combined.push(loc);
          }
        }
        return combined;
      } catch {
        return local;
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

      // Toujours enregistrer localement pour la résilience instantanée
      const local = getLocalLeases();
      saveLocalLeases([createdLeaseWithDetails, ...local]);

      if (!isSupabaseConfigured()) {
        return createdLeaseWithDetails;
      }

      const supabase = createClient();
      try {
        const { data: tenant, error: tenantError } = await supabase
          .from("tenants")
          .insert([payload.tenant])
          .select()
          .single();

        if (tenantError) return createdLeaseWithDetails;

        if (hasBien) {
          const { data: lease, error: leaseError } = await supabase
            .from("leases")
            .insert([{ ...payload.lease, tenant_id: tenant.id, is_active: true }])
            .select()
            .single();

          if (leaseError) return createdLeaseWithDetails;

          // Synchronise le statut du bien
          await supabase
            .from("biens")
            .update({ statut: "loué", locataire_nom: tenant.full_name })
            .eq("id", payload.lease!.bien_id);

          return lease;
        }

        return createdLeaseWithDetails;
      } catch (err) {
        return createdLeaseWithDetails;
      }
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
