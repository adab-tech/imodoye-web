import Link from "next/link";
import { sql } from "@/lib/db";

export const metadata = { title: "Fellows — Imodoye Admin" };
export const dynamic = "force-dynamic";

export default async function AdminFellowsPage() {
  const fellows = await sql`
    select f.id, f.name, f.slug, f.genre, f.location, f.featured, c.number as cohort_number
    from fellows f
    left join cohorts c on c.id = f.cohort_id
    order by c.number nulls last, f.name
  `;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-xs mb-3 text-indigo">FELLOWS</p>
          <h1 className="font-display text-3xl">{fellows.length} in the directory</h1>
        </div>
        <Link href="/admin/fellows/new" className="font-ui text-sm px-4 py-2 bg-indigo text-paper rounded-sm">
          + New fellow
        </Link>
      </div>

      <div className="bg-paper rounded divide-y divide-ink/10">
        {fellows.map((f) => (
          <Link
            key={f.id}
            href={`/admin/fellows/${f.id}`}
            className="flex items-center justify-between px-5 py-4 hover:bg-ink/5"
          >
            <div>
              <p className="font-ui text-base">{f.name}</p>
              <p className="font-mono text-xs opacity-50">
                COHORT {f.cohort_number ?? "—"} · {f.genre?.toUpperCase() ?? "—"} · {f.location ?? "—"}
              </p>
            </div>
            {f.featured && <span className="font-mono text-xs text-gold">FEATURED</span>}
          </Link>
        ))}
        {fellows.length === 0 && (
          <p className="px-5 py-8 font-ui text-sm opacity-50">No fellows yet.</p>
        )}
      </div>
    </div>
  );
}
