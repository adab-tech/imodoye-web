// Fellows, Cohorts, Partners, Publications, and Impact stats now come from
// the live Neon DB (lib/db.ts) via the admin CMS — see app/admin. What
// remains here is content the Editorial Dashboard (Review workflow, not yet
// built) will eventually own, plus the static onboarding steps.

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
