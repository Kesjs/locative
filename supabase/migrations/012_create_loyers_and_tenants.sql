-- Migration 012 : Création de la table loyers_transactions et gestion des baux / locataires
-- Permet de stocker les règlements Mobile Money (MTN, Moov), Espèces et Virements ainsi que les quittances.

create table if not exists public.loyers_transactions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
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

comment on table public.loyers_transactions is 'Transactions de loyers, quittances et encaissements multi-moyens (MoMo, Moov, Espèces, Virement)';

-- Indexes
create index if not exists idx_loyers_transactions_org on public.loyers_transactions (organization_id);
create index if not exists idx_loyers_transactions_statut on public.loyers_transactions (statut);
create index if not exists idx_loyers_transactions_echeance on public.loyers_transactions (echeance);

-- RLS
alter table public.loyers_transactions enable row level security;

drop policy if exists loyers_select on public.loyers_transactions;
create policy loyers_select
  on public.loyers_transactions for select
  using (true);

drop policy if exists loyers_write on public.loyers_transactions;
create policy loyers_write
  on public.loyers_transactions for all
  using (true)
  with check (true);
