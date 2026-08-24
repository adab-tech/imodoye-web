import Link from "next/link";
import { sql } from "@/lib/db";

export const metadata = { title: "Editorial Dashboard — Imodoye Admin" };
export const dynamic = "force-dynamic";

const STAGE_LABELS: Record<string, string> = {
  received: "Received",
  screening: "Screening",
  assigned: "Assigned",
  in_review: "Under review",
  shortlisted: "Shortlisted",
  accepted: "Accepted",
  rejected: "Rejected",
  hold: "On hold",
  copyediting: "Copyediting",
  proofing: "Proofing",
  scheduled: "Scheduled",
  published: "Published",
  withdrawn: "Withdrawn",
};

export default async function AdminReviewDashboard() {
  const [currentIssueRows, stageCounts, genreCounts, queue] = await Promise.all([
    sql`select id, number, theme from issues where status = 'current' limit 1`,
    sql`select stage, count(*)::int as count from submissions group by stage`,
    sql`select genre, count(*)::int as count from submissions group by genre order by count desc`,
    sql`
      select id, reference, genre, word_count, stage from submissions
      where stage in ('received','screening','in_review','shortlisted')
      order by created_at asc
      limit 20
    `,
  ]);

  const currentIssue = currentIssueRows[0];
  const total = stageCounts.reduce((sum, s) => sum + s.count, 0);
  const maxGenre = Math.max(1, ...genreCounts.map((g) => g.count));

  const receivedCount = stageCounts.find((s) => s.stage === "received")?.count ?? 0;
  const screeningCount = stageCounts.find((s) => s.stage === "screening")?.count ?? 0;
  const inReviewCount = stageCounts.find((s) => s.stage === "in_review")?.count ?? 0;
  const shortlistedCount = stageCounts.find((s) => s.stage === "shortlisted")?.count ?? 0;

  const needsAttention = [
    receivedCount > 0 && `${receivedCount} submission${receivedCount === 1 ? "" : "s"} awaiting first review`,
    screeningCount > 0 && `${screeningCount} in screening`,
    inReviewCount > 0 && `${inReviewCount} under review`,
    shortlistedCount > 0 && `${shortlistedCount} shortlisted, awaiting a final decision`,
  ].filter(Boolean) as string[];

  return (
    <div>
      <p className="font-mono text-xs mb-1 text-terracotta">EDITORIAL DASHBOARD</p>
      <h1 className="font-display text-3xl mb-8">
        {currentIssue ? `Imodoye Review — Issue ${String(currentIssue.number).padStart(2, "0")}` : "Imodoye Review"}
      </h1>

      {total === 0 ? (
        <div className="bg-paper rounded p-8">
          <p className="font-ui text-sm opacity-60">
            No submissions yet. They&#39;ll appear here as writers submit through the current issue&#39;s Review page.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-paper rounded p-6 md:col-span-2">
            <p className="font-mono text-xs mb-4 opacity-50">SUBMISSIONS BY STAGE</p>
            <div className="space-y-2">
              {stageCounts.map((s) => (
                <div key={s.stage} className="flex items-center gap-3">
                  <span className="font-ui text-sm w-28 opacity-75">{STAGE_LABELS[s.stage] ?? s.stage}</span>
                  <div className="flex-1 h-2 bg-ink/5 rounded-full">
                    <div
                      className="h-2 bg-indigo rounded-full"
                      style={{ width: `${(s.count / total) * 100}%` }}
                    />
                  </div>
                  <span className="font-mono text-sm w-8 text-right">{s.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-paper rounded p-6">
            <p className="font-mono text-xs mb-4 opacity-50">NEEDS ATTENTION</p>
            <ul className="space-y-3">
              {needsAttention.map((n) => (
                <li key={n} className="font-ui text-sm flex gap-2 opacity-85">
                  <span className="text-terracotta">•</span>{n}
                </li>
              ))}
              {needsAttention.length === 0 && <li className="font-ui text-sm opacity-50">Nothing pending.</li>}
            </ul>
          </div>

          <div className="bg-paper rounded p-6 md:col-span-2">
            <p className="font-mono text-xs mb-4 opacity-50">BY GENRE</p>
            <div className="flex items-end gap-4" style={{ height: 100 }}>
              {genreCounts.map((g) => (
                <div key={g.genre} className="flex flex-col items-center justify-end flex-1">
                  <span className="font-mono text-xs mb-1">{g.count}</span>
                  <div
                    className="w-full bg-terracotta rounded-t-sm"
                    style={{ height: `${(g.count / maxGenre) * 70}px` }}
                  />
                  <span className="font-ui text-xs mt-2 opacity-60">{g.genre}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-paper rounded p-6">
            <p className="font-mono text-xs mb-4 opacity-50">EDITORIAL QUEUE</p>
            <div className="space-y-3">
              {queue.map((q) => (
                <Link
                  key={q.id}
                  href={`/admin/review/${q.id}`}
                  className="w-full flex items-center justify-between font-mono text-sm pb-3 border-b border-ink/10"
                >
                  <span>{q.reference}</span>
                  <span className="text-xs text-terracotta">{STAGE_LABELS[q.stage]?.toUpperCase()}</span>
                </Link>
              ))}
              {queue.length === 0 && <p className="font-ui text-sm opacity-50">Queue is empty.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
