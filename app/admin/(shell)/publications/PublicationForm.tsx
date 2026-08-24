import { PUBLICATION_CATEGORIES, type PublicationCategory } from "@/lib/categories";

export type PublicationFormValues = {
  title?: string;
  author?: string;
  category?: PublicationCategory;
  venue?: string;
  url?: string;
};

export default function PublicationForm({
  action,
  values,
}: {
  action: (formData: FormData) => void;
  values?: PublicationFormValues;
}) {
  return (
    <form action={action} className="max-w-xl space-y-4">
      <div>
        <label className="block font-ui text-sm mb-1 opacity-70">Title</label>
        <input
          name="title"
          defaultValue={values?.title}
          required
          className="w-full px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm"
        />
      </div>

      <div>
        <label className="block font-ui text-sm mb-1 opacity-70">Author</label>
        <input
          name="author"
          defaultValue={values?.author}
          required
          className="w-full px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-ui text-sm mb-1 opacity-70">Category</label>
          <select
            name="category"
            defaultValue={values?.category ?? "Poetry"}
            className="w-full px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm"
          >
            {PUBLICATION_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-ui text-sm mb-1 opacity-70">Venue</label>
          <input
            name="venue"
            defaultValue={values?.venue}
            placeholder="Imodoye Review, Issue 01"
            className="w-full px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block font-ui text-sm mb-1 opacity-70">Link (optional)</label>
        <input
          name="url"
          type="url"
          defaultValue={values?.url}
          className="w-full px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm"
        />
      </div>

      <button type="submit" className="font-ui text-sm px-6 py-3 bg-indigo text-paper rounded-sm">
        Save
      </button>
    </form>
  );
}
