"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Blip } from "./ui";

/**
 * ---------------------------------------------------------------------------
 * ORCHMARKETING DEMO
 *
 * The standalone OrchMarketing demo (public/demos/orchmarketing/) embedded at
 * the top of the OrchEcomm project page. A live, text-width preview with a
 * full-width "open full demo" button on hover that opens a 90% fullscreen
 * modal (blurred backdrop, rounded corners, exit button) where the demo is
 * fully interactive.
 * ---------------------------------------------------------------------------
 */

const DEMO_SRC = "/demos/orchmarketing/index.html";

export function OrchMarketingDemo() {
  const [open, setOpen] = useState(false);

  // Escape to close + lock body scroll while the modal is open.
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
    <div className="max-w-[70ch] my-[2em]">
      {/* Live, text-width preview */}
      <div className="group relative rounded-[14px] overflow-hidden border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] px-4 py-2 border-b border-dashed border-[var(--border)]">
          <span className="tracking-[0.04em]">~/orchmarketing --demo</span>
          <span className="flex items-center gap-1.5">
            <Blip size={6} />
            live preview
          </span>
        </div>
        <div className="relative">
          <iframe
            src={DEMO_SRC}
            title="OrchMarketing demo preview"
            className="w-full h-[460px] block pointer-events-none bg-[#0a0a0b]"
            loading="lazy"
          />
          {/* subtle dim + hint on hover */}
          <div className="pointer-events-none absolute inset-0 bg-transparent group-hover:bg-black/10 transition-colors duration-200" />
          <button
            onClick={() => setOpen(true)}
            className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 focus:translate-y-0 transition-transform duration-200 bg-[var(--accent)] text-[var(--on-accent)] font-[family-name:var(--font-mono)] text-[13px] font-semibold py-3 flex items-center justify-center gap-2 cursor-pointer"
          >
            ⛶ open full demo
          </button>
        </div>
      </div>
      <p className="font-[family-name:var(--font-mono)] text-[10.5px] text-[var(--text-faint)] leading-[1.6] mt-2 mb-0">
        {"// OrchMarketing module, live demo. hover the preview and open the full view to interact."}
      </p>

      {/* Fullscreen modal */}
      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-[6px] p-6"
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="OrchMarketing full demo"
          >
            <div
              className="relative w-[90vw] h-[90vh] rounded-2xl overflow-hidden border border-[var(--border)] bg-[#0a0a0b] shadow-[0_32px_96px_rgba(0,0,0,0.7)]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setOpen(false)}
                aria-label="Close demo"
                className="absolute top-3 right-3 z-10 w-9 h-9 grid place-items-center rounded-lg border border-[var(--border-strong)] bg-[var(--surface)]/80 backdrop-blur text-[var(--text-bright)] transition-[border-color,color] duration-150 hover:border-[var(--accent)] hover:text-[var(--accent)] cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
              <iframe
                src={DEMO_SRC}
                title="OrchMarketing full demo"
                className="w-full h-full border-0"
              />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
