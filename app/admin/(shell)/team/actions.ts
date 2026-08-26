"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { requireRole, OWNER_ROLES, ADMIN_ROLES, type AdminRole } from "@/lib/auth";

export async function inviteEditor(formData: FormData) {
  const session = await requireRole(OWNER_ROLES);

  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "") as AdminRole;

  if (!fullName || !email || password.length < 8) {
    throw new Error("Name, email, and an 8+ character password are required.");
  }
  if (!ADMIN_ROLES.includes(role)) {
    throw new Error("Choose a valid role.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  try {
    await sql`
      insert into profiles (full_name, email, password_hash, role)
      values (${fullName}, ${email}, ${passwordHash}, ${role})
    `;
  } catch (err) {
    if ((err as { code?: string })?.code === "23505") {
      throw new Error("An account with that email already exists.");
    }
    throw err;
  }

  revalidatePath("/admin/team");
  redirect("/admin/team");
}

export async function updateEditorRole(id: string, formData: FormData) {
  await requireRole(OWNER_ROLES);
  const role = String(formData.get("role") ?? "") as AdminRole;
  if (!ADMIN_ROLES.includes(role)) {
    redirect(`/admin/team?error=${encodeURIComponent("Choose a valid role.")}`);
  }

  await sql`update profiles set role = ${role} where id = ${id}`;
  revalidatePath("/admin/team");
}

export async function updateEditorEmail(id: string, formData: FormData) {
  await requireRole(OWNER_ROLES);
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email || !email.includes("@")) {
    redirect(`/admin/team?error=${encodeURIComponent("Enter a valid email address.")}`);
  }

  try {
    await sql`update profiles set email = ${email} where id = ${id}`;
  } catch (err) {
    if ((err as { code?: string })?.code === "23505") {
      redirect(`/admin/team?error=${encodeURIComponent("An account with that email already exists.")}`);
    }
    throw err;
  }

  // The Credentials provider matches sessions by email, so this account's
  // existing session is now stale — it must sign in again with the new
  // address (same password, nothing else changes).
  revalidatePath("/admin/team");
}

export async function removeEditor(id: string) {
  const session = await requireRole(OWNER_ROLES);
  if (session.user.id === id) {
    redirect(`/admin/team?error=${encodeURIComponent("You can't remove your own account.")}`);
  }

  const [{ count }] = await sql`select count(*)::int as count from profiles where role = 'super_admin'`;
  const [target] = await sql`select role from profiles where id = ${id}`;
  if (target?.role === "super_admin" && count <= 1) {
    redirect(`/admin/team?error=${encodeURIComponent("Can't remove the last super_admin account.")}`);
  }

  await sql`delete from profiles where id = ${id}`;
  revalidatePath("/admin/team");
}
