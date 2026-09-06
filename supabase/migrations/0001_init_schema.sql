-- ============================================================================
-- Initial schema: user roles, profiles, pets, media assets, and RLS policies.
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
  phone text,
  role public.user_role not null default 'user',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- ---------------------------------------------------------------------------
-- Function: is_admin
-- Security-definer helper for RLS evaluations.
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

-- ---------------------------------------------------------------------------
-- Table: pets
-- Stores pet records linked to an owner profile.
-- ---------------------------------------------------------------------------
create table public.pets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.pets enable row level security;

-- ---------------------------------------------------------------------------
-- RLS: pets
-- Owners can read/update/delete their own pets; admins can manage all pets.
-- ---------------------------------------------------------------------------
create policy "pets_select_own_or_admin"
  on public.pets for select
  using (auth.uid() = owner_id or public.is_admin(auth.uid()));

create policy "pets_insert_own_or_admin"
  on public.pets for insert
  with check (auth.uid() = owner_id or public.is_admin(auth.uid()));

create policy "pets_update_own_or_admin"
  on public.pets for update
  using (auth.uid() = owner_id or public.is_admin(auth.uid()));

create policy "pets_delete_own_or_admin"
  on public.pets for delete
  using (auth.uid() = owner_id or public.is_admin(auth.uid()));

-- ---------------------------------------------------------------------------
-- Trigger: auto-create profile and pet rows when a new user signs up.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  owner_name_val text;
  phone_val text;
  pet_name_val text;
begin
  owner_name_val := coalesce(new.raw_user_meta_data ->> 'owner_name', new.raw_user_meta_data ->> 'full_name');
  phone_val := new.raw_user_meta_data ->> 'phone';
  pet_name_val := new.raw_user_meta_data ->> 'pet_name';

  -- 1. Insert profile record
  insert into public.profiles (id, email, full_name, phone, avatar_url)
  values (
    new.id,
    new.email,
    owner_name_val,
    phone_val,
    new.raw_user_meta_data ->> 'avatar_url'
  );

  -- 2. Insert initial pet if pet_name was provided
  if pet_name_val is not null and length(trim(pet_name_val)) > 0 then
    insert into public.pets (owner_id, name)
    values (new.id, trim(pet_name_val));
  end if;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Table: media_assets
-- Metadata for files stored in Cloudflare R2.
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