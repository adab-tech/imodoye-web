import Link from "next/link";
import { sql } from "@/lib/db";
import { deleteSubscriber } from "./actions";

export const metadata = { title: "Subscribers — Imodoye Admin" };
export const dynamic = "force-dynamic";

export default async function SubscribersPage({
  searchParams,
}: {
  searchParams: { sent?: string };
}) {
  const subscribers = await sql`select * from subscribers order by created_at desc`;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-xs mb-3 text-indigo">NEWSLETTER</p>
          <h1 className="font-display text-3xl">{subscribers.length} subscribers</h1>
        </div>
        <Link href="/admin/subscribers/broadcast" className="font-ui text-sm px-4 py-2 bg-indigo text-paper rounded-sm">
          Write a broadcast
        </Link>
      </div>

      {searchParams.sent && (
        <p className="font-ui text-sm text-palm mb-6">Broadcast sent.</p>
      )}

      <div className="max-w-xl space-y-2">
        {subscribers.map((s) => (
          <div key={s.id} className="flex items-center justify-between bg-paper rounded p-3">
            <div>
              <p className="font-ui text-sm">{s.email}</p>
              <p className="font-mono text-xs opacity-40">
                since {new Date(s.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
            <form action={deleteSubscriber.bind(null, s.id)}>
              <button type="submit" className="font-mono text-xs underline text-terracotta">remove</button>
            </form>
          </div>
        ))}
        {subscribers.length === 0 && <p className="font-ui text-sm opacity-50">No subscribers yet.</p>}
      </div>
    </div>
  );
}
