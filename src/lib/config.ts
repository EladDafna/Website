/**
 * Central site configuration.
 *
 * The GitHub username is read from the environment so the same build works for
 * any account. Set NEXT_PUBLIC_GITHUB_USERNAME locally in `.env.local` and in
 * the Vercel project settings.
 */

export const siteConfig = {
  name: "Elad Dafna",
  role: "Software Engineer",
  tagline: "I build systems that hold up in production.",
  description:
    "Personal portfolio of Elad Dafna - projects, work and writing, pulled live from GitHub.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
  email: "elad.dafna@hiper-global.com",
  location: "Israel",
} as const;

/** GitHub account the portfolio pulls its repositories from. */
export const githubUsername =
  process.env.NEXT_PUBLIC_GITHUB_USERNAME?.trim() || "";

/**
 * Repositories listed here are pinned to the front of the grid, in this order.
 * Names are matched case-insensitively against the repository name.
 */
export const featuredRepos: string[] = [];

/**
 * Repositories listed here are never shown, in addition to the automatic
 * filters (forks, archived, the profile README repo).
 */
export const hiddenRepos: string[] = [];

/** Links rendered in the header and footer. */
export const socialLinks = [
  {
    label: "GitHub",
    href: githubUsername ? `https://github.com/${githubUsername}` : "https://github.com",
  },
  { label: "Email", href: `mailto:${siteConfig.email}` },
] as const;

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
] as const;
