-- Migration 010 : création de la table "biens" pour la page Mon Patrimoine
-- Appliquée directement sur le projet Supabase "Loka" (nmzpskxclwcqnkmkpqkh) le 2026-08-31.
-- Alignée sur le pattern multi-organisation déjà en place (organizations / buildings / units / RLS
-- via is_super_admin() / current_user_org_id() / current_user_role()).

create table if not exists biens (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  nom text not null,
  adresse text,
  ville text,
  type text,
  loyer_mensuel numeric not null default 0,
  charges numeric default 0,
  statut text not null default 'vacant' check (statut in ('loué', 'vacant', 'travaux')),
  locataire_nom text,
  photos text[] not null default '{}',
  photo_principale text,
  equipements text[] not null default '{}',
  caution_montant numeric,
  surface_m2 numeric,
  nb_pieces integer,
  archive boolean not null default false,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table biens is 'Portefeuille de biens (page Mon Patrimoine) — scoping multi-org via organization_id, RLS alignée sur buildings/units';
comment on column biens.photos is 'URLs des photos dans le bucket biens-photos, ordre = ordre d''affichage';
comment on column biens.photo_principale is 'URL de la photo principale (doit faire partie de photos[])';
comment on column biens.equipements is 'Tags libres : climatisation, forage, compteur SBEE personnel, etc.';
comment on column biens.caution_montant is 'Caution demandée, comparée au plafond légal (3x loyer) côté UI';
comment on column biens.archive is 'Soft delete : masqué de la grille par défaut';

create index if not exists idx_biens_organization_id on biens (organization_id);
create index if not exists idx_biens_archive on biens (archive);
create index if not exists idx_biens_statut on biens (statut);

-- updated_at auto
create or replace function biens_set_updated_at()
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

drop trigger if exists trg_biens_updated_at on biens;
create trigger trg_biens_updated_at
  before update on biens
  for each row execute function biens_set_updated_at();

-- organization_id auto-rempli depuis le profil connecté si non fourni par le client
create or replace function biens_set_organization_id()
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

drop trigger if exists trg_biens_set_organization_id on biens;
create trigger trg_biens_set_organization_id
  before insert on biens
  for each row execute function biens_set_organization_id();

alter table biens enable row level security;

drop policy if exists biens_select on biens;
create policy biens_select
  on biens for select
  using (is_super_admin() OR (organization_id = current_user_org_id()));

drop policy if exists biens_write on biens;
create policy biens_write
  on biens for all
  using (is_super_admin() OR ((organization_id = current_user_org_id()) AND (current_user_role() = ANY (ARRAY['owner'::text, 'manager'::text, 'agency_admin'::text]))))
  with check (is_super_admin() OR ((organization_id = current_user_org_id()) AND (current_user_role() = ANY (ARRAY['owner'::text, 'manager'::text, 'agency_admin'::text]))));

-- Bucket de stockage pour les photos de biens (public en lecture, upload authentifié)
insert into storage.buckets (id, name, public)
values ('biens-photos', 'biens-photos', true)
on conflict (id) do nothing;

drop policy if exists "biens-photos_public_read" on storage.objects;
create policy "biens-photos_public_read"
  on storage.objects for select
  using (bucket_id = 'biens-photos');

drop policy if exists "biens-photos_auth_insert" on storage.objects;
create policy "biens-photos_auth_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'biens-photos');

drop policy if exists "biens-photos_auth_update" on storage.objects;
create policy "biens-photos_auth_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'biens-photos');

drop policy if exists "biens-photos_auth_delete" on storage.objects;
create policy "biens-photos_auth_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'biens-photos');
