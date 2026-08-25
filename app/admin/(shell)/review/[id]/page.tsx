import { notFound } from "next/navigation";
import Link from "next/link";
import { sql } from "@/lib/db";
import { submitReview, claimForReview, savePublication, COMPOSABLE_STAGES } from "../actions";
import RichTextEditor from "../../posts/RichTextEditor";

export const metadata = { title: "Blind review — Imodoye Admin" };
export const dynamic = "force-dynamic";

export default async function BlindReviewPage({ params }: { params: { id: string } }) {
  // Explicit column list — deliberately excludes author_id. Blind review
  // depends on this query never having the author's identity to leak,
  // not just on the JSX choosing not to render it (see db/schema.sql).
  const [rows, files, priorReviews, publicationRows] = await Promise.all([
    sql`
      select s.id, s.reference, s.title, s.genre, s.word_count, s.stage, i.number as issue_number
      from submissions s join issues i on i.id = s.issue_id
      where s.id = ${params.id}
    `,
    sql`select storage_path, file_type from submission_files where submission_id = ${params.id}`,
    sql`
      select rating, recommendation, notes, created_at from submission_reviews
      where submission_id = ${params.id} order by created_at desc
    `,
    sql`select title, body, slug, published_at from publications where submission_id = ${params.id}`,
  ]);
  const submission = rows[0];
  if (!submission) return notFound();
  const publication = publicationRows[0];

  const boundSubmit = submitReview.bind(null, params.id);
  const boundClaim = claimForReview.bind(null, params.id);
  const boundSavePublication = savePublication.bind(null, params.id);

  return (
    <div className="max-w-3xl">
      <Link href="/admin/review" className="font-ui text-sm opacity-60 mb-6 inline-block">
        ← Editorial queue
      </Link>

      <div className="max-w-xl bg-paper rounded p-6 mb-6">
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
        <div className="max-w-xl bg-paper rounded p-6 mb-6">
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

      {COMPOSABLE_STAGES.includes(submission.stage) && (
        <div className="bg-paper rounded p-6">
          <p className="font-mono text-xs mb-4 opacity-50">
            COMPOSE FOR PUBLICATION
            {publication?.published_at ? " · LIVE" : publication ? " · DRAFT" : ""}
          </p>

          {publication?.published_at && (
            <p className="font-ui text-sm mb-4">
              Published at{" "}
              <a
                href={`/review/${submission.issue_number}/${publication.slug}`}
                target="_blank"
                rel="noreferrer"
                className="text-indigo underline"
              >
                /review/{submission.issue_number}/{publication.slug}
              </a>
            </p>
          )}

          <form action={boundSavePublication} className="space-y-4">
            <div>
              <label className="block font-ui text-sm mb-1 opacity-70">Published title</label>
              <input
                name="title"
                required
                defaultValue={publication?.title ?? submission.title ?? ""}
                className="w-full px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm"
              />
            </div>
            <div>
              <label className="block font-ui text-sm mb-1 opacity-70">Final copy</label>
              <RichTextEditor name="body" defaultValue={publication?.body ?? ""} />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="font-ui text-sm px-4 py-2 border border-ink/20 rounded-sm">
                Save draft
              </button>
              <button name="publish" value="on" type="submit" className="font-ui text-sm px-4 py-2 bg-indigo text-paper rounded-sm">
                {publication?.published_at ? "Update live piece" : "Publish"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
