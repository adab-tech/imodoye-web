import { submitInquiry } from "./actions";

export const metadata = { title: "Contact — Imodoye" };

export default function ContactPage() {
  return (
    <section className="px-6 py-16 md:px-16 max-w-md mx-auto">
      <p className="font-mono text-xs mb-3 text-indigo">CONTACT</p>
      <h1 className="font-display text-4xl mb-6">Get in touch</h1>
      <p className="font-ui mb-8 opacity-70 leading-relaxed">
        Questions about the residency, the Review, or anything else — send
        us a note and we&#39;ll get back to you.
      </p>

      <form action={submitInquiry} className="space-y-4">
        <div>
          <label className="block font-ui text-sm mb-1 opacity-70">Name</label>
          <input name="name" required className="w-full px-3 py-2 border border-ink/15 rounded-sm bg-paper font-ui text-sm" />
        </div>
        <div>
          <label className="block font-ui text-sm mb-1 opacity-70">Email</label>
          <input name="email" type="email" required className="w-full px-3 py-2 border border-ink/15 rounded-sm bg-paper font-ui text-sm" />
        </div>
        <div>
          <label className="block font-ui text-sm mb-1 opacity-70">Message</label>
          <textarea name="message" rows={6} required className="w-full px-3 py-2 border border-ink/15 rounded-sm bg-paper font-ui text-sm" />
        </div>
        <button type="submit" className="font-ui text-sm px-6 py-3 bg-indigo text-paper rounded-sm">
          Send
        </button>
      </form>
    </section>
  );
}
