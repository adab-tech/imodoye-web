import IssueForm from "../IssueForm";
import { createIssue } from "../actions";

export const metadata = { title: "New issue — Imodoye Admin" };

export default function NewIssuePage() {
  return (
    <div>
      <p className="font-mono text-xs mb-3 text-indigo">IMODOYE REVIEW</p>
      <h1 className="font-display text-3xl mb-8">New issue</h1>
      <IssueForm action={createIssue} />
    </div>
  );
}
