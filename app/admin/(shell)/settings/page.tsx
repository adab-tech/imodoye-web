import { sql } from "@/lib/db";
import { updateImpactStats } from "./actions";

export const metadata = { title: "Settings — Imodoye Admin" };
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const rows = await sql`select key, value from site_settings where key in ('writers_supported', 'states_represented')`;
  const settings = Object.fromEntries(rows.map((r) => [r.key, r.value]));

  return (
    <div>
      <p className="font-mono text-xs mb-3 text-indigo">SETTINGS</p>
      <h1 className="font-display text-3xl mb-8">Impact stats</h1>
      <p className="font-ui text-sm opacity-60 mb-8 max-w-md">
        Cohorts completed is counted automatically from the Residency Archive.
        These two are manual — leave blank to show &ldquo;—&rdquo; on the About page.
      </p>

      <form action={updateImpactStats} className="max-w-sm space-y-4">
        <div>
          <label className="block font-ui text-sm mb-1 opacity-70">Writers supported</label>
          <input
            name="writersSupported"
            type="number"
            defaultValue={settings.writers_supported ?? ""}
            className="w-full px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm"
          />
        </div>
        <div>
          <label className="block font-ui text-sm mb-1 opacity-70">States represented</label>
          <input
            name="statesRepresented"
            type="number"
            defaultValue={settings.states_represented ?? ""}
            className="w-full px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm"
          />
        </div>
        <button type="submit" className="font-ui text-sm px-6 py-3 bg-indigo text-paper rounded-sm">
          Save
        </button>
      </form>
    </div>
  );
}
