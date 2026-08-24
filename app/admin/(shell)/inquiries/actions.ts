"use server";

import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import { requireRole, CONTENT_ROLES } from "@/lib/auth";

export async function markInquiryStatus(id: string, status: "new" | "read" | "replied") {
  await requireRole(CONTENT_ROLES);
  await sql`update inquiries set status = ${status} where id = ${id}`;
  revalidatePath("/admin/inquiries");
}

export async function deleteInquiry(id: string) {
  await requireRole(CONTENT_ROLES);
  await sql`delete from inquiries where id = ${id}`;
  revalidatePath("/admin/inquiries");
}
