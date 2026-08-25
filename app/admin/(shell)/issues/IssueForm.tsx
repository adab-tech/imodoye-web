import RichTextEditor from "../posts/RichTextEditor";

export type IssueFormValues = {
  number?: number;
  theme?: string;
  note?: string;
  status?: string;
  open_categories?: string[];
};

export default function IssueForm({
  action,
  values,
}: {
  action: (formData: FormData) => void;
  values?: IssueFormValues;
}) {
  return (
    <form action={action} className="max-w-xl space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-ui text-sm mb-1 opacity-70">Issue number</label>
          <input name="number" type="number" defaultValue={values?.number} required className="w-full px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm" />
        </div>
        <div>
          <label className="block font-ui text-sm mb-1 opacity-70">Status</label>
          <select name="status" defaultValue={values?.status ?? "upcoming"} className="w-full px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm">
            <option value="upcoming">Upcoming</option>
            <option value="current">Current — accepting submissions</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block font-ui text-sm mb-1 opacity-70">Theme</label>
        <input name="theme" defaultValue={values?.theme} required className="w-full px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm" />
      </div>

      <div>
        <label className="block font-ui text-sm mb-1 opacity-70">Note</label>
        <RichTextEditor name="note" defaultValue={values?.note} />
      </div>

      <div>
        <label className="block font-ui text-sm mb-1 opacity-70">Open categories (comma-separated)</label>
        <input
          name="categories"
          defaultValue={values?.open_categories?.join(", ")}
          placeholder="Poetry, Fiction, Essays"
          className="w-full px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm"
        />
      </div>

      <button type="submit" className="font-ui text-sm px-6 py-3 bg-indigo text-paper rounded-sm">
        Save
      </button>
    </form>
  );
}
