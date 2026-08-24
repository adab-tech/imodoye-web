"use server";

import { redirect } from "next/navigation";
import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/account");

  try {
    await signIn("credentials", { email, password, redirectTo: next });
  } catch (err) {
    if (err instanceof AuthError) {
      redirect(`/account/login?next=${encodeURIComponent(next)}&error=1`);
    }
    throw err;
  }
}
