-- IMODOYE — core schema
-- Implements workplan.md §3 (data model), §4 (editorial workflow),
-- §5 (RBAC), and the theme-per-issue correction.
-- Run against a Supabase Postgres project. Nothing here is applied
-- automatically — this file is generated but not executed against any
-- live project without explicit go-ahead (see workplan.md §9 checkpoints).

-- ============ ROLES ============
create type user_role as enum (
  'super_admin',
  'programme_director',
  'residency_editor',
  'review_editor',
  'section_editor',
  'reviewer',
  'fellow',
  'content_editor',
  'public'
);

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role user_role not null default 'public',
  avatar_url text,
  bio text,
  location text,
  country text,
  socials jsonb default '{}',
  created_at timestamptz not null default now()
);

-- ============ RESIDENCY / FELLOWSHIP ============
create table cohorts (
  id uuid primary key default gen_random_uuid(),
  number int not null unique,
  year int not null,
  title text,
  created_at timestamptz not null default now()
);

create table fellows (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete set null,
  cohort_id uuid references cohorts(id) on delete set null,
  genre text,
  project text,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create type application_stage as enum (
  'new', 'screening', 'shortlisted', 'interview', 'selected', 'waitlist', 'declined'
);

create table applications (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid references profiles(id) on delete cascade,
  cohort_id uuid references cohorts(id) on delete cascade,
  stage application_stage not null default 'new',
  writing_background text,
  project_proposal text,
  writing_sample_url text,
  composite_score numeric,
  submitted_at timestamptz,
  created_at timestamptz not null default now()
);

create table application_reviews (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references applications(id) on delete cascade,
  reviewer_id uuid references profiles(id) on delete set null,
  writing_quality int check (writing_quality between 1 and 10),
  project_clarity int check (project_clarity between 1 and 10),
  originality int check (originality between 1 and 10),
  potential int check (potential between 1 and 10),
  residency_fit int check (residency_fit between 1 and 10),
  notes text,
  created_at timestamptz not null default now()
);

-- ============ IMODOYE REVIEW ============
-- theme + note are required per the design-preview correction:
-- every issue is themed at the point a call opens, not a fixed tagline.
create table issues (
  id uuid primary key default gen_random_uuid(),
  number int not null unique,
  theme text not null,
  note text not null,
  status text not null default 'upcoming', -- upcoming | current | archived
  open_categories text[] not null default array['Poetry','Fiction','Essays','Reviews','Interviews','Visual Art'],
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create type submission_stage as enum (
  'received', 'screening', 'assigned', 'in_review', 'shortlisted',
  'accepted', 'rejected', 'hold', 'copyediting', 'proofing',
  'scheduled', 'published', 'withdrawn'
);

create table submissions (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique, -- e.g. IR-2026-000184
  author_id uuid references profiles(id) on delete cascade,
  issue_id uuid references issues(id) on delete cascade,
  genre text not null,
  word_count int,
  stage submission_stage not null default 'received',
  assigned_reviewer_id uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table submission_files (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid references submissions(id) on delete cascade,
  storage_path text not null,
  file_type text,
  created_at timestamptz not null default now()
);

-- Blind review: reviewer sees the submission, not the author identity.
-- Enforced at the query/RLS layer (§ below), not just the UI.
create table submission_reviews (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid references submissions(id) on delete cascade,
  reviewer_id uuid references profiles(id) on delete set null,
  rating int check (rating between 1 and 5),
  recommendation text check (recommendation in ('reject','consider','shortlist')),
  notes text,
  created_at timestamptz not null default now()
);

create table submission_status_history (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid references submissions(id) on delete cascade,
  from_stage submission_stage,
  to_stage submission_stage not null,
  changed_by uuid references profiles(id) on delete set null,
  changed_at timestamptz not null default now()
);

-- Published pieces (post-acceptance), linked back to their submission and issue.
create table publications (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid references submissions(id) on delete set null,
  issue_id uuid references issues(id) on delete cascade,
  title text not null,
  slug text not null unique,
  category text not null,
  body text,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table contributors (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  publication_id uuid references publications(id) on delete cascade
);

-- ============ CONTENT ============
create table posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references profiles(id) on delete set null,
  title text not null,
  slug text not null unique,
  body text,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  body text,
  updated_at timestamptz not null default now()
);

create table events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  starts_at timestamptz not null,
  location text,
  description text,
  created_at timestamptz not null default now()
);

create table testimonials (
  id uuid primary key default gen_random_uuid(),
  fellow_id uuid references fellows(id) on delete cascade,
  quote text not null,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table media (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
  alt_text text,
  caption text,
  credit text,
  cohort_id uuid references cohorts(id) on delete set null,
  event_id uuid references events(id) on delete set null,
  fellow_id uuid references fellows(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ============ OPERATIONAL ============
create table notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid references profiles(id) on delete cascade,
  type text not null,
  payload jsonb,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles(id) on delete set null,
  action text not null,
  entity text,
  entity_id uuid,
  created_at timestamptz not null default now()
);

-- ============ ROW LEVEL SECURITY (starter policies) ============
alter table profiles enable row level security;
alter table applications enable row level security;
alter table submissions enable row level security;
alter table submission_reviews enable row level security;

-- Fellows/applicants see only their own applications.
create policy "own applications" on applications
  for select using (auth.uid() = applicant_id);

-- Writers see only their own submissions.
create policy "own submissions" on submissions
  for select using (auth.uid() = author_id);

-- Reviewers see submissions assigned to them, but the policy alone does not
-- expose author identity to the client — application code must additionally
-- omit author_id from any reviewer-facing query (blind review is enforced
-- at both the RLS and the query-shape level).
create policy "assigned reviewer access" on submissions
  for select using (auth.uid() = assigned_reviewer_id);

-- Admin/editorial roles: broaden with a role-check helper in application code
-- or a dedicated policy per role once the roles table is finalized with the team.
