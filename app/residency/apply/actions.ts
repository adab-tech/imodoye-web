"use server";

import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { uploadFileIfPresent } from "@/lib/upload";

export async function submitApplication(formData: FormData) {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const country = String(formData.get("country") ?? "").trim();
  const writingBackground = String(formData.get("writingBackground") ?? "").trim();
  const projectProposal = String(formData.get("projectProposal") ?? "").trim();
  const sampleFile = formData.get("sample") as File | null;

  if (!fullName || !email) {
    throw new Error("Name and email are required.");
  }
  if (!writingBackground || !projectProposal) {
    throw new Error("Writing background and project proposal are required.");
  }
  if (!sampleFile || sampleFile.size === 0) {
    throw new Error("A writing sample is required.");
  }

  const profileRows = await sql`select id from profiles where email = ${email}`;
  let applicantId = profileRows[0]?.id;
  if (!applicantId) {
    const inserted = await sql`
      insert into profiles (full_name, email, country, role) values (${fullName}, ${email}, ${country || null}, 'public')
      returning id
    `;
    applicantId = inserted[0].id;
  }

  const cohortRows = await sql`select id, number from cohorts order by number desc limit 1`;
  const cohortId = cohortRows[0]?.id ?? null;

  const sampleUrl = await uploadFileIfPresent(sampleFile, "applications");

  await sql`
    insert into applications (applicant_id, cohort_id, writing_background, project_proposal, writing_sample_url, stage, submitted_at)
    values (${applicantId}, ${cohortId}, ${writingBackground}, ${projectProposal}, ${sampleUrl}, 'new', now())
  `;

  redirect("/residency/apply/thank-you");
}
