-- Migration 019 : notifications réelles.
--
-- Contexte : la cloche de notification du header (components/dashboard/Header.tsx) affichait un
-- contenu codé en dur ("Koudjo Dossou a réglé 350 000 FCFA"), aucune notification n'était réellement
-- générée quand un encaissement était enregistré (espèces, MoMo, etc.). Cette migration crée la table
-- + un trigger sur loyers_transactions qui insère une notification à chaque fois qu'une transaction
-- passe au statut 'payé' — que ce soit par insertion directe (useAddPaymentDirect) ou par mise à jour
-- d'une échéance en attente (useEncaisserLoyer).

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  type text not null default 'paiement_recu',
  title text not null,
  body text not null,
  reference_id uuid,
  reference_url text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

comment on table notifications is 'Notifications réelles affichées dans la cloche du header (générées par des triggers, ex: encaissement de loyer).';

create index if not exists idx_notifications_organization_id on notifications (organization_id);
create index if not exists idx_notifications_created_at on notifications (created_at desc);

alter table notifications enable row level security;

drop policy if exists notifications_select on notifications;
create policy notifications_select
  on notifications for select
  using (is_super_admin() OR (organization_id = current_user_org_id()));

-- Marquer comme lue reste possible pour tout membre de l'organisation (pas seulement owner/manager),
-- contrairement aux policies *_write des autres tables qui restreignent l'écriture aux rôles de gestion.
drop policy if exists notifications_update on notifications;
create policy notifications_update
  on notifications for update
  using (is_super_admin() OR (organization_id = current_user_org_id()))
  with check (is_super_admin() OR (organization_id = current_user_org_id()));

create or replace function notify_on_loyer_paye()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.statut = 'payé' and (tg_op = 'INSERT' or old.statut is distinct from 'payé') then
    insert into notifications (organization_id, type, title, body, reference_id, reference_url)
    values (
      new.organization_id,
      'paiement_recu',
      'Loyer reçu',
      new.locataire_nom || ' a réglé ' || to_char(new.montant, 'FM999G999G990') || ' FCFA (' || new.bien_nom || ') · ' || coalesce(new.methode, ''),
      new.id,
      '/dashboard/loyers'
    );
  end if;
  return new;
end;
$$;

drop trigger if exists trg_notify_on_loyer_paye on loyers_transactions;
create trigger trg_notify_on_loyer_paye
  after insert or update on loyers_transactions
  for each row execute function notify_on_loyer_paye();

comment on function notify_on_loyer_paye is 'Génère une notification réelle (table notifications) à chaque transaction de loyer qui passe au statut payé.';
