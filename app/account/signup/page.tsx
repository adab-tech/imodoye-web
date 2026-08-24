import { signUp } from "./actions";

export const metadata = { title: "Create an account — Imodoye" };

export default function SignUpPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
      <form action={signUp} className="w-full max-w-sm bg-paper rounded p-8">
        <p className="font-mono text-xs mb-2 text-indigo">IMODOYE</p>
        <h1 className="font-display text-2xl mb-2">Create an account</h1>
        <p className="font-ui text-sm opacity-60 mb-6">
          For fellows and applicants — track your application or submission status.
        </p>

        {searchParams.error === "missing" && (
          <p className="font-ui text-sm text-terracotta mb-4">
            Name, email, and an 8+ character password are required.
          </p>
        )}

        <label className="block font-ui text-sm mb-1 opacity-70">Full name</label>
        <input name="fullName" required className="w-full mb-4 px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm" />

        <label className="block font-ui text-sm mb-1 opacity-70">Email</label>
        <p className="font-mono text-xs opacity-50 mb-1">Use the same email you applied or submitted with, if any.</p>
        <input name="email" type="email" required className="w-full mb-4 px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm" />

        <label className="block font-ui text-sm mb-1 opacity-70">Password (8+ characters)</label>
        <input name="password" type="password" required minLength={8} className="w-full mb-6 px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm" />

        <button type="submit" className="w-full font-ui text-sm px-6 py-3 bg-indigo text-paper rounded-sm">
          Create account
        </button>

        <p className="font-ui text-sm opacity-60 mt-4 text-center">
          Already have an account? <a href="/account/login" className="text-indigo underline">Sign in</a>
        </p>
      </form>
    </div>
  );
}
