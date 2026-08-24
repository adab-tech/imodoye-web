import { notFound } from "next/navigation";
import { sql } from "@/lib/db";

export const revalidate = 60;

export async function generateStaticParams() {
  const rows = await sql`select slug from fellows where slug is not null`;
  return rows.map((r) => ({ slug: r.slug }));
}

export default async function FellowProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const rows = await sql`
    select f.*, c.number as cohort_number
    from fellows f
    left join cohorts c on c.id = f.cohort_id
    where f.slug = ${params.slug}
  `;
  const fellow = rows[0];
  if (!fellow) return notFound();

  const works = await sql`
    select title, venue, genre from fellow_published_works
    where fellow_id = ${fellow.id} order by sort_order
  `;

  return (
    <section className="px-6 py-16 md:px-16 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        {fellow.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={fellow.avatar_url}
            alt={fellow.name}
            className="rounded-full object-cover"
            style={{ width: 72, height: 72 }}
          />
        ) : (
          <div
            className="rounded-full bg-indigo/10 flex items-center justify-center font-mono text-sm text-indigo"
            style={{ width: 72, height: 72 }}
          >
            {fellow.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
          </div>
        )}
        <div>
          <h1 className="font-display text-3xl">{fellow.name}</h1>
          <p className="font-mono text-sm text-terracotta">
            COHORT {fellow.cohort_number ?? "—"} · {(fellow.genre ?? "—").toUpperCase()} · {(fellow.location ?? "—").toUpperCase()}
          </p>
        </div>
      </div>

      {fellow.bio && (
        <p className="font-ui mb-8 max-w-lg opacity-80 leading-relaxed">
          {fellow.bio}
        </p>
      )}

      {works.length > 0 && (
        <>
          <p className="font-mono text-xs mb-3 text-indigo">PUBLISHED WORK</p>
          <div className="space-y-3 mb-10">
            {works.map((w) => (
              <div
                key={w.title}
                className="flex justify-between items-baseline pb-3 border-b border-ink/10"
              >
                <div>
                  <p className="font-display text-lg">{w.title}</p>
                  <p className="font-ui text-sm opacity-60">{w.venue}</p>
                </div>
                {w.genre && (
                  <span className="font-mono text-xs text-terracotta">
                    {w.genre.toUpperCase()}
                  </span>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {fellow.testimonial && (
        <>
          <p className="font-mono text-xs mb-3 text-palm">TESTIMONIAL</p>
          <blockquote className="font-display italic text-xl text-indigo leading-relaxed">
            &#8220;{fellow.testimonial}&#8221;
          </blockquote>
        </>
      )}
    </section>
  );
}
