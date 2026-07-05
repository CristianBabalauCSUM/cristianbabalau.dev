"use client";

import { useEffect, useRef } from "react";

/**
 * grep-style search input with ⌘K shortcut + tag filter pills.
 * Used by the /projects and /blog list pages.
 */
export function FilterBar({
  placeholder,
  query,
  onQuery,
  tags,
  activeTag,
  onTag,
  counts,
  total,
}: {
  placeholder: string;
  query: string;
  onQuery: (q: string) => void;
  tags: string[];
  activeTag: string | null;
  onTag: (tag: string | null) => void;
  counts: Record<string, number>;
  total: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const pill = (active: boolean) =>
    `font-[family-name:var(--font-mono)] text-[11.5px] py-1.5 px-2.5 border rounded-full whitespace-nowrap transition-[border-color,color,background] duration-150 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
      active
        ? "text-[var(--accent)] border-[var(--accent)] bg-[var(--accent-dim)]"
        : "text-[var(--text-dim)] border-[var(--border)] bg-[var(--surface-2)] hover:text-[var(--accent)] hover:border-[var(--accent)]"
    }`;

  return (
    <div className="flex items-center gap-4 py-4 mb-8 border-t border-b border-[var(--border)] flex-wrap">
      <div className="flex-1 min-w-[240px]">
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-[10px] transition-[border-color] duration-150 focus-within:border-[var(--accent)]">
          <span
            className="font-[family-name:var(--font-mono)] text-[var(--accent)] text-[13px]"
            aria-hidden="true"
          >
            ›
          </span>
          <input
            ref={inputRef}
            className="flex-1 min-w-0 font-[family-name:var(--font-mono)] text-[13px] text-[var(--text-bright)] bg-transparent border-none outline-none placeholder:text-[var(--text-faint)]"
            placeholder={placeholder}
            aria-label={placeholder}
            value={query}
            onChange={(e) => onQuery(e.target.value)}
          />
          <kbd className="font-[family-name:var(--font-mono)] text-[10.5px] px-[7px] py-[3px] border border-[var(--border-strong)] rounded-[4px] text-[var(--text-dim)] bg-[var(--bg)]">
            ⌘K
          </kbd>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <button className={pill(activeTag === null)} onClick={() => onTag(null)}>
          all
          <span
            className={`ml-1.5 ${activeTag === null ? "text-[var(--accent)] opacity-70" : "text-[var(--text-faint)]"}`}
          >
            {total}
          </span>
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            className={pill(activeTag === tag)}
            onClick={() => onTag(activeTag === tag ? null : tag)}
          >
            {tag}
            <span
              className={`ml-1.5 ${activeTag === tag ? "text-[var(--accent)] opacity-70" : "text-[var(--text-faint)]"}`}
            >
              {counts[tag] ?? 0}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
