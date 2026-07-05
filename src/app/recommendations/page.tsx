import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  recommendations,
  recommendationsIntro,
} from "@/data/recommendations";
import { PageHero, SectionHeader } from "@/components/ui";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";

/**
 * DISABLED FOR NOW — the page 404s until real recommendations exist.
 * To re-enable: set this to false and uncomment the "recommendations"
 * entry in src/components/Topbar.tsx (and src/app/sitemap.ts).
 */
const RECOMMENDATIONS_DISABLED = true;

export const metadata: Metadata = {
  title: "Recommendations",
  description: "Verified references from people I've worked with.",
};

function initials(name: string) {
  return name
    .replace(/[^\p{L}\s]/gu, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export default function RecommendationsPage() {
  if (RECOMMENDATIONS_DISABLED) notFound();
  return (
    <main className="relative z-[1] max-w-[1200px] mx-auto px-8">
      <PageHero
        segment="recommendations"
        entries={`${recommendations.length} entries`}
        command="cat"
        commandAccent="~/references"
        intro={recommendationsIntro}
      />

      {/* 01 — Recommendations */}
      <section className="relative pb-14" id="recommendations">
        <SectionHeader
          index="01"
          kicker="RECOMMENDATIONS"
          title="What others say."
          aside={
            <>
              ~/recommendations
              <br />
              <span className="text-[var(--accent)]">
                ● {recommendations.length} verified
              </span>
            </>
          }
        />
        <div className="grid grid-cols-2 gap-5 max-[760px]:grid-cols-1 mb-14">
          {recommendations.map((rec) => (
            <article
              key={rec.name}
              className="border border-[var(--border)] bg-[var(--surface)] rounded-[14px] p-6 flex flex-col gap-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  {rec.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt={rec.name}
                      src={rec.avatar}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full border border-[var(--border-strong)] object-cover"
                    />
                  ) : (
                    <span className="w-10 h-10 rounded-full border border-[var(--border-strong)] bg-[var(--surface-2)] grid place-items-center font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)]">
                      {initials(rec.name) || "?"}
                    </span>
                  )}
                  <div>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-[family-name:var(--font-mono)] font-medium text-[14px] text-[var(--text-bright)] transition-colors duration-150 hover:text-[var(--accent)] flex items-center gap-1.5"
                      href={rec.profileUrl}
                    >
                      {rec.name}
                      <span className="opacity-50">
                        {rec.via === "github" ? <GitHubIcon /> : <LinkedInIcon />}
                      </span>
                    </a>
                  </div>
                </div>
                <div className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-faint)] whitespace-nowrap shrink-0">
                  {rec.date}
                </div>
              </div>
              <blockquote className="font-[family-name:var(--font-sans)] text-[14px] text-[var(--text)] leading-[1.65] m-0 border-l-2 border-[var(--accent)] pl-4 whitespace-pre-line">
                {rec.quote}
              </blockquote>
              <div className="flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-faint)]">
                <span className="text-[var(--accent)]">✓</span>verified via{" "}
                {rec.via}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 02 — Leave a recommendation */}
      <section
        className="relative py-20 border-t border-[var(--border)]"
        id="leave-recommendation"
      >
        <SectionHeader
          index="02"
          kicker="LEAVE A RECOMMENDATION"
          title="Vouch for me."
          aside={
            <>
              ~/recommendations/new
              <br />
              <span className="text-[var(--accent)]">
                ● reviewed before publishing
              </span>
            </>
          }
        />
        <div className="grid grid-cols-[1fr_1.1fr] gap-8 max-[940px]:grid-cols-1">
          <div className="flex flex-col gap-5">
            <p className="font-[family-name:var(--font-sans)] text-[15px] text-[var(--text)] leading-[1.65] max-w-[40ch]">
              Worked with me? I&apos;d love a reference. Sign in with GitHub or
              LinkedIn to verify your identity, then leave a short
              recommendation.
            </p>
            <div className="flex flex-col gap-2">
              {[
                "One recommendation per account",
                "Reviewed before publishing",
                "Profile link always shown",
              ].map((line) => (
                <div
                  key={line}
                  className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] flex items-center gap-2"
                >
                  <span className="text-[var(--accent)]">→</span>
                  {line}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="border border-[var(--border)] bg-[var(--surface)] rounded-[14px] p-6">
              {/*
                TODO: wire real OAuth (e.g. NextAuth with GitHub + LinkedIn
                providers) and a submission form + review queue here.
              */}
              <p className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] mb-4">
                sign in to leave a recommendation
              </p>
              <div className="flex gap-3 flex-wrap">
                <button
                  className="group inline-flex items-center gap-2.5 px-[18px] py-[13px] border border-[var(--border-strong)] rounded-[10px] bg-[var(--surface-2)] font-[family-name:var(--font-mono)] text-[13px] text-[var(--text-bright)] transition-[border-color,color] duration-[180ms] hover:border-[var(--accent)] hover:text-[var(--accent)] cursor-pointer"
                  title="Wire your OAuth provider in src/app/recommendations/page.tsx"
                >
                  <GitHubIcon />
                  continue with github
                </button>
                <button
                  className="group inline-flex items-center gap-2.5 px-[18px] py-[13px] border border-[var(--border-strong)] rounded-[10px] bg-[var(--surface-2)] font-[family-name:var(--font-mono)] text-[13px] text-[var(--text-bright)] transition-[border-color,color] duration-[180ms] hover:border-[var(--accent)] hover:text-[var(--accent)] cursor-pointer"
                  title="Wire your OAuth provider in src/app/recommendations/page.tsx"
                >
                  <LinkedInIcon />
                  continue with linkedin
                </button>
              </div>
              <p className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-faint)] mt-4 mb-0">
                {"// auth not wired yet — placeholder buttons"}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
