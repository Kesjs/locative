-- ==============================================================================
-- SCHÉMA DE RÉINITIALISATION & CRÉATION SUPABASE — LOKKA (GESTION LOCATIVE BÉNIN)
-- Conforme à la Loi n° 2022-30 du 20 décembre 2022 portant régime des baux d'habitation
-- ==============================================================================

-- ==============================================================================
-- 0. RÉINITIALISATION COMPLÈTE (Suppression propre de toutes les anciennes tables)
-- ==============================================================================

-- Suppression des déclencheurs et fonctions existants
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Suppression des tables dans l'ordre des dépendances (clés étrangères)
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.leases CASCADE;
DROP TABLE IF EXISTS public.tenants CASCADE;
DROP TABLE IF EXISTS public.properties CASCADE;
DROP TABLE IF EXISTS public.leads_waitlist CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Suppression d'éventuelles tables temporaires ou antérieures
DROP TABLE IF EXISTS public.documents CASCADE;
DROP TABLE IF EXISTS public.biens CASCADE;
DROP TABLE IF EXISTS public.locataires CASCADE;
DROP TABLE IF EXISTS public.loyers CASCADE;

-- ==============================================================================
-- 1. EXTENSIONS
-- ==============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. TABLE DES PROFILS UTILISATEURS (Liée à auth.users)
-- ==============================================================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone_number TEXT, -- Format Bénin (+229...)
    role TEXT CHECK (role IN ('bailleur', 'gestionnaire', 'agence')) DEFAULT 'bailleur',
    city TEXT DEFAULT 'Cotonou',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger pour créer automatiquement un profil lors de l'inscription auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, phone_number, role)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', 'Utilisateur'),
        new.email,
        new.raw_user_meta_data->>'phone_number',
        COALESCE(new.raw_user_meta_data->>'role', 'bailleur')
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 3. TABLE DES BIENS IMMOBILIERS
-- ==============================================================================
CREATE TABLE public.properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL, -- Ex: "Villa Fidjrossè Plage" ou "Studio Akpakpa"
    type TEXT CHECK (type IN ('chambre_salon', 'appartement', 'villa', 'studio', 'commercial', 'autre')) NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Cotonou', -- Cotonou, Abomey-Calavi, Porto-Novo, Parakou, Ouidah
    district TEXT, -- Quartier (ex: Fidjrossè, Cadjèhoun, Arconville)
    surface_m2 NUMERIC,
    rent_amount_fcfa NUMERIC NOT NULL CHECK (rent_amount_fcfa >= 0),
    charges_amount_fcfa NUMERIC DEFAULT 0 CHECK (charges_amount_fcfa >= 0), -- Eau / Électricité SBEE
    status TEXT CHECK (status IN ('occupe', 'vacant', 'maintenance')) DEFAULT 'vacant',
    photos TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 4. TABLE DES LOCATAIRES
-- ==============================================================================
CREATE TABLE public.tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone_number TEXT NOT NULL, -- Numéro principal (+229)
    whatsapp_number TEXT,       -- WhatsApp pour rappels & quittances
    email TEXT,
    id_card_type TEXT CHECK (id_card_type IN ('CIP', 'CNI', 'PASSEPORT', 'AUTRE')),
    id_card_number TEXT,
    profession TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 5. TABLE DES BAUX (Conformité Loi 2022-30)
-- ==============================================================================
CREATE TABLE public.leases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE,
    rent_amount_fcfa NUMERIC NOT NULL CHECK (rent_amount_fcfa > 0),
    charges_amount_fcfa NUMERIC DEFAULT 0,
    deposit_months INTEGER NOT NULL DEFAULT 3 CHECK (deposit_months BETWEEN 1 AND 3), -- Plafond Loi 2022-30
    deposit_amount_fcfa NUMERIC NOT NULL CHECK (deposit_amount_fcfa >= 0),
    due_day INTEGER DEFAULT 5 CHECK (due_day BETWEEN 1 AND 31),
    is_active BOOLEAN DEFAULT TRUE,
    lease_contract_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 6. TABLE DES PAIEMENTS & RECOUVREMENTS
-- ==============================================================================
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lease_id UUID NOT NULL REFERENCES public.leases(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    amount_fcfa NUMERIC NOT NULL CHECK (amount_fcfa > 0),
    channel TEXT CHECK (channel IN ('mtn_momo', 'moov_money', 'virement', 'especes', 'cheque')) NOT NULL,
    transaction_ref TEXT, -- Référence MoMo ou numéro de reçu
    status TEXT CHECK (status IN ('verifie', 'en_attente', 'retard', 'impaye', 'partiel')) DEFAULT 'verifie',
    for_month TEXT NOT NULL, -- Format YYYY-MM (ex: '2026-08')
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    receipt_pdf_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 7. TABLE DES LEADS / DEMANDES ACCÈS PRIORITAIRE (Landing Page)
-- ==============================================================================
CREATE TABLE public.leads_waitlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    profile_type TEXT DEFAULT 'bailleur', -- bailleur, gestionnaire, agence, diaspora
    properties_count TEXT, -- 1-2, 3-10, 10+
    city TEXT DEFAULT 'Cotonou',
    source TEXT DEFAULT 'landing_page',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads_waitlist ENABLE ROW LEVEL SECURITY;

-- Profiles: chacun peut lire et modifier son propre profil
CREATE POLICY "Users can read own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Properties: chaque propriétaire gère ses biens
CREATE POLICY "Owners can CRUD own properties" ON public.properties
    FOR ALL USING (auth.uid() = owner_id);

-- Tenants: chaque propriétaire gère ses locataires
CREATE POLICY "Owners can CRUD own tenants" ON public.tenants
    FOR ALL USING (auth.uid() = owner_id);

-- Leases: accessibles par les propriétaires des biens
CREATE POLICY "Owners can CRUD leases" ON public.leases
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.properties 
            WHERE properties.id = leases.property_id 
            AND properties.owner_id = auth.uid()
        )
    );

-- Payments: accessibles par les propriétaires des biens
CREATE POLICY "Owners can CRUD payments" ON public.payments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.properties 
            WHERE properties.id = payments.property_id 
            AND properties.owner_id = auth.uid()
        )
    );

-- Leads: insertion publique pour la Landing Page, lecture restreinte
CREATE POLICY "Public can submit leads" ON public.leads_waitlist
    FOR INSERT WITH CHECK (true);
