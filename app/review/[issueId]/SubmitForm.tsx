"use client";

import { useState } from "react";
import { submitToIssue } from "./actions";

export default function SubmitForm({
  issueId,
  categories,
}: {
  issueId: string;
  categories: string[];
}) {
  const [open, setOpen] = useState(false);
  const action = submitToIssue.bind(null, issueId);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="font-ui text-sm px-6 py-3 bg-terracotta text-paper rounded-sm"
      >
        Submit to this issue
      </button>
    );
  }

  return (
    <form action={action} className="max-w-md space-y-4 border border-manuscript/15 rounded p-6">
      <div>
        <label className="block font-ui text-sm mb-1 opacity-70">Title of the work</label>
        <input name="title" required className="w-full px-3 py-2 bg-transparent border border-manuscript/25 rounded-sm font-ui text-sm" />
      </div>
      <div>
        <label className="block font-ui text-sm mb-1 opacity-70">Name</label>
        <input name="name" required className="w-full px-3 py-2 bg-transparent border border-manuscript/25 rounded-sm font-ui text-sm" />
      </div>
      <div>
        <label className="block font-ui text-sm mb-1 opacity-70">Email</label>
        <input name="email" type="email" required className="w-full px-3 py-2 bg-transparent border border-manuscript/25 rounded-sm font-ui text-sm" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-ui text-sm mb-1 opacity-70">Category</label>
          <select name="genre" required className="w-full px-3 py-2 bg-transparent border border-manuscript/25 rounded-sm font-ui text-sm">
            {categories.map((c) => (
              <option key={c} value={c} className="text-ink">{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-ui text-sm mb-1 opacity-70">Word count</label>
          <input name="wordCount" type="number" className="w-full px-3 py-2 bg-transparent border border-manuscript/25 rounded-sm font-ui text-sm" />
        </div>
      </div>
      <div>
        <label className="block font-ui text-sm mb-1 opacity-70">Paste your submission, or attach a file below</label>
        <textarea name="sampleText" rows={5} className="w-full px-3 py-2 bg-transparent border border-manuscript/25 rounded-sm font-ui text-sm" />
      </div>
      <div>
        <label className="block font-ui text-sm mb-1 opacity-70">Or attach a file</label>
        <input name="sampleFile" type="file" className="font-ui text-sm" />
      </div>
      <button type="submit" className="font-ui text-sm px-6 py-3 bg-terracotta text-paper rounded-sm">
        Submit
      </button>
    </form>
  );
}
