import Link from "next/link";
import { sql } from "@/lib/db";
import { sendBroadcastEmail } from "../actions";
import RichTextEditor from "../../posts/RichTextEditor";

export const metadata = { title: "Write a broadcast — Imodoye Admin" };
export const dynamic = "force-dynamic";

export default async function BroadcastPage() {
  const rows = await sql`select count(*) from subscribers`;
  const count = Number(rows[0].count);

  return (
    <div className="max-w-2xl">
      <Link href="/admin/subscribers" className="font-ui text-sm opacity-60 mb-6 inline-block">
        ← Subscribers
      </Link>
      <p className="font-mono text-xs mb-3 text-indigo">NEWSLETTER</p>
      <h1 className="font-display text-3xl mb-4">Write a broadcast</h1>
      <p className="font-ui text-sm opacity-60 mb-6">
        Sends to all {count} subscriber{count === 1 ? "" : "s"}. Every email includes an unsubscribe link automatically.
      </p>

      <form action={sendBroadcastEmail} className="space-y-4 bg-paper rounded p-6">
        <div>
          <label className="block font-ui text-sm mb-1 opacity-70">Subject</label>
          <input name="subject" required className="w-full px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm" />
        </div>
        <div>
          <label className="block font-ui text-sm mb-1 opacity-70">Message</label>
          <RichTextEditor name="body" />
        </div>
        <button type="submit" className="font-ui text-sm px-6 py-3 bg-indigo text-paper rounded-sm">
          Send to all subscribers
        </button>
      </form>
    </div>
  );
}
