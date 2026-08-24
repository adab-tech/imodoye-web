import Link from "next/link";
import { sql } from "@/lib/db";

export const metadata = { title: "Fellows — Imodoye" };
export const revalidate = 60;

export default async function FellowsPage() {
  const fellows = await sql`
    select f.slug, f.name, f.genre, f.location, f.avatar_url, c.number as cohort_number
    from fellows f
    left join cohorts c on c.id = f.cohort_id
    order by c.number nulls last, f.name
  `;

  return (
    <section className="px-6 py-16 md:px-16 max-w-3xl">
      <p className="font-mono text-xs mb-3 text-indigo">FELLOWS</p>
      <h1 className="font-display text-4xl mb-10">The directory</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {fellows.map((f) => (
          <Link
            key={f.slug}
            href={`/fellows/${f.slug}`}
            className="bg-paper rounded p-5 block"
          >
            {f.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={f.avatar_url} alt={f.name} className="w-10 h-10 rounded-full mb-3 object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-indigo/10 mb-3 flex items-center justify-center font-mono text-xs text-indigo">
                {f.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
              </div>
            )}
            <p className="font-display text-lg mb-0.5">{f.name}</p>
            <p className="font-mono text-xs text-terracotta">
              COHORT {f.cohort_number ?? "—"} · {(f.genre ?? "—").toUpperCase()} · {(f.location ?? "—").toUpperCase()}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
