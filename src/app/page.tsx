import Link from "next/link";
import Hero from "@/components/Hero";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";
import SetupNotice from "@/components/SetupNotice";
import { githubUsername } from "@/lib/config";
import { getRepos, summarize } from "@/lib/github";
import { compactNumber } from "@/lib/format";

export default async function Home() {
  const repos = await getRepos();
  const { total, stars, topLanguages } = summarize(repos);
  const highlights = repos.slice(0, 6);

  return (
    <>
      <Hero />

      {!githubUsername && (
        <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
          <SetupNotice />
        </section>
      )}

      {repos.length > 0 && (
        <>
          <section className="mx-auto max-w-6xl px-5 sm:px-8">
            <Reveal>
              <dl className="glass grid grid-cols-2 gap-px overflow-hidden rounded-2xl sm:grid-cols-4">
                {[
                  { label: "Public repos", value: String(total) },
                  { label: "Total stars", value: compactNumber(stars) },
                  { label: "Languages", value: String(topLanguages.length) },
                  { label: "Main stack", value: topLanguages[0]?.name ?? "—" },
                ].map((stat) => (
                  <div key={stat.label} className="px-6 py-7">
                    <dt className="text-xs uppercase tracking-wider text-muted">
                      {stat.label}
                    </dt>
                    <dd className="mt-2 text-2xl font-semibold tracking-tight">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </section>

          <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
            <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Selected work
                </h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
                  The most recent and most starred repositories, refreshed
                  automatically every half hour.
                </p>
              </div>
              <Link
                href="/projects"
                className="group inline-flex items-center gap-1.5 text-sm text-neon-cyan transition-colors hover:text-neon-pink"
              >
                All {total} projects
                <span
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
            </Reveal>

            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {highlights.map((repo, index) => (
                <li key={repo.id} className="relative">
                  <Reveal delay={Math.min(index * 0.06, 0.3)} className="h-full">
                    <ProjectCard repo={repo} />
                  </Reveal>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </>
  );
}
