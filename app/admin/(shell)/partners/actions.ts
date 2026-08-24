"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { uploadImageIfPresent } from "@/lib/upload";
import type { PartnerCategoryDb } from "@/lib/categories";

function readFields(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    category: String(formData.get("category") ?? "") as PartnerCategoryDb,
    blurb: String(formData.get("blurb") ?? "").trim() || null,
    url: String(formData.get("url") ?? "").trim() || null,
    featured: formData.get("featured") === "on",
  };
}

export async function createPartner(formData: FormData) {
  const { name, category, blurb, url, featured } = readFields(formData);
  if (!name) throw new Error("Name is required.");

  const logoUrl = await uploadImageIfPresent(formData.get("logo") as File | null, "partners");

  await sql`
    insert into partners (name, category, blurb, url, featured, logo_url)
    values (${name}, ${category}, ${blurb}, ${url}, ${featured}, ${logoUrl})
  `;

  revalidatePath("/admin/partners");
  redirect("/admin/partners");
}

export async function updatePartner(id: string, formData: FormData) {
  const { name, category, blurb, url, featured } = readFields(formData);
  if (!name) throw new Error("Name is required.");

  const newLogoUrl = await uploadImageIfPresent(formData.get("logo") as File | null, "partners");

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
  await sql`delete from partners where id = ${id}`;
  revalidatePath("/admin/partners");
  redirect("/admin/partners");
}
