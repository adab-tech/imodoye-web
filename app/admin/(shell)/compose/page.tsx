import { sql } from "@/lib/db";
import { sendNewEmail } from "./actions";
import RichTextEditor from "../posts/RichTextEditor";

export const metadata = { title: "Compose — Imodoye Admin" };
export const dynamic = "force-dynamic";

export default async function ComposePage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const mailboxes = await sql`select address, display_name from mailboxes order by address`;

  return (
    <div className="max-w-xl">
      <p className="font-mono text-xs mb-3 text-indigo">MAIL</p>
      <h1 className="font-display text-3xl mb-8">Compose</h1>

      <div className="bg-paper rounded p-6">
        {searchParams.error && (
          <p className="font-ui text-sm text-terracotta mb-4">{searchParams.error}</p>
        )}
        <form action={sendNewEmail} className="space-y-4">
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
            <label className="block font-ui text-sm mb-1 opacity-70">To</label>
            <input
              name="to"
              type="email"
              required
              placeholder="someone@example.com"
              className="w-full px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm"
            />
          </div>
          <div>
            <label className="block font-ui text-sm mb-1 opacity-70">Subject</label>
            <input
              name="subject"
              required
              className="w-full px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm"
            />
          </div>
          <div>
            <label className="block font-ui text-sm mb-1 opacity-70">Message</label>
            <RichTextEditor name="body" />
          </div>
          <button type="submit" className="font-ui text-sm px-4 py-2 bg-indigo text-paper rounded-sm">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
