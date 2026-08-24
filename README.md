# Imodoye — Web Application (Gate 3 scaffold)

Real Next.js + Supabase starting codebase, implementing the architecture agreed in `workplan.md`. This is **not deployed and no live infrastructure has been created** — see "What hasn't happened yet" below.

## What's actually implemented here

- Next.js 14 (App Router) + TypeScript + Tailwind, with brand colors and the Fraunces/Space Grotesk/Space Mono type system wired into `tailwind.config.ts` and `app/layout.tsx`
- Real homepage (`app/page.tsx`) — the design-preview homepage, ported to actual Tailwind/Next code
- `SiteNav` / `SiteFooter` components
- Supabase browser + server client setup (`lib/supabase/`)
- **Full Postgres schema** (`supabase/schema.sql`) implementing every entity from `workplan.md` §3 — fellows, cohorts, applications, submissions, issues (with `theme`/`note` as required fields per the theme-per-issue correction), publications, testimonials, media, notifications, audit logs — plus starter RLS policies enforcing the blind-review and "fellows see only their own data" rules from §4–5
- Verified: `npm install` succeeds, `npx tsc --noEmit` passes clean (no type errors)

## What hasn't happened yet — by design

Per the workplan's approval checkpoints, none of the following have been done, and won't be without your explicit go-ahead:

- No Supabase project created — `schema.sql` is written but not run against any live database
- No Vercel project or deployment
- No domain purchased or DNS configured (this scaffold assumes `imodoye.ng` per your confirmation, but that's config, not a live registration)
- No real auth, application form submission, or email sending wired up — the application form, fellow profile, and Review pages from the design previews are not yet ported into this codebase as working, data-connected pages

## Running this locally

```bash
npm install
cp .env.example .env.local   # fill in once a Supabase project exists
npm run dev
```

Note: this sandbox's network doesn't allow fetching Google Fonts, so `npm run build` fails here specifically on font loading — that's a sandbox restriction, not a bug. It will build normally on Vercel or any machine with normal internet access. `npx tsc --noEmit` is the sandbox-safe way to verify the code is valid.

## Suggested next steps

1. Review this scaffold and the schema against `workplan.md` — confirm the data model before any table is created live
2. When ready, say the word and I'll provision a real Supabase project (with confirmation) and run this schema against it
3. Port the remaining preview pages (About, Residency, Fellows, application form, Review issue pages) from the `.jsx` design previews into real `app/` routes, wired to Supabase instead of hardcoded sample data
4. Connect Vercel for deployment once there's something worth deploying
