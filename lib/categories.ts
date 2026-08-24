// Postgres enum values (snake_case) <-> display labels (Title Case),
// shared between admin forms and public pages.

export const PARTNER_CATEGORIES = ["donor", "cultural_institution", "university"] as const;
export type PartnerCategoryDb = (typeof PARTNER_CATEGORIES)[number];

export const PARTNER_CATEGORY_LABELS: Record<PartnerCategoryDb, string> = {
  donor: "Donor",
  cultural_institution: "Cultural Institution",
  university: "University",
};

export const PUBLICATION_CATEGORIES = ["Anthology", "Essay", "Story", "Poetry"] as const;
export type PublicationCategory = (typeof PUBLICATION_CATEGORIES)[number];

// Posts categories mirror the site's own sections, so a post can point
// readers back to the page it's about (a Residency update, a Review call
// for submissions, a Fellows spotlight, etc).
export const POST_CATEGORIES = [
  "General",
  "Residency",
  "Review",
  "Fellows",
  "Community",
  "Press",
] as const;
export type PostCategory = (typeof POST_CATEGORIES)[number];
