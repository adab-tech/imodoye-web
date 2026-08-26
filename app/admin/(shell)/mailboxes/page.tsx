import { sql } from "@/lib/db";
import { createMailbox, deleteMailbox } from "./actions";

export const metadata = { title: "Mailboxes — Imodoye Admin" };
export const dynamic = "force-dynamic";

export default async function MailboxesPage() {
  const mailboxes = await sql`select * from mailboxes order by address`;

  return (
    <div className="max-w-xl">
      <p className="font-mono text-xs mb-3 text-indigo">MAIL</p>
      <h1 className="font-display text-3xl mb-2">Mailboxes</h1>
      <p className="font-ui text-sm opacity-60 mb-8">
        These are the "From" personas available across the admin's reply and email
        forms. Resend accepts mail to <em>any</em> address at imodoye.ng regardless
        of what's listed here — adding a row doesn't turn receiving on for an
        address, and deleting one doesn't turn it off. It only controls what
        shows up as a sender option in the admin UI.
      </p>

      <div className="space-y-3 mb-8">
        {mailboxes.map((m) => (
          <div key={m.id} className="bg-paper rounded p-4 flex items-center justify-between">
            <div>
              <p className="font-ui text-sm">{m.display_name}</p>
              <p className="font-mono text-xs opacity-50">{m.address}</p>
            </div>
            <form action={deleteMailbox.bind(null, m.id)}>
              <button type="submit" className="font-mono text-xs underline text-terracotta">delete</button>
            </form>
          </div>
        ))}
        {mailboxes.length === 0 && <p className="font-ui text-sm opacity-50">No mailboxes yet.</p>}
      </div>

      <div className="bg-paper rounded p-6">
        <p className="font-mono text-xs mb-4 opacity-50">ADD A MAILBOX</p>
        <form action={createMailbox} className="space-y-4">
          <div>
            <label className="block font-ui text-sm mb-1 opacity-70">Address</label>
            <input
              name="address"
              required
              placeholder="partnerships@imodoye.ng"
              className="w-full px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm"
            />
          </div>
          <div>
            <label className="block font-ui text-sm mb-1 opacity-70">Display name</label>
            <input
              name="display_name"
              required
              placeholder="Imodoye Partnerships"
              className="w-full px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm"
            />
          </div>
          <button type="submit" className="font-ui text-sm px-4 py-2 bg-indigo text-paper rounded-sm">
            Add mailbox
          </button>
        </form>
      </div>
    </div>
  );
}
