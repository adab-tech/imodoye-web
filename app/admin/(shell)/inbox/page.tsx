import Link from "next/link";
import { sql } from "@/lib/db";
import { markEmailStatus, deleteEmail } from "./actions";

export const metadata = { title: "Inbox — Imodoye Admin" };
export const dynamic = "force-dynamic";

export default async function AdminInboxPage() {
  const emails = await sql`select * from inbound_emails order by received_at desc`;

  return (
    <div>
      <p className="font-mono text-xs mb-3 text-indigo">MAIL</p>
      <h1 className="font-display text-3xl mb-8">{emails.length} messages</h1>

      <div className="space-y-3 max-w-2xl">
        {emails.map((e) => (
          <div key={e.id} className="bg-paper rounded p-5">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-ui text-base">{e.subject || "(no subject)"}</p>
                <p className="font-mono text-xs opacity-50">
                  {e.from_address} → {e.to_address} ·{" "}
                  {new Date(e.received_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <span className={`font-mono text-xs ${e.status === "new" ? "text-terracotta" : "opacity-40"}`}>
                {e.status.toUpperCase()}
              </span>
            </div>
            <p className="font-ui text-sm opacity-80 mb-4 whitespace-pre-wrap">
              {(e.text_body || "").slice(0, 280)}
            </p>
            <div className="flex gap-3">
              <Link href={`/admin/inbox/${e.id}`} className="font-mono text-xs underline text-indigo">
                reply
              </Link>
              {e.status !== "read" && (
                <form action={markEmailStatus.bind(null, e.id, "read")}>
                  <button type="submit" className="font-mono text-xs underline opacity-60">mark read</button>
                </form>
              )}
              {e.status !== "replied" && (
                <form action={markEmailStatus.bind(null, e.id, "replied")}>
                  <button type="submit" className="font-mono text-xs underline opacity-60">mark replied</button>
                </form>
              )}
              <form action={deleteEmail.bind(null, e.id)}>
                <button type="submit" className="font-mono text-xs underline text-terracotta">delete</button>
              </form>
            </div>
          </div>
        ))}
        {emails.length === 0 && <p className="font-ui text-sm opacity-50">No mail yet.</p>}
      </div>
    </div>
  );
}
