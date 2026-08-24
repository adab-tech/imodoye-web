const COHORTS = Array.from({ length: 7 }, (_, i) => i + 1);

export type FellowFormValues = {
  name?: string;
  cohort_number?: number | null;
  genre?: string;
  location?: string;
  state?: string;
  bio?: string;
  testimonial?: string;
  featured?: boolean;
  avatar_url?: string;
};

export default function FellowForm({
  action,
  values,
}: {
  action: (formData: FormData) => void;
  values?: FellowFormValues;
}) {
  return (
    <form action={action} className="max-w-xl space-y-4">
      {values?.avatar_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={values.avatar_url} alt="" className="w-16 h-16 rounded-full object-cover" />
      )}
      <div>
        <label className="block font-ui text-sm mb-1 opacity-70">Photo</label>
        <input type="file" name="avatar" accept="image/*" className="font-ui text-sm" />
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-ui text-sm mb-1 opacity-70">Cohort</label>
          <select
            name="cohort"
            defaultValue={values?.cohort_number ?? ""}
            className="w-full px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm"
          >
            <option value="">—</option>
            {COHORTS.map((n) => (
              <option key={n} value={n}>Cohort {n}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-ui text-sm mb-1 opacity-70">Role / genre</label>
          <input
            name="role"
            defaultValue={values?.genre}
            placeholder="Poet, Novelist, Essayist..."
            className="w-full px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-ui text-sm mb-1 opacity-70">Location</label>
          <input
            name="location"
            defaultValue={values?.location}
            placeholder="City, Country"
            className="w-full px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm"
          />
        </div>
        <div>
          <label className="block font-ui text-sm mb-1 opacity-70">State (Nigeria)</label>
          <input
            name="state"
            defaultValue={values?.state}
            className="w-full px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block font-ui text-sm mb-1 opacity-70">Bio</label>
        <textarea
          name="bio"
          defaultValue={values?.bio}
          rows={4}
          className="w-full px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm"
        />
      </div>

      <div>
        <label className="block font-ui text-sm mb-1 opacity-70">Testimonial quote</label>
        <textarea
          name="testimonial"
          defaultValue={values?.testimonial}
          rows={2}
          className="w-full px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm"
        />
      </div>

      <label className="flex items-center gap-2 font-ui text-sm">
        <input type="checkbox" name="featured" defaultChecked={values?.featured} />
        Featured on the site
      </label>

      <button type="submit" className="font-ui text-sm px-6 py-3 bg-indigo text-paper rounded-sm">
        Save
      </button>
    </form>
  );
}
