"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function signUp(formData: FormData) {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!fullName || !email || password.length < 8) {
    redirect("/account/signup?error=missing");
  }

  const existing = await sql`select id, password_hash from profiles where email = ${email}`;
  const passwordHash = await bcrypt.hash(password, 12);

  if (existing[0]) {
    if (existing[0].password_hash) {
      // Already a real account — don't let signup silently overwrite it.
      redirect("/account/login?error=exists");
    }
    // Claim the profile auto-created by a prior application/submission, so
    // it keeps its existing applications/submissions linked to this login.
    await sql`update profiles set full_name = ${fullName}, password_hash = ${passwordHash} where id = ${existing[0].id}`;
  } else {
    await sql`
      insert into profiles (full_name, email, password_hash, role) values (${fullName}, ${email}, ${passwordHash}, 'public')
    `;
  }

  try {
    await signIn("credentials", { email, password, redirectTo: "/account" });
  } catch (err) {
    if (err instanceof AuthError) {
      redirect("/account/login");
    }
    throw err;
  }
}
