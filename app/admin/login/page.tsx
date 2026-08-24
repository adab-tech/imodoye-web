import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { loginAction } from "./actions";

export const metadata = { title: "Sign in — Imodoye Admin" };
export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: { next?: string };
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
          className="w-full mb-6 px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm"
        />

        <button
          type="submit"
          className="w-full font-ui text-sm px-6 py-3 bg-indigo text-paper rounded-sm"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
