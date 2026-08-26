import { notFound } from "next/navigation";
import Link from "next/link";
import { sql } from "@/lib/db";
import { replyToInquiry } from "../actions";
import RichTextEditor from "../../posts/RichTextEditor";

export const metadata = { title: "Inquiry — Imodoye Admin" };
export const dynamic = "force-dynamic";

export default async function InquiryDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { error?: string };
}) {
  const rows = await sql`select * from inquiries where id = ${params.id}`;
  const inquiry = rows[0];
  if (!inquiry) return notFound();

  const mailboxes = await sql`select address, display_name from mailboxes order by address`;
  const boundReply = replyToInquiry.bind(null, params.id);

  return (
    <div className="max-w-2xl">
      <Link href="/admin/inquiries" className="font-ui text-sm opacity-60 mb-6 inline-block">
        ← Inquiries
      </Link>

      <div className="bg-paper rounded p-6 mb-6">
        <p className="font-mono text-xs mb-1 opacity-50">
          {inquiry.email} ·{" "}
          {new Date(inquiry.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </p>
        <h1 className="font-display text-2xl mb-4">{inquiry.name}</h1>
        <p className="font-ui text-sm opacity-80 whitespace-pre-wrap">{inquiry.message}</p>
      </div>

      <div className="bg-paper rounded p-6">
        <p className="font-mono text-xs mb-4 opacity-50">
          REPLY BY EMAIL {inquiry.status === "replied" ? "· ALREADY REPLIED" : ""}
        </p>
        {searchParams.error && (
          <p className="font-ui text-sm text-terracotta mb-4">{searchParams.error}</p>
        )}
        <form action={boundReply} className="space-y-4">
          <div>
            <label className="block font-ui text-sm mb-1 opacity-70">From</label>
            <select
              name="from"
              defaultValue="hello@imodoye.ng"
              className="w-full px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm bg-transparent"
            >
              {mailboxes.map((m) => (
                <option key={m.address} value={m.address}>{m.display_name} &lt;{m.address}&gt;</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-ui text-sm mb-1 opacity-70">Subject</label>
            <input
              name="subject"
              required
              defaultValue="Re: your message to Imodoye"
              className="w-full px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm"
            />
          </div>
          <div>
            <label className="block font-ui text-sm mb-1 opacity-70">Message</label>
            <RichTextEditor name="body" />
          </div>
          <div>
            <label className="block font-ui text-sm mb-1 opacity-70">Attachments (optional)</label>
            <input
              name="attachments"
              type="file"
              multiple
              className="w-full px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm"
            />
          </div>
          <button type="submit" className="font-ui text-sm px-4 py-2 bg-indigo text-paper rounded-sm">
            Send reply
          </button>
        </form>
      </div>
    </div>
  );
}
