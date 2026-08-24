import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import FellowForm from "../FellowForm";
import {
  updateFellow,
  deleteFellow,
  addPublishedWork,
  removePublishedWork,
} from "../actions";

export const metadata = { title: "Edit fellow — Imodoye Admin" };
export const dynamic = "force-dynamic";

export default async function EditFellowPage({ params }: { params: { id: string } }) {
  const rows = await sql`
    select f.*, c.number as cohort_number
    from fellows f
    left join cohorts c on c.id = f.cohort_id
    where f.id = ${params.id}
  `;
  const fellow = rows[0];
  if (!fellow) return notFound();

  const works = await sql`
    select id, title, venue, genre from fellow_published_works
    where fellow_id = ${params.id} order by sort_order
  `;

  const boundUpdate = updateFellow.bind(null, params.id);
  const boundDelete = deleteFellow.bind(null, params.id);
  const boundAddWork = addPublishedWork.bind(null, params.id);

  return (
    <div>
      <p className="font-mono text-xs mb-3 text-indigo">FELLOWS</p>
      <h1 className="font-display text-3xl mb-8">{fellow.name}</h1>

      <FellowForm
        action={boundUpdate}
        values={{
          name: fellow.name,
          cohort_number: fellow.cohort_number,
          genre: fellow.genre,
          location: fellow.location,
          state: fellow.state,
          bio: fellow.bio,
          testimonial: fellow.testimonial,
          featured: fellow.featured,
          avatar_url: fellow.avatar_url,
        }}
      />

      <div className="max-w-xl mt-10 pt-8 border-t border-ink/10">
        <p className="font-mono text-xs mb-4 text-terracotta">PUBLISHED WORKS</p>
        <div className="space-y-2 mb-4">
          {works.map((w) => (
            <div key={w.id} className="flex items-center justify-between bg-paper rounded px-4 py-2">
              <span className="font-ui text-sm">{w.title} — <span className="opacity-60">{w.venue}</span></span>
              <form action={removePublishedWork.bind(null, w.id, params.id)}>
                <button type="submit" className="font-mono text-xs opacity-50 underline">remove</button>
              </form>
            </div>
          ))}
          {works.length === 0 && <p className="font-ui text-sm opacity-50">None yet.</p>}
        </div>
        <form action={boundAddWork} className="flex gap-2">
          <input name="title" placeholder="Title" required className="flex-1 px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm" />
          <input name="venue" placeholder="Venue" className="flex-1 px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm" />
          <input name="genre" placeholder="Genre" className="w-28 px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm" />
          <button type="submit" className="font-ui text-sm px-4 py-2 border border-ink/20 rounded-sm">Add</button>
        </form>
      </div>

      <form action={boundDelete} className="mt-10 pt-8 border-t border-ink/10">
        <button type="submit" className="font-ui text-sm text-terracotta underline">
          Delete this fellow
        </button>
      </form>
    </div>
  );
}
