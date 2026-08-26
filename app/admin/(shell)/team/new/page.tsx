import { ADMIN_ROLES } from "@/lib/auth";
import { inviteEditor } from "../actions";

export const metadata = { title: "Invite editor — Imodoye Admin" };

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  programme_director: "Programme Director",
  residency_editor: "Residency Editor",
  review_editor: "Review Editor",
  section_editor: "Section Editor",
  reviewer: "Reviewer",
  content_editor: "Content Editor",
};

export default function NewEditorPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div>
      <p className="font-mono text-xs mb-3 text-indigo">TEAM</p>
      <h1 className="font-display text-3xl mb-8">Invite an editor</h1>

      {searchParams.error && (
        <p className="font-ui text-sm text-terracotta mb-6">{searchParams.error}</p>
      )}

      <form action={inviteEditor} className="max-w-sm space-y-4">
        <div>
          <label className="block font-ui text-sm mb-1 opacity-70">Full name</label>
          <input name="fullName" required className="w-full px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm" />
        </div>
        <div>
          <label className="block font-ui text-sm mb-1 opacity-70">Email</label>
          <input name="email" type="email" required className="w-full px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm" />
        </div>
        <div>
          <label className="block font-ui text-sm mb-1 opacity-70">Password (optional)</label>
          <input name="password" type="password" minLength={8} className="w-full px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm" />
          <p className="font-ui text-xs opacity-50 mt-1">
            Leave blank to get a one-time setup link instead, for them to set their own password.
          </p>
        </div>
        <div>
          <label className="block font-ui text-sm mb-1 opacity-70">Role</label>
          <select name="role" defaultValue="content_editor" className="w-full px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm">
            {ADMIN_ROLES.map((r) => (
              <option key={r} value={r}>{ROLE_LABELS[r]}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="font-ui text-sm px-6 py-3 bg-indigo text-paper rounded-sm">
          Create account
        </button>
      </form>
    </div>
  );
}
