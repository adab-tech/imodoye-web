import PublicationForm from "../PublicationForm";
import { createPublicationEntry } from "../actions";

export const metadata = { title: "New publication — Imodoye Admin" };

export default function NewPublicationPage() {
  return (
    <div>
      <p className="font-mono text-xs mb-3 text-indigo">PUBLICATIONS</p>
      <h1 className="font-display text-3xl mb-8">New entry</h1>
      <PublicationForm action={createPublicationEntry} />
    </div>
  );
}
