import { sql } from "@/lib/db";

export const metadata = { title: "Sent Mail — Imodoye Admin" };
export const dynamic = "force-dynamic";

const CONTEXT_LABELS: Record<string, string> = {
  inbox_reply: "Inbox reply",
  inquiry_reply: "Inquiry reply",
  application_reply: "Application email",
  comment_reply: "Comment reply",
  newsletter_broadcast: "Newsletter broadcast",
};

export default async function SentMailPage() {
  const sent = await sql`select * from sent_emails order by sent_at desc limit 200`;

  return (
    <div>
      <p className="font-mono text-xs mb-3 text-indigo">MAIL</p>
      <h1 className="font-display text-3xl mb-2">Sent mail</h1>
      <p className="font-ui text-sm opacity-60 mb-8">Most recent 200 sends, across every admin action.</p>

      <div className="space-y-2 max-w-3xl">
        {sent.map((s) => (
          <div key={s.id} className="bg-paper rounded p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="font-ui text-sm">{s.subject || "(no subject)"}</p>
              <span className={`font-mono text-xs ${s.status === "failed" ? "text-terracotta" : "opacity-40"}`}>
                {s.status.toUpperCase()}
              </span>
            </div>
            <p className="font-mono text-xs opacity-50">
              {s.from_address} → {s.to_address} ·{" "}
              {CONTEXT_LABELS[s.context ?? ""] ?? s.context ?? "—"} ·{" "}
              {new Date(s.sent_at).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </p>
            {s.status === "failed" && s.error && (
              <p className="font-ui text-xs text-terracotta mt-1">{s.error}</p>
            )}
          </div>
        ))}
        {sent.length === 0 && <p className="font-ui text-sm opacity-50">No mail sent yet.</p>}
      </div>
    </div>
  );
}
