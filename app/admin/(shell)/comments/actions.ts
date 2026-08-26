"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { requireRole, CONTENT_ROLES } from "@/lib/auth";
import { sendEmail, fromAddressFor } from "@/lib/email";

export async function replyToComment(id: string, formData: FormData) {
  await requireRole(CONTENT_ROLES);
  const subject = String(formData.get("subject") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  if (!subject || !body) throw new Error("Subject and message are required.");

  const rows = await sql`select author_email from post_comments where id = ${id}`;
  const comment = rows[0];
  if (!comment) throw new Error("That comment no longer exists.");

  const chosenFrom = String(formData.get("from") ?? "").trim() || "hello@imodoye.ng";

  try {
    await sendEmail({
      to: comment.author_email,
      subject,
      html: body,
      from: await fromAddressFor(chosenFrom),
      context: "comment_reply",
    });
  } catch (err) {
    redirect(`/admin/comments?error=${encodeURIComponent((err as Error).message)}`);
  }
  await sql`update post_comments set replied_at = now() where id = ${id}`;
  revalidatePath("/admin/comments");
}

export async function approveComment(id: string, slug: string) {
  await requireRole(CONTENT_ROLES);
  await sql`update post_comments set approved = true where id = ${id}`;
  revalidatePath("/admin/comments");
  revalidatePath(`/posts/${slug}`);
}

export async function deleteComment(id: string, slug: string) {
  await requireRole(CONTENT_ROLES);
  await sql`delete from post_comments where id = ${id}`;
  revalidatePath("/admin/comments");
  revalidatePath(`/posts/${slug}`);
}
