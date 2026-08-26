"use server";

import { redirect } from "next/navigation";
import { requireRole, CONTENT_ROLES } from "@/lib/auth";
import { sendEmail, fromAddressFor } from "@/lib/email";

export async function sendNewEmail(formData: FormData) {
  await requireRole(CONTENT_ROLES);
  const to = String(formData.get("to") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const from = String(formData.get("from") ?? "").trim() || "hello@imodoye.ng";

  if (!to || !subject || !body) throw new Error("To, subject, and message are required.");

  try {
    await sendEmail({ to, subject, html: body, from: await fromAddressFor(from), context: "manual_compose" });
  } catch (err) {
    redirect(`/admin/compose?error=${encodeURIComponent((err as Error).message)}`);
  }
  redirect("/admin/sent?sent=1");
}
