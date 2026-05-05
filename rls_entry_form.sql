-- ============================================================
-- RLS POLICIES FOR ENTRY FORM
-- Run this in Supabase SQL Editor (project tpurkcxtkvwpywxnuzwe)
--
-- Security model:
--   shows        → public read (name, date, classes — same as a flyer)
--   show_classes → public read (same)
--   entries      → public INSERT only (riders submit but cannot read others)
--   entry_classes→ public INSERT only (created alongside entries)
--   all others   → authenticated only (no change from current)
-- ============================================================

-- Enable RLS on the tables we're opening
alter table shows        enable row level security;
alter table show_classes enable row level security;
alter table entries      enable row level security;
alter table entry_classes enable row level security;

-- ── shows: public read of active/open shows only ─────────────
create policy "Public can read shows"
  on shows for select
  to anon
  using (status in ('entries_open', 'entries_closed', 'running', 'complete'));

-- Authenticated users (secretaries) can read all shows
create policy "Authenticated can read all shows"
  on shows for select
  to authenticated
  using (true);

-- Authenticated users can insert and update shows
create policy "Authenticated can insert shows"
  on shows for insert
  to authenticated
  with check (true);

create policy "Authenticated can update shows"
  on shows for update
  to authenticated
  using (true);

-- ── show_classes: public read ─────────────────────────────────
create policy "Public can read show classes"
  on show_classes for select
  to anon
  using (true);

create policy "Authenticated can read show classes"
  on show_classes for select
  to authenticated
  using (true);

create policy "Authenticated can manage show classes"
  on show_classes for all
  to authenticated
  using (true);

-- ── entries: public insert only (no read for anon) ───────────
-- Riders can submit an entry but cannot read any entry data
create policy "Public can insert entries"
  on entries for insert
  to anon
  with check (true);

create policy "Authenticated can read all entries"
  on entries for select
  to authenticated
  using (true);

create policy "Authenticated can manage entries"
  on entries for all
  to authenticated
  using (true);

-- ── entry_classes: public insert only ────────────────────────
create policy "Public can insert entry_classes"
  on entry_classes for insert
  to anon
  with check (true);

create policy "Authenticated can read all entry_classes"
  on entry_classes for select
  to authenticated
  using (true);

create policy "Authenticated can manage entry_classes"
  on entry_classes for all
  to authenticated
  using (true);

-- ── associations: public read (needed for entry form to load org list) ──
alter table associations enable row level security;

create policy "Public can read associations"
  on associations for select
  to anon
  using (active = true);

create policy "Authenticated can manage associations"
  on associations for all
  to authenticated
  using (true);
