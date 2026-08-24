import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import PostForm from "../PostForm";
import { updatePost, deletePost, addPostMedia, removePostMedia } from "../actions";

export const metadata = { title: "Edit post — Imodoye Admin" };
export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const [rows, media] = await Promise.all([
    sql`select * from posts where id = ${params.id}`,
    sql`select id, storage_path, file_type, caption from post_media where post_id = ${params.id} order by sort_order, created_at`,
  ]);
  const post = rows[0];
  if (!post) return notFound();

  return (
    <div>
      <p className="font-mono text-xs mb-3 text-indigo">POSTS</p>
      <h1 className="font-display text-3xl mb-8">{post.title}</h1>

      <PostForm action={updatePost.bind(null, params.id)} values={post} />

      <div className="max-w-xl mt-10 pt-8 border-t border-ink/10">
        <p className="font-mono text-xs mb-4 text-terracotta">MEDIA GALLERY</p>
        <p className="font-ui text-sm opacity-60 mb-4">
          Images or video attached to this post — shown after the body on the public page.
        </p>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {media.map((m) => (
            <div key={m.id} className="relative">
              {m.file_type?.startsWith("video/") ? (
                <video src={m.storage_path} className="w-full h-24 object-cover rounded" muted />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.storage_path} alt={m.caption ?? ""} className="w-full h-24 object-cover rounded" />
              )}
              <form action={removePostMedia.bind(null, m.id, params.id)} className="absolute top-1 right-1">
                <button type="submit" className="font-mono text-xs bg-paper/90 px-1.5 py-0.5 rounded">×</button>
              </form>
            </div>
          ))}
          {media.length === 0 && <p className="col-span-3 font-ui text-sm opacity-50">No media yet.</p>}
        </div>
        <form action={addPostMedia.bind(null, params.id)} className="flex gap-2 items-end">
          <input type="file" name="media" accept="image/*,video/*" required className="font-ui text-sm" />
          <input name="caption" placeholder="Caption (optional)" className="px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm" />
          <button type="submit" className="font-ui text-sm px-4 py-2 border border-ink/20 rounded-sm">Upload</button>
        </form>
      </div>

      <form action={deletePost.bind(null, params.id)} className="max-w-xl mt-10 pt-8 border-t border-ink/10">
        <button type="submit" className="font-ui text-sm text-terracotta underline">
          Delete this post
        </button>
      </form>
    </div>
  );
}
