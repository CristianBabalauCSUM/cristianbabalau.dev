"use client";

import { useEffect, useState } from "react";

/** Sticky "ON THIS PAGE" table of contents with scroll-spy highlighting. */
export function Toc({ entries }: { entries: { id: string; label: string }[] }) {
  const [active, setActive] = useState(entries[0]?.id ?? "");

  useEffect(() => {
    const headings = entries
      .map((e) => document.getElementById(e.id))
      .filter((el): el is HTMLElement => !!el);
    if (!headings.length) return;

    const onScroll = () => {
      let current = headings[0].id;
      for (const h of headings) {
        if (h.getBoundingClientRect().top <= 120) current = h.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [entries]);

  return (
    <aside
      className="sticky top-24 self-start font-[family-name:var(--font-mono)] text-[12.5px] max-h-[calc(100vh-120px)] overflow-y-auto max-[1040px]:hidden"
      aria-label="table of contents"
    >
      <div className="text-[var(--text-dim)] tracking-[0.06em] mb-4 pb-2 border-b border-[var(--border)]">
        <span className="text-[var(--accent)]">##</span> ON THIS PAGE
      </div>
      <ol className="list-none p-0 m-0 flex flex-col gap-0.5">
        {entries.map((e) => (
          <li key={e.id}>
            <a
              href={`#${e.id}`}
              className={`block py-1.5 border-l transition-[color,border-color,padding] duration-[180ms] leading-[1.4] hover:text-[var(--text-bright)] hover:border-l-[var(--accent)] ${
                active === e.id
                  ? "text-[var(--accent)] border-l-[var(--accent)] pl-[18px]"
                  : "text-[var(--text-dim)] border-l-[var(--border)] pl-3.5"
              }`}
            >
              {e.label}
            </a>
          </li>
        ))}
      </ol>
    </aside>
  );
}
