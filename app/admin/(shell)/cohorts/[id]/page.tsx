import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import { updateCohort, addCohortPhoto, removeCohortPhoto } from "../actions";

export const metadata = { title: "Edit cohort — Imodoye Admin" };
export const dynamic = "force-dynamic";

export default async function EditCohortPage({ params }: { params: { id: string } }) {
  const [rows, fellows, photos] = await Promise.all([
    sql`select * from cohorts where id = ${params.id}`,
    sql`select id, name from fellows where cohort_id = ${params.id} order by name`,
    sql`select id, storage_path, caption from media where cohort_id = ${params.id} order by created_at`,
  ]);
  const cohort = rows[0];
  if (!cohort) return notFound();

  return (
    <div>
      <p className="font-mono text-xs mb-3 text-indigo">RESIDENCY ARCHIVE</p>
      <h1 className="font-display text-3xl mb-8">Cohort {String(cohort.number).padStart(2, "0")}</h1>

      <form action={updateCohort.bind(null, params.id)} className="max-w-xl space-y-4 mb-10">
        <div>
          <label className="block font-ui text-sm mb-1 opacity-70">Title (optional)</label>
          <input name="title" defaultValue={cohort.title ?? ""} className="w-full px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm" />
        </div>
        <div>
          <label className="block font-ui text-sm mb-1 opacity-70">Year</label>
          <input name="year" type="number" defaultValue={cohort.year ?? ""} className="w-full px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm" />
        </div>
        <button type="submit" className="font-ui text-sm px-6 py-3 bg-indigo text-paper rounded-sm">Save</button>
      </form>

      <div className="max-w-xl mb-10">
        <p className="font-mono text-xs mb-3 text-terracotta">FELLOWS IN THIS COHORT</p>
        <p className="font-ui text-sm opacity-70">
          {fellows.length > 0 ? fellows.map((f) => f.name).join(", ") : "Assign fellows from the Fellows tab."}
        </p>
      </div>

      <div className="max-w-xl">
        <p className="font-mono text-xs mb-4 text-terracotta">PHOTOS</p>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {photos.map((p) => (
            <div key={p.id} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.storage_path} alt={p.caption ?? ""} className="w-full h-24 object-cover rounded" />
              <form action={removeCohortPhoto.bind(null, p.id, params.id)} className="absolute top-1 right-1">
                <button type="submit" className="font-mono text-xs bg-paper/90 px-1.5 py-0.5 rounded">×</button>
              </form>
            </div>
          ))}
          {photos.length === 0 && <p className="col-span-3 font-ui text-sm opacity-50">No photos yet.</p>}
        </div>
        <form action={addCohortPhoto.bind(null, params.id)} className="flex gap-2 items-end">
          <input type="file" name="photo" accept="image/*" required className="font-ui text-sm" />
          <input name="caption" placeholder="Caption (optional)" className="px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm" />
          <button type="submit" className="font-ui text-sm px-4 py-2 border border-ink/20 rounded-sm">Upload</button>
        </form>
      </div>
    </div>
  );
}
