import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import { updateApplicationStage, emailApplicant } from "../actions";
import RichTextEditor from "../../posts/RichTextEditor";

export const metadata = { title: "Application — Imodoye Admin" };
export const dynamic = "force-dynamic";

const STAGES = ["new", "screening", "shortlisted", "interview", "selected", "waitlist", "declined"];

export default async function ApplicationDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { error?: string };
}) {
  const rows = await sql`
    select a.*, p.full_name, p.email, p.country, c.number as cohort_number
    from applications a
    left join profiles p on p.id = a.applicant_id
    left join cohorts c on c.id = a.cohort_id
    where a.id = ${params.id}
  `;
  const app = rows[0];
  if (!app) return notFound();

  const mailboxes = await sql`select address, display_name from mailboxes order by address`;
  const boundEmail = emailApplicant.bind(null, params.id);

  return (
    <div className="max-w-xl">
      <p className="font-mono text-xs mb-3 text-indigo">RESIDENCY APPLICATION</p>
      <h1 className="font-display text-3xl mb-1">{app.full_name}</h1>
      <p className="font-mono text-xs opacity-50 mb-8">
        {app.email} · COHORT {app.cohort_number ?? "—"} · {app.country ?? "—"}
      </p>

      <form action={updateApplicationStage.bind(null, params.id)} className="flex items-center gap-2 mb-8">
        <select name="stage" defaultValue={app.stage} className="font-mono text-xs px-2 py-1.5 border border-ink/15 rounded-sm bg-transparent">
          {STAGES.map((s) => (
            <option key={s} value={s}>{s.toUpperCase()}</option>
          ))}
        </select>
        <button type="submit" className="font-ui text-sm px-4 py-1.5 border border-ink/20 rounded-sm">Update stage</button>
      </form>

      <div className="bg-paper rounded p-6 mb-4">
        <p className="font-mono text-xs mb-2 opacity-50">WRITING BACKGROUND</p>
        <p className="font-ui text-sm opacity-80 whitespace-pre-wrap">{app.writing_background}</p>
      </div>

      <div className="bg-paper rounded p-6 mb-4">
        <p className="font-mono text-xs mb-2 opacity-50">PROJECT PROPOSAL</p>
        <p className="font-ui text-sm opacity-80 whitespace-pre-wrap">{app.project_proposal}</p>
      </div>

      {app.writing_sample_url && (
        <a href={app.writing_sample_url} target="_blank" rel="noreferrer" className="font-ui text-sm text-indigo underline mb-8 inline-block">
          View writing sample →
        </a>
      )}

      <div className="bg-paper rounded p-6">
        <p className="font-mono text-xs mb-4 opacity-50">
          EMAIL APPLICANT
          {app.last_contacted_at &&
            ` · LAST CONTACTED ${new Date(app.last_contacted_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`}
        </p>
        {searchParams.error && (
          <p className="font-ui text-sm text-terracotta mb-4">{searchParams.error}</p>
        )}
        <form action={boundEmail} className="space-y-4">
          <div>
            <label className="block font-ui text-sm mb-1 opacity-70">From</label>
            <select
              name="from"
              defaultValue="hello@imodoye.ng"
              className="w-full px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm bg-transparent"
            >
              {mailboxes.map((m) => (
                <option key={m.address} value={m.address}>{m.display_name} &lt;{m.address}&gt;</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-ui text-sm mb-1 opacity-70">Subject</label>
            <input
              name="subject"
              required
              defaultValue="Your Imodoye Fellowship application"
              className="w-full px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm"
            />
          </div>
          <div>
            <label className="block font-ui text-sm mb-1 opacity-70">Message</label>
            <RichTextEditor name="body" />
          </div>
          <button type="submit" className="font-ui text-sm px-4 py-2 bg-indigo text-paper rounded-sm">
            Send email
          </button>
        </form>
      </div>
    </div>
  );
}
