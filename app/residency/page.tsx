import Link from "next/link";
import { RESIDENCY_STEPS } from "@/lib/mock-data";

export const metadata = { title: "Residency — Imodoye" };

export default function ResidencyPage() {
  return (
    <section className="px-6 py-16 md:px-16 max-w-2xl">
      <p className="font-mono text-xs mb-3 text-indigo">RESIDENCY</p>
      <h1 className="font-display text-4xl mb-4">How it works</h1>
      <p className="font-ui mb-10 opacity-80 leading-relaxed">
        One residency session a year in Ilorin. Selected fellows receive free
        accommodation, a weekly stipend, workshop access, and a place in the
        Imodoye alumni community — at no cost to them.
      </p>

      <div className="mb-12">
        {RESIDENCY_STEPS.map((s) => (
          <div key={s.n} className="flex gap-5 mb-5">
            <span className="font-mono text-terracotta text-sm w-7">{s.n}</span>
            <div>
              <p className="font-ui text-base font-medium mb-1">{s.title}</p>
              <p className="font-ui text-sm opacity-70">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-ink text-manuscript p-8 rounded">
        <p className="font-mono text-xs mb-2 text-gold">
          COHORT 08 · APPLICATIONS OPEN
        </p>
        <h2 className="font-display text-2xl mb-4">
          Apply to the 2027 residency
        </h2>
        <Link
          href="/residency/apply"
          className="font-ui text-sm px-6 py-3 bg-terracotta text-paper rounded-sm inline-block"
        >
          Start application
        </Link>
      </div>

      <Link href="/residency/archive" className="font-ui text-sm text-indigo underline mt-8 inline-block">
        View past cohorts &rarr;
      </Link>
    </section>
  );
}
