import Link from "next/link";
import { sql } from "@/lib/db";

export const metadata = { title: "Applications — Imodoye Admin" };
export const dynamic = "force-dynamic";

const STAGE_LABELS: Record<string, string> = {
  new: "New",
  screening: "Screening",
  shortlisted: "Shortlisted",
  interview: "Interview",
  selected: "Selected",
  waitlist: "Waitlist",
  declined: "Declined",
};

export default async function AdminApplicationsPage() {
  const applications = await sql`
    select a.id, a.stage, a.submitted_at, p.full_name, p.email, p.country, c.number as cohort_number
    from applications a
    left join profiles p on p.id = a.applicant_id
    left join cohorts c on c.id = a.cohort_id
    order by a.submitted_at desc nulls last, a.created_at desc
  `;

  return (
    <div>
      <p className="font-mono text-xs mb-3 text-indigo">RESIDENCY</p>
      <h1 className="font-display text-3xl mb-8">{applications.length} applications</h1>

      <div className="bg-paper rounded divide-y divide-ink/10">
        {applications.map((a) => (
          <Link key={a.id} href={`/admin/applications/${a.id}`} className="flex items-center justify-between px-5 py-4 hover:bg-ink/5">
            <div>
              <p className="font-ui text-base">{a.full_name}</p>
              <p className="font-mono text-xs opacity-50">
                {a.email} · COHORT {a.cohort_number ?? "—"} · {a.country ?? "—"}
              </p>
            </div>
            <span className="font-mono text-xs text-terracotta">{STAGE_LABELS[a.stage]?.toUpperCase()}</span>
          </Link>
        ))}
        {applications.length === 0 && (
          <p className="px-5 py-8 font-ui text-sm opacity-50">No applications yet.</p>
        )}
      </div>
    </div>
  );
}
