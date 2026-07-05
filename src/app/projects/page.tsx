import type { Metadata } from "next";
import { projects } from "@/data/projects";
import { PageHero } from "@/components/ui";
import { ProjectsList } from "./ProjectsList";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "A full index of things I've built: products, tools, and experiments.",
};

export default function ProjectsPage() {
  return (
    <main className="relative z-[1] max-w-[1200px] mx-auto px-8">
      <PageHero
        segment="projects"
        entries={`${projects.length} entries`}
        command="ls -al"
        commandAccent="~/projects"
        intro="A full index of things I've built: products, tools, and experiments. Some shipped, some abandoned, all instructive."
      />
      <ProjectsList />
    </main>
  );
}
