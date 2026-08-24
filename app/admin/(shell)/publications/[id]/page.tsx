import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import PublicationForm from "../PublicationForm";
import { updatePublicationEntry, deletePublicationEntry } from "../actions";

export const metadata = { title: "Edit publication — Imodoye Admin" };
export const dynamic = "force-dynamic";

export default async function EditPublicationPage({ params }: { params: { id: string } }) {
  const rows = await sql`select * from publication_entries where id = ${params.id}`;
  const entry = rows[0];
  if (!entry) return notFound();

  return (
    <div>
      <p className="font-mono text-xs mb-3 text-indigo">PUBLICATIONS</p>
      <h1 className="font-display text-3xl mb-8">{entry.title}</h1>

      <PublicationForm action={updatePublicationEntry.bind(null, params.id)} values={entry} />

      <form action={deletePublicationEntry.bind(null, params.id)} className="max-w-xl mt-10 pt-8 border-t border-ink/10">
        <button type="submit" className="font-ui text-sm text-terracotta underline">
          Delete this entry
        </button>
      </form>
    </div>
  );
}
