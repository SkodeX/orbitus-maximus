-- Orbitus Maximus: Konto-Daten, Beobachtungstagebuch und Push-Abos.
-- Jede Tabelle ist per Row Level Security auf die eigenen Zeilen beschränkt.

-- ---------------------------------------------------------------- Einstellungen & Lernfortschritt
create table if not exists public.user_state (
  user_id uuid primary key references auth.users on delete cascade,
  settings jsonb not null default '{}',
  progress jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

alter table public.user_state enable row level security;

create policy "user_state: lesen" on public.user_state for select using ((select auth.uid()) = user_id);
create policy "user_state: anlegen" on public.user_state for insert with check ((select auth.uid()) = user_id);
create policy "user_state: ändern" on public.user_state for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "user_state: löschen" on public.user_state for delete using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------- Beobachtungstagebuch
create table if not exists public.observations (
  id uuid primary key,
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  observed_at timestamptz not null,
  place_name text,
  lat double precision,
  lon double precision,
  objects text[] not null default '{}',
  title text not null default '',
  notes text not null default '',
  seeing smallint check (seeing between 1 and 5),
  equipment text not null default '',
  photos text[] not null default '{}',
  deleted boolean not null default false,
  updated_at timestamptz not null default now(),
  -- vom Server gesetzt, damit der Abgleich nicht von der Geräteuhr abhängt
  synced_at timestamptz not null default now()
);

create index if not exists observations_user_synced on public.observations (user_id, synced_at);

alter table public.observations enable row level security;

create policy "observations: lesen" on public.observations for select using ((select auth.uid()) = user_id);
create policy "observations: anlegen" on public.observations for insert with check ((select auth.uid()) = user_id);
create policy "observations: ändern" on public.observations for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "observations: löschen" on public.observations for delete using ((select auth.uid()) = user_id);

create or replace function public.touch_synced_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.synced_at := now();
  return new;
end;
$$;

create trigger observations_synced_at
  before insert or update on public.observations
  for each row execute function public.touch_synced_at();

-- ---------------------------------------------------------------- Fotos zum Tagebuch (privat)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('observation-photos', 'observation-photos', false, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

-- Pfade beginnen mit der eigenen Nutzer-ID: <user_id>/<eintrag>/<foto>.jpg
create policy "Fotos: lesen" on storage.objects for select to authenticated
  using (bucket_id = 'observation-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "Fotos: hochladen" on storage.objects for insert to authenticated
  with check (bucket_id = 'observation-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "Fotos: löschen" on storage.objects for delete to authenticated
  using (bucket_id = 'observation-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- ---------------------------------------------------------------- Push-Abos
create table if not exists public.push_subscriptions (
  endpoint text primary key,
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  p256dh text not null,
  auth text not null,
  lat double precision not null,
  lon double precision not null,
  tz text not null,
  place_name text,
  lang text not null default 'de',
  prefs jsonb not null default '{"iss": true, "aurora": true, "clear": true, "meteors": true}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.push_subscriptions enable row level security;

create policy "push: lesen" on public.push_subscriptions for select using ((select auth.uid()) = user_id);
create policy "push: anlegen" on public.push_subscriptions for insert with check ((select auth.uid()) = user_id);
create policy "push: ändern" on public.push_subscriptions for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "push: löschen" on public.push_subscriptions for delete using ((select auth.uid()) = user_id);

-- Bereits verschickte Meldungen, damit nichts doppelt kommt. Nur der Server (service_role) greift zu.
create table if not exists public.push_log (
  endpoint text not null references public.push_subscriptions on delete cascade,
  key text not null,
  sent_at timestamptz not null default now(),
  primary key (endpoint, key)
);

alter table public.push_log enable row level security;

-- ---------------------------------------------------------------- Geheimnisse für den Push-Server
-- Der private VAPID-Schlüssel und der Cron-Schlüssel liegen im Vault; nur service_role darf sie lesen.
create or replace function public.orbitus_secret(secret_name text)
returns text
language sql
security definer
set search_path = ''
as $$
  select decrypted_secret from vault.decrypted_secrets where name = secret_name limit 1;
$$;

revoke all on function public.orbitus_secret(text) from public, anon, authenticated;
grant execute on function public.orbitus_secret(text) to service_role;
