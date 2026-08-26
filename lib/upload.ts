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

// Uploads every non-empty file under `fieldName` (an <input type="file"
// multiple> field) and returns them in the shape Resend's `attachments`
// option expects — a `path` URL it fetches from, rather than inline content.
export async function attachmentsFromFormData(formData: FormData, fieldName: string, pathPrefix: string) {
  const files = formData.getAll(fieldName).filter((f): f is File => f instanceof File && f.size > 0);
  const attachments: { filename: string; path: string }[] = [];
  for (const file of files) {
    const url = await uploadFileIfPresent(file, pathPrefix);
    if (url) attachments.push({ filename: file.name, path: url });
  }
  return attachments.length > 0 ? attachments : undefined;
}
