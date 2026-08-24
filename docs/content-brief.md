# Content brief — sections pending before launch

The site now has structure for every section below, live at their real URLs.
Nothing on these pages is fabricated — sections without confirmed content
show an honest "coming soon" state instead of placeholder text. This doc is
what the content/programme team needs to supply to fill each one in.

## Past Fellows — `/fellows`

Currently 3 fellows in the directory (cohorts 1 and 5 only). Per fellow, need:

- **Photo** — headshot, square crop, at least 400×400px. Until supplied, the
  directory shows initials in a circle instead.
- **Bio** — 1-3 sentences, third person, matching the tone of the 3 existing
  entries (see `lib/mock-data.ts`)
- **Publications** — title, venue, genre, for anything published during or
  after the residency
- Full roster for cohorts 2, 3, 4, 6, 7 (currently undocumented)

## Impact — section on `/about`

Three numbers, one of which is already live (sourced from existing About
copy, not invented):

- ✅ **Cohorts completed: 7** — already shown
- ⬜ **Writers supported** — total across all cohorts
- ⬜ **States represented** — count of distinct Nigerian states fellows have
  come from (needs `state` recorded per fellow — the field now exists in
  the database schema, `db/schema.sql`)

## Publications — `/publications`

Currently empty in every category. Need entries for:

- **Anthologies**
- **Essays**
- **Stories**
- **Poetry**

Per entry: title, author, venue (e.g. "Imodoye Review, Issue 01" or an
external publication), and optionally a link.

## Residency Archive — `/residency/archive`

One entry per cohort (1 through 7), currently showing only cohort number.
Per cohort, need:

- Fellow roster (names) — see Past Fellows above
- Photos — group or individual, from the residency period
- Optional: a short highlight/summary per cohort

## Partners & Supporters — `/partners`

Two confirmed institutional partners are live (Association of Nigerian
Authors, Ebedi International Writers Residency). Need, per category:

- **Donors** — none listed yet. Name + optional blurb/logo per donor.
- **Universities** — none listed yet.
- **Cultural Institutions** — the 2 above are covered; more can be added.

Logos are optional for v1 — text listing is sufficient to launch.

## Not in this brief

These items from the "keep from original" list already exist and don't need
new content: Program highlights, Eligibility section, Application
information (`/residency`, `/residency/apply`), Alumni testimonials
(`/fellows/[slug]`), Cohort gallery (folded into Residency Archive above).

## How to get content into the site

Send fellow bios/photos, publication entries, partner names, and cohort
details to engineering (or drop them in a shared doc/sheet) — each maps
directly to a field in `lib/mock-data.ts` today, and to a table in
`db/schema.sql` once the site moves off mock data to live Neon queries.
