import Link from "next/link";
import { sql } from "@/lib/db";

export const metadata = { title: "Publications — Imodoye Admin" };
export const dynamic = "force-dynamic";

export default async function AdminPublicationsPage() {
  const entries = await sql`select id, title, author, category, venue from publication_entries order by category, title`;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-xs mb-3 text-indigo">PUBLICATIONS</p>
          <h1 className="font-display text-3xl">{entries.length} entries</h1>
        </div>
        <Link href="/admin/publications/new" className="font-ui text-sm px-4 py-2 bg-indigo text-paper rounded-sm">
          + New entry
        </Link>
      </div>

      <div className="bg-paper rounded divide-y divide-ink/10">
        {entries.map((e) => (
          <Link key={e.id} href={`/admin/publications/${e.id}`} className="flex items-center justify-between px-5 py-4 hover:bg-ink/5">
            <div>
              <p className="font-ui text-base">{e.title}</p>
              <p className="font-mono text-xs opacity-50">{e.author} · {e.venue ?? "—"}</p>
            </div>
            <span className="font-mono text-xs text-terracotta">{e.category.toUpperCase()}</span>
          </Link>
        ))}
        {entries.length === 0 && <p className="px-5 py-8 font-ui text-sm opacity-50">No entries yet.</p>}
      </div>
    </div>
  );
}
