/**
 * Central site configuration.
 *
 * The GitHub username is read from the environment so the same build works for
 * any account. Set NEXT_PUBLIC_GITHUB_USERNAME locally in `.env.local` and in
 * the Vercel project settings.
 */

const FALLBACK_URL = "http://localhost:3000";

/**
 * Resolves the canonical site URL.
 *
 * Every value is treated as untrusted: a variable that exists but is blank, or
 * holds something that is not a URL, falls through to the next candidate. An
 * empty string here used to reach `new URL("")` and fail the production build,
 * so the guard matters.
 *
 * Vercel injects VERCEL_PROJECT_PRODUCTION_URL and VERCEL_URL without a
 * protocol, which is why they are prefixed before being parsed.
 */
function resolveSiteUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  ];

  for (const candidate of candidates) {
    const value = candidate?.trim();
    if (!value) continue;
    const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    try {
      return new URL(withProtocol).origin;
    } catch {
      // Malformed value, try the next candidate.
    }
  }

  return FALLBACK_URL;
}

export const siteConfig = {
  name: "Elad Dafna",
  role: "DevOps Engineer",
  tagline: "I build systems that hold up in production.",
  description:
    "Personal portfolio of Elad Dafna, DevOps engineer. Infrastructure, automation and delivery pipelines, pulled live from GitHub.",
  url: resolveSiteUrl(),
  email: "eladdaf@gmail.com",
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
export const hiddenRepos: string[] = ["PS", "Test", "Projects"];

/**
 * Plain external links rendered in the header and footer. Email is deliberately
 * not here: it opens a provider-choice menu (see EmailButton) rather than a
 * bare `mailto:` link, so it is rendered separately wherever this list is used.
 */
export const socialLinks = [
  {
    label: "GitHub",
    href: githubUsername ? `https://github.com/${githubUsername}` : "https://github.com",
  },
] as const;

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
] as const;
