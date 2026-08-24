import Link from "next/link";

export const metadata = { title: "Application received — Imodoye" };

export default function ApplicationThankYouPage() {
  return (
    <section className="px-6 py-24 md:px-16 max-w-md mx-auto text-center">
      <p className="font-mono text-xs mb-3 text-palm">APPLICATION RECEIVED</p>
      <h1 className="font-display text-4xl mb-6">Thank you.</h1>
      <p className="font-ui mb-8 opacity-70 leading-relaxed">
        Your application to Cohort 08 has been received. The board reviews
        applications on a rolling basis — we&#39;ll be in touch by email.
      </p>
      <Link href="/residency" className="font-ui text-sm text-indigo underline">
        ← Back to Residency
      </Link>
    </section>
  );
}
