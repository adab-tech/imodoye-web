import { sql } from "@/lib/db";
import { approveComment, deleteComment, replyToComment } from "./actions";
import ReplyToggle from "./ReplyToggle";

export const metadata = { title: "Comments — Imodoye Admin" };
export const dynamic = "force-dynamic";

export default async function AdminCommentsPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const comments = await sql`
    select c.id, c.author_name, c.author_email, c.body, c.approved, c.replied_at, c.created_at, p.title, p.slug
    from post_comments c
    left join posts p on p.id = c.post_id
    order by c.approved asc, c.created_at desc
  `;

  return (
    <div>
      <p className="font-mono text-xs mb-3 text-indigo">COMMENTS</p>
      <h1 className="font-display text-3xl mb-8">{comments.length} comments</h1>

      {searchParams.error && (
        <p className="font-ui text-sm text-terracotta mb-6">{searchParams.error}</p>
      )}

      <div className="space-y-3 max-w-2xl">
        {comments.map((c) => (
          <div key={c.id} className="bg-paper rounded p-5">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-ui text-sm font-medium">{c.author_name} <span className="opacity-50 font-normal">on {c.title}</span></p>
                <p className="font-mono text-xs opacity-50">{c.author_email}</p>
              </div>
              <span className={`font-mono text-xs ${c.approved ? "text-palm" : "text-terracotta"}`}>
                {c.approved ? "APPROVED" : "PENDING"}
                {c.replied_at && " · REPLIED"}
              </span>
            </div>
            <p className="font-ui text-sm opacity-80 mb-4 whitespace-pre-wrap">{c.body}</p>
            <div className="flex gap-3 items-start">
              {!c.approved && (
                <form action={approveComment.bind(null, c.id, c.slug)}>
                  <button type="submit" className="font-mono text-xs underline opacity-60">approve</button>
                </form>
              )}
              <form action={deleteComment.bind(null, c.id, c.slug)}>
                <button type="submit" className="font-mono text-xs underline text-terracotta">delete</button>
              </form>
              <ReplyToggle action={replyToComment.bind(null, c.id)} />
            </div>
          </div>
        ))}
        {comments.length === 0 && <p className="font-ui text-sm opacity-50">No comments yet.</p>}
      </div>
    </div>
  );
}
