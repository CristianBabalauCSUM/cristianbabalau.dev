import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, posts } from "@/data/posts";
import { site } from "@/data/site";
import { ProseBody, tocEntries } from "@/components/ProseBody";
import { Toc } from "@/components/Toc";
import { ShareButtons } from "@/components/ShareButtons";
import { btnSecondary } from "@/components/ui";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <main className="relative z-[1] max-w-[1200px] mx-auto px-8">
      <div className="grid grid-cols-[minmax(0,1fr)_240px] gap-16 py-16 pb-24 max-[1040px]:grid-cols-1 max-[1040px]:gap-8 max-[1040px]:py-10">
        <div>
          <Link
            className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] inline-flex items-center gap-1.5 mb-7 transition-colors duration-150 hover:text-[var(--accent)]"
            href="/blog"
          >
            ← cd ../blog
          </Link>
          <header className="pb-8 mb-10 border-b border-[var(--border)]">
            <div className="flex gap-1.5 flex-wrap mb-[18px]">
              {post.tags.map((tag, i) => (
                <span
                  key={tag}
                  className={`font-[family-name:var(--font-mono)] text-[11px] px-2 py-1 border rounded-[4px] ${
                    i === 0
                      ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-dim)]"
                      : "border-[var(--border-strong)] text-[var(--text-dim)]"
                  }`}
                >
                  #{tag}
                </span>
              ))}
            </div>
            <h1 className="font-[family-name:var(--font-mono)] font-medium text-[clamp(32px,4.6vw,52px)] leading-[1.08] tracking-[-0.035em] text-[var(--text-bright)] m-0 mb-[18px] text-balance">
              {post.title}
            </h1>
            <div className="flex gap-3.5 flex-wrap items-center font-[family-name:var(--font-mono)] text-[12.5px] text-[var(--text-dim)]">
              <span className="inline-flex items-center gap-2 text-[var(--text-bright)]">
                <span
                  className="w-[22px] h-[22px] rounded-full grid place-items-center text-[11px] font-bold text-[#001a0e]"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--accent), color-mix(in oklab, var(--accent) 60%, #000))",
                  }}
                >
                  {site.handle.charAt(0)}
                </span>
                {site.handle}
              </span>
              <span className="text-[var(--text-faint)]">·</span>
              <span>{post.date}</span>
              <span className="text-[var(--text-faint)]">·</span>
              <span>{post.readTime}</span>
            </div>
            <div className="mt-8 rounded-xl overflow-hidden relative w-full max-h-[60vh] aspect-video">
              {post.cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt={post.title}
                  src={post.cover}
                  className="object-cover absolute inset-0 w-full h-full"
                />
              ) : (
                <span className="img-placeholder absolute inset-0">
                  [cover image] — replace with your image
                </span>
              )}
            </div>
          </header>
          <ProseBody body={post.body} />
          {post.readMore && (
            <div className="mt-10 p-5 border border-dashed border-[var(--border-strong)] rounded-[12px] bg-[var(--surface)] flex items-center justify-between gap-4 flex-wrap">
              <span className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--text-dim)]">
                <span className="text-[var(--text-faint)]">$ </span>cd
                ../projects/tspa
              </span>
              <Link className={`${btnSecondary}`} href={post.readMore.href}>
                {post.readMore.label} →
              </Link>
            </div>
          )}
          <ShareButtons path={`/blog/${post.slug}`} title={post.title} />
        </div>
        <Toc entries={tocEntries(post.body)} />
      </div>
    </main>
  );
}
