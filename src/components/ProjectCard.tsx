import { colorForLanguage, type Repo } from "@/lib/github";
import { compactNumber, formatRelativeTime, humanizeRepoName } from "@/lib/format";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5" title={label}>
      <span aria-hidden="true" className="text-muted/70">
        {label === "Stars" ? "★" : "⑂"}
      </span>
      <span>{value}</span>
      <span className="sr-only">{label}</span>
    </span>
  );
}

export default function ProjectCard({ repo }: { repo: Repo }) {
  const accent = colorForLanguage(repo.language);

  return (
    <article className="card-glow glass flex h-full flex-col rounded-2xl p-6">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold leading-snug tracking-tight">
          <a
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-neon-cyan"
          >
            <span className="absolute inset-0" aria-hidden="true" />
            {humanizeRepoName(repo.name)}
          </a>
        </h3>
        {repo.isFeatured && (
          <span className="shrink-0 rounded-full bg-neon-violet/15 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-neon-violet ring-1 ring-neon-violet/30">
            Featured
          </span>
        )}
      </div>

      {repo.description && (
        <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-muted">
          {repo.description}
        </p>
      )}

      {repo.topics.length > 0 && (
        <ul className="mb-5 flex flex-wrap gap-1.5">
          {repo.topics.slice(0, 4).map((topic) => (
            <li
              key={topic}
              className="rounded-md bg-surface-raised px-2 py-1 font-mono text-[11px] text-muted ring-1 ring-border-subtle"
            >
              {topic}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
        {repo.language && (
          <span className="inline-flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: accent, boxShadow: `0 0 8px ${accent}` }}
            />
            {repo.language}
          </span>
        )}
        {repo.stars > 0 && <Stat label="Stars" value={compactNumber(repo.stars)} />}
        {repo.forks > 0 && <Stat label="Forks" value={compactNumber(repo.forks)} />}
        <span className="ml-auto">{formatRelativeTime(repo.updatedAt)}</span>
      </div>

      {repo.homepage && (
        <a
          href={repo.homepage}
          target="_blank"
          rel="noreferrer"
          className="relative z-10 mt-4 inline-flex w-fit items-center gap-1.5 text-xs font-medium text-neon-cyan transition-colors hover:text-neon-pink"
        >
          Live demo
          <span aria-hidden="true">↗</span>
        </a>
      )}
    </article>
  );
}
