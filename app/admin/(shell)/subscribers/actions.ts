"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { requireRole, CONTENT_ROLES } from "@/lib/auth";
import { sendBroadcast } from "@/lib/email";

export async function deleteSubscriber(id: string) {
  await requireRole(CONTENT_ROLES);
  await sql`delete from subscribers where id = ${id}`;
  revalidatePath("/admin/subscribers");
}

export async function sendBroadcastEmail(formData: FormData) {
  await requireRole(CONTENT_ROLES);
  const subject = String(formData.get("subject") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  if (!subject || !body) throw new Error("Subject and message are required.");

  const recipients = await sql`select email, unsubscribe_token from subscribers`;
  if (recipients.length === 0) throw new Error("There are no subscribers yet.");

  try {
    await sendBroadcast(subject, body, recipients as { email: string; unsubscribe_token: string }[]);
  } catch (err) {
    redirect(`/admin/subscribers/broadcast?error=${encodeURIComponent((err as Error).message)}`);
  }

  revalidatePath("/admin/subscribers");
  redirect("/admin/subscribers?sent=1");
}
