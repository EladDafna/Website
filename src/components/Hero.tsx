"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { githubUsername, siteConfig } from "@/lib/config";

export default function Hero() {
  const reduceMotion = useReducedMotion();

  const rise = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 26 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section className="relative mx-auto flex min-h-[calc(100svh-5rem)] max-w-6xl flex-col justify-center px-5 py-20 sm:px-8">
      <motion.p
        {...rise(0)}
        className="mb-6 inline-flex w-fit items-center gap-2 rounded-full bg-surface-raised/70 px-3.5 py-1.5 text-xs text-muted ring-1 ring-border-subtle"
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-cyan opacity-70" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-neon-cyan" />
        </span>
        {siteConfig.location} &middot; {siteConfig.role}
      </motion.p>

      <motion.h1
        {...rise(0.08)}
        className="max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl"
      >
        <span className="block">{siteConfig.name}</span>
        <span className="neon-text block">{siteConfig.tagline}</span>
      </motion.h1>

      <motion.p
        {...rise(0.16)}
        className="mt-7 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
      >
        Every project below is pulled straight from GitHub, so this page is never
        out of date. Browse the work, or read the longer story on the about page.
      </motion.p>

      <motion.div {...rise(0.24)} className="mt-10 flex flex-wrap items-center gap-3">
        <Link
          href="/projects"
          className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform duration-200 hover:scale-[1.03]"
        >
          View projects
          <span
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          >
            →
          </span>
        </Link>
        <Link
          href="/about"
          className="glass inline-flex items-center rounded-full px-6 py-3 text-sm font-medium transition-colors hover:text-neon-cyan"
        >
          About me
        </Link>
        {githubUsername && (
          <a
            href={`https://github.com/${githubUsername}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center px-3 py-3 text-sm text-muted transition-colors hover:text-foreground"
          >
            GitHub ↗
          </a>
        )}
      </motion.div>
    </section>
  );
}
