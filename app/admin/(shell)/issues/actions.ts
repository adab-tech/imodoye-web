"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { requireRole, CONTENT_ROLES } from "@/lib/auth";

function readFields(formData: FormData) {
  const categories = String(formData.get("categories") ?? "")
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
  return {
    number: Number(formData.get("number")),
    theme: String(formData.get("theme") ?? "").trim(),
    note: String(formData.get("note") ?? "").trim(),
    status: String(formData.get("status") ?? "upcoming"),
    categories,
  };
}

export async function createIssue(formData: FormData) {
  await requireRole(CONTENT_ROLES);
  const { number, theme, note, status, categories } = readFields(formData);
  if (!number || !theme || !note) throw new Error("Number, theme, and note are required.");

  await sql`
    insert into issues (number, theme, note, status, open_categories)
    values (${number}, ${theme}, ${note}, ${status}, ${categories})
  `;
  revalidatePath("/admin/issues");
  revalidatePath("/review");
  redirect("/admin/issues");
}

export async function updateIssue(id: string, formData: FormData) {
  await requireRole(CONTENT_ROLES);
  const { number, theme, note, status, categories } = readFields(formData);
  if (!number || !theme || !note) throw new Error("Number, theme, and note are required.");

  await sql`
    update issues set number=${number}, theme=${theme}, note=${note}, status=${status}, open_categories=${categories}
    where id = ${id}
  `;
  revalidatePath("/admin/issues");
  revalidatePath("/review");
  redirect("/admin/issues");
}
