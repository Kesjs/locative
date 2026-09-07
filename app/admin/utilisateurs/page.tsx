"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  MagnifyingGlassIcon,
  UsersIcon,
  ShieldCheckIcon,
  PencilSquareIcon,
  CheckIcon,
  XMarkIcon,
  BuildingOffice2Icon,
  UserIcon,
} from "@heroicons/react/24/outline";

interface ProfileItem {
  id: string;
  email?: string;
  full_name?: string;
  role?: string;
  phone_number?: string;
  preferred_payment_channel?: string;
  onboarding_completed?: boolean;
  created_at?: string;
}

export default function AdminUtilisateursPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [editingUser, setEditingUser] = useState<ProfileItem | null>(null);
  const [newRole, setNewRole] = useState<string>("");

  const { data: users = [], isLoading } = useQuery<ProfileItem[]>({
    queryKey: ["admin-all-profiles"],
    queryFn: async () => {
      if (!isSupabaseConfigured()) {
        return [];
      }
      const supabase = createClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, full_name, role, phone_number, preferred_payment_channel, onboarding_completed, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erreur récupération profils:", error);
        return [];
      }
      return data || [];
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .update({ role, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      return { id, role };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-all-profiles"] });
      queryClient.invalidateQueries({ queryKey: ["admin-live-stats"] });
      toast.success(`Rôle mis à jour en "${variables.role}" avec succès !`);
      setEditingUser(null);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Erreur lors du changement de rôle.");
    },
  });

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        !search.trim() ||
        (u.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
        (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
        (u.phone_number || "").includes(search);

      if (!matchesSearch) return false;

      if (roleFilter === "all") return true;
      if (roleFilter === "bailleur") return u.role === "owner" || u.role === "bailleur" || !u.role;
      if (roleFilter === "agence") return u.role === "agence" || u.role === "agency_admin";
      if (roleFilter === "locataire") return u.role === "tenant" || u.role === "locataire";
      if (roleFilter === "admin") return u.role === "admin" || u.role === "super_admin";
      return true;
    });
  }, [users, search, roleFilter]);

  const handleOpenEdit = (user: ProfileItem) => {
    setEditingUser(user);
    setNewRole(user.role || "owner");
  };

  const handleSaveRole = () => {
    if (!editingUser) return;
    updateRoleMutation.mutate({ id: editingUser.id, role: newRole });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-extrabold text-slate-900 tracking-tight">
            Gestion des Utilisateurs &amp; Rôles
          </h1>
          <p className="text-[13px] text-slate-600 mt-0.5">
            Consultez, modifiez les privilèges et supervisez l&apos;ensemble des comptes enregistrés sur Lokka.
          </p>
        </div>
        <span className="px-3 py-1.5 rounded-full text-[12px] font-bold bg-white border border-slate-200 text-slate-700 shadow-2xs self-start sm:self-auto">
          {users.length} compte{users.length > 1 ? "s" : ""} enregistré{users.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* Barre d'outils : Recherche & Filtres */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, email ou téléphone..."
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[12.5px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
          />
        </div>

        {/* Onglets Filtres */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "Tous" },
            { id: "bailleur", label: "Bailleurs" },
            { id: "agence", label: "Agences" },
            { id: "locataire", label: "Locataires" },
            { id: "admin", label: "Admins" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setRoleFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition cursor-pointer shrink-0 ${
                roleFilter === tab.id
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table des Utilisateurs */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400">Chargement des utilisateurs...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-[13px]">
            Aucun utilisateur ne correspond à votre recherche.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12.5px]">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10.5px]">
                <tr>
                  <th className="py-3 px-4">Utilisateur / Raison Sociale</th>
                  <th className="py-3 px-4">Email &amp; Contact</th>
                  <th className="py-3 px-4">Rôle Plateforme</th>
                  <th className="py-3 px-4">Mode Réception</th>
                  <th className="py-3 px-4">Inscription</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => {
                  const roleNormalized = (u.role || "owner").toLowerCase();
                  const isAgency = roleNormalized.includes("agence");
                  const isSuperAdmin = roleNormalized.includes("admin");
                  const isLocataire = roleNormalized.includes("tenant") || roleNormalized.includes("locataire");

                  const badgeClass = isSuperAdmin
                    ? "bg-purple-50 text-purple-700 border-purple-200"
                    : isAgency
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : isLocataire
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200";

                  const roleLabel = isSuperAdmin
                    ? "Super Admin"
                    : isAgency
                    ? "Agence Agréée"
                    : isLocataire
                    ? "Locataire"
                    : "Bailleur Privé";

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 font-extrabold text-[11px]">
                            {(u.full_name || "U").slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="truncate max-w-[180px]">{u.full_name || "Nom non défini"}</p>
                            {u.onboarding_completed && (
                              <span className="text-[9.5px] font-semibold text-emerald-600">
                                Onboarding validé
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-mono text-slate-700 truncate max-w-[200px]">{u.email || "—"}</p>
                        {u.phone_number && (
                          <p className="text-[11px] text-slate-500">{u.phone_number}</p>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase border ${badgeClass}`}>
                          {roleLabel}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {u.preferred_payment_channel === "banque" ? "Virement bancaire" : "Mobile Money (MoMo)"}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString("fr-FR") : "—"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(u)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg font-bold text-[11.5px] transition cursor-pointer"
                        >
                          <PencilSquareIcon className="w-3.5 h-3.5" />
                          <span>Modifier</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Modification du Rôle */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-[15px] font-bold text-slate-900">
                Modifier les privilèges du compte
              </h3>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-[12.5px] text-slate-600">
                Utilisateur : <strong>{editingUser.full_name || editingUser.email}</strong>
              </p>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  Sélectionnez le nouveau rôle :
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                >
                  <option value="owner">Bailleur Privé (owner)</option>
                  <option value="agency_admin">Agence Immobilière Mandatée (agency_admin)</option>
                  <option value="tenant">Locataire (tenant)</option>
                  <option value="super_admin">Super Administrateur HQ (super_admin)</option>
                </select>
              </div>

              <p className="text-[11px] text-slate-500 leading-snug pt-1">
                ⚠️ Ce changement modifie immédiatement les droits d&apos;accès, le calcul des commissions et les fonctionnalités disponibles pour cet utilisateur.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 text-[12.5px] font-bold text-slate-600 hover:text-slate-900 rounded-xl cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={updateRoleMutation.isPending}
                onClick={handleSaveRole}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[12.5px] font-bold rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50"
              >
                {updateRoleMutation.isPending ? "Enregistrement..." : "Appliquer le rôle"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
