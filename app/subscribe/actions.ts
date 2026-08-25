"use server";

import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";

export async function subscribeToNewsletter(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) throw new Error("Email is required.");

  const token = randomUUID();
  await sql`
    insert into subscribers (email, unsubscribe_token) values (${email}, ${token})
    on conflict (email) do nothing
  `;

  redirect("/subscribe/thank-you");
}
