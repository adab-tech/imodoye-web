import { COHORTS, FELLOWS } from "@/lib/mock-data";

export const metadata = { title: "Residency Archive — Imodoye" };

export default function ResidencyArchivePage() {
  return (
    <section className="px-6 py-16 md:px-16 max-w-3xl">
      <p className="font-mono text-xs mb-3 text-indigo">RESIDENCY ARCHIVE</p>
      <h1 className="font-display text-4xl mb-10">Every cohort, documented</h1>

      <div className="space-y-8">
        {COHORTS.map((cohort) => {
          const fellows = FELLOWS.filter((f) => f.cohort === cohort.number);
          return (
            <div key={cohort.number} className="bg-paper rounded p-6">
              <p className="font-mono text-xs mb-2 text-terracotta">
                COHORT {String(cohort.number).padStart(2, "0")}
              </p>
              {fellows.length > 0 ? (
                <p className="font-ui text-sm opacity-70">
                  {fellows.map((f) => f.name).join(", ")}
                </p>
              ) : (
                <p className="font-ui text-sm opacity-50">Fellow list coming soon.</p>
              )}
              {!cohort.photosAvailable && (
                <p className="font-mono text-xs mt-3 opacity-40">Photos coming soon</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
