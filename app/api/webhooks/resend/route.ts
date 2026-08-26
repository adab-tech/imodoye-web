import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { put } from "@vercel/blob";
import { sql } from "@/lib/db";

// Resend has no mailbox of its own — every email sent to @imodoye.ng is
// parsed and POSTed here as an `email.received` event. This is the only
// way mail sent to the domain reaches anywhere a human can read it (see
// the admin Inbox page, backed by the inbound_emails table).
export async function POST(req: NextRequest) {
  const payload = await req.text();
  const resend = new Resend(process.env.RESEND_API_KEY);

  let event;
  try {
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

  if (event.type !== "email.received") {
    return NextResponse.json({ received: true });
  }

  // This Resend account also serves other projects (e.g. adamu.tech) with
  // their own receiving-enabled domains. email.received fires account-wide,
  // not per-domain, so without this filter this endpoint — the only
  // webhook registered on the account — silently absorbs their mail too.
  const imodoyeRecipient = (event.data.to ?? []).find((addr) => addr.toLowerCase().endsWith("@imodoye.ng"));
  if (!imodoyeRecipient) {
    return NextResponse.json({ received: true, skipped: "not addressed to @imodoye.ng" });
  }

  // The webhook event itself carries no body content, only metadata — the
  // actual text/html requires this separate call.
  const { data: full, error: fetchError } = await resend.emails.receiving.get(event.data.email_id);
  if (fetchError || !full) {
    console.error("Failed to fetch received email body:", fetchError);
    return NextResponse.json({ received: true, error: "could not fetch email body" });
  }

  const rows = await sql`
    insert into inbound_emails (from_address, to_address, subject, text_body, html_body)
    values (${full.from}, ${imodoyeRecipient}, ${full.subject ?? null}, ${full.text}, ${full.html})
    returning id
  `;
  const inboundEmailId = rows[0].id;

  if (full.attachments.length > 0) {
    const { data: attachmentList } = await resend.emails.receiving.attachments.list({ emailId: event.data.email_id });
    for (const attachment of attachmentList?.data ?? []) {
      try {
        const res = await fetch(attachment.download_url);
        if (!res.ok) continue;
        const buffer = Buffer.from(await res.arrayBuffer());
        const blob = await put(`inbound/${inboundEmailId}/${attachment.filename ?? attachment.id}`, buffer, {
          access: "public",
          contentType: attachment.content_type,
        });
        await sql`
          insert into inbound_email_attachments (inbound_email_id, filename, content_type, url)
          values (${inboundEmailId}, ${attachment.filename ?? null}, ${attachment.content_type}, ${blob.url})
        `;
      } catch (err) {
        console.error("Failed to process inbound attachment:", err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
