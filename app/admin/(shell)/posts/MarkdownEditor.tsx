"use client";

import { useRef, useState } from "react";

type FormatType =
  | "bold"
  | "italic"
  | "h2"
  | "h3"
  | "link"
  | "image"
  | "bullet"
  | "number"
  | "quote"
  | "code";

const LINE_PREFIXES: Partial<Record<FormatType, string>> = {
  h2: "## ",
  h3: "### ",
  bullet: "- ",
  number: "1. ",
  quote: "> ",
};

const WRAPS: Partial<Record<FormatType, [string, string]>> = {
  bold: ["**", "**"],
  italic: ["*", "*"],
  code: ["`", "`"],
};

const PLACEHOLDERS: Partial<Record<FormatType, string>> = {
  bold: "bold text",
  italic: "italic text",
  code: "code",
  h2: "Heading",
  h3: "Subheading",
  bullet: "List item",
  number: "List item",
  quote: "Quoted text",
};

const TOOLBAR: { type: FormatType; label: string; title: string }[] = [
  { type: "bold", label: "B", title: "Bold" },
  { type: "italic", label: "I", title: "Italic" },
  { type: "h2", label: "H2", title: "Heading" },
  { type: "h3", label: "H3", title: "Subheading" },
  { type: "quote", label: "❝", title: "Quote" },
  { type: "bullet", label: "•", title: "Bullet list" },
  { type: "number", label: "1.", title: "Numbered list" },
  { type: "link", label: "🔗", title: "Link" },
  { type: "image", label: "🖼", title: "Image (from a URL — upload files below and paste the link here)" },
  { type: "code", label: "</>", title: "Inline code" },
];

export default function MarkdownEditor({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const ref = useRef<HTMLTextAreaElement>(null);

  function applyFormat(type: FormatType) {
    const el = ref.current;
    if (!el) return;
    const { selectionStart, selectionEnd } = el;
    const selected = value.slice(selectionStart, selectionEnd);

    if (type === "link" || type === "image") {
      const text = selected || (type === "link" ? "link text" : "alt text");
      const prefix = type === "image" ? "![" : "[";
      const inserted = `${prefix}${text}](url)`;
      const next = value.slice(0, selectionStart) + inserted + value.slice(selectionEnd);
      setValue(next);
      requestAnimationFrame(() => {
        const urlStart = selectionStart + prefix.length + text.length + 2;
        el.focus();
        el.setSelectionRange(urlStart, urlStart + 3);
      });
      return;
    }

    if (WRAPS[type]) {
      const [open, close] = WRAPS[type]!;
      const text = selected || PLACEHOLDERS[type]!;
      const inserted = `${open}${text}${close}`;
      const next = value.slice(0, selectionStart) + inserted + value.slice(selectionEnd);
      setValue(next);
      requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(selectionStart + open.length, selectionStart + open.length + text.length);
      });
      return;
    }

    // Line-prefixed formats (headings, lists, quote): insert the prefix at
    // the start of the current line, leaving the rest of the line as-is.
    const prefix = LINE_PREFIXES[type]!;
    const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
    const insertedText = selected || PLACEHOLDERS[type]!;
    const next = selected
      ? value.slice(0, lineStart) + prefix + value.slice(lineStart)
      : value.slice(0, lineStart) + prefix + insertedText + value.slice(lineStart);
    setValue(next);
    requestAnimationFrame(() => {
      el.focus();
      const from = selected ? selectionStart + prefix.length : lineStart + prefix.length;
      const to = selected ? selectionEnd + prefix.length : from + insertedText.length;
      el.setSelectionRange(from, to);
    });
  }

  return (
    <div>
      <div className="flex flex-wrap gap-1 mb-2 p-1.5 bg-ink/5 rounded-sm">
        {TOOLBAR.map((btn) => (
          <button
            key={btn.type}
            type="button"
            title={btn.title}
            onClick={() => applyFormat(btn.type)}
            className="font-mono text-xs w-8 h-8 flex items-center justify-center rounded-sm hover:bg-ink/10 text-ink/80"
          >
            {btn.label}
          </button>
        ))}
      </div>
      <textarea
        ref={ref}
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={14}
        className="w-full px-3 py-2 border border-ink/15 rounded-sm font-mono text-sm"
      />
      <p className="font-mono text-xs opacity-40 mt-1">Markdown — select text and click a button, or type it directly.</p>
    </div>
  );
}
