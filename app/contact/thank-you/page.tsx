import Link from "next/link";

export const metadata = { title: "Message sent — Imodoye" };

export default function ContactThankYouPage() {
  return (
    <section className="px-6 py-24 md:px-16 max-w-md mx-auto text-center">
      <p className="font-mono text-xs mb-3 text-palm">MESSAGE SENT</p>
      <h1 className="font-display text-4xl mb-6">Thank you.</h1>
      <p className="font-ui mb-8 opacity-70 leading-relaxed">
        We&#39;ve received your message and will get back to you soon.
      </p>
      <Link href="/" className="font-ui text-sm text-indigo underline">
        ← Back home
      </Link>
    </section>
  );
}
