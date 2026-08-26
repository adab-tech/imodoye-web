import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { sql } from "@/lib/db";

// Resend has no mailbox of its own — every email sent to @imodoye.ng is
// parsed and POSTed here as an `email.received` event. This is the only
// way mail sent to the domain reaches anywhere a human can read it (see
// the admin Inbox page, backed by the inbound_emails table).
export async function POST(req: NextRequest) {
  const payload = await req.text();

  let event;
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    event = resend.webhooks.verify({
      payload,
      headers: {
        id: req.headers.get("svix-id") ?? "",
        timestamp: req.headers.get("svix-timestamp") ?? "",
        signature: req.headers.get("svix-signature") ?? "",
      },
      webhookSecret: process.env.RESEND_WEBHOOK_SECRET ?? "",
    });
  } catch {
    return new NextResponse("Invalid webhook", { status: 400 });
  }

  if (event.type === "email.received") {
    const data = event.data as {
      from: string;
      to: string[];
      subject?: string;
      text?: string;
      html?: string;
    };
    await sql`
      insert into inbound_emails (from_address, to_address, subject, text_body, html_body)
      values (${data.from}, ${data.to?.[0] ?? ""}, ${data.subject ?? null}, ${data.text ?? null}, ${data.html ?? null})
    `;
  }

  return NextResponse.json({ received: true });
}
