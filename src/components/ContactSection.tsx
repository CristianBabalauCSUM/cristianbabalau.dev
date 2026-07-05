"use client";

import { useState } from "react";
import { site } from "@/data/site";
import { SectionHeader, btnPrimary, btnSecondary } from "./ui";

const fieldLabel =
  "block font-[family-name:var(--font-mono)] text-[11px] tracking-[0.06em] text-[var(--text-dim)] mb-1.5";
const fieldInput =
  "w-full bg-[var(--bg)] border border-[var(--border-strong)] rounded-lg py-[11px] px-[14px] font-[family-name:var(--font-sans)] text-[14px] text-[var(--text-bright)] transition-[border-color] duration-150 focus:outline-none focus:border-[var(--accent)]";

/** "03 GET IN TOUCH" — contact info + message form (posts to /api/contact). */
export function ContactSection() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="relative py-20" id="contact">
      <SectionHeader
        index="03"
        kicker="GET IN TOUCH"
        title="Let's build something."
        aside={
          <>
            ~/contact
            <br />
            <span className="text-[var(--accent)]">● replies in &lt; 24h</span>
          </>
        }
      />
      <div className="grid grid-cols-[1fr_1.1fr] gap-8 max-[940px]:grid-cols-1">
        <div className="flex flex-col gap-7">
          <a
            className="font-[family-name:var(--font-mono)] text-[clamp(22px,2.6vw,32px)] tracking-[-0.02em] text-[var(--text-bright)] inline-block pb-1 border-b border-dashed border-[var(--border-strong)] transition-[color,border-color] duration-200 hover:text-[var(--accent)] hover:border-[var(--accent)]"
            href={`mailto:${site.email}`}
          >
            {site.email} →
          </a>
          <div className="flex flex-col">
            {(
              [
                ["location", site.location, false],
                ["status", site.contactStatus, true],
                ["stack", site.stackSummary, false],
                ["github", `@${site.github.handle}`, false],
                ["linkedin", site.linkedin.handle, false],
              ] as [string, string, boolean][]
            ).map(([label, value, accent]) => (
              <div
                key={label}
                className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--text-dim)]"
              >
                <span className="text-[var(--text-faint)] mr-2.5">{label}</span>
                <span
                  className={accent ? "text-[var(--accent)]" : "text-[var(--text-bright)]"}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
          {site.calendly && (
            <div className="flex flex-col gap-1.5">
              <span className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-faint)] tracking-[0.04em]">
                prefer a call?
              </span>
              <a
                className={`${btnSecondary} self-start`}
                target="_blank"
                rel="noopener noreferrer"
                href={site.calendly}
              >
                schedule a 30-min call
              </a>
            </div>
          )}
        </div>

        <form
          className="border border-[var(--border)] bg-[var(--surface)] rounded-[14px] p-6"
          onSubmit={onSubmit}
        >
          <div className="mb-[18px]">
            <label className={fieldLabel} htmlFor="name">
              NAME<span className="text-[var(--accent)] ml-1">*</span>
            </label>
            <input className={fieldInput} id="name" required name="name" />
          </div>
          <div className="mb-[18px]">
            <label className={fieldLabel} htmlFor="email">
              EMAIL<span className="text-[var(--accent)] ml-1">*</span>
            </label>
            <input
              className={fieldInput}
              id="email"
              type="email"
              required
              name="email"
            />
          </div>
          <div className="mb-[18px]">
            <label className={fieldLabel} htmlFor="msg">
              MESSAGE<span className="text-[var(--accent)] ml-1">*</span>
            </label>
            <textarea
              className={`${fieldInput} resize-y min-h-[110px]`}
              id="msg"
              name="msg"
              required
              minLength={10}
              maxLength={2000}
              placeholder="What are you building?"
            ></textarea>
          </div>
          <div className="flex items-center justify-between pt-1.5">
            <span className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-faint)]">
              {status === "sent"
                ? "✓ message sent, talk soon"
                : status === "error"
                  ? "✗ something broke, email me instead"
                  : "protected · rate-limited"}
            </span>
            <button
              className={btnPrimary}
              type="submit"
              disabled={status === "sending"}
            >
              {status === "sending" ? "sending…" : "send message"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
