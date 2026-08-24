import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { bootstrapAdmin } from "./actions";

export const metadata = { title: "Set up admin — Imodoye" };
export const dynamic = "force-dynamic";

export default async function AdminSetupPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const [{ count }] = await sql`select count(*)::int as count from profiles where role = 'super_admin'`;
  if (count > 0) redirect("/admin/login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-manuscript px-6">
      <form action={bootstrapAdmin} className="w-full max-w-sm bg-paper rounded p-8">
        <p className="font-mono text-xs mb-2 text-terracotta">FIRST-RUN SETUP</p>
        <h1 className="font-display text-2xl mb-6">Create the first admin account</h1>

        {searchParams.error === "missing" && (
          <p className="font-ui text-sm text-terracotta mb-4">
            Name, email, and an 8+ character password are all required.
          </p>
        )}

        <label className="block font-ui text-sm mb-1 opacity-70">Full name</label>
        <input
          name="fullName"
          required
          className="w-full mb-4 px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm"
        />

        <label className="block font-ui text-sm mb-1 opacity-70">Email</label>
        <input
          name="email"
          type="email"
          required
          className="w-full mb-4 px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm"
        />

        <label className="block font-ui text-sm mb-1 opacity-70">Password (8+ characters)</label>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          className="w-full mb-6 px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm"
        />

        <button
          type="submit"
          className="w-full font-ui text-sm px-6 py-3 bg-indigo text-paper rounded-sm"
        >
          Create account &amp; sign in
        </button>
      </form>
    </div>
  );
}
