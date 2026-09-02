-- Migration 013 : Création sécurisée de la table loyers_transactions avec politiques RLS strictes
-- Scoping multi-tenant par organization_id (aligné sur le modèle Lokka)

create table if not exists public.loyers_transactions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  bien_id uuid references public.biens(id) on delete set null,
  locataire_nom text not null,
  bien_nom text not null,
  montant numeric not null default 0,
  methode text not null default 'MTN MoMo' check (methode in ('MTN MoMo', 'Moov Money', 'Espèces', 'Virement')),
  statut text not null default 'en_attente' check (statut in ('payé', 'en_attente', 'retard')),
  quittance_url text,
  date_reglement timestamptz,
  echeance date not null default current_date,
  reference_paiement text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.loyers_transactions is 'Transactions de loyers, règlements Mobile Money (MTN, Moov), Espèces et quittances sous RLS multi-organisation';

-- Index de performance
create index if not exists idx_loyers_transactions_org on public.loyers_transactions (organization_id);
create index if not exists idx_loyers_transactions_statut on public.loyers_transactions (statut);
create index if not exists idx_loyers_transactions_echeance on public.loyers_transactions (echeance);

-- Trigger updated_at
create or replace function loyers_transactions_set_updated_at()
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

drop trigger if exists trg_loyers_transactions_updated_at on public.loyers_transactions;
create trigger trg_loyers_transactions_updated_at
  before update on public.loyers_transactions
  for each row execute function loyers_transactions_set_updated_at();

-- Trigger organization_id auto-assign
create or replace function loyers_transactions_set_organization_id()
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

drop trigger if exists trg_loyers_transactions_set_org_id on public.loyers_transactions;
create trigger trg_loyers_transactions_set_org_id
  before insert on public.loyers_transactions
  for each row execute function loyers_transactions_set_organization_id();

-- Activer RLS
alter table public.loyers_transactions enable row level security;

-- Politiques RLS strictes
drop policy if exists loyers_select on public.loyers_transactions;
create policy loyers_select
  on public.loyers_transactions for select
  using (is_super_admin() OR (organization_id = current_user_org_id()));

drop policy if exists loyers_write on public.loyers_transactions;
create policy loyers_write
  on public.loyers_transactions for all
  using (is_super_admin() OR ((organization_id = current_user_org_id()) AND (current_user_role() = ANY (ARRAY['owner'::text, 'manager'::text, 'agency_admin'::text]))))
  with check (is_super_admin() OR ((organization_id = current_user_org_id()) AND (current_user_role() = ANY (ARRAY['owner'::text, 'manager'::text, 'agency_admin'::text]))));
