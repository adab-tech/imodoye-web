import { loginAction } from "./actions";

export const metadata = { title: "Sign in — Imodoye" };

export default function AccountLoginPage({
  searchParams,
}: {
  searchParams: { next?: string; error?: string };
}) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
      <form action={loginAction} className="w-full max-w-sm bg-paper rounded p-8">
        <p className="font-mono text-xs mb-2 text-indigo">IMODOYE</p>
        <h1 className="font-display text-2xl mb-6">Sign in</h1>

        <input type="hidden" name="next" value={searchParams.next ?? "/account"} />

        <label className="block font-ui text-sm mb-1 opacity-70">Email</label>
        <input name="email" type="email" required className="w-full mb-4 px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm" />

        <label className="block font-ui text-sm mb-1 opacity-70">Password</label>
        <input name="password" type="password" required className="w-full mb-2 px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm" />

        {searchParams.error === "exists" && (
          <p className="font-ui text-sm text-terracotta mb-4">
            That account already exists — sign in below.
          </p>
        )}
        {searchParams.error && searchParams.error !== "exists" && (
          <p className="font-ui text-sm text-terracotta mb-4">Invalid email or password.</p>
        )}

        <button type="submit" className="w-full font-ui text-sm px-6 py-3 bg-indigo text-paper rounded-sm mt-4">
          Sign in
        </button>

        <p className="font-ui text-sm opacity-60 mt-4 text-center">
          Applied or submitted before? <a href="/account/signup" className="text-indigo underline">Create an account</a> with the same email to track it.
        </p>
      </form>
    </div>
  );
}
