import { notFound } from "next/navigation";
import Link from "next/link";
import { sql } from "@/lib/db";
import { replyToEmail } from "../actions";
import RichTextEditor from "../../posts/RichTextEditor";

export const metadata = { title: "Message — Imodoye Admin" };
export const dynamic = "force-dynamic";

export default async function InboxDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { error?: string };
}) {
  const rows = await sql`select * from inbound_emails where id = ${params.id}`;
  const email = rows[0];
  if (!email) return notFound();

  const boundReply = replyToEmail.bind(null, params.id);

  return (
    <div className="max-w-2xl">
      <Link href="/admin/inbox" className="font-ui text-sm opacity-60 mb-6 inline-block">
        ← Inbox
      </Link>

      <div className="bg-paper rounded p-6 mb-6">
        <p className="font-mono text-xs mb-1 opacity-50">
          {email.from_address} → {email.to_address} ·{" "}
          {new Date(email.received_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </p>
        <h1 className="font-display text-2xl mb-4">{email.subject || "(no subject)"}</h1>
        {/* Plain text only — this body comes from an unauthenticated sender,
            so the HTML version is never rendered (stored-XSS risk). */}
        <p className="font-ui text-sm opacity-80 whitespace-pre-wrap">
          {email.text_body || "(no plain-text body was included with this message)"}
        </p>
      </div>

      <div className="bg-paper rounded p-6">
        <p className="font-mono text-xs mb-4 opacity-50">
          REPLY BY EMAIL {email.status === "replied" ? "· ALREADY REPLIED" : ""}
        </p>
        {searchParams.error && (
          <p className="font-ui text-sm text-terracotta mb-4">{searchParams.error}</p>
        )}
        <form action={boundReply} className="space-y-4">
          <div>
            <label className="block font-ui text-sm mb-1 opacity-70">Subject</label>
            <input
              name="subject"
              required
              defaultValue={email.subject ? `Re: ${email.subject}` : "Re: your message to Imodoye"}
              className="w-full px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm"
            />
          </div>
          <div>
            <label className="block font-ui text-sm mb-1 opacity-70">Message</label>
            <RichTextEditor name="body" />
          </div>
          <button type="submit" className="font-ui text-sm px-4 py-2 bg-indigo text-paper rounded-sm">
            Send reply
          </button>
        </form>
      </div>
    </div>
  );
}
