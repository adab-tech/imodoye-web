import Link from "next/link";
import { sql } from "@/lib/db";
import { markInquiryStatus, deleteInquiry } from "./actions";

export const metadata = { title: "Inquiries — Imodoye Admin" };
export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage() {
  const inquiries = await sql`select * from inquiries order by created_at desc`;

  return (
    <div>
      <p className="font-mono text-xs mb-3 text-indigo">CONTACT</p>
      <h1 className="font-display text-3xl mb-8">{inquiries.length} inquiries</h1>

      <div className="space-y-3 max-w-2xl">
        {inquiries.map((i) => (
          <div key={i.id} className="bg-paper rounded p-5">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-ui text-base">{i.name}</p>
                <p className="font-mono text-xs opacity-50">{i.email} · {new Date(i.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
              </div>
              <span className={`font-mono text-xs ${i.status === "new" ? "text-terracotta" : "opacity-40"}`}>
                {i.status.toUpperCase()}
              </span>
            </div>
            <p className="font-ui text-sm opacity-80 mb-4 whitespace-pre-wrap">{i.message}</p>
            <div className="flex gap-3">
              <Link href={`/admin/inquiries/${i.id}`} className="font-mono text-xs underline text-indigo">
                reply
              </Link>
              {i.status !== "read" && (
                <form action={markInquiryStatus.bind(null, i.id, "read")}>
                  <button type="submit" className="font-mono text-xs underline opacity-60">mark read</button>
                </form>
              )}
              {i.status !== "replied" && (
                <form action={markInquiryStatus.bind(null, i.id, "replied")}>
                  <button type="submit" className="font-mono text-xs underline opacity-60">mark replied</button>
                </form>
              )}
              <form action={deleteInquiry.bind(null, i.id)}>
                <button type="submit" className="font-mono text-xs underline text-terracotta">delete</button>
              </form>
            </div>
          </div>
        ))}
        {inquiries.length === 0 && <p className="font-ui text-sm opacity-50">No messages yet.</p>}
      </div>
    </div>
  );
}
