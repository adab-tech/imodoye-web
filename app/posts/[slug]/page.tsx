import { notFound } from "next/navigation";
import Link from "next/link";
import { sql } from "@/lib/db";

export const revalidate = 60;

export async function generateStaticParams() {
  const rows = await sql`select slug from posts where published_at is not null`;
  return rows.map((r) => ({ slug: r.slug }));
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const rows = await sql`
    select title, body, published_at from posts
    where slug = ${params.slug} and published_at is not null
  `;
  const post = rows[0];
  if (!post) return notFound();

  return (
    <section className="px-6 py-16 md:px-16 max-w-2xl mx-auto">
      <Link href="/posts" className="font-ui text-sm opacity-60 mb-8 inline-block">
        ← All posts
      </Link>
      <p className="font-mono text-xs mb-3 text-terracotta">
        {new Date(post.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
      </p>
      <h1 className="font-display text-4xl mb-8">{post.title}</h1>
      {post.body && (
        <div className="font-ui text-base leading-relaxed opacity-85 whitespace-pre-wrap">
          {post.body}
        </div>
      )}
    </section>
  );
}
