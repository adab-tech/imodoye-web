import Link from "next/link";
import { sql } from "@/lib/db";

export const metadata = { title: "About — Imodoye" };
export const revalidate = 60;

export default async function AboutPage() {
  const [[{ count: cohortsCompleted }], partners] = await Promise.all([
    sql`select count(*)::int as count from cohorts`,
    sql`select name from partners order by category, name`,
  ]);

  return (
    <section className="px-6 py-16 md:px-16 max-w-2xl">
      <p className="font-mono text-xs mb-3 text-indigo">ABOUT</p>
      <h1 className="font-display text-4xl mb-6">Our story</h1>
      <p className="font-ui mb-5 opacity-80 leading-relaxed">
        Imodoye was founded in Ilorin, Kwara State, by Dr. Usman Oladipo
        Akanbi, President of the Association of Nigerian Authors — the first
        writers&#39; residency of its kind in Northern Nigeria, drawing on his
        late father&#39;s lifelong commitment to community.
      </p>
      <p className="font-ui mb-10 opacity-80 leading-relaxed">
        Seven cohorts later, Imodoye has grown into an established fellowship
        with its own literary journal — built to be judged by international
        editorial standards without losing its Ilorin roots.
      </p>

      <p className="font-mono text-xs mb-4 text-palm">IMPACT</p>
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div>
          <p className="font-display text-3xl">{cohortsCompleted}</p>
          <p className="font-ui text-sm opacity-60">Cohorts completed</p>
        </div>
        <div>
          {/* Not wired to a fellow count yet — the admin roster is still
              partial (3 of 7 cohorts entered), and a live count would
              understate the real total rather than show it. Revisit once
              the roster is complete; see docs/content-brief.md. */}
          <p className="font-display text-3xl opacity-40">—</p>
          <p className="font-ui text-sm opacity-60">Writers supported</p>
        </div>
        <div>
          <p className="font-display text-3xl opacity-40">—</p>
          <p className="font-ui text-sm opacity-60">States represented</p>
        </div>
      </div>

      <p className="font-mono text-xs mb-3 text-terracotta">
        PARTNERS &amp; SUPPORTERS
      </p>
      <p className="font-ui opacity-70 mb-3">
        {partners.map((p) => p.name).join(" · ")}
      </p>
      <Link href="/partners" className="font-ui text-sm text-indigo underline">
        View all partners &rarr;
      </Link>
    </section>
  );
}
