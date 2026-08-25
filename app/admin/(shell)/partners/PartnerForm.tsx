import { PARTNER_CATEGORIES, PARTNER_CATEGORY_LABELS, type PartnerCategoryDb } from "@/lib/categories";
import RichTextEditor from "../posts/RichTextEditor";

export type PartnerFormValues = {
  name?: string;
  category?: PartnerCategoryDb;
  blurb?: string;
  url?: string;
  featured?: boolean;
  logo_url?: string;
};

export default function PartnerForm({
  action,
  values,
}: {
  action: (formData: FormData) => void;
  values?: PartnerFormValues;
}) {
  return (
    <form action={action} className="max-w-xl space-y-4">
      {values?.logo_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={values.logo_url} alt="" className="h-12 object-contain" />
      )}
      <div>
        <label className="block font-ui text-sm mb-1 opacity-70">Logo</label>
        <input type="file" name="logo" accept="image/*" className="font-ui text-sm" />
      </div>

      <div>
        <label className="block font-ui text-sm mb-1 opacity-70">Name</label>
        <input
          name="name"
          defaultValue={values?.name}
          required
          className="w-full px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm"
        />
      </div>

      <div>
        <label className="block font-ui text-sm mb-1 opacity-70">Category</label>
        <select
          name="category"
          defaultValue={values?.category ?? "cultural_institution"}
          className="w-full px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm"
        >
          {PARTNER_CATEGORIES.map((c) => (
            <option key={c} value={c}>{PARTNER_CATEGORY_LABELS[c]}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-ui text-sm mb-1 opacity-70">Blurb (optional)</label>
        <RichTextEditor name="blurb" defaultValue={values?.blurb} />
      </div>

      <div>
        <label className="block font-ui text-sm mb-1 opacity-70">Website (optional)</label>
        <input
          name="url"
          type="url"
          defaultValue={values?.url}
          className="w-full px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm"
        />
      </div>

      <label className="flex items-center gap-2 font-ui text-sm">
        <input type="checkbox" name="featured" defaultChecked={values?.featured} />
        Featured
      </label>

      <button type="submit" className="font-ui text-sm px-6 py-3 bg-indigo text-paper rounded-sm">
        Save
      </button>
    </form>
  );
}
