/**
 * Central site configuration.
 *
 * The GitHub username is read from the environment so the same build works for
 * any account. Set NEXT_PUBLIC_GITHUB_USERNAME locally in `.env.local` and in
 * the Vercel project settings.
 */

export const siteConfig = {
  name: "Elad Dafna",
  role: "DevOps Engineer",
  tagline: "I build systems that hold up in production.",
  description:
    "Personal portfolio of Elad Dafna, DevOps engineer. Infrastructure, automation and delivery pipelines, pulled live from GitHub.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
  email: "elad.dafna@hiper-global.com",
  location: "Israel",
} as const;

/**
 * GitHub account the portfolio pulls its repositories from.
 * The default is used when no environment variable is set, so the site works
 * on a fresh deploy with no configuration.
 */
export const githubUsername =
  process.env.NEXT_PUBLIC_GITHUB_USERNAME?.trim() || "EladDafna";

/**
 * Repositories listed here are pinned to the front of the grid, in this order.
 * Names are matched case-insensitively against the repository name.
 */
export const featuredRepos: string[] = [
  "Terraform_Project",
  "Kubernetes-Helm_Project",
  "Ansible-Kubernetes_Project",
  "Prometheus_Grafana_Project",
  "CI-CD",
  "GitHub_Actions_Project",
];

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
