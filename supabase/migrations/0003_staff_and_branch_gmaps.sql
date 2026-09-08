-- ============================================================================
-- Migration 0003: Staff Members Schema & Branch Google Maps Link
-- Fully idempotent script for local and production Supabase migrations.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Alter branches table to include gmap_url
-- ---------------------------------------------------------------------------
ALTER TABLE public.branches ADD COLUMN IF NOT EXISTS gmap_url TEXT;

-- ---------------------------------------------------------------------------
-- 2. Table: staff_members
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.staff_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role_title TEXT NOT NULL,
  specialization TEXT,
  avatar_url TEXT,
  phone TEXT,
  email TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.staff_members ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- 3. RLS Policies for staff_members
-- ---------------------------------------------------------------------------

-- Read Policy: Public, anon, and authenticated users can view staff members
DROP POLICY IF EXISTS "staff_members_select_all" ON public.staff_members;
CREATE POLICY "staff_members_select_all"
  ON public.staff_members FOR SELECT
  USING (true);

-- Insert Policy: Admins only
DROP POLICY IF EXISTS "staff_members_insert_admin" ON public.staff_members;
CREATE POLICY "staff_members_insert_admin"
  ON public.staff_members FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

-- Update Policy: Admins only
DROP POLICY IF EXISTS "staff_members_update_admin" ON public.staff_members;
CREATE POLICY "staff_members_update_admin"
  ON public.staff_members FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- Delete Policy: Admins only
DROP POLICY IF EXISTS "staff_members_delete_admin" ON public.staff_members;
CREATE POLICY "staff_members_delete_admin"
  ON public.staff_members FOR DELETE
  USING (public.is_admin(auth.uid()));

-- ---------------------------------------------------------------------------
-- 4. Grants
-- ---------------------------------------------------------------------------
GRANT ALL ON public.staff_members TO anon, authenticated, service_role;