-- PartyHBG admin CMS schema
-- Apply via Supabase dashboard SQL editor or `supabase db push`

create table if not exists public.flashback_galleries (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  event_slug text,
  title text not null,
  venue text not null,
  date date not null,
  cover_url text not null,
  photos text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_assets (
  id uuid primary key default gen_random_uuid(),
  asset_key text unique not null,
  url text not null,
  label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.flashback_galleries enable row level security;
alter table public.site_assets enable row level security;

create policy "Public read flashbacks"
  on public.flashback_galleries for select
  using (true);

create policy "Public read assets"
  on public.site_assets for select
  using (true);

create policy "Admins manage flashbacks"
  on public.flashback_galleries for all
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins manage assets"
  on public.site_assets for all
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger flashback_galleries_updated_at
  before update on public.flashback_galleries
  for each row execute function public.set_updated_at();

create trigger site_assets_updated_at
  before update on public.site_assets
  for each row execute function public.set_updated_at();
