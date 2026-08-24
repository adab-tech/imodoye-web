import { notFound } from "next/navigation";
import Link from "next/link";
import { ISSUES } from "@/lib/mock-data";

export function generateStaticParams() {
  return ISSUES.map((i) => ({ issueId: i.id }));
}

export default function IssuePage({
  params,
}: {
  params: { issueId: string };
}) {
  const issue = ISSUES.find((i) => i.id === params.issueId);
  if (!issue) return notFound();

  return (
    <section className="px-6 py-16 md:px-16 bg-ink text-manuscript min-h-[60vh]">
      <div className="max-w-2xl">
        <Link
          href="/review"
          className="font-ui text-sm opacity-60 mb-8 inline-block"
        >
          ← All issues
        </Link>
        <p className="font-mono text-xs mb-3 text-gold">
          ISSUE {String(issue.number).padStart(2, "0")} ·{" "}
          {issue.status === "current"
            ? "NOW ACCEPTING SUBMISSIONS"
            : issue.status.toUpperCase()}
        </p>
        <h1 className="font-display text-5xl mb-3">{issue.theme}</h1>
        <p className="font-ui mb-10 opacity-65 max-w-md">{issue.note}</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {issue.openCategories.map((c) => (
            <div
              key={c}
              className="font-ui text-sm px-4 py-3 border border-manuscript/20 rounded-sm opacity-90"
            >
              {c}
            </div>
          ))}
        </div>

        <button className="font-ui text-sm px-6 py-3 bg-terracotta text-paper rounded-sm">
          Submit to this issue
        </button>
      </div>
    </section>
  );
}
