import { profile } from "@/data/portfolioData";

/**
 * Live GitHub data, fetched on the server and cached with Next.js ISR.
 *
 *  1. If GITHUB_TOKEN is set  → GraphQL API (real contribution calendar + pinned repos).
 *  2. Otherwise               → REST API for profile/repos + public contributions mirror.
 *  3. If everything fails     → graceful empty state (the page never breaks).
 */

export const GITHUB_REVALIDATE = 3600; // seconds — keep in sync with `revalidate` in app/page.tsx

export interface ContributionDay {
  date: string; // YYYY-MM-DD
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface RepoSummary {
  name: string;
  description: string | null;
  url: string;
  stars: number;
  language: string | null;
  languageColor: string | null;
  updatedAt: string | null;
}

export interface GithubData {
  username: string;
  profileUrl: string;
  name: string | null;
  avatarUrl: string | null;
  followers: number | null;
  publicRepos: number | null;
  totalContributions: number | null;
  weeks: ContributionDay[][];
  repos: RepoSummary[];
  repoLabel: "Pinned" | "Recently Active";
  live: boolean;
}

const USERNAME = process.env.GITHUB_USERNAME || profile.githubUsername;
const TOKEN = process.env.GITHUB_TOKEN;

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#dea584",
  Java: "#b07219",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#178600",
  Ruby: "#701516",
  PHP: "#4F5D95",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Dart: "#00B4AB",
  "Jupyter Notebook": "#DA5B0B",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  MDX: "#fcb32c",
};

const LEVEL_MAP: Record<string, ContributionDay["level"]> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

// ---------------------------------------------------------------------------
// GraphQL (token required)
// ---------------------------------------------------------------------------

const REPO_FIELDS = `
  name description url stargazerCount pushedAt
  primaryLanguage { name color }
  defaultBranchRef { target { ... on Commit { committedDate } } }
`;

const QUERY = `
query($login: String!) {
  user(login: $login) {
    name login url avatarUrl
    followers { totalCount }
    repositories(privacy: PUBLIC) { totalCount }
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount contributionLevel } }
      }
    }
    pinnedItems(first: 3, types: REPOSITORY) {
      nodes { ... on Repository { ${REPO_FIELDS} } }
    }
    recent: repositories(first: 3, orderBy: {field: PUSHED_AT, direction: DESC}, ownerAffiliations: OWNER, isFork: false, privacy: PUBLIC) {
      nodes { ${REPO_FIELDS} }
    }
  }
}`;

interface GqlRepo {
  name: string;
  description: string | null;
  url: string;
  stargazerCount: number;
  pushedAt: string | null;
  primaryLanguage: { name: string; color: string | null } | null;
  defaultBranchRef: { target: { committedDate?: string } | null } | null;
}

function mapGqlRepo(r: GqlRepo): RepoSummary {
  return {
    name: r.name,
    description: r.description,
    url: r.url,
    stars: r.stargazerCount,
    language: r.primaryLanguage?.name ?? null,
    languageColor: r.primaryLanguage?.color ?? null,
    updatedAt: r.defaultBranchRef?.target?.committedDate ?? r.pushedAt,
  };
}

async function fetchViaGraphQL(): Promise<GithubData> {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: QUERY, variables: { login: USERNAME } }),
    next: { revalidate: GITHUB_REVALIDATE, tags: ["github"] },
  });
  if (!res.ok) throw new Error(`GitHub GraphQL ${res.status}`);
  const json = await res.json();
  const u = json?.data?.user;
  if (!u) throw new Error(json?.errors?.[0]?.message ?? "GitHub user not found");

  const pinned: GqlRepo[] = (u.pinnedItems?.nodes ?? []).filter(Boolean);
  const recent: GqlRepo[] = u.recent?.nodes ?? [];
  const usePinned = pinned.length > 0;

  return {
    username: u.login,
    profileUrl: u.url,
    name: u.name,
    avatarUrl: u.avatarUrl,
    followers: u.followers.totalCount,
    publicRepos: u.repositories.totalCount,
    totalContributions: u.contributionsCollection.contributionCalendar.totalContributions,
    weeks: u.contributionsCollection.contributionCalendar.weeks.map(
      (w: { contributionDays: { date: string; contributionCount: number; contributionLevel: string }[] }) =>
        w.contributionDays.map((d) => ({
          date: d.date,
          count: d.contributionCount,
          level: LEVEL_MAP[d.contributionLevel] ?? 0,
        })),
    ),
    repos: (usePinned ? pinned : recent).slice(0, 3).map(mapGqlRepo),
    repoLabel: usePinned ? "Pinned" : "Recently Active",
    live: true,
  };
}

