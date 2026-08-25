"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { requireRole, REVIEW_ROLES } from "@/lib/auth";

const STAGE_FOR_RECOMMENDATION: Record<string, string> = {
  reject: "rejected",
  shortlist: "shortlisted",
  consider: "in_review",
};

const CLAIMABLE_STAGES = ["received", "screening"];

// Once shortlisted, a piece can be composed for publication. This is a
// pragmatic subset of the 13-value submission_stage enum — it doesn't model
// every granular editorial handoff, just draft-in-progress vs. live.
export const COMPOSABLE_STAGES = ["shortlisted", "copyediting", "proofing", "scheduled", "published"];

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function submitReview(submissionId: string, formData: FormData) {
  const session = await requireRole(REVIEW_ROLES);
  const rating = Number(formData.get("rating"));
  const recommendation = String(formData.get("recommendation") ?? "");
  const notes = String(formData.get("notes") ?? "").trim() || null;

  if (!["reject", "consider", "shortlist"].includes(recommendation)) {
    throw new Error("Choose a recommendation.");
  }

  const currentRows = await sql`select stage from submissions where id = ${submissionId}`;
  const fromStage = currentRows[0]?.stage;
  if (!fromStage) throw new Error("That submission no longer exists.");

  await sql`
    insert into submission_reviews (submission_id, reviewer_id, rating, recommendation, notes)
    values (${submissionId}, ${session.user.id ?? null}, ${rating || null}, ${recommendation}, ${notes})
  `;

  const toStage = STAGE_FOR_RECOMMENDATION[recommendation];
  await sql`update submissions set stage = ${toStage} where id = ${submissionId}`;
  await sql`
    insert into submission_status_history (submission_id, from_stage, to_stage, changed_by)
    values (${submissionId}, ${fromStage}, ${toStage}, ${session.user.id ?? null})
  `;

  revalidatePath("/admin/review");
  redirect("/admin/review");
}

export async function claimForReview(submissionId: string) {
  const session = await requireRole(REVIEW_ROLES);

  const currentRows = await sql`select stage from submissions where id = ${submissionId}`;
  const fromStage = currentRows[0]?.stage;
  if (!fromStage) throw new Error("That submission no longer exists.");
  if (!CLAIMABLE_STAGES.includes(fromStage)) {
    throw new Error("This submission has already moved past first review.");
  }

  await sql`
    update submissions set stage = 'in_review', assigned_reviewer_id = ${session.user.id ?? null}
    where id = ${submissionId}
  `;
  await sql`
    insert into submission_status_history (submission_id, from_stage, to_stage, changed_by)
    values (${submissionId}, ${fromStage}, 'in_review', ${session.user.id ?? null})
  `;
  revalidatePath("/admin/review");
  revalidatePath(`/admin/review/${submissionId}`);
}

export async function savePublication(submissionId: string, formData: FormData) {
  const session = await requireRole(REVIEW_ROLES);
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const publish = formData.get("publish") === "on";
  if (!title || !body) throw new Error("Title and final copy are required.");

  const subRows = await sql`
    select s.issue_id, s.genre, s.stage, i.number as issue_number
    from submissions s join issues i on i.id = s.issue_id
    where s.id = ${submissionId}
  `;
  const submission = subRows[0];
  if (!submission) throw new Error("That submission no longer exists.");
  if (!COMPOSABLE_STAGES.includes(submission.stage)) {
    throw new Error("This piece must be shortlisted before it can be composed for publication.");
  }

  const existingRows = await sql`select id, slug from publications where submission_id = ${submissionId}`;
  const existing = existingRows[0];
  const publishedAt = publish ? new Date().toISOString() : null;

  if (existing) {
    await sql`
      update publications set title = ${title}, body = ${body}, published_at = ${publishedAt}
      where id = ${existing.id}
    `;
  } else {
    let slug = slugify(title);
    let inserted = false;
    for (let attempt = 0; attempt < 3 && !inserted; attempt++) {
      try {
        await sql`
          insert into publications (submission_id, issue_id, title, slug, category, body, published_at)
          values (${submissionId}, ${submission.issue_id}, ${title}, ${slug}, ${submission.genre}, ${body}, ${publishedAt})
        `;
        inserted = true;
      } catch (err) {
        if ((err as { code?: string })?.code !== "23505") throw err;
        slug = `${slugify(title)}-${Math.floor(1000 + Math.random() * 9000)}`;
      }
    }
    if (!inserted) throw new Error("Could not generate a unique URL slug. Try again.");
  }

  const toStage = publish ? "published" : submission.stage === "shortlisted" ? "copyediting" : submission.stage;
  if (toStage !== submission.stage) {
    await sql`update submissions set stage = ${toStage} where id = ${submissionId}`;
    await sql`
      insert into submission_status_history (submission_id, from_stage, to_stage, changed_by)
      values (${submissionId}, ${submission.stage}, ${toStage}, ${session.user.id ?? null})
    `;
  }

  revalidatePath(`/admin/review/${submissionId}`);
  revalidatePath("/admin/review");
  if (publish) revalidatePath(`/review/${submission.issue_number}`);
}
