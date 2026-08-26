"use server";

import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import { requireRole, OWNER_ROLES } from "@/lib/auth";

export async function createMailbox(formData: FormData) {
  await requireRole(OWNER_ROLES);
  const address = String(formData.get("address") ?? "").trim().toLowerCase();
  const displayName = String(formData.get("display_name") ?? "").trim();

  if (!address.endsWith("@imodoye.ng")) {
    throw new Error("Address must be an @imodoye.ng address.");
  }
  if (!displayName) throw new Error("Display name is required.");

  await sql`
    insert into mailboxes (address, display_name) values (${address}, ${displayName})
    on conflict (address) do update set display_name = excluded.display_name
  `;
  revalidatePath("/admin/mailboxes");
}

export async function deleteMailbox(id: string) {
  await requireRole(OWNER_ROLES);
  await sql`delete from mailboxes where id = ${id}`;
  revalidatePath("/admin/mailboxes");
}
