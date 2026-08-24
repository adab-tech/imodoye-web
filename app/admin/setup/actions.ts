"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { signIn } from "@/lib/auth";

export async function bootstrapAdmin(formData: FormData) {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!fullName || !email || password.length < 8) {
    redirect("/admin/setup?error=missing");
  }

  const [{ count }] = await sql`select count(*)::int as count from profiles where role = 'super_admin'`;
  if (count > 0) {
    redirect("/admin/login");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  try {
    await sql`
      insert into profiles (full_name, email, password_hash, role)
      values (${fullName}, ${email}, ${passwordHash}, 'super_admin')
    `;
  } catch (err) {
    // A concurrent request may have won the race despite the count check
    // above — profiles_one_super_admin (db/schema.sql) is the real guard.
    if ((err as { code?: string })?.code === "23505") {
      redirect("/admin/login?error=race");
    }
    throw err;
  }

  await signIn("credentials", { email, password, redirectTo: "/admin" });
  redirect("/admin");
}
