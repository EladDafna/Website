import { featuredRepos, githubUsername, hiddenRepos } from "@/lib/config";

/** How often (in seconds) Next.js re-fetches GitHub data in the background. */
const REVALIDATE_SECONDS = 1800; // 30 minutes

const API_ROOT = "https://api.github.com";

export type Repo = {
  id: number;
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  forks: number;
  topics: string[];
  updatedAt: string;
  createdAt: string;
  isFeatured: boolean;
};

export type Profile = {
  login: string;
  name: string | null;
  bio: string | null;
  avatarUrl: string;
  url: string;
  company: string | null;
  location: string | null;
  blog: string | null;
  publicRepos: number;
  followers: number;
  following: number;
  createdAt: string;
};

type RawRepo = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics?: string[];
  updated_at: string;
  pushed_at: string;
  created_at: string;
  fork: boolean;
  archived: boolean;
  disabled: boolean;
  private: boolean;
};

type RawProfile = {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  html_url: string;
  company: string | null;
  location: string | null;
  blog: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
};

function headers(): HeadersInit {
  const base: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "portfolio-site",
  };
  // Optional. Raises the rate limit from 60/hr to 5000/hr during builds.
  const token = process.env.GITHUB_TOKEN;
  if (token) base.Authorization = `Bearer ${token}`;
  return base;
}

async function ghFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_ROOT}${path}`, {
      headers: headers(),
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) {
      console.warn(`[github] ${path} responded ${res.status} ${res.statusText}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (error) {
    console.warn(`[github] request to ${path} failed:`, error);
    return null;
  }
}

const featuredIndex = new Map(
  featuredRepos.map((name, index) => [name.toLowerCase(), index]),
);
const hiddenSet = new Set(hiddenRepos.map((name) => name.toLowerCase()));

function shouldHide(repo: RawRepo, login: string): boolean {
  const name = repo.name.toLowerCase();
  if (repo.fork || repo.archived || repo.disabled || repo.private) return true;
  if (hiddenSet.has(name)) return true;
  // The special repo that renders a GitHub profile README is not a project.
  if (name === login.toLowerCase()) return true;
  return false;
}

function normalize(repo: RawRepo): Repo {
  return {
    id: repo.id,
    name: repo.name,
    description: repo.description,
    url: repo.html_url,
    homepage: repo.homepage?.trim() ? repo.homepage : null,
    language: repo.language,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    topics: repo.topics ?? [],
    updatedAt: repo.pushed_at ?? repo.updated_at,
    createdAt: repo.created_at,
    isFeatured: featuredIndex.has(repo.name.toLowerCase()),
  };
}

function sortRepos(a: Repo, b: Repo): number {
  const aRank = featuredIndex.get(a.name.toLowerCase()) ?? Number.MAX_SAFE_INTEGER;
  const bRank = featuredIndex.get(b.name.toLowerCase()) ?? Number.MAX_SAFE_INTEGER;
  if (aRank !== bRank) return aRank - bRank;
  if (a.stars !== b.stars) return b.stars - a.stars;
  return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
}

/**
 * Every public, non-fork repository on the configured account.
 * Returns an empty array rather than throwing, so a GitHub outage or a missing
 * username degrades the page instead of breaking the build.
 */
export async function getRepos(): Promise<Repo[]> {
  if (!githubUsername) return [];

  const collected: RawRepo[] = [];
  const perPage = 100;

  for (let page = 1; page <= 5; page += 1) {
    const batch = await ghFetch<RawRepo[]>(
      `/users/${githubUsername}/repos?per_page=${perPage}&page=${page}&sort=pushed`,
    );
    if (!batch || batch.length === 0) break;
    collected.push(...batch);
    if (batch.length < perPage) break;
  }

  return collected
    .filter((repo) => !shouldHide(repo, githubUsername))
    .map(normalize)
    .sort(sortRepos);
}

/** Public profile of the configured account, or null if unavailable. */
export async function getProfile(): Promise<Profile | null> {
  if (!githubUsername) return null;

  const raw = await ghFetch<RawProfile>(`/users/${githubUsername}`);
  if (!raw) return null;

  return {
    login: raw.login,
    name: raw.name,
    bio: raw.bio,
    avatarUrl: raw.avatar_url,
    url: raw.html_url,
    company: raw.company,
    location: raw.location,
    blog: raw.blog?.trim() ? raw.blog : null,
    publicRepos: raw.public_repos,
    followers: raw.followers,
    following: raw.following,
    createdAt: raw.created_at,
  };
}

/** Aggregate numbers shown on the home page. */
export function summarize(repos: Repo[]) {
  const languages = new Map<string, number>();
  let stars = 0;

  for (const repo of repos) {
    stars += repo.stars;
    if (repo.language) {
      languages.set(repo.language, (languages.get(repo.language) ?? 0) + 1);
    }
  }

  const topLanguages = [...languages.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));

  return { total: repos.length, stars, topLanguages };
}

/** Brand colours for the languages most likely to show up. */
export const languageColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  "C#": "#178600",
  C: "#555555",
  "C++": "#f34b7d",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Shell: "#89e051",
  PowerShell: "#012456",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Dart: "#00B4AB",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
  Lua: "#000080",
  Dockerfile: "#384d54",
  HCL: "#844FBA",
  Makefile: "#427819",
};

export function colorForLanguage(language: string | null): string {
  if (!language) return "#64748b";
  return languageColors[language] ?? "#64748b";
}
