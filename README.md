# Portfolio - Elad Dafna

A 3D personal portfolio. The project grid is generated from the GitHub REST API
at build time and refreshed in the background, so pushing a new repository to
GitHub is all it takes for it to appear on the site.

## Stack

| Layer     | Choice                                             |
| --------- | -------------------------------------------------- |
| Framework | Next.js 16 (App Router, Turbopack)                 |
| Language  | TypeScript                                         |
| 3D        | three.js via React Three Fiber and drei            |
| Styling   | Tailwind CSS v4                                    |
| Motion    | Framer Motion                                      |
| Data      | GitHub REST API with incremental static regeneration |
| Hosting   | Vercel                                             |

## Running it locally

```bash
npm install
cp .env.example .env.local   # then fill in the username
npm run dev
```

The site is served at http://localhost:3000.

## Configuration

All environment variables are optional except the username.

| Variable                       | Purpose                                                            |
| ------------------------------ | ------------------------------------------------------------------ |
| `NEXT_PUBLIC_GITHUB_USERNAME`  | Account the repositories are pulled from. Required.                |
| `GITHUB_TOKEN`                 | Raises the API rate limit from 60/hr to 5000/hr. Read-only is enough. |
| `NEXT_PUBLIC_SITE_URL`         | Canonical URL used in metadata and the sitemap.                     |

Editorial settings live in [`src/lib/config.ts`](src/lib/config.ts):

- `featuredRepos` pins repositories to the front of the grid, in the order listed.
- `hiddenRepos` removes specific repositories.
- Forks, archived repositories and the profile README repo are filtered out automatically.

The written copy on the about page is at the top of
[`src/app/about/page.tsx`](src/app/about/page.tsx).

## How the GitHub data flows

`src/lib/github.ts` fetches up to 500 public repositories, filters and sorts
them, and caches the result for 30 minutes. Every failure path returns empty
data rather than throwing, so a GitHub outage degrades the page instead of
breaking the build.

## Deploying

The project is built for Vercel. Import the repository, set
`NEXT_PUBLIC_GITHUB_USERNAME`, and deploy. Every push to `main` ships
automatically.

## Scripts

```bash
npm run dev     # development server
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```
