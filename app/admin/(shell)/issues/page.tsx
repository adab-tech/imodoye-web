import Link from "next/link";
import { sql } from "@/lib/db";

export const metadata = { title: "Issues — Imodoye Admin" };
export const dynamic = "force-dynamic";

export default async function AdminIssuesPage() {
  const issues = await sql`select id, number, theme, status from issues order by number`;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-xs mb-3 text-indigo">IMODOYE REVIEW</p>
          <h1 className="font-display text-3xl">{issues.length} issues</h1>
        </div>
        <Link href="/admin/issues/new" className="font-ui text-sm px-4 py-2 bg-indigo text-paper rounded-sm">
          + New issue
        </Link>
      </div>

      <div className="bg-paper rounded divide-y divide-ink/10">
        {issues.map((i) => (
          <Link key={i.id} href={`/admin/issues/${i.id}`} className="flex items-center justify-between px-5 py-4 hover:bg-ink/5">
            <div>
              <p className="font-ui text-base">Issue {String(i.number).padStart(2, "0")} — {i.theme}</p>
            </div>
            <span className="font-mono text-xs text-terracotta">{i.status.toUpperCase()}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
