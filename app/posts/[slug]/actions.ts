"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";

export async function submitComment(postId: string, slug: string, formData: FormData) {
  const authorName = String(formData.get("authorName") ?? "").trim();
  const authorEmail = String(formData.get("authorEmail") ?? "").trim().toLowerCase();
  const body = String(formData.get("body") ?? "").trim();

  if (!authorName || !authorEmail || !body) {
    throw new Error("Name, email, and a comment are required.");
  }

  await sql`
    insert into post_comments (post_id, author_name, author_email, body)
    values (${postId}, ${authorName}, ${authorEmail}, ${body})
  `;

  revalidatePath(`/posts/${slug}`);
  redirect(`/posts/${slug}?commented=1`);
}
