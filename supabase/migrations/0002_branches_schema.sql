-- ============================================================================
-- Migration 0002: Clinic Branches Schema, RLS Policies & Initial Seed Data
-- Fully idempotent script for local and production Supabase migrations.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Table: branches
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  operating_hours TEXT NOT NULL DEFAULT '8:00 AM - 6:00 PM',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure UNIQUE constraint exists on the name column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'branches_name_key'
  ) THEN
    ALTER TABLE public.branches ADD CONSTRAINT branches_name_key UNIQUE (name);
  END IF;
END $$;

ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- 2. RLS Policies
-- ---------------------------------------------------------------------------

-- Read Policy: Public, anon, and authenticated users can view branches
DROP POLICY IF EXISTS "branches_select_all" ON public.branches;
CREATE POLICY "branches_select_all"
  ON public.branches FOR SELECT
  USING (true);

-- Insert Policy: Admins only
DROP POLICY IF EXISTS "branches_insert_admin" ON public.branches;
CREATE POLICY "branches_insert_admin"
  ON public.branches FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

-- Update Policy: Admins only
DROP POLICY IF EXISTS "branches_update_admin" ON public.branches;
CREATE POLICY "branches_update_admin"
  ON public.branches FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- Delete Policy: Admins only
DROP POLICY IF EXISTS "branches_delete_admin" ON public.branches;
CREATE POLICY "branches_delete_admin"
  ON public.branches FOR DELETE
  USING (public.is_admin(auth.uid()));

-- ---------------------------------------------------------------------------
-- 3. Grants
-- ---------------------------------------------------------------------------
GRANT ALL ON public.branches TO anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- 4. Initial Seed Data (Laguna Branches)
-- ---------------------------------------------------------------------------
INSERT INTO public.branches (name, city, address, phone, operating_hours, is_active)
VALUES
  ('Main Branch (San Pablo)', 'San Pablo', 'San Pablo City, Laguna', '(049) 501-2345', '8:00 AM - 6:00 PM', true),
  ('Calamba Branch', 'Calamba', 'Calamba City, Laguna', '(049) 545-6789', '8:00 AM - 6:00 PM', true),
  ('Santa Rosa Branch', 'Santa Rosa', 'Santa Rosa City, Laguna', '(049) 534-8901', '8:00 AM - 6:00 PM', true)
ON CONFLICT (name) DO NOTHING;