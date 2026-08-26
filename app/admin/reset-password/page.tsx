import Link from "next/link";
import { profileForResetToken } from "@/lib/password-reset";
import { resetPassword } from "./actions";

export const metadata = { title: "Set a new password — Imodoye Admin" };
export const dynamic = "force-dynamic";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string; error?: string };
}) {
  const token = searchParams.token ?? "";
  const profile = token ? await profileForResetToken(token) : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-manuscript px-6">
      <div className="w-full max-w-sm bg-paper rounded p-8">
        <p className="font-mono text-xs mb-2 text-indigo">IMODOYE ADMIN</p>
        <h1 className="font-display text-2xl mb-6">Set a new password</h1>

        {!profile ? (
          <>
            <p className="font-ui text-sm text-terracotta mb-4">
              This link is invalid or has expired. Reset links are only valid for 24 hours.
            </p>
            <Link href="/admin/forgot-password" className="font-ui text-sm underline text-indigo">
              Request a new one
            </Link>
          </>
        ) : (
          <form action={resetPassword} className="space-y-4">
            <input type="hidden" name="token" value={token} />
            <p className="font-ui text-sm opacity-70">For {profile.email}</p>
            {searchParams.error === "short" && (
              <p className="font-ui text-sm text-terracotta">Password must be at least 8 characters.</p>
            )}
            <div>
              <label className="block font-ui text-sm mb-1 opacity-70">New password</label>
              <input
                name="password"
                type="password"
                required
                minLength={8}
                className="w-full px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm"
              />
            </div>
            <button type="submit" className="w-full font-ui text-sm px-6 py-3 bg-indigo text-paper rounded-sm">
              Set password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
