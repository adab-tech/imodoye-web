# Imodoye — Web Application

Next.js + Neon Postgres codebase, implementing the architecture agreed in `workplan.md`. **Live at [imodoye.ng](https://imodoye.ng)**, deployed on Vercel with auto-deploy on push to `main`.

## What's actually implemented here

- Next.js 14 (App Router) + TypeScript + Tailwind, with brand colors and the Fraunces/Space Grotesk/Space Mono type system wired into `tailwind.config.ts` and `app/layout.tsx`
- Real homepage (`app/page.tsx`) — the design-preview homepage, ported to actual Tailwind/Next code
- `SiteNav` / `SiteFooter` components
- Neon Postgres, connected via the Vercel–Neon integration (`lib/db.ts`, using `@neondatabase/serverless`)
- **Full Postgres schema** (`db/schema.sql`), applied to the live Neon database — fellows, cohorts, applications, submissions, issues (with `theme`/`note` as required fields per the theme-per-issue correction), publications, testimonials, partners, media, notifications, audit logs. Re-run with `npm run db:apply-schema` after editing the schema.
- Verified: `npm install` succeeds, `npx tsc --noEmit` passes clean (no type errors)

## What hasn't happened yet

- No real auth, application form submission, or email sending wired up — pages still render from `lib/mock-data.ts`, not live queries. RLS-equivalent access rules are sketched (commented out) in `db/schema.sql` pending an auth provider decision.
- Deployment Protection (Vercel SSO) is on for preview/`*.vercel.app` URLs but excluded on the custom domain — fine for now, revisit before inviting outside reviewers to preview links.

## Running this locally

```bash
npm install
vercel env pull .env.local   # pulls the live Neon DATABASE_URL
npm run dev
```

## Deployment

Connected to GitHub (`adab-tech/imodoye-web`, `main` branch) — pushing to `main` triggers a production deploy automatically. Vercel project: `imodoye-web` under `adab-techs-projects`.

## Suggested next steps

1. Wire real pages to Neon queries via `lib/db.ts`, replacing `lib/mock-data.ts` one export at a time (shapes are already matched to `db/schema.sql`)
2. Choose an auth provider (Neon Auth is already provisioned — `NEON_AUTH_BASE_URL` / `VITE_NEON_AUTH_URL` are in the env) and re-enable the RLS-equivalent access rules
3. Build out the new content sections: Past Fellows (photos/bios/publications), Impact stats, Publications archive, Residency Archive (per-cohort), Partners & Supporters
4. Port the remaining preview pages (application form submission, Review issue pages) from static mock data to real, data-connected flows
