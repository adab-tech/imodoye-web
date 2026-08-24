import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import PostForm from "../PostForm";
import { updatePost, deletePost } from "../actions";

export const metadata = { title: "Edit post — Imodoye Admin" };
export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const rows = await sql`select * from posts where id = ${params.id}`;
  const post = rows[0];
  if (!post) return notFound();

  return (
    <div>
      <p className="font-mono text-xs mb-3 text-indigo">POSTS</p>
      <h1 className="font-display text-3xl mb-8">{post.title}</h1>

      <PostForm action={updatePost.bind(null, params.id)} values={post} />

      <form action={deletePost.bind(null, params.id)} className="max-w-xl mt-10 pt-8 border-t border-ink/10">
        <button type="submit" className="font-ui text-sm text-terracotta underline">
          Delete this post
        </button>
      </form>
    </div>
  );
}
