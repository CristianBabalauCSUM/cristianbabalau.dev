"use client";

import { useState } from "react";
import { site } from "@/data/site";

const shareBtn =
  "relative font-[family-name:var(--font-mono)] whitespace-nowrap shrink-0 transition-[border-color,background,transform,color] duration-[180ms] active:translate-y-px inline-flex items-center gap-1.5 text-[13px] tracking-[-0.005em] rounded-lg text-[var(--text-dim)] hover:text-[var(--accent)] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50";

export function ShareButtons({ path, title }: { path: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const url = `${site.url}${path}`;

  const open = (shareUrl: string) =>
    window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=500");

  return (
    <div className="mt-16 pt-8 border-t border-[var(--border)] flex justify-between gap-6 flex-wrap">
      <div className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] flex gap-3.5 items-center flex-wrap">
        <span className="text-[var(--text-faint)]">share:</span>
        <button
          className={shareBtn}
          onClick={() =>
            open(
              `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
            )
          }
        >
          twitter
        </button>
        <button
          className={shareBtn}
          onClick={() =>
            open(
              `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
            )
          }
        >
          linkedin
        </button>
        <button
          className={shareBtn}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(url);
              setCopied(true);
              setTimeout(() => setCopied(false), 1600);
            } catch {}
          }}
        >
          {copied ? "copied ✓" : "copy link"}
        </button>
      </div>
    </div>
  );
}
