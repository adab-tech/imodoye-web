"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { requireRole, CONTENT_ROLES } from "@/lib/auth";

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createPost(formData: FormData) {
  const session = await requireRole(CONTENT_ROLES);
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const publish = formData.get("publish") === "on";

  if (!title) throw new Error("Title is required.");
  const slug = slugify(title);

  await sql`
    insert into posts (author_id, title, slug, body, published_at)
    values (${session.user.id ?? null}, ${title}, ${slug}, ${body}, ${publish ? new Date().toISOString() : null})
  `;

  revalidatePath("/admin/posts");
  revalidatePath("/posts");
  redirect("/admin/posts");
}

export async function updatePost(id: string, formData: FormData) {
  await requireRole(CONTENT_ROLES);
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const publish = formData.get("publish") === "on";

  if (!title) throw new Error("Title is required.");

  const [existing] = await sql`select published_at from posts where id = ${id}`;
  const publishedAt = publish ? existing?.published_at ?? new Date().toISOString() : null;

  await sql`
    update posts set title = ${title}, body = ${body}, published_at = ${publishedAt}
    where id = ${id}
  `;

  revalidatePath("/admin/posts");
  revalidatePath("/posts");
  redirect("/admin/posts");
}

export async function deletePost(id: string) {
  await requireRole(CONTENT_ROLES);
  await sql`delete from posts where id = ${id}`;
  revalidatePath("/admin/posts");
  revalidatePath("/posts");
  redirect("/admin/posts");
}
