"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { requireRole, CONTENT_ROLES } from "@/lib/auth";
import { sendEmail } from "@/lib/email";

export async function markInquiryStatus(id: string, status: "new" | "read" | "replied") {
  await requireRole(CONTENT_ROLES);
  await sql`update inquiries set status = ${status} where id = ${id}`;
  revalidatePath("/admin/inquiries");
}

export async function replyToInquiry(id: string, formData: FormData) {
  await requireRole(CONTENT_ROLES);
  const subject = String(formData.get("subject") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  if (!subject || !body) throw new Error("Subject and message are required.");

  const rows = await sql`select email from inquiries where id = ${id}`;
  const inquiry = rows[0];
  if (!inquiry) throw new Error("That inquiry no longer exists.");

  try {
    await sendEmail({ to: inquiry.email, subject, html: body });
  } catch (err) {
    redirect(`/admin/inquiries/${id}?error=${encodeURIComponent((err as Error).message)}`);
  }
  await sql`update inquiries set status = 'replied' where id = ${id}`;

  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${id}`);
}

export async function deleteInquiry(id: string) {
  await requireRole(CONTENT_ROLES);
  await sql`delete from inquiries where id = ${id}`;
  revalidatePath("/admin/inquiries");
}
