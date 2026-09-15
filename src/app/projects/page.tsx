import type { Metadata } from "next";
import ProjectGrid from "@/components/ProjectGrid";
import Reveal from "@/components/Reveal";
import SetupNotice from "@/components/SetupNotice";
import { githubUsername } from "@/lib/config";
import { getRepos } from "@/lib/github";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Every public repository, pulled live from GitHub and refreshed automatically.",
};

export default async function ProjectsPage() {
  const repos = await getRepos();

  return (
    <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
      <Reveal className="mb-12">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          <span className="neon-text">Projects</span>
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
          Pulled live from the GitHub API. Forks, archived repositories and the
          profile README are filtered out, so what is left is actual work.
        </p>
      </Reveal>

      {!githubUsername ? (
        <SetupNotice />
      ) : repos.length === 0 ? (
        <div className="glass rounded-2xl px-6 py-16 text-center">
          <p className="text-sm text-muted">
            No public repositories found for{" "}
            <span className="text-foreground">{githubUsername}</span>, or GitHub
            is temporarily unreachable.
          </p>
        </div>
      ) : (
        <Reveal>
          <ProjectGrid repos={repos} />
        </Reveal>
      )}
    </div>
  );
}
