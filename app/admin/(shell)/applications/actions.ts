"use server";

import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import { requireRole, CONTENT_ROLES } from "@/lib/auth";

const APPLICATION_STAGES = [
  "new",
  "screening",
  "shortlisted",
  "interview",
  "selected",
  "waitlist",
  "declined",
];

export async function updateApplicationStage(id: string, formData: FormData) {
  await requireRole(CONTENT_ROLES);
  const stage = String(formData.get("stage") ?? "");
  if (!APPLICATION_STAGES.includes(stage)) throw new Error("Choose a valid stage.");

  await sql`update applications set stage = ${stage} where id = ${id}`;
  revalidatePath("/admin/applications");
  revalidatePath(`/admin/applications/${id}`);
}
