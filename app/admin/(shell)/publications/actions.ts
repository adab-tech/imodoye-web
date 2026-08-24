"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { PUBLICATION_CATEGORIES, type PublicationCategory } from "@/lib/categories";
import { requireRole, CONTENT_ROLES } from "@/lib/auth";

function readFields(formData: FormData) {
  const category = String(formData.get("category") ?? "");
  if (!PUBLICATION_CATEGORIES.includes(category as PublicationCategory)) {
    throw new Error("Choose a valid category.");
  }
  return {
    title: String(formData.get("title") ?? "").trim(),
    author: String(formData.get("author") ?? "").trim(),
    category: category as PublicationCategory,
    venue: String(formData.get("venue") ?? "").trim() || null,
    url: String(formData.get("url") ?? "").trim() || null,
  };
}

export async function createPublicationEntry(formData: FormData) {
  await requireRole(CONTENT_ROLES);
  const { title, author, category, venue, url } = readFields(formData);
  if (!title || !author) throw new Error("Title and author are required.");

  await sql`
    insert into publication_entries (title, author, category, venue, url)
    values (${title}, ${author}, ${category}, ${venue}, ${url})
  `;
  revalidatePath("/admin/publications");
  redirect("/admin/publications");
}

export async function updatePublicationEntry(id: string, formData: FormData) {
  await requireRole(CONTENT_ROLES);
  const { title, author, category, venue, url } = readFields(formData);
  if (!title || !author) throw new Error("Title and author are required.");

  await sql`
    update publication_entries set title=${title}, author=${author}, category=${category}, venue=${venue}, url=${url}
    where id = ${id}
  `;
  revalidatePath("/admin/publications");
  redirect("/admin/publications");
}

export async function deletePublicationEntry(id: string) {
  await requireRole(CONTENT_ROLES);
  await sql`delete from publication_entries where id = ${id}`;
  revalidatePath("/admin/publications");
  redirect("/admin/publications");
}
