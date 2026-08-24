"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  try {
    await signIn("credentials", { email, password, redirectTo: next });
  } catch (err) {
    if (err instanceof AuthError) {
      throw new Error("Invalid email or password.");
    }
    throw err;
  }
}
