-- IMODOYE — core schema
-- Implements workplan.md §3 (data model), §4 (editorial workflow),
-- §5 (RBAC), and the theme-per-issue correction.
-- Runs against plain Postgres (Neon). Admin auth is Auth.js Credentials,
-- verified against profiles.email/password_hash below (see lib/auth.ts) —
-- Neon Auth was left mid-provision and isn't required. The RLS policies
-- below assume a Supabase-style auth.uid() function that Neon doesn't
-- provide out of the box — they're kept as a reference for the shape of
-- the access rules but are commented out until an equivalent (a Postgres
-- session variable set per-request, most likely) is wired up at the app layer.

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
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text unique,
  password_hash text,
  role user_role not null default 'public',
  avatar_url text,
  bio text,
  location text,
  state text,
  country text,
  socials jsonb default '{}',
  created_at timestamptz not null default now()
);

-- Enforces "only one first-run admin" at the DB layer, not just the
-- check-then-insert in app/admin/setup/actions.ts (which alone has a race
-- window between two concurrent first-run requests).
create unique index if not exists profiles_one_super_admin
  on profiles ((role)) where role = 'super_admin';

-- ============ RESIDENCY / FELLOWSHIP ============
create table cohorts (
  id uuid primary key default gen_random_uuid(),
  number int not null unique,
  year int, -- nullable: exact years per cohort aren't confirmed yet
  title text,
  created_at timestamptz not null default now()
);

-- name/role/location/state/avatar_url/bio/testimonial/slug are denormalized
-- here rather than joined through profiles — v1 admin CRUD only needs a flat
-- shape matching the public fellow directory/profile pages exactly. profile_id
-- stays available for when a fellow gets a real login (e.g. as a reviewer).
create table fellows (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete set null,
  cohort_id uuid references cohorts(id) on delete set null,
  slug text unique,
  name text,
  location text,
  state text,
  avatar_url text,
  bio text,
  testimonial text,
  genre text, -- doubles as the displayed "role" (Poet, Novelist, Essayist...)
  project text,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

-- Flat title/venue/genre triples for work a fellow published elsewhere
-- (external magazines, etc.) — deliberately not the publications/contributors
-- relation below, which is specifically for pieces that went through the
-- Imodoye Review's own editorial pipeline.
create table fellow_published_works (
  id uuid primary key default gen_random_uuid(),
  fellow_id uuid references fellows(id) on delete cascade,
  title text not null,
  venue text,
  genre text,
  sort_order int not null default 0
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

-- The broader /publications archive (anthologies, essays, stories, poetry —
-- including work published outside the Imodoye Review, with an arbitrary
-- venue). Deliberately separate from `publications` above, which only
-- covers pieces that went through the Review's own editorial pipeline.
create table publication_entries (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text not null,
  category text not null check (category in ('Anthology','Essay','Story','Poetry')),
  venue text,
  url text,
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
  body text, -- Markdown, rendered on the public /posts pages
  excerpt text,
  category text, -- one of POST_CATEGORIES in lib/categories.ts
  tags text[] not null default '{}',
  cover_image_url text,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

-- A post's attached images/video, shown as a gallery after the body.
create table post_media (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade,
  storage_path text not null,
  file_type text,
  caption text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  body text,
  updated_at timestamptz not null default now()
);

-- Small editable numbers that don't warrant their own table (e.g. the
-- Impact stats on /about) — admin-settable, public pages fall back to a
-- "—" placeholder when a key is unset rather than showing a stale number.
create table site_settings (
  key text primary key,
  value text
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

-- ============ PARTNERS & SUPPORTERS ============
create type partner_category as enum (
  'donor', 'cultural_institution', 'university'
);

create table partners (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category partner_category not null,
  logo_url text,
  url text,
  blurb text,
  featured boolean not null default false,
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

-- ============ ROW LEVEL SECURITY (starter policies — reference only) ============
-- Left commented out: these assume Supabase's auth.uid(), which has no
-- equivalent on plain Neon Postgres. Re-enable once the app's auth
-- provider is chosen and an equivalent current-user function exists.
--
-- alter table profiles enable row level security;
-- alter table applications enable row level security;
-- alter table submissions enable row level security;
-- alter table submission_reviews enable row level security;
--
-- -- Fellows/applicants see only their own applications.
-- create policy "own applications" on applications
--   for select using (auth.uid() = applicant_id);
--
-- -- Writers see only their own submissions.
-- create policy "own submissions" on submissions
--   for select using (auth.uid() = author_id);
--
-- -- Reviewers see submissions assigned to them, but the policy alone does not
-- -- expose author identity to the client — application code must additionally
-- -- omit author_id from any reviewer-facing query (blind review is enforced
-- -- at both the RLS and the query-shape level).
-- create policy "assigned reviewer access" on submissions
--   for select using (auth.uid() = assigned_reviewer_id);
--
-- -- Admin/editorial roles: broaden with a role-check helper in application code
-- -- or a dedicated policy per role once the roles table is finalized with the team.
