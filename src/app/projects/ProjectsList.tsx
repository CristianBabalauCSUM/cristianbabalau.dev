"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { projects } from "@/data/projects";
import { FilterBar } from "@/components/FilterBar";

export function ProjectsList() {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | null>(null);

  const tags = useMemo(
    () => Array.from(new Set(projects.flatMap((p) => p.tags))),
    []
  );
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const p of projects) for (const t of p.tags) c[t] = (c[t] ?? 0) + 1;
    return c;
  }, []);

  const visible = projects.filter((p) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.role.toLowerCase().includes(q);
    const matchesTag = !tag || p.tags.includes(tag);
    return matchesQuery && matchesTag;
  });

  return (
    <>
      <FilterBar
        placeholder="grep projects…"
        query={query}
        onQuery={setQuery}
        tags={tags}
        activeTag={tag}
        onTag={setTag}
        counts={counts}
        total={projects.length}
      />
      <div className="flex flex-col mb-14">
        {visible.map((p) => (
          <Link
            key={p.slug}
            className="group relative grid grid-cols-[120px_1fr_auto] gap-7 items-baseline py-[22px] border-b border-[var(--border)] first:border-t transition-[padding-left] duration-[220ms] hover:pl-3 max-[760px]:grid-cols-1 max-[760px]:gap-2"
            href={`/project/${p.slug}`}
          >
            <span className="absolute left-[-22px] top-[26px] font-[family-name:var(--font-mono)] text-[var(--accent)] opacity-0 -translate-x-1.5 transition-[opacity,transform] duration-200 group-hover:opacity-100 group-hover:translate-x-0 max-[760px]:hidden">
              →
            </span>
            <div className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] tracking-[0.02em] whitespace-nowrap">
              {p.year}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                <h3 className="font-[family-name:var(--font-mono)] font-medium text-[clamp(18px,2vw,22px)] tracking-[-0.02em] text-[var(--text-bright)] m-0 transition-colors duration-200 group-hover:text-[var(--accent)]">
                  {p.title}
                </h3>
                {p.badges?.map((b) => (
                  <span
                    key={b}
                    className="font-[family-name:var(--font-mono)] text-[10px] px-1.5 py-0.5 border rounded-[4px] border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-dim)] whitespace-nowrap"
                  >
                    ★ {b}
                  </span>
                ))}
              </div>
              <p className="text-[14px] text-[var(--text)] m-0 mb-3 leading-[1.55] max-w-[70ch] text-pretty">
                {p.description}
              </p>
              <div className="flex gap-2 flex-wrap items-center">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="font-[family-name:var(--font-mono)] text-[11px] px-2 py-1 border rounded-[4px] border-[var(--border-strong)] text-[var(--text-dim)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] whitespace-nowrap text-right self-center max-[760px]:text-left">
              <span className="text-[var(--accent)] block">{p.role}</span>
              <span>{p.lastActive}</span>
            </div>
          </Link>
        ))}
        {visible.length === 0 && (
          <p className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--text-dim)] py-8">
            <span className="text-[var(--text-faint)]">$ </span>grep: no matches
            found
          </p>
        )}
      </div>
    </>
  );
}
