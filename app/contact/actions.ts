"use server";

import { redirect } from "next/navigation";
import { sql } from "@/lib/db";

export async function submitInquiry(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    throw new Error("Name, email, and a message are required.");
  }

  await sql`insert into inquiries (name, email, message) values (${name}, ${email}, ${message})`;
  redirect("/contact/thank-you");
}
