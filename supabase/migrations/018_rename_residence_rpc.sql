-- Migration 018 : fonction transactionnelle rename_residence.
--
-- Contexte (voir commentaire de 017) : biens.groupe_patrimoine (texte libre) reste la source
-- de vérité pour le filtre résidence actif (lib/patrimoineFilterContext.tsx), matché par nom
-- exact. Un simple `UPDATE residences SET nom = ...` désynchroniserait tous les biens déjà
-- tagués avec l'ancien nom. Cette fonction fait les deux updates (residences + biens) dans la
-- même transaction, avec un verrou de nom unique par organisation pour empêcher la collision
-- de deux résidences au même nom (l'autre scénario de désync identifié).

create or replace function rename_residence(p_residence_id uuid, p_nouveau_nom text)
returns residences
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_org_id uuid;
  v_ancien_nom text;
  v_nouveau_nom text := trim(p_nouveau_nom);
  v_result residences;
begin
  if v_nouveau_nom = '' then
    raise exception 'Le nom de la résidence ne peut pas être vide.';
  end if;

  select organization_id, nom into v_org_id, v_ancien_nom
  from residences
  where id = p_residence_id;

  if v_org_id is null then
    raise exception 'Résidence introuvable.';
  end if;

  -- Empêche deux résidences du même nom dans la même organisation (autre source de désync
  -- identifiée : le matching par nom exact ne peut plus distinguer deux résidences homonymes).
  if exists (
    select 1 from residences
    where organization_id = v_org_id
      and id <> p_residence_id
      and lower(trim(nom)) = lower(v_nouveau_nom)
  ) then
    raise exception 'Une résidence porte déjà ce nom.';
  end if;

  if v_ancien_nom = v_nouveau_nom then
    select * into v_result from residences where id = p_residence_id;
    return v_result;
  end if;

  update residences
  set nom = v_nouveau_nom
  where id = p_residence_id
  returning * into v_result;

  update biens
  set groupe_patrimoine = v_nouveau_nom
  where organization_id = v_org_id
    and trim(groupe_patrimoine) = v_ancien_nom;

  return v_result;
end;
$$;

comment on function rename_residence is 'Renomme une résidence et propage le nouveau nom à tous les biens.groupe_patrimoine qui portaient l''ancien nom, de façon atomique.';

-- RLS déjà en place sur residences/biens (policies *_write, rôles owner/manager/agency_admin) ;
-- security invoker => la fonction s'exécute avec les droits de l'appelant, donc ces policies
-- s'appliquent normalement aux deux updates internes.
grant execute on function rename_residence(uuid, text) to authenticated;
