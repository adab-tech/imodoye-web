"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { requireRole, CONTENT_ROLES } from "@/lib/auth";
import { uploadFileIfPresent } from "@/lib/upload";
import { POST_CATEGORIES, type PostCategory } from "@/lib/categories";

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseTags(raw: string) {
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function readFields(formData: FormData) {
  const category = String(formData.get("category") ?? "");
  if (category && !POST_CATEGORIES.includes(category as PostCategory)) {
    throw new Error("Choose a valid category.");
  }
  return {
    title: String(formData.get("title") ?? "").trim(),
    excerpt: String(formData.get("excerpt") ?? "").trim() || null,
    body: String(formData.get("body") ?? "").trim(),
    category: (category || null) as PostCategory | null,
    tags: parseTags(String(formData.get("tags") ?? "")),
    publish: formData.get("publish") === "on",
  };
}

export async function createPost(formData: FormData) {
  const session = await requireRole(CONTENT_ROLES);
  const { title, excerpt, body, category, tags, publish } = readFields(formData);
  if (!title) throw new Error("Title is required.");
  const slug = slugify(title);

  const coverImageUrl = await uploadFileIfPresent(
    formData.get("coverImage") as File | null,
    "posts",
    { requireImage: true }
  );

  await sql`
    insert into posts (author_id, title, slug, excerpt, body, category, tags, cover_image_url, published_at)
    values (${session.user.id ?? null}, ${title}, ${slug}, ${excerpt}, ${body}, ${category}, ${tags}, ${coverImageUrl}, ${publish ? new Date().toISOString() : null})
  `;

  revalidatePath("/admin/posts");
  revalidatePath("/posts");
  redirect("/admin/posts");
}

export async function updatePost(id: string, formData: FormData) {
  await requireRole(CONTENT_ROLES);
  const { title, excerpt, body, category, tags, publish } = readFields(formData);
  if (!title) throw new Error("Title is required.");

  const [existing] = await sql`select published_at from posts where id = ${id}`;
  const publishedAt = publish ? existing?.published_at ?? new Date().toISOString() : null;

  const newCoverImageUrl = await uploadFileIfPresent(
    formData.get("coverImage") as File | null,
    "posts",
    { requireImage: true }
  );

  if (newCoverImageUrl) {
    await sql`
      update posts set title=${title}, excerpt=${excerpt}, body=${body}, category=${category},
        tags=${tags}, published_at=${publishedAt}, cover_image_url=${newCoverImageUrl}
      where id = ${id}
    `;
  } else {
    await sql`
      update posts set title=${title}, excerpt=${excerpt}, body=${body}, category=${category},
        tags=${tags}, published_at=${publishedAt}
      where id = ${id}
    `;
  }

  revalidatePath("/admin/posts");
  revalidatePath(`/admin/posts/${id}`);
  revalidatePath("/posts");
  redirect("/admin/posts");
}

export async function deletePost(id: string) {
  await requireRole(CONTENT_ROLES);
  await sql`delete from posts where id = ${id}`;
  revalidatePath("/admin/posts");
  revalidatePath("/posts");
  redirect("/admin/posts");
}

export async function addPostMedia(postId: string, formData: FormData) {
  await requireRole(CONTENT_ROLES);
  const file = formData.get("media") as File | null;
  const caption = String(formData.get("caption") ?? "").trim() || null;
  const url = await uploadFileIfPresent(file, "post-media");
  if (!url) throw new Error("Choose a file first.");

  await sql`insert into post_media (post_id, storage_path, file_type, caption) values (${postId}, ${url}, ${file!.type}, ${caption})`;
  revalidatePath(`/admin/posts/${postId}`);
  revalidatePath("/posts");
}

export async function removePostMedia(mediaId: string, postId: string) {
  await requireRole(CONTENT_ROLES);
  await sql`delete from post_media where id = ${mediaId}`;
  revalidatePath(`/admin/posts/${postId}`);
  revalidatePath("/posts");
}
