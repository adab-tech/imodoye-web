import { sql } from "@/lib/db";
import { confirmUnsubscribe } from "./actions";

export const metadata = { title: "Unsubscribe — Imodoye" };
export const dynamic = "force-dynamic";

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams.token;
  const rows = token ? await sql`select email from subscribers where unsubscribe_token = ${token}` : [];
  const subscriber = rows[0];

  return (
    <section className="px-6 py-24 md:px-16 max-w-md mx-auto text-center">
      <p className="font-mono text-xs mb-3 text-terracotta">NEWSLETTER</p>
      {subscriber ? (
        <>
          <h1 className="font-display text-4xl mb-6">Unsubscribe?</h1>
          <p className="font-ui mb-8 opacity-70 leading-relaxed">
            {subscriber.email} will stop receiving emails from Imodoye.
          </p>
          <form action={confirmUnsubscribe.bind(null, token!)}>
            <button type="submit" className="font-ui text-sm px-6 py-3 bg-terracotta text-paper rounded-sm">
              Confirm unsubscribe
            </button>
          </form>
        </>
      ) : (
        <>
          <h1 className="font-display text-4xl mb-6">You&#39;re not on our list.</h1>
          <p className="font-ui opacity-70 leading-relaxed">
            This link is no longer valid — you may have already unsubscribed.
          </p>
        </>
      )}
    </section>
  );
}
