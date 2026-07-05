import { posts } from "@/data/posts";
import { site } from "@/data/site";

/** Minimal RSS feed generated from the blog posts in src/data/posts.ts */
export function GET() {
  const items = posts
    .map(
      (p) => `    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${site.url}/blog/${p.slug}</link>
      <guid>${site.url}/blog/${p.slug}</guid>
      <description><![CDATA[${p.excerpt}]]></description>
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${site.handle}${site.domainSuffix}</title>
    <link>${site.url}</link>
    <description><![CDATA[${site.metaDescription}]]></description>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
