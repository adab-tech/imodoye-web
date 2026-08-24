import Link from "next/link";
import { sql } from "@/lib/db";
import { POST_CATEGORIES } from "@/lib/categories";

export const metadata = { title: "Posts — Imodoye" };
export const revalidate = 60;

export default async function PostsPage({
  searchParams,
}: {
  searchParams: { category?: string; tag?: string };
}) {
  const activeCategory = searchParams.category;
  const activeTag = searchParams.tag;

  const posts = activeTag
    ? await sql`
        select title, slug, excerpt, body, category, tags, cover_image_url, published_at from posts
        where published_at is not null and ${activeTag} = any(tags)
        order by published_at desc
      `
    : activeCategory
    ? await sql`
        select title, slug, excerpt, body, category, tags, cover_image_url, published_at from posts
        where published_at is not null and category = ${activeCategory}
        order by published_at desc
      `
    : await sql`
        select title, slug, excerpt, body, category, tags, cover_image_url, published_at from posts
        where published_at is not null
        order by published_at desc
      `;

  return (
    <section className="px-6 py-16 md:px-16 max-w-2xl">
      <p className="font-mono text-xs mb-3 text-indigo">POSTS</p>
      <h1 className="font-display text-4xl mb-6">News &amp; updates</h1>

      <div className="flex flex-wrap gap-2 mb-10">
        <Link
          href="/posts"
          className={`font-mono text-xs px-3 py-1.5 rounded-full border ${!activeCategory ? "bg-indigo text-paper border-indigo" : "border-ink/20 opacity-70"}`}
        >
          ALL
        </Link>
        {POST_CATEGORIES.map((c) => (
          <Link
            key={c}
            href={`/posts?category=${c}`}
            className={`font-mono text-xs px-3 py-1.5 rounded-full border ${activeCategory === c ? "bg-indigo text-paper border-indigo" : "border-ink/20 opacity-70"}`}
          >
            {c.toUpperCase()}
          </Link>
        ))}
      </div>

      {activeTag && (
        <p className="font-mono text-xs mb-6 opacity-60">
          TAGGED &ldquo;{activeTag}&rdquo; · <Link href="/posts" className="underline">clear</Link>
        </p>
      )}

      <div className="space-y-8">
        {posts.map((p) => (
          <Link key={p.slug} href={`/posts/${p.slug}`} className="block bg-paper rounded overflow-hidden">
            {p.cover_image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.cover_image_url} alt="" className="w-full h-40 object-cover" />
            )}
            <div className="p-6">
              <p className="font-mono text-xs mb-2 text-terracotta">
                {p.category?.toUpperCase()} · {new Date(p.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              </p>
              <p className="font-display text-2xl mb-2">{p.title}</p>
              {(p.excerpt || p.body) && (
                <p className="font-ui text-sm opacity-70 line-clamp-2">{(p.excerpt || p.body).slice(0, 180)}</p>
              )}
              {p.tags?.length > 0 && (
                <p className="font-mono text-xs mt-3 opacity-50">{p.tags.map((t: string) => `#${t}`).join("  ")}</p>
              )}
            </div>
          </Link>
        ))}
        {posts.length === 0 && <p className="font-ui text-sm opacity-50">Nothing published yet.</p>}
      </div>
    </section>
  );
}
