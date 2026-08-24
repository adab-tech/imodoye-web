import { put } from "@vercel/blob";

// Uploads a file from a form's file input, if one was provided.
// Returns null when the field was empty so callers can fall back to
// whatever URL is already stored (don't overwrite on an empty re-submit).
// Pass requireImage for fields that get rendered via <img> (avatars, logos,
// photos) — the <input accept> attribute is a UI hint only and doesn't stop
// a direct form POST with a non-image file.
export async function uploadFileIfPresent(
  file: File | null,
  pathPrefix: string,
  { requireImage = false }: { requireImage?: boolean } = {}
): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (requireImage && !file.type.startsWith("image/")) {
    throw new Error("Please upload an image file.");
  }
  const blob = await put(`${pathPrefix}/${Date.now()}-${file.name}`, file, {
    access: "public",
  });
  return blob.url;
}
