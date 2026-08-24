# Imodoye — Web Application

Next.js + Neon Postgres codebase, implementing the architecture agreed in `workplan.md`. **Live at [imodoye.ng](https://imodoye.ng)**, deployed on Vercel with auto-deploy on push to `main`.

## What's actually implemented here

- Next.js 14 (App Router) + TypeScript + Tailwind, with brand colors and the Fraunces/Space Grotesk/Space Mono type system wired into `tailwind.config.ts` and `app/layout.tsx`
- Real homepage (`app/page.tsx`) — the design-preview homepage, ported to actual Tailwind/Next code
- `SiteNav` / `SiteFooter` components
- Neon Postgres, connected via the Vercel–Neon integration (`lib/db.ts`, using `@neondatabase/serverless`)
- **Full Postgres schema** (`db/schema.sql`), applied to the live Neon database — fellows, cohorts, applications, submissions, issues (with `theme`/`note` as required fields per the theme-per-issue correction), publications, testimonials, partners, media, notifications, audit logs. Re-run with `npm run db:apply-schema` after editing the schema.
- Verified: `npm install` succeeds, `npx tsc --noEmit` passes clean (no type errors)

## Admin / CMS

Live at `/admin`. First visit redirects to `/admin/setup` to create the first
super_admin account (self-service — no credentials are set by anyone but you).
After that, sign in at `/admin/login`.

Covers Fellows, Partners, Publications, and the Residency Archive (cohorts +
photos) — full create/edit/delete, with image uploads going to Vercel Blob.
The public pages (`/fellows`, `/partners`, `/publications`,
`/residency/archive`, the Impact section on `/about`) read live from the
same tables, so admin edits show up immediately.

Auth is Auth.js (Credentials provider) checked against `profiles.email` /
`password_hash` — not Neon Auth, which was left mid-provision and wasn't
needed. Roles come from the existing `user_role` enum in `db/schema.sql`;
`fellow` and `public` can't sign in to `/admin`, every other role can.

Not yet built: the Editorial Dashboard (Review submissions workflow — a
design preview exists at `imodoye-editorial-dashboard-preview.jsx`), brand
asset library, and an Inquiries inbox.

## What hasn't happened yet

- The Editorial Dashboard, brand asset library, and Inquiries inbox (see above)
- Real "writers supported" / "states represented" impact numbers — the admin
  fellow roster is still partial, so these stay honestly blank rather than
  showing a count that would understate the real total
- Deployment Protection (Vercel SSO) is on for preview/`*.vercel.app` URLs but
  excluded on the custom domain — fine for now, revisit before inviting
  outside reviewers to preview links

## Running this locally

```bash
npm install
vercel env pull .env.local   # pulls the live Neon DATABASE_URL + AUTH_SECRET + BLOB_READ_WRITE_TOKEN
npm run dev
```

Note: this sandbox's network can't reach Google Fonts, so `npm run dev`/`build`
hang here specifically on font loading — a sandbox restriction, not a bug. It
builds and runs normally on Vercel or any machine with normal internet access.

## Deployment

Connected to GitHub (`adab-tech/imodoye-web`, `main` branch) — pushing to `main` triggers a production deploy automatically. Vercel project: `imodoye-web` under `adab-techs-projects`.

## Suggested next steps

1. Sign in at `/admin/setup` and fill in the real fellow roster, partners, and publications — the site updates live as you go
2. Build the Editorial Dashboard (Review submissions workflow) from `imodoye-editorial-dashboard-preview.jsx` — blind review, stage/genre stats
3. Add a brand asset library (logo/media management) and an Inquiries inbox (new contact form + admin view) to the admin
4. Port the remaining preview pages (application form submission) from static mock data to a real, data-connected flow
5. Re-enable the RLS-equivalent access rules in `db/schema.sql` once there's a concrete need beyond the app-layer role checks already enforced in `lib/auth.ts` / `middleware.ts`
