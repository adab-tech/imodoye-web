import Link from "next/link";

export const metadata = { title: "Submission received — Imodoye Review" };

export default function ThankYouPage({
  searchParams,
}: {
  searchParams: { ref?: string };
}) {
  return (
    <section className="px-6 py-24 md:px-16 bg-ink text-manuscript min-h-[60vh] flex items-center">
      <div className="max-w-md">
        <p className="font-mono text-xs mb-3 text-gold">SUBMISSION RECEIVED</p>
        <h1 className="font-display text-4xl mb-4">Thank you.</h1>
        {searchParams.ref && (
          <p className="font-mono text-sm mb-6 opacity-70">
            Your reference: {searchParams.ref}
          </p>
        )}
        <p className="font-ui mb-8 opacity-70 leading-relaxed">
          Your work has entered the editorial queue. We read every
          submission blind — we&#39;ll be in touch by email with a decision.
        </p>
        <p className="font-ui text-sm opacity-70 mb-8">
          <Link href="/account/signup" className="text-gold underline">Create an account</Link> with
          this same email to track your submission&#39;s status here anytime.
        </p>
        <Link href="/review" className="font-ui text-sm opacity-60 underline">
          ← Back to the Review
        </Link>
      </div>
    </section>
  );
}
