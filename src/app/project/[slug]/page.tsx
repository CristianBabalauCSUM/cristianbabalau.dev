import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/data/projects";
import { ProseBody, tocEntries } from "@/components/ProseBody";
import { Toc } from "@/components/Toc";
import { ShareButtons } from "@/components/ShareButtons";
import { TransportDemo } from "@/components/TransportDemo";
import { OrchEcommShowcase } from "@/components/OrchEcommShowcase";
import { OrchMarketingDemo } from "@/components/OrchMarketingDemo";
import { btnSecondary } from "@/components/ui";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return { title: project.title, description: project.description };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <main className="relative z-[1] max-w-[1200px] mx-auto px-8">
      <div className="grid grid-cols-[minmax(0,1fr)_240px] gap-16 py-16 pb-24 max-[1040px]:grid-cols-1 max-[1040px]:gap-8 max-[1040px]:py-10">
        <div>
          <Link
            className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] inline-flex items-center gap-1.5 mb-7 transition-colors duration-150 hover:text-[var(--accent)]"
            href="/#projects"
          >
            ← cd ../#projects
          </Link>
          <header className="pb-8 mb-10 border-b border-[var(--border)]">
            <div className="flex gap-1.5 flex-wrap mb-[18px] items-center">
              {project.badges?.map((b) => (
                <span
                  key={b}
                  className="font-[family-name:var(--font-mono)] text-[11px] px-2 py-1 border rounded-[4px] border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-dim)]"
                >
                  ★ {b}
                </span>
              ))}
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-[family-name:var(--font-mono)] text-[11px] px-2 py-1 border rounded-[4px] border-[var(--border-strong)] text-[var(--text-dim)]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="font-[family-name:var(--font-mono)] font-medium text-[clamp(32px,4.6vw,52px)] leading-[1.08] tracking-[-0.035em] text-[var(--text-bright)] m-0 mb-[18px] text-balance">
              {project.title}
            </h1>
            <p className="font-[family-name:var(--font-mono)] text-[15px] text-[var(--text)] m-0 mb-[18px]">
              {project.subtitle}
            </p>
            <div className="flex gap-3.5 flex-wrap items-center font-[family-name:var(--font-mono)] text-[12.5px] text-[var(--text-dim)]">
              <span>{project.role}</span>
              <span className="text-[var(--text-faint)]">·</span>
              <span>{project.period}</span>
            </div>
            {project.download && (
              <a
                className={`${btnSecondary} mt-6`}
                href={project.download.href}
                download
              >
                {project.download.label} ⤓
              </a>
            )}
          </header>
          {project.demo === "transport" && <TransportDemo />}
          {project.demo === "orchecomm" && (
            <>
              <OrchMarketingDemo />
              <OrchEcommShowcase />
            </>
          )}
          <ProseBody body={project.body} />
          <ShareButtons path={`/project/${project.slug}`} title={project.title} />
        </div>
        <Toc entries={tocEntries(project.body)} />
      </div>
    </main>
  );
}