// ---------------------------------------------------------------------------
// REST + public mirror (no token)
// ---------------------------------------------------------------------------

async function getJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: { Accept: "application/vnd.github+json", "User-Agent": "portfolio-site" },
    next: { revalidate: GITHUB_REVALIDATE, tags: ["github"] },
  });
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.json() as Promise<T>;
}

/** Group a flat list of days into Sunday-starting weeks, like GitHub does. */
function toWeeks(days: ContributionDay[]): ContributionDay[][] {
  const weeks: ContributionDay[][] = [];
  let current: ContributionDay[] = [];
  for (const day of days) {
    const weekday = new Date(`${day.date}T00:00:00Z`).getUTCDay();
    if (weekday === 0 && current.length) {
      weeks.push(current);
      current = [];
    }
    current.push(day);
  }
  if (current.length) weeks.push(current);
  return weeks;
}

async function fetchViaREST(): Promise<GithubData> {
  const [userRes, reposRes, calRes] = await Promise.allSettled([
    getJSON<{
      login: string;
      name: string | null;
      html_url: string;
      avatar_url: string;
      followers: number;
      public_repos: number;
    }>(`https://api.github.com/users/${USERNAME}`),
    getJSON<
      {
        name: string;
        description: string | null;
        html_url: string;
        stargazers_count: number;
        language: string | null;
        pushed_at: string | null;
        fork: boolean;
      }[]
    >(`https://api.github.com/users/${USERNAME}/repos?sort=pushed&per_page=12&type=owner`),
    getJSON<{
      total: Record<string, number>;
      contributions: { date: string; count: number; level: number }[];
    }>(`https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`),
  ]);

  const user = userRes.status === "fulfilled" ? userRes.value : null;
  const repos = reposRes.status === "fulfilled" ? reposRes.value : [];
  const cal = calRes.status === "fulfilled" ? calRes.value : null;

  if (!user && !cal) throw new Error("All GitHub sources failed");

  return {
    username: user?.login ?? USERNAME,
    profileUrl: user?.html_url ?? `https://github.com/${USERNAME}`,
    name: user?.name ?? null,
    avatarUrl: user?.avatar_url ?? null,
    followers: user?.followers ?? null,
    publicRepos: user?.public_repos ?? null,
    totalContributions: cal ? (cal.total.lastYear ?? Object.values(cal.total)[0] ?? null) : null,
    weeks: cal
      ? toWeeks(
          cal.contributions.map((d) => ({
            date: d.date,
            count: d.count,
            level: Math.max(0, Math.min(4, d.level)) as ContributionDay["level"],
          })),
        )
      : emptyWeeks(),
    repos: repos
      .filter((r) => !r.fork)
      .slice(0, 3)
      .map((r) => ({
        name: r.name,
        description: r.description,
        url: r.html_url,
        stars: r.stargazers_count,
        language: r.language,
        languageColor: r.language ? (LANGUAGE_COLORS[r.language] ?? null) : null,
        updatedAt: r.pushed_at,
      })),
    repoLabel: "Recently Active",
    live: true,
  };
}

// ---------------------------------------------------------------------------
// Empty fallback
// ---------------------------------------------------------------------------

function emptyWeeks(): ContributionDay[][] {
  const days: ContributionDay[] = [];
  const end = new Date();
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 364 - start.getUTCDay());
  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    days.push({ date: d.toISOString().slice(0, 10), count: 0, level: 0 });
  }
  return toWeeks(days);
}

export async function getGithubData(): Promise<GithubData> {
  try {
    if (TOKEN) {
      try {
        return await fetchViaGraphQL();
      } catch (err) {
        console.warn("[github] GraphQL failed, falling back to REST:", err);
      }
    }
    return await fetchViaREST();
  } catch (err) {
    console.warn("[github] Could not load GitHub data:", err);
    return {
      username: USERNAME,
      profileUrl: `https://github.com/${USERNAME}`,
      name: null,
      avatarUrl: null,
      followers: null,
      publicRepos: null,
      totalContributions: null,
      weeks: emptyWeeks(),
      repos: [],
      repoLabel: "Recently Active",
      live: false,
    };
  }
}
