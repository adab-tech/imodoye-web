import PostForm from "../PostForm";
import { createPost } from "../actions";

export const metadata = { title: "New post — Imodoye Admin" };

export default function NewPostPage() {
  return (
    <div>
      <p className="font-mono text-xs mb-3 text-indigo">POSTS</p>
      <h1 className="font-display text-3xl mb-8">New post</h1>
      <PostForm action={createPost} />
    </div>
  );
}
