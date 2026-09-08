-- Migration 016 : Suppression des politiques RLS permissives ("USING true")
-- introduites par erreur dans la migration 015, qui annulaient le scoping
-- multi-organisation strict et exposaient les locataires/baux/loyers de
-- TOUTES les organisations à TOUT utilisateur connecté.
--
-- En PostgreSQL, plusieurs politiques RLS permissives sur une même table se
-- combinent avec un OU logique : la présence d'une politique "USING (true)"
-- annule donc silencieusement toute politique plus stricte définie à côté.
-- C'était le cas ici depuis la migration 015 pour biens, leases,
-- loyers_transactions, tenants et maintenance_tickets — n'importe quel
-- compte connecté pouvait lire les données de n'importe quelle organisation.
--
-- Ces politiques ne sont pas remplacées : les politiques strictes
-- (biens_select/biens_write, leases_select/leases_write,
-- loyers_select/loyers_write, tenants_org_scoped,
-- maintenance_tickets_select/insert/update) restent en place et redeviennent
-- effectives dès que leur "concurrente" permissive disparaît.
--
-- Appliquée directement sur le projet Supabase "Loka" (nmzpskxclwcqnkmkpqkh)
-- le 2026-09-08, à documenter/rejouer ici pour garder l'historique.

drop policy if exists biens_all_policy on public.biens;
drop policy if exists leases_all_policy on public.leases;
drop policy if exists loyers_all_policy on public.loyers_transactions;
drop policy if exists tenants_all_policy on public.tenants;
drop policy if exists tickets_all_policy on public.maintenance_tickets;

-- profiles_select_policy (USING true) permettait aussi à tout utilisateur
-- connecté de lire nom/email de TOUS les profils de TOUTES les organisations.
-- On la remplace par un accès restreint : son propre profil, ou les profils
-- de sa propre organisation (utile pour afficher le nom d'un locataire/
-- gestionnaire dans l'UI), ou tout profil si super admin.
drop policy if exists "profiles_select_policy" on public.profiles;
create policy "profiles_select_policy" on public.profiles for select
  using (
    auth.uid() = id
    or is_super_admin()
    or organization_id = current_user_org_id()
  );
