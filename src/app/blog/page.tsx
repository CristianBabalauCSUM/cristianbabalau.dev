import type { Metadata } from "next";
import { posts } from "@/data/posts";
import { PageHero } from "@/components/ui";
import { BlogList } from "./BlogList";

export const metadata: Metadata = {
  title: "Blog",
  description: "Field notes from building products end-to-end.",
};

export default function BlogPage() {
  return (
    <main className="relative z-[1] max-w-[1200px] mx-auto px-8">
      <PageHero
        segment="blog"
        entries={`${posts.length} entries`}
        command="cat"
        commandAccent="~/notes"
        intro="Field notes from building OrchEcomm and researching social-media manipulation: Java, TypeScript, Python, and the occasional 3am Docker debugging session. Mostly things I wish I'd known six months ago."
      />
      <BlogList />
    </main>
  );
}
