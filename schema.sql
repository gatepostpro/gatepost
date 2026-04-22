-- ============================================================
-- GATEPOST DATABASE SCHEMA
-- Run this entire file in Supabase SQL Editor
-- Project: tpurkcxtkvwpywxnuzwe.supabase.co
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================================
-- ASSOCIATIONS
-- Each association (CoWN, SHTX, etc.) is a tenant
-- ============================================================
create table associations (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  abbreviation    text not null,
  contact_email   text,
  website         text,
  fee_defaults    jsonb default '{}'::jsonb,
  points_config   jsonb default '{}'::jsonb,
  active          boolean default true,
  created_at      timestamptz default now()
);

-- Seed CoWN as the first association
insert into associations (name, abbreviation, contact_email, website)
values ('CoWN Stock Horse Association', 'CoWN', 'info@cownsh.com', 'https://cownsh.com');

-- ============================================================
-- MEMBERS
-- People who compete or are members of an association
-- ============================================================
create table members (
  id                  uuid primary key default uuid_generate_v4(),
  association_id      uuid references associations(id) on delete cascade,
  first_name          text not null,
  last_name           text not null,
  email               text,
  phone               text,
  address             text,
  city                text,
  state               text,
  zip                 text,
  dob                 date,
  membership_tier     text,           -- '1yr', '3yr', 'lifetime', 'day'
  membership_expires  date,
  lifetime_member     boolean default false,
  emergency_contact   text,
  emergency_phone     text,
  notes               text,
  active              boolean default true,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

create index idx_members_association on members(association_id);
create index idx_members_name on members(last_name, first_name);
create index idx_members_email on members(email);

-- ============================================================
-- MEMBER REGISTRATIONS
-- A member can be registered with multiple orgs (CoWN, AQHA, APHA...)
-- ============================================================
create table member_registrations (
  id                  uuid primary key default uuid_generate_v4(),
  member_id           uuid references members(id) on delete cascade,
  org                 text not null,        -- 'CoWN', 'AQHA', 'APHA', 'NHSRA'
  registration_number text not null,
  registered_date     date,
  expires             date,
  created_at          timestamptz default now()
);

create index idx_member_reg_member on member_registrations(member_id);
create index idx_member_reg_org on member_registrations(org, registration_number);

-- ============================================================
-- USERS
-- Login accounts — separate from members
-- Not every member has an account; staff/board do
-- ============================================================
create table users (
  id              uuid primary key default uuid_generate_v4(),
  member_id       uuid references members(id) on delete set null,
  association_id  uuid references associations(id) on delete cascade,
  email           text not null unique,
  role            text not null default 'public',
                  -- 'admin', 'secretary', 'treasurer', 'gate', 'steward', 'public'
  active          boolean default true,
  last_login      timestamptz,
  created_at      timestamptz default now()
);

create index idx_users_email on users(email);
create index idx_users_association on users(association_id);

-- ============================================================
-- HORSES
-- ============================================================
create table horses (
  id              uuid primary key default uuid_generate_v4(),
  registered_name text not null,
  barn_name       text,
  gender          text,             -- 'Gelding', 'Mare', 'Stallion'
  color           text,
  markings        text,
  dob             date,
  breed           text,
  sire            text,
  dam             text,
  coggins_date    date,
  coggins_number  text,
  notes           text,
  active          boolean default true,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create index idx_horses_name on horses(registered_name);
create index idx_horses_barn_name on horses(barn_name);

-- ============================================================
-- HORSE REGISTRATIONS
-- A horse can be registered with multiple orgs
-- ============================================================
create table horse_registrations (
  id                  uuid primary key default uuid_generate_v4(),
  horse_id            uuid references horses(id) on delete cascade,
  org                 text not null,
  registration_number text not null,
  registered_date     date,
  expires             date,
  created_at          timestamptz default now()
);

create index idx_horse_reg_horse on horse_registrations(horse_id);
create index idx_horse_reg_org on horse_registrations(org, registration_number);

-- ============================================================
-- HORSE OWNERS
-- Supports multiple owners (partnerships), tracks history
-- ============================================================
create table horse_owners (
  id              uuid primary key default uuid_generate_v4(),
  horse_id        uuid references horses(id) on delete cascade,
  member_id       uuid references members(id) on delete cascade,
  primary_owner   boolean default false,
  from_date       date default current_date,
  to_date         date,             -- null = still current owner
  created_at      timestamptz default now()
);

create index idx_horse_owners_horse on horse_owners(horse_id);
create index idx_horse_owners_member on horse_owners(member_id);

-- ============================================================
-- MEMBERSHIPS
-- Transaction record of every membership purchase/renewal
-- ============================================================
create table memberships (
  id              uuid primary key default uuid_generate_v4(),
  member_id       uuid references members(id) on delete cascade,
  association_id  uuid references associations(id),
  tier            text not null,    -- '1yr', '3yr', 'lifetime', 'day'
  start_date      date not null,
  end_date        date,
  amount_paid     numeric(8,2),
  payment_method  text,             -- 'cash', 'check', 'card', 'online'
  check_number    text,
  status          text default 'active',  -- 'active', 'expired', 'refunded'
  processed_by    uuid references users(id) on delete set null,
  notes           text,
  created_at      timestamptz default now()
);

create index idx_memberships_member on memberships(member_id);
create index idx_memberships_association on memberships(association_id);

-- ============================================================
-- SHOWS
-- ============================================================
create table shows (
  id              uuid primary key default uuid_generate_v4(),
  association_id  uuid references associations(id) on delete cascade,
  name            text not null,
  show_date       date not null,
  end_date        date,
  entry_deadline  date,
  location        text,
  address         text,
  status          text default 'setup',
                  -- 'setup', 'entries_open', 'entries_closed', 'running', 'complete'
  fee_config      jsonb default '{}'::jsonb,
                  -- stores all fees: class base, cow surcharge, stall rates etc.
  secretary_id    uuid references users(id) on delete set null,
  treasurer_id    uuid references users(id) on delete set null,
  notes           text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create index idx_shows_association on shows(association_id);
create index idx_shows_date on shows(show_date);
create index idx_shows_status on shows(status);

-- ============================================================
-- JUDGES
-- ============================================================
create table judges (
  id          uuid primary key default uuid_generate_v4(),
  first_name  text not null,
  last_name   text not null,
  email       text,
  phone       text,
  org_cards   jsonb default '{}'::jsonb,
              -- e.g. {"AQHA": "12345", "NRHA": "67890"}
  notes       text,
  active      boolean default true,
  created_at  timestamptz default now()
);

create index idx_judges_name on judges(last_name, first_name);

-- ============================================================
-- SHOW JUDGES
-- Which judges are assigned to which shows
-- ============================================================
create table show_judges (
  id          uuid primary key default uuid_generate_v4(),
  show_id     uuid references shows(id) on delete cascade,
  judge_id    uuid references judges(id) on delete cascade,
  role        text default 'judge',   -- 'judge', 'scribe', 'technical_delegate'
  created_at  timestamptz default now()
);

create index idx_show_judges_show on show_judges(show_id);

-- ============================================================
-- SHOW CLASSES
-- The classes offered at a specific show
-- ============================================================
create table show_classes (
  id              uuid primary key default uuid_generate_v4(),
  show_id         uuid references shows(id) on delete cascade,
  class_number    text not null,
  class_name      text not null,
  division        text,
  org             text default 'CoWN',  -- 'CoWN', 'AQHA', 'APHA'
  is_cow          boolean default false,
  is_jackpot      boolean default false,
  base_fee        numeric(8,2),         -- null = use show fee_config default
  cow_fee         numeric(8,2),         -- null = use show fee_config default
  jackpot_fee     numeric(8,2) default 0,
  added_money     numeric(8,2) default 0,
  go_rounds       int default 1,
  status          text default 'scheduled',
                  -- 'scheduled', 'draw_done', 'running', 'complete'
  draw_order      jsonb default '[]'::jsonb,  -- array of entry_ids in order
  run_order       int,                -- order this class runs in the show
  created_at      timestamptz default now()
);

create index idx_show_classes_show on show_classes(show_id);
create index idx_show_classes_number on show_classes(show_id, class_number);

-- ============================================================
-- ENTRIES
-- A rider + horse combination entered in a show
-- One entry per horse per show (can enter multiple classes)
-- ============================================================
create table entries (
  id              uuid primary key default uuid_generate_v4(),
  show_id         uuid references shows(id) on delete cascade,
  member_id       uuid references members(id) on delete restrict,
  horse_id        uuid references horses(id) on delete restrict,
  back_number     int,
  source          text default 'manual',
                  -- 'cognito_import', 'manual', 'online_form'
  status          text default 'active',
                  -- 'active', 'scratched', 'no_show'
  total_owed      numeric(8,2) default 0,
  total_paid      numeric(8,2) default 0,
  cognito_ref     text,             -- original Cognito entry # for reference
  stall_1night    int default 0,
  stall_2night    int default 0,
  stall_3night    int default 0,
  shavings        int default 0,
  rv_1night       int default 0,
  rv_2night       int default 0,
  rv_circuit      int default 0,
  stall_note      text,
  needs_membership text,            -- '1yr', '3yr', 'lifetime', 'day', null
  imported_at     timestamptz,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create index idx_entries_show on entries(show_id);
create index idx_entries_member on entries(member_id);
create index idx_entries_horse on entries(horse_id);
create index idx_entries_back_number on entries(show_id, back_number);

-- ============================================================
-- ENTRY CLASSES
-- Which specific classes an entry is competing in
-- ============================================================
create table entry_classes (
  id              uuid primary key default uuid_generate_v4(),
  entry_id        uuid references entries(id) on delete cascade,
  show_class_id   uuid references show_classes(id) on delete cascade,
  status          text default 'entered',
                  -- 'entered', 'scratched', 'no_show', 'complete'
  draw_position   int,              -- position in the class draw
  raw_score       numeric(6,3),
  penalties       numeric(6,3) default 0,
  final_score     numeric(6,3),
  "placing"       int,
  points_earned   numeric(8,3) default 0,
  fee_charged     numeric(8,2) default 0,
  scratch_reason  text,             -- 'voluntary', 'no_show', 'injury'
  scratched_at    timestamptz,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create index idx_entry_classes_entry on entry_classes(entry_id);
create index idx_entry_classes_class on entry_classes(show_class_id);
create index idx_entry_classes_status on entry_classes(status);

-- ============================================================
-- SCORES
-- Per-go-round scores from judges / ring stewards
-- ============================================================
create table scores (
  id              uuid primary key default uuid_generate_v4(),
  entry_class_id  uuid references entry_classes(id) on delete cascade,
  judge_id        uuid references judges(id) on delete set null,
  go_round        int default 1,
  maneuver_score  numeric(6,3),     -- base score (e.g. 70 for reining)
  penalty_points  numeric(6,3) default 0,
  total           numeric(6,3),
  notes           text,
  entered_by      uuid references users(id) on delete set null,
  entered_at      timestamptz default now()
);

create index idx_scores_entry_class on scores(entry_class_id);
create index idx_scores_judge on scores(judge_id);

-- ============================================================
-- PAYMENTS
-- Every payment transaction against an entry tab
-- ============================================================
create table payments (
  id              uuid primary key default uuid_generate_v4(),
  entry_id        uuid references entries(id) on delete cascade,
  amount          numeric(8,2) not null,
  method          text,             -- 'cash', 'check', 'card', 'venmo', 'credit'
  check_number    text,
  notes           text,
  status          text default 'completed',  -- 'completed', 'refunded', 'void'
  processed_by    uuid references users(id) on delete set null,
  paid_at         timestamptz default now(),
  created_at      timestamptz default now()
);

create index idx_payments_entry on payments(entry_id);

-- ============================================================
-- PAYOUTS
-- Prize money / jackpot payouts per class
-- ============================================================
create table payouts (
  id              uuid primary key default uuid_generate_v4(),
  show_class_id   uuid references show_classes(id) on delete cascade,
  entry_id        uuid references entries(id) on delete cascade,
  "placing"       int not null,
  prize_amount    numeric(8,2) not null,
  check_number    text,
  check_cut       boolean default false,
  applied_to_tab  boolean default false,  -- applied as credit to their balance
  paid_at         timestamptz,
  created_at      timestamptz default now()
);

create index idx_payouts_class on payouts(show_class_id);
create index idx_payouts_entry on payouts(entry_id);

-- ============================================================
-- POINTS
-- Season standings — calculated after each show
-- ============================================================
create table points (
  id              uuid primary key default uuid_generate_v4(),
  member_id       uuid references members(id) on delete cascade,
  horse_id        uuid references horses(id) on delete cascade,
  association_id  uuid references associations(id),
  season_year     int not null,
  division        text not null,
  total_points    numeric(10,3) default 0,
  shows_counted   int default 0,
  qualified       boolean default false,
  all_around      boolean default false,
  updated_at      timestamptz default now()
);

create unique index idx_points_unique
  on points(member_id, horse_id, association_id, season_year, division);
create index idx_points_standings
  on points(association_id, season_year, division, total_points desc);

-- ============================================================
-- SHOW DOCUMENTS
-- Prize lists, judge cards, coggins, rule books attached to a show
-- ============================================================
create table show_documents (
  id          uuid primary key default uuid_generate_v4(),
  show_id     uuid references shows(id) on delete cascade,
  doc_type    text not null,    -- 'prize_list', 'rule_book', 'judge_card', 'coggins', 'other'
  filename    text not null,
  url         text,             -- Supabase Storage URL
  notes       text,
  uploaded_by uuid references users(id) on delete set null,
  uploaded_at timestamptz default now()
);

create index idx_show_docs_show on show_documents(show_id);

-- ============================================================
-- BACK NUMBER REGISTRY
-- Tracks back number assignments across shows and seasons
-- Back numbers belong to horse+association, not rider
-- ============================================================
create table back_numbers (
  id              uuid primary key default uuid_generate_v4(),
  association_id  uuid references associations(id),
  horse_id        uuid references horses(id) on delete cascade,
  back_number     int not null,
  season_year     int not null,
  assigned_at     timestamptz default now(),
  unique(association_id, back_number, season_year)
);

create index idx_back_numbers_horse on back_numbers(horse_id);
create index idx_back_numbers_assoc on back_numbers(association_id, season_year);

-- ============================================================
-- UPDATED_AT TRIGGERS
-- Auto-update updated_at timestamp on row changes
-- ============================================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_members_updated
  before update on members
  for each row execute function update_updated_at();

create trigger trg_horses_updated
  before update on horses
  for each row execute function update_updated_at();

create trigger trg_shows_updated
  before update on shows
  for each row execute function update_updated_at();

create trigger trg_entries_updated
  before update on entries
  for each row execute function update_updated_at();

create trigger trg_entry_classes_updated
  before update on entry_classes
  for each row execute function update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Basic policies — public read on safe tables,
-- authenticated write on everything else
-- Expand these as you add user auth
-- ============================================================
alter table associations     enable row level security;
alter table members          enable row level security;
alter table member_registrations enable row level security;
alter table horses           enable row level security;
alter table horse_registrations enable row level security;
alter table horse_owners     enable row level security;
alter table memberships      enable row level security;
alter table shows            enable row level security;
alter table show_classes     enable row level security;
alter table entries          enable row level security;
alter table entry_classes    enable row level security;
alter table payments         enable row level security;
alter table payouts          enable row level security;
alter table scores           enable row level security;
alter table points           enable row level security;
alter table judges           enable row level security;
alter table show_judges      enable row level security;
alter table show_documents   enable row level security;
alter table back_numbers     enable row level security;
alter table users            enable row level security;

-- TEMPORARY: Allow all operations while building
-- Replace with proper role-based policies before going live
create policy "allow_all_for_now" on associations     for all using (true) with check (true);
create policy "allow_all_for_now" on members          for all using (true) with check (true);
create policy "allow_all_for_now" on member_registrations for all using (true) with check (true);
create policy "allow_all_for_now" on horses           for all using (true) with check (true);
create policy "allow_all_for_now" on horse_registrations for all using (true) with check (true);
create policy "allow_all_for_now" on horse_owners     for all using (true) with check (true);
create policy "allow_all_for_now" on memberships      for all using (true) with check (true);
create policy "allow_all_for_now" on shows            for all using (true) with check (true);
create policy "allow_all_for_now" on show_classes     for all using (true) with check (true);
create policy "allow_all_for_now" on entries          for all using (true) with check (true);
create policy "allow_all_for_now" on entry_classes    for all using (true) with check (true);
create policy "allow_all_for_now" on payments         for all using (true) with check (true);
create policy "allow_all_for_now" on payouts          for all using (true) with check (true);
create policy "allow_all_for_now" on scores           for all using (true) with check (true);
create policy "allow_all_for_now" on points           for all using (true) with check (true);
create policy "allow_all_for_now" on judges           for all using (true) with check (true);
create policy "allow_all_for_now" on show_judges      for all using (true) with check (true);
create policy "allow_all_for_now" on show_documents   for all using (true) with check (true);
create policy "allow_all_for_now" on back_numbers     for all using (true) with check (true);
create policy "allow_all_for_now" on users            for all using (true) with check (true);

-- ============================================================
-- SHOW RESULTS
-- Stores imported SHTX/Funnware result rows, one per competitor
-- per class. Does not require member/horse UUID linkage — name
-- strings from the export are sufficient; link to members/horses
-- later when matched.
-- ============================================================
create table show_results (
  id              uuid primary key default uuid_generate_v4(),
  show_id         uuid references shows(id) on delete cascade,
  association_id  uuid references associations(id),

  -- Parsed from Funnware ClassDivision compound string
  org             text not null,        -- 'CoWN','VRH','Collegiate','High School'
  division        text not null,        -- 'Open','Non-Pro','Ltd Non-Pro','Youth'
  discipline      text not null,        -- 'Reining','Trail','Working Cow','All Around'
  raw_class       text,                 -- original ClassDivision string verbatim

  -- Competitor (name-based; link to member/horse records later)
  rider_name      text,
  horse_name      text,
  owner_name      text,
  rider_shtx_num  text,

  -- Optional soft links to Gatepost records
  member_id       uuid references members(id) on delete set null,
  horse_id        uuid references horses(id) on delete set null,

  -- Class stats
  entries_count   int,
  added_money     numeric(8,2) default 0,

  -- Result
  go_round        text,
  score           numeric(8,3),
  "placing"       int,
  points          numeric(8,3) default 0,
  money_earned    numeric(8,2) default 0,

  source          text default 'shtx_import',  -- 'shtx_import','manual'
  imported_at     timestamptz default now(),
  created_at      timestamptz default now()
);

create index idx_show_results_show   on show_results(show_id);
create index idx_show_results_class  on show_results(show_id, org, division, discipline);
create index idx_show_results_rider  on show_results(show_id, rider_name);
create index idx_show_results_member on show_results(member_id) where member_id is not null;

alter table show_results enable row level security;
create policy "allow_all_for_now" on show_results for all using (true) with check (true);

-- ============================================================
-- ALTER POINTS
-- Add org + discipline columns so CoWN Open Reining and
-- VRH Amateur Ranch Reining are separate standing rows.
-- Run these as ALTER statements against an existing DB;
-- if rebuilding from scratch the columns are included above.
-- ============================================================
alter table points
  add column if not exists org        text not null default 'CoWN',
  add column if not exists discipline text not null default 'All Around';

drop index if exists idx_points_unique;
create unique index idx_points_unique
  on points(member_id, horse_id, association_id, season_year, org, division, discipline);

drop index if exists idx_points_standings;
create index idx_points_standings
  on points(association_id, season_year, org, division, total_points desc);

-- ============================================================
-- SEASON RESULTS
-- Flat denormalized table written by the "Push to Season Hub"
-- action in app.html. One row per competitor per class per show.
-- Used by season.html to build year-end standings with drop-show logic.
-- ============================================================
create table if not exists season_results (
  id              uuid primary key default uuid_generate_v4(),
  show_id         uuid,                 -- references shows(id) — soft link, not FK
  association_id  uuid,                 -- references associations(id) — soft link
  show_name       text not null,
  org             text not null,        -- 'CoWN','VRH','Collegiate','High School','APHA'
  division        text not null,        -- 'Open','Non-Pro','Ltd Non-Pro','Youth', etc.
  discipline      text not null,        -- 'Reining','Trail','Working Cow', etc.
  raw_class       text,
  rider           text,
  horse           text,
  owner           text,
  score           numeric(8,3),
  place           int,
  pts             numeric(8,3) default 0,
  money           numeric(8,2) default 0,
  published_at    timestamptz default now(),
  created_at      timestamptz default now()
);

create index if not exists idx_season_results_assoc
  on season_results(association_id, show_name);
create index if not exists idx_season_results_class
  on season_results(org, division, discipline);
create index if not exists idx_season_results_rider
  on season_results(rider);

alter table season_results enable row level security;
create policy "allow_all_for_now" on season_results for all using (true) with check (true);

-- ============================================================
-- HORSE REVISIONS
-- Append-only audit log for horse record changes.
-- Edits create a new revision row rather than overwriting.
-- ============================================================
create table if not exists horse_revisions (
  id              uuid primary key default uuid_generate_v4(),
  horse_id        uuid references horses(id) on delete cascade,
  revised_at      timestamptz default now(),
  revised_by      uuid references users(id) on delete set null,
  note            text,                 -- reason for change
  data            jsonb not null        -- full snapshot of horse fields at this revision
);

create index if not exists idx_horse_revisions_horse
  on horse_revisions(horse_id, revised_at desc);

alter table horse_revisions enable row level security;
create policy "allow_all_for_now" on horse_revisions for all using (true) with check (true);

-- ============================================================
-- DONE
-- ============================================================
