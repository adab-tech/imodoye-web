import Link from "next/link";
import { sql } from "@/lib/db";

export const metadata = { title: "Residency Archive — Imodoye Admin" };
export const dynamic = "force-dynamic";

export default async function AdminCohortsPage() {
  const cohorts = await sql`
    select c.id, c.number, c.title, c.year,
      (select count(*)::int from fellows f where f.cohort_id = c.id) as fellow_count,
      (select count(*)::int from media m where m.cohort_id = c.id) as photo_count
    from cohorts c
    order by c.number
  `;

  return (
    <div>
      <p className="font-mono text-xs mb-3 text-indigo">RESIDENCY ARCHIVE</p>
      <h1 className="font-display text-3xl mb-8">Cohorts</h1>

      <div className="bg-paper rounded divide-y divide-ink/10">
        {cohorts.map((c) => (
          <Link key={c.id} href={`/admin/cohorts/${c.id}`} className="flex items-center justify-between px-5 py-4 hover:bg-ink/5">
            <div>
              <p className="font-ui text-base">
                Cohort {String(c.number).padStart(2, "0")}{c.title ? ` — ${c.title}` : ""}
              </p>
              <p className="font-mono text-xs opacity-50">
                {c.fellow_count} FELLOW{c.fellow_count === 1 ? "" : "S"} · {c.photo_count} PHOTO{c.photo_count === 1 ? "" : "S"}
                {c.year ? ` · ${c.year}` : ""}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
