-- Migration 020 : Preuve de paiement (capture d'écran/photo) sur les encaissements
-- Complète reference_paiement (déjà présent depuis la 012/013) avec un vrai
-- justificatif visuel, stocké dans un bucket dédié plutôt que dans la table.

alter table public.loyers_transactions
  add column if not exists preuve_url text;

comment on column public.loyers_transactions.preuve_url is
  'URL (bucket payment-proofs) de la capture d''écran/photo justifiant le paiement (ticket MoMo/Moov, reçu espèces, etc.)';

-- Bucket de stockage pour les preuves de paiement.
-- Public en lecture (même posture que biens-photos) : les chemins incluent
-- l'id utilisateur + un timestamp, donc pas d'énumération triviale possible.
-- À reconsidérer (URLs signées) si un bailleur demande un accès restreint.
insert into storage.buckets (id, name, public)
values ('payment-proofs', 'payment-proofs', true)
on conflict (id) do nothing;

drop policy if exists "payment-proofs_public_read" on storage.objects;
create policy "payment-proofs_public_read"
  on storage.objects for select
  using (bucket_id = 'payment-proofs');

drop policy if exists "payment-proofs_auth_insert" on storage.objects;
create policy "payment-proofs_auth_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'payment-proofs');

drop policy if exists "payment-proofs_auth_update" on storage.objects;
create policy "payment-proofs_auth_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'payment-proofs');

drop policy if exists "payment-proofs_auth_delete" on storage.objects;
create policy "payment-proofs_auth_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'payment-proofs');
