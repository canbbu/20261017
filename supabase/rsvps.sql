create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  attending boolean not null,
  guest_count smallint not null,
  meal text,
  message text,
  published boolean not null default false,
  hidden boolean not null default false,
  consent boolean not null,
  created_at timestamptz not null default now(),
  constraint rsvps_name_len check (char_length(name) between 1 and 40),
  constraint rsvps_guest_count_range check (guest_count between 0 and 20),
  constraint rsvps_meal_value check (meal is null or meal in ('yes', 'no')),
  constraint rsvps_consent_true check (consent)
);

alter table public.rsvps enable row level security;

drop policy if exists "Guests can submit rsvp" on public.rsvps;
create policy "Guests can submit rsvp"
  on public.rsvps
  for insert
  to anon, authenticated
  with check (
    char_length(name) between 1 and 40
    and guest_count between 0 and 20
    and consent = true
    and hidden = false
  );

drop policy if exists "Guests can read published notes" on public.rsvps;
create policy "Guests can read published notes"
  on public.rsvps
  for select
  to anon, authenticated
  using (
    published = true
    and hidden = false
    and message is not null
  );

grant insert on table public.rsvps to anon, authenticated;
grant select (id, name, message, published, hidden, created_at) on table public.rsvps to anon, authenticated;
