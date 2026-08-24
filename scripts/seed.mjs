// One-off: seed the live Neon DB with what's already public on the site
// (lib/mock-data.ts), so the new admin isn't starting from a blank slate.
// Safe to re-run — uses ON CONFLICT DO NOTHING throughout.
import { Client } from "pg";

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

try {
  for (let n = 1; n <= 7; n++) {
    await client.query(
      `insert into cohorts (number) values ($1) on conflict (number) do nothing`,
      [n]
    );
  }

  const fellows = [
    {
      slug: "haneefah-abdulrahman",
      name: "Haneefah Abdulrahman",
      cohort: 1,
      role: "Poet",
      location: "Kaduna, Nigeria",
      bio: "Haneefah writes poetry concerned with inheritance, faith, and the Northern Nigerian domestic. Her Imodoye residency project became her debut chapbook, forthcoming 2027.",
      featured: true,
      testimonial: "Imodoye gave me six weeks of uninterrupted time I had never had as a writer.",
      publishedWorks: [
        { title: "What the River Keeps", venue: "Imodoye Review, Issue 01", genre: "Poetry" },
        { title: "Small Inheritances", venue: "Lolwe", genre: "Poetry" },
      ],
    },
    {
      slug: "chukwudi-michael",
      name: "Chukwudi Michael",
      cohort: 1,
      role: "Novelist",
      location: "Ebonyi, Nigeria",
      bio: "Chukwudi is at work on a novel about return migration in South-East Nigeria.",
      featured: false,
      testimonial: "The residency didn't just house me. It read my drafts, argued with me about them, and made the work better.",
      publishedWorks: [],
    },
    {
      slug: "arike-priscilla-adesina",
      name: "Arike Priscilla Adesina",
      cohort: 5,
      role: "Essayist",
      location: "Osun, Nigeria",
      bio: "Arike's essays sit at the intersection of memory and place.",
      featured: false,
      testimonial: "Ilorin surprised me. A serious literary institution, built from nothing, entirely on the strength of its founder's conviction.",
      publishedWorks: [],
    },
  ];

  for (const f of fellows) {
    const { rows: cohortRows } = await client.query(
      `select id from cohorts where number = $1`,
      [f.cohort]
    );
    const cohortId = cohortRows[0]?.id ?? null;

    const { rows } = await client.query(
      `insert into fellows (slug, name, cohort_id, genre, location, bio, featured, testimonial)
       values ($1,$2,$3,$4,$5,$6,$7,$8)
       on conflict (slug) do nothing
       returning id`,
      [f.slug, f.name, cohortId, f.role, f.location, f.bio, f.featured, f.testimonial]
    );
    const fellowId = rows[0]?.id;
    if (fellowId) {
      for (const [i, w] of f.publishedWorks.entries()) {
        await client.query(
          `insert into fellow_published_works (fellow_id, title, venue, genre, sort_order)
           values ($1,$2,$3,$4,$5)`,
          [fellowId, w.title, w.venue, w.genre, i]
        );
      }
    }
  }

  const partners = [
    { name: "Association of Nigerian Authors", category: "cultural_institution" },
    { name: "Ebedi International Writers Residency", category: "cultural_institution" },
  ];
  for (const p of partners) {
    await client.query(
      `insert into partners (name, category) values ($1,$2)
       on conflict do nothing`,
      [p.name, p.category]
    );
  }

  const issues = [
    { number: 1, theme: "Words that mend the world", status: "current",
      note: "Dedicated to the fellows of the Imodoye Residency.",
      openCategories: ["Poetry", "Fiction", "Essays", "Reviews", "Interviews", "Visual Art"] },
    { number: 2, theme: "Hyena", status: "upcoming",
      note: "On appetite, scavenging, and what refuses to stay buried.",
      openCategories: ["Poetry", "Fiction", "Visual Art"] },
    { number: 3, theme: "Science fiction", status: "upcoming",
      note: "African futures, speculative and otherwise.",
      openCategories: ["Fiction", "Essays", "Visual Art"] },
    { number: 4, theme: "Dream", status: "upcoming",
      note: "The logic of sleep, and its residue in waking work.",
      openCategories: ["Poetry", "Fiction", "Interviews"] },
    { number: 5, theme: "Compassion", status: "upcoming",
      note: "Care as subject, and as method.",
      openCategories: ["Essays", "Poetry", "Reviews"] },
    { number: 6, theme: "Humanity and AI", status: "upcoming",
      note: "What writing is for, now.",
      openCategories: ["Essays", "Fiction", "Visual Art"] },
  ];
  for (const i of issues) {
    await client.query(
      `insert into issues (number, theme, note, status, open_categories)
       values ($1,$2,$3,$4,$5)
       on conflict (number) do nothing`,
      [i.number, i.theme, i.note, i.status, i.openCategories]
    );
  }

  console.log("Seed complete.");
} finally {
  await client.end();
}
