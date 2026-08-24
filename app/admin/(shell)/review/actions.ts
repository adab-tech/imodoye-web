"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { auth } from "@/lib/auth";

const STAGE_FOR_RECOMMENDATION: Record<string, string> = {
  reject: "rejected",
  shortlist: "shortlisted",
  consider: "in_review",
};

export async function submitReview(submissionId: string, formData: FormData) {
  const session = await auth();
  const rating = Number(formData.get("rating"));
  const recommendation = String(formData.get("recommendation") ?? "");
  const notes = String(formData.get("notes") ?? "").trim() || null;

  if (!["reject", "consider", "shortlist"].includes(recommendation)) {
    throw new Error("Choose a recommendation.");
  }

  await sql`
    insert into submission_reviews (submission_id, reviewer_id, rating, recommendation, notes)
    values (${submissionId}, ${session?.user?.id ?? null}, ${rating || null}, ${recommendation}, ${notes})
  `;

  const currentRows = await sql`select stage from submissions where id = ${submissionId}`;
  const fromStage = currentRows[0]?.stage;
  const toStage = STAGE_FOR_RECOMMENDATION[recommendation];

  await sql`update submissions set stage = ${toStage} where id = ${submissionId}`;
  await sql`
    insert into submission_status_history (submission_id, from_stage, to_stage, changed_by)
    values (${submissionId}, ${fromStage}, ${toStage}, ${session?.user?.id ?? null})
  `;

  revalidatePath("/admin/review");
  redirect("/admin/review");
}

export async function claimForReview(submissionId: string) {
  const session = await auth();
  const currentRows = await sql`select stage from submissions where id = ${submissionId}`;
  const fromStage = currentRows[0]?.stage;

  await sql`
    update submissions set stage = 'in_review', assigned_reviewer_id = ${session?.user?.id ?? null}
    where id = ${submissionId}
  `;
  await sql`
    insert into submission_status_history (submission_id, from_stage, to_stage, changed_by)
    values (${submissionId}, ${fromStage}, 'in_review', ${session?.user?.id ?? null})
  `;
  revalidatePath("/admin/review");
  revalidatePath(`/admin/review/${submissionId}`);
}
