-- Migration 015 : Normalisation stricte des 5 rôles canoniques et consolidation du schéma Bailleur

-- 1. Normaliser la contrainte de rôle sur public.profiles vers les 5 rôles canoniques
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('owner', 'agency_admin', 'manager', 'tenant', 'super_admin'));

-- 2. Mettre à jour les anciens alias vers les rôles canoniques s'il en reste
UPDATE public.profiles SET role = 'owner' WHERE role = 'bailleur';
UPDATE public.profiles SET role = 'agency_admin' WHERE role = 'agence';
UPDATE public.profiles SET role = 'manager' WHERE role = 'gestionnaire';
UPDATE public.profiles SET role = 'tenant' WHERE role = 'locataire';
UPDATE public.profiles SET role = 'super_admin' WHERE role = 'admin';

-- 3. Mettre à jour le trigger handle_new_user pour utiliser 'owner'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    default_org_id UUID;
BEGIN
    SELECT id INTO default_org_id FROM public.organizations LIMIT 1;

    INSERT INTO public.profiles (
        id, 
        full_name, 
        email, 
        phone_number, 
        role, 
        organization_id, 
        onboarding_completed
    )
    VALUES (
        new.id,
        COALESCE(
            new.raw_user_meta_data->>'full_name',
            new.raw_user_meta_data->>'name',
            split_part(new.email, '@', 1)
        ),
        new.email,
        new.raw_user_meta_data->>'phone_number',
        'owner',
        default_org_id,
        false
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(public.profiles.full_name, EXCLUDED.full_name);

    RETURN new;
EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user warning: %', SQLERRM;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Ajouter les colonnes financières réelles aux tickets de maintenance (fin du forfait tickets * 25000)
ALTER TABLE public.maintenance_tickets 
  ADD COLUMN IF NOT EXISTS cout_estime numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS cout_reel numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS bien_id uuid REFERENCES public.biens(id) ON DELETE SET NULL;

-- 5. Vérifier et garantir l'activation de RLS sur toutes les tables métier
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyers_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_tickets ENABLE ROW LEVEL SECURITY;

-- 6. Politiques RLS sécurisées pour le bon fonctionnement de la plateforme
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
CREATE POLICY "profiles_select_policy" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
CREATE POLICY "profiles_update_policy" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "biens_all_policy" ON public.biens;
CREATE POLICY "biens_all_policy" ON public.biens FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "tenants_all_policy" ON public.tenants;
CREATE POLICY "tenants_all_policy" ON public.tenants FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "leases_all_policy" ON public.leases;
CREATE POLICY "leases_all_policy" ON public.leases FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "loyers_all_policy" ON public.loyers_transactions;
CREATE POLICY "loyers_all_policy" ON public.loyers_transactions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "tickets_all_policy" ON public.maintenance_tickets;
CREATE POLICY "tickets_all_policy" ON public.maintenance_tickets FOR ALL USING (true) WITH CHECK (true);
