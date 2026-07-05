import Link from "next/link";
import { site, heroIntro } from "@/data/site";
import { featuredProjects, projects } from "@/data/projects";
import { ChatWidget } from "@/components/ChatWidget";
import { ContactSection } from "@/components/ContactSection";
import { GitHubIcon, LinkedInIcon, MailIcon } from "@/components/icons";
import {
  Blip,
  Cursor,
  SectionHeader,
  btnIcon,
  btnPrimary,
  btnSecondary,
} from "@/components/ui";

function Hero() {
  return (
    <section
      className="pt-[88px] pb-24 relative max-[940px]:pt-14 max-[940px]:pb-16"
      id="top"
    >
      <div className="grid grid-cols-[1.05fr_1fr] gap-14 items-stretch max-[940px]:grid-cols-1 max-[940px]:gap-8">
        <div>
          <div className="inline-flex items-center gap-2.5 font-[family-name:var(--font-mono)] text-[12px] tracking-[0.04em] text-[var(--text-dim)] py-1.5 px-3 border border-[var(--border)] rounded-full bg-[var(--surface)] mb-7 whitespace-nowrap">
            <Blip />
            <span>
              {site.availability.label} · {site.availability.note}
            </span>
          </div>
          <h1 className="font-[family-name:var(--font-mono)] font-medium text-[clamp(40px,6vw,72px)] leading-[1.02] tracking-[-0.04em] mt-0 mb-5 text-[var(--text-bright)]">
            <span className="text-[var(--text-faint)] font-light">$ </span>
            hi, I&apos;m <span className="text-[var(--accent)]">{site.name}</span>
            <Cursor />
          </h1>
          <p className="font-[family-name:var(--font-mono)] text-[14px] text-[var(--text-dim)] tracking-[-0.005em] mt-0 mb-7">
            {site.tagline}
          </p>
          <p className="text-[17px] leading-[1.65] text-[var(--text)] max-w-[52ch] mt-0 mb-9 text-pretty">
            {heroIntro.map((chunk, i) =>
              chunk.href ? (
                <Link
                  key={i}
                  href={chunk.href}
                  className="text-[var(--accent)] underline decoration-dotted underline-offset-4 transition-colors duration-150 hover:decoration-solid"
                >
                  {chunk.text}
                </Link>
              ) : chunk.em ? (
                <em key={i} className="text-[var(--accent)] not-italic">
                  {chunk.text}
                </em>
              ) : (
                <span key={i}>{chunk.text}</span>
              )
            )}
          </p>
          <div className="flex flex-wrap gap-3 items-center">
            <a className={btnPrimary} href="#contact">
              get in touch
            </a>
            <a className={btnSecondary} href="#projects">
              ls projects/
            </a>
            <div className="ml-auto flex gap-2">
              <a
                className={btnIcon}
                aria-label="GitHub"
                target="_blank"
                rel="noopener noreferrer"
                href={site.github.url}
              >
                <GitHubIcon />
              </a>
              <a
                className={btnIcon}
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
                href={site.linkedin.url}
              >
                <LinkedInIcon />
              </a>
              <a
                className={btnIcon}
                aria-label="Email"
                href={`mailto:${site.email}`}
              >
                <MailIcon />
              </a>
            </div>
          </div>
        </div>
        <ChatWidget />
      </div>
    </section>
  );
}

function ProjectsSection() {
  return (
    <section className="relative py-20" id="projects">
      <SectionHeader
        index="02"
        kicker="FEATURED WORK"
        title="Selected projects"
        aside={
          <>
            ~/projects/featured
            <br />
            <span style={{ color: "var(--text-faint)" }}>
              {featuredProjects.length} of {projects.length} visible
            </span>
          </>
        }
      />
      <div className="grid grid-cols-3 gap-[18px] max-[940px]:grid-cols-1">
        {featuredProjects.map((project, i) => (
          <article
            key={project.slug}
            className="relative flex flex-col border border-[var(--border)] rounded-xl bg-[var(--surface)] p-[22px] min-h-[320px] overflow-hidden cursor-pointer transition-[border-color,transform] duration-200 hover:border-[var(--accent)] hover:-translate-y-0.5 after:content-[''] after:absolute after:inset-0 after:rounded-[inherit] after:bg-[radial-gradient(circle_at_100%_0%,var(--accent-dim),transparent_60%)] after:opacity-0 after:transition-opacity after:duration-[250ms] after:pointer-events-none hover:after:opacity-100"
          >
            <Link
              className="absolute inset-0 z-0"
              aria-label={project.title}
              href={`/project/${project.slug}`}
            ></Link>
            <div className="flex items-center justify-between gap-2">
              <div className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--accent)] tracking-[0.08em]">
                [{String(i + 1).padStart(2, "0")}]
              </div>
              <div className="flex gap-1 flex-wrap justify-end">
                {project.badges?.map((b) => (
                  <span
                    key={b}
                    className="font-[family-name:var(--font-mono)] text-[10px] px-1.5 py-0.5 border rounded-[4px] border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-dim)] whitespace-nowrap"
                  >
                    ★ {b}
                  </span>
                ))}
              </div>
            </div>
            <h3 className="font-[family-name:var(--font-mono)] text-[22px] tracking-[-0.02em] text-[var(--text-bright)] mt-3.5 mb-1.5 font-medium">
              {project.title}
            </h3>
            <div className="font-[family-name:var(--font-mono)] text-[11.5px] text-[var(--text-dim)] mb-3.5 flex items-center gap-2">
              <span>{project.year}</span>
              <span className="text-[var(--text-faint)]">·</span>
              <span>{project.role}</span>
            </div>
            <p className="text-[14px] text-[var(--text)] leading-[1.55] mb-[18px] text-pretty">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-auto mb-3.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-[family-name:var(--font-mono)] text-[11px] px-2 py-1 border rounded-[4px] border-[var(--border-strong)] text-[var(--text-dim)]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex gap-3.5 pt-3.5 border-t border-dashed border-[var(--border)]">
              {project.liveUrl && (
                <a
                  className="relative font-[family-name:var(--font-mono)] whitespace-nowrap shrink-0 transition-[border-color,background,transform,color] duration-[180ms] active:translate-y-px inline-flex items-center gap-1.5 text-[13px] tracking-[-0.005em] rounded-lg text-[var(--text-dim)] hover:text-[var(--accent)] z-[1] cursor-pointer"
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ↗ live
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
      <div className="mt-10 pt-7 border-t border-dashed border-[var(--border)] flex items-center justify-between gap-6 flex-wrap">
        <span className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--text-dim)]">
          <span className="text-[var(--text-faint)]">$ </span>ls -al /projects
          <span className="text-[var(--text-faint)] ml-3 text-[11.5px]">
            {"// list all projects"}
          </span>
        </span>
        <Link className={btnSecondary} href="/projects">
          view all
        </Link>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="relative z-[1] max-w-[1200px] mx-auto px-8">
      <Hero />
      <ProjectsSection />
      <ContactSection />
    </main>
  );
}
