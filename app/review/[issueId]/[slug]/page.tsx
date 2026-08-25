import { notFound } from "next/navigation";
import Link from "next/link";
import { sql } from "@/lib/db";

export const revalidate = 60;

export async function generateStaticParams() {
  const rows = await sql`
    select i.number as "issueNumber", p.slug
    from publications p join issues i on i.id = p.issue_id
    where p.published_at is not null
  `;
  return rows.map((r) => ({ issueId: String(r.issueNumber), slug: r.slug }));
}

export default async function PublicationPage({
  params,
}: {
  params: { issueId: string; slug: string };
}) {
  const rows = await sql`
    select p.title, p.body, p.category, p.published_at, i.number as issue_number, i.theme
    from publications p join issues i on i.id = p.issue_id
    where p.slug = ${params.slug} and i.number = ${Number(params.issueId)} and p.published_at is not null
  `;
  const piece = rows[0];
  if (!piece) return notFound();

  return (
    <section className="px-6 py-16 md:px-16 max-w-2xl mx-auto">
      <Link href={`/review/${params.issueId}`} className="font-ui text-sm opacity-60 mb-8 inline-block">
        ← Issue {String(piece.issue_number).padStart(2, "0")} · {piece.theme}
      </Link>

      <p className="font-mono text-xs mb-3 text-gold">
        {piece.category?.toUpperCase()} ·{" "}
        {new Date(piece.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
      </p>
      <h1 className="font-display text-4xl mb-8">{piece.title}</h1>

      {piece.body && (
        <div
          className="prose-post font-ui text-base leading-relaxed opacity-85"
          dangerouslySetInnerHTML={{ __html: piece.body }}
        />
      )}
    </section>
  );
}
