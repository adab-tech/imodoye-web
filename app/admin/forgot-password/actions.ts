"use server";

import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { createResetToken } from "@/lib/password-reset";
import { sendEmail } from "@/lib/email";

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (email) {
    const rows = await sql`select id, full_name from profiles where email = ${email} and role != 'public'`;
    const profile = rows[0];
    // Deliberately no branch here on "not found" — see the page copy for why.
    if (profile) {
      const token = await createResetToken(profile.id);
      const link = `https://imodoye.ng/admin/reset-password?token=${token}`;
      await sendEmail({
        to: email,
        subject: "Reset your Imodoye admin password",
        html: `<p>Hi ${profile.full_name},</p><p>Set a new password here (link expires in 24 hours):</p><p><a href="${link}">${link}</a></p><p>If you didn't request this, you can ignore this email.</p>`,
        context: "password_reset",
      });
    }
  }

  redirect("/admin/forgot-password?sent=1");
}
