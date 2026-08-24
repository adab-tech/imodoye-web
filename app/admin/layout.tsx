// Forces every fetch() issued anywhere under /admin (including the ones
// @neondatabase/serverless makes internally) to bypass Next.js's fetch
// cache. Without this, a query with identical text/params (e.g. the
// COUNT(*) checks in /admin/login and /admin/setup) can silently return a
// stale, previously-cached result instead of hitting the live database —
// scoped here rather than globally so it doesn't break the public pages'
// intentional ISR (revalidate = 60).
export const fetchCache = "force-no-store";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
