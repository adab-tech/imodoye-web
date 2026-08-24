"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { uploadFileIfPresent } from "@/lib/upload";

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function cohortIdForNumber(cohortNumber: number) {
  const rows = await sql`select id from cohorts where number = ${cohortNumber}`;
  return rows[0]?.id ?? null;
}

export async function createFellow(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const cohort = Number(formData.get("cohort"));
  const role = String(formData.get("role") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const state = String(formData.get("state") ?? "").trim() || null;
  const bio = String(formData.get("bio") ?? "").trim();
  const testimonial = String(formData.get("testimonial") ?? "").trim() || null;
  const featured = formData.get("featured") === "on";
  const avatarFile = formData.get("avatar") as File | null;

  if (!name) throw new Error("Name is required.");

  const slug = slugify(name);
  const cohortId = await cohortIdForNumber(cohort);
  const avatarUrl = await uploadFileIfPresent(avatarFile, "fellows");

  await sql`
    insert into fellows (slug, name, cohort_id, genre, location, state, bio, testimonial, featured, avatar_url)
    values (${slug}, ${name}, ${cohortId}, ${role}, ${location}, ${state}, ${bio}, ${testimonial}, ${featured}, ${avatarUrl})
  `;

  revalidatePath("/admin/fellows");
  redirect("/admin/fellows");
}

export async function updateFellow(id: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const cohort = Number(formData.get("cohort"));
  const role = String(formData.get("role") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const state = String(formData.get("state") ?? "").trim() || null;
  const bio = String(formData.get("bio") ?? "").trim();
  const testimonial = String(formData.get("testimonial") ?? "").trim() || null;
  const featured = formData.get("featured") === "on";
  const avatarFile = formData.get("avatar") as File | null;

  if (!name) throw new Error("Name is required.");

  const cohortId = await cohortIdForNumber(cohort);
  const newAvatarUrl = await uploadFileIfPresent(avatarFile, "fellows");

  if (newAvatarUrl) {
    await sql`
      update fellows set name=${name}, cohort_id=${cohortId}, genre=${role}, location=${location},
        state=${state}, bio=${bio}, testimonial=${testimonial}, featured=${featured}, avatar_url=${newAvatarUrl}
      where id = ${id}
    `;
  } else {
    await sql`
      update fellows set name=${name}, cohort_id=${cohortId}, genre=${role}, location=${location},
        state=${state}, bio=${bio}, testimonial=${testimonial}, featured=${featured}
      where id = ${id}
    `;
  }

  revalidatePath("/admin/fellows");
  revalidatePath(`/admin/fellows/${id}`);
  redirect("/admin/fellows");
}

export async function deleteFellow(id: string) {
  await sql`delete from fellows where id = ${id}`;
  revalidatePath("/admin/fellows");
  redirect("/admin/fellows");
}

export async function addPublishedWork(fellowId: string, formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const venue = String(formData.get("venue") ?? "").trim() || null;
  const genre = String(formData.get("genre") ?? "").trim() || null;
  if (!title) throw new Error("Title is required.");

  await sql`
    insert into fellow_published_works (fellow_id, title, venue, genre)
    values (${fellowId}, ${title}, ${venue}, ${genre})
  `;
  revalidatePath(`/admin/fellows/${fellowId}`);
}

export async function removePublishedWork(workId: string, fellowId: string) {
  await sql`delete from fellow_published_works where id = ${workId}`;
  revalidatePath(`/admin/fellows/${fellowId}`);
}
