"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { requireRole, CONTENT_ROLES } from "@/lib/auth";
import { sendEmail, fromAddressFor } from "@/lib/email";
import { attachmentsFromFormData } from "@/lib/upload";

const APPLICATION_STAGES = [
  "new",
  "screening",
  "shortlisted",
  "interview",
  "selected",
  "waitlist",
  "declined",
];

export async function updateApplicationStage(id: string, formData: FormData) {
  await requireRole(CONTENT_ROLES);
  const stage = String(formData.get("stage") ?? "");
  if (!APPLICATION_STAGES.includes(stage)) throw new Error("Choose a valid stage.");

  await sql`update applications set stage = ${stage} where id = ${id}`;
  revalidatePath("/admin/applications");
  revalidatePath(`/admin/applications/${id}`);
}

export async function emailApplicant(id: string, formData: FormData) {
  await requireRole(CONTENT_ROLES);
  const subject = String(formData.get("subject") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  if (!subject || !body) throw new Error("Subject and message are required.");

  const rows = await sql`
    select p.email from applications a join profiles p on p.id = a.applicant_id where a.id = ${id}
  `;
  const email = rows[0]?.email;
  if (!email) throw new Error("This applicant has no email on file.");

  const chosenFrom = String(formData.get("from") ?? "").trim() || "hello@imodoye.ng";
  const attachments = await attachmentsFromFormData(formData, "attachments", "outbound-attachments");

  try {
    await sendEmail({
      to: email,
      subject,
      html: body,
      from: await fromAddressFor(chosenFrom),
      context: "application_reply",
      attachments,
    });
  } catch (err) {
    redirect(`/admin/applications/${id}?error=${encodeURIComponent((err as Error).message)}`);
  }
  await sql`update applications set last_contacted_at = now() where id = ${id}`;
  revalidatePath(`/admin/applications/${id}`);
}
