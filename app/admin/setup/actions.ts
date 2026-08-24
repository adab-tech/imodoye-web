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
    throw new Error("Name, email, and an 8+ character password are required.");
  }

  const [{ count }] = await sql`select count(*)::int as count from profiles where role = 'super_admin'`;
  if (count > 0) {
    throw new Error("Setup already completed.");
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
      throw new Error("Setup was just completed by someone else. Sign in instead.");
    }
    throw err;
  }

  await signIn("credentials", { email, password, redirectTo: "/admin" });
  redirect("/admin");
}
