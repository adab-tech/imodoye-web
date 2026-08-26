import Link from "next/link";
import { requestPasswordReset } from "./actions";

export const metadata = { title: "Forgot password — Imodoye Admin" };

export default function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: { sent?: string };
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-manuscript px-6">
      <form action={requestPasswordReset} className="w-full max-w-sm bg-paper rounded p-8">
        <p className="font-mono text-xs mb-2 text-indigo">IMODOYE ADMIN</p>
        <h1 className="font-display text-2xl mb-6">Reset your password</h1>

        {searchParams.sent ? (
          <p className="font-ui text-sm opacity-70 mb-4">
            If that email has an admin account, a reset link is on its way to it —
            note that mail to an @imodoye.ng address only shows up in another
            admin's Inbox, not a regular mailbox.
          </p>
        ) : (
          <>
            <label className="block font-ui text-sm mb-1 opacity-70">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full mb-4 px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm"
            />
            <button type="submit" className="w-full font-ui text-sm px-6 py-3 bg-indigo text-paper rounded-sm">
              Send reset link
            </button>
          </>
        )}

        <Link href="/admin/login" className="block font-ui text-sm opacity-60 mt-4 text-center">
          ← Back to sign in
        </Link>
      </form>
    </div>
  );
}
