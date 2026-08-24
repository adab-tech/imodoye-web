import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { sql } from "@/lib/db";

export const revalidate = 60;

export async function generateStaticParams() {
  const rows = await sql`select slug from posts where published_at is not null`;
  return rows.map((r) => ({ slug: r.slug }));
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const rows = await sql`
    select id, title, body, category, tags, cover_image_url, published_at from posts
    where slug = ${params.slug} and published_at is not null
  `;
  const post = rows[0];
  if (!post) return notFound();

  const media = await sql`
    select storage_path, file_type, caption from post_media
    where post_id = ${post.id} order by sort_order, created_at
  `;

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
        <div className="prose-post font-ui text-base leading-relaxed opacity-85">
          <ReactMarkdown>{post.body}</ReactMarkdown>
        </div>
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
    </section>
  );
}
