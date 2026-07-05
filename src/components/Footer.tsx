import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="relative z-[1] max-w-[1200px] mx-auto px-8 border-t border-[var(--border)] pt-8 pb-14 font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] flex justify-between items-center gap-4 flex-wrap">
      <div>
        <span>
          © {site.copyrightYear} {site.handle}
        </span>
        <span className="text-[var(--text-faint)]"> · {site.footerNote}</span>
      </div>
      <div className="flex gap-5">
        <a className="hover:text-[var(--accent)]" href="/rss.xml">
          /rss.xml
        </a>
        <a className="hover:text-[var(--accent)]" href="/sitemap.xml">
          /sitemap.xml
        </a>
        <a className="hover:text-[var(--accent)]" href={site.github.url}>
          github
        </a>
        <a className="hover:text-[var(--accent)]" href={site.linkedin.url}>
          linkedin
        </a>
      </div>
    </footer>
  );
}
