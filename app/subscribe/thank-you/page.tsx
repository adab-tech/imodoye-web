import Link from "next/link";

export const metadata = { title: "Subscribed — Imodoye" };

export default function SubscribeThankYouPage() {
  return (
    <section className="px-6 py-24 md:px-16 max-w-md mx-auto text-center">
      <p className="font-mono text-xs mb-3 text-palm">SUBSCRIBED</p>
      <h1 className="font-display text-4xl mb-6">You&#39;re on the list.</h1>
      <p className="font-ui mb-8 opacity-70 leading-relaxed">
        We&#39;ll email you when there&#39;s news from the residency and the Review.
        Unsubscribe anytime from the link in any email we send.
      </p>
      <Link href="/" className="font-ui text-sm text-indigo underline">
        ← Back home
      </Link>
    </section>
  );
}
