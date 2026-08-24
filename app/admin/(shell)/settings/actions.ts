"use server";

import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import { requireRole, OWNER_ROLES } from "@/lib/auth";

export async function updateImpactStats(formData: FormData) {
  await requireRole(OWNER_ROLES);
  const writersSupported = String(formData.get("writersSupported") ?? "").trim();
  const statesRepresented = String(formData.get("statesRepresented") ?? "").trim();

  await sql`
    insert into site_settings (key, value) values ('writers_supported', ${writersSupported || null})
    on conflict (key) do update set value = excluded.value
  `;
  await sql`
    insert into site_settings (key, value) values ('states_represented', ${statesRepresented || null})
    on conflict (key) do update set value = excluded.value
  `;

  revalidatePath("/admin/settings");
  revalidatePath("/about");
}
