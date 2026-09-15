"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import ProjectCard from "@/components/ProjectCard";
import TiltCard from "@/components/TiltCard";
import type { Repo } from "@/lib/github";

type SortKey = "featured" | "recent" | "stars" | "name";

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured first" },
  { key: "recent", label: "Recently updated" },
  { key: "stars", label: "Most starred" },
  { key: "name", label: "Name" },
];

export default function ProjectGrid({ repos }: { repos: Repo[] }) {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState<string>("All");
  const [sort, setSort] = useState<SortKey>("featured");
  const reduceMotion = useReducedMotion();

  const languages = useMemo(() => {
    const counts = new Map<string, number>();
    for (const repo of repos) {
      if (repo.language) {
        counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
      }
    }
    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([name]) => name);
    return ["All", ...sorted];
  }, [repos]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();

    const filtered = repos.filter((repo) => {
      if (language !== "All" && repo.language !== language) return false;
      if (!needle) return true;
      const haystack = [repo.name, repo.description ?? "", ...repo.topics]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });

    const sorted = [...filtered];
    if (sort === "stars") {
      sorted.sort((a, b) => b.stars - a.stars);
    } else if (sort === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "recent") {
      sorted.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
    }
    // "featured" keeps the order the server produced, which is already the
    // pinned repositories first, then the most starred, then the most recent.
    return sorted;
  }, [repos, query, language, sort]);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xs">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
          >
            ⌕
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search projects"
            aria-label="Search projects"
            className="glass w-full rounded-full py-2.5 pl-9 pr-4 text-sm text-foreground placeholder:text-muted/70 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="sr-only" htmlFor="sort">
            Sort projects
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(event) => setSort(event.target.value as SortKey)}
            className="glass rounded-full px-4 py-2.5 text-sm text-foreground focus:outline-none"
          >
            {sortOptions.map((option) => (
              <option key={option.key} value={option.key} className="bg-surface">
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {languages.length > 1 && (
        <ul className="mb-8 flex flex-wrap gap-2">
          {languages.map((name) => {
            const active = language === name;
            return (
              <li key={name}>
                <button
                  type="button"
                  onClick={() => setLanguage(name)}
                  aria-pressed={active}
                  className={`rounded-full px-3.5 py-1.5 text-xs transition-colors ${
                    active
                      ? "bg-neon-cyan/15 text-neon-cyan ring-1 ring-neon-cyan/40"
                      : "text-muted ring-1 ring-border-subtle hover:text-foreground"
                  }`}
                >
                  {name}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <p className="mb-5 text-xs text-muted">
        {visible.length} {visible.length === 1 ? "project" : "projects"}
      </p>

      {visible.length === 0 ? (
        <div className="glass rounded-2xl px-6 py-16 text-center">
          <p className="text-sm text-muted">No projects match that filter.</p>
        </div>
      ) : (
        <motion.ul layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((repo, index) => (
              <motion.li
                key={repo.id}
                layout
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, scale: 0.97 }}
                transition={{
                  duration: 0.35,
                  delay: reduceMotion ? 0 : Math.min(index * 0.03, 0.3),
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative"
              >
                <TiltCard>
                  <ProjectCard repo={repo} />
                </TiltCard>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
}
