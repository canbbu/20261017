alter table public.rsvps
  add column if not exists published boolean not null default false;

alter table public.rsvps
  add column if not exists hidden boolean not null default false;

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

grant select (id, name, message, published, hidden, created_at) on table public.rsvps to anon, authenticated;
