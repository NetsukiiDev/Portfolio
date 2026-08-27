import type { GithubStatKey } from "@/types/settings";

export type GithubStats = Record<GithubStatKey, number>;

interface GithubUser {
  public_repos: number;
  followers: number;
  created_at: string;
}

interface GithubRepo {
  stargazers_count: number;
  fork: boolean;
}

/** Accepts a full profile URL or a bare handle, since Settings → Social stores a URL. */
export function parseGithubUsername(value: string | null): string | null {
  if (!value) return null;
  const trimmed = value.trim().replace(/\/+$/, "");
  if (!trimmed) return null;
  const fromUrl = trimmed.match(/github\.com\/([^/?#]+)/i);
  const handle = fromUrl ? fromUrl[1] : trimmed.replace(/^@/, "");
  return /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(handle) ? handle : null;
}

// The unauthenticated GitHub API allows 60 requests an hour per IP, and this
// site renders dynamically on every request — so results are held in memory
// rather than refetched per page view. A stale-on-error fallback keeps the
// numbers on screen if GitHub is briefly unreachable.
const TTL_MS = 60 * 60 * 1000;
const cache = new Map<string, { at: number; stats: GithubStats }>();

async function githubJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/vnd.github+json", "User-Agent": "portfolio-site" },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    return res.ok ? ((await res.json()) as T) : null;
  } catch (error) {
    // Surfaced rather than swallowed: a silent null here is indistinguishable
    // from "no GitHub profile configured", and the usual causes (rate limit,
    // TLS interception on the host) are worth seeing in the logs.
    console.warn("[github] request failed:", url, error);
    return null;
  }
}

async function countStars(username: string): Promise<number> {
  let stars = 0;
  // Bounded pagination: enough for 300 repos without hammering the API.
  for (let page = 1; page <= 3; page++) {
    const repos = await githubJson<GithubRepo[]>(
      `https://api.github.com/users/${username}/repos?per_page=100&page=${page}&type=owner`,
    );
    if (!repos?.length) break;
    stars += repos.reduce((sum, repo) => (repo.fork ? sum : sum + repo.stargazers_count), 0);
    if (repos.length < 100) break;
  }
  return stars;
}

/** Returns null when there's no usable username or GitHub can't be reached at all. */
export async function getGithubStats(username: string | null): Promise<GithubStats | null> {
  if (!username) return null;

  const hit = cache.get(username);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.stats;

  const user = await githubJson<GithubUser>(`https://api.github.com/users/${username}`);
  if (!user) return hit?.stats ?? null;

  const stats: GithubStats = {
    repos: user.public_repos,
    followers: user.followers,
    stars: await countStars(username),
    years: Math.max(0, new Date().getFullYear() - new Date(user.created_at).getFullYear()),
  };

  cache.set(username, { at: Date.now(), stats });
  return stats;
}
