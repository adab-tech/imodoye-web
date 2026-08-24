"use server";

import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import { uploadFileIfPresent } from "@/lib/upload";
import { requireRole, CONTENT_ROLES } from "@/lib/auth";

export async function updateCohort(id: string, formData: FormData) {
  await requireRole(CONTENT_ROLES);
  const title = String(formData.get("title") ?? "").trim() || null;
  const yearRaw = String(formData.get("year") ?? "").trim();
  const year = yearRaw ? Number(yearRaw) : null;

  await sql`update cohorts set title=${title}, year=${year} where id = ${id}`;
  revalidatePath(`/admin/cohorts/${id}`);
  revalidatePath("/admin/cohorts");
}

export async function addCohortPhoto(cohortId: string, formData: FormData) {
  await requireRole(CONTENT_ROLES);
  const file = formData.get("photo") as File | null;
  const caption = String(formData.get("caption") ?? "").trim() || null;
  const url = await uploadFileIfPresent(file, "cohorts", { requireImage: true });
  if (!url) throw new Error("Choose a photo first.");

  await sql`insert into media (storage_path, caption, cohort_id) values (${url}, ${caption}, ${cohortId})`;
  revalidatePath(`/admin/cohorts/${cohortId}`);
}

export async function removeCohortPhoto(mediaId: string, cohortId: string) {
  await requireRole(CONTENT_ROLES);
  await sql`delete from media where id = ${mediaId}`;
  revalidatePath(`/admin/cohorts/${cohortId}`);
}
