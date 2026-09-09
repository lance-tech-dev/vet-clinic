-- ============================================================================
-- Migration 0005: Expanded Pet Data Schema & 5 Medical History Log Tables
-- Fully idempotent script for local and production Supabase deployment.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Alter Table: public.pets (Add required clinical and handler fields)
-- ---------------------------------------------------------------------------
ALTER TABLE public.pets
  ADD COLUMN IF NOT EXISTS sex TEXT DEFAULT 'Male',
  ADD COLUMN IF NOT EXISTS is_neutered BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS date_of_birth DATE,
  ADD COLUMN IF NOT EXISTS microchip_no TEXT,
  ADD COLUMN IF NOT EXISTS color_markings TEXT,
  ADD COLUMN IF NOT EXISTS owner_name TEXT,
  ADD COLUMN IF NOT EXISTS owner_address TEXT,
  ADD COLUMN IF NOT EXISTS owner_phone TEXT,
  ADD COLUMN IF NOT EXISTS owner_email TEXT,
  ADD COLUMN IF NOT EXISTS authorized_handlers TEXT;

-- ---------------------------------------------------------------------------
-- 2. Table: pet_grooming_logs (Tab 1)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pet_grooming_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES public.pets (id) ON DELETE CASCADE,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_grooming BOOLEAN NOT NULL DEFAULT TRUE,
  is_boarding BOOLEAN NOT NULL DEFAULT FALSE,
  medical_history TEXT,
  medications_supplements TEXT,
  special_needs_preferences TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 3. Table: pet_vaccination_logs (Tab 2)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pet_vaccination_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES public.pets (id) ON DELETE CASCADE,
  date_given DATE NOT NULL,
  weight_kg NUMERIC(5,2),
  against_disease TEXT NOT NULL,
  vaccine_used TEXT NOT NULL,
  lot_batch_no TEXT,
  next_due DATE,
  veterinarian TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 4. Table: pet_parasite_preventative_logs (Tab 3)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pet_parasite_preventative_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES public.pets (id) ON DELETE CASCADE,
  date_given DATE NOT NULL,
  weight_kg NUMERIC(5,2),
  against_parasites TEXT NOT NULL,
  preventative_used TEXT NOT NULL,
  next_due DATE,
  veterinarian TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 5. Table: pet_medical_visit_logs (Tab 4)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pet_medical_visit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES public.pets (id) ON DELETE CASCADE,
  visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
  reason_for_visit TEXT NOT NULL,
  clinical_findings TEXT NOT NULL,
  vet_instructions TEXT NOT NULL,
  follow_up_date DATE,
  veterinarian TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 6. Table: pet_dental_logs (Tab 5)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pet_dental_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES public.pets (id) ON DELETE CASCADE,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  has_salivation BOOLEAN NOT NULL DEFAULT FALSE,
  has_periodontal_disease BOOLEAN NOT NULL DEFAULT FALSE,
  tooth_conditions JSONB DEFAULT '{}'::jsonb,
  notes TEXT,
  veterinarian TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Enable RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.pet_grooming_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_vaccination_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_parasite_preventative_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_medical_visit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_dental_logs ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- RLS Policies for Logs (Users can read logs of their own pets; Staff/Admins manage all)
-- ---------------------------------------------------------------------------
DO $$ 
DECLARE
  tbl text;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'pet_grooming_logs',
    'pet_vaccination_logs',
    'pet_parasite_preventative_logs',
    'pet_medical_visit_logs',
    'pet_dental_logs'
  ] LOOP
    EXECUTE format('
      DROP POLICY IF EXISTS %I ON public.%I;
      CREATE POLICY %I ON public.%I FOR SELECT
        USING (
          EXISTS (
            SELECT 1 FROM public.pets
            WHERE pets.id = %I.pet_id AND (pets.owner_id = auth.uid() OR public.is_admin(auth.uid()) OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN (''admin'', ''staff'')))
          )
        );

      DROP POLICY IF EXISTS %I ON public.%I;
      CREATE POLICY %I ON public.%I FOR ALL
        USING (
          public.is_admin(auth.uid()) OR EXISTS (
            SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN (''admin'', ''staff'')
          ) OR EXISTS (
            SELECT 1 FROM public.pets WHERE pets.id = %I.pet_id AND pets.owner_id = auth.uid()
          )
        );
    ', 
    tbl || '_select', tbl, tbl || '_select', tbl, tbl,
    tbl || '_all', tbl, tbl || '_all', tbl, tbl
    );
  END LOOP;
END $$;

-- Grants
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;