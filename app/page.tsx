import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <section className="px-6 pt-16 pb-14 md:px-16 max-w-3xl">
        <p className="font-mono text-xs mb-3 text-terracotta">ILORIN · NIGERIA</p>
        <h1 className="font-display text-5xl md:text-6xl mb-6 leading-[1.08]">
          A home for writers.
          <br />A space for stories.
        </h1>
        <p className="font-ui text-lg mb-8 max-w-xl opacity-75">
          A writers&#39; residency, fellowship community, and publishing
          house working from Ilorin toward the wider literary world.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/residency"
            className="font-ui text-sm px-6 py-3 bg-indigo text-paper rounded-sm"
          >
            Explore the residency
          </Link>
          <Link
            href="/review"
            className="font-ui text-sm px-6 py-3 border border-ink text-ink rounded-sm"
          >
            Read the Review
          </Link>
        </div>
      </section>

      <section className="px-6 py-16 md:px-16 bg-ink text-manuscript">
        <p className="font-mono text-xs mb-3 text-gold">
          ISSUE 01 · NOW ACCEPTING SUBMISSIONS
        </p>
        <h2 className="font-display text-4xl mb-3">Imodoye Review</h2>
        <p className="font-ui text-lg mb-8 opacity-80">
          Words that mend the world.
        </p>
        <Link
          href="/review"
          className="font-ui text-sm px-6 py-3 bg-terracotta text-paper rounded-sm inline-block"
        >
          Read the Review
        </Link>
      </section>
    </>
  );
}
