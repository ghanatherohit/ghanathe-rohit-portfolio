import { NextResponse } from "next/server";

const GITHUB_USERNAME = "ghanatherohit";

// Cache for 1 hour at the CDN / ISR layer
export const revalidate = 3600;

interface GitHubRepo {
  fork: boolean;
  html_url: string;
  name: string;
  description: string | null;
  homepage: string | null;
  topics: string[];
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
}

function makeHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export async function GET() {
  try {
    const headers = makeHeaders();

    const reposRes = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=pushed`,
      { headers, next: { revalidate: 3600 } }
    );

    if (!reposRes.ok) {
    if (reposRes.status === 403 || reposRes.status === 429) {
        return NextResponse.json(
          { error: "GitHub API rate limit exceeded. Add a GITHUB_TOKEN env variable to fix this." },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { error: `GitHub API error: ${reposRes.status}` },
        { status: reposRes.status }
      );
    }

    const repos: GitHubRepo[] = await reposRes.json();
    const nonForked = repos
      .filter((repo) => !repo.fork)
      .sort(
        (a, b) =>
          new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
      );

    // Fetch all languages in parallel (server-side, uses shared IP pool + auth)
    const languagesMap = await Promise.all(
      nonForked.map(async (repo) => {
        try {
          const langRes = await fetch(
            `https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/languages`,
            { headers, next: { revalidate: 3600 } }
          );
          if (langRes.ok) {
            const langs: Record<string, number> = await langRes.json();
            return Object.keys(langs);
          }
        } catch {
          // ignore per-repo failures
        }
        return repo.language ? [repo.language] : [];
      })
    );

    const projects = nonForked.map((repo, index) => {
      const repoLanguages = languagesMap[index];
      const topicSet = new Set((repo.topics || []).map((t) => t.toLowerCase()));
      const allTags = [...(repo.topics || [])];
      for (const lang of repoLanguages) {
        if (!topicSet.has(lang.toLowerCase())) {
          allTags.push(lang);
        }
      }

      return {
        name: repo.name,
        description: repo.description,
        homepage: repo.homepage,
        html_url: repo.html_url,
        topics: repo.topics || [],
        language: repo.language,
        tags: allTags.length ? allTags : (repo.language ? [repo.language] : []),
        stargazers_count: repo.stargazers_count,
        pushed_at: repo.pushed_at,
      };
    });

    return NextResponse.json(
      { projects },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch GitHub data" },
      { status: 500 }
    );
  }
}
