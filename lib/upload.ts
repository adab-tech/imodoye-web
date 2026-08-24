import { put } from "@vercel/blob";

// Uploads an image from a form's file input, if one was provided.
// Returns null when the field was empty so callers can fall back to
// whatever URL is already stored (don't overwrite on an empty re-submit).
export async function uploadImageIfPresent(
  file: File | null,
  pathPrefix: string
): Promise<string | null> {
  if (!file || file.size === 0) return null;
  const blob = await put(`${pathPrefix}/${Date.now()}-${file.name}`, file, {
    access: "public",
  });
  return blob.url;
}
