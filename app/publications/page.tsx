import { PUBLICATIONS, PublicationCategory } from "@/lib/mock-data";

export const metadata = { title: "Publications — Imodoye" };

const CATEGORY_LABELS: Record<PublicationCategory, string> = {
  Anthology: "Anthologies",
  Essay: "Essays",
  Story: "Stories",
  Poetry: "Poetry",
};
const CATEGORIES: PublicationCategory[] = ["Anthology", "Essay", "Story", "Poetry"];

export default function PublicationsPage() {
  return (
    <section className="px-6 py-16 md:px-16 max-w-2xl">
      <p className="font-mono text-xs mb-3 text-indigo">PUBLICATIONS</p>
      <h1 className="font-display text-4xl mb-6">The archive</h1>
      <p className="font-ui mb-12 opacity-80 leading-relaxed">
        Anthologies, essays, stories, and poetry published through Imodoye
        and the Imodoye Review.
      </p>

      {CATEGORIES.map((category) => {
        const entries = PUBLICATIONS.filter((p) => p.category === category);
        return (
          <div key={category} className="mb-10">
            <p className="font-mono text-xs mb-4 text-terracotta">
              {CATEGORY_LABELS[category].toUpperCase()}
            </p>
            {entries.length > 0 ? (
              <div className="space-y-3">
                {entries.map((p) => (
                  <div key={p.id} className="flex justify-between items-baseline pb-3 border-b border-ink/10">
                    <div>
                      <p className="font-display text-lg">{p.title}</p>
                      <p className="font-ui text-sm opacity-60">{p.author} · {p.venue}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-ui text-sm opacity-50">Coming soon.</p>
            )}
          </div>
        );
      })}
    </section>
  );
}
