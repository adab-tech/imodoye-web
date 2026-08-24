import Link from "next/link";
import { ISSUES } from "@/lib/mock-data";

export const metadata = { title: "Imodoye Review — Issue archive" };

export default function ReviewArchivePage() {
  return (
    <section className="px-6 py-16 md:px-16 bg-ink text-manuscript min-h-[60vh]">
      <div className="max-w-3xl">
        <p className="font-mono text-xs mb-3 text-gold">IMODOYE REVIEW</p>
        <h1 className="font-display text-4xl mb-2">Issue archive</h1>
        <p className="font-ui mb-10 opacity-60 max-w-md">
          Every issue carries its own theme, set by the editorial team when a
          call opens.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {ISSUES.map((issue) => (
            <Link
              key={issue.id}
              href={`/review/${issue.id}`}
              className="text-left border border-manuscript/15 rounded p-6 block"
            >
              <p className="font-mono text-xs mb-2 text-gold opacity-90">
                ISSUE {String(issue.number).padStart(2, "0")} ·{" "}
                {issue.status.toUpperCase()}
              </p>
              <p className="font-display text-2xl mb-2">{issue.theme}</p>
              <p className="font-ui text-sm opacity-60">{issue.note}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
