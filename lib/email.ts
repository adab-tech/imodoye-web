import { Resend } from "resend";

// Lazy-constructed so a missing key fails at send time with a clear message,
// not at import time (which would crash every page that imports this module).
function client() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("Email isn't configured yet — set RESEND_API_KEY.");
  }
  return new Resend(process.env.RESEND_API_KEY);
}

const FROM = process.env.EMAIL_FROM || "Imodoye <hello@imodoye.ng>";

// Display name per @imodoye.ng address, so a reply's "From" matches the
// persona a sender actually wrote to (editorial@/submissions@ vs the
// general hello@) instead of always showing as the same address.
const FROM_DISPLAY_NAMES: Record<string, string> = {
  "editorial@imodoye.ng": "Imodoye Editorial",
  "submissions@imodoye.ng": "Imodoye Editorial",
  "hello@imodoye.ng": "Imodoye",
};

export function fromAddressFor(address: string) {
  const name = FROM_DISPLAY_NAMES[address.toLowerCase()] ?? "Imodoye";
  return `${name} <${address}>`;
}

export async function sendEmail({
  to,
  subject,
  html,
  from,
}: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}) {
  const { error } = await client().emails.send({ from: from ?? FROM, to, subject, html });
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
    if (error) throw new Error(error.message ?? "Failed to send broadcast.");
  }
}
