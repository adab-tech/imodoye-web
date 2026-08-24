import { notFound } from "next/navigation";
import Link from "next/link";
import { sql } from "@/lib/db";
import { submitReview, claimForReview } from "../actions";

export const metadata = { title: "Blind review — Imodoye Admin" };
export const dynamic = "force-dynamic";

export default async function BlindReviewPage({ params }: { params: { id: string } }) {
  const rows = await sql`select * from submissions where id = ${params.id}`;
  const submission = rows[0];
  if (!submission) return notFound();

  const files = await sql`select storage_path, file_type from submission_files where submission_id = ${params.id}`;
  const priorReviews = await sql`
    select rating, recommendation, notes, created_at from submission_reviews
    where submission_id = ${params.id} order by created_at desc
  `;

  const boundSubmit = submitReview.bind(null, params.id);
  const boundClaim = claimForReview.bind(null, params.id);

  return (
    <div className="max-w-xl">
      <Link href="/admin/review" className="font-ui text-sm opacity-60 mb-6 inline-block">
        ← Editorial queue
      </Link>

      <div className="bg-paper rounded p-6 mb-6">
        <p className="font-mono text-xs mb-4 opacity-50">
          SUBMISSION {submission.reference} — BLIND REVIEW
        </p>
        <div className="flex gap-8 mb-6 font-mono text-sm opacity-75">
          <span>GENRE: {submission.genre?.toUpperCase()}</span>
          {submission.word_count && <span>WORD COUNT: {submission.word_count}</span>}
          <span>STAGE: {submission.stage?.toUpperCase()}</span>
        </div>

        <div className="mb-6 p-4 bg-ink/5 rounded-sm">
          <p className="font-mono text-xs mb-1 opacity-50">AUTHOR</p>
          <p className="font-ui text-sm italic opacity-50">Hidden until decision</p>
        </div>

        <div className="mb-6 space-y-3">
          <p className="font-mono text-xs opacity-50">SUBMITTED WORK</p>
          {files.map((f, i) =>
            f.file_type === "inline_text" ? (
              <div key={i} className="p-4 bg-manuscript rounded-sm font-ui text-sm opacity-80 whitespace-pre-wrap">
                {f.storage_path}
              </div>
            ) : (
              <a key={i} href={f.storage_path} target="_blank" rel="noreferrer" className="block font-ui text-sm text-indigo underline">
                View attached file ({f.file_type})
              </a>
            )
          )}
          {files.length === 0 && <p className="font-ui text-sm opacity-50">No files attached.</p>}
        </div>

        {submission.stage === "received" || submission.stage === "screening" ? (
          <form action={boundClaim}>
            <button type="submit" className="font-ui text-sm px-4 py-2 border border-ink/20 rounded-sm">
              Start review
            </button>
          </form>
        ) : (
          <form action={boundSubmit} className="space-y-4">
            <div>
              <p className="font-mono text-xs mb-2 opacity-50">RATING</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <label key={n} className="w-9 h-9 border border-ink/20 rounded-sm flex items-center justify-center font-mono text-sm cursor-pointer has-[:checked]:bg-indigo has-[:checked]:text-paper">
                    <input type="radio" name="rating" value={n} className="sr-only" />
                    {n}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-ui text-sm mb-1 opacity-70">Notes (optional)</label>
              <textarea name="notes" rows={3} className="w-full px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm" />
            </div>

            <div className="flex gap-3">
              <button name="recommendation" value="reject" type="submit" className="font-ui text-sm px-4 py-2 border border-ink/20 rounded-sm">
                Reject
              </button>
              <button name="recommendation" value="consider" type="submit" className="font-ui text-sm px-4 py-2 border border-gold text-gold rounded-sm">
                Consider
              </button>
              <button name="recommendation" value="shortlist" type="submit" className="font-ui text-sm px-4 py-2 bg-indigo text-paper rounded-sm">
                Shortlist
              </button>
            </div>
          </form>
        )}
      </div>

      {priorReviews.length > 0 && (
        <div className="bg-paper rounded p-6">
          <p className="font-mono text-xs mb-4 opacity-50">REVIEW HISTORY</p>
          <div className="space-y-3">
            {priorReviews.map((r, i) => (
              <div key={i} className="pb-3 border-b border-ink/10 last:border-0">
                <p className="font-ui text-sm">
                  {r.recommendation?.toUpperCase()} {r.rating && `· ${r.rating}/5`}
                </p>
                {r.notes && <p className="font-ui text-sm opacity-60">{r.notes}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
