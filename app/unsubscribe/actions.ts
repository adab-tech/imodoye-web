"use server";

import { sql } from "@/lib/db";

export async function confirmUnsubscribe(token: string) {
  await sql`delete from subscribers where unsubscribe_token = ${token}`;
}
