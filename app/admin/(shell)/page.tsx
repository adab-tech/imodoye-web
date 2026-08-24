import Link from "next/link";
import { sql } from "@/lib/db";

export const metadata = { title: "Dashboard — Imodoye Admin" };
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [[fellows], [partners], [publications]] = await Promise.all([
    sql`select count(*)::int as count from fellows`,
    sql`select count(*)::int as count from partners`,
    sql`select count(*)::int as count from publications`,
  ]);

  const cards = [
    { label: "Fellows", count: fellows.count, href: "/admin/fellows" },
    { label: "Partners", count: partners.count, href: "/admin/partners" },
    { label: "Publications", count: publications.count, href: "/admin/publications" },
  ];

  return (
    <div>
      <p className="font-mono text-xs mb-3 text-indigo">DASHBOARD</p>
      <h1 className="font-display text-3xl mb-8">Welcome back</h1>

      <div className="grid grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="bg-paper rounded p-5 block">
            <p className="font-display text-3xl mb-1">{c.count}</p>
            <p className="font-ui text-sm opacity-60">{c.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
