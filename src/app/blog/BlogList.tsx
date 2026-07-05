"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { posts } from "@/data/posts";
import { FilterBar } from "@/components/FilterBar";
import { RssIcon } from "@/components/icons";

/** The big "★ FEATURED · LATEST" card with the terminal-style preview pane. */
function FeaturedPostCard({ post }: { post: (typeof posts)[number] }) {
  return (
    <Link
      className="block relative grid grid-cols-[1fr_1.2fr] border border-[var(--border)] rounded-[14px] bg-[var(--surface)] overflow-hidden mb-8 transition-[border-color] duration-[220ms] hover:border-[var(--accent)] max-[940px]:grid-cols-1"
      href={`/blog/${post.slug}`}
    >
      <div
        className="relative min-h-[280px] border-r border-[var(--border)] grid place-items-center overflow-hidden max-[940px]:border-r-0 max-[940px]:border-b max-[940px]:min-h-[220px]"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, var(--accent-dim) 0%, transparent 60%), linear-gradient(135deg, #0f1614 0%, #0a0a0a 70%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--dot-base) 1px, transparent 1.4px)",
            backgroundSize: "22px 22px",
          }}
        ></div>
        <pre className="relative z-[1] font-[family-name:var(--font-mono)] text-[var(--accent)] text-left leading-[1.4] text-[13px] p-6 border border-[var(--accent)] rounded-[10px] shadow-[0_0_32px_-8px_var(--accent-glow)] max-w-[75%] bg-[color-mix(in_oklab,var(--bg)_80%,transparent)] whitespace-pre-wrap">
          <span>
            $ cat post.md{"\n"}─────────────────{"\n"}
          </span>
          <span className="text-[var(--text-faint)]">{post.fileName}</span>
          {"\n\n"}
          <span className="text-[var(--text-dim)]">tags:</span> [
          <span className="text-[var(--accent)]">{post.tags.join(", ")}</span>]
          {"\n\n"}
          <span className="text-[var(--text-dim)]">read:</span> ~
          {post.readTime.replace(" read", "").replace(" min", "min")}
        </pre>
      </div>
      <div className="p-8 flex flex-col gap-3.5 max-[940px]:p-[22px]">
        <span className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.08em] text-[var(--accent)]">
          ★ FEATURED · LATEST
        </span>
        <h2 className="font-[family-name:var(--font-mono)] font-medium text-[clamp(22px,2.6vw,30px)] tracking-[-0.02em] leading-[1.18] text-[var(--text-bright)] m-0">
          {post.title}
        </h2>
        <p className="text-[15px] leading-[1.6] text-[var(--text)] m-0 text-pretty">
          {post.excerpt}
        </p>
        <div className="flex gap-3.5 font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] items-center flex-wrap">
          <span>{post.date}</span>
          <span className="text-[var(--text-faint)]">·</span>
          <span>{post.readTime}</span>
          <span className="text-[var(--text-faint)]">·</span>
          <span>{post.tags.map((t) => `#${t}`).join("  ")}</span>
        </div>
        <span className="mt-1.5 font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)] inline-flex items-center gap-1.5">
          read post →
        </span>
      </div>
    </Link>
  );
}

export function BlogList() {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | null>(null);

  const tags = useMemo(
    () => Array.from(new Set(posts.flatMap((p) => p.tags))),
    []
  );
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const p of posts) for (const t of p.tags) c[t] = (c[t] ?? 0) + 1;
    return c;
  }, []);

  const visible = posts.filter((p) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q));
    const matchesTag = !tag || p.tags.includes(tag);
    return matchesQuery && matchesTag;
  });

  const [featured, ...rest] = visible;

  return (
    <>
      <FilterBar
        placeholder="grep posts…"
        query={query}
        onQuery={setQuery}
        tags={tags}
        activeTag={tag}
        onTag={setTag}
        counts={counts}
        total={posts.length}
      />

      {featured && <FeaturedPostCard post={featured} />}
      {!featured && (
        <p className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--text-dim)] py-8">
          <span className="text-[var(--text-faint)]">$ </span>grep: no matches
          found
        </p>
      )}

      {/* Remaining posts as compact rows */}
      <div className="flex flex-col mb-14">
        {rest.map((p) => (
          <Link
            key={p.slug}
            className="group relative grid grid-cols-[120px_1fr_auto] gap-7 items-baseline py-[22px] border-b border-[var(--border)] first:border-t transition-[padding-left] duration-[220ms] hover:pl-3 max-[760px]:grid-cols-1 max-[760px]:gap-2"
            href={`/blog/${p.slug}`}
          >
            <div className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] tracking-[0.02em] whitespace-nowrap">
              {p.date}
            </div>
            <div className="min-w-0">
              <h3 className="font-[family-name:var(--font-mono)] font-medium text-[clamp(18px,2vw,22px)] tracking-[-0.02em] text-[var(--text-bright)] m-0 mb-1.5 transition-colors duration-200 group-hover:text-[var(--accent)]">
                {p.title}
              </h3>
              <p className="text-[14px] text-[var(--text)] m-0 mb-3 leading-[1.55] max-w-[70ch] text-pretty">
                {p.excerpt}
              </p>
            </div>
            <div className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] whitespace-nowrap text-right self-center max-[760px]:text-left">
              <span>{p.readTime}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* RSS box */}
      <div className="flex gap-3 flex-wrap items-center mt-2 mb-20 p-5 border border-dashed border-[var(--border-strong)] rounded-[12px] bg-[var(--surface)]">
        <div className="w-9 h-9 grid place-items-center bg-[var(--accent-dim)] text-[var(--accent)] rounded-[8px] shrink-0">
          <RssIcon />
        </div>
        <div className="flex-1 min-w-[200px]">
          <strong className="font-[family-name:var(--font-mono)] font-medium text-[14px] text-[var(--text-bright)]">
            Subscribe via RSS
          </strong>
          <p className="text-[13px] text-[var(--text-dim)] mt-1 mb-0">
            New posts hit your reader instantly, no email, no tracking.
          </p>
        </div>
        <a
          href="/rss.xml"
          className="font-[family-name:var(--font-mono)] text-[12px] py-2 px-4 border border-[var(--border-strong)] rounded-[8px] text-[var(--text-dim)] transition-[color,border-color] duration-150 hover:text-[var(--accent)] hover:border-[var(--accent)]"
        >
          /rss.xml
        </a>
      </div>
    </>
  );
}
