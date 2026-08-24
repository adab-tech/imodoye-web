import { NextResponse } from "next/server";
import { requireRole, CONTENT_ROLES } from "@/lib/auth";
import { uploadFileIfPresent } from "@/lib/upload";

export async function POST(request: Request) {
  try {
    await requireRole(CONTENT_ROLES);
  } catch {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const url = await uploadFileIfPresent(file, "post-content", { requireImage: true });
  return NextResponse.json({ url });
}
