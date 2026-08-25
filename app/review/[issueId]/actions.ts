"use server";

import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { uploadFileIfPresent } from "@/lib/upload";

function randomReference() {
  const year = new Date().getFullYear();
  const n = Math.floor(100000 + Math.random() * 900000);
  return `IR-${year}-${n}`;
}

export async function submitToIssue(issueId: string, formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const genre = String(formData.get("genre") ?? "").trim();
  const wordCountRaw = String(formData.get("wordCount") ?? "").trim();
  const wordCount = wordCountRaw ? Number(wordCountRaw) : null;
  const sampleText = String(formData.get("sampleText") ?? "").trim();
  const sampleFile = formData.get("sampleFile") as File | null;

  if (!title || !name || !email || !genre) {
    throw new Error("Title, name, email, and genre are required.");
  }
  if (!sampleText && (!sampleFile || sampleFile.size === 0)) {
    throw new Error("Paste your submission or attach a file.");
  }

  let profileRows = await sql`select id from profiles where email = ${email}`;
  let authorId = profileRows[0]?.id;
  if (!authorId) {
    const inserted = await sql`
      insert into profiles (full_name, email, role) values (${name}, ${email}, 'public')
      returning id
    `;
    authorId = inserted[0].id;
  }

  let reference = randomReference();
  let submissionId: string | undefined;
  for (let attempt = 0; attempt < 3 && !submissionId; attempt++) {
    try {
      const rows = await sql`
        insert into submissions (reference, title, author_id, issue_id, genre, word_count, stage)
        values (${reference}, ${title}, ${authorId}, ${issueId}, ${genre}, ${wordCount}, 'received')
        returning id
      `;
      submissionId = rows[0].id;
    } catch (err) {
      // 23505 = unique_violation — only that's worth retrying with a new
      // reference. Anything else (bad issue_id, connection failure, etc.)
      // is a real error and should surface, not be masked by a retry loop.
      if ((err as { code?: string })?.code !== "23505") throw err;
      reference = randomReference();
    }
  }
  if (!submissionId) throw new Error("Could not generate a unique reference. Try again.");

  if (sampleFile && sampleFile.size > 0) {
    const url = await uploadFileIfPresent(sampleFile, "submissions");
    if (url) {
      await sql`insert into submission_files (submission_id, storage_path, file_type) values (${submissionId}, ${url}, ${sampleFile.type})`;
    }
  } else if (sampleText) {
    await sql`insert into submission_files (submission_id, storage_path, file_type) values (${submissionId}, ${sampleText}, 'inline_text')`;
  }

  await sql`insert into submission_status_history (submission_id, to_stage) values (${submissionId}, 'received')`;

  redirect(`/review/thank-you?ref=${reference}`);
}
