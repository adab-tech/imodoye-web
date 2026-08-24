import { notFound } from "next/navigation";
import Link from "next/link";
import { sql } from "@/lib/db";
import { submitComment } from "./actions";

export const revalidate = 60;

export async function generateStaticParams() {
  const rows = await sql`select slug from posts where published_at is not null`;
  return rows.map((r) => ({ slug: r.slug }));
}

export default async function PostPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { commented?: string };
}) {
  const rows = await sql`
    select id, title, body, category, tags, cover_image_url, published_at from posts
    where slug = ${params.slug} and published_at is not null
  `;
  const post = rows[0];
  if (!post) return notFound();

  const [media, comments] = await Promise.all([
    sql`select storage_path, file_type, caption from post_media where post_id = ${post.id} order by sort_order, created_at`,
    sql`select author_name, body, created_at from post_comments where post_id = ${post.id} and approved = true order by created_at`,
  ]);

  const action = submitComment.bind(null, post.id, params.slug);

  return (
    <section className="px-6 py-16 md:px-16 max-w-2xl mx-auto">
      <Link href="/posts" className="font-ui text-sm opacity-60 mb-8 inline-block">
        ← All posts
      </Link>

      {post.cover_image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.cover_image_url} alt="" className="w-full h-64 object-cover rounded mb-8" />
      )}

      <p className="font-mono text-xs mb-3 text-terracotta">
        {post.category && (
          <Link href={`/posts?category=${post.category}`} className="hover:underline">
            {post.category.toUpperCase()}
          </Link>
        )}
        {post.category && " · "}
        {new Date(post.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
      </p>
      <h1 className="font-display text-4xl mb-8">{post.title}</h1>

      {post.body && (
        <div
          className="prose-post font-ui text-base leading-relaxed opacity-85"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />
      )}

      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-8">
          {post.tags.map((t: string) => (
            <Link
              key={t}
              href={`/posts?tag=${t}`}
              className="font-mono text-xs px-3 py-1.5 rounded-full border border-ink/20 opacity-70"
            >
              #{t}
            </Link>
          ))}
        </div>
      )}

      {media.length > 0 && (
        <div className="mt-10 pt-8 border-t border-ink/10 space-y-6">
          {media.map((m, i) => (
            <figure key={i}>
              {m.file_type?.startsWith("video/") ? (
                <video src={m.storage_path} controls className="w-full rounded" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.storage_path} alt={m.caption ?? ""} className="w-full rounded" />
              )}
              {m.caption && <figcaption className="font-ui text-sm opacity-60 mt-2">{m.caption}</figcaption>}
            </figure>
          ))}
        </div>
      )}

      <div className="mt-12 pt-8 border-t border-ink/10">
        <p className="font-mono text-xs mb-6 text-indigo">
          {comments.length} COMMENT{comments.length === 1 ? "" : "S"}
        </p>

        {comments.length > 0 && (
          <div className="space-y-6 mb-10">
            {comments.map((c, i) => (
              <div key={i}>
                <p className="font-ui text-sm font-medium">{c.author_name}</p>
                <p className="font-mono text-xs opacity-40 mb-2">
                  {new Date(c.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </p>
                <p className="font-ui text-sm opacity-80 whitespace-pre-wrap">{c.body}</p>
              </div>
            ))}
          </div>
        )}

        {searchParams.commented && (
          <p className="font-ui text-sm text-palm mb-6">
            Thanks — your comment is awaiting approval and will appear once reviewed.
          </p>
        )}

        <form action={action} className="space-y-3 max-w-md">
          <p className="font-ui text-sm mb-1 opacity-70">Leave a comment</p>
          <div className="grid grid-cols-2 gap-3">
            <input name="authorName" placeholder="Name" required className="px-3 py-2 border border-ink/15 rounded-sm bg-paper font-ui text-sm" />
            <input name="authorEmail" type="email" placeholder="Email (not published)" required className="px-3 py-2 border border-ink/15 rounded-sm bg-paper font-ui text-sm" />
          </div>
          <textarea name="body" placeholder="Your comment" rows={4} required className="w-full px-3 py-2 border border-ink/15 rounded-sm bg-paper font-ui text-sm" />
          <button type="submit" className="font-ui text-sm px-6 py-3 bg-indigo text-paper rounded-sm">
            Post comment
          </button>
        </form>
      </div>
    </section>
  );
}
