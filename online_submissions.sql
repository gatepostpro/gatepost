-- ============================================================
-- ONLINE SUBMISSIONS TABLE
-- Run this in Supabase SQL Editor (project tpurkcxtkvwpywxnuzwe)
--
-- Stores raw form submissions from entry-form.html.
-- No FK to members/horses — riders are anonymous until a
-- secretary reviews and promotes to a full entry.
-- ============================================================

create table online_submissions (
  id              uuid primary key default uuid_generate_v4(),
  show_id         uuid references shows(id) on delete cascade,
  submission_data jsonb not null default '{}'::jsonb,
  status          text not null default 'pending',
                  -- 'pending', 'accepted', 'rejected', 'duplicate'
  review_notes    text,
  submitted_at    timestamptz default now(),
  reviewed_at     timestamptz,
  reviewed_by     uuid references users(id) on delete set null
);

create index idx_online_submissions_show   on online_submissions(show_id);
create index idx_online_submissions_status on online_submissions(show_id, status);

-- Enable RLS
alter table online_submissions enable row level security;

-- Public can insert only (riders submit but cannot read others)
create policy "Public can submit entries"
  on online_submissions for insert
  to anon
  with check (true);

-- Authenticated (secretaries) can read and manage all submissions
create policy "Authenticated can manage submissions"
  on online_submissions for all
  to authenticated
  using (true);
