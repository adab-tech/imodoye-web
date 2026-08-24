export type PostFormValues = {
  title?: string;
  body?: string;
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
        <label className="block font-ui text-sm mb-1 opacity-70">Body</label>
        <textarea
          name="body"
          defaultValue={values?.body}
          rows={12}
          className="w-full px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm"
        />
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
