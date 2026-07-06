"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Blip, CornerBrackets } from "./ui";

/**
 * ---------------------------------------------------------------------------
 * TSPA NETWORK VIEWER
 *
 * The thesis's interactive product: a vis-network graph of a real
 * Information-Operations dataset (Armenia), restyled to the portfolio's
 * palette and served from public/demos/tspa-viewer/. A live preview at the
 * top of the thesis page with a full-width "open fullscreen" button that
 * opens a 90% modal where the graph is fully interactive.
 * ---------------------------------------------------------------------------
 */

const VIEWER_SRC = "/demos/tspa-viewer/index.html";

export function TspaViewer() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div className="my-[2em]">
      {/* Live preview */}
      <div className="relative bg-[var(--surface)] border border-[var(--border)] rounded-[14px] p-[18px] shadow-[var(--shadow-card)]">
        <CornerBrackets />
        <div className="flex items-center justify-between font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] border-b border-dashed border-[var(--border)] pb-3 mb-4 gap-3 flex-wrap">
          <span className="tracking-[0.04em]">
            ~/tspa-viewer --campaign armenia
          </span>
          <span className="flex items-center gap-1.5">
            <Blip size={6} />
            live network
          </span>
        </div>

        <div className="group relative rounded-[10px] overflow-hidden border border-[var(--border)]">
          <iframe
            src={VIEWER_SRC}
            title="TSPA network viewer preview"
            className="w-full h-[520px] block pointer-events-none bg-[var(--bg)]"
            loading="lazy"
          />
          <div className="pointer-events-none absolute inset-0 bg-transparent group-hover:bg-black/10 transition-colors duration-200" />
          <button
            onClick={() => setOpen(true)}
            className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 focus:translate-y-0 transition-transform duration-200 bg-[var(--accent)] text-[var(--on-accent)] font-[family-name:var(--font-mono)] text-[13px] font-semibold py-3 flex items-center justify-center gap-2 cursor-pointer"
          >
            ⛶ open fullscreen &amp; explore
          </button>
        </div>

        <p className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-dim)] leading-[1.6] mt-3 mb-0">
          <span className="text-[var(--accent)]">##</span> what this shows
        </p>
        <p className="text-[13px] text-[var(--text-dim)] leading-[1.6] mt-1.5 mb-0">
          A real slice of the thesis: the Armenia Information-Operations dataset
          as a communication network. Each dot is an account,{" "}
          <span className="text-[var(--accent)]">green = flagged IO</span>, grey =
          control, faint = isolated; edges are retweets, replies and mentions.
          Open fullscreen to zoom, pan, step through connected components, and
          click any account to inspect its posts. This is TSPA&apos;s output made
          tangible.
        </p>
        <p className="font-[family-name:var(--font-mono)] text-[10.5px] text-[var(--text-faint)] leading-[1.6] mt-2 mb-0">
          {"// live vis-network render, non-interactive preview. open fullscreen to explore."}
        </p>
      </div>

      {/* Fullscreen modal */}
      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-[6px] p-6"
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="TSPA network viewer"
          >
            <div
              className="relative w-[90vw] h-[90vh] rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--bg)] shadow-[0_32px_96px_rgba(0,0,0,0.7)]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setOpen(false)}
                aria-label="Close viewer"
                className="absolute top-3 right-3 z-10 w-9 h-9 grid place-items-center rounded-lg border border-[var(--border-strong)] bg-[var(--surface)]/80 backdrop-blur text-[var(--text-bright)] transition-[border-color,color] duration-150 hover:border-[var(--accent)] hover:text-[var(--accent)] cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
              <iframe
                src={VIEWER_SRC}
                title="TSPA network viewer, fullscreen"
                className="w-full h-full border-0"
              />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
