// MOCK DATA — shaped to match supabase/schema.sql exactly.
// TODO: once the Supabase project exists, replace each export below with a
// real query (e.g. `await supabase.from('fellows').select(...)`) and delete
// this file. Keeping the shapes identical now means that swap touches only
// the data-fetching call, not the page components that consume it.

export type Fellow = {
  id: string;
  slug: string;
  name: string;
  cohort: number;
  role: string;
  location: string;
  bio: string;
  featured: boolean;
  publishedWorks: { title: string; venue: string; genre: string }[];
  testimonial?: string;
};

export const FELLOWS: Fellow[] = [
  {
    id: "1",
    slug: "haneefah-abdulrahman",
    name: "Haneefah Abdulrahman",
    cohort: 1,
    role: "Poet",
    location: "Kaduna, Nigeria",
    bio: "Haneefah writes poetry concerned with inheritance, faith, and the Northern Nigerian domestic. Her Imodoye residency project became her debut chapbook, forthcoming 2027.",
    featured: true,
    publishedWorks: [
      { title: "What the River Keeps", venue: "Imodoye Review, Issue 01", genre: "Poetry" },
      { title: "Small Inheritances", venue: "Lolwe", genre: "Poetry" },
    ],
    testimonial: "Imodoye gave me six weeks of uninterrupted time I had never had as a writer.",
  },
  {
    id: "2",
    slug: "chukwudi-michael",
    name: "Chukwudi Michael",
    cohort: 1,
    role: "Novelist",
    location: "Ebonyi, Nigeria",
    bio: "Chukwudi is at work on a novel about return migration in South-East Nigeria.",
    featured: false,
    publishedWorks: [],
    testimonial: "The residency didn't just house me. It read my drafts, argued with me about them, and made the work better.",
  },
  {
    id: "3",
    slug: "arike-priscilla-adesina",
    name: "Arike Priscilla Adesina",
    cohort: 5,
    role: "Essayist",
    location: "Osun, Nigeria",
    bio: "Arike's essays sit at the intersection of memory and place.",
    featured: false,
    publishedWorks: [],
    testimonial: "Ilorin surprised me. A serious literary institution, built from nothing, entirely on the strength of its founder's conviction.",
  },
];

export type Issue = {
  id: string;
  number: number;
  theme: string;
  note: string;
  status: "current" | "upcoming" | "archived";
  openCategories: string[];
};

export const ISSUES: Issue[] = [
  { id: "issue-01", number: 1, theme: "Words that mend the world", status: "current",
    note: "Dedicated to the fellows of the Imodoye Residency.",
    openCategories: ["Poetry", "Fiction", "Essays", "Reviews", "Interviews", "Visual Art"] },
  { id: "issue-02", number: 2, theme: "Hyena", status: "upcoming",
    note: "On appetite, scavenging, and what refuses to stay buried.",
    openCategories: ["Poetry", "Fiction", "Visual Art"] },
  { id: "issue-03", number: 3, theme: "Science fiction", status: "upcoming",
    note: "African futures, speculative and otherwise.",
    openCategories: ["Fiction", "Essays", "Visual Art"] },
  { id: "issue-04", number: 4, theme: "Dream", status: "upcoming",
    note: "The logic of sleep, and its residue in waking work.",
    openCategories: ["Poetry", "Fiction", "Interviews"] },
  { id: "issue-05", number: 5, theme: "Compassion", status: "upcoming",
    note: "Care as subject, and as method.",
    openCategories: ["Essays", "Poetry", "Reviews"] },
  { id: "issue-06", number: 6, theme: "Humanity and AI", status: "upcoming",
    note: "What writing is for, now.",
    openCategories: ["Essays", "Fiction", "Visual Art"] },
];

export const RESIDENCY_STEPS = [
  { n: "01", title: "Registration", desc: "Create an account with your basic details." },
  { n: "02", title: "Application", desc: "Personal info, writing background, project proposal." },
  { n: "03", title: "Writing sample", desc: "Submit unpublished or published work for review." },
  { n: "04", title: "Review & shortlist", desc: "The board reviews and shortlists applicants." },
  { n: "05", title: "Selection", desc: "Selected fellows are notified and onboarded." },
];
