-- Migration 011 : Ajout des champs étendus pour les Logements & Locaux (quartier, repère GPS, compteurs SBEE/SONEB)
-- Permet de supporter la saisie locale et les compteurs prépayés.

alter table if exists public.biens 
  add column if not exists quartier text,
  add column if not exists repere text,
  add column if not exists compteur_sbee text,
  add column if not exists compteur_soneb text;

comment on column public.biens.quartier is 'Nom du quartier ou de la zone (ex: Fidjrossè, Cadjêhoun, Tankpè)';
comment on column public.biens.repere is 'Repère ou indication géographique locale / coordonnées GPS';
comment on column public.biens.compteur_sbee is 'Numéro du compteur électrique SBEE pour recharge prépayée';
comment on column public.biens.compteur_soneb is 'Numéro de police / compteur SONEB';
