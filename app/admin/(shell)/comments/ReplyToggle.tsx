"use client";

import { useState } from "react";
import RichTextEditor from "../posts/RichTextEditor";

export default function ReplyToggle({ action }: { action: (formData: FormData) => void }) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="font-mono text-xs underline text-indigo">
        reply by email
      </button>
    );
  }

  return (
    <form action={action} className="mt-3 pt-3 border-t border-ink/10 space-y-3">
      <input
        name="subject"
        required
        defaultValue="Re: your comment on Imodoye"
        className="w-full px-3 py-2 border border-ink/15 rounded-sm font-ui text-sm"
      />
      <RichTextEditor name="body" />
      <button type="submit" className="font-ui text-sm px-4 py-2 bg-indigo text-paper rounded-sm">
        Send reply
      </button>
    </form>
  );
}
