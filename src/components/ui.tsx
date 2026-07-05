import Link from "next/link";
import type { ReactNode } from "react";

/** Base classes shared by every terminal-style button/link */
export const btnBase =
  "relative font-[family-name:var(--font-mono)] whitespace-nowrap shrink-0 transition-[border-color,background,transform,color] duration-[180ms] active:translate-y-px inline-flex items-center gap-2.5 py-3 px-[18px] text-[13px] tracking-[-0.005em] rounded-lg cursor-pointer disabled:cursor-not-allowed disabled:opacity-50";

/** Filled accent button, prefixed with "→" */
export const btnPrimary = `${btnBase} border border-[var(--accent)] bg-[var(--accent)] text-[var(--on-accent)] font-semibold hover:bg-transparent hover:border-[var(--accent)] hover:text-[var(--accent)] hover:shadow-[0_0_24px_-4px_var(--accent-glow)] before:content-['→'] before:text-[var(--on-accent)] hover:before:text-[var(--accent)]`;

/** Outlined button, prefixed with "$" */
export const btnSecondary = `${btnBase} border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text-bright)] hover:border-[var(--accent)] hover:text-[var(--accent)] before:content-['$'] before:text-[var(--text-faint)]`;

/** Square icon button (hero social links) */
export const btnIcon =
  "relative grid place-items-center w-10 h-10 p-0 border border-[var(--border-strong)] rounded-lg text-[var(--text-bright)] bg-[var(--surface)] shrink-0 transition-[border-color,background,transform,color] duration-[180ms] hover:border-[var(--accent)] hover:text-[var(--accent)] active:translate-y-px";

/** Numbered section header used on every section of the site */
export function SectionHeader({
  index,
  kicker,
  title,
  aside,
}: {
  index: string;
  kicker: string;
  title: string;
  aside?: ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-6 mb-9 pb-5 border-b border-[var(--border)]">
      <div>
        <div className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] tracking-[0.05em]">
          <span className="text-[var(--accent)] mr-2">{index}</span>
          {kicker}
        </div>
        <h2 className="font-[family-name:var(--font-mono)] font-medium text-[clamp(28px,3.5vw,40px)] tracking-[-0.03em] text-[var(--text-bright)] mt-2 mb-0">
          {title}
        </h2>
      </div>
      {aside && (
        <div className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] text-right">
          {aside}
        </div>
      )}
    </div>
  );
}

/** Blinking terminal cursor */
export function Cursor() {
  return (
    <span
      className="inline-block w-[0.55ch] h-[1em] bg-[var(--accent)] ml-1 [vertical-align:-10%] animate-[blink_1.05s_steps(2)_infinite]"
      aria-hidden="true"
    ></span>
  );
}

/** "~ / segment · n entries" breadcrumb + "$ command" page hero */
export function PageHero({
  segment,
  entries,
  command,
  commandAccent,
  intro,
}: {
  segment: string;
  entries?: string;
  command: string;
  commandAccent: string;
  intro: string;
}) {
  return (
    <section className="pt-[88px] pb-14 max-[940px]:pt-14 max-[940px]:pb-10">
      <div className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] mb-[18px] flex items-center gap-2">
        <Link
          className="transition-colors duration-150 hover:text-[var(--accent)]"
          href="/"
        >
          ~
        </Link>
        <span className="text-[var(--text-faint)]">/</span>
        <span className="text-[var(--text-bright)]">{segment}</span>
        {entries && (
          <>
            <span className="text-[var(--text-faint)]">·</span>
            <span>{entries}</span>
          </>
        )}
      </div>
      <h1 className="font-[family-name:var(--font-mono)] font-medium text-[clamp(40px,6vw,72px)] leading-[1.02] tracking-[-0.04em] mt-0 mb-5 text-[var(--text-bright)]">
        <span className="text-[var(--text-faint)] font-light">$ </span>
        {command}{" "}
        <span className="text-[var(--accent)]">{commandAccent}</span>
        <Cursor />
      </h1>
      <p className="text-[17px] leading-[1.65] text-[var(--text)] max-w-[52ch] mt-0 mb-9 text-pretty">
        {intro}
      </p>
    </section>
  );
}

/** Corner brackets decoration (chat widget, about polaroid) */
export function CornerBrackets() {
  return (
    <>
      <span className="absolute w-[10px] h-[10px] border border-[var(--accent)] opacity-50 top-[-1px] left-[-1px] border-r-0 border-b-0"></span>
      <span className="absolute w-[10px] h-[10px] border border-[var(--accent)] opacity-50 top-[-1px] right-[-1px] border-l-0 border-b-0"></span>
      <span className="absolute w-[10px] h-[10px] border border-[var(--accent)] opacity-50 bottom-[-1px] left-[-1px] border-r-0 border-t-0"></span>
      <span className="absolute w-[10px] h-[10px] border border-[var(--accent)] opacity-50 bottom-[-1px] right-[-1px] border-l-0 border-t-0"></span>
    </>
  );
}

/** Small pulsing status dot */
export function Blip({ size = 7 }: { size?: number }) {
  return (
    <span
      className="rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent-glow)] animate-[blip-pulse_1.6s_ease-in-out_infinite] inline-block shrink-0"
      style={{ width: size, height: size }}
      aria-hidden="true"
    ></span>
  );
}
