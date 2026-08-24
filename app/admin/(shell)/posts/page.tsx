import Link from "next/link";
import { sql } from "@/lib/db";

export const metadata = { title: "Posts — Imodoye Admin" };
export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const posts = await sql`select id, title, published_at, created_at from posts order by created_at desc`;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-xs mb-3 text-indigo">POSTS</p>
          <h1 className="font-display text-3xl">{posts.length} posts</h1>
        </div>
        <Link href="/admin/posts/new" className="font-ui text-sm px-4 py-2 bg-indigo text-paper rounded-sm">
          + New post
        </Link>
      </div>

      <div className="bg-paper rounded divide-y divide-ink/10">
        {posts.map((p) => (
          <Link key={p.id} href={`/admin/posts/${p.id}`} className="flex items-center justify-between px-5 py-4 hover:bg-ink/5">
            <p className="font-ui text-base">{p.title}</p>
            <span className={`font-mono text-xs ${p.published_at ? "text-palm" : "opacity-40"}`}>
              {p.published_at ? "PUBLISHED" : "DRAFT"}
            </span>
          </Link>
        ))}
        {posts.length === 0 && <p className="px-5 py-8 font-ui text-sm opacity-50">No posts yet.</p>}
      </div>
    </div>
  );
}
