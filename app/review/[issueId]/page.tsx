import { notFound } from "next/navigation";
import Link from "next/link";
import { sql } from "@/lib/db";
import SubmitForm from "./SubmitForm";

export const revalidate = 60;

export async function generateStaticParams() {
  const rows = await sql`select number from issues`;
  return rows.map((r) => ({ issueId: String(r.number) }));
}

export default async function IssuePage({
  params,
}: {
  params: { issueId: string };
}) {
  const rows = await sql`select * from issues where number = ${Number(params.issueId)}`;
  const issue = rows[0];
  if (!issue) return notFound();

  const pieces = await sql`
    select title, slug, category, published_at from publications
    where issue_id = ${issue.id} and published_at is not null
    order by published_at desc
  `;

  return (
    <section className="px-6 py-16 md:px-16 bg-ink text-manuscript min-h-[60vh]">
      <div className="max-w-2xl">
        <Link
          href="/review"
          className="font-ui text-sm opacity-60 mb-8 inline-block"
        >
          ← All issues
        </Link>
        <p className="font-mono text-xs mb-3 text-gold">
          ISSUE {String(issue.number).padStart(2, "0")} ·{" "}
          {issue.status === "current"
            ? "NOW ACCEPTING SUBMISSIONS"
            : issue.status.toUpperCase()}
        </p>
        <h1 className="font-display text-5xl mb-3">{issue.theme}</h1>
        <p className="font-ui mb-10 opacity-65 max-w-md">{issue.note}</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {issue.open_categories.map((c: string) => (
            <div
              key={c}
              className="font-ui text-sm px-4 py-3 border border-manuscript/20 rounded-sm opacity-90"
            >
              {c}
            </div>
          ))}
        </div>

        {pieces.length > 0 && (
          <div className="mb-10">
            <p className="font-mono text-xs mb-4 opacity-50">IN THIS ISSUE</p>
            <div className="space-y-4">
              {pieces.map((p) => (
                <Link
                  key={p.slug}
                  href={`/review/${params.issueId}/${p.slug}`}
                  className="block p-4 border border-manuscript/15 rounded-sm hover:border-manuscript/40"
                >
                  <p className="font-mono text-xs mb-1 opacity-50">{p.category?.toUpperCase()}</p>
                  <p className="font-display text-xl">{p.title}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {issue.status === "current" ? (
          <SubmitForm issueId={issue.id} categories={issue.open_categories} />
        ) : (
          <p className="font-ui text-sm opacity-50">This issue isn&#39;t open for submissions.</p>
        )}
      </div>
    </section>
  );
}
