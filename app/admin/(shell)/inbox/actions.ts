"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { requireRole, CONTENT_ROLES } from "@/lib/auth";
import { sendEmail, fromAddressFor } from "@/lib/email";
import { attachmentsFromFormData } from "@/lib/upload";

export async function markEmailStatus(id: string, status: "new" | "read" | "replied") {
  await requireRole(CONTENT_ROLES);
  await sql`update inbound_emails set status = ${status} where id = ${id}`;
  revalidatePath("/admin/inbox");
}

export async function replyToEmail(id: string, formData: FormData) {
  await requireRole(CONTENT_ROLES);
  const subject = String(formData.get("subject") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  if (!subject || !body) throw new Error("Subject and message are required.");

  const rows = await sql`select from_address, to_address from inbound_emails where id = ${id}`;
  const email = rows[0];
  if (!email) throw new Error("That message no longer exists.");

  // Defaults to whichever address this message was received at; an admin
  // can still override via the From picker (e.g. reply as hello@ to
  // something sent to editorial@).
  const chosenFrom = String(formData.get("from") ?? "").trim() || email.to_address;
  const attachments = await attachmentsFromFormData(formData, "attachments", "outbound-attachments");

  try {
    await sendEmail({
      to: email.from_address,
      subject,
      html: body,
      from: await fromAddressFor(chosenFrom),
      context: "inbox_reply",
      attachments,
    });
  } catch (err) {
    redirect(`/admin/inbox/${id}?error=${encodeURIComponent((err as Error).message)}`);
  }
  await sql`update inbound_emails set status = 'replied' where id = ${id}`;

  revalidatePath("/admin/inbox");
  revalidatePath(`/admin/inbox/${id}`);
}

export async function deleteEmail(id: string) {
  await requireRole(CONTENT_ROLES);
  await sql`delete from inbound_emails where id = ${id}`;
  revalidatePath("/admin/inbox");
}
