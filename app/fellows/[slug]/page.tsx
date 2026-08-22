import { notFound } from "next/navigation";
import { FELLOWS } from "@/lib/mock-data";

export function generateStaticParams() {
  return FELLOWS.map((f) => ({ slug: f.slug }));
}

export default function FellowProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const fellow = FELLOWS.find((f) => f.slug === params.slug);
  if (!fellow) return notFound();

  return (
    <section className="px-6 py-16 md:px-16 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-18 h-18 rounded-full bg-indigo/10" style={{ width: 72, height: 72 }} />
        <div>
          <h1 className="font-display text-3xl">{fellow.name}</h1>
          <p className="font-mono text-sm text-terracotta">
            COHORT {fellow.cohort} · {fellow.role.toUpperCase()} · {fellow.location.toUpperCase()}
          </p>
        </div>
      </div>

      <p className="font-ui mb-8 max-w-lg opacity-80 leading-relaxed">
        {fellow.bio}
      </p>

      {fellow.publishedWorks.length > 0 && (
        <>
          <p className="font-mono text-xs mb-3 text-indigo">PUBLISHED WORK</p>
          <div className="space-y-3 mb-10">
            {fellow.publishedWorks.map((w) => (
              <div
                key={w.title}
                className="flex justify-between items-baseline pb-3 border-b border-ink/10"
              >
                <div>
                  <p className="font-display text-lg">{w.title}</p>
                  <p className="font-ui text-sm opacity-60">{w.venue}</p>
                </div>
                <span className="font-mono text-xs text-terracotta">
                  {w.genre.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {fellow.testimonial && (
        <>
          <p className="font-mono text-xs mb-3 text-palm">TESTIMONIAL</p>
          <blockquote className="font-display italic text-xl text-indigo leading-relaxed">
            &#8220;{fellow.testimonial}&#8221;
          </blockquote>
        </>
      )}
    </section>
  );
}
