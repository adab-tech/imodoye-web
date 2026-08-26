import { Resend } from "resend";
import { sql } from "@/lib/db";

// Lazy-constructed so a missing key fails at send time with a clear message,
// not at import time (which would crash every page that imports this module).
function client() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("Email isn't configured yet — set RESEND_API_KEY.");
  }
  return new Resend(process.env.RESEND_API_KEY);
}

const FROM = process.env.EMAIL_FROM || "Imodoye <hello@imodoye.ng>";

// Display name for a mailboxes row, so a reply's "From" matches the persona
// a sender actually wrote to (editorial@/submissions@ vs the general
// hello@) instead of always showing as the same address. Falls back to a
// generic name for an address with no row (e.g. one just typed by an admin).
export async function fromAddressFor(address: string) {
  const rows = await sql`select display_name from mailboxes where address = ${address.toLowerCase()}`;
  const name = rows[0]?.display_name ?? "Imodoye";
  return `${name} <${address}>`;
}

async function logSend(entry: {
  from: string;
  to: string;
  subject: string;
  context?: string;
  status: "sent" | "failed";
  error?: string;
}) {
  // Best-effort — a logging failure should never mask the real send result.
  try {
    await sql`
      insert into sent_emails (from_address, to_address, subject, context, status, error)
      values (${entry.from}, ${entry.to}, ${entry.subject}, ${entry.context ?? null}, ${entry.status}, ${entry.error ?? null})
    `;
  } catch (err) {
    console.error("Failed to log sent email:", err);
  }
}

export async function sendEmail({
  to,
  subject,
  html,
  from,
  context,
}: {
  to: string;
  subject: string;
  html: string;
  from?: string;
  context?: string;
}) {
  const fromAddress = from ?? FROM;
  const { error } = await client().emails.send({ from: fromAddress, to, subject, html });
  await logSend({
    from: fromAddress,
    to,
    subject,
    context,
    status: error ? "failed" : "sent",
    error: error?.message,
  });
  if (error) throw new Error(error.message ?? "Failed to send email.");
}

// Sent via Resend's batch endpoint (max 100 per call) rather than a loop of
// single sends — keeps a broadcast to a few hundred subscribers well inside
// a serverless function's request timeout.
export async function sendBroadcast(
  subject: string,
  html: string,
  recipients: { email: string; unsubscribe_token: string }[]
) {
  const resend = client();
  for (let i = 0; i < recipients.length; i += 100) {
    const batch = recipients.slice(i, i + 100);
    const { error } = await resend.batch.send(
      batch.map((r) => ({
        from: FROM,
        to: r.email,
        subject,
        html: `${html}<p style="font-size:12px;color:#888;margin-top:32px;">
          <a href="https://imodoye.ng/unsubscribe?token=${r.unsubscribe_token}">Unsubscribe</a>
        </p>`,
      }))
    );
    await Promise.all(
      batch.map((r) =>
        logSend({
          from: FROM,
          to: r.email,
          subject,
          context: "newsletter_broadcast",
          status: error ? "failed" : "sent",
          error: error?.message,
        })
      )
    );
    if (error) throw new Error(error.message ?? "Failed to send broadcast.");
  }
}
