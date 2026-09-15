import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import { siteConfig, socialLinks } from "@/lib/config";
import { colorForLanguage, getProfile, getRepos, summarize } from "@/lib/github";

export const metadata: Metadata = {
  title: "About",
  description: siteConfig.description,
};

/* ---------------------------------------------------------------------------
   Edit the copy below to make this page your own. Everything else on the page
   is generated from the live GitHub profile.
--------------------------------------------------------------------------- */
const intro = [
  `I am ${siteConfig.name}, a ${siteConfig.role.toLowerCase()} based in ${siteConfig.location}. I like problems that start out vague and end up as something dependable that other people can run without thinking about it.`,
  "Most of my time goes into backend and infrastructure work: designing the data flow, getting the failure cases right, and keeping the operational surface small. I care about code that is boring to maintain.",
  "The list of projects on this site is generated directly from my GitHub account, so it reflects what I am actually working on rather than a curated snapshot from a year ago.",
];

const principles = [
  {
    title: "Build it so it can be debugged",
    body: "Good logs, clear errors and a straight path from symptom to cause are worth more than clever abstractions.",
  },
  {
    title: "Automate the boring parts",
    body: "Anything done by hand twice is a script. Anything scripted twice belongs in the pipeline.",
  },
  {
    title: "Ship, then refine",
    body: "A working version in production teaches you more in a week than another month of design discussion.",
  },
];

export default async function AboutPage() {
  const [profile, repos] = await Promise.all([getProfile(), getRepos()]);
  const { total, stars, topLanguages } = summarize(repos);

  return (
    <div className="mx-auto max-w-4xl px-5 py-20 sm:px-8 sm:py-28">
      <Reveal>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          <span className="neon-text">About me</span>
        </h1>
      </Reveal>

      <Reveal delay={0.06} className="mt-10">
        <div className="glass flex flex-col gap-6 rounded-2xl p-7 sm:flex-row sm:items-center">
          {profile?.avatarUrl && (
            <Image
              src={profile.avatarUrl}
              alt=""
              width={96}
              height={96}
              className="h-24 w-24 shrink-0 rounded-2xl ring-1 ring-border-subtle"
            />
          )}
          <div className="min-w-0">
            <p className="text-lg font-semibold tracking-tight">
              {profile?.name ?? siteConfig.name}
            </p>
            <p className="mt-1 text-sm text-muted">
              {profile?.bio ?? `${siteConfig.role} · ${siteConfig.location}`}
            </p>
            {profile && (
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted">
                <li>
                  <span className="text-foreground">{total}</span> public repos
                </li>
                <li>
                  <span className="text-foreground">{stars}</span> stars earned
                </li>
                <li>
                  <span className="text-foreground">{profile.followers}</span>{" "}
                  followers
                </li>
              </ul>
            )}
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.1} className="mt-12">
        <div className="space-y-5 text-base leading-relaxed text-muted">
          {intro.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>
      </Reveal>

      {topLanguages.length > 0 && (
        <Reveal delay={0.14} className="mt-16">
          <h2 className="text-2xl font-semibold tracking-tight">
            What I work in
          </h2>
          <p className="mt-2 text-sm text-muted">
            Counted from the languages across my public repositories.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2.5">
            {topLanguages.map(({ name, count }) => {
              const accent = colorForLanguage(name);
              return (
                <li
                  key={name}
                  className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm"
                >
                  <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: accent, boxShadow: `0 0 8px ${accent}` }}
                  />
                  {name}
                  <span className="text-xs text-muted">{count}</span>
                </li>
              );
            })}
          </ul>
        </Reveal>
      )}

      <Reveal delay={0.18} className="mt-16">
        <h2 className="text-2xl font-semibold tracking-tight">How I work</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-3">
          {principles.map((item) => (
            <li key={item.title} className="glass rounded-2xl p-6">
              <h3 className="text-sm font-semibold tracking-tight text-neon-cyan">
                {item.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={0.22} className="mt-16">
        <div className="glass rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">Get in touch</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
            Open to interesting problems, collaborations and questions about
            anything on this site.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="inline-flex items-center rounded-full bg-surface-raised px-5 py-2.5 text-sm ring-1 ring-border-subtle transition-colors hover:text-neon-cyan"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
