import { PARTNERS, PartnerCategory } from "@/lib/mock-data";

export const metadata = { title: "Partners & Supporters — Imodoye" };

const CATEGORY_LABELS: Record<PartnerCategory, string> = {
  "Cultural Institution": "Cultural Institutions",
  University: "Universities",
  Donor: "Donors",
};
const CATEGORIES: PartnerCategory[] = ["Cultural Institution", "University", "Donor"];

export default function PartnersPage() {
  return (
    <section className="px-6 py-16 md:px-16 max-w-2xl">
      <p className="font-mono text-xs mb-3 text-terracotta">PARTNERS &amp; SUPPORTERS</p>
      <h1 className="font-display text-4xl mb-6">Built with, not alone</h1>
      <p className="font-ui mb-12 opacity-80 leading-relaxed">
        Imodoye is made possible by the institutions, universities, and
        donors who back the residency and the Review.
      </p>

      {CATEGORIES.map((category) => {
        const entries = PARTNERS.filter((p) => p.category === category);
        return (
          <div key={category} className="mb-10">
            <p className="font-mono text-xs mb-4 text-indigo">
              {CATEGORY_LABELS[category].toUpperCase()}
            </p>
            {entries.length > 0 ? (
              <ul className="space-y-2">
                {entries.map((p) => (
                  <li key={p.id} className="font-ui text-lg">
                    {p.name}
                    {p.blurb && (
                      <span className="block font-ui text-sm opacity-60 mt-1">{p.blurb}</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="font-ui text-sm opacity-50">Partnerships in this category are in progress.</p>
            )}
          </div>
        );
      })}
    </section>
  );
}
