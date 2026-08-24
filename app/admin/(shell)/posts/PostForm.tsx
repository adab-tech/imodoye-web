import { POST_CATEGORIES } from "@/lib/categories";
import RichTextEditor from "./RichTextEditor";

export type PostFormValues = {
  title?: string;
  excerpt?: string;
  body?: string;
  category?: string | null;
  tags?: string[];
  cover_image_url?: string | null;
  published_at?: string | null;
};

export default function PostForm({
  action,
  values,
}: {
  action: (formData: FormData) => void;
  values?: PostFormValues;
}) {
  return (
    <form action={action} className="max-w-xl space-y-4">
      {values?.cover_image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={values.cover_image_url} alt="" className="w-full h-40 object-cover rounded" />
      )}
      <div>
        <label className="block font-ui text-sm mb-1 opacity-70">Cover image</label>
        <input type="file" name="coverImage" accept="image/*" className="font-ui text-sm" />
      </div>

      <div>
        <label className="block font-ui text-sm mb-1 opacity-70">Title</label>
        <input
          name="title"
          defaultValue={values?.title}
          required
          className="w-full px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-ui text-sm mb-1 opacity-70">Category</label>
          <select
            name="category"
            defaultValue={values?.category ?? "General"}
            className="w-full px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm"
          >
            {POST_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-ui text-sm mb-1 opacity-70">Tags (comma-separated)</label>
          <input
            name="tags"
            defaultValue={values?.tags?.join(", ")}
            placeholder="fellowship, ilorin, poetry"
            className="w-full px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block font-ui text-sm mb-1 opacity-70">Excerpt (optional, for the posts list)</label>
        <input
          name="excerpt"
          defaultValue={values?.excerpt ?? ""}
          className="w-full px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm"
        />
      </div>

      <div>
        <label className="block font-ui text-sm mb-1 opacity-70">Body</label>
        <RichTextEditor name="body" defaultValue={values?.body} />
      </div>

      <label className="flex items-center gap-2 font-ui text-sm">
        <input type="checkbox" name="publish" defaultChecked={!!values?.published_at} />
        Published (visible on the site)
      </label>

      <button type="submit" className="font-ui text-sm px-6 py-3 bg-indigo text-paper rounded-sm">
        Save
      </button>
    </form>
  );
}
