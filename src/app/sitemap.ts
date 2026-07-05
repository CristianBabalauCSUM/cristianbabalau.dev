import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { projects } from "@/data/projects";
import { posts } from "@/data/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url },
    { url: `${site.url}/projects` },
    { url: `${site.url}/blog` },
    { url: `${site.url}/about` },
    // { url: `${site.url}/recommendations` }, // disabled for now
    ...projects.map((p) => ({ url: `${site.url}/project/${p.slug}` })),
    ...posts.map((p) => ({ url: `${site.url}/blog/${p.slug}` })),
  ];
}
