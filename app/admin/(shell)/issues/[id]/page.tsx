import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import IssueForm from "../IssueForm";
import { updateIssue } from "../actions";

export const metadata = { title: "Edit issue — Imodoye Admin" };
export const dynamic = "force-dynamic";

export default async function EditIssuePage({ params }: { params: { id: string } }) {
  const rows = await sql`select * from issues where id = ${params.id}`;
  const issue = rows[0];
  if (!issue) return notFound();

  return (
    <div>
      <p className="font-mono text-xs mb-3 text-indigo">IMODOYE REVIEW</p>
      <h1 className="font-display text-3xl mb-8">Issue {String(issue.number).padStart(2, "0")}</h1>
      <IssueForm action={updateIssue.bind(null, params.id)} values={issue} />
    </div>
  );
}
