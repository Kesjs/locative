-- Migration 017 : table "residences" — Résidence comme vraie entité créable.
-- Appliquée directement sur le projet Supabase "Loka" (nmzpskxclwcqnkmkpqkh).
-- Alignée sur le pattern multi-org déjà en place sur "biens" (organization_id, RLS via
-- is_super_admin() / current_user_org_id() / current_user_role()).
--
-- Note : biens.groupe_patrimoine (texte libre) reste la source de vérité pour le filtre résidence
-- existant (lib/patrimoineFilterContext.tsx). Cette table sert à la création/gestion explicite des
-- résidences ; à la création avec des biens cochés, biens.groupe_patrimoine est mis à jour = residences.nom.

create table if not exists residences (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  nom text not null,
  type text check (type in ('Personnel', 'SCI', 'Copropriété', 'Autre')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table residences is 'Résidences (groupes de patrimoine) créables explicitement depuis le sélecteur sidebar — remplace le texte libre groupe_patrimoine sur biens.';

create index if not exists idx_residences_organization_id on residences (organization_id);

create or replace function residences_set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_residences_updated_at on residences;
create trigger trg_residences_updated_at
  before update on residences
  for each row execute function residences_set_updated_at();

create or replace function residences_set_organization_id()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.organization_id is null then
    new.organization_id := current_user_org_id();
  end if;
  return new;
end;
$$;

drop trigger if exists trg_residences_set_organization_id on residences;
create trigger trg_residences_set_organization_id
  before insert on residences
  for each row execute function residences_set_organization_id();

alter table residences enable row level security;

drop policy if exists residences_select on residences;
create policy residences_select
  on residences for select
  using (is_super_admin() OR (organization_id = current_user_org_id()));

drop policy if exists residences_write on residences;
create policy residences_write
  on residences for all
  using (is_super_admin() OR ((organization_id = current_user_org_id()) AND (current_user_role() = ANY (ARRAY['owner'::text, 'manager'::text, 'agency_admin'::text]))))
  with check (is_super_admin() OR ((organization_id = current_user_org_id()) AND (current_user_role() = ANY (ARRAY['owner'::text, 'manager'::text, 'agency_admin'::text]))));
