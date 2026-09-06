-- ============================================================================
-- Initial schema: user roles, profiles, media assets, and RLS policies.
--
-- This establishes the auth/authorization foundation already reflected in
-- lib/supabase/types.ts (Database type). Apply via the Supabase SQL editor
-- or `supabase db push` once this project is linked to a Supabase project.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Enum: user_role
-- ---------------------------------------------------------------------------
create type public.user_role as enum ('admin', 'staff', 'user');

-- ---------------------------------------------------------------------------
-- Table: profiles
-- One row per auth.users entry, created automatically via trigger below.
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role public.user_role not null default 'user',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- ---------------------------------------------------------------------------
-- Function: is_admin
-- Security-definer helper so it can be used inside RLS policies without
-- being blocked by the RLS it is itself evaluating.
-- ---------------------------------------------------------------------------
create or replace function public.is_admin(user_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = user_id and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- RLS: profiles
-- Users may read/update their own profile; admins may read/update all.
-- Role changes are excluded from the update policy's `with check` clause to
-- prevent privilege escalation — role changes must go through the
-- service-role (admin) Supabase client, called only from trusted server code.
-- ---------------------------------------------------------------------------
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin(auth.uid()));

create policy "profiles_update_own_or_admin"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin(auth.uid()))
  with check (
    (auth.uid() = id and role = (select p.role from public.profiles p where p.id = auth.uid()))
    or public.is_admin(auth.uid())
  );

-- No insert/delete policies are defined: rows are created only by the
-- trigger below (security definer) and removed via the auth.users cascade.

-- ---------------------------------------------------------------------------
-- Trigger: auto-create a profile row when a new auth user is created.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Table: media_assets
-- Metadata for files stored in Cloudflare R2. The object itself lives in R2;
-- this table is the Supabase-side reference used by the rest of the app.
-- ---------------------------------------------------------------------------
create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  storage_key text not null unique,
  url text not null,
  mime_type text not null,
  size_bytes bigint not null,
  uploaded_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.media_assets enable row level security;

-- ---------------------------------------------------------------------------
-- RLS: media_assets
-- Publicly readable (site media). Writes restricted to staff/admin.
-- Tighten the select policy if any assets must stay private.
-- ---------------------------------------------------------------------------
create policy "media_assets_select_all"
  on public.media_assets for select
  using (true);

create policy "media_assets_insert_staff_or_admin"
  on public.media_assets for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'staff')
    )
  );

create policy "media_assets_delete_staff_or_admin"
  on public.media_assets for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'staff')
    )
  );
