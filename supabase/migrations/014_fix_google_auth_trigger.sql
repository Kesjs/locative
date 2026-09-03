-- Migration 014 : Correction du trigger d'inscription Google OAuth et de la contrainte de rôle

-- 1. Assouplir la contrainte profiles_role_check pour accepter à la fois les rôles canoniques et les anciens alias
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('owner', 'bailleur', 'agency_admin', 'agence', 'manager', 'gestionnaire', 'tenant', 'locataire', 'super_admin', 'admin'));

-- 2. Recréer la fonction handle_new_user de manière sécurisée et tolérante
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    default_org_id UUID;
BEGIN
    -- Récupérer l'organisation principale existante
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
    -- Tolérance de panne : ne bloque JAMAIS la création de l'utilisateur dans auth.users
    RAISE WARNING 'handle_new_user warning: %', SQLERRM;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Re-lier le trigger sur auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
