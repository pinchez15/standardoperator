-- Utility function for updated_at columns.
create or replace function public.set_current_timestamp_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Users table maps Clerk users into Supabase.
create table if not exists public.users (
  id uuid primary key default uuid_generate_v4(),
  clerk_user_id text not null unique,
  email text not null,
  full_name text,
  plan text not null default 'free',
  sop_quota integer not null default 3,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger handle_users_updated_at
before update on public.users
for each row
execute function public.set_current_timestamp_updated_at();

-- SOP folders for organizing procedures.
create table if not exists public.sop_folders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

-- Core SOP records.
create table if not exists public.sops (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  folder_id uuid references public.sop_folders(id) on delete set null,
  title text not null,
  content jsonb not null default '{}'::jsonb,
  status text not null default 'draft',
  version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger handle_sops_updated_at
before update on public.sops
for each row
execute function public.set_current_timestamp_updated_at();

-- Export history for generated files.
create table if not exists public.sop_exports (
  id uuid primary key default uuid_generate_v4(),
  sop_id uuid not null references public.sops(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  format text not null check (format in ('pdf', 'docx')),
  storage_path text not null,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Arcade mode requests that alert admins.
create table if not exists public.arcade_requests (
  id uuid primary key default uuid_generate_v4(),
  sop_id uuid not null references public.sops(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  game_type text not null check (game_type in ('space-invader', 'racer', 'platformer')),
  notes text,
  status text not null default 'pending',
  admin_response jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger handle_arcade_requests_updated_at
before update on public.arcade_requests
for each row
execute function public.set_current_timestamp_updated_at();

-- Optional: enable RLS on core tables.
alter table public.users enable row level security;
alter table public.sop_folders enable row level security;
alter table public.sops enable row level security;
alter table public.sop_exports enable row level security;
alter table public.arcade_requests enable row level security;

-- Users can manage only their own records.
create policy "Users select own profile"
on public.users
for select using (auth.uid() = id);

create policy "Users update own profile"
on public.users
for update using (auth.uid() = id);

create policy "Users insert self profile"
on public.users
for insert with check (auth.uid() = id);

create policy "Users manage own folders"
on public.sop_folders
for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users manage own sops"
on public.sops
for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users manage own exports"
on public.sop_exports
for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users manage own arcade requests"
on public.arcade_requests
for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Storage bucket for supporting files.
insert into storage.buckets (id, name, public)
values ('sop-assets', 'sop-assets', false)
on conflict (id) do nothing;
