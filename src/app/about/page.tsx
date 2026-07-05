import type { Metadata } from "next";
import Link from "next/link";
import { about } from "@/data/about";
import { site } from "@/data/site";
import { Blip, CornerBrackets, SectionHeader } from "@/components/ui";
import {
  ChatBubbleIcon,
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "About",
  description: "Who I am, how I got here, and what I'm up to right now.",
};

/** Renders **chunks** of a bio paragraph as green accent highlights. */
function highlight(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="text-[var(--accent)] font-semibold">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    )
  );
}

const elsewhereLink =
  "group inline-flex items-center gap-2.5 px-[18px] py-[13px] border border-[var(--border-strong)] rounded-[10px] bg-[var(--surface)] font-[family-name:var(--font-mono)] text-[13px] text-[var(--text-bright)] transition-[border-color,color,transform] duration-[180ms] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:-translate-y-0.5";
const elsewhereSub =
  "text-[var(--text-dim)] transition-colors duration-[180ms] group-hover:text-[var(--accent)]";

export default function AboutPage() {
  return (
    <main className="relative z-[1] max-w-[1200px] mx-auto px-8">
      {/* $ whoami hero */}
      <section className="pt-[88px] pb-18 grid grid-cols-[1.1fr_0.9fr] gap-14 items-center max-[940px]:grid-cols-1 max-[940px]:gap-9 max-[940px]:pt-14 max-[940px]:pb-12">
        <div>
          <div className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] mb-[22px] flex items-center gap-2">
            <Link
              className="transition-colors duration-150 hover:text-[var(--accent)]"
              href="/"
            >
              ~
            </Link>
            <span className="text-[var(--text-faint)]">/</span>
            <span className="text-[var(--text-bright)]">about</span>
          </div>
          <h1 className="font-[family-name:var(--font-mono)] font-medium text-[clamp(38px,5.2vw,62px)] leading-[1.02] tracking-[-0.04em] mb-2.5 mt-0 text-[var(--text-bright)]">
            <span className="text-[var(--text-faint)] font-light">$ </span>
            whoami
          </h1>
          <p className="font-[family-name:var(--font-mono)] text-[14px] text-[var(--text-dim)] mb-6 mt-0">
            {about.fullName}{" "}
            <span className="text-[var(--accent)]">· {about.handle}</span>
          </p>
          <p className="text-[19px] leading-[1.55] text-[var(--text)] max-w-[46ch] mb-[30px] mt-0 text-pretty">
            <em className="text-[var(--accent)] not-italic">{about.lead.em}</em>
            {about.lead.rest}
          </p>
          <div className="border-t border-[var(--border)]">
            {about.facts.map((fact) => (
              <div
                key={fact.label}
                className="grid grid-cols-[120px_1fr] gap-4 py-[11px] border-b border-[var(--border)] items-baseline"
              >
                <span className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] tracking-[0.02em] before:content-['→_'] before:text-[var(--text-faint)]">
                  {fact.label}
                </span>
                <span className="font-[family-name:var(--font-mono)] text-[13.5px] text-[var(--text-bright)]">
                  {fact.live ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Blip />
                      {fact.value}
                    </span>
                  ) : (
                    <>
                      {fact.value}{" "}
                      {fact.comment && (
                        <span className="text-[var(--accent)]">
                          {fact.comment}
                        </span>
                      )}
                    </>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Polaroid */}
        <div className="relative justify-self-center w-full max-w-[380px]">
          <span className="absolute -top-3.5 -right-3.5 font-[family-name:var(--font-mono)] text-[11px] text-[#001a0e] bg-[var(--accent)] px-3 py-1.5 rounded-full font-semibold shadow-[0_0_24px_-4px_var(--accent-glow)] z-[2]">
            ★ irl
          </span>
          <div className="relative border border-[var(--border)] rounded-2xl p-2.5 bg-[var(--surface)] shadow-[0_0_60px_-20px_var(--accent-glow)]">
            <CornerBrackets />
            {about.photo.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt={about.photo.alt}
                src={about.photo.src}
                width={360}
                height={450}
                className="w-full rounded-xl object-cover aspect-[4/5]"
              />
            ) : (
              <span
                className="img-placeholder w-full rounded-xl aspect-[4/5]"
                style={{ borderRadius: 12 }}
              >
                [your photo] — 4:5, ~720×900px
              </span>
            )}
          </div>
        </div>
      </section>

      {/* 01 — The longer version */}
      <section className="py-16 border-t border-[var(--border)]">
        <SectionHeader index="01" kicker="THE LONGER VERSION" title="A bit about me" />
        <div className="columns-2 gap-10 max-[760px]:columns-1">
          {about.bio.map((para, i) => (
            <p
              key={i}
              className={`text-[15px] leading-[1.7] text-[var(--text)] mt-0 ${i === about.bio.length - 1 ? "mb-0" : "mb-[1.1em]"} text-pretty break-inside-avoid ${
                i === 0
                  ? "first-letter:text-[var(--accent)] first-letter:font-[family-name:var(--font-mono)] first-letter:text-[2em] first-letter:font-semibold first-letter:float-left first-letter:leading-[0.8] first-letter:mr-1 first-letter:mt-1"
                  : ""
              }`}
            >
              {highlight(para)}
            </p>
          ))}
        </div>
      </section>

      {/* 02 — Off the clock */}
      <section className="py-16 border-t border-[var(--border)]">
        <SectionHeader index="02" kicker="OFF THE CLOCK" title="A few moments" />
        <div className="columns-3 gap-3 max-[640px]:columns-2">
          {about.gallery.map((photo, i) => (
            <div
              key={i}
              className="break-inside-avoid mb-3 relative border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--surface)] transition-[border-color,transform] duration-200 hover:border-[var(--accent)] hover:-translate-y-0.5"
            >
              {photo.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt={photo.alt}
                  src={photo.src}
                  style={{ width: "100%", height: "auto" }}
                />
              ) : (
                <span
                  className="img-placeholder w-full"
                  style={{
                    aspectRatio: i % 3 === 0 ? "3/4" : i % 3 === 1 ? "4/3" : "1/1",
                    border: "none",
                  }}
                >
                  {photo.alt}
                </span>
              )}
              <span className="absolute bottom-2.5 left-2.5 font-[family-name:var(--font-mono)] text-[10px] text-[var(--text-dim)] bg-[var(--surface)]/80 px-2 py-0.5 rounded-[4px] backdrop-blur-sm">
                {photo.caption}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 03 — Timeline */}
      <section className="py-16 border-t border-[var(--border)]">
        <SectionHeader index="03" kicker="HOW I GOT HERE" title="The short timeline" />
        <div>
          {about.timeline.map((item, i) => (
            <div
              key={i}
              className="grid grid-cols-[100px_1fr] gap-8 pb-10 last:pb-0 max-[640px]:grid-cols-1 max-[640px]:gap-1 max-[640px]:pb-8"
            >
              <div className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--text-dim)] pt-0.5 text-right max-[640px]:text-left">
                {item.year}
              </div>
              <div className="relative pl-[22px] border-l border-[var(--border)] max-[640px]:pl-5">
                <span className="absolute left-[-5px] top-[5px] w-[9px] h-[9px] rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent-glow)]"></span>
                <h4 className="font-[family-name:var(--font-mono)] text-[14px] font-medium text-[var(--text-bright)] mt-0 mb-1.5">
                  {item.title}
                </h4>
                <p className="text-[14px] leading-[1.6] text-[var(--text-dim)] m-0">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 05 — Currently */}
      <section className="py-16 border-t border-[var(--border)]">
        <SectionHeader index="05" kicker="RIGHT NOW" title="Currently" />
        <div className="grid grid-cols-3 gap-4 max-[760px]:grid-cols-1">
          {about.currently.map((card) => (
            <div
              key={card.label}
              className="relative overflow-hidden border border-[var(--border)] rounded-xl bg-[var(--surface)] p-5 group"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,var(--accent-dim),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-[250ms] pointer-events-none"></div>
              <div className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.08em] text-[var(--accent)] mb-2.5">
                {card.label}
              </div>
              <p className="text-[15px] text-[var(--text-bright)] leading-[1.45] m-0 mb-1">
                {card.title}
              </p>
              <p className="text-[13px] text-[var(--text-dim)] leading-[1.45] m-0">
                {card.note}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 06 — Elsewhere */}
      <section className="py-16 border-t border-[var(--border)]">
        <SectionHeader index="06" kicker="ELSEWHERE" title="Find me" />
        <div className="flex flex-wrap gap-3">
          <a
            href={site.github.url}
            target="_blank"
            rel="noopener noreferrer"
            className={elsewhereLink}
          >
            <GitHubIcon />
            <span>github</span>
            <span className={elsewhereSub}>/{site.github.handle}</span>
          </a>
          <a
            href={site.linkedin.url}
            target="_blank"
            rel="noopener noreferrer"
            className={elsewhereLink}
          >
            <LinkedInIcon />
            <span>linkedin</span>
            <span className={elsewhereSub}>/{site.linkedin.handle}</span>
          </a>
          <a href={`mailto:${site.email}`} className={elsewhereLink}>
            <MailIcon />
            <span>email</span>
            <span className={elsewhereSub}>{site.email}</span>
          </a>
          <Link href="/#contact" className={elsewhereLink}>
            <ChatBubbleIcon />
            <span>contact form</span>
            <span className={elsewhereSub}>→ reply &lt; 24h</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
