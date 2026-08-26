"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { requireRole, OWNER_ROLES, ADMIN_ROLES, type AdminRole } from "@/lib/auth";
import { createResetToken } from "@/lib/password-reset";

export async function inviteEditor(formData: FormData) {
  const session = await requireRole(OWNER_ROLES);

  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "") as AdminRole;

  if (!fullName || !email) {
    redirect(`/admin/team/new?error=${encodeURIComponent("Name and email are required.")}`);
  }
  if (password && password.length < 8) {
    redirect(`/admin/team/new?error=${encodeURIComponent("Password must be at least 8 characters, or left blank.")}`);
  }
  if (!ADMIN_ROLES.includes(role)) {
    redirect(`/admin/team/new?error=${encodeURIComponent("Choose a valid role.")}`);
  }

  // A blank password creates the account with none set — they get a setup
  // link instead (see below), since a brand-new admin has no way to check
  // an @imodoye.ng inbox before they can sign in.
  const passwordHash = password ? await bcrypt.hash(password, 12) : null;
  let newId: string;
  try {
    const rows = await sql`
      insert into profiles (full_name, email, password_hash, role)
      values (${fullName}, ${email}, ${passwordHash}, ${role})
      returning id
    `;
    newId = rows[0].id;
  } catch (err) {
    if ((err as { code?: string })?.code === "23505") {
      redirect(`/admin/team/new?error=${encodeURIComponent("An account with that email already exists.")}`);
    }
    throw err;
  }

  revalidatePath("/admin/team");
  if (!password) {
    const token = await createResetToken(newId);
    redirect(`/admin/team?setupLink=${encodeURIComponent(`https://imodoye.ng/admin/reset-password?token=${token}`)}`);
  }
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
