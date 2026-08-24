import Link from "next/link";
import { sql } from "@/lib/db";

export const metadata = { title: "Posts — Imodoye" };
export const revalidate = 60;

export default async function PostsPage() {
  const posts = await sql`
    select title, slug, body, published_at from posts
    where published_at is not null
    order by published_at desc
  `;

  return (
    <section className="px-6 py-16 md:px-16 max-w-2xl">
      <p className="font-mono text-xs mb-3 text-indigo">POSTS</p>
      <h1 className="font-display text-4xl mb-10">News &amp; updates</h1>

      <div className="space-y-8">
        {posts.map((p) => (
          <Link key={p.slug} href={`/posts/${p.slug}`} className="block bg-paper rounded p-6">
            <p className="font-mono text-xs mb-2 text-terracotta">
              {new Date(p.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </p>
            <p className="font-display text-2xl mb-2">{p.title}</p>
            {p.body && <p className="font-ui text-sm opacity-70 line-clamp-2">{p.body.slice(0, 180)}</p>}
          </Link>
        ))}
        {posts.length === 0 && <p className="font-ui text-sm opacity-50">Nothing published yet.</p>}
      </div>
    </section>
  );
}
