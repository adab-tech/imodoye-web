import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { loginAction } from "./actions";

export const metadata = { title: "Sign in — Imodoye Admin" };
export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: { next?: string; error?: string };
}) {
  const [{ count }] = await sql`select count(*)::int as count from profiles where role = 'super_admin'`;
  if (count === 0) redirect("/admin/setup");

  return (
    <div className="min-h-screen flex items-center justify-center bg-manuscript px-6">
      <form action={loginAction} className="w-full max-w-sm bg-paper rounded p-8">
        <p className="font-mono text-xs mb-2 text-indigo">IMODOYE ADMIN</p>
        <h1 className="font-display text-2xl mb-6">Sign in</h1>

        <input type="hidden" name="next" value={searchParams.next ?? "/admin"} />

        <label className="block font-ui text-sm mb-1 opacity-70">Email</label>
        <input
          name="email"
          type="email"
          required
          className="w-full mb-4 px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm"
        />

        <label className="block font-ui text-sm mb-1 opacity-70">Password</label>
        <input
          name="password"
          type="password"
          required
          className="w-full mb-2 px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm"
        />

        {searchParams.error === "race" && (
          <p className="font-ui text-sm text-terracotta mb-4">
            Setup was just completed by someone else. Sign in with those credentials.
          </p>
        )}
        {searchParams.error && searchParams.error !== "race" && (
          <p className="font-ui text-sm text-terracotta mb-4">Invalid email or password.</p>
        )}

        <button
          type="submit"
          className={`w-full font-ui text-sm px-6 py-3 bg-indigo text-paper rounded-sm ${searchParams.error ? "" : "mt-4"}`}
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
