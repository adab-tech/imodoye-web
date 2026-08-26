"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { profileForResetToken, clearResetToken } from "@/lib/password-reset";

export async function resetPassword(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");

  const profile = await profileForResetToken(token);
  if (!profile) {
    redirect(`/admin/reset-password?token=${token}&error=invalid`);
  }
  if (password.length < 8) {
    redirect(`/admin/reset-password?token=${token}&error=short`);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await sql`update profiles set password_hash = ${passwordHash} where id = ${profile.id}`;
  await clearResetToken(profile.id);

  redirect("/admin/login?reset=1");
}
