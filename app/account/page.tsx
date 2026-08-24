import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { sql } from "@/lib/db";

export const metadata = { title: "My account — Imodoye" };
export const dynamic = "force-dynamic";

const APPLICATION_STAGE_LABELS: Record<string, string> = {
  new: "Received",
  screening: "In screening",
  shortlisted: "Shortlisted",
  interview: "Interview stage",
  selected: "Selected",
  waitlist: "Waitlisted",
  declined: "Not selected this cycle",
};

const SUBMISSION_STAGE_LABELS: Record<string, string> = {
  received: "Received",
  screening: "In screening",
  in_review: "Under review",
  shortlisted: "Shortlisted",
  accepted: "Accepted",
  rejected: "Not accepted",
};

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/account/login");

  const [applications, submissions] = await Promise.all([
    sql`
      select a.id, a.stage, a.submitted_at, c.number as cohort_number
      from applications a left join cohorts c on c.id = a.cohort_id
      where a.applicant_id = ${session.user.id} order by a.created_at desc
    `,
    sql`
      select id, reference, genre, stage, created_at from submissions
      where author_id = ${session.user.id} order by created_at desc
    `,
  ]);

  return (
    <section className="px-6 py-16 md:px-16 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="font-mono text-xs mb-2 text-indigo">MY ACCOUNT</p>
          <h1 className="font-display text-3xl">{session.user.name}</h1>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button type="submit" className="font-ui text-sm opacity-60 underline">
            Sign out
          </button>
        </form>
      </div>

      <p className="font-mono text-xs mb-4 text-terracotta">RESIDENCY APPLICATIONS</p>
      <div className="bg-paper rounded divide-y divide-ink/10 mb-10">
        {applications.map((a) => (
          <div key={a.id} className="px-5 py-4 flex items-center justify-between">
            <span className="font-ui text-sm">Cohort {a.cohort_number ?? "—"}</span>
            <span className="font-mono text-xs text-indigo">{APPLICATION_STAGE_LABELS[a.stage]?.toUpperCase() ?? a.stage}</span>
          </div>
        ))}
        {applications.length === 0 && (
          <p className="px-5 py-6 font-ui text-sm opacity-50">No applications yet.</p>
        )}
      </div>

      <p className="font-mono text-xs mb-4 text-terracotta">REVIEW SUBMISSIONS</p>
      <div className="bg-paper rounded divide-y divide-ink/10">
        {submissions.map((s) => (
          <div key={s.id} className="px-5 py-4 flex items-center justify-between">
            <div>
              <p className="font-ui text-sm">{s.reference}</p>
              <p className="font-mono text-xs opacity-50">{s.genre}</p>
            </div>
            <span className="font-mono text-xs text-indigo">{SUBMISSION_STAGE_LABELS[s.stage]?.toUpperCase() ?? s.stage}</span>
          </div>
        ))}
        {submissions.length === 0 && (
          <p className="px-5 py-6 font-ui text-sm opacity-50">No submissions yet.</p>
        )}
      </div>
    </section>
  );
}
