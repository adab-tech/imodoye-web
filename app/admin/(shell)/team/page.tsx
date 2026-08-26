import Link from "next/link";
import { sql } from "@/lib/db";
import { auth, ADMIN_ROLES } from "@/lib/auth";
import { updateEditorRole, updateEditorEmail, removeEditor } from "./actions";

export const metadata = { title: "Team — Imodoye Admin" };
export const dynamic = "force-dynamic";

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  programme_director: "Programme Director",
  residency_editor: "Residency Editor",
  review_editor: "Review Editor",
  section_editor: "Section Editor",
  reviewer: "Reviewer",
  content_editor: "Content Editor",
};

export default async function AdminTeamPage({
  searchParams,
}: {
  searchParams: { error?: string; setupLink?: string };
}) {
  const session = await auth();
  const team = await sql`select id, full_name, email, role, created_at from profiles where role != 'public' order by created_at`;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-xs mb-3 text-indigo">TEAM</p>
          <h1 className="font-display text-3xl">{team.length} accounts</h1>
        </div>
        <Link href="/admin/team/new" className="font-ui text-sm px-4 py-2 bg-indigo text-paper rounded-sm">
          + Invite editor
        </Link>
      </div>

      {searchParams.error && (
        <p className="font-ui text-sm text-terracotta mb-6">{searchParams.error}</p>
      )}
      {searchParams.setupLink && (
        <div className="bg-paper rounded p-4 mb-6">
          <p className="font-ui text-sm mb-2">
            Account created with no password. Share this one-time setup link with
            them directly (it won't show again) — email won't reach them since
            they can't sign in yet to check an @imodoye.ng inbox:
          </p>
          <p className="font-mono text-xs break-all bg-manuscript rounded p-2">{searchParams.setupLink}</p>
        </div>
      )}

      <div className="bg-paper rounded divide-y divide-ink/10">
        {team.map((member) => (
          <div key={member.id} className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="font-ui text-base">{member.full_name}</p>
              <form action={updateEditorEmail.bind(null, member.id)} className="flex items-center gap-2 mt-1">
                <input
                  name="email"
                  type="email"
                  defaultValue={member.email}
                  className="font-mono text-xs px-2 py-1 border border-ink/15 rounded-sm bg-transparent opacity-50 focus:opacity-100"
                />
                <button type="submit" className="font-mono text-xs opacity-50 underline">save</button>
              </form>
            </div>
            <div className="flex items-center gap-4">
              <form action={updateEditorRole.bind(null, member.id)} className="flex items-center gap-2">
                <select
                  name="role"
                  defaultValue={member.role}
                  className="font-mono text-xs px-2 py-1 border border-ink/15 rounded-sm bg-transparent"
                  disabled={member.id === session?.user?.id}
                >
                  {ADMIN_ROLES.map((r) => (
                    <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                  ))}
                </select>
                {member.id !== session?.user?.id && (
                  <button type="submit" className="font-mono text-xs opacity-50 underline">save</button>
                )}
              </form>
              {member.id !== session?.user?.id && (
                <form action={removeEditor.bind(null, member.id)}>
                  <button type="submit" className="font-mono text-xs opacity-50 underline">remove</button>
                </form>
              )}
              {member.id === session?.user?.id && (
                <span className="font-mono text-xs opacity-40">(you)</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
