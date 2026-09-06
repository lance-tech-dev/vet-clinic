-- ============================================================================
-- Production Schema: User Roles, Profiles, Pets, Media Assets, RLS & Triggers
-- Fully idempotent script for fresh deployment or migration runs.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Enum: user_role
-- ---------------------------------------------------------------------------
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE public.user_role AS ENUM ('admin', 'staff', 'user');
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- 2. Schema Permissions
-- ---------------------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- 3. Table: profiles
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role public.user_role NOT NULL DEFAULT 'user',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- 4. Table: pets
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- 5. Table: media_assets
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  storage_key TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,
  uploaded_by UUID REFERENCES public.profiles (id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- 6. Helper Functions
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  owner_name_val TEXT;
  phone_val TEXT;
  pet_name_val TEXT;
BEGIN
  owner_name_val := COALESCE(new.raw_user_meta_data ->> 'owner_name', new.raw_user_meta_data ->> 'full_name');
  phone_val := new.raw_user_meta_data ->> 'phone';
  pet_name_val := new.raw_user_meta_data ->> 'pet_name';

  -- 1. Insert profile record safely
  INSERT INTO public.profiles (id, email, full_name, phone, avatar_url)
  VALUES (
    new.id,
    new.email,
    owner_name_val,
    phone_val,
    new.raw_user_meta_data ->> 'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone;

  -- 2. Insert initial pet if pet_name was provided
  IF pet_name_val IS NOT NULL AND length(trim(pet_name_val)) > 0 THEN
    INSERT INTO public.pets (owner_id, name)
    VALUES (new.id, trim(pet_name_val));
  END IF;

  RETURN new;
END;
$$;

-- ---------------------------------------------------------------------------
-- 7. Trigger
-- ---------------------------------------------------------------------------
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 8. RLS Policies
-- ---------------------------------------------------------------------------

-- Profiles Policies
DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;
CREATE POLICY "profiles_select_own_or_admin"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "profiles_update_own_or_admin" ON public.profiles;
CREATE POLICY "profiles_update_own_or_admin"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin(auth.uid()))
  WITH CHECK (
    (auth.uid() = id AND role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid()))
    OR public.is_admin(auth.uid())
  );

-- Pets Policies
DROP POLICY IF EXISTS "pets_select_own_or_admin" ON public.pets;
CREATE POLICY "pets_select_own_or_admin"
  ON public.pets FOR SELECT
  USING (auth.uid() = owner_id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "pets_insert_own_or_admin" ON public.pets;
CREATE POLICY "pets_insert_own_or_admin"
  ON public.pets FOR INSERT
  WITH CHECK (auth.uid() = owner_id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "pets_update_own_or_admin" ON public.pets;
CREATE POLICY "pets_update_own_or_admin"
  ON public.pets FOR UPDATE
  USING (auth.uid() = owner_id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "pets_delete_own_or_admin" ON public.pets;
CREATE POLICY "pets_delete_own_or_admin"
  ON public.pets FOR DELETE
  USING (auth.uid() = owner_id OR public.is_admin(auth.uid()));

-- Media Assets Policies
DROP POLICY IF EXISTS "media_assets_select_all" ON public.media_assets;
CREATE POLICY "media_assets_select_all"
  ON public.media_assets FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "media_assets_insert_staff_or_admin" ON public.media_assets;
CREATE POLICY "media_assets_insert_staff_or_admin"
  ON public.media_assets FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

DROP POLICY IF EXISTS "media_assets_delete_staff_or_admin" ON public.media_assets;
CREATE POLICY "media_assets_delete_staff_or_admin"
  ON public.media_assets FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

-- ---------------------------------------------------------------------------
-- 9. Table & Function Access Grants
-- ---------------------------------------------------------------------------
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon, authenticated, service_role;