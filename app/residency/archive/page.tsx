import { sql } from "@/lib/db";

export const metadata = { title: "Residency Archive — Imodoye" };
export const revalidate = 60;

export default async function ResidencyArchivePage() {
  const [cohorts, fellows, photos] = await Promise.all([
    sql`select id, number from cohorts order by number`,
    sql`select cohort_id, name from fellows where cohort_id is not null`,
    sql`select cohort_id from media where cohort_id is not null`,
  ]);

  return (
    <section className="px-6 py-16 md:px-16 max-w-3xl">
      <p className="font-mono text-xs mb-3 text-indigo">RESIDENCY ARCHIVE</p>
      <h1 className="font-display text-4xl mb-10">Every cohort, documented</h1>

      <div className="space-y-8">
        {cohorts.map((cohort) => {
          const cohortFellows = fellows.filter((f) => f.cohort_id === cohort.id);
          const hasPhotos = photos.some((p) => p.cohort_id === cohort.id);
          return (
            <div key={cohort.id} className="bg-paper rounded p-6">
              <p className="font-mono text-xs mb-2 text-terracotta">
                COHORT {String(cohort.number).padStart(2, "0")}
              </p>
              {cohortFellows.length > 0 ? (
                <p className="font-ui text-sm opacity-70">
                  {cohortFellows.map((f) => f.name).join(", ")}
                </p>
              ) : (
                <p className="font-ui text-sm opacity-50">Fellow list coming soon.</p>
              )}
              {!hasPhotos && (
                <p className="font-mono text-xs mt-3 opacity-40">Photos coming soon</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
