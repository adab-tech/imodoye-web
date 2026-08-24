"use server";

import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import { requireRole, CONTENT_ROLES } from "@/lib/auth";

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
