-- ============================================================================
-- Migration 0004: Appointments Schema, Expected Patients Status & RLS Policies
-- Fully idempotent script for local and production Supabase deployment.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Enum: appointment_status
-- Default status is 'scheduled' (Expected Patient Arrival - No approval gate needed)
-- ---------------------------------------------------------------------------
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'appointment_status') THEN
    CREATE TYPE public.appointment_status AS ENUM ('scheduled', 'completed', 'cancelled');
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- 2. Table: appointments
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES public.branches (id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  pet_name TEXT NOT NULL,
  species_breed TEXT NOT NULL,
  notes TEXT,
  status public.appointment_status NOT NULL DEFAULT 'scheduled',
  reschedule_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- 3. RLS Policies
-- ---------------------------------------------------------------------------

-- Read Policy: Users can view their own appointments; Admins and Staff can view all
DROP POLICY IF EXISTS "appointments_select_own_or_admin" ON public.appointments;
CREATE POLICY "appointments_select_own_or_admin"
  ON public.appointments FOR SELECT
  USING (
    auth.uid() = user_id 
    OR public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

-- Insert Policy: Authenticated users can create their own appointments
DROP POLICY IF EXISTS "appointments_insert_own" ON public.appointments;
CREATE POLICY "appointments_insert_own"
  ON public.appointments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Update Policy: Users can update/reschedule their own appointments; Admins/Staff can update status
DROP POLICY IF EXISTS "appointments_update_own_or_admin" ON public.appointments;
CREATE POLICY "appointments_update_own_or_admin"
  ON public.appointments FOR UPDATE
  USING (
    auth.uid() = user_id
    OR public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

-- Delete Policy: Admins only
DROP POLICY IF EXISTS "appointments_delete_admin" ON public.appointments;
CREATE POLICY "appointments_delete_admin"
  ON public.appointments FOR DELETE
  USING (public.is_admin(auth.uid()));

-- ---------------------------------------------------------------------------
-- 4. Grants
-- ---------------------------------------------------------------------------
GRANT ALL ON public.appointments TO anon, authenticated, service_role;