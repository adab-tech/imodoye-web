export const metadata = { title: "About — Imodoye" };

export default function AboutPage() {
  return (
    <section className="px-6 py-16 md:px-16 max-w-2xl">
      <p className="font-mono text-xs mb-3 text-indigo">ABOUT</p>
      <h1 className="font-display text-4xl mb-6">Our story</h1>
      <p className="font-ui mb-5 opacity-80 leading-relaxed">
        Imodoye was founded in Ilorin, Kwara State, by Dr. Usman Oladipo
        Akanbi, President of the Association of Nigerian Authors — the first
        writers&#39; residency of its kind in Northern Nigeria, drawing on his
        late father&#39;s lifelong commitment to community.
      </p>
      <p className="font-ui mb-10 opacity-80 leading-relaxed">
        Seven cohorts later, Imodoye has grown into an established fellowship
        with its own literary journal — built to be judged by international
        editorial standards without losing its Ilorin roots.
      </p>
      <p className="font-mono text-xs mb-3 text-terracotta">
        PARTNERS &amp; SUPPORTERS
      </p>
      <p className="font-ui opacity-70">
        Association of Nigerian Authors · Ebedi International Writers
        Residency
      </p>
    </section>
  );
}
