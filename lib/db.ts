import { neon } from "@neondatabase/serverless";

// fetchOptions: { cache: "no-store" } is required — @neondatabase/serverless
// issues its queries via the global fetch(), which Next.js's App Router
// patches to cache and dedupe by default. Without this, identical query text
// (e.g. the same COUNT(*) run on every request) can silently return a stale,
// previously-cached result instead of hitting the live database.
export const sql = neon(process.env.DATABASE_URL!, {
  fetchOptions: { cache: "no-store" },
});
