"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { uploadFileIfPresent } from "@/lib/upload";
import { PARTNER_CATEGORIES, type PartnerCategoryDb } from "@/lib/categories";
import { requireRole, CONTENT_ROLES } from "@/lib/auth";

function readFields(formData: FormData) {
  const category = String(formData.get("category") ?? "");
  if (!PARTNER_CATEGORIES.includes(category as PartnerCategoryDb)) {
    throw new Error("Choose a valid category.");
  }
  return {
    name: String(formData.get("name") ?? "").trim(),
    category: category as PartnerCategoryDb,
    blurb: String(formData.get("blurb") ?? "").trim() || null,
    url: String(formData.get("url") ?? "").trim() || null,
    featured: formData.get("featured") === "on",
  };
}

export async function createPartner(formData: FormData) {
  await requireRole(CONTENT_ROLES);
  const { name, category, blurb, url, featured } = readFields(formData);
  if (!name) throw new Error("Name is required.");

  const logoUrl = await uploadFileIfPresent(formData.get("logo") as File | null, "partners", { requireImage: true });

  await sql`
    insert into partners (name, category, blurb, url, featured, logo_url)
    values (${name}, ${category}, ${blurb}, ${url}, ${featured}, ${logoUrl})
  `;

  revalidatePath("/admin/partners");
  redirect("/admin/partners");
}

export async function updatePartner(id: string, formData: FormData) {
  await requireRole(CONTENT_ROLES);
  const { name, category, blurb, url, featured } = readFields(formData);
  if (!name) throw new Error("Name is required.");

  const newLogoUrl = await uploadFileIfPresent(formData.get("logo") as File | null, "partners", { requireImage: true });

  if (newLogoUrl) {
    await sql`
      update partners set name=${name}, category=${category}, blurb=${blurb}, url=${url},
        featured=${featured}, logo_url=${newLogoUrl}
      where id = ${id}
    `;
  } else {
    await sql`
      update partners set name=${name}, category=${category}, blurb=${blurb}, url=${url}, featured=${featured}
      where id = ${id}
    `;
  }

  revalidatePath("/admin/partners");
  redirect("/admin/partners");
}

export async function deletePartner(id: string) {
  await requireRole(CONTENT_ROLES);
  await sql`delete from partners where id = ${id}`;
  revalidatePath("/admin/partners");
  redirect("/admin/partners");
}
