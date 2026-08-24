import Link from "next/link";
import { sql } from "@/lib/db";
import { PARTNER_CATEGORY_LABELS, type PartnerCategoryDb } from "@/lib/categories";

export const metadata = { title: "Partners — Imodoye Admin" };
export const dynamic = "force-dynamic";

export default async function AdminPartnersPage() {
  const partners = await sql`select id, name, category, featured from partners order by category, name`;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-xs mb-3 text-indigo">PARTNERS &amp; SUPPORTERS</p>
          <h1 className="font-display text-3xl">{partners.length} listed</h1>
        </div>
        <Link href="/admin/partners/new" className="font-ui text-sm px-4 py-2 bg-indigo text-paper rounded-sm">
          + New partner
        </Link>
      </div>

      <div className="bg-paper rounded divide-y divide-ink/10">
        {partners.map((p) => (
          <Link key={p.id} href={`/admin/partners/${p.id}`} className="flex items-center justify-between px-5 py-4 hover:bg-ink/5">
            <div>
              <p className="font-ui text-base">{p.name}</p>
              <p className="font-mono text-xs opacity-50">
                {PARTNER_CATEGORY_LABELS[p.category as PartnerCategoryDb]?.toUpperCase()}
              </p>
            </div>
            {p.featured && <span className="font-mono text-xs text-gold">FEATURED</span>}
          </Link>
        ))}
        {partners.length === 0 && <p className="px-5 py-8 font-ui text-sm opacity-50">No partners yet.</p>}
      </div>
    </div>
  );
}
